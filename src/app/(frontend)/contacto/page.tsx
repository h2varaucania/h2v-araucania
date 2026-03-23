import type { Metadata } from 'next';
import ContactForm from '@/components/forms/ContactForm';

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
          <div>
            <h2 className="text-xl font-semibold text-[#1B3A5C] mb-6">Envíanos un mensaje</h2>
            <ContactForm />
          </div>

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
