import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Comunidad y Participación',
  description: 'Participación ciudadana y comunitaria en el programa de Hidrógeno Verde en La Araucanía.',
};

export default function Comunidad() {
  return (
    <div>
      <section className="bg-[#1B3A5C] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Comunidad y Participación</h1>
          <p className="text-lg opacity-80 max-w-2xl mx-auto">
            El desarrollo del hidrógeno verde en La Araucanía se construye con la participación activa de las comunidades y actores territoriales.
          </p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-[#1B3A5C] mb-6">Participación territorial</h2>
          <p className="text-gray-700 text-lg mb-8">
            El Plan de Acción de Hidrógeno Verde 2023-2030 del Ministerio de Energía, en su Acción 27, promueve la participación temprana de los territorios. Este programa se compromete a integrar las voces de todos los actores de La Araucanía en el diseño y desarrollo de la industria del hidrógeno verde.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-[#0D7377] mb-3">Participación en gobernanza</h3>
              <p className="text-sm text-gray-600 mb-3">El Consejo de Dirección del H2V de Araucanía incluye representación directa de:</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-[#0D7377] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Comunidades indígenas (representantes mapuche)
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-[#0D7377] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Sociedad civil a través del Comité Consultivo
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-[#0D7377] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Asociaciones empresariales locales
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-[#0D7377] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Universidades regionales
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-[#0D7377] mb-3">Compromiso con el territorio</h3>
              <p className="text-sm text-gray-600 mb-3">El programa se compromete a:</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-[#0D7377] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Informar de manera transparente sobre avances y decisiones
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-[#0D7377] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Incorporar las preocupaciones ambientales y culturales
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-[#0D7377] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Promover beneficios locales del desarrollo energético
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-[#0D7377] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Respetar la cosmovisión y derechos de los pueblos originarios
                </li>
              </ul>
            </div>
          </div>

          {/* Glosario Mapudungún */}
          <div className="bg-amber-50 rounded-xl p-8 border border-amber-200">
            <h3 className="text-xl font-semibold text-amber-800 mb-4">Glosario de energía en Mapudungún</h3>
            <p className="text-sm text-amber-700 mb-4">
              Como gesto de pertinencia territorial, incluimos conceptos clave de energía en Mapudungún:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { mapudungun: 'Newen', espanol: 'Energía, fuerza' },
                { mapudungun: 'Ko', espanol: 'Agua' },
                { mapudungun: 'Kürüf', espanol: 'Viento' },
                { mapudungun: 'Antü', espanol: 'Sol' },
                { mapudungun: 'Mapu', espanol: 'Tierra, territorio' },
                { mapudungun: 'Küme mongen', espanol: 'Buen vivir' },
                { mapudungun: 'Itrofill mongen', espanol: 'Biodiversidad, toda la vida' },
                { mapudungun: 'Wenu mapu', espanol: 'Cielo, espacio superior' },
              ].map((term) => (
                <div key={term.mapudungun} className="flex items-center gap-3 bg-white/60 rounded-lg px-4 py-2">
                  <span className="font-semibold text-amber-900">{term.mapudungun}</span>
                  <span className="text-amber-600 text-sm">— {term.espanol}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-amber-600 mt-4 italic">
              Este glosario será ampliado con aportes de las comunidades mapuche durante la ejecución del programa.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
