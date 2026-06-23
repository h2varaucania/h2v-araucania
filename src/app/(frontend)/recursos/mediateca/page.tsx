import type { Metadata } from 'next';
import { getPayload } from '@/lib/payload/getPayload';
import { requireFeature } from '@/lib/featureGate';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Mediateca',
  description: 'Videos, infografías y material multimedia del programa de Hidrógeno Verde en La Araucanía.',
};

const tipoLabels: Record<string, string> = {
  video: 'Video',
  infografia: 'Infografía',
  presentacion: 'Presentación',
  documento: 'Documento',
};

export default async function Mediateca() {
  requireFeature('mediateca');

  let heroTitulo = 'Mediateca';
  let heroSubtitulo = 'Videos, infografías y material multimedia del programa.';
  let recursos: { titulo: string; tipo: string; url: string; descripcion?: string }[] = [];
  let vacioTitulo = 'Próximamente se publicará material multimedia.';
  let vacioSubtitulo = 'Videos, infografías y presentaciones del programa se alojarán en esta sección.';

  try {
    const payload = await getPayload();
    const data = await payload.findGlobal({ slug: 'pagina-mediateca' });
    if (data?.hero?.titulo) heroTitulo = data.hero.titulo as string;
    if (data?.hero?.subtitulo) heroSubtitulo = data.hero.subtitulo as string;
    if ((data?.recursos as any)?.length > 0) {
      recursos = (data.recursos as any[]).map((r) => ({
        titulo: r.titulo,
        tipo: r.tipo || 'documento',
        url: r.url,
        descripcion: r.descripcion,
      }));
    }
    if ((data?.mensajeVacio as any)?.titulo) vacioTitulo = (data.mensajeVacio as any).titulo as string;
    if ((data?.mensajeVacio as any)?.subtitulo) vacioSubtitulo = (data.mensajeVacio as any).subtitulo as string;
  } catch {
    // Use defaults
  }

  return (
    <div>
      <section className="bg-h2v-blue text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">{heroTitulo}</h1>
          <p className="text-lg opacity-80">{heroSubtitulo}</p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {recursos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recursos.map((r, i) => (
                <a
                  key={i}
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:border-h2v-green transition-colors block"
                >
                  <span className="inline-block text-xs bg-h2v-green/10 text-h2v-green px-2 py-0.5 rounded-full mb-3">
                    {tipoLabels[r.tipo] || r.tipo}
                  </span>
                  <h3 className="font-semibold text-h2v-blue mb-1">{r.titulo}</h3>
                  {r.descripcion ? <p className="text-sm text-gray-500">{r.descripcion}</p> : null}
                </a>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-400 text-lg">{vacioTitulo}</p>
              <p className="text-gray-300 text-sm mt-2">{vacioSubtitulo}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
