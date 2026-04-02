import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getPayload } from '@/lib/payload/getPayload';

export const dynamic = 'force-dynamic';
import { RichText } from '@payloadcms/richtext-lexical/react';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const payload = await getPayload();
  const { docs } = await payload.find({
    collection: 'noticias',
    where: { slug: { equals: slug } },
    limit: 1,
  });
  const noticia = docs[0];
  if (!noticia) return { title: 'Noticia no encontrada' };

  const title = noticia.titulo as string;
  const description = (noticia.extracto as string) || undefined;
  const imagenField = noticia.imagen;
  const imageUrl =
    imagenField && typeof imagenField === 'object'
      ? (imagenField as { url?: string }).url
      : undefined;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | H2V Araucanía`,
      description,
      type: 'article',
      ...(imageUrl ? { images: [{ url: imageUrl }] } : {}),
    },
  };
}

const categoriasColor: Record<string, string> = {
  general: 'bg-blue-100 text-blue-700',
  gobernanza: 'bg-purple-100 text-purple-700',
  proyecto: 'bg-green-100 text-green-700',
  seminario: 'bg-amber-100 text-amber-700',
  taller: 'bg-cyan-100 text-cyan-700',
  acuerdo: 'bg-rose-100 text-rose-700',
};

export default async function NoticiaDetalle({ params }: Props) {
  const { slug } = await params;
  const payload = await getPayload();
  const { docs } = await payload.find({
    collection: 'noticias',
    where: { slug: { equals: slug } },
    limit: 1,
  });

  const noticia = docs[0];
  if (!noticia) notFound();

  // Field is 'imagen' in the Noticias collection, not 'imagenPortada'
  const imagenField = noticia.imagen;
  const imageUrl =
    imagenField && typeof imagenField === 'object'
      ? (imagenField as { url?: string }).url
      : null;
  const imageAlt =
    imagenField && typeof imagenField === 'object'
      ? (imagenField as { alt?: string }).alt
      : undefined;

  return (
    <div>
      {/* Header */}
      <section className="bg-h2v-blue text-white py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/noticias"
            className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white mb-6 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Volver a noticias
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <time
              className="text-sm text-white/60"
              dateTime={noticia.fecha as string}
            >
              {new Date(noticia.fecha as string).toLocaleDateString('es-CL', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </time>
            {noticia.categoria && (
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoriasColor[noticia.categoria as string] || 'bg-gray-100 text-gray-600'}`}
              >
                {noticia.categoria as string}
              </span>
            )}
          </div>

          <h1 className="text-2xl md:text-4xl font-bold leading-tight">
            {noticia.titulo as string}
          </h1>

          {noticia.extracto && (
            <p className="mt-4 text-lg text-white/70 leading-relaxed">
              {noticia.extracto as string}
            </p>
          )}
        </div>
      </section>

      {/* Image */}
      {imageUrl && (
        <div className="max-w-3xl mx-auto px-4 -mt-4">
          <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg">
            <Image
              src={imageUrl}
              alt={imageAlt || (noticia.titulo as string)}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      )}

      {/* Body - use Payload Lexical richText renderer */}
      <article className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          {noticia.contenido ? (
            <div className="prose prose-lg max-w-none prose-headings:text-h2v-blue prose-a:text-h2v-green">
              <RichText data={noticia.contenido} />
            </div>
          ) : (
            <p className="text-gray-500 italic">
              Esta noticia aun no tiene contenido detallado.
            </p>
          )}

          {/* Source link */}
          {noticia.fuenteUrl && (
            <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-500">
                Fuente original:{' '}
                <a
                  href={noticia.fuenteUrl as string}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-h2v-green hover:underline"
                >
                  {noticia.fuenteUrl as string}
                </a>
              </p>
            </div>
          )}
        </div>
      </article>

      {/* Back link */}
      <div className="max-w-3xl mx-auto px-4 pb-12">
        <Link
          href="/noticias"
          className="inline-flex items-center gap-2 text-sm font-medium text-h2v-green hover:underline"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Ver todas las noticias
        </Link>
      </div>
    </div>
  );
}
