import type { Metadata } from 'next';
import Image from 'next/image';
import { getPayload } from '@/lib/payload/getPayload';
import { RichText } from '@payloadcms/richtext-lexical/react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Quiénes Somos',
  description: 'Conozca el equipo, instituciones y actores del Programa Estratégico Regional de Hidrógeno Verde en La Araucanía.',
  openGraph: {
    title: 'Quiénes Somos | H2V Araucanía',
    description: 'Conozca el equipo, instituciones y actores del Programa Estratégico Regional de Hidrógeno Verde en La Araucanía.',
  },
};

const defaultInstituciones = [
  { nombre: 'CORFO', rol: 'Financiamiento del Bien Público', logo: '/logos/BP H2V Araucanía - Logo Corfo Azul.png' },
  { nombre: 'CODESSER', rol: 'Ejecutor del proyecto', logo: '/logos/BP H2V Araucanía - Logo CES4.0.png' },
  { nombre: 'Universidad de Talca', rol: 'Co-ejecutor técnico', logo: '/logos/BP H2V Araucanía - Logo Utalca.png' },
  { nombre: 'Seremi de Energía Araucanía', rol: 'Mandante — Subsecretaría de Energía', logo: '/logos/BP H2V Araucanía - Logo Seremi Energía Araucanía.png' },
];

export default async function QuienesSomos() {
  const payload = await getPayload();

  // CMS Global data
  let heroTitulo = 'Quiénes Somos';
  let heroSubtitulo = 'El Programa Estratégico Regional de Hidrógeno Verde de La Araucanía impulsa el crecimiento socioeconómico regional mediante tecnologías de hidrógeno verde.';
  let bienPublicoTitulo = 'El Bien Público';
  let bienPublicoContenido: any = null;
  let instituciones = defaultInstituciones;
  let consejoTitulo = 'Consejo de Dirección del Hidrógeno Verde de Araucanía';
  let consejoDesc = 'Instancia estratégica encargada de definir la visión, aprobar planes de desarrollo y supervisar el progreso del proyecto.';
  let comiteTitulo = 'Comité Consultivo Técnico Científico';
  let comiteDesc = 'Integrado por miembros de la sociedad civil, ONGs y otros actores relevantes para fiscalizar y transparentar el desarrollo del proyecto.';

  try {
    const global = await payload.findGlobal({ slug: 'pagina-quienes-somos' });
    if (global?.hero?.titulo) heroTitulo = global.hero.titulo as string;
    if (global?.hero?.subtitulo) heroSubtitulo = global.hero.subtitulo as string;
    if ((global?.bienPublico as any)?.titulo) bienPublicoTitulo = (global.bienPublico as any).titulo as string;
    if ((global?.bienPublico as any)?.contenido) bienPublicoContenido = (global.bienPublico as any).contenido;
    if ((global?.instituciones as any[])?.length > 0) {
      instituciones = (global.instituciones as any[]).map((inst: any) => ({
        nombre: inst.nombre,
        rol: inst.rol,
        logo: inst.logo?.url || inst.logo || '',
      }));
    }
    if (global?.consejoTitulo) consejoTitulo = global.consejoTitulo as string;
    if (global?.consejoDescripcion) consejoDesc = global.consejoDescripcion as string;
    if (global?.comiteTitulo) comiteTitulo = global.comiteTitulo as string;
    if (global?.comiteDescripcion) comiteDesc = global.comiteDescripcion as string;
  } catch {
    // Use defaults
  }

  const { docs: consejo } = await payload.find({
    collection: 'miembros',
    where: { instancia: { equals: 'consejo' } },
    sort: 'orden',
    limit: 50,
  });

  const { docs: comite } = await payload.find({
    collection: 'miembros',
    where: { instancia: { equals: 'comite' } },
    sort: 'orden',
    limit: 50,
  });

  const { docs: unidad } = await payload.find({
    collection: 'miembros',
    where: { instancia: { equals: 'unidad' } },
    sort: 'orden',
    limit: 50,
  });

  // Fallback data when CMS is empty
  const consejoFallback = [
    { inst: 'Asociaciones empresariales', cargo: 'Presidente', titular: 'Por definir', aporte: 'Vinculación con el sector y orientación estratégica' },
    { inst: 'Ministerio de Energía', cargo: 'Director', titular: 'Por definir', aporte: 'Orientación en políticas públicas' },
    { inst: 'Ministerio de Medio Ambiente', cargo: 'Director', titular: 'Por definir', aporte: 'Articulación con instituciones del Estado' },
    { inst: 'Ministerio de Economía', cargo: 'Director', titular: 'Por definir', aporte: 'Articulación con instituciones del Estado' },
    { inst: 'Gobierno Regional', cargo: 'Director', titular: 'Por definir', aporte: 'Desarrollo productivo e innovación tecnológica' },
    { inst: 'Comunidades Indígenas', cargo: 'Consejero', titular: 'Por definir', aporte: 'Mirada en decisiones sobre proyectos energéticos' },
    { inst: 'Universidades Locales', cargo: 'Consejero', titular: 'Por definir', aporte: 'Vinculación, orientación e información de tendencias' },
    { inst: 'Experto Nacional/Internacional', cargo: 'Experto', titular: 'Por definir', aporte: 'Retroalimentación técnica y vinculación con la industria' },
  ];

  const consejoData = consejo.length > 0
    ? consejo.map((m: any) => ({ inst: m.institucion, cargo: m.cargo, titular: m.nombre, aporte: m.aporte || '' }))
    : consejoFallback;

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

      {/* Descripción del BP */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-h2v-blue mb-6">{bienPublicoTitulo}</h2>
          <div className="prose prose-lg max-w-none text-gray-700">
            {bienPublicoContenido ? (
              <RichText data={bienPublicoContenido} />
            ) : (
              <p>
                El proyecto &quot;Empoderando a los sectores Agroforestal y Productivo con Hidrógeno Verde: Un camino hacia el Desarrollo Sostenible en la Región de la Araucanía&quot; (código 24BP-269085) tiene como objetivo impulsar el crecimiento socioeconómico en la Región de la Araucanía mediante el aprovechamiento de las tecnologías de hidrógeno verde, la mejora del capital humano y el desarrollo de estrategias de financiamiento para capitalizar el potencial regional y las agendas globales de sostenibilidad.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Instituciones */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-h2v-blue mb-8 text-center">Instituciones Participantes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {instituciones.map((inst) => (
              <div key={inst.nombre} className="bg-white rounded-xl p-6 shadow-sm text-center border border-gray-100">
                {inst.logo && (
                  <div className="h-16 flex items-center justify-center mb-4">
                    <Image src={inst.logo} alt={inst.nombre} width={120} height={60} className="h-12 w-auto object-contain" />
                  </div>
                )}
                <h3 className="font-semibold text-h2v-blue mb-1">{inst.nombre}</h3>
                <p className="text-sm text-gray-500">{inst.rol}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Consejo de Dirección */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-h2v-blue mb-4">{consejoTitulo}</h2>
          <p className="text-gray-600 mb-8">
            {consejoDesc}
          </p>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-h2v-blue text-white">
                <tr>
                  <th className="px-6 py-3 text-sm font-medium">Institución</th>
                  <th className="px-6 py-3 text-sm font-medium">Cargo</th>
                  <th className="px-6 py-3 text-sm font-medium">Titular</th>
                  <th className="px-6 py-3 text-sm font-medium hidden md:table-cell">Aporte al BP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {consejoData.map((row: any, i: number) => (
                  <tr key={i} className={i % 2 === 1 ? 'bg-gray-50' : ''}>
                    <td className="px-6 py-3 text-sm font-medium text-gray-900">{row.inst}</td>
                    <td className="px-6 py-3 text-sm text-gray-600">{row.cargo}</td>
                    <td className="px-6 py-3 text-sm text-gray-600 italic">{row.titular}</td>
                    <td className="px-6 py-3 text-sm text-gray-500 hidden md:table-cell">{row.aporte}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-400 mt-4 italic">
            {consejo.length === 0 && 'Los integrantes serán confirmados por la Unidad de Coordinación y ratificados en reunión del Consejo.'}
          </p>
        </div>
      </section>

      {/* Comité Consultivo */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-h2v-blue mb-4">{comiteTitulo}</h2>
          <p className="text-gray-600 mb-4">
            {comiteDesc}
          </p>
          {comite.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {comite.map((m: any) => (
                <div key={m.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-h2v-green/10 flex items-center justify-center shrink-0">
                    <span className="text-h2v-green font-bold text-lg">{m.nombre?.charAt(0) || '?'}</span>
                  </div>
                  <div>
                    <p className="font-medium text-h2v-blue">{m.nombre}</p>
                    <p className="text-sm text-gray-500">{m.cargo} — {m.institucion}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-h2v-green/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-h2v-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-h2v-blue">Reuniones de trabajo</p>
                  <p className="text-sm text-gray-500">Periodicidad mensual — Presencial y/o videoconferencia</p>
                </div>
              </div>
              <p className="text-sm text-gray-400 mt-4 italic">
                Los integrantes del Comité Consultivo serán definidos durante la ejecución del programa.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Unidad de Coordinación - si hay datos */}
      {unidad.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-h2v-blue mb-6">Unidad de Coordinación y Gestión</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {unidad.map((m: any) => (
                <div key={m.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <p className="font-semibold text-h2v-blue">{m.nombre}</p>
                  <p className="text-sm text-h2v-green">{m.cargo}</p>
                  <p className="text-sm text-gray-500">{m.institucion}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
