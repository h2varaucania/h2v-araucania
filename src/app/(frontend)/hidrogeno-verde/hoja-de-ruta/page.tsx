import type { Metadata } from 'next';
import { getPayload } from '@/lib/payload/getPayload';
import { requireFeature } from '@/lib/featureGate';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Hoja de Ruta',
  description: 'Hoja de Ruta del Hidrógeno Verde en La Araucanía: ejes estratégicos y horizonte 2024-2050.',
};

const defaultHitos = [
  { year: '2024', title: 'Inicio del Bien Público', desc: 'Aprobación del proyecto 24BP-269085 por CORFO. Conformación de la gobernanza inicial.', color: 'bg-blue-500' },
  { year: '2025', title: 'Diagnóstico y diseño', desc: 'Diagnóstico de demanda regional. Diseño de programas de capacitación. Estudios de factibilidad.', color: 'bg-blue-500' },
  { year: '2026', title: 'Ejecución del BP', desc: 'Implementación de proyectos piloto. Plataforma web operativa. Programas de formación activos.', color: 'bg-h2v-green' },
  { year: '2027', title: 'Transferencia', desc: 'Transferencia de la plataforma al Ministerio de Energía. Consolidación de la gobernanza regional.', color: 'bg-h2v-green' },
  { year: '2028-2030', title: 'Escalamiento', desc: 'Primeros proyectos comerciales de H2V en la región. Integración con sectores productivos.', color: 'bg-amber-500' },
  { year: '2030-2040', title: 'Consolidación', desc: 'Industria H2V establecida. Exportación de derivados. Araucanía como hub energético del sur.', color: 'bg-amber-500' },
  { year: '2040-2050', title: 'Carbono neutral', desc: 'Contribución plena a la meta de carbono neutralidad de Chile al 2050.', color: 'bg-green-500' },
];

export default async function HojaDeRuta() {
  requireFeature('hojaDeRuta');
  let heroTitulo = 'Hoja de Ruta';
  let heroSubtitulo = 'Estrategia regional para el desarrollo del hidrógeno verde en La Araucanía, horizonte 2024-2050.';
  let hitos = defaultHitos;
  let notaFinal = 'La Hoja de Ruta detallada se publicará como documento descargable una vez completado el proceso de diagnóstico regional.';

  try {
    const payload = await getPayload();
    const data = await payload.findGlobal({ slug: 'pagina-hoja-ruta' });
    if (data?.hero?.titulo) heroTitulo = data.hero.titulo as string;
    if (data?.hero?.subtitulo) heroSubtitulo = data.hero.subtitulo as string;
    if (data?.notaFinal) notaFinal = data.notaFinal as string;
    if (data?.hitos?.length > 0) {
      hitos = (data.hitos as any[]).map((h, i) => ({
        year: h.periodo,
        title: h.titulo,
        desc: h.descripcion,
        color: defaultHitos[i]?.color || 'bg-gray-500',
      }));
    }
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

      {/* Timeline */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" aria-hidden="true" />

            <div className="space-y-8">
              {hitos.map((hito, i) => (
                <div key={i} className="relative pl-16">
                  {/* Dot */}
                  <div className={`absolute left-4 w-5 h-5 rounded-full ${hito.color} border-4 border-white shadow`} aria-hidden="true" />

                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-bold text-h2v-green bg-h2v-green/10 px-3 py-1 rounded-full">{hito.year}</span>
                      <h3 className="text-lg font-semibold text-h2v-blue">{hito.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600">{hito.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-gray-400 italic">
            {notaFinal}
          </p>
        </div>
      </section>
    </div>
  );
}
