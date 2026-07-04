import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getPayload } from '@/lib/payload/getPayload';
import { publicados } from '@/lib/published';
import { categoriasColor } from '@/lib/categorias';

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
    where: { and: [{ slug: { equals: slug } }, publicados] },
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

export default async function NoticiaDetalle({ params }: Props) {
  const { slug } = await params;
  const payload = await getPayload();
  // Solo noticias publicadas: un borrador no debe ser visible ni por URL directa.
  const { docs } = await payload.find({
    collection: 'noticias',
    where: { and: [{ slug: { equals: slug } }, publicados] },
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

          {/* Nota: se eliminó un bloque "Fuente original" que leía noticia.fuenteUrl,
              campo que nunca existió en la colección Noticias (código muerto detectado
              al generar payload-types.ts, 2026-07-04). Si se quiere esa función, hay
              que agregar primero el campo fuenteUrl a src/collections/Noticias.ts. */}
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
