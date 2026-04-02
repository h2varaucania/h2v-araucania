import type { Metadata } from 'next';
import Link from 'next/link';
import { getPayload } from '@/lib/payload/getPayload';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Noticias',
  description: 'Últimas noticias, eventos y actividades del programa de Hidrógeno Verde en La Araucanía.',
  openGraph: {
    title: 'Noticias | H2V Araucanía',
    description: 'Últimas noticias, eventos y actividades del programa de Hidrógeno Verde en La Araucanía.',
  },
};

const categoriasColor: Record<string, string> = {
  general: 'bg-blue-100 text-blue-700',
  gobernanza: 'bg-purple-100 text-purple-700',
  proyecto: 'bg-green-100 text-green-700',
  seminario: 'bg-amber-100 text-amber-700',
  taller: 'bg-cyan-100 text-cyan-700',
  acuerdo: 'bg-rose-100 text-rose-700',
};

const ITEMS_PER_PAGE = 10;

type SearchParams = Promise<{ page?: string }>;

export default async function Noticias({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page || '1', 10));

  const payload = await getPayload();
  const { docs: noticias, totalDocs, totalPages } = await payload.find({
    collection: 'noticias',
    where: { publicado: { equals: true } },
    sort: '-fecha',
    limit: ITEMS_PER_PAGE,
    page: currentPage,
  });

  return (
    <div>
      <section className="bg-h2v-blue text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Noticias</h1>
          <p className="text-lg opacity-80">Ultimas noticias y actividades del programa.</p>
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
            noticias.map((noticia) => (
              <article key={noticia.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-h2v-green/20 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <time className="text-sm text-gray-400" dateTime={noticia.fecha as string}>
                    {new Date(noticia.fecha as string).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </time>
                  {noticia.categoria && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoriasColor[noticia.categoria as string] || 'bg-gray-100 text-gray-600'}`}>
                      {noticia.categoria as string}
                    </span>
                  )}
                </div>
                <Link href={`/noticias/${noticia.slug}`}>
                  <h2 className="text-xl font-semibold text-h2v-blue hover:text-h2v-green transition-colors mb-2">
                    {noticia.titulo as string}
                  </h2>
                </Link>
                <p className="text-gray-600 text-sm leading-relaxed">{noticia.extracto as string}</p>
                <Link href={`/noticias/${noticia.slug}`} className="inline-block mt-3 text-sm font-medium text-h2v-green hover:underline">
                  Leer mas
                </Link>
              </article>
            ))
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="flex items-center justify-center gap-2 pt-8" aria-label="Paginacion de noticias">
              {currentPage > 1 && (
                <Link
                  href={`/noticias?page=${currentPage - 1}`}
                  className="px-4 py-2 text-sm font-medium text-h2v-blue bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Anterior
                </Link>
              )}

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Link
                  key={page}
                  href={`/noticias?page=${page}`}
                  className={`w-10 h-10 flex items-center justify-center text-sm font-medium rounded-lg transition-colors ${
                    page === currentPage
                      ? 'bg-h2v-green text-white'
                      : 'text-h2v-blue bg-white border border-gray-200 hover:bg-gray-50'
                  }`}
                  aria-current={page === currentPage ? 'page' : undefined}
                >
                  {page}
                </Link>
              ))}

              {currentPage < totalPages && (
                <Link
                  href={`/noticias?page=${currentPage + 1}`}
                  className="px-4 py-2 text-sm font-medium text-h2v-blue bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Siguiente
                </Link>
              )}

              <span className="ml-4 text-sm text-gray-400">
                {totalDocs} {totalDocs === 1 ? 'noticia' : 'noticias'}
              </span>
            </nav>
          )}
        </div>
      </section>
    </div>
  );
}
