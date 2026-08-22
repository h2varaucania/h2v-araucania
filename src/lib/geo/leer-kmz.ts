// Ingestión de un KMZ/KML → GeoJSON saneado y liviano (docs/PLAN_MAPA_KMZ.md §4.2).
// Todo ocurre EN EL SERVIDOR, una sola vez, al subir el archivo. El navegador nunca
// descomprime ni parsea. Toda excepción sale como ErrorIngesta con mensaje en español.

import { unzipSync } from 'fflate';
import { kml as kmlToGeoJson } from '@tmcw/togeojson';
import { DOMParser } from '@xmldom/xmldom';
import { decodificarXml } from './decodificar';
import { saneaFeatures } from './sanear';
import { simplificaFeatures, contarVertices } from './simplificar';
import { ErrorIngesta } from './mensajes';
import type { BBox, Feature, FeatureCollection, Geometria, Posicion, ResultadoIngesta } from './tipos';

// Límites (la página es de difusión, no un servidor SIG).
const MAX_ENTRADA_DESCOMPRIMIDA = 10 * 1024 * 1024; // 10 MB por entrada del ZIP
const MAX_TOTAL_DESCOMPRIMIDO = 10 * 1024 * 1024;
const MAX_KML_PLANO = 10 * 1024 * 1024;
const MAX_FEATURES = 5000;

export interface OpcionesIngesta {
  /** Tope de vértices tras simplificar (proyecto ≈ 2000, referencia ≈ 8000). */
  maxVertices?: number;
}

export function ingerirKmz(buf: Uint8Array, opts: OpcionesIngesta = {}): ResultadoIngesta {
  const maxVertices = opts.maxVertices ?? 2000;
  const resumen: string[] = [];

  // 1) Obtener el texto del KML (desde ZIP o plano).
  const esZip = buf.length >= 2 && buf[0] === 0x50 && buf[1] === 0x4b; // "PK"
  let bytesKml: Uint8Array;
  if (esZip) {
    bytesKml = extraerKmlDelZip(buf);
  } else {
    if (buf.length > MAX_KML_PLANO) throw new ErrorIngesta('zipEntradaEnorme');
    bytesKml = buf;
  }

  // 2) Decodificar por sniff de bytes (nunca por el prólogo).
  const { texto, encodingUsado, reescrito } = decodificarXml(bytesKml);
  if (reescrito) resumen.push(`Codificación corregida a UTF-8 (venía como ${encodingUsado}).`);

  // 3) Parsear con xmldom (NO el DOMParser global: en serverless no existe y jsdom
  //    parsea distinto). Un XML mal formado debe fallar con mensaje claro.
  let errorXml = false;
  const doc = new DOMParser({
    onError: (level: string) => { if (level === 'error' || level === 'fatalError') errorXml = true; },
  }).parseFromString(texto, 'text/xml');
  if (errorXml || !doc || !doc.documentElement) throw new ErrorIngesta('xmlInvalido');

  // 4) togeojson, descartando geometrías nulas ya en el origen.
  let fc: FeatureCollection;
  try {
    fc = kmlToGeoJson(doc as unknown as Document, { skipNullGeometry: true }) as unknown as FeatureCollection;
  } catch {
    throw new ErrorIngesta('xmlInvalido');
  }

  // 5) Detectar el caso "solo NetworkLink" para un mensaje específico.
  if (fc.features.length === 0) {
    const tieneNetworkLink = /<NetworkLink\b/i.test(texto);
    throw new ErrorIngesta(tieneNetworkLink ? 'soloNetworkLink' : 'sinGeometria');
  }
  if (fc.features.length > MAX_FEATURES) throw new ErrorIngesta('demasiadasFeatures');

  // 6) Sanear propiedades (lista blanca + texto plano) y descartar geometrías nulas.
  const { features, descartadasSinGeom } = saneaFeatures(fc);
  if (descartadasSinGeom > 0) resumen.push(`Se ignoraron ${descartadasSinGeom} marcador(es) sin geometría.`);
  if (features.length === 0) throw new ErrorIngesta('sinGeometria');

  // 7) Validar rango WGS84 (aviso si sale de Chile; error si es imposible).
  validarCoordenadas(features, resumen);

  // 8) Simplificar y presupuestar.
  const antes = features.reduce((n, f) => n + contarVertices(f.geometry), 0);
  const { features: simplificadas, nVertices, simplificado } = simplificaFeatures(features, maxVertices);
  if (simplificado) resumen.push(`Geometría simplificada de ${antes} a ${nVertices} vértices para aligerar la página.`);

  // 9) Metadatos derivados.
  const bbox = calcularBBox(simplificadas);
  const centroide = { lng: (bbox[0] + bbox[2]) / 2, lat: (bbox[1] + bbox[3]) / 2 };
  const tiposGeometria = [...new Set(simplificadas.map((f) => f.geometry!.type))];

  return {
    geojson: { type: 'FeatureCollection', features: simplificadas },
    bbox,
    centroide,
    nFeatures: simplificadas.length,
    nVertices,
    tiposGeometria,
    resumen,
  };
}

function extraerKmlDelZip(buf: Uint8Array): Uint8Array {
  let totalDeclarado = 0;
  let rutaInvalida = false;
  let entradaEnorme = false;
  let archivos: Record<string, Uint8Array>;
  try {
    archivos = unzipSync(buf, {
      filter: (file) => {
        // El filter ve `originalSize` (tamaño descomprimido DECLARADO en el header)
        // ANTES de inflar: aquí paramos zip-bombs sin reservar memoria. Verificado
        // contra tests/fixtures/geo/zipbomb_declarada.kmz (120 B declara 500 MB).
        if (file.name.includes('..') || file.name.startsWith('/')) { rutaInvalida = true; return false; }
        if (!/\.kml$/i.test(file.name)) return false; // solo KML; los íconos se ignoran
        if (file.originalSize > MAX_ENTRADA_DESCOMPRIMIDA) { entradaEnorme = true; return false; }
        totalDeclarado += file.originalSize;
        if (totalDeclarado > MAX_TOTAL_DESCOMPRIMIDO) { entradaEnorme = true; return false; }
        return true;
      },
    });
  } catch {
    // fflate puede lanzar si una entrada NO seleccionada tiene CRC inválido (caso SEA:
    // imgs/dia_4.png). Reintentar tolerando: leer solo el/los KML por nombre.
    archivos = {};
  }
  if (rutaInvalida) throw new ErrorIngesta('zipRutaInvalida');
  if (entradaEnorme) throw new ErrorIngesta('zipEntradaEnorme');

  let nombreKml = Object.keys(archivos).find((n) => n.toLowerCase() === 'doc.kml')
    || Object.keys(archivos).find((n) => /\.kml$/i.test(n));

  if (!nombreKml) {
    // Segundo intento tolerante a CRC de entradas no-KML (caso SEA).
    try {
      const todos = unzipSync(buf);
      nombreKml = Object.keys(todos).find((n) => n.toLowerCase() === 'doc.kml')
        || Object.keys(todos).find((n) => /\.kml$/i.test(n));
      if (nombreKml) {
        if (todos[nombreKml].length > MAX_ENTRADA_DESCOMPRIMIDA) throw new ErrorIngesta('zipEntradaEnorme');
        return todos[nombreKml];
      }
    } catch (e) {
      if (e instanceof ErrorIngesta) throw e;
      // sigue al error de "sin kml"
    }
    throw new ErrorIngesta('zipSinKml');
  }
  return archivos[nombreKml];
}

function validarCoordenadas(features: Feature[], resumen: string[]): void {
  let fuera = false;
  let fueraDeChile = false;
  const recorre = (g: Geometria): void => {
    const chequear = (p: Posicion) => {
      const [lng, lat] = p;
      if (lng < -180 || lng > 180 || lat < -90 || lat > 90) fuera = true;
      else if (lng < -76 || lng > -66 || lat < -56 || lat > -17) fueraDeChile = true;
    };
    switch (g.type) {
      case 'Point': chequear(g.coordinates); break;
      case 'MultiPoint': case 'LineString': g.coordinates.forEach(chequear); break;
      case 'MultiLineString': case 'Polygon': g.coordinates.forEach((a) => a.forEach(chequear)); break;
      case 'MultiPolygon': g.coordinates.forEach((p) => p.forEach((a) => a.forEach(chequear))); break;
      case 'GeometryCollection': g.geometries.forEach(recorre); break;
    }
  };
  features.forEach((f) => f.geometry && recorre(f.geometry));
  if (fuera) throw new ErrorIngesta('fueraDeRango');
  if (fueraDeChile) resumen.push('Atención: hay coordenadas fuera de Chile; verifica la ubicación.');
}

function calcularBBox(features: Feature[]): BBox {
  let minLng = Infinity, minLat = Infinity, maxLng = -Infinity, maxLat = -Infinity;
  const acum = (p: Posicion) => {
    minLng = Math.min(minLng, p[0]); maxLng = Math.max(maxLng, p[0]);
    minLat = Math.min(minLat, p[1]); maxLat = Math.max(maxLat, p[1]);
  };
  const recorre = (g: Geometria): void => {
    switch (g.type) {
      case 'Point': acum(g.coordinates); break;
      case 'MultiPoint': case 'LineString': g.coordinates.forEach(acum); break;
      case 'MultiLineString': case 'Polygon': g.coordinates.forEach((a) => a.forEach(acum)); break;
      case 'MultiPolygon': g.coordinates.forEach((p) => p.forEach((a) => a.forEach(acum))); break;
      case 'GeometryCollection': g.geometries.forEach(recorre); break;
    }
  };
  features.forEach((f) => f.geometry && recorre(f.geometry));
  return [minLng, minLat, maxLng, maxLat];
}
