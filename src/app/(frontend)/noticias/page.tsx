import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Noticias',
  description: 'Últimas noticias, eventos y actividades del programa de Hidrógeno Verde en La Araucanía.',
};

// Placeholder noticias — en producción vendrán de Payload CMS
const noticiasPlaceholder = [
  {
    slug: 'lanzamiento-programa-h2v-araucania',
    titulo: 'Se lanza el Programa Estratégico Regional de Hidrógeno Verde en La Araucanía',
    extracto: 'Con la participación de autoridades regionales y nacionales, se da inicio al programa que busca posicionar a La Araucanía como un actor clave en la industria del hidrógeno verde.',
    fecha: '2026-03-15',
    categoria: 'general',
  },
  {
    slug: 'primera-reunion-consejo-directivo',
    titulo: 'Primera reunión del Consejo de Dirección del H2V Araucanía',
    extracto: 'Se conformó oficialmente el Consejo de Dirección con representantes de los ministerios de Energía, Medio Ambiente y Economía, junto a universidades y comunidades locales.',
    fecha: '2026-03-20',
    categoria: 'gobernanza',
  },
  {
    slug: 'diagnostico-demanda-regional',
    titulo: 'Inicia diagnóstico de demanda y capacidad productiva regional',
    extracto: 'El equipo técnico de la Universidad de Talca comenzó el levantamiento de información sobre el potencial productivo de la región para el hidrógeno verde.',
    fecha: '2026-03-22',
    categoria: 'proyecto',
  },
];

const categoriasColor: Record<string, string> = {
  general: 'bg-blue-100 text-blue-700',
  gobernanza: 'bg-purple-100 text-purple-700',
  proyecto: 'bg-green-100 text-green-700',
  seminario: 'bg-amber-100 text-amber-700',
  taller: 'bg-cyan-100 text-cyan-700',
  acuerdo: 'bg-rose-100 text-rose-700',
};

export default function Noticias() {
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
          {noticiasPlaceholder.map((noticia) => (
            <article key={noticia.slug} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-[#0D7377]/20 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <time className="text-sm text-gray-400" dateTime={noticia.fecha}>
                  {new Date(noticia.fecha).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })}
                </time>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoriasColor[noticia.categoria] || 'bg-gray-100 text-gray-600'}`}>
                  {noticia.categoria}
                </span>
              </div>
              <Link href={`/noticias/${noticia.slug}`}>
                <h2 className="text-xl font-semibold text-[#1B3A5C] hover:text-[#0D7377] transition-colors mb-2">
                  {noticia.titulo}
                </h2>
              </Link>
              <p className="text-gray-600 text-sm leading-relaxed">{noticia.extracto}</p>
              <Link href={`/noticias/${noticia.slug}`} className="inline-block mt-3 text-sm font-medium text-[#0D7377] hover:underline">
                Leer más →
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
