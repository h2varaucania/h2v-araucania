/**
 * Seed de DOCUMENTOS — carga los entregables oficiales del Bien Público 24BP-269085
 * (carpeta "Productos Finales") a la colección `documentos`, subiendo cada PDF a
 * la colección `media` (Vercel Blob en producción) y creando el registro asociado.
 *
 * Es IDEMPOTENTE: si ya existe un documento con el mismo título, lo salta.
 * Es SEGURO de previsualizar: `--dry` resuelve los PDF e imprime el plan SIN tocar la base.
 *
 * Uso:
 *   npx tsx -r tsconfig-paths/register src/seed-documentos.ts --dry     # solo mostrar plan
 *   DATABASE_URI=... BLOB_READ_WRITE_TOKEN=... PAYLOAD_SECRET=... \
 *     npx tsx -r tsconfig-paths/register src/seed-documentos.ts          # cargar de verdad
 *
 * La carpeta origen de los PDF se toma de DOCS_DIR (o el default OneDrive de abajo).
 */
import fs from 'fs';
import path from 'path';

const DRY = process.argv.includes('--dry');

const DOCS_DIR =
  process.env.DOCS_DIR ||
  '/Users/cvillal/Library/CloudStorage/OneDrive-Personal/Work/Mi unidad/Investigacion/H2V/H2V/Productos Finales';

type Tipo = 'tecnico' | 'difusion' | 'regulatorio' | 'capacitacion';

interface Entrada {
  codigo: string; // prefijo del archivo, ej "1.1 "
  titulo: string;
  descripcion: string; // <= 400 chars
  tipo: Tipo;
  anio: number;
}

// Los 8 entregables con PDF publicable (3.2 y 4.2 quedan fuera: solo .docx / pauta interna CORFO).
const ENTRADAS: Entrada[] = [
  {
    codigo: '1.1 ',
    titulo: 'Línea de base ambiental de La Araucanía',
    descripcion:
      'Caracteriza el uso del suelo, áreas protegidas, humedales y recursos hídricos de La Araucanía para anticipar los impactos de proyectos de hidrógeno verde. Documenta el predominio forestal y agrícola y la pérdida de 63.825 ha de bosque nativo entre 2001 y 2021, e incorpora una dimensión socioambiental construida con actores del territorio.',
    tipo: 'tecnico',
    anio: 2026,
  },
  {
    codigo: '1.2 ',
    titulo: 'Mapas de información relevante para el H2V',
    descripcion:
      'Conjunto de mapas temáticos que integran la demanda energética estimada (agroforestal y productiva) con las zonas protegidas y sitios prioritarios de conservación. Permite leer el territorio considerando a la vez las oportunidades de desarrollo y las restricciones ambientales, para una planificación coherente y sostenible del hidrógeno verde regional.',
    tipo: 'tecnico',
    anio: 2026,
  },
  {
    codigo: '1.3 ',
    titulo: 'Mejores prácticas de la industria del H2V',
    descripcion:
      'Sistematiza las mejores prácticas de la industria del hidrógeno verde en tres pilares: políticas y planificación estratégica, excelencia tecnológica y operativa, y economía circular y sostenibilidad. Combina análisis, estudios de caso y referencias a IRENA, la AIE y la Green Hydrogen Organisation a lo largo de toda la cadena de valor.',
    tipo: 'tecnico',
    anio: 2026,
  },
  {
    codigo: '2.1 ',
    titulo: 'Estimación de demanda de H2V al 2045',
    descripcion:
      'Estima la demanda potencial de hidrógeno verde en La Araucanía al año 2045: 88.745 toneladas anuales en un escenario moderado de adopción. El consumo se concentra en transporte (48% carretero, 17% agroforestal), seguido de procesamiento y secado industrial. Entrega una desagregación por sector y aplicación para orientar la cadena de suministro.',
    tipo: 'tecnico',
    anio: 2026,
  },
  {
    codigo: '2.2 ',
    titulo: 'Evaluación tecnológica de la cadena de suministro',
    descripcion:
      'Describe el estado técnico de las instalaciones críticas de la cadena del hidrógeno verde: generación renovable, desalinización, electrolizadores, almacenamiento, transporte y fertilizantes verdes. Para cada una analiza su madurez comercial, las tendencias de innovación y la dinámica de costos, con proyecciones a cinco y diez años.',
    tipo: 'tecnico',
    anio: 2026,
  },
  {
    codigo: '2.3 ',
    titulo: 'Planificación de escenarios basada en ciencia',
    descripcion:
      'Propone una cadena de suministro de hidrógeno verde para La Araucanía mediante modelización matemática y planificación de escenarios. Considera fuentes renovables diversas y electrólisis de agua de mar, y deriva planes de inversión en producción, transmisión y almacenamiento como herramienta de decisión bajo incertidumbre.',
    tipo: 'tecnico',
    anio: 2026,
  },
  {
    codigo: '4.1 ',
    titulo: 'Mapeo de grupos de interés (stakeholders)',
    descripcion:
      'Presenta una metodología sistemática, basada en la gestión de la cadena de suministro, para abordar los desafíos y oportunidades del hidrógeno verde en La Araucanía. Articula líneas de base ambientales, potenciales de producción y consumo, desarrollo de capital humano e involucramiento de las partes interesadas, para cimentar un ecosistema H2V sólido.',
    tipo: 'tecnico',
    anio: 2026,
  },
  {
    codigo: '5.1 ',
    titulo: 'Política climática y marco estratégico',
    descripcion:
      'Analiza la política climática como marco estratégico para la transición hacia una economía baja en carbono, en el contexto del Acuerdo de París y las Contribuciones Determinadas a Nivel Nacional (NDC). Reporta avances globales y brechas de implementación, el avance económico de la energía limpia y el desacople entre PIB y emisiones.',
    tipo: 'regulatorio',
    anio: 2026,
  },
];

function resolverPdf(codigo: string): string | null {
  if (!fs.existsSync(DOCS_DIR)) return null;
  const archivos = fs.readdirSync(DOCS_DIR);
  // Match robusto por prefijo de código + extensión .pdf (evita problemas de acentos/normalización).
  const match = archivos.find(
    (f) => f.startsWith(codigo) && f.toLowerCase().endsWith('.pdf'),
  );
  return match ? path.join(DOCS_DIR, match) : null;
}

async function main() {
  console.log(`\n📄 Seed de Documentos — ${DRY ? 'DRY RUN (no toca la base)' : 'EJECUCIÓN REAL'}`);
  console.log(`   Carpeta origen: ${DOCS_DIR}`);
  console.log('   ─────────────────────────────────────────────────────────────');

  // Resolver todos los PDF primero; abortar si falta alguno.
  const plan = ENTRADAS.map((e) => {
    const pdf = resolverPdf(e.codigo);
    const bytes = pdf ? fs.statSync(pdf).size : 0;
    return { ...e, pdf, mb: bytes / 1048576 };
  });

  let faltantes = 0;
  for (const p of plan) {
    const nDesc = p.descripcion.length;
    const okDesc = nDesc <= 400 ? '✓' : `✗(${nDesc}>400)`;
    if (!p.pdf) faltantes++;
    console.log(
      `\n   [${p.codigo.trim()}] ${p.titulo}\n` +
        `        tipo=${p.tipo}  año=${p.anio}  desc=${nDesc}chars ${okDesc}\n` +
        `        PDF: ${p.pdf ? `${path.basename(p.pdf)} (${p.mb.toFixed(1)} MB)` : '❌ NO ENCONTRADO'}`,
    );
  }

  if (faltantes > 0) {
    console.error(`\n❌ Faltan ${faltantes} PDF. Revisa DOCS_DIR. No se carga nada.`);
    process.exit(1);
  }
  console.log(`\n   ✅ ${plan.length} PDF resueltos correctamente.`);

  if (DRY) {
    console.log('\n   (DRY RUN) No se creó nada. Quita --dry para cargar.\n');
    process.exit(0);
  }

  // ── Ejecución real: requiere entorno de producción ──
  const { getPayload } = await import('payload');
  const configModule = await import('@payload-config');
  const payload = await getPayload({ config: configModule.default });

  let creados = 0;
  let saltados = 0;
  for (const p of plan) {
    const existentes = await payload.find({
      collection: 'documentos',
      where: { titulo: { equals: p.titulo } },
      limit: 1,
    });
    if (existentes.totalDocs > 0) {
      console.log(`   ⏭  Ya existe: "${p.titulo}" — salto.`);
      saltados++;
      continue;
    }
    console.log(`   ⬆  Subiendo PDF y creando: "${p.titulo}"...`);
    const media = await payload.create({
      collection: 'media',
      data: { alt: `Portada — ${p.titulo}` },
      filePath: p.pdf!,
    });
    await payload.create({
      collection: 'documentos',
      data: {
        titulo: p.titulo,
        descripcion: p.descripcion,
        archivo: media.id,
        tipo: p.tipo,
        anio: p.anio,
      },
    });
    console.log(`   ✓  Creado: "${p.titulo}"`);
    creados++;
  }

  console.log(`\n═══════════════════════════════════════════`);
  console.log(`✅ Documentos: ${creados} creados, ${saltados} ya existían.`);
  console.log(`═══════════════════════════════════════════\n`);
  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Error en seed-documentos:', err);
  process.exit(1);
});
