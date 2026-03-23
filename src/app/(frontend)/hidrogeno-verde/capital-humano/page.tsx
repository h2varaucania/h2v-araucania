import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Capital Humano',
  description: 'Formación y capacitación para la industria del hidrógeno verde en La Araucanía.',
};

export default function CapitalHumano() {
  return (
    <div>
      <section className="bg-[#1B3A5C] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Capital Humano</h1>
          <p className="text-lg opacity-80 max-w-2xl mx-auto">
            Formación y desarrollo de competencias para la industria del hidrógeno verde en La Araucanía.
          </p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-[#1B3A5C] mb-6">El desafío de la formación</h2>
          <p className="text-gray-700 text-lg mb-8">
            La industria del hidrógeno verde requiere perfiles profesionales especializados que actualmente no existen en la formación tradicional. El programa busca anticiparse a esta demanda desarrollando capacidades en la región.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="bg-[#0D7377]/5 rounded-xl p-6 border border-[#0D7377]/20">
              <h3 className="font-semibold text-[#0D7377] mb-3">Perfiles emergentes</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                {[
                  'Técnicos en electrólisis y celdas de combustible',
                  'Ingenieros de sistemas de almacenamiento de H2',
                  'Especialistas en seguridad para manejo de hidrógeno',
                  'Operadores de plantas de producción de H2V',
                  'Profesionales en regulación energética',
                  'Gestores de proyectos de energía renovable',
                ].map((p, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#0D7377] font-bold">+</span> {p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-[#1B3A5C]/5 rounded-xl p-6 border border-[#1B3A5C]/20">
              <h3 className="font-semibold text-[#1B3A5C] mb-3">Programas del BP</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                {[
                  'Programas de capacitación adaptados a necesidades regionales',
                  'Alianzas con SENCE para certificación de competencias',
                  'Instrumentos CORFO de formación (Viraliza Formación)',
                  'Articulación con universidades locales (UFRO, UCT)',
                  'Capacitación para sector agroforestal en tecnologías H2V',
                  'Programa piloto formativo público-privado',
                ].map((p, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-[#1B3A5C] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
            <h3 className="font-semibold text-amber-800 mb-2">Oportunidad regional</h3>
            <p className="text-sm text-amber-700">
              La Araucanía puede posicionarse como polo de formación en hidrógeno verde del sur de Chile, aprovechando su infraestructura universitaria (Universidad de La Frontera, Universidad Católica de Temuco) y los programas de capacitación del Bien Público. Los programas específicos se irán publicando a medida que se desarrollen durante la ejecución del proyecto.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
