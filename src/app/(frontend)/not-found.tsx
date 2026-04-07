import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Página no encontrada',
};

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16">
      <div className="text-center max-w-md">
        <p className="text-6xl font-bold text-h2v-green mb-4">404</p>
        <h1 className="text-2xl font-bold text-h2v-blue mb-3">
          Página no encontrada
        </h1>
        <p className="text-gray-600 mb-8">
          La página que buscas no existe o fue movida. Puedes volver al inicio o explorar las secciones del programa.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-h2v-green text-white rounded-lg font-medium hover:bg-h2v-green/90 transition-colors"
          >
            Volver al inicio
          </Link>
          <Link
            href="/proyectos"
            className="px-6 py-3 border border-h2v-blue text-h2v-blue rounded-lg font-medium hover:bg-h2v-blue/5 transition-colors"
          >
            Ver proyectos
          </Link>
        </div>
      </div>
    </div>
  );
}
