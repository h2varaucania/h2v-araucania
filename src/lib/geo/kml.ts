// Generador de KML compatible con Google Earth (docs/PLAN_MAPA_KMZ.md §4.5-4.6).
// Corrige de raíz los defectos del KMZ del SEA: UTF-8 real y declarado, xmlns 2.2,
// color aabbggrr, CDATA con ']]>' particionado, enlaces absolutos, LookAt, Folder por
// etapa, StyleMap normal/highlight y BalloonStyle.

import type { BBox, Etapa, Geometria, Posicion, ProyectoKml, TextosKml } from './tipos';
import { enlaceSeguro, urlAbsoluta } from './enlace';

/** #rrggbb (+ alfa 0..1) → aabbggrr (orden y bytes que usa KML). */
export function kmlColor(hex: string, alfa = 1): string {
  const m = /^#?([0-9a-fA-F]{6})$/.exec(hex.trim());
  const rgb = m ? m[1].toLowerCase() : '888888';
  const rr = rgb.slice(0, 2), gg = rgb.slice(2, 4), bb = rgb.slice(4, 6);
  const aa = Math.max(0, Math.min(255, Math.round(alfa * 255))).toString(16).padStart(2, '0');
  return `${aa}${bb}${gg}${rr}`;
}

/** Escapa texto para nodos XML (fuera de CDATA). */
export function escapeXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

/** Quita caracteres de control no válidos en XML 1.0. */
function quitarControl(s: string): string {
  return s.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '');
}

/** Envuelve HTML en CDATA, particionando ']]>' para que no cierre la sección antes de tiempo. */
export function cdata(s: string): string {
  const seguro = quitarControl(s).replace(/]]>/g, ']]]]><![CDATA[>');
  return `<![CDATA[${seguro}]]>`;
}

function coord(p: Posicion): string {
  // lon,lat sin altitud, punto decimal (Google Earth exige la tupla sin espacios).
  return `${p[0]},${p[1]}`;
}
function coords(ps: Posicion[]): string {
  return ps.map(coord).join(' ');
}

/** Mapea una geometría GeoJSON a KML. Polígonos con outer/inner; Multi* a MultiGeometry. */
function geometriaKml(g: Geometria): string {
  switch (g.type) {
    case 'Point':
      return `<Point><coordinates>${coord(g.coordinates)}</coordinates></Point>`;
    case 'MultiPoint':
      return `<MultiGeometry>${g.coordinates.map((p) => `<Point><coordinates>${coord(p)}</coordinates></Point>`).join('')}</MultiGeometry>`;
    case 'LineString':
      return `<LineString><tessellate>1</tessellate><altitudeMode>clampToGround</altitudeMode><coordinates>${coords(g.coordinates)}</coordinates></LineString>`;
    case 'MultiLineString':
      return `<MultiGeometry>${g.coordinates.map((l) => `<LineString><tessellate>1</tessellate><altitudeMode>clampToGround</altitudeMode><coordinates>${coords(l)}</coordinates></LineString>`).join('')}</MultiGeometry>`;
    case 'Polygon':
      return poligonoKml(g.coordinates);
    case 'MultiPolygon':
      return `<MultiGeometry>${g.coordinates.map(poligonoKml).join('')}</MultiGeometry>`;
    case 'GeometryCollection':
      return `<MultiGeometry>${g.geometries.map(geometriaKml).join('')}</MultiGeometry>`;
  }
}

function poligonoKml(anillos: Posicion[][]): string {
  const outer = `<outerBoundaryIs><LinearRing><coordinates>${coords(anillos[0] || [])}</coordinates></LinearRing></outerBoundaryIs>`;
  const inner = anillos.slice(1).map((r) => `<innerBoundaryIs><LinearRing><coordinates>${coords(r)}</coordinates></LinearRing></innerBoundaryIs>`).join('');
  return `<Polygon><tessellate>1</tessellate><altitudeMode>clampToGround</altitudeMode>${outer}${inner}</Polygon>`;
}

function estiloEtapa(e: Etapa): string {
  const c = kmlColor(e.color, 0.9);
  const linea = `<LineStyle><color>${kmlColor(e.color, 1)}</color><width>2</width></LineStyle>`;
  const poly = `<PolyStyle><color>${kmlColor(e.color, 0.35)}</color></PolyStyle>`;
  const icono = (escala: string) => `<IconStyle><color>${c}</color><scale>${escala}</scale><Icon><href>files/icono-punto.png</href></Icon></IconStyle>`;
  const balloon = `<BalloonStyle><text>$[description]</text></BalloonStyle>`;
  return (
    `<Style id="etapa-${e.valor}-n">${icono('1.0')}${linea}${poly}${balloon}</Style>` +
    `<Style id="etapa-${e.valor}-h">${icono('1.2')}${linea}${poly}${balloon}</Style>` +
    `<StyleMap id="etapa-${e.valor}"><Pair><key>normal</key><styleUrl>#etapa-${e.valor}-n</styleUrl></Pair>` +
    `<Pair><key>highlight</key><styleUrl>#etapa-${e.valor}-h</styleUrl></Pair></StyleMap>`
  );
}

function balloonHtml(p: ProyectoKml, etiqueta: (e: string) => string, t: TextosKml, sitio?: string): string {
  const filas: string[] = [`<h3>${escapeHtml(p.nombre)}</h3>`];
  if (p.empresa) filas.push(`<p><b>${escapeHtml(t.etiquetaEmpresa)}:</b> ${escapeHtml(p.empresa)}</p>`);
  filas.push(`<p><b>${escapeHtml(t.etiquetaEtapa)}:</b> ${escapeHtml(etiqueta(p.etapa))}</p>`);
  if (p.region) filas.push(`<p><b>${escapeHtml(t.etiquetaRegion)}:</b> ${escapeHtml(p.region)}</p>`);
  if (p.capacidadMW) filas.push(`<p><b>${escapeHtml(t.etiquetaCapacidad)}:</b> ${p.capacidadMW} MW</p>`);
  if (p.produccionTonAnio) filas.push(`<p><b>${escapeHtml(t.etiquetaProduccion)}:</b> ${p.produccionTonAnio.toLocaleString('es-CL')} t/año</p>`);
  const sitioUrl = urlAbsoluta(`/proyectos#${p.id}`, sitio);
  filas.push(`<p><a href="${escapeHtml(sitioUrl)}">${escapeHtml(t.textoVerSitio)}</a></p>`);
  const externo = enlaceSeguro(p.url);
  if (externo) filas.push(`<p><a href="${escapeHtml(externo)}">${escapeHtml(t.textoEnlaceExterno)}</a></p>`);
  return filas.join('');
}

// escapeHtml para el contenido del balloon (va dentro de CDATA, pero escapamos igual
// los valores del CMS por defensa en profundidad).
function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export interface OpcionesKml {
  etapas: Etapa[];
  textos: TextosKml;
  /** Dominio del sitio para URLs absolutas (default: NEXT_PUBLIC_SITE_URL). */
  sitio?: string;
}

/** Genera el documento KML completo para un conjunto de proyectos. */
export function generarKml(proyectos: ProyectoKml[], opts: OpcionesKml): string {
  const { etapas, textos, sitio } = opts;
  const etiqueta = (valor: string) => etapas.find((e) => e.valor === valor)?.etiqueta || valor;

  const bbox = bboxDeProyectos(proyectos);
  const lookAt = lookAtDeBBox(bbox);

  const estilos = etapas.map(estiloEtapa).join('');

  // Un Folder por etapa (solo las que tienen proyectos), en el orden de `etapas`.
  const folders = etapas.map((e) => {
    const suyos = proyectos.filter((p) => p.etapa === e.valor);
    if (suyos.length === 0) return '';
    const marcas = suyos.map((p) => placemark(p, etiqueta, textos, sitio)).join('');
    return `<Folder><name>${escapeXml(e.etiqueta)}</name>${marcas}</Folder>`;
  }).join('');

  // Proyectos con etapa desconocida (por robustez).
  const otros = proyectos.filter((p) => !etapas.some((e) => e.valor === p.etapa));
  const folderOtros = otros.length
    ? `<Folder><name>Otros</name>${otros.map((p) => placemark(p, etiqueta, textos, sitio)).join('')}</Folder>`
    : '';

  return `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2"><Document>` +
    `<name>${escapeXml(textos.nombreDocumento)}</name>` +
    lookAt + estilos + folders + folderOtros +
    `</Document></kml>`;
}

function placemark(p: ProyectoKml, etiqueta: (e: string) => string, t: TextosKml, sitio?: string): string {
  const styleUrl = `<styleUrl>#etapa-${p.etapa}</styleUrl>`;
  const desc = `<description>${cdata(balloonHtml(p, etiqueta, t, sitio))}</description>`;
  const extended = datosExtendidos(p, etiqueta, t);
  // Geometría: si hay capa, MultiGeometry con la geometría + (opcional) el punto.
  const punto: Geometria = { type: 'Point', coordinates: [p.punto.lng, p.punto.lat] };
  let geom: string;
  if (p.geometria) {
    geom = (p.mostrarMarcador !== false)
      ? `<MultiGeometry>${geometriaKml(p.geometria)}${geometriaKml(punto)}</MultiGeometry>`
      : geometriaKml(p.geometria);
  } else {
    geom = geometriaKml(punto);
  }
  return `<Placemark><name>${escapeXml(p.nombre)}</name>${styleUrl}${desc}${extended}${geom}</Placemark>`;
}

function datosExtendidos(p: ProyectoKml, etiqueta: (e: string) => string, t: TextosKml): string {
  const datos: Array<[string, string]> = [
    [t.etiquetaEtapa, etiqueta(p.etapa)],
  ];
  if (p.empresa) datos.push([t.etiquetaEmpresa, p.empresa]);
  if (p.region) datos.push([t.etiquetaRegion, p.region]);
  if (p.capacidadMW) datos.push([t.etiquetaCapacidad, `${p.capacidadMW} MW`]);
  if (p.produccionTonAnio) datos.push([t.etiquetaProduccion, `${p.produccionTonAnio} t/año`]);
  const items = datos.map(([k, v]) => `<Data name="${escapeXml(k)}"><value>${escapeXml(v)}</value></Data>`).join('');
  return `<ExtendedData>${items}</ExtendedData>`;
}

function bboxDeProyectos(proyectos: ProyectoKml[]): BBox {
  let minLng = Infinity, minLat = Infinity, maxLng = -Infinity, maxLat = -Infinity;
  for (const p of proyectos) {
    minLng = Math.min(minLng, p.punto.lng); maxLng = Math.max(maxLng, p.punto.lng);
    minLat = Math.min(minLat, p.punto.lat); maxLat = Math.max(maxLat, p.punto.lat);
  }
  // Fallback: La Araucanía, si no hay proyectos con punto válido.
  if (!isFinite(minLng)) return [-73.5, -39.6, -71.0, -37.8];
  return [minLng, minLat, maxLng, maxLat];
}

function lookAtDeBBox(b: BBox): string {
  const lng = (b[0] + b[2]) / 2, lat = (b[1] + b[3]) / 2;
  // range aproximado según el ancho del bbox (grados → metros muy gruesos), con piso.
  const spanKm = Math.max(b[2] - b[0], b[3] - b[1]) * 111;
  const range = Math.max(20000, spanKm * 1000 * 1.5);
  return `<LookAt><longitude>${lng}</longitude><latitude>${lat}</latitude><altitude>0</altitude><heading>0</heading><tilt>0</tilt><range>${Math.round(range)}</range></LookAt>`;
}
