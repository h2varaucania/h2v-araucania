import type { Metadata } from 'next';
import Link from 'next/link';
import { getPayload } from '@/lib/payload/getPayload';
import { t } from '@/lib/contenido';
import { sitioDefaults as d } from '@/content/defaults/sitio';

export const metadata: Metadata = {
  title: 'Página no encontrada',
};

export default async function NotFound() {
  let titulo: string = d.titulo404;
  let texto: string = d.texto404;
  let boton: string = d.boton404;
  let botonSec: string = d.boton404Secundario;
  try {
    const payload = await getPayload();
    const s = await payload.findGlobal({ slug: 'sitio-general' });
    titulo = t(s?.titulo404, d.titulo404);
    texto = t(s?.texto404, d.texto404);
    boton = t(s?.boton404, d.boton404);
    botonSec = t(s?.boton404Secundario, d.boton404Secundario);
  } catch {
    // defaults
  }
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16">
      <div className="text-center max-w-md">
        <p className="text-6xl font-bold text-h2v-green mb-4">404</p>
        <h1 className="text-2xl font-bold text-h2v-blue mb-3">{titulo}</h1>
        <p className="text-gray-600 mb-8">{texto}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-h2v-green text-white rounded-lg font-medium hover:bg-h2v-green/90 transition-colors"
          >
            {boton}
          </Link>
          <Link
            href="/proyectos"
            className="px-6 py-3 border border-h2v-blue text-h2v-blue rounded-lg font-medium hover:bg-h2v-blue/5 transition-colors"
          >
            {botonSec}
          </Link>
        </div>
      </div>
    </div>
  );
}
