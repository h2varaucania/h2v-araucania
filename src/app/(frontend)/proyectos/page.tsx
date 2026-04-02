import type { Metadata } from 'next';
import { getPayload } from '@/lib/payload/getPayload';
import ProyectosMapLoader from '@/components/maps/ProyectosMapLoader';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Mapa de Proyectos',
  description: 'Visualiza proyectos de hidrógeno verde en la región de La Araucanía y a nivel nacional.',
  openGraph: {
    title: 'Mapa de Proyectos | H2V Araucanía',
    description: 'Visualiza proyectos de hidrógeno verde en la región de La Araucanía y a nivel nacional.',
  },
};

export default async function Proyectos() {
  const payload = await getPayload();
  const { docs } = await payload.find({
    collection: 'proyectos',
    limit: 100,
  });

  const proyectos = docs.map((p: any) => ({
    id: String(p.id),
    nombre: p.nombre,
    descripcion: p.descripcion,
    empresa: p.empresa,
    etapa: p.etapa,
    region: p.region,
    coordenadas: p.coordenadas,
    capacidadMW: p.capacidadMW,
    produccionTonAnio: p.produccionTonAnio,
  }));

  return (
    <div>
      <section className="bg-h2v-blue text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Mapa de Proyectos</h1>
          <p className="text-lg opacity-80">
            Proyectos de hidrógeno verde en desarrollo y ejecución a nivel regional y nacional.
          </p>
        </div>
      </section>

      <ProyectosMapLoader proyectos={proyectos} />
    </div>
  );
}
