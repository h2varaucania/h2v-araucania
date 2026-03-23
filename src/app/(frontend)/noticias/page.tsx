import type { Metadata } from 'next';
import Link from 'next/link';
import { getPayload } from '@/lib/payload/getPayload';

export const metadata: Metadata = {
  title: 'Noticias',
  description: 'Últimas noticias, eventos y actividades del programa de Hidrógeno Verde en La Araucanía.',
};

const categoriasColor: Record<string, string> = {
  general: 'bg-blue-100 text-blue-700',
  gobernanza: 'bg-purple-100 text-purple-700',
  proyecto: 'bg-green-100 text-green-700',
  seminario: 'bg-amber-100 text-amber-700',
  taller: 'bg-cyan-100 text-cyan-700',
  acuerdo: 'bg-rose-100 text-rose-700',
};

export default async function Noticias() {
  const payload = await getPayload();
  const { docs: noticias } = await payload.find({
    collection: 'noticias',
    where: { publicado: { equals: true } },
    sort: '-fecha',
    limit: 20,
  });

  return (
    <div>
      <section className="bg-[#1B3A5C] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Noticias</h1>
          <p className="text-lg opacity-80">Últimas noticias y actividades del programa.</p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {noticias.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              <p className="text-gray-400 text-lg">Proximamente se publicaran noticias del programa.</p>
              <p className="text-gray-300 text-sm mt-2">Las noticias se gestionan desde el panel de administracion.</p>
            </div>
          ) : (
            noticias.map((noticia: any) => (
              <article key={noticia.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-[#0D7377]/20 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <time className="text-sm text-gray-400" dateTime={noticia.fecha}>
                    {new Date(noticia.fecha).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </time>
                  {noticia.categoria && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoriasColor[noticia.categoria] || 'bg-gray-100 text-gray-600'}`}>
                      {noticia.categoria}
                    </span>
                  )}
                </div>
                <Link href={`/noticias/${noticia.slug}`}>
                  <h2 className="text-xl font-semibold text-[#1B3A5C] hover:text-[#0D7377] transition-colors mb-2">
                    {noticia.titulo}
                  </h2>
                </Link>
                <p className="text-gray-600 text-sm leading-relaxed">{noticia.extracto}</p>
                <Link href={`/noticias/${noticia.slug}`} className="inline-block mt-3 text-sm font-medium text-[#0D7377] hover:underline">
                  Leer mas
                </Link>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
