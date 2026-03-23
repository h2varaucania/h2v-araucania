import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Documentos y Recursos',
  description: 'Documentos técnicos y de difusión del programa de Hidrógeno Verde en La Araucanía.',
};

const documentosPlaceholder = [
  { titulo: 'Estrategia Nacional de Hidrógeno Verde', tipo: 'tecnico', anio: 2020, desc: 'Documento base del Ministerio de Energía para el desarrollo del hidrógeno verde en Chile.' },
  { titulo: 'Plan de Acción de Hidrógeno Verde 2023-2030', tipo: 'tecnico', anio: 2023, desc: 'Plan de acción con líneas estratégicas para implementar la producción de H2V a nivel nacional.' },
  { titulo: 'Diagnóstico Regional de Demanda', tipo: 'tecnico', anio: 2026, desc: 'Diagnóstico de la demanda y capacidad productiva de La Araucanía para el hidrógeno verde.' },
  { titulo: 'Presentación Programa H2V Araucanía', tipo: 'difusion', anio: 2026, desc: 'Material de difusión sobre el programa estratégico regional.' },
];

const tipoColor: Record<string, string> = {
  tecnico: 'bg-blue-100 text-blue-700',
  difusion: 'bg-amber-100 text-amber-700',
  regulatorio: 'bg-purple-100 text-purple-700',
  capacitacion: 'bg-green-100 text-green-700',
};

export default function Documentos() {
  return (
    <div>
      <section className="bg-[#1B3A5C] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Recursos y Documentación</h1>
          <p className="text-lg opacity-80">
            Accede a documentos técnicos, estudios y material de difusión del programa.
          </p>
        </div>
      </section>

      {/* Filtros */}
      <section className="py-6 px-4 bg-gray-50 border-b border-gray-200">
        <div className="max-w-6xl mx-auto flex flex-wrap gap-3 items-center">
          <span className="text-sm font-medium text-gray-500">Tipo:</span>
          {['Todos', 'Técnico', 'Difusión', 'Regulatorio', 'Capacitación'].map((f) => (
            <button key={f} className="px-3 py-1.5 text-sm rounded-full border border-gray-200 bg-white text-gray-600 hover:border-[#0D7377] hover:text-[#0D7377] transition-colors">
              {f}
            </button>
          ))}
          <span className="text-sm font-medium text-gray-500 ml-4">Año:</span>
          {['Todos', '2026', '2025', '2024', '2023'].map((f) => (
            <button key={f} className="px-3 py-1.5 text-sm rounded-full border border-gray-200 bg-white text-gray-600 hover:border-[#0D7377] hover:text-[#0D7377] transition-colors">
              {f}
            </button>
          ))}
        </div>
      </section>

      {/* Documentos */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {documentosPlaceholder.map((doc, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:border-[#0D7377]/20 transition-all group">
              {/* Thumbnail placeholder */}
              <div className="h-40 bg-gradient-to-br from-[#0D7377]/5 to-[#1B3A5C]/10 flex items-center justify-center">
                <svg className="w-12 h-12 text-[#0D7377]/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tipoColor[doc.tipo] || 'bg-gray-100 text-gray-600'}`}>
                    {doc.tipo}
                  </span>
                  <span className="text-xs text-gray-400">{doc.anio}</span>
                </div>
                <h3 className="font-semibold text-[#1B3A5C] group-hover:text-[#0D7377] transition-colors mb-2">
                  {doc.titulo}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2">{doc.desc}</p>
                <button className="mt-4 flex items-center gap-2 text-sm font-medium text-[#0D7377] hover:underline">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Descargar
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-gray-400 italic">
            Los documentos se irán incorporando a medida que se generen durante la ejecución del Bien Público.
            Requiere registro para descargar.
          </p>
        </div>
      </section>
    </div>
  );
}
