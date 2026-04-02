import type { Metadata } from 'next';
import { getPayload } from '@/lib/payload/getPayload';
import { requireFeature } from '@/lib/featureGate';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Eventos',
  description: 'Calendario de eventos del programa de Hidrógeno Verde en La Araucanía.',
  openGraph: {
    title: 'Eventos | H2V Araucanía',
    description: 'Calendario de eventos del programa de Hidrógeno Verde en La Araucanía.',
  },
};

export default async function Eventos() {
  requireFeature('eventos');
  let eventos: any[] = [];

  try {
    const payload = await getPayload();
    const result = await payload.find({
      collection: 'eventos',
      where: { publicado: { equals: true } },
      sort: 'fecha',
      limit: 20,
    });
    eventos = result.docs;
  } catch {
    // DB unavailable — render empty state
  }

  return (
    <div>
      <section className="bg-h2v-blue text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Eventos</h1>
          <p className="text-lg opacity-80">Calendario de eventos del programa y la industria del hidrógeno verde.</p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {eventos.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-400 text-lg">Proximamente se publicaran eventos del programa.</p>
              <p className="text-gray-300 text-sm mt-2">Los eventos se gestionan desde el panel de administracion.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {eventos.map((evento: any) => (
                <div key={evento.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex gap-6">
                  <div className="shrink-0 w-16 text-center">
                    <div className="text-2xl font-bold text-h2v-green">
                      {new Date(evento.fecha).getDate()}
                    </div>
                    <div className="text-xs text-gray-400 uppercase">
                      {new Date(evento.fecha).toLocaleDateString('es-CL', { month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-h2v-blue mb-1">{evento.titulo}</h3>
                    <p className="text-sm text-gray-500 mb-2">{evento.lugar}</p>
                    {evento.tipo && (
                      <span className="text-xs bg-h2v-green/10 text-h2v-green px-2 py-0.5 rounded-full">{evento.tipo}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
