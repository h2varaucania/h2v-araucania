import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Transparencia',
  description: 'Transparencia y rendición de cuentas del programa de Hidrógeno Verde en La Araucanía.',
};

export default function Transparencia() {
  return (
    <div>
      <section className="bg-[#1B3A5C] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Transparencia</h1>
          <p className="text-lg opacity-80">Rendición de cuentas y registro de actividades del programa.</p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-gray-600 text-lg mb-8">
            El programa de Hidrógeno Verde de La Araucanía se compromete con la transparencia en la gestión de recursos públicos y la rendición de cuentas a la ciudadanía.
          </p>

          <div className="space-y-6">
            {[
              { titulo: 'Actas de reuniones', desc: 'Las actas de las reuniones del Consejo de Dirección y del Comité Consultivo se publicarán aquí una vez realizadas.', estado: 'Próximamente' },
              { titulo: 'Registro de actividades', desc: 'Cronograma y registro de las actividades realizadas en el marco del Bien Público.', estado: 'Próximamente' },
              { titulo: 'Uso de recursos', desc: 'Información sobre la ejecución presupuestaria del programa conforme a los lineamientos de CORFO.', estado: 'Próximamente' },
              { titulo: 'Indicadores de avance', desc: 'Métricas de avance del programa: hitos cumplidos, actividades realizadas, participantes.', estado: 'Próximamente' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#1B3A5C]/10 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-[#1B3A5C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-[#1B3A5C]">{item.titulo}</h3>
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{item.estado}</span>
                  </div>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
