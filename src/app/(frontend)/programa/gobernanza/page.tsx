import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gobernanza',
  description: 'Modelo de gobernanza del Programa de Hidrógeno Verde en La Araucanía: niveles estratégico y operativo.',
};

export default function Gobernanza() {
  return (
    <div>
      {/* Page header */}
      <section className="bg-[#1B3A5C] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Modelo de Gobernanza</h1>
          <p className="text-lg opacity-80 max-w-2xl mx-auto">
            Estructura de dirección, gestión y control del programa para garantizar transparencia, eficiencia y sostenibilidad.
          </p>
        </div>
      </section>

      {/* Descripción */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-gray-700 text-lg leading-relaxed mb-8">
            El modelo de gobernanza del programa se divide en dos niveles — estratégico y operativo — para asegurar una gestión integral y sostenible del proyecto. Define quién tiene el poder y la responsabilidad, cómo se toman las decisiones, y cómo se supervisa y evalúa el desempeño.
          </p>
        </div>
      </section>

      {/* Nivel Estratégico */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-[#0D7377] flex items-center justify-center text-white font-bold">1</div>
            <h2 className="text-2xl font-bold text-[#1B3A5C]">Nivel Estratégico</h2>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 mb-8">
            <h3 className="text-xl font-semibold text-[#0D7377] mb-4">Consejo de Dirección del Hidrógeno Verde de Araucanía</h3>
            <p className="text-gray-600 mb-6">
              Instancia máxima de dirección estratégica compuesta por representantes del Gobierno Regional, Ministerios de Energía, Medio Ambiente y Economía, universidades locales, asociaciones empresariales, comunidades indígenas y expertos independientes.
            </p>

            <h4 className="font-semibold text-[#1B3A5C] mb-3">Funciones:</h4>
            <ul className="space-y-2 text-sm text-gray-600 mb-6">
              {[
                'Definir y ajustar la visión y los objetivos estratégicos del proyecto',
                'Aprobar el plan de desarrollo del hidrógeno verde en la región',
                'Establecer políticas y directrices para la sostenibilidad del proyecto',
                'Supervisar el progreso del proyecto y evaluar su impacto',
                'Garantizar la participación de todas las partes interesadas',
                'Gestionar la transparencia y la rendición de cuentas',
                'Monitorear oportunidades de financiamiento público y/o privado',
                'Mediar en caso de discrepancias entre los actores',
              ].map((fn, i) => (
                <li key={i} className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-[#0D7377] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {fn}
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-4 p-4 bg-[#0D7377]/5 rounded-lg">
              <svg className="w-5 h-5 text-[#0D7377]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div>
                <p className="font-medium text-[#1B3A5C]">Reuniones del Consejo</p>
                <p className="text-sm text-gray-500">Trimestralmente — Presencial y/o videoconferencia</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nivel Operativo */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-[#1B3A5C] flex items-center justify-center text-white font-bold">2</div>
            <h2 className="text-2xl font-bold text-[#1B3A5C]">Nivel Operativo</h2>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 mb-8">
            <h3 className="text-xl font-semibold text-[#0D7377] mb-4">Unidad de Coordinación y Gestión del Proyecto</h3>
            <p className="text-gray-600 mb-6">
              Compuesta por el Director del proyecto, equipo técnico, equipo de gestión financiera y equipo de comunicación y participación comunitaria.
            </p>

            <h4 className="font-semibold text-[#1B3A5C] mb-3">Funciones:</h4>
            <ul className="space-y-2 text-sm text-gray-600 mb-6">
              {[
                'Implementar el plan de desarrollo del hidrógeno verde',
                'Gestionar los recursos financieros y técnicos del proyecto',
                'Coordinar las actividades de los diferentes actores involucrados',
                'Monitorear y evaluar el desempeño del proyecto',
                'Comunicar los avances del proyecto a las partes interesadas',
                'Implementar mesas de trabajo técnicas para actividades específicas',
                'Promover redes de colaboración entre los actores',
                'Retroalimentar al Consejo respecto de oportunidades y requerimientos',
              ].map((fn, i) => (
                <li key={i} className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-[#1B3A5C] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {fn}
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-4 p-4 bg-[#1B3A5C]/5 rounded-lg">
              <svg className="w-5 h-5 text-[#1B3A5C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div>
                <p className="font-medium text-[#1B3A5C]">Reuniones de coordinación</p>
                <p className="text-sm text-gray-500">Cada 15 días — Presencial y/o videoconferencia</p>
              </div>
            </div>
          </div>

          {/* Equipo operativo */}
          <h3 className="text-xl font-semibold text-[#1B3A5C] mb-4">Equipo del Proyecto</h3>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-[#1B3A5C] text-white">
                <tr>
                  <th className="px-6 py-3 text-sm font-medium">Institución</th>
                  <th className="px-6 py-3 text-sm font-medium">Cargo</th>
                  <th className="px-6 py-3 text-sm font-medium">Titular</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { inst: 'CDPR Araucanía', cargo: 'Ejecutivo Sectorial', titular: 'Eduardo Figueroa G.' },
                  { inst: 'GDC CORFO', cargo: 'Coordinador Programa', titular: 'Por definir' },
                  { inst: 'CODESSER', cargo: 'Director(a) Proyecto', titular: 'Claudia Martínez' },
                  { inst: 'UTalca', cargo: 'Co-ejecutor', titular: 'Ernesto S.' },
                  { inst: 'Energía', cargo: 'Mandante', titular: 'Camilo Villagrán' },
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 1 ? 'bg-gray-50' : ''}>
                    <td className="px-6 py-3 text-sm font-medium text-gray-900">{row.inst}</td>
                    <td className="px-6 py-3 text-sm text-gray-600">{row.cargo}</td>
                    <td className="px-6 py-3 text-sm text-gray-600">{row.titular}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Diagrama visual */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-[#1B3A5C] mb-8">Estructura del Modelo</h2>
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100" role="img" aria-label="Diagrama de la estructura de gobernanza: Consejo de Dirección en nivel estratégico, conectado al Comité Consultivo, y debajo la Unidad de Coordinación y Gestión en nivel operativo con sus 4 equipos">
            {/* SVG Diagram */}
            <svg viewBox="0 0 800 400" className="w-full max-w-2xl mx-auto" aria-hidden="true">
              {/* Nivel Estratégico */}
              <rect x="200" y="20" width="400" height="60" rx="12" fill="#0D7377" />
              <text x="400" y="55" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">Consejo de Dirección H2V</text>

              {/* Comité Consultivo */}
              <rect x="550" y="100" width="220" height="50" rx="10" fill="#4ECDC4" />
              <text x="660" y="130" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">Comité Consultivo</text>

              {/* Línea Consejo → Comité */}
              <line x1="500" y1="80" x2="550" y2="110" stroke="#94A3B8" strokeWidth="2" strokeDasharray="6" />

              {/* Línea Consejo → Unidad */}
              <line x1="400" y1="80" x2="400" y2="160" stroke="#94A3B8" strokeWidth="2" />

              {/* Nivel Operativo */}
              <rect x="150" y="160" width="500" height="60" rx="12" fill="#1B3A5C" />
              <text x="400" y="195" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">Unidad de Coordinación y Gestión</text>

              {/* Equipos */}
              {[
                { label: 'Director', x: 100 },
                { label: 'Equipo Técnico', x: 280 },
                { label: 'Gestión Financiera', x: 480 },
                { label: 'Comunicaciones', x: 660 },
              ].map((eq, i) => (
                <g key={i}>
                  <line x1={eq.x + 60} y1="220" x2={eq.x + 60} y2="270" stroke="#94A3B8" strokeWidth="1.5" />
                  <rect x={eq.x} y="270" width="120" height="45" rx="8" fill="#F1F5F9" stroke="#CBD5E1" />
                  <text x={eq.x + 60} y="297" textAnchor="middle" fill="#1B3A5C" fontSize="11" fontWeight="600">{eq.label}</text>
                </g>
              ))}

              {/* Labels */}
              <text x="30" y="55" fill="#0D7377" fontSize="11" fontWeight="bold">NIVEL</text>
              <text x="30" y="70" fill="#0D7377" fontSize="11" fontWeight="bold">ESTRATÉGICO</text>
              <text x="30" y="195" fill="#1B3A5C" fontSize="11" fontWeight="bold">NIVEL</text>
              <text x="30" y="210" fill="#1B3A5C" fontSize="11" fontWeight="bold">OPERATIVO</text>
            </svg>
          </div>
        </div>
      </section>

      {/* Galería de evidencia */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-[#1B3A5C] mb-8">Evidencia de Actividades</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="aspect-[4/3] bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm border border-gray-200">
                <div className="text-center">
                  <svg className="w-8 h-8 mx-auto mb-2 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Foto próximamente
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-400 mt-4 italic">
            Las fotografías de actividades se irán incorporando a medida que se desarrolle el programa.
          </p>
        </div>
      </section>
    </div>
  );
}
