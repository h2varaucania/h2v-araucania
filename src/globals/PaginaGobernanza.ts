import type { GlobalConfig } from 'payload';

export const PaginaGobernanza: GlobalConfig = {
  slug: 'pagina-gobernanza',
  label: 'Gobernanza',
  admin: {
    group: 'Páginas',
    description: 'Modelo de gobernanza: niveles estratégico y operativo, funciones y periodicidad.',
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      label: 'Encabezado',
      fields: [
        { name: 'titulo', type: 'text', maxLength: 60, defaultValue: 'Modelo de Gobernanza', admin: { description: 'Título del banner.' } },
        { name: 'subtitulo', type: 'textarea', maxLength: 300, defaultValue: 'Estructura de dirección, gestión y control del programa para garantizar transparencia, eficiencia y sostenibilidad.', admin: { description: 'Texto debajo del título.' } },
      ],
    },
    {
      name: 'descripcion',
      type: 'textarea',
      label: 'Descripción general',
      maxLength: 400,
      defaultValue: 'El modelo de gobernanza del programa se divide en dos niveles — estratégico y operativo — para asegurar una gestión integral y sostenible del proyecto.',
      admin: { description: 'Párrafo introductorio sobre el modelo de gobernanza.' },
    },
    {
      name: 'nivelEstrategico',
      type: 'group',
      label: 'Nivel Estratégico',
      admin: { description: 'Consejo de Dirección — instancia máxima de decisión.' },
      fields: [
        { name: 'titulo', type: 'text', maxLength: 80, defaultValue: 'Consejo de Dirección del Hidrógeno Verde de Araucanía' },
        { name: 'descripcion', type: 'textarea', maxLength: 400, defaultValue: 'Instancia máxima de dirección estratégica compuesta por representantes del Gobierno Regional, Ministerios, universidades, asociaciones empresariales, comunidades indígenas y expertos independientes.' },
        { name: 'funciones', type: 'array', label: 'Funciones', maxRows: 8, fields: [
          { name: 'texto', type: 'text', required: true, maxLength: 200 },
        ]},
        { name: 'periodicidad', type: 'text', maxLength: 80, defaultValue: 'Trimestralmente — Presencial y/o videoconferencia', admin: { description: 'Frecuencia y modalidad de reuniones.' } },
      ],
    },
    {
      name: 'nivelOperativo',
      type: 'group',
      label: 'Nivel Operativo',
      admin: { description: 'Unidad de Coordinación y Gestión — ejecución del programa.' },
      fields: [
        { name: 'titulo', type: 'text', maxLength: 80, defaultValue: 'Unidad de Coordinación y Gestión del Proyecto' },
        { name: 'descripcion', type: 'textarea', maxLength: 400, defaultValue: 'Compuesta por el Director del proyecto, equipo técnico, equipo de gestión financiera y equipo de comunicación y participación comunitaria.' },
        { name: 'funciones', type: 'array', label: 'Funciones', maxRows: 8, fields: [
          { name: 'texto', type: 'text', required: true, maxLength: 200 },
        ]},
        { name: 'periodicidad', type: 'text', maxLength: 80, defaultValue: 'Cada 15 días — Presencial y/o videoconferencia', admin: { description: 'Frecuencia y modalidad de reuniones.' } },
      ],
    },
    {
      name: 'diagrama',
      type: 'group',
      label: 'Diagrama "Estructura del Modelo"',
      admin: { description: 'Textos de las cajas del diagrama. Si cambia la estructura de gobernanza, actualízalos aquí y el dibujo se adapta solo.' },
      fields: [
        { name: 'consejo', type: 'text', maxLength: 40, defaultValue: 'Consejo de Dirección H2V', admin: { description: 'Caja superior (nivel estratégico).' } },
        { name: 'comite', type: 'text', maxLength: 30, defaultValue: 'Comité Consultivo', admin: { description: 'Caja lateral conectada al Consejo.' } },
        { name: 'unidad', type: 'text', maxLength: 45, defaultValue: 'Unidad de Coordinación y Gestión', admin: { description: 'Caja central (nivel operativo).' } },
        {
          name: 'equipos',
          type: 'array',
          label: 'Equipos (cajas inferiores)',
          maxRows: 6,
          admin: { description: 'Los equipos que dependen de la Unidad. Se reparten automáticamente en el diagrama (máximo 6). Si no agregas ninguno, se muestran los 4 estándar.' },
          fields: [{ name: 'nombre', type: 'text', required: true, maxLength: 25 }],
        },
      ],
    },
    {
      name: 'actividades',
      type: 'array',
      label: 'Evidencia de Actividades (galería de fotos)',
      maxRows: 12,
      admin: {
        description:
          'Fotos de actividades del programa (reuniones, talleres, terreno). Mientras no subas ninguna, la página muestra espacios "Foto próximamente". Ideal: fotos horizontales.',
      },
      fields: [
        { name: 'foto', type: 'upload', relationTo: 'media', required: true, label: 'Foto' },
        { name: 'titulo', type: 'text', maxLength: 80, label: 'Descripción breve (opcional)', admin: { description: 'Se muestra bajo la foto. Ej: "Taller con sector forestal, mayo 2026".' } },
      ],
    },
  ],
};
