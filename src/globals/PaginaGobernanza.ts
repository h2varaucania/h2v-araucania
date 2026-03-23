import type { GlobalConfig } from 'payload';

export const PaginaGobernanza: GlobalConfig = {
  slug: 'pagina-gobernanza',
  label: 'Gobernanza',
  admin: { group: 'Páginas' },
  fields: [
    {
      name: 'hero',
      type: 'group',
      label: 'Encabezado',
      fields: [
        { name: 'titulo', type: 'text', defaultValue: 'Modelo de Gobernanza' },
        { name: 'subtitulo', type: 'textarea', defaultValue: 'Estructura de dirección, gestión y control del programa para garantizar transparencia, eficiencia y sostenibilidad.' },
      ],
    },
    { name: 'descripcion', type: 'textarea', label: 'Descripción general',
      defaultValue: 'El modelo de gobernanza del programa se divide en dos niveles — estratégico y operativo — para asegurar una gestión integral y sostenible del proyecto.' },
    {
      name: 'nivelEstrategico',
      type: 'group',
      label: 'Nivel Estratégico',
      fields: [
        { name: 'titulo', type: 'text', defaultValue: 'Consejo de Dirección del Hidrógeno Verde de Araucanía' },
        { name: 'descripcion', type: 'textarea', defaultValue: 'Instancia máxima de dirección estratégica compuesta por representantes del Gobierno Regional, Ministerios, universidades, asociaciones empresariales, comunidades indígenas y expertos independientes.' },
        { name: 'funciones', type: 'array', label: 'Funciones', fields: [
          { name: 'texto', type: 'text', required: true },
        ]},
        { name: 'periodicidad', type: 'text', defaultValue: 'Trimestralmente — Presencial y/o videoconferencia' },
      ],
    },
    {
      name: 'nivelOperativo',
      type: 'group',
      label: 'Nivel Operativo',
      fields: [
        { name: 'titulo', type: 'text', defaultValue: 'Unidad de Coordinación y Gestión del Proyecto' },
        { name: 'descripcion', type: 'textarea', defaultValue: 'Compuesta por el Director del proyecto, equipo técnico, equipo de gestión financiera y equipo de comunicación y participación comunitaria.' },
        { name: 'funciones', type: 'array', label: 'Funciones', fields: [
          { name: 'texto', type: 'text', required: true },
        ]},
        { name: 'periodicidad', type: 'text', defaultValue: 'Cada 15 días — Presencial y/o videoconferencia' },
      ],
    },
  ],
};
