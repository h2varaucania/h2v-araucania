import { NextResponse } from 'next/server';
import { getPayload } from '@/lib/payload/getPayload';
import path from 'path';
import fs from 'fs';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not allowed in production' }, { status: 403 });
  }

  // Simple secret check
  const { searchParams } = new URL(req.url);
  if (searchParams.get('key') !== 'seed-h2v-2026') {
    return NextResponse.json({ error: 'Invalid key' }, { status: 401 });
  }

  const payload = await getPayload();
  const log: string[] = [];

  try {
    // ═══════ 1. ADMIN USER ═══════
    const existingUsers = await payload.find({ collection: 'users', limit: 1 });
    if (existingUsers.totalDocs === 0) {
      await payload.create({
        collection: 'users',
        data: {
          email: 'admin@h2varaucania.cl',
          password: 'H2vAdmin2026!',
          nombre: 'Administrador H2V',
          role: 'admin',
        },
      });
      log.push('✓ Usuario admin creado');
    } else {
      log.push('⏭ Ya existe usuario');
    }

    // ═══════ 2. SITIO GENERAL ═══════
    await payload.updateGlobal({
      slug: 'sitio-general',
      data: {
        nombreSitio: 'H2V Araucanía',
        descripcionSEO: 'Plataforma informativa sobre los avances, proyectos y oportunidades del hidrógeno verde en la región de La Araucanía, Chile.',
        footerTexto: 'Plataforma informativa del Bien Público 24BP-269085. Programa Estratégico Regional de Hidrógeno Verde en La Araucanía.',
        footerPrograma: 'Programa Desarrollo Productivo Sostenible — CORFO',
      },
    });
    log.push('✓ Sitio General');

    // ═══════ 3. CONTACTO ═══════
    await payload.updateGlobal({
      slug: 'contacto',
      data: {
        email: 'h2varaucania@gmail.com',
        ubicacion: 'Temuco, Región de La Araucanía, Chile',
        ejecutor1: 'CODESSER — Corporación de Desarrollo Social del Sector Rural',
        ejecutor2: 'Universidad de Talca — Co-ejecutor técnico',
        mandante: 'Subsecretaría de Energía — Ministerio de Energía',
        codigoBP: 'Bien Público 24BP-269085',
      },
    });
    log.push('✓ Contacto');

    // ═══════ 4. PÁGINA DE INICIO ═══════
    await payload.updateGlobal({
      slug: 'pagina-inicio',
      data: {
        hero: {
          titulo: 'Hidrógeno Verde en La Araucanía',
          subtitulo: 'Plataforma informativa sobre los avances, proyectos y oportunidades del hidrógeno verde en la región de La Araucanía, Chile.',
          ctaPrimario: 'Conozca el Programa',
          ctaSecundario: 'Ver Proyectos en el Mapa',
        },
        seccionExplora: {
          titulo: 'Explora el Programa',
          cards: [
            { titulo: '¿Qué es el H2V?', descripcion: 'Conoce el hidrógeno verde: producción, usos y potencial para La Araucanía.', enlace: '/hidrogeno-verde' },
            { titulo: 'Mapa de Proyectos', descripcion: 'Explora los proyectos de hidrógeno verde en la región y el país.', enlace: '/proyectos' },
            { titulo: 'Sectores Productivos', descripcion: 'Sectores con potencial de integración: forestal, agro, transporte y más.', enlace: '/hidrogeno-verde/sectores' },
            { titulo: 'Gobernanza', descripcion: 'Estructura de dirección y gestión del programa.', enlace: '/programa/gobernanza' },
            { titulo: 'Noticias', descripcion: 'Seminarios, talleres, acuerdos y avances del programa.', enlace: '/noticias' },
            { titulo: 'Documentos', descripcion: 'Descarga documentos técnicos, regulatorios y de capacitación.', enlace: '/recursos/documentos' },
          ],
        },
      },
    });
    log.push('✓ Página de Inicio');

    // ═══════ 5. QUIÉNES SOMOS ═══════
    await payload.updateGlobal({
      slug: 'pagina-quienes-somos',
      data: {
        hero: {
          titulo: 'Quiénes Somos',
          subtitulo: 'El Programa Estratégico Regional de Hidrógeno Verde de La Araucanía impulsa el crecimiento socioeconómico regional mediante tecnologías de hidrógeno verde.',
        },
        bienPublico: {
          titulo: 'El Bien Público',
          contenido: { root: { type: 'root', children: [{ type: 'paragraph', children: [{ type: 'text', text: 'El Bien Público 24BP-269085 "Programa Estratégico Regional de Hidrógeno Verde en La Araucanía" es una iniciativa financiada por CORFO a través del instrumento Bienes Públicos para la Competitividad. Su objetivo es articular a los actores regionales del ecosistema de hidrógeno verde, desarrollar una hoja de ruta estratégica, fortalecer el capital humano y contribuir al marco regulatorio para posicionar a La Araucanía como polo de desarrollo del H₂V en Chile.', version: 1 }], version: 1 }], direction: 'ltr', format: '', indent: 0, version: 1 } },
        },
        instituciones: [
          { nombre: 'CODESSER', rol: 'Ejecutor principal — Corporación de Desarrollo Social del Sector Rural' },
          { nombre: 'Universidad de Talca', rol: 'Co-ejecutor técnico — Investigación y desarrollo' },
          { nombre: 'Subsecretaría de Energía', rol: 'Mandante — Ministerio de Energía' },
          { nombre: 'CORFO', rol: 'Financiamiento — Programa Bien Público' },
          { nombre: 'Gobierno Regional de La Araucanía', rol: 'Apoyo institucional regional' },
        ],
        consejoTitulo: 'Consejo de Dirección del Hidrógeno Verde de Araucanía',
        consejoDescripcion: 'Instancia estratégica encargada de definir la visión, aprobar planes de desarrollo y supervisar el progreso del proyecto.',
        comiteTitulo: 'Comité Consultivo Técnico Científico',
        comiteDescripcion: 'Integrado por académicos, investigadores y expertos técnicos que asesoran en materia tecnológica, ambiental y de innovación.',
      },
    });
    log.push('✓ Quiénes Somos');

    // ═══════ 6. HIDRÓGENO VERDE ═══════
    await payload.updateGlobal({
      slug: 'pagina-h2v',
      data: {
        hero: {
          titulo: 'Hidrógeno Verde',
          subtitulo: 'El hidrógeno verde es un vector energético producido mediante electrólisis del agua utilizando energías renovables. No genera emisiones de CO₂ y es clave para la descarbonización de la economía.',
        },
        electrolisis: {
          titulo: 'Proceso de Electrólisis',
          pasos: [
            { titulo: 'Fuente de energía renovable', descripcion: 'Paneles solares, turbinas eólicas o centrales hidroeléctricas generan electricidad limpia.' },
            { titulo: 'Electrolizador', descripcion: 'La electricidad pasa por un electrolizador que separa la molécula de agua (H₂O) en hidrógeno (H₂) y oxígeno (O₂).' },
            { titulo: 'Purificación', descripcion: 'El hidrógeno se purifica y comprime para su almacenamiento o transporte.' },
            { titulo: 'Almacenamiento', descripcion: 'Se almacena en tanques presurizados, en forma líquida criogénica o en portadores químicos como amoníaco.' },
            { titulo: 'Distribución y uso', descripcion: 'Se transporta por ductos, camiones o barcos hasta los puntos de consumo industrial, energético o de transporte.' },
          ],
        },
        electrolizadores: [
          { nombre: 'PEM (Membrana de intercambio protónico)', descripcion: 'Alta eficiencia y respuesta rápida. Ideal para fuentes intermitentes como eólica y solar.', madurez: 'Comercial', costo: '$1.100–1.800/kW' },
          { nombre: 'Alcalino', descripcion: 'Tecnología madura y económica. Funciona bien a gran escala con operación estable.', madurez: 'Comercial', costo: '$800–1.500/kW' },
          { nombre: 'SOEC (Óxido sólido)', descripcion: 'Opera a alta temperatura (700-850°C). Mayor eficiencia si se aprovecha calor residual industrial.', madurez: 'Pre-comercial', costo: '$2.800–5.600/kW' },
          { nombre: 'AEM (Membrana de intercambio aniónico)', descripcion: 'Combina ventajas de PEM y alcalino. No requiere metales nobles. Tecnología emergente.', madurez: 'En desarrollo', costo: 'En evaluación' },
        ],
        cadenaValor: [
          { titulo: 'Producción', descripcion: 'Electrólisis del agua con energía renovable', icono: '⚡' },
          { titulo: 'Almacenamiento', descripcion: 'Tanques presurizados, líquido criogénico o portadores químicos', icono: '🔋' },
          { titulo: 'Transporte', descripcion: 'Ductos, camiones cisterna o transporte marítimo', icono: '🚛' },
          { titulo: 'Conversión', descripcion: 'Transformación a amoníaco, metanol o e-combustibles', icono: '🔄' },
          { titulo: 'Uso final', descripcion: 'Industria, transporte, calefacción y generación eléctrica', icono: '🏭' },
        ],
        derivados: [
          { nombre: 'Amoníaco verde (NH₃)', descripcion: 'Producido a partir de H₂V y nitrógeno atmosférico. Clave para fertilizantes y como portador de hidrógeno para transporte marítimo.', aplicacion: 'Fertilizantes y transporte marítimo' },
          { nombre: 'Metanol verde (CH₃OH)', descripcion: 'Sintetizado a partir de H₂V y CO₂ capturado. Uso como combustible y materia prima química.', aplicacion: 'Industria química y combustibles' },
          { nombre: 'e-Combustibles', descripcion: 'Combustibles sintéticos producidos con H₂V y CO₂. Compatibles con motores e infraestructura existente.', aplicacion: 'Aviación y transporte pesado' },
          { nombre: 'Acero verde', descripcion: 'Uso de H₂V como agente reductor en la producción de acero, reemplazando el carbón.', aplicacion: 'Siderurgia descarbonizada' },
        ],
      },
    });
    log.push('✓ Hidrógeno Verde');

    // ═══════ 7. SECTORES PRODUCTIVOS ═══════
    await payload.updateGlobal({
      slug: 'pagina-sectores',
      data: {
        hero: {
          titulo: 'Sectores Productivos',
          subtitulo: 'Sectores de La Araucanía con potencial de integración del hidrógeno verde para su desarrollo sostenible.',
        },
        sectores: [
          {
            nombre: 'Forestal y Biomasa', icono: '🌲',
            descripcion: 'La Araucanía posee más de 1,2 millones de hectáreas de plantaciones forestales. El H₂V puede alimentar procesos de secado, cogeneración y producción de biocombustibles avanzados.',
            oportunidades: [
              { texto: 'Secado de madera con calor generado por H₂V' },
              { texto: 'Cogeneración eléctrica en plantas de celulosa' },
              { texto: 'Producción de biometanol a partir de residuos forestales y H₂V' },
            ],
          },
          {
            nombre: 'Agroindustrial', icono: '🌾',
            descripcion: 'Sector agropecuario con alta demanda de fertilizantes y cadenas de frío. El amoníaco verde y la energía térmica del H₂V ofrecen soluciones de descarbonización directa.',
            oportunidades: [
              { texto: 'Producción local de amoníaco verde para fertilizantes' },
              { texto: 'Cadena de frío alimentada por celdas de combustible' },
              { texto: 'Calefacción de invernaderos con H₂V' },
            ],
          },
          {
            nombre: 'Transporte y Logística', icono: '🚛',
            descripcion: 'Flota de camiones y buses regionales con alto consumo de diésel. Las celdas de combustible de hidrógeno ofrecen autonomía comparable sin emisiones.',
            oportunidades: [
              { texto: 'Buses de transporte público con celdas de H₂' },
              { texto: 'Camiones de carga forestal con autonomía extendida' },
              { texto: 'Estaciones de recarga de H₂ en ruta' },
            ],
          },
          {
            nombre: 'Turismo Sustentable', icono: '🏔️',
            descripcion: 'La región atrae turismo de naturaleza en parques nacionales y lagos. El H₂V permite operaciones turísticas cero emisiones.',
            oportunidades: [
              { texto: 'Embarcaciones turísticas con propulsión de H₂' },
              { texto: 'Lodges y hoteles con energía off-grid basada en H₂V' },
              { texto: 'Transporte turístico eléctrico con respaldo H₂' },
            ],
          },
          {
            nombre: 'Minería y Construcción', icono: '⛏️',
            descripcion: 'Actividades extractivas y de construcción con maquinaria pesada diésel. El H₂V permite electrificar equipos sin comprometer potencia.',
            oportunidades: [
              { texto: 'Maquinaria pesada con celdas de combustible' },
              { texto: 'Generación eléctrica en faenas remotas' },
              { texto: 'Calefacción industrial con H₂V' },
            ],
          },
        ],
      },
    });
    log.push('✓ Sectores Productivos');

    // ═══════ 8. GOBERNANZA ═══════
    await payload.updateGlobal({
      slug: 'pagina-gobernanza',
      data: {
        hero: {
          titulo: 'Modelo de Gobernanza',
          subtitulo: 'Estructura de dirección, gestión y control del programa para garantizar transparencia, eficiencia y sostenibilidad.',
        },
        descripcion: 'El modelo de gobernanza del programa se divide en dos niveles — estratégico y operativo — para asegurar una gestión integral y sostenible del proyecto.',
        nivelEstrategico: {
          titulo: 'Consejo de Dirección del Hidrógeno Verde de Araucanía',
          descripcion: 'Instancia máxima de dirección estratégica compuesta por representantes del Gobierno Regional, Ministerios, universidades, asociaciones empresariales, comunidades indígenas y expertos independientes.',
          funciones: [
            { texto: 'Definir la visión y estrategia de largo plazo del programa' },
            { texto: 'Aprobar planes de desarrollo y asignación de recursos' },
            { texto: 'Supervisar el cumplimiento de hitos y compromisos CORFO' },
            { texto: 'Facilitar articulación interinstitucional público-privada' },
            { texto: 'Resolver conflictos y arbitrar decisiones estratégicas' },
          ],
          periodicidad: 'Trimestralmente — Presencial y/o videoconferencia',
        },
        nivelOperativo: {
          titulo: 'Unidad de Coordinación y Gestión del Proyecto',
          descripcion: 'Compuesta por el Director del proyecto, equipo técnico, equipo de gestión financiera y equipo de comunicación y participación comunitaria.',
          funciones: [
            { texto: 'Ejecutar el plan de trabajo aprobado por el Consejo' },
            { texto: 'Coordinar actividades técnicas, financieras y de difusión' },
            { texto: 'Elaborar informes de avance para CORFO y el Consejo' },
            { texto: 'Gestionar la relación con proveedores y consultores' },
            { texto: 'Organizar seminarios, talleres y actividades de participación' },
          ],
          periodicidad: 'Cada 15 días — Presencial y/o videoconferencia',
        },
      },
    });
    log.push('✓ Gobernanza');

    // ═══════ 9. HOJA DE RUTA ═══════
    await payload.updateGlobal({
      slug: 'pagina-hoja-ruta',
      data: {
        hero: {
          titulo: 'Hoja de Ruta',
          subtitulo: 'Estrategia regional para el desarrollo del hidrógeno verde en La Araucanía, horizonte 2024-2050.',
        },
        hitos: [
          { periodo: '2024-2025', titulo: 'Diagnóstico Regional', descripcion: 'Análisis del potencial energético renovable, identificación de actores clave y evaluación de demanda sectorial de hidrógeno verde en La Araucanía.' },
          { periodo: '2025-2026', titulo: 'Programa Estratégico (BP)', descripcion: 'Ejecución del Bien Público 24BP-269085: gobernanza, hoja de ruta, capital humano, marco regulatorio y difusión regional.' },
          { periodo: '2026-2027', titulo: 'Pilotos Demostrativos', descripcion: 'Implementación de proyectos piloto en sectores forestal, agroindustrial y transporte. Validación tecnológica y económica.' },
          { periodo: '2027-2030', titulo: 'Escalamiento Regional', descripcion: 'Ampliación de pilotos exitosos, atracción de inversión privada e instalación de infraestructura de producción y distribución.' },
          { periodo: '2030-2040', titulo: 'Consolidación Industrial', descripcion: 'Operación comercial de plantas de H₂V, integración en cadenas productivas regionales y exportación de derivados.' },
          { periodo: '2040-2050', titulo: 'Carbono Neutralidad', descripcion: 'Contribución regional a la meta nacional de carbono neutralidad 2050, con H₂V como pilar energético de La Araucanía.' },
        ],
        notaFinal: 'La Hoja de Ruta detallada se publicará como documento descargable una vez completado el proceso de diagnóstico regional durante 2025-2026.',
      },
    });
    log.push('✓ Hoja de Ruta');

    // ═══════ 10. COMUNIDAD ═══════
    await payload.updateGlobal({
      slug: 'pagina-comunidad',
      data: {
        hero: {
          titulo: 'Comunidad y Participación',
          subtitulo: 'El desarrollo del hidrógeno verde en La Araucanía se construye con la participación activa de las comunidades y actores territoriales.',
        },
        participacion: {
          titulo: 'Participación en la gobernanza',
          items: [
            { texto: 'Representación de comunidades indígenas en el Consejo de Dirección' },
            { texto: 'Consultas públicas en etapas clave del programa' },
            { texto: 'Talleres participativos para diseño de la Hoja de Ruta regional' },
            { texto: 'Mecanismos de denuncia y reclamo accesibles y transparentes' },
          ],
        },
        compromisos: {
          titulo: 'Compromiso con el territorio',
          items: [
            { texto: 'Respetar y valorar la cosmovisión Mapuche en relación con el territorio y sus recursos' },
            { texto: 'Priorizar beneficios económicos y laborales para las comunidades locales' },
            { texto: 'Minimizar impactos ambientales en zonas de alto valor ecológico y cultural' },
            { texto: 'Transparentar toda información relevante del programa en formatos accesibles' },
          ],
        },
        glosario: [
          { mapudungun: 'Küme Newen', espanol: 'Buena energía — Fuerza positiva para el bienestar' },
          { mapudungun: 'Mapu', espanol: 'Tierra — Territorio y entorno natural' },
          { mapudungun: 'Ko', espanol: 'Agua — Elemento vital para la vida y la energía' },
          { mapudungun: 'Küref', espanol: 'Viento — Fuerza natural renovable' },
          { mapudungun: 'Antü', espanol: 'Sol — Fuente de luz y energía' },
          { mapudungun: 'Itrofill Monguen', espanol: 'Biodiversidad — Toda la vida sin excepción' },
          { mapudungun: 'Nor Feleal', espanol: 'Vivir en armonía — Equilibrio entre personas y naturaleza' },
          { mapudungun: 'Küme Monguen', espanol: 'Buen vivir — Bienestar integral de la comunidad' },
        ],
      },
    });
    log.push('✓ Comunidad');

    // ═══════ 11. CAPITAL HUMANO ═══════
    await payload.updateGlobal({
      slug: 'pagina-capital-humano',
      data: {
        hero: {
          titulo: 'Capital Humano',
          subtitulo: 'Formación y desarrollo de competencias para la industria del hidrógeno verde en La Araucanía.',
        },
        perfiles: [
          { texto: 'Técnico/a en sistemas de electrólisis y celdas de combustible' },
          { texto: 'Ingeniero/a de proyectos de hidrógeno verde' },
          { texto: 'Especialista en almacenamiento y transporte de H₂' },
          { texto: 'Técnico/a en mantenimiento de plantas de H₂V' },
          { texto: 'Gestor/a de proyectos energéticos con enfoque territorial' },
          { texto: 'Especialista en normativa y regulación de hidrógeno' },
        ],
        programas: [
          { texto: 'Diplomado en Tecnologías del Hidrógeno Verde (Universidad de Talca)' },
          { texto: 'Capacitación técnica para operadores de electrolizadores' },
          { texto: 'Talleres de reconversión laboral para trabajadores del sector fósil' },
          { texto: 'Programa de becas para formación especializada en H₂V' },
          { texto: 'Seminarios de actualización regulatoria y normativa' },
        ],
      },
    });
    log.push('✓ Capital Humano');

    // ═══════ 12. MARCO REGULATORIO ═══════
    await payload.updateGlobal({
      slug: 'pagina-marco-regulatorio',
      data: {
        hero: {
          titulo: 'Marco Regulatorio',
          subtitulo: 'Normativa, políticas y lineamientos para el desarrollo del hidrógeno verde en Chile.',
        },
        documentos: [
          { titulo: 'Estrategia Nacional de Hidrógeno Verde (2020)', descripcion: 'Hoja de ruta del Ministerio de Energía para posicionar a Chile como exportador de H₂V. Plantea producir el hidrógeno verde más barato del mundo para 2030.', relevancia: 'Define el marco estratégico nacional bajo el cual se desarrollan los programas regionales como el BP de La Araucanía.' },
          { titulo: 'Plan de Acción de Hidrógeno Verde 2023-2030', descripcion: 'Actualización operativa de la estrategia nacional con metas concretas, inversión proyectada y acciones habilitantes.', relevancia: 'Establece las acciones concretas y plazos que deben cumplir los programas regionales de hidrógeno verde.' },
          { titulo: 'Ley 21.305 de Eficiencia Energética', descripcion: 'Primera ley de eficiencia energética de Chile. Establece obligaciones de gestión energética para grandes consumidores.', relevancia: 'Crea incentivos para que industrias regionales adopten H₂V como fuente energética eficiente y limpia.' },
          { titulo: 'Ley 20.698 de Energías Renovables (ERNC)', descripcion: 'Establece que al menos el 20% de la energía comercializada provenga de fuentes renovables no convencionales.', relevancia: 'La abundancia de recursos eólicos e hídricos en La Araucanía posiciona a la región como productora de energía renovable para electrólisis.' },
          { titulo: 'Reglamento de Seguridad para Instalaciones de Hidrógeno', descripcion: 'Normativa técnica de la SEC para la instalación, operación y mantenimiento seguro de sistemas de hidrógeno.', relevancia: 'Marco normativo que deben cumplir los proyectos piloto y plantas de H₂V que se instalen en la región.' },
        ],
      },
    });
    log.push('✓ Marco Regulatorio');

    // ═══════ 13. MIEMBROS DE GOBERNANZA ═══════
    const existingMiembros = await payload.find({ collection: 'miembros', limit: 1 });
    if (existingMiembros.totalDocs === 0) {
      const miembros = [
        { nombre: 'Por designar — GORE Araucanía', cargo: 'Representante Regional', institucion: 'Gobierno Regional de La Araucanía', instancia: 'consejo', orden: 1 },
        { nombre: 'Por designar — SEREMI Energía', cargo: 'SEREMI de Energía', institucion: 'Ministerio de Energía', instancia: 'consejo', orden: 2 },
        { nombre: 'Por designar — CORFO', cargo: 'Director Regional', institucion: 'CORFO Araucanía', instancia: 'consejo', orden: 3 },
        { nombre: 'Por designar — CODESSER', cargo: 'Director Ejecutivo', institucion: 'CODESSER', instancia: 'consejo', orden: 4 },
        { nombre: 'Por designar — UTalca', cargo: 'Representante Académico', institucion: 'Universidad de Talca', instancia: 'consejo', orden: 5 },
        { nombre: 'Por designar — Comunidad Mapuche', cargo: 'Representante Indígena', institucion: 'Comunidades Mapuche de La Araucanía', instancia: 'consejo', orden: 6 },
        { nombre: 'Por designar — Investigador UTalca', cargo: 'Investigador Principal', institucion: 'Universidad de Talca', instancia: 'comite', orden: 7 },
        { nombre: 'Por designar — Investigador UFRO', cargo: 'Investigador Asociado', institucion: 'Universidad de La Frontera', instancia: 'comite', orden: 8 },
        { nombre: 'Por designar — Experto H₂V', cargo: 'Asesor Técnico', institucion: 'Consultor independiente', instancia: 'comite', orden: 9 },
        { nombre: 'Por designar — Director BP', cargo: 'Director del Programa', institucion: 'CODESSER', instancia: 'unidad', orden: 10 },
        { nombre: 'Por designar — Coord. Técnico', cargo: 'Coordinador Técnico', institucion: 'Universidad de Talca', instancia: 'unidad', orden: 11 },
        { nombre: 'Por designar — Coord. Comunicaciones', cargo: 'Coordinador de Comunicaciones', institucion: 'CODESSER', instancia: 'unidad', orden: 12 },
      ];
      for (const m of miembros) {
        await payload.create({ collection: 'miembros', data: m });
      }
      log.push(`✓ ${miembros.length} miembros creados`);
    } else {
      log.push('⏭ Ya existen miembros');
    }

    // ═══════ 14. PROYECTOS ═══════
    const existingProyectos = await payload.find({ collection: 'proyectos', limit: 1 });
    if (existingProyectos.totalDocs === 0) {
      const proyectos = [
        {
          nombre: 'Planta Piloto H₂V Temuco',
          descripcion: 'Proyecto demostrativo de producción de hidrógeno verde mediante electrolizador PEM de 1 MW, alimentado por energía eólica.',
          empresa: 'CODESSER / Universidad de Talca',
          etapa: 'planificacion',
          region: 'araucania',
          coordenadas: { lat: -38.7359, lng: -72.5904 },
          capacidadMW: 1,
          produccionTonAnio: 150,
        },
        {
          nombre: 'HyEx — Hidrógeno para Exportación',
          descripcion: 'Proyecto a gran escala para producción de amoníaco verde destinado a exportación. Energía eólica y solar en Antofagasta.',
          empresa: 'Engie / Enaex',
          etapa: 'desarrollo',
          region: 'nacional',
          coordenadas: { lat: -23.6509, lng: -70.3975 },
          capacidadMW: 2000,
          produccionTonAnio: 780000,
        },
        {
          nombre: 'Haru Oni — e-Fuels Magallanes',
          descripcion: 'Primera planta industrial de e-combustibles del mundo. Produce metanol y gasolina sintética a partir de H₂V y CO₂ capturado.',
          empresa: 'HIF Global / Siemens Energy / Porsche',
          etapa: 'operacion',
          region: 'nacional',
          coordenadas: { lat: -52.3595, lng: -70.8565 },
          capacidadMW: 3.4,
          produccionTonAnio: 130000,
        },
        {
          nombre: 'Bus H₂ Temuco',
          descripcion: 'Proyecto piloto de bus de transporte público con celda de combustible de hidrógeno para Temuco.',
          empresa: 'Programa BP H₂V Araucanía',
          etapa: 'planificacion',
          region: 'araucania',
          coordenadas: { lat: -38.749, lng: -72.62 },
        },
        {
          nombre: 'H₂V Forestal Victoria',
          descripcion: 'Estudio de factibilidad para integración de H₂V en planta de secado de madera. Reemplazo de calderas a biomasa.',
          empresa: 'CMPC / CODESSER',
          etapa: 'planificacion',
          region: 'araucania',
          coordenadas: { lat: -38.2329, lng: -72.334 },
          capacidadMW: 0.5,
        },
      ];
      for (const p of proyectos) {
        await payload.create({ collection: 'proyectos', data: p });
      }
      log.push(`✓ ${proyectos.length} proyectos creados`);
    } else {
      log.push('⏭ Ya existen proyectos');
    }

    // ═══════ PLACEHOLDER IMAGE ═══════
    let placeholderMediaId: number | null = null;
    const existingMedia = await payload.find({ collection: 'media', where: { alt: { equals: 'Placeholder H2V Araucanía' } }, limit: 1 });
    if (existingMedia.totalDocs > 0) {
      placeholderMediaId = existingMedia.docs[0].id as number;
    } else {
      const placeholderPath = path.resolve(process.cwd(), 'public/uploads/placeholder-h2v.png');
      if (fs.existsSync(placeholderPath)) {
        const buffer = fs.readFileSync(placeholderPath);
        const file = {
          data: buffer,
          mimetype: 'image/png',
          name: 'placeholder-h2v.png',
          size: buffer.length,
        };
        const media = await payload.create({
          collection: 'media',
          data: { alt: 'Placeholder H2V Araucanía' },
          file,
        });
        placeholderMediaId = media.id as number;
        log.push('✓ Imagen placeholder creada');
      }
    }

    // ═══════ 15. NOTICIAS ═══════
    const existingNoticias = await payload.find({ collection: 'noticias', limit: 1 });
    if (existingNoticias.totalDocs === 0 && placeholderMediaId) {
      const noticias = [
        {
          titulo: 'Lanzamiento del Programa Estratégico de Hidrógeno Verde en La Araucanía',
          slug: 'lanzamiento-programa-h2v-araucania',
          extracto: 'CODESSER y la Universidad de Talca presentan oficialmente el Bien Público 24BP-269085 para impulsar el hidrógeno verde en la región.',
          contenido: { root: { type: 'root', children: [{ type: 'paragraph', children: [{ type: 'text', text: 'El Programa Estratégico Regional de Hidrógeno Verde de La Araucanía fue presentado oficialmente ante autoridades regionales, representantes del sector productivo y la comunidad académica. El programa, financiado por CORFO a través del instrumento Bien Público (código 24BP-269085), tiene como objetivo desarrollar una hoja de ruta para la integración del hidrógeno verde en los sectores productivos de La Araucanía.', version: 1 }], version: 1 }], direction: 'ltr', format: '', indent: 0, version: 1 } },
          fecha: '2025-03-15',
          imagen: placeholderMediaId,
          categoria: 'general',
          publicado: true,
        },
        {
          titulo: 'Primer Seminario Internacional de Hidrógeno Verde en Temuco',
          slug: 'seminario-internacional-h2v-temuco',
          extracto: 'Expertos nacionales e internacionales analizarán el potencial del hidrógeno verde en la Región de La Araucanía.',
          contenido: { root: { type: 'root', children: [{ type: 'paragraph', children: [{ type: 'text', text: 'El programa organizará el primer Seminario Internacional de Hidrógeno Verde en Temuco, con la participación de expertos de Chile, Alemania y Australia. El evento abordará tecnologías de electrólisis, modelos de negocio, experiencia internacional y oportunidades específicas para La Araucanía.', version: 1 }], version: 1 }], direction: 'ltr', format: '', indent: 0, version: 1 } },
          fecha: '2025-06-20',
          imagen: placeholderMediaId,
          categoria: 'seminario',
          publicado: true,
        },
        {
          titulo: 'Se constituye el Consejo de Dirección del Hidrógeno Verde de Araucanía',
          slug: 'constitucion-consejo-direccion-h2v',
          extracto: 'Representantes del gobierno, universidades, empresas y comunidades indígenas conforman la gobernanza estratégica.',
          contenido: { root: { type: 'root', children: [{ type: 'paragraph', children: [{ type: 'text', text: 'En una ceremonia realizada en el Gobierno Regional de La Araucanía, se constituyó formalmente el Consejo de Dirección del programa de Hidrógeno Verde. El Consejo integra a representantes del GORE, SEREMI de Energía, CORFO, CODESSER, Universidad de Talca, Universidad de La Frontera y comunidades Mapuche.', version: 1 }], version: 1 }], direction: 'ltr', format: '', indent: 0, version: 1 } },
          fecha: '2025-04-10',
          imagen: placeholderMediaId,
          categoria: 'gobernanza',
          publicado: true,
        },
        {
          titulo: 'Taller de Capacitación: Introducción a las Tecnologías del Hidrógeno Verde',
          slug: 'taller-capacitacion-tecnologias-h2v',
          extracto: 'Primera jornada de formación técnica para profesionales y técnicos de La Araucanía interesados en la industria del H₂V.',
          contenido: { root: { type: 'root', children: [{ type: 'paragraph', children: [{ type: 'text', text: 'El programa de Capital Humano del BP inicia con un taller introductorio sobre tecnologías de hidrógeno verde. Los participantes conocerán los fundamentos de la electrólisis, tipos de electrolizadores, cadena de valor del H₂V y perfiles laborales emergentes.', version: 1 }], version: 1 }], direction: 'ltr', format: '', indent: 0, version: 1 } },
          fecha: '2025-05-15',
          imagen: placeholderMediaId,
          categoria: 'taller',
          publicado: true,
        },
      ];
      for (const n of noticias) {
        await payload.create({ collection: 'noticias', data: n });
      }
      log.push(`✓ ${noticias.length} noticias creadas`);
    } else {
      log.push('⏭ Ya existen noticias');
    }

    // ═══════ 16. EVENTOS ═══════
    const existingEventos = await payload.find({ collection: 'eventos', limit: 1 });
    if (existingEventos.totalDocs === 0) {
      const eventos = [
        {
          titulo: 'Seminario Internacional de Hidrógeno Verde — Temuco 2025',
          fecha: '2025-06-20',
          fechaFin: '2025-06-21',
          lugar: 'Hotel Dreams, Temuco',
          tipo: 'seminario',
          descripcion: { root: { type: 'root', children: [{ type: 'paragraph', children: [{ type: 'text', text: 'Seminario con expertos de Chile, Alemania y Australia sobre tecnologías, modelos de negocio y oportunidades regionales del hidrógeno verde.', version: 1 }], version: 1 }], direction: 'ltr', format: '', indent: 0, version: 1 } },
          publicado: true,
        },
        {
          titulo: 'Taller: Introducción a Tecnologías del H₂V',
          fecha: '2025-05-15',
          lugar: 'Universidad de La Frontera, Temuco',
          tipo: 'taller',
          descripcion: { root: { type: 'root', children: [{ type: 'paragraph', children: [{ type: 'text', text: 'Jornada de formación técnica introductoria sobre electrólisis, electrolizadores, cadena de valor y perfiles laborales del hidrógeno verde.', version: 1 }], version: 1 }], direction: 'ltr', format: '', indent: 0, version: 1 } },
          publicado: true,
        },
        {
          titulo: 'Reunión Consejo de Dirección — Q3 2025',
          fecha: '2025-09-15',
          lugar: 'Gobierno Regional de La Araucanía, Temuco',
          tipo: 'reunion',
          descripcion: { root: { type: 'root', children: [{ type: 'paragraph', children: [{ type: 'text', text: 'Tercera sesión ordinaria del Consejo de Dirección. Revisión de avances, plan de trabajo segundo semestre y resultados del diagnóstico regional.', version: 1 }], version: 1 }], direction: 'ltr', format: '', indent: 0, version: 1 } },
          publicado: true,
        },
      ];
      for (const e of eventos) {
        await payload.create({ collection: 'eventos', data: e });
      }
      log.push(`✓ ${eventos.length} eventos creados`);
    } else {
      log.push('⏭ Ya existen eventos');
    }

    log.push('');
    log.push('═══ SEED COMPLETADO ═══');
    log.push('Admin: http://localhost:3000/admin');
    log.push('Email: admin@h2varaucania.cl');
    log.push('Pass:  H2vAdmin2026!');

    return NextResponse.json({ success: true, log });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    log.push(`❌ Error: ${message}`);
    return NextResponse.json({ success: false, log, error: message }, { status: 500 });
  }
}
