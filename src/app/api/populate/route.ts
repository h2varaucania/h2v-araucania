import { NextResponse } from 'next/server';
import { createHash, timingSafeEqual } from 'crypto';
import { getPayload } from '@/lib/payload/getPayload';

// ═══════════════════════════════════════════════════════════════════════════
// Ruta de poblado OFICIAL de un solo uso (2026-07-04).
// Sube el material real del Bien Público: 8 productos finales, gobernanza
// según el Modelo de Sustentabilidad (pág. 8-9), noticias fundadas en
// documentos reales, y retira el contenido de ejemplo no verificable.
// Idempotente: puede llamarse varias veces; solo crea lo que falta.
// Autorización: hash SHA-256 de una clave de un solo uso (la clave NO está
// en el repo ni en variables de entorno). Eliminar esta ruta tras el uso.
// ═══════════════════════════════════════════════════════════════════════════

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const KEY_HASH = '42093fd2348cfa0b76ad69c57630eacd592849ecac5b289f20dc9df705eebccb';

function authorized(req: Request): boolean {
  const provided = req.headers.get('x-populate-key') ?? '';
  const digest = createHash('sha256').update(provided).digest();
  const expected = Buffer.from(KEY_HASH, 'hex');
  return digest.length === expected.length && timingSafeEqual(digest, expected);
}

// richText Lexical mínimo a partir de párrafos planos.
function rt(paras: string[]) {
  return {
    root: {
      type: 'root',
      children: paras.map((text) => ({
        type: 'paragraph',
        children: [{ type: 'text', text, version: 1 }],
        version: 1,
      })),
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      version: 1,
    },
  };
}

// ── Los 8 productos finales del Bien Público ────────────────────────────────
const DOCS: Array<{
  file: string;
  titulo: string;
  descripcion: string;
  tipo: 'tecnico' | 'difusion' | 'regulatorio' | 'capacitacion';
  anio: number;
}> = [
  {
    file: 'bp-h2v-1-1-linea-de-base-ambiental.pdf',
    titulo: 'Línea de Base Ambiental',
    descripcion:
      'Caracterización ambiental de La Araucanía para el desarrollo del hidrógeno verde: usos de la tierra, recursos hídricos y condiciones del territorio. Producto 1.1 del Bien Público.',
    tipo: 'tecnico',
    anio: 2025,
  },
  {
    file: 'bp-h2v-1-2-mapas-informacion-relevante.pdf',
    titulo: 'Mapas de Información Relevante',
    descripcion:
      'Cartografía regional con la información territorial clave para la planificación del hidrógeno verde en La Araucanía. Producto 1.2 del Bien Público.',
    tipo: 'tecnico',
    anio: 2025,
  },
  {
    file: 'bp-h2v-1-3-mejores-practicas.pdf',
    titulo: 'Mejores Prácticas',
    descripcion:
      'Principios, métodos y estándares operativos internacionales de la industria del hidrógeno verde aplicables al contexto regional. Producto 1.3 del Bien Público.',
    tipo: 'tecnico',
    anio: 2025,
  },
  {
    file: 'bp-h2v-2-1-demanda-potencial.pdf',
    titulo: 'Demanda Potencial de Hidrógeno Verde',
    descripcion:
      'Análisis de mercado de la demanda potencial de H₂V en La Araucanía: 88.745 t/año al 2045 en escenario moderado, liderada por el transporte de carga. Producto 2.1 del Bien Público.',
    tipo: 'tecnico',
    anio: 2025,
  },
  {
    file: 'bp-h2v-2-2-evaluacion-tecnologica.pdf',
    titulo: 'Evaluación Tecnológica',
    descripcion:
      'Evaluación de tecnologías de producción, almacenamiento, transporte y usos del hidrógeno verde para la realidad regional. Producto 2.2 del Bien Público.',
    tipo: 'tecnico',
    anio: 2025,
  },
  {
    file: 'bp-h2v-2-3-planificacion-escenarios.pdf',
    titulo: 'Planificación de Escenarios',
    descripcion:
      'Diseño de la cadena de suministro de hidrógeno verde para La Araucanía mediante modelización matemática y análisis de escenarios. Producto 2.3 del Bien Público.',
    tipo: 'tecnico',
    anio: 2025,
  },
  {
    file: 'bp-h2v-4-1-mapeo-grupos-interes.pdf',
    titulo: 'Mapeo de Grupos de Interés',
    descripcion:
      'Identificación y análisis de los actores del ecosistema regional de hidrógeno verde: sector público, privado, academia y sociedad civil. Producto 4.1 del Bien Público.',
    tipo: 'difusion',
    anio: 2025,
  },
  {
    file: 'bp-h2v-5-1-politica-climatica.pdf',
    titulo: 'Política Climática',
    descripcion:
      'Marco de política climática nacional e internacional y su relación con el desarrollo del hidrógeno verde en la región. Producto 5.1 del Bien Público.',
    tipo: 'regulatorio',
    anio: 2025,
  },
];

// ── Gobernanza según Modelo de Sustentabilidad (tablas pág. 8-9) ────────────
const MIEMBROS: Array<{
  nombre: string;
  cargo: string;
  institucion: string;
  instancia: 'consejo' | 'comite' | 'unidad';
  suplente?: string;
  aporte?: string;
  orden: number;
}> = [
  // Unidad de Coordinación y Gestión (nivel operativo) — nombres reales
  { nombre: 'Claudia Martínez', cargo: 'Directora de Proyecto', institucion: 'CODESSER', instancia: 'unidad', suplente: 'Fabián Azócar', aporte: 'Coordinación y ejecución del programa.', orden: 1 },
  { nombre: 'Ernesto Santibáñez', cargo: 'Co-ejecutor', institucion: 'Universidad de Talca', instancia: 'unidad', suplente: 'Carlos Villalobos', aporte: 'Entregar capacidades técnicas al Bien Público.', orden: 2 },
  { nombre: 'Camilo Villagrán', cargo: 'Mandante', institucion: 'Subsecretaría de Energía', instancia: 'unidad', suplente: 'Fernando Figueroa', aporte: 'Velar por la implementación del Bien Público de hidrógeno verde.', orden: 3 },
  { nombre: 'Eduardo Figueroa G.', cargo: 'Ejecutivo Sectorial', institucion: 'CDPR Araucanía', instancia: 'unidad', suplente: 'Alejandra Bejcek', aporte: 'Orientación, seguimiento y evaluación del programa.', orden: 4 },
  { nombre: 'Por definir', cargo: 'Coordinador(a) de Programa', institucion: 'GDC CORFO', instancia: 'unidad', suplente: 'Soledad Herrera', aporte: 'Orientación, seguimiento y evaluación del programa.', orden: 5 },
  // Consejo de Dirección (nivel estratégico) — estructura propuesta en el Modelo
  { nombre: 'Por definir', cargo: 'Presidente', institucion: 'Asociaciones empresariales', instancia: 'consejo', aporte: 'Vinculación con el sector y orientación estratégica.', orden: 1 },
  { nombre: 'Por definir', cargo: 'Director', institucion: 'Ministerio de Energía', instancia: 'consejo', aporte: 'Orientación en políticas públicas y articulación con instituciones del Estado.', orden: 2 },
  { nombre: 'Por definir', cargo: 'Director', institucion: 'Ministerio de Medio Ambiente', instancia: 'consejo', aporte: 'Orientación en políticas públicas y articulación con instituciones del Estado.', orden: 3 },
  { nombre: 'Por definir', cargo: 'Director', institucion: 'Ministerio de Economía', instancia: 'consejo', aporte: 'Orientación en políticas públicas y articulación con instituciones del Estado.', orden: 4 },
  { nombre: 'Por definir', cargo: 'Director', institucion: 'Gobierno Regional de La Araucanía', instancia: 'consejo', aporte: 'Apoyar el desarrollo productivo, la capacitación laboral y la innovación tecnológica.', orden: 5 },
  { nombre: 'Por definir', cargo: 'Consejero', institucion: 'Comunidades Indígenas', instancia: 'consejo', aporte: 'Plantear su mirada en la toma de decisiones sobre proyectos y políticas energéticas.', orden: 6 },
  { nombre: 'Por definir', cargo: 'Consejero', institucion: 'Universidades Locales', instancia: 'consejo', aporte: 'Vinculación con el sector, orientación estratégica e información de tendencias.', orden: 7 },
  { nombre: 'Por definir', cargo: 'Experto', institucion: 'Experto Nacional/Internacional', instancia: 'consejo', aporte: 'Retroalimentación técnica y vinculación con actores de la industria.', orden: 8 },
];

// ── Noticias reales, fundadas en documentos del programa ────────────────────
const NOTICIAS: Array<{
  slug: string;
  titulo: string;
  extracto: string;
  fecha: string;
  categoria: 'seminario' | 'taller' | 'gobernanza' | 'acuerdo' | 'proyecto' | 'general';
  paras: string[];
}> = [
  {
    slug: 'productos-finales-bien-publico-h2v',
    titulo: 'El Bien Público H2V Araucanía publica sus ocho productos finales',
    extracto:
      'Ya están disponibles para descarga los ocho productos técnicos del programa: línea de base ambiental, demanda potencial, evaluación tecnológica, escenarios, mejores prácticas, mapas, grupos de interés y política climática.',
    fecha: '2026-07-04',
    categoria: 'general',
    paras: [
      'El programa "Empoderando a los sectores agroforestal y productivo con Hidrógeno Verde" (Bien Público 24BP-269085) pone a disposición pública sus ocho productos finales, elaborados por CODESSER y la Universidad de Talca con el apoyo de CORFO.',
      'Los documentos incluyen la línea de base ambiental de la región, los mapas de información relevante, el análisis de mejores prácticas internacionales, la estimación de la demanda potencial de hidrógeno verde —88.745 toneladas anuales al 2045 en un escenario moderado—, la evaluación tecnológica, la planificación de escenarios para la cadena de suministro, el mapeo de grupos de interés y el análisis de política climática.',
      'Todos los documentos pueden descargarse desde la sección Documentos de esta plataforma.',
    ],
  },
  {
    slug: 'subsecretaria-energia-estrategia-sustentabilidad',
    titulo: 'La Subsecretaría de Energía respalda la estrategia de sustentabilidad del programa',
    extracto:
      'Mediante la Carta N° 201/2025, la entidad patrocinante presentó la estrategia de sustentabilidad del proyecto, alineada con el Plan de Acción de Hidrógeno Verde 2023-2030.',
    fecha: '2025-05-09',
    categoria: 'gobernanza',
    paras: [
      'La Subsecretaría de Energía, en su calidad de entidad patrocinante del proyecto (código CES40-BPA01-EM-12-001), formalizó mediante la Carta N° 201/2025 la estrategia de sustentabilidad que se implementará durante y después de la ejecución del programa, presentada a CORFO en el informe de Hito Crítico del mes 6.',
      'La estrategia se alinea con el Plan de Acción de Hidrógeno Verde 2023-2030 del Ministerio de Energía, en particular con sus líneas de acción sobre acompañamiento de proyectos de producción y consumo, análisis de impactos a lo largo de la cadena de valor y participación temprana de los territorios.',
      'El Modelo de Sustentabilidad define además la estructura de gobernanza del programa: un Consejo de Dirección de nivel estratégico, un Comité Consultivo Técnico Científico y una Unidad de Coordinación y Gestión de nivel operativo.',
    ],
  },
  {
    slug: 'plataforma-web-oficial-h2v-araucania',
    titulo: 'El programa estrena su plataforma web oficial',
    extracto:
      'La nueva plataforma reúne los documentos técnicos, el mapa de proyectos, la estructura de gobernanza y las novedades del hidrógeno verde en La Araucanía.',
    fecha: '2026-07-04',
    categoria: 'general',
    paras: [
      'El Bien Público H2V Araucanía pone en línea su plataforma web oficial: un punto único de acceso a los avances del programa, sus productos técnicos y las oportunidades del hidrógeno verde para los sectores agroforestal y productivo de la región.',
      'La plataforma permite descargar los productos finales del programa, explorar el mapa de proyectos de hidrógeno verde, conocer la estructura de gobernanza definida en el Modelo de Sustentabilidad y contactar al equipo ejecutor.',
    ],
  },
];

// Contenido de ejemplo del seed que no corresponde a hechos verificables.
const EVENTOS_RETIRAR = [
  'Seminario Internacional de Hidrógeno Verde — Temuco 2025',
  'Taller: Introducción a Tecnologías del H₂V',
  'Reunión Consejo de Dirección — Q3 2025',
];
const PROYECTOS_RETIRAR = ['Planta Piloto H₂V Temuco', 'Bus H₂ Temuco', 'H₂V Forestal Victoria'];

export async function GET() {
  return NextResponse.json({ ok: true, version: 'populate-oficial-v2', blob: Boolean(process.env.BLOB_READ_WRITE_TOKEN) });
}

export async function POST(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ error: 'Not allowed' }, { status: 403 });
  }

  const origin = new URL(req.url).origin;
  const payload = await getPayload();
  const log: string[] = [];
  const deadline = Date.now() + 45_000; // margen bajo maxDuration; re-llamar si partial

  async function fetchFile(urlPath: string, name: string, mimetype: string) {
    const res = await fetch(`${origin}${urlPath}`);
    if (!res.ok) throw new Error(`fetch ${urlPath} → ${res.status}`);
    const data = Buffer.from(await res.arrayBuffer());
    return { data, mimetype, name, size: data.length };
  }

  async function ensureMedia(alt: string, urlPath: string, name: string, mimetype: string): Promise<number> {
    const existing = await payload.find({ collection: 'media', where: { alt: { equals: alt } }, limit: 1 });
    if (existing.totalDocs > 0) return existing.docs[0].id;
    const file = await fetchFile(urlPath, name, mimetype);
    const media = await payload.create({ collection: 'media', data: { alt }, file });
    return media.id;
  }

  let partial = false;
  let mediaBloqueada = false;

  try {
    // ═══ 1. MIEMBROS: retirar placeholders del seed y cargar el Modelo ═══
    // (no depende de archivos — entra aunque falte el Blob store)
    const stale = await payload.delete({ collection: 'miembros', where: { nombre: { like: 'Por designar' } } });
    if (stale.docs.length > 0) log.push(`✓ Retirados ${stale.docs.length} miembros "Por designar" (seed)`);
    for (const m of MIEMBROS) {
      const exists = await payload.find({
        collection: 'miembros',
        where: { and: [{ institucion: { equals: m.institucion } }, { instancia: { equals: m.instancia } }] },
        limit: 1,
      });
      if (exists.totalDocs > 0) { log.push(`⏭ Miembro existente: ${m.institucion} (${m.instancia})`); continue; }
      await payload.create({ collection: 'miembros', data: m });
      log.push(`✓ Miembro: ${m.nombre} — ${m.institucion} [${m.instancia}]`);
    }

    // ═══ 2. Retirar contenido de ejemplo no verificable ═══
    const ev = await payload.delete({ collection: 'eventos', where: { titulo: { in: EVENTOS_RETIRAR } } });
    if (ev.docs.length > 0) log.push(`✓ Retirados ${ev.docs.length} eventos de ejemplo`);
    const pr = await payload.delete({ collection: 'proyectos', where: { nombre: { in: PROYECTOS_RETIRAR } } });
    if (pr.docs.length > 0) log.push(`✓ Retirados ${pr.docs.length} proyectos de ejemplo`);

    // ═══ 3. DOCUMENTOS: 8 productos finales (requiere Blob en Vercel) ═══
    for (const d of DOCS) {
      if (Date.now() > deadline) { partial = true; break; }
      try {
        const exists = await payload.find({ collection: 'documentos', where: { titulo: { equals: d.titulo } }, limit: 1 });
        if (exists.totalDocs > 0) { log.push(`⏭ Documento existente: ${d.titulo}`); continue; }
        const mediaId = await ensureMedia(`BP H2V — ${d.titulo} (PDF)`, `/docs/${d.file}`, d.file, 'application/pdf');
        await payload.create({
          collection: 'documentos',
          data: { titulo: d.titulo, descripcion: d.descripcion, archivo: mediaId, tipo: d.tipo, anio: d.anio },
        });
        log.push(`✓ Documento: ${d.titulo}`);
      } catch (e) {
        mediaBloqueada = true;
        log.push(`✗ Documento pendiente (media): ${d.titulo} — ${e instanceof Error ? e.message : String(e)}`);
        break; // sin storage de archivos no tiene sentido insistir con los demás
      }
    }

    // ═══ 4. NOTICIAS: reales y publicadas (imagen requiere Blob) ═══
    try {
      const imagenId = await ensureMedia('Imagen H2V Araucanía — portada de noticias', '/images/noticia-h2v.png', 'noticia-h2v.png', 'image/png');
      for (const n of NOTICIAS) {
        const exists = await payload.find({ collection: 'noticias', where: { slug: { equals: n.slug } }, limit: 1, draft: true });
        if (exists.totalDocs > 0) { log.push(`⏭ Noticia existente: ${n.slug}`); continue; }
        await payload.create({
          collection: 'noticias',
          data: {
            titulo: n.titulo,
            slug: n.slug,
            extracto: n.extracto,
            contenido: rt(n.paras),
            imagen: imagenId,
            fecha: n.fecha,
            categoria: n.categoria,
            _status: 'published',
          },
        });
        log.push(`✓ Noticia publicada: ${n.titulo}`);
      }
    } catch (e) {
      mediaBloqueada = true;
      log.push(`✗ Noticias pendientes (media): ${e instanceof Error ? e.message : String(e)}`);
    }

    if (mediaBloqueada) {
      log.push('⚠ FALTA STORAGE DE ARCHIVOS: conectar un Blob store al proyecto en Vercel y volver a llamar.');
    }
    log.push(partial ? '⏳ PARCIAL — volver a llamar para continuar' : mediaBloqueada ? '═══ POBLADO SIN ARCHIVOS (falta Blob) ═══' : '═══ POBLADO OFICIAL COMPLETADO ═══');
    return NextResponse.json({ success: true, partial, mediaBloqueada, log });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    log.push(`❌ Error: ${message}`);
    return NextResponse.json({ success: false, partial, mediaBloqueada, log, error: message }, { status: 500 });
  }
}
