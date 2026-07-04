import type { Metadata } from 'next';
import Link from 'next/link';
import { getPayload } from '@/lib/payload/getPayload';
import { requireFeature } from '@/lib/featureGate';
import { RichText } from '@payloadcms/richtext-lexical/react';
import type { PaginaH2V } from '@/payload-types';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Hidrógeno Verde',
  description: 'Todo sobre el hidrógeno verde: qué es, cómo se produce, cadena de valor, derivados y aplicaciones.',
  openGraph: {
    title: 'Hidrógeno Verde | H2V Araucanía',
    description: 'Todo sobre el hidrógeno verde: qué es, cómo se produce, cadena de valor, derivados y aplicaciones.',
  },
};

const defaultElectrolisis = [
  { step: '1', title: 'Energía Renovable', desc: 'La electricidad proviene de fuentes limpias: eólica, solar, hidroeléctrica o geotérmica. La Araucanía cuenta con potencial eólico, de biomasa y geotérmico.' },
  { step: '2', title: 'Electrolizador', desc: 'El agua (H₂O) se separa en hidrógeno (H₂) y oxígeno (O₂) mediante una corriente eléctrica en un dispositivo llamado electrolizador.' },
  { step: '3', title: 'Hidrógeno Verde', desc: 'El H₂ producido se almacena, transporta y utiliza como combustible limpio o materia prima industrial. El oxígeno se libera sin impacto ambiental.' },
];

const defaultElectrolizadores = [
  { name: 'Alcalino (AEL)', desc: 'Tecnología más madura y económica. Usa una solución alcalina (KOH) como electrolito. Ideal para producción a gran escala.', maturity: 'Alta', cost: 'Bajo' },
  { name: 'PEM', desc: 'Membrana de intercambio protónico. Más compacto, respuesta rápida, ideal para acoplamiento con renovables variables (eólica, solar).', maturity: 'Media-Alta', cost: 'Medio' },
  { name: 'SOEC', desc: 'Electrolizador de óxido sólido. Opera a alta temperatura (700-900°C). Mayor eficiencia pero en fase de desarrollo comercial.', maturity: 'Baja', cost: 'Alto' },
];

const defaultCadena = [
  { icon: '⚡', title: 'Producción', desc: 'Electrólisis con energía renovable' },
  { icon: '💧', title: 'Conversión', desc: 'Amoníaco, metanol, e-combustibles' },
  { icon: '📦', title: 'Almacenamiento', desc: 'Tanques, cavernas salinas, hidruros' },
  { icon: '🚛', title: 'Transporte', desc: 'Tuberías, camiones, barcos' },
  { icon: '🏭', title: 'Uso Final', desc: 'Industria, transporte, calor, electricidad' },
];

const defaultDerivados = [
  { name: 'Amoníaco verde (NH₃)', desc: 'Principal vector para transporte marítimo de H₂. Usado en fertilizantes, refrigeración industrial y como combustible para barcos.', use: 'Fertilizantes, transporte marítimo' },
  { name: 'Metanol verde (CH₃OH)', desc: 'Combustible y materia prima química. Se produce combinando H₂ con CO₂ capturado. Usado en la industria química y como combustible.', use: 'Química, combustible' },
  { name: 'E-combustibles sintéticos', desc: 'Combustibles líquidos producidos con H₂ verde y CO₂. Compatibles con motores e infraestructura existente (e-gasolina, e-diésel, SAF).', use: 'Aviación, transporte pesado' },
  { name: 'Acero verde', desc: 'El H₂ reemplaza al carbón como agente reductor en la siderurgia, eliminando las emisiones del proceso.', use: 'Industria siderúrgica' },
];

const defaultExploraMas = [
  { title: 'Sectores Productivos', href: '/hidrogeno-verde/sectores', desc: 'Potencial H2V en La Araucanía' },
  { title: 'Capital Humano', href: '/hidrogeno-verde/capital-humano', desc: 'Formación y capacitación' },
  { title: 'Hoja de Ruta', href: '/hidrogeno-verde/hoja-de-ruta', desc: 'Estrategia regional 2024-2050' },
  { title: 'Marco Regulatorio', href: '/hidrogeno-verde/marco-regulatorio', desc: 'Normativa y políticas' },
];

export default async function HidrogenoVerde() {
  requireFeature('hidrogenoVerde');
  let heroTitulo = 'Hidrógeno Verde';
  let heroSubtitulo = 'El hidrógeno verde es un vector energético producido mediante electrólisis del agua utilizando energías renovables. No genera emisiones de CO2 y es clave para la descarbonización de la economía.';
  let queEsTitulo = '¿Qué es el Hidrógeno Verde?';
  let queEsContenido: NonNullable<NonNullable<PaginaH2V['queEs']>['contenido']> | null = null;
  let electrolisisTitulo = 'Proceso de Electrólisis';
  let electrolisis = defaultElectrolisis;
  let electrolizadores = defaultElectrolizadores;
  let cadena = defaultCadena;
  let derivados = defaultDerivados;
  let exploraMas = defaultExploraMas;

  try {
    const payload = await getPayload();
    const data = await payload.findGlobal({ slug: 'pagina-h2v' });
    if (data?.hero?.titulo) heroTitulo = data.hero.titulo;
    if (data?.hero?.subtitulo) heroSubtitulo = data.hero.subtitulo;
    if (data?.queEs?.titulo) queEsTitulo = data.queEs.titulo;
    if (data?.queEs?.contenido) queEsContenido = data.queEs.contenido;
    if (data?.electrolisis?.titulo) electrolisisTitulo = data.electrolisis.titulo;
    if (data?.electrolisis?.pasos && data.electrolisis.pasos.length > 0) {
      electrolisis = data.electrolisis.pasos.map((p, i) => ({
        step: String(i + 1), title: p.titulo, desc: p.descripcion,
      }));
    }
    if (data?.electrolizadores && data.electrolizadores.length > 0) {
      electrolizadores = data.electrolizadores.map((e) => ({
        name: e.nombre, desc: e.descripcion, maturity: e.madurez || '', cost: e.costo || '',
      }));
    }
    if (data?.cadenaValor && data.cadenaValor.length > 0) {
      cadena = data.cadenaValor.map((c) => ({
        icon: c.icono || '•', title: c.titulo, desc: c.descripcion,
      }));
    }
    if (data?.derivados && data.derivados.length > 0) {
      derivados = data.derivados.map((d) => ({
        name: d.nombre, desc: d.descripcion, use: d.aplicacion || '',
      }));
    }
    if (data?.exploraMas && data.exploraMas.length > 0) {
      exploraMas = data.exploraMas.map((l) => ({
        title: l.titulo, href: l.enlace, desc: l.descripcion,
      }));
    }
  } catch {
    // Use defaults
  }
  return (
    <div>
      <section className="bg-gradient-to-br from-h2v-green to-h2v-blue text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-semibold mb-4">{heroTitulo}</h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            {heroSubtitulo}
          </p>
        </div>
      </section>

      {/* ¿Qué es? */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-h2v-blue mb-6">{queEsTitulo}</h2>
          <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
            {queEsContenido ? (
              <RichText data={queEsContenido} />
            ) : (
              <>
                <p>
                  El hidrógeno (H₂) es el elemento más abundante del universo. Cuando se produce a partir de agua (H₂O) utilizando electricidad de fuentes renovables — como la energía eólica, solar o hidroeléctrica — se denomina <strong>hidrógeno verde</strong>, porque su proceso de producción no genera emisiones de gases de efecto invernadero.
                </p>
                <p>
                  A diferencia del hidrógeno gris (producido a partir de gas natural) o el hidrógeno azul (con captura de carbono), el hidrógeno verde es completamente limpio en toda su cadena de producción.
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Electrólisis */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-h2v-blue mb-8">{electrolisisTitulo}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {electrolisis.map((item) => (
              <div key={item.step} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="w-10 h-10 rounded-full bg-h2v-green flex items-center justify-center text-white font-bold mb-4">{item.step}</div>
                <h3 className="text-lg font-semibold text-h2v-blue mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tipos de electrolizadores */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-h2v-blue mb-8">Tipos de Electrolizadores</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {electrolizadores.map((tipo) => (
              <div key={tipo.name} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-h2v-green mb-2">{tipo.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{tipo.desc}</p>
                <div className="flex gap-4 text-xs">
                  <div>
                    <span className="text-gray-400">Madurez: </span>
                    <span className="font-medium text-gray-700">{tipo.maturity}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Costo: </span>
                    <span className="font-medium text-gray-700">{tipo.cost}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cadena de valor */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-h2v-blue mb-8">Cadena de Valor del Hidrógeno Verde</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {cadena.map((step) => (
              <div key={step.title} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
                <div className="text-3xl mb-2">{step.icon}</div>
                <h3 className="text-sm font-semibold text-h2v-blue mb-1">{step.title}</h3>
                <p className="text-xs text-gray-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Derivados */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-h2v-blue mb-8">Derivados del Hidrógeno Verde</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {derivados.map((d) => (
              <div key={d.name} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-h2v-green mb-2">{d.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{d.desc}</p>
                <p className="text-xs text-gray-400"><strong>Aplicación:</strong> {d.use}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Links a subsecciones — editables en /admin → Páginas → Hidrógeno Verde → "Explora más" */}
      <section className="py-16 px-4 bg-h2v-blue">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Explora más</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {exploraMas.map((link) => (
              <Link key={link.href} href={link.href} className="bg-white/10 rounded-xl p-5 hover:bg-white/20 transition-colors">
                <h3 className="font-semibold text-white mb-1">{link.title}</h3>
                <p className="text-sm text-white/60">{link.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
