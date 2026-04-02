import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mediateca',
  description: 'Videos, infografías y material multimedia del programa de Hidrógeno Verde en La Araucanía.',
};

export default function Mediateca() {
  return (
    <div>
      <section className="bg-h2v-blue text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Mediateca</h1>
          <p className="text-lg opacity-80">Videos, infografías y material multimedia del programa.</p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-400 text-lg">Proximamente se publicara material multimedia.</p>
            <p className="text-gray-300 text-sm mt-2">Videos, infografias y presentaciones del programa se alojaran en esta seccion.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
