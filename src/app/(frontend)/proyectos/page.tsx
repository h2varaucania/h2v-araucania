import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mapa de Proyectos',
  description: 'Visualiza proyectos de hidrógeno verde en la región de La Araucanía y a nivel nacional.',
};

export default function Proyectos() {
  return (
    <div>
      <section className="bg-[#1B3A5C] text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Mapa de Proyectos</h1>
          <p className="text-lg opacity-80">
            Proyectos de hidrógeno verde en desarrollo y ejecución a nivel regional y nacional.
          </p>
        </div>
      </section>

      {/* Mapa placeholder — se integrará Mapbox en siguiente iteración */}
      <section className="relative">
        <div className="h-[60vh] min-h-[400px] bg-gradient-to-br from-[#0D7377]/10 to-[#1B3A5C]/10 flex items-center justify-center">
          <div className="text-center p-8 bg-white/80 backdrop-blur rounded-xl shadow-sm max-w-md">
            <svg className="w-16 h-16 mx-auto mb-4 text-[#0D7377]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <h2 className="text-xl font-semibold text-[#1B3A5C] mb-2">Mapa interactivo</h2>
            <p className="text-sm text-gray-500">
              El mapa con proyectos H2V georreferenciados se activará próximamente con datos del programa.
            </p>
          </div>
        </div>
      </section>

      {/* Filtros placeholder */}
      <section className="py-8 px-4 bg-gray-50 border-t border-gray-200">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-3">
            <span className="text-sm font-medium text-gray-500">Filtrar por:</span>
            {['Todos', 'Araucanía', 'Nacional', 'Pilotaje', 'Desarrollo', 'Operación'].map((f) => (
              <button
                key={f}
                className="px-3 py-1.5 text-sm rounded-full border border-gray-200 bg-white text-gray-600 hover:border-[#0D7377] hover:text-[#0D7377] transition-colors"
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Empty state */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-400 italic">
            Los proyectos de H2V serán incorporados a medida que se desarrolle el programa.
            La información se gestionará desde el panel de administración.
          </p>
        </div>
      </section>
    </div>
  );
}
