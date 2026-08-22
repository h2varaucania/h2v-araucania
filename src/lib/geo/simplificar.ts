// Simplificación de geometrías con presupuesto de vértices (docs/PLAN_MAPA_KMZ.md §4.2 paso 8).
// La página es de DIFUSIÓN, no un servidor SIG: una capa no puede ser pesada.
// Douglas-Peucker propio (sin dependencia), coordenadas a 6 decimales, y subimos
// la tolerancia hasta cumplir el tope de vértices.

import type { Feature, Geometria, Posicion } from './tipos';

const DECIMALES = 6;

function redondea(p: Posicion): Posicion {
  const f = 10 ** DECIMALES;
  return [Math.round(p[0] * f) / f, Math.round(p[1] * f) / f];
}

/** Distancia perpendicular de `p` al segmento a-b (en grados, suficiente para DP). */
function distPerp(p: Posicion, a: Posicion, b: Posicion): number {
  const [x, y] = p, [x1, y1] = a, [x2, y2] = b;
  const dx = x2 - x1, dy = y2 - y1;
  if (dx === 0 && dy === 0) return Math.hypot(x - x1, y - y1);
  const t = ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy);
  const tc = Math.max(0, Math.min(1, t));
  return Math.hypot(x - (x1 + tc * dx), y - (y1 + tc * dy));
}

/** Douglas-Peucker sobre una polilínea. */
function dp(puntos: Posicion[], tol: number): Posicion[] {
  if (puntos.length <= 2) return puntos;
  let maxD = 0, idx = 0;
  for (let i = 1; i < puntos.length - 1; i++) {
    const d = distPerp(puntos[i], puntos[0], puntos[puntos.length - 1]);
    if (d > maxD) { maxD = d; idx = i; }
  }
  if (maxD > tol) {
    const izq = dp(puntos.slice(0, idx + 1), tol);
    const der = dp(puntos.slice(idx), tol);
    return izq.slice(0, -1).concat(der);
  }
  return [puntos[0], puntos[puntos.length - 1]];
}

/** Simplifica un anillo cerrado preservando el cierre (primer = último vértice). */
function simplificaAnillo(anillo: Posicion[], tol: number): Posicion[] {
  if (anillo.length <= 4) return anillo;
  const cerrado = anillo[0][0] === anillo[anillo.length - 1][0] && anillo[0][1] === anillo[anillo.length - 1][1];
  const s = dp(anillo, tol);
  if (cerrado && (s[0][0] !== s[s.length - 1][0] || s[0][1] !== s[s.length - 1][1])) s.push(s[0]);
  return s.length >= 4 ? s : anillo; // un polígono necesita ≥4 puntos
}

function aplica(geom: Geometria, tol: number): Geometria {
  switch (geom.type) {
    case 'Point': return { type: 'Point', coordinates: redondea(geom.coordinates) };
    case 'MultiPoint': return { type: 'MultiPoint', coordinates: geom.coordinates.map(redondea) };
    case 'LineString': return { type: 'LineString', coordinates: (tol > 0 ? dp(geom.coordinates, tol) : geom.coordinates).map(redondea) };
    case 'MultiLineString': return { type: 'MultiLineString', coordinates: geom.coordinates.map((l) => (tol > 0 ? dp(l, tol) : l).map(redondea)) };
    case 'Polygon': return { type: 'Polygon', coordinates: geom.coordinates.map((r) => (tol > 0 ? simplificaAnillo(r, tol) : r).map(redondea)) };
    case 'MultiPolygon': return { type: 'MultiPolygon', coordinates: geom.coordinates.map((p) => p.map((r) => (tol > 0 ? simplificaAnillo(r, tol) : r).map(redondea))) };
    case 'GeometryCollection': return { type: 'GeometryCollection', geometries: geom.geometries.map((g) => aplica(g, tol)) };
  }
}

export function contarVertices(geom: Geometria | null): number {
  if (!geom) return 0;
  switch (geom.type) {
    case 'Point': return 1;
    case 'MultiPoint':
    case 'LineString': return geom.coordinates.length;
    case 'MultiLineString':
    case 'Polygon': return geom.coordinates.reduce((n, a) => n + a.length, 0);
    case 'MultiPolygon': return geom.coordinates.reduce((n, p) => n + p.reduce((m, a) => m + a.length, 0), 0);
    case 'GeometryCollection': return geom.geometries.reduce((n, g) => n + contarVertices(g), 0);
  }
}

/**
 * Simplifica todas las features hasta cumplir `maxVertices` (subiendo la tolerancia
 * geométricamente). Siempre redondea a 6 decimales aunque no haga falta simplificar.
 * Devuelve las features nuevas y el conteo final de vértices.
 */
export function simplificaFeatures(features: Feature[], maxVertices: number): { features: Feature[]; nVertices: number; simplificado: boolean } {
  let tol = 0;
  let salida = features.map((f) => ({ ...f, geometry: f.geometry ? aplica(f.geometry, 0) : null }));
  let total = salida.reduce((n, f) => n + contarVertices(f.geometry), 0);
  if (total <= maxVertices) return { features: salida, nVertices: total, simplificado: false };

  tol = 0.00001; // ~1 m
  for (let i = 0; i < 20 && total > maxVertices; i++) {
    salida = features.map((f) => ({ ...f, geometry: f.geometry ? aplica(f.geometry, tol) : null }));
    total = salida.reduce((n, f) => n + contarVertices(f.geometry), 0);
    tol *= 1.8;
  }
  return { features: salida, nVertices: total, simplificado: true };
}
