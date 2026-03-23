import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contacto',
  description: 'Escríbenos para consultas sobre el programa de Hidrógeno Verde en La Araucanía.',
};

export default function Contacto() {
  return (
    <div>
      <section className="bg-[#1B3A5C] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Contacto</h1>
          <p className="text-lg opacity-80">Escríbenos para consultas, colaboraciones o más información.</p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Formulario */}
          <div>
            <h2 className="text-xl font-semibold text-[#1B3A5C] mb-6">Envíanos un mensaje</h2>
            <form className="space-y-5">
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
                <input
                  type="text" id="nombre" name="nombre" required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D7377] focus:border-transparent outline-none transition-shadow"
                  placeholder="Tu nombre"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
                <input
                  type="email" id="email" name="email" required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D7377] focus:border-transparent outline-none transition-shadow"
                  placeholder="tu@email.com"
                />
              </div>
              <div>
                <label htmlFor="asunto" className="block text-sm font-medium text-gray-700 mb-1">Asunto</label>
                <select
                  id="asunto" name="asunto" required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D7377] focus:border-transparent outline-none transition-shadow"
                >
                  <option value="">Selecciona un asunto</option>
                  <option value="consulta">Consulta general</option>
                  <option value="colaboracion">Propuesta de colaboración</option>
                  <option value="prensa">Prensa y comunicaciones</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
              <div>
                <label htmlFor="mensaje" className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
                <textarea
                  id="mensaje" name="mensaje" rows={5} required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D7377] focus:border-transparent outline-none transition-shadow resize-none"
                  placeholder="Escribe tu mensaje aquí..."
                />
              </div>
              <button
                type="submit"
                className="w-full px-6 py-3 bg-[#0D7377] text-white font-semibold rounded-lg hover:bg-[#0D7377]/90 transition-colors focus:ring-2 focus:ring-[#0D7377] focus:ring-offset-2"
              >
                Enviar mensaje
              </button>
            </form>
          </div>

          {/* Info de contacto */}
          <div>
            <h2 className="text-xl font-semibold text-[#1B3A5C] mb-6">Información de contacto</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#0D7377]/10 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-[#0D7377]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-[#1B3A5C]">Correo electrónico</p>
                  <a href="mailto:h2varaucania@gmail.com" className="text-[#0D7377] hover:underline">h2varaucania@gmail.com</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#0D7377]/10 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-[#0D7377]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-[#1B3A5C]">Ubicación</p>
                  <p className="text-gray-600">Temuco, Región de La Araucanía, Chile</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#0D7377]/10 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-[#0D7377]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-[#1B3A5C]">Programa</p>
                  <p className="text-gray-600">Bien Público 24BP-269085</p>
                  <p className="text-sm text-gray-400">Programa Desarrollo Productivo Sostenible — CORFO</p>
                </div>
              </div>
            </div>

            {/* Instituciones */}
            <div className="mt-10 p-6 bg-gray-50 rounded-xl">
              <p className="text-sm font-medium text-gray-500 mb-3">Ejecutado por</p>
              <div className="space-y-2 text-sm text-gray-700">
                <p><strong>CODESSER</strong> — Corporación de Desarrollo Social del Sector Rural</p>
                <p><strong>Universidad de Talca</strong> — Co-ejecutor técnico</p>
              </div>
              <p className="text-sm font-medium text-gray-500 mt-4 mb-2">Mandante</p>
              <p className="text-sm text-gray-700"><strong>Subsecretaría de Energía</strong> — Ministerio de Energía</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
