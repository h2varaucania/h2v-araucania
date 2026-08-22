// Saneo de las propiedades del archivo subido (docs/PLAN_MAPA_KMZ.md §4.2 paso 7).
// El KML/KMZ es de terceros: su name/description no los escribió nadie de este
// proyecto. togeojson NO sanea; Leaflet bindPopup inyecta HTML sin escapar. Por eso
// aquí quedamos con una lista blanca de propiedades y TODO como texto plano acotado,
// antes de persistir el GeoJSON. Nada del archivo llega como HTML al popup ni al KML.

import type { Feature, FeatureCollection } from './tipos';

const MAX_TEXTO = 500;

// Claves que togeojson inyecta por estilo/interno: se descartan (no son datos).
const CLAVES_ESTILO = new Set([
  'stroke', 'stroke-opacity', 'stroke-width',
  'fill', 'fill-opacity',
  'icon', 'icon-opacity', 'icon-color', 'icon-scale', 'icon-offset', 'icon-offset-units',
  'styleUrl', 'styleHash', 'styleMapHash', 'visibility',
  'tessellate', 'extrude', 'altitudeMode',
  'timespan', 'timestamp', 'gx_media_links',
]);

/**
 * Normaliza el campo `description` de togeojson, que puede venir como string o
 * como { '@type': 'html', value } (verificado en togeojson 7.1.2), a TEXTO PLANO.
 */
export function normalizarDescripcion(d: unknown): string {
  if (d == null) return '';
  if (typeof d === 'string') return aTextoPlano(d);
  if (typeof d === 'object' && d !== null && 'value' in d) {
    const v = (d as { value?: unknown }).value;
    return typeof v === 'string' ? aTextoPlano(v) : '';
  }
  return aTextoPlano(String(d));
}

/** Quita etiquetas HTML, decodifica entidades básicas, colapsa espacios y acota. */
export function aTextoPlano(html: string): string {
  const sinTags = html
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ');
  const decodificado = sinTags
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'");
  const limpio = decodificado.replace(/\s+/g, ' ').trim();
  return limpio.length > MAX_TEXTO ? limpio.slice(0, MAX_TEXTO - 1).trimEnd() + '…' : limpio;
}

/** Devuelve las propiedades saneadas: solo datos, todo texto plano. */
export function saneaPropiedades(props: Record<string, unknown>): Record<string, string> {
  const out: Record<string, string> = {};
  if (typeof props.name === 'string') out.name = aTextoPlano(props.name);
  const desc = normalizarDescripcion(props.description);
  if (desc) out.description = desc;
  for (const [k, v] of Object.entries(props)) {
    if (k === 'name' || k === 'description') continue;
    if (CLAVES_ESTILO.has(k)) continue;
    if (v == null) continue;
    if (typeof v === 'object') continue; // ignorar estructuras (no son atributos simples)
    out[k] = aTextoPlano(String(v));
  }
  return out;
}

/** Sanea toda la colección: descarta geometrías nulas y limpia propiedades. */
export function saneaFeatures(fc: FeatureCollection): { features: Feature[]; descartadasSinGeom: number } {
  let descartadasSinGeom = 0;
  const features: Feature[] = [];
  for (const f of fc.features) {
    if (!f.geometry) { descartadasSinGeom++; continue; }
    features.push({ type: 'Feature', geometry: f.geometry, properties: saneaPropiedades(f.properties || {}) });
  }
  return { features, descartadasSinGeom };
}
