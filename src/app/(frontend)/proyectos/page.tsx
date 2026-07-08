import type { Metadata } from 'next';
import { getPayload } from '@/lib/payload/getPayload';
import ProyectosMapLoader from '@/components/maps/ProyectosMapLoader';
import type { Proyecto } from '@/payload-types';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Mapa de Proyectos',
  description: 'Visualiza proyectos de hidrógeno verde en la región de La Araucanía y a nivel nacional.',
  openGraph: {
    title: 'Mapa de Proyectos | H2V Araucanía',
    description: 'Visualiza proyectos de hidrógeno verde en la región de La Araucanía y a nivel nacional.',
  },
};

type ProyectoMapa = {
  id: string;
  nombre: string;
  descripcion: string;
  empresa: string;
  etapa: string;
  region: string;
  coordenadas: { lat: number; lng: number };
  capacidadMW?: number;
  produccionTonAnio?: number;
  imagen?: { url: string; alt?: string };
  url?: string;
};

export default async function Proyectos() {
  let proyectos: ProyectoMapa[] = [];
  // Defaults de respaldo; el CMS (global "Mapa de Proyectos") los sobreescribe.
  const hero = {
    titulo: 'Mapa de Proyectos',
    subtitulo: 'Proyectos de hidrógeno verde en desarrollo y ejecución a nivel regional y nacional.',
  };

  try {
    const payload = await getPayload();
    const data = await payload.findGlobal({ slug: 'pagina-proyectos' });
    if (data?.hero?.titulo) hero.titulo = data.hero.titulo;
    if (data?.hero?.subtitulo) hero.subtitulo = data.hero.subtitulo;
    const { docs } = await payload.find({
      collection: 'proyectos',
      limit: 100,
    });

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
      };
    });
  } catch {
    // DB unavailable — render empty map
  }

  return (
    <div>
      <section className="bg-h2v-blue text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-semibold mb-4">{hero.titulo}</h1>
          <p className="text-lg opacity-80">{hero.subtitulo}</p>
        </div>
      </section>

      <ProyectosMapLoader proyectos={proyectos} />
    </div>
  );
}
