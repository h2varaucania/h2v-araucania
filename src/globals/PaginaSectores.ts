import type { GlobalConfig } from 'payload';

export const PaginaSectores: GlobalConfig = {
  slug: 'pagina-sectores',
  label: 'Sectores Productivos',
  admin: { group: 'Páginas' },
  fields: [
    {
      name: 'hero',
      type: 'group',
      label: 'Encabezado',
      fields: [
        { name: 'titulo', type: 'text', defaultValue: 'Sectores Productivos' },
        { name: 'subtitulo', type: 'textarea', defaultValue: 'Sectores de La Araucanía con potencial de integración del hidrógeno verde para su desarrollo sostenible.' },
      ],
    },
    {
      name: 'sectores',
      type: 'array',
      label: 'Sectores',
      fields: [
        { name: 'nombre', type: 'text', required: true },
        { name: 'icono', type: 'text', label: 'Emoji' },
        { name: 'descripcion', type: 'textarea', required: true },
        { name: 'oportunidades', type: 'array', label: 'Oportunidades', fields: [
          { name: 'texto', type: 'text', required: true },
        ]},
      ],
    },
  ],
};
