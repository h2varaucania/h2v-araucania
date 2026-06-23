import type { Metadata } from 'next';
import { getPayload } from '@/lib/payload/getPayload';
import { requireFeature } from '@/lib/featureGate';
import { RichText } from '@payloadcms/richtext-lexical/react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Capital Humano',
  description: 'Formación y capacitación para la industria del hidrógeno verde en La Araucanía.',
};

const defaultPerfiles = [
  'Técnicos en electrólisis y celdas de combustible',
  'Ingenieros de sistemas de almacenamiento de H2',
  'Especialistas en seguridad para manejo de hidrógeno',
  'Operadores de plantas de producción de H2V',
  'Profesionales en regulación energética',
  'Gestores de proyectos de energía renovable',
];

const defaultProgramas = [
  'Programas de capacitación adaptados a necesidades regionales',
  'Alianzas con SENCE para certificación de competencias',
  'Instrumentos CORFO de formación (Viraliza Formación)',
  'Articulación con universidades locales (UFRO, UCT)',
  'Capacitación para sector agroforestal en tecnologías H2V',
  'Programa piloto formativo público-privado',
];

export default async function CapitalHumano() {
  requireFeature('capitalHumano');
  let heroTitulo = 'Capital Humano';
  let heroSubtitulo = 'Formación y desarrollo de competencias para la industria del hidrógeno verde en La Araucanía.';
  let perfiles = defaultPerfiles;
  let programas = defaultProgramas;
  let introduccion: any = null;
  let notaOportunidad: any = null;

  try {
    const payload = await getPayload();
    const data = await payload.findGlobal({ slug: 'pagina-capital-humano' });
    if (data?.hero?.titulo) heroTitulo = data.hero.titulo as string;
    if (data?.hero?.subtitulo) heroSubtitulo = data.hero.subtitulo as string;
    if (data?.introduccion) introduccion = data.introduccion;
    if (data?.notaOportunidad) notaOportunidad = data.notaOportunidad;
    if (data?.perfiles?.length > 0) perfiles = (data.perfiles as any[]).map((p) => p.texto);
    if (data?.programas?.length > 0) programas = (data.programas as any[]).map((p) => p.texto);
  } catch {
    // Use defaults
  }
  return (
    <div>
      <section className="bg-h2v-blue text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">{heroTitulo}</h1>
          <p className="text-lg opacity-80 max-w-2xl mx-auto">
            {heroSubtitulo}
          </p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-h2v-blue mb-6">El desafío de la formación</h2>
          {introduccion ? (
            <div className="prose prose-lg max-w-none text-gray-700 mb-8">
              <RichText data={introduccion} />
            </div>
          ) : (
            <p className="text-gray-700 text-lg mb-8">
              La industria del hidrógeno verde requiere perfiles profesionales especializados que actualmente no existen en la formación tradicional. El programa busca anticiparse a esta demanda desarrollando capacidades en la región.
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="bg-h2v-green/5 rounded-xl p-6 border border-h2v-green/20">
              <h3 className="font-semibold text-h2v-green mb-3">Perfiles emergentes</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                {perfiles.map((p, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-h2v-green font-bold">+</span> {p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-h2v-blue/5 rounded-xl p-6 border border-h2v-blue/20">
              <h3 className="font-semibold text-h2v-blue mb-3">Programas del BP</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                {programas.map((p, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-h2v-blue mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
            <h3 className="font-semibold text-amber-800 mb-2">Oportunidad regional</h3>
            {notaOportunidad ? (
              <div className="prose prose-sm max-w-none text-amber-700">
                <RichText data={notaOportunidad} />
              </div>
            ) : (
              <p className="text-sm text-amber-700">
                La Araucanía puede posicionarse como polo de formación en hidrógeno verde del sur de Chile, aprovechando su infraestructura universitaria (Universidad de La Frontera, Universidad Católica de Temuco) y los programas de capacitación del Bien Público. Los programas específicos se irán publicando a medida que se desarrollen durante la ejecución del proyecto.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
