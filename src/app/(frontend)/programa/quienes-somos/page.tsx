import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Quiénes Somos',
  description: 'Conozca el equipo, instituciones y actores del Programa Estratégico Regional de Hidrógeno Verde en La Araucanía.',
};

const instituciones = [
  { nombre: 'CORFO', rol: 'Financiamiento del Bien Público', logo: '/logos/BP H2V Araucanía - Logo Corfo Azul.png' },
  { nombre: 'CODESSER', rol: 'Ejecutor del proyecto', logo: '/logos/BP H2V Araucanía - Logo CES4.0.png' },
  { nombre: 'Universidad de Talca', rol: 'Co-ejecutor técnico', logo: '/logos/BP H2V Araucanía - Logo Utalca.png' },
  { nombre: 'Seremi de Energía Araucanía', rol: 'Mandante — Subsecretaría de Energía', logo: '/logos/BP H2V Araucanía - Logo Seremi Energía Araucanía.png' },
];

export default function QuienesSomos() {
  return (
    <div>
      {/* Page header */}
      <section className="bg-[#1B3A5C] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Quiénes Somos</h1>
          <p className="text-lg opacity-80 max-w-2xl mx-auto">
            El Programa Estratégico Regional de Hidrógeno Verde de La Araucanía impulsa el crecimiento socioeconómico regional mediante tecnologías de hidrógeno verde.
          </p>
        </div>
      </section>

      {/* Descripción del BP */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-[#1B3A5C] mb-6">El Bien Público</h2>
          <div className="prose prose-lg max-w-none text-gray-700">
            <p>
              El proyecto &quot;Empoderando a los sectores Agroforestal y Productivo con Hidrógeno Verde: Un camino hacia el Desarrollo Sostenible en la Región de la Araucanía&quot; (código 24BP-269085) tiene como objetivo impulsar el crecimiento socioeconómico en la Región de la Araucanía mediante el aprovechamiento de las tecnologías de hidrógeno verde, la mejora del capital humano y el desarrollo de estrategias de financiamiento para capitalizar el potencial regional y las agendas globales de sostenibilidad.
            </p>
          </div>
        </div>
      </section>

      {/* Instituciones */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-[#1B3A5C] mb-8 text-center">Instituciones Participantes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {instituciones.map((inst) => (
              <div key={inst.nombre} className="bg-white rounded-xl p-6 shadow-sm text-center border border-gray-100">
                <div className="h-16 flex items-center justify-center mb-4">
                  <Image
                    src={inst.logo}
                    alt={inst.nombre}
                    width={120}
                    height={60}
                    className="h-12 w-auto object-contain"
                  />
                </div>
                <h3 className="font-semibold text-[#1B3A5C] mb-1">{inst.nombre}</h3>
                <p className="text-sm text-gray-500">{inst.rol}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Consejo de Dirección */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-[#1B3A5C] mb-4">Consejo de Dirección del Hidrógeno Verde de Araucanía</h2>
          <p className="text-gray-600 mb-8">
            El Consejo de Dirección es la instancia estratégica del programa, encargada de definir la visión, aprobar planes de desarrollo y supervisar el progreso del proyecto.
          </p>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-[#1B3A5C] text-white">
                <tr>
                  <th className="px-6 py-3 text-sm font-medium">Institución</th>
                  <th className="px-6 py-3 text-sm font-medium">Cargo</th>
                  <th className="px-6 py-3 text-sm font-medium">Titular</th>
                  <th className="px-6 py-3 text-sm font-medium hidden md:table-cell">Aporte al BP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { inst: 'Asociaciones empresariales', cargo: 'Presidente', titular: 'Por definir', aporte: 'Vinculación con el sector y orientación estratégica' },
                  { inst: 'Ministerio de Energía', cargo: 'Director', titular: 'Por definir', aporte: 'Orientación en políticas públicas' },
                  { inst: 'Ministerio de Medio Ambiente', cargo: 'Director', titular: 'Por definir', aporte: 'Articulación con instituciones del Estado' },
                  { inst: 'Ministerio de Economía', cargo: 'Director', titular: 'Por definir', aporte: 'Articulación con instituciones del Estado' },
                  { inst: 'Gobierno Regional', cargo: 'Director', titular: 'Por definir', aporte: 'Desarrollo productivo e innovación tecnológica' },
                  { inst: 'Comunidades Indígenas', cargo: 'Consejero', titular: 'Por definir', aporte: 'Mirada en decisiones sobre proyectos energéticos' },
                  { inst: 'Universidades Locales', cargo: 'Consejero', titular: 'Por definir', aporte: 'Vinculación, orientación e información de tendencias' },
                  { inst: 'Experto Nacional/Internacional', cargo: 'Experto', titular: 'Por definir', aporte: 'Retroalimentación técnica y vinculación con la industria' },
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 1 ? 'bg-gray-50' : ''}>
                    <td className="px-6 py-3 text-sm font-medium text-gray-900">{row.inst}</td>
                    <td className="px-6 py-3 text-sm text-gray-600">{row.cargo}</td>
                    <td className="px-6 py-3 text-sm text-gray-600 italic">{row.titular}</td>
                    <td className="px-6 py-3 text-sm text-gray-500 hidden md:table-cell">{row.aporte}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-400 mt-4 italic">
            Los integrantes serán confirmados por la Unidad de Coordinación y Gestión y ratificados en reunión del Consejo Estratégico.
          </p>
        </div>
      </section>

      {/* Comité Consultivo */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-[#1B3A5C] mb-4">Comité Consultivo Técnico Científico</h2>
          <p className="text-gray-600 mb-4">
            Integrado por miembros de la sociedad civil, ONGs y otros actores relevantes, este comité tiene como objetivo mantener informado al Consejo Estratégico de las necesidades y requerimientos de la ciudadanía, así como fiscalizar y transparentar el desarrollo del proyecto.
          </p>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#0D7377]/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-[#0D7377]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-[#1B3A5C]">Reuniones de trabajo</p>
                <p className="text-sm text-gray-500">Periodicidad mensual — Formato presencial y/o videoconferencia</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 italic">
              Los integrantes del Comité Consultivo serán definidos durante la ejecución del programa.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
