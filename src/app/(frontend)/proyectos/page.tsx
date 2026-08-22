import type { Metadata } from 'next';
import { getPayload } from '@/lib/payload/getPayload';
import ProyectosMapLoader from '@/components/maps/ProyectosMapLoader';
import type { CapaMeta, EtapaVista, MapaBaseVista, ProyectoMapa, TextosMapaVista } from '@/components/maps/tipos';
import type { Proyecto } from '@/payload-types';
import { features } from '@/lib/features';
import {
  etapas as etapasDefault,
  mapasBase as mapasBaseDefault,
  textosMapa as textosMapaDefault,
  proyectosDefaults,
} from '@/content/defaults/proyectos';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Mapa de Proyectos',
  description: 'Visualiza proyectos de hidrógeno verde en la región de La Araucanía y a nivel nacional.',
  openGraph: {
    title: 'Mapa de Proyectos | H2V Araucanía',
    description: 'Visualiza proyectos de hidrógeno verde en la región de La Araucanía y a nivel nacional.',
  },
};

// Extrae los metadatos de una capa relacionada SIN su geojson (que se excluye por
// defaultPopulate): la geometría se pide aparte, para no cargar la página.
function capaMeta(capa: unknown): CapaMeta | undefined {
  if (!capa || typeof capa !== 'object') return undefined;
  const c = capa as { id?: number | string; titulo?: string; color?: string; nFeatures?: number; bbox?: { minLng?: number; minLat?: number; maxLng?: number; maxLat?: number } };
  if (c.id == null) return undefined;
  const b = c.bbox;
  const bbox = b && typeof b.minLng === 'number' && typeof b.minLat === 'number' && typeof b.maxLng === 'number' && typeof b.maxLat === 'number'
    ? ([b.minLng, b.minLat, b.maxLng, b.maxLat] as [number, number, number, number])
    : undefined;
  return { id: String(c.id), titulo: c.titulo, color: c.color || undefined, nFeatures: c.nFeatures, bbox };
}

export default async function Proyectos() {
  // El flag se resuelve AQUÍ (servidor): el módulo features no se inlinea en el cliente.
  const kmzOn = features.mapaAvanzado;
  let proyectos: ProyectoMapa[] = [];
  let capasReferencia: CapaMeta[] = [];
  let etapas: EtapaVista[] = etapasDefault;
  let mapasBase: MapaBaseVista[] = mapasBaseDefault;
  let textos: TextosMapaVista = textosMapaDefault;
  const hero: { titulo: string; subtitulo: string } = {
    titulo: proyectosDefaults.heroTitulo,
    subtitulo: proyectosDefaults.heroSubtitulo,
  };

  try {
    const payload = await getPayload();
    const data = await payload.findGlobal({ slug: 'pagina-proyectos' });
    if (data?.hero?.titulo) hero.titulo = data.hero.titulo;
    if (data?.hero?.subtitulo) hero.subtitulo = data.hero.subtitulo;
    const g = data as unknown as { etapas?: EtapaVista[]; mapasBase?: MapaBaseVista[]; textosMapa?: Partial<TextosMapaVista> };
    if (g.etapas?.length) etapas = g.etapas.filter((e) => e.valor && e.etiqueta && e.color);
    if (g.mapasBase?.length) mapasBase = g.mapasBase;
    if (g.textosMapa) textos = { ...textosMapaDefault, ...g.textosMapa };

    // Proyectos: depth 1 pobla la capa con sus metadatos (defaultPopulate excluye geojson).
    const { docs } = await payload.find({ collection: 'proyectos', limit: 100, depth: 1 });
    proyectos = docs.map((p: Proyecto) => {
      const imagenDoc = p.imagen && typeof p.imagen === 'object' ? p.imagen : null;
      return {
        id: String(p.id),
        nombre: p.nombre,
        descripcion: p.descripcion,
        empresa: p.empresa,
        etapa: p.etapa,
        region: p.region,
        coordenadas: p.coordenadas,
        capacidadMW: p.capacidadMW ?? undefined,
        produccionTonAnio: p.produccionTonAnio ?? undefined,
        imagen: imagenDoc?.url ? { url: imagenDoc.url, alt: imagenDoc.alt ?? undefined } : undefined,
        url: p.url ?? undefined,
        capa: capaMeta((p as unknown as { capa?: unknown }).capa),
        mostrarMarcador: (p as unknown as { mostrarMarcador?: boolean }).mostrarMarcador ?? true,
      };
    });

    // Capas de referencia (contexto): metadatos, apagadas por defecto. Solo si el flag
    // KMZ está activo (si no, no se dibujan capas y no hace falta la consulta).
    if (kmzOn) {
      const ref = await payload.find({ collection: 'capas-geo', where: { tipo: { equals: 'referencia' } }, limit: 50, depth: 0 });
      capasReferencia = ref.docs.map((c) => capaMeta(c)).filter((c): c is CapaMeta => !!c);
    }
  } catch {
    // DB no disponible — mapa vacío.
  }

  return (
    <div>
      <section className="bg-h2v-blue text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-semibold mb-4">{hero.titulo}</h1>
          <p className="text-lg opacity-80">{hero.subtitulo}</p>
        </div>
      </section>

      <ProyectosMapLoader
        proyectos={proyectos}
        capasReferencia={capasReferencia}
        etapas={etapas}
        mapasBase={mapasBase}
        textos={textos}
        kmzOn={kmzOn}
      />
    </div>
  );
}
