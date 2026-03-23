import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Hidrógeno Verde',
  description: 'Todo sobre el hidrógeno verde: qué es, cómo se produce, cadena de valor, derivados y aplicaciones.',
};

export default function HidrogenoVerde() {
  return (
    <div>
      <section className="bg-gradient-to-br from-[#0D7377] to-[#1B3A5C] text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Hidrógeno Verde</h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            El hidrógeno verde es un vector energético producido mediante electrólisis del agua utilizando energías renovables. No genera emisiones de CO2 y es clave para la descarbonización de la economía.
          </p>
        </div>
      </section>

      {/* ¿Qué es? */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-[#1B3A5C] mb-6">¿Qué es el Hidrógeno Verde?</h2>
          <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
            <p>
              El hidrógeno (H₂) es el elemento más abundante del universo. Cuando se produce a partir de agua (H₂O) utilizando electricidad de fuentes renovables — como la energía eólica, solar o hidroeléctrica — se denomina <strong>hidrógeno verde</strong>, porque su proceso de producción no genera emisiones de gases de efecto invernadero.
            </p>
            <p>
              A diferencia del hidrógeno gris (producido a partir de gas natural) o el hidrógeno azul (con captura de carbono), el hidrógeno verde es completamente limpio en toda su cadena de producción.
            </p>
          </div>
        </div>
      </section>

      {/* Electrólisis */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-[#1B3A5C] mb-8">Proceso de Electrólisis</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: '1', title: 'Energía Renovable', desc: 'La electricidad proviene de fuentes limpias: eólica, solar, hidroeléctrica o geotérmica. La Araucanía cuenta con potencial eólico, de biomasa y geotérmico.' },
              { step: '2', title: 'Electrolizador', desc: 'El agua (H₂O) se separa en hidrógeno (H₂) y oxígeno (O₂) mediante una corriente eléctrica en un dispositivo llamado electrolizador.' },
              { step: '3', title: 'Hidrógeno Verde', desc: 'El H₂ producido se almacena, transporta y utiliza como combustible limpio o materia prima industrial. El oxígeno se libera sin impacto ambiental.' },
            ].map((item) => (
              <div key={item.step} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="w-10 h-10 rounded-full bg-[#0D7377] flex items-center justify-center text-white font-bold mb-4">{item.step}</div>
                <h3 className="text-lg font-semibold text-[#1B3A5C] mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tipos de electrolizadores */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-[#1B3A5C] mb-8">Tipos de Electrolizadores</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Alcalino (AEL)', desc: 'Tecnología más madura y económica. Usa una solución alcalina (KOH) como electrolito. Ideal para producción a gran escala.', maturity: 'Alta', cost: 'Bajo' },
              { name: 'PEM', desc: 'Membrana de intercambio protónico. Más compacto, respuesta rápida, ideal para acoplamiento con renovables variables (eólica, solar).', maturity: 'Media-Alta', cost: 'Medio' },
              { name: 'SOEC', desc: 'Electrolizador de óxido sólido. Opera a alta temperatura (700-900°C). Mayor eficiencia pero en fase de desarrollo comercial.', maturity: 'Baja', cost: 'Alto' },
            ].map((tipo) => (
              <div key={tipo.name} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-[#0D7377] mb-2">{tipo.name}</h3>
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
          <h2 className="text-2xl font-bold text-[#1B3A5C] mb-8">Cadena de Valor del Hidrógeno Verde</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { icon: '⚡', title: 'Producción', desc: 'Electrólisis con energía renovable' },
              { icon: '💧', title: 'Conversión', desc: 'Amoníaco, metanol, e-combustibles' },
              { icon: '📦', title: 'Almacenamiento', desc: 'Tanques, cavernas salinas, hidruros' },
              { icon: '🚛', title: 'Transporte', desc: 'Tuberías, camiones, barcos' },
              { icon: '🏭', title: 'Uso Final', desc: 'Industria, transporte, calor, electricidad' },
            ].map((step) => (
              <div key={step.title} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
                <div className="text-3xl mb-2">{step.icon}</div>
                <h3 className="text-sm font-semibold text-[#1B3A5C] mb-1">{step.title}</h3>
                <p className="text-xs text-gray-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Derivados */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-[#1B3A5C] mb-8">Derivados del Hidrógeno Verde</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { name: 'Amoníaco verde (NH₃)', desc: 'Principal vector para transporte marítimo de H₂. Usado en fertilizantes, refrigeración industrial y como combustible para barcos.', use: 'Fertilizantes, transporte marítimo' },
              { name: 'Metanol verde (CH₃OH)', desc: 'Combustible y materia prima química. Se produce combinando H₂ con CO₂ capturado. Usado en la industria química y como combustible.', use: 'Química, combustible' },
              { name: 'E-combustibles sintéticos', desc: 'Combustibles líquidos producidos con H₂ verde y CO₂. Compatibles con motores e infraestructura existente (e-gasolina, e-diésel, SAF).', use: 'Aviación, transporte pesado' },
              { name: 'Acero verde', desc: 'El H₂ reemplaza al carbón como agente reductor en la siderurgia, eliminando las emisiones del proceso.', use: 'Industria siderúrgica' },
            ].map((d) => (
              <div key={d.name} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-[#0D7377] mb-2">{d.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{d.desc}</p>
                <p className="text-xs text-gray-400"><strong>Aplicación:</strong> {d.use}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Links a subsecciones */}
      <section className="py-16 px-4 bg-[#1B3A5C]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Explora más</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'Sectores Productivos', href: '/hidrogeno-verde/sectores', desc: 'Potencial H2V en La Araucanía' },
              { title: 'Capital Humano', href: '/hidrogeno-verde/capital-humano', desc: 'Formación y capacitación' },
              { title: 'Hoja de Ruta', href: '/hidrogeno-verde/hoja-de-ruta', desc: 'Estrategia regional 2024-2050' },
              { title: 'Marco Regulatorio', href: '/hidrogeno-verde/marco-regulatorio', desc: 'Normativa y políticas' },
            ].map((link) => (
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
