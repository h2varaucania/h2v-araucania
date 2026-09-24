// Única fuente de verdad del contenido inicial de la Página de Inicio
// (EDITABILIDAD_TOTAL §3.2). Verbatim del código al momento del retrofit.
export const inicioDefaults = {
  eyebrow: 'Bien Público 24BP-269085 · Programa Estratégico Regional',
  heroTitulo: 'Hidrógeno Verde en La Araucanía',
  heroSubtitulo:
    'Plataforma informativa sobre los avances, proyectos y oportunidades del hidrógeno verde en la región de La Araucanía, Chile.',
  ctaPrimario: 'Conozca el Programa',
  ctaSecundario: 'Ver Proyectos en el Mapa',
  kpis: [
    { cifra: '9', unidad: '', etiqueta: 'Instituciones' },
    { cifra: '88.745', unidad: 't/año', etiqueta: 'Demanda H₂V al 2045' },
    { cifra: '32', unidad: '', etiqueta: 'Comunas' },
    { cifra: '2024–2050', unidad: '', etiqueta: 'Hoja de ruta' },
  ],
  kickerExplora: 'Explora',
  tituloExplora: 'Explora el Programa',
  kickerNoticias: 'Actualidad',
  tituloNoticias: 'Últimas Noticias',
  textoVerTodas: 'Ver todas →',
  tituloApoyo: 'Proyecto apoyado por',
  tituloParticipantes: 'Instituciones participantes',
} as const;
