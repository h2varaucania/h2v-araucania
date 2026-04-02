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
  ],
};
