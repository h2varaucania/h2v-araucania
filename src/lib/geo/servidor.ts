// Helpers de servidor para el mapa y las descargas (docs/PLAN_MAPA_KMZ.md §4.5).
// Cargan proyectos, resuelven la geometría de su capa y traen etapas/textos del CMS
// con fallback a los defaults (fuente única). Solo se usan en route handlers y en el
// server component de la página; nunca en el cliente.

import type { Payload } from 'payload';
import { etapas as etapasDefault, textosKml as textosKmlDefault } from '@/content/defaults/proyectos';
import type { Etapa, Feature, FeatureCollection, Geometria, ProyectoKml, TextosKml } from './tipos';

/** Combina las geometrías de una capa en una sola (GeometryCollection si hay varias). */
export function geometriaDeCapa(geojson: unknown): Geometria | null {
  const fc = geojson as FeatureCollection | null;
  const geoms = (fc?.features || []).map((f: Feature) => f.geometry).filter((g): g is Geometria => !!g);
  if (geoms.length === 0) return null;
  if (geoms.length === 1) return geoms[0];
  return { type: 'GeometryCollection', geometries: geoms };
}

/** Etapas desde el global (fallback a defaults). */
export async function cargarEtapas(payload: Payload): Promise<Etapa[]> {
  try {
    const g = await payload.findGlobal({ slug: 'pagina-proyectos' });
    const arr = (g as { etapas?: Array<{ valor?: string; etiqueta?: string; color?: string }> })?.etapas;
    if (arr && arr.length) {
      return arr
        .filter((e) => e.valor && e.etiqueta && e.color)
        .map((e) => ({ valor: e.valor!, etiqueta: e.etiqueta!, color: e.color! }));
    }
  } catch {
    // usa defaults
  }
  return etapasDefault;
}

/** Textos del KML desde el global (fallback a defaults, campo por campo). */
export async function cargarTextosKml(payload: Payload): Promise<TextosKml> {
  try {
    const g = await payload.findGlobal({ slug: 'pagina-proyectos' });
    const t = (g as { textosKml?: Partial<TextosKml> })?.textosKml;
    if (t) return { ...textosKmlDefault, ...limpiar(t) };
  } catch {
    // usa defaults
  }
  return textosKmlDefault;
}

function limpiar<T extends object>(o: T): Partial<T> {
  const out: Partial<T> = {};
  for (const [k, v] of Object.entries(o)) {
    if (typeof v === 'string' && v.trim()) (out as Record<string, unknown>)[k] = v;
  }
  return out;
}

type ProyectoDoc = {
  id: number | string;
  nombre: string;
  empresa?: string | null;
  etapa: string;
  region?: string | null;
  capacidadMW?: number | null;
  produccionTonAnio?: number | null;
  url?: string | null;
  coordenadas?: { lat?: number | null; lng?: number | null } | null;
  capa?: number | string | { id: number | string } | null;
  mostrarMarcador?: boolean | null;
};

/** Carga proyectos listos para KML, resolviendo la geometría de cada capa. */
export async function cargarProyectosParaKmz(payload: Payload, id?: string | number): Promise<ProyectoKml[]> {
  const docs: ProyectoDoc[] = id
    ? [await payload.findByID({ collection: 'proyectos', id, depth: 0 }) as ProyectoDoc]
    : (await payload.find({ collection: 'proyectos', limit: 1000, depth: 0 })).docs as ProyectoDoc[];

  const salida: ProyectoKml[] = [];
  for (const p of docs) {
    if (!p?.coordenadas || typeof p.coordenadas.lat !== 'number' || typeof p.coordenadas.lng !== 'number') continue;
    let geometria: Geometria | null = null;
    const capaId = p.capa && typeof p.capa === 'object' ? p.capa.id : p.capa;
    if (capaId) {
      try {
        const capa = await payload.findByID({ collection: 'capas-geo', id: capaId, depth: 0 });
        geometria = geometriaDeCapa((capa as { geojson?: unknown }).geojson);
      } catch {
        geometria = null;
      }
    }
    salida.push({
      id: String(p.id),
      nombre: p.nombre,
      empresa: p.empresa ?? undefined,
      etapa: p.etapa,
      region: p.region ?? undefined,
      capacidadMW: p.capacidadMW ?? undefined,
      produccionTonAnio: p.produccionTonAnio ?? undefined,
      url: p.url ?? undefined,
      punto: { lat: p.coordenadas.lat, lng: p.coordenadas.lng },
      geometria,
      mostrarMarcador: p.mostrarMarcador ?? true,
    });
  }
  return salida;
}
