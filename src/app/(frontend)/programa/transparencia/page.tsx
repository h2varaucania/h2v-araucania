import type { Metadata } from 'next';
import { getPayload } from '@/lib/payload/getPayload';
import { requireFeature } from '@/lib/featureGate';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Transparencia',
  description: 'Transparencia y rendición de cuentas del programa de Hidrógeno Verde en La Araucanía.',
};

const defaultItems = [
  { titulo: 'Actas de reuniones', descripcion: 'Las actas de las reuniones del Consejo de Dirección y del Comité Consultivo se publicarán aquí una vez realizadas.', estado: 'Próximamente' },
  { titulo: 'Registro de actividades', descripcion: 'Cronograma y registro de las actividades realizadas en el marco del Bien Público.', estado: 'Próximamente' },
  { titulo: 'Uso de recursos', descripcion: 'Información sobre la ejecución presupuestaria del programa conforme a los lineamientos de CORFO.', estado: 'Próximamente' },
  { titulo: 'Indicadores de avance', descripcion: 'Métricas de avance del programa: hitos cumplidos, actividades realizadas, participantes.', estado: 'Próximamente' },
];

export default async function Transparencia() {
  requireFeature('transparencia');

  let heroTitulo = 'Transparencia';
  let heroSubtitulo = 'Rendición de cuentas y registro de actividades del programa.';
  let introduccion = 'El programa de Hidrógeno Verde de La Araucanía se compromete con la transparencia en la gestión de recursos públicos y la rendición de cuentas a la ciudadanía.';
  let items = defaultItems;

  try {
    const payload = await getPayload();
    const data = await payload.findGlobal({ slug: 'pagina-transparencia' });
    if (data?.hero?.titulo) heroTitulo = data.hero.titulo;
    if (data?.hero?.subtitulo) heroSubtitulo = data.hero.subtitulo;
    if (data?.introduccion) introduccion = data.introduccion;
    if (data?.items && data.items.length > 0) {
      items = data.items.map((i) => ({
        titulo: i.titulo,
        descripcion: i.descripcion,
        estado: i.estado || '',
      }));
    }
  } catch {
    // Use defaults
  }

  return (
    <div>
      <section className="bg-h2v-blue text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">{heroTitulo}</h1>
          <p className="text-lg opacity-80">{heroSubtitulo}</p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-gray-600 text-lg mb-8">{introduccion}</p>

          <div className="space-y-6">
            {items.map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-h2v-blue/10 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-h2v-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-h2v-blue">{item.titulo}</h3>
                    {item.estado ? (
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{item.estado}</span>
                    ) : null}
                  </div>
                  <p className="text-sm text-gray-500">{item.descripcion}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
