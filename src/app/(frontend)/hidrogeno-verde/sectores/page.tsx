import type { Metadata } from 'next';
import { getPayload } from '@/lib/payload/getPayload';
import { requireFeature } from '@/lib/featureGate';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Sectores Productivos',
  description: 'Sectores productivos de La Araucanía con potencial de integración del hidrógeno verde.',
};

const defaultSectores = [
  {
    nombre: 'Sector Forestal',
    icon: '🌲',
    color: 'bg-green-50 border-green-200',
    desc: 'La Araucanía es una de las principales regiones forestales de Chile. La biomasa residual de la industria forestal (corteza, aserrín, chips) puede utilizarse como fuente de energía para la producción de hidrógeno verde, o como materia prima para la co-electrólisis.',
    oportunidades: [
      'Biomasa residual como fuente energética para electrólisis',
      'Secado de madera con calor generado por celdas de combustible H2',
      'Descarbonización de calderas industriales forestales',
      'Producción de biocombustibles sintéticos a partir de biomasa + H2',
    ],
  },
  {
    nombre: 'Sector Agroindustrial',
    icon: '🌾',
    color: 'bg-amber-50 border-amber-200',
    desc: 'La actividad agrícola y ganadera de la región puede beneficiarse del hidrógeno verde para procesos de calor, fertilizantes verdes y descarbonización de la cadena de frío.',
    oportunidades: [
      'Amoníaco verde para fertilizantes regionales',
      'Calor de proceso para secado de granos y frutas',
      'Cadena de frío descarbonizada para exportación frutícola',
      'Maquinaria agrícola con celdas de combustible',
    ],
  },
  {
    nombre: 'Transporte',
    icon: '🚛',
    color: 'bg-blue-50 border-blue-200',
    desc: 'El transporte pesado y de larga distancia es uno de los sectores más difíciles de descarbonizar. El hidrógeno verde ofrece autonomía y tiempos de recarga superiores a las baterías para camiones y buses interurbanos.',
    oportunidades: [
      'Buses interurbanos con celdas de combustible',
      'Flotas de camiones forestales y agrícolas',
      'Estaciones de hidrógeno en corredores logísticos',
      'Transporte ferroviario (si se reactiva la red regional)',
    ],
  },
  {
    nombre: 'Energía Geotérmica',
    icon: '🌋',
    color: 'bg-red-50 border-red-200',
    desc: 'La Araucanía se ubica sobre el arco volcánico andino, con significativo potencial geotérmico. La energía geotérmica provee electricidad de base (24/7) ideal para alimentar electrolizadores de forma continua, a diferencia de la energía eólica o solar que son intermitentes.',
    oportunidades: [
      'Electricidad geotérmica de base para electrólisis continua',
      'Mayor factor de planta que eólica/solar → menor costo de H2',
      'Aprovechamiento de calor residual geotérmico en procesos industriales',
      'Diferenciador competitivo: única región de Chile con este potencial combinado',
    ],
  },
  {
    nombre: 'Generación Distribuida',
    icon: '⚡',
    color: 'bg-purple-50 border-purple-200',
    desc: 'El hidrógeno verde permite almacenar energía renovable para comunidades rurales aisladas, proporcionando electricidad y calor de forma autónoma.',
    oportunidades: [
      'Microgrids H2V para comunidades rurales y mapuche',
      'Almacenamiento estacional de energía renovable',
      'Respaldo energético para zonas sin conexión a la red',
      'Sistemas de cogeneración (electricidad + calor) con celdas de combustible',
    ],
  },
  {
    nombre: 'Turismo Sostenible',
    icon: '🏔️',
    color: 'bg-cyan-50 border-cyan-200',
    desc: 'La Araucanía es un destino turístico de naturaleza (parques nacionales, lagos, volcanes). La descarbonización del sector turístico mediante H2V puede ser un diferenciador competitivo y atraer turismo consciente.',
    oportunidades: [
      'Transporte turístico cero emisiones (buses, lanchas)',
      'Hoteles y lodges con energía de hidrógeno',
      'Certificación de turismo carbono neutral',
      'Rutas turísticas de energías limpias como atractivo',
    ],
  },
];

export default async function Sectores() {
  requireFeature('sectores');
  let heroTitulo = 'Sectores Productivos';
  let heroSubtitulo = 'Sectores de La Araucanía con potencial de integración del hidrógeno verde para su desarrollo sostenible.';
  let sectores = defaultSectores;

  try {
    const payload = await getPayload();
    const data = await payload.findGlobal({ slug: 'pagina-sectores' });
    if (data?.hero?.titulo) heroTitulo = data.hero.titulo;
    if (data?.hero?.subtitulo) heroSubtitulo = data.hero.subtitulo;
    if (data?.sectores && data.sectores.length > 0) {
      sectores = data.sectores.map((s, i) => ({
        nombre: s.nombre,
        icon: s.icono || defaultSectores[i]?.icon || '•',
        color: defaultSectores[i]?.color || 'bg-gray-50 border-gray-200',
        desc: s.descripcion,
        oportunidades: s.oportunidades?.map((o) => o.texto) || [],
      }));
    }
  } catch {
    // Use defaults
  }
  return (
    <div>
      <section className="bg-h2v-blue text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-semibold mb-4">{heroTitulo}</h1>
          <p className="text-lg opacity-80 max-w-2xl mx-auto">
            {heroSubtitulo}
          </p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto space-y-8">
          {sectores.map((sector) => (
            <div key={sector.nombre} className={`rounded-xl p-8 border ${sector.color}`}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{sector.icon}</span>
                <h2 className="text-2xl font-bold text-h2v-blue">{sector.nombre}</h2>
              </div>
              <p className="text-gray-700 mb-6">{sector.desc}</p>
              <h3 className="text-sm font-semibold text-h2v-green uppercase tracking-wider mb-3">Oportunidades para la región</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {sector.oportunidades.map((op, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-h2v-green mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {op}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
