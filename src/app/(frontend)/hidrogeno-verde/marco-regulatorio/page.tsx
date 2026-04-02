import type { Metadata } from 'next';
import { getPayload } from '@/lib/payload/getPayload';

export const metadata: Metadata = {
  title: 'Marco Regulatorio',
  description: 'Normativa y políticas para el desarrollo del hidrógeno verde en Chile y La Araucanía.',
};

const defaultDocumentos = [
  {
    titulo: 'Estrategia Nacional de Hidrógeno Verde (2020)',
    desc: 'Documento fundacional del Ministerio de Energía que establece la visión de Chile como exportador de hidrógeno verde. Define metas al 2025, 2030 y 2050 para producción, capacidad instalada y reducción de costos.',
    relevancia: 'Establece el marco nacional dentro del cual se inserta el programa regional de La Araucanía.',
  },
  {
    titulo: 'Plan de Acción de Hidrógeno Verde 2023-2030',
    desc: 'Plan operativo con 5 Líneas de Acción y 30 acciones concretas. La Línea 3 (Acción 19) promueve el acompañamiento de proyectos H2V. La Línea 5 (Acciones 24 y 27) promueve el análisis de impactos y la participación territorial temprana.',
    relevancia: 'El BP 24BP-269085 se enmarca directamente en las Líneas de Acción 3 y 5, según confirma la Carta N° 201/2025 de la Subsecretaría de Energía.',
  },
  {
    titulo: 'Ley de Eficiencia Energética (Ley 21.305)',
    desc: 'Establece el marco para la gestión eficiente de la energía en Chile, incluyendo grandes consumidores, transporte y edificación. Promueve la diversificación de la matriz energética.',
    relevancia: 'Crea incentivos para la adopción de tecnologías limpias, incluyendo el hidrógeno verde como vector energético.',
  },
  {
    titulo: 'Normativa SEC',
    desc: 'La Superintendencia de Electricidad y Combustibles (SEC) regula la seguridad en la producción, almacenamiento y distribución de hidrógeno. La normativa específica para H2V está en desarrollo.',
    relevancia: 'La regulación de seguridad es clave para viabilizar proyectos de producción y uso de hidrógeno en la región.',
  },
  {
    titulo: 'Recomendaciones regulatorias del BP',
    desc: 'El Bien Público generará un informe con recomendaciones regulatorias y políticas para aprovechar las oportunidades del hidrógeno verde en el desarrollo regional.',
    relevancia: 'Este documento será publicado en la sección de Recursos una vez completado durante la ejecución del proyecto.',
  },
];

export default async function MarcoRegulatorio() {
  let heroTitulo = 'Marco Regulatorio';
  let heroSubtitulo = 'Normativa, políticas y lineamientos para el desarrollo del hidrógeno verde en Chile.';
  let documentos = defaultDocumentos;

  try {
    const payload = await getPayload();
    const data = await payload.findGlobal({ slug: 'pagina-marco-regulatorio' });
    if (data?.hero?.titulo) heroTitulo = data.hero.titulo as string;
    if (data?.hero?.subtitulo) heroSubtitulo = data.hero.subtitulo as string;
    if (data?.documentos?.length > 0) {
      documentos = (data.documentos as any[]).map((d) => ({
        titulo: d.titulo,
        desc: d.descripcion,
        relevancia: d.relevancia || '',
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

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          {documentos.map((item, i) => (
            <div key={i} className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-h2v-blue mb-3">{item.titulo}</h2>
              <p className="text-gray-600 mb-4">{item.desc}</p>
              <div className="bg-h2v-green/5 rounded-lg p-4 border border-h2v-green/10">
                <p className="text-sm text-h2v-green"><strong>Relevancia para La Araucanía:</strong> {item.relevancia}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
