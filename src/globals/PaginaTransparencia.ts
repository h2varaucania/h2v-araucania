import type { GlobalConfig } from 'payload';

export const PaginaTransparencia: GlobalConfig = {
  slug: 'pagina-transparencia',
  label: 'Transparencia',
  admin: {
    group: 'Páginas',
    description: 'Rendición de cuentas: actas, registro de actividades, uso de recursos e indicadores de avance.',
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      label: 'Encabezado',
      fields: [
        { name: 'titulo', type: 'text', maxLength: 60, defaultValue: 'Transparencia', admin: { description: 'Título del banner.' } },
        { name: 'subtitulo', type: 'textarea', maxLength: 300, defaultValue: 'Rendición de cuentas y registro de actividades del programa.', admin: { description: 'Texto debajo del título.' } },
      ],
    },
    {
      name: 'introduccion',
      type: 'textarea',
      label: 'Texto introductorio',
      maxLength: 600,
      defaultValue: 'El programa de Hidrógeno Verde de La Araucanía se compromete con la transparencia en la gestión de recursos públicos y la rendición de cuentas a la ciudadanía.',
      admin: { description: 'Párrafo introductorio que aparece bajo el encabezado.' },
    },
    {
      name: 'items',
      type: 'array',
      label: 'Secciones de transparencia',
      maxRows: 12,
      admin: { description: 'Cada bloque tiene título, descripción y estado. Cuando publiques un documento, cambia su estado (ej. de "Próximamente" a "Disponible").' },
      fields: [
        { name: 'titulo', type: 'text', required: true, maxLength: 80, label: 'Título del bloque' },
        { name: 'descripcion', type: 'textarea', required: true, maxLength: 300, label: 'Descripción' },
        { name: 'estado', type: 'text', maxLength: 30, defaultValue: 'Próximamente', admin: { description: 'Ej: Próximamente, Disponible, En proceso.' } },
      ],
    },
  ],
};
