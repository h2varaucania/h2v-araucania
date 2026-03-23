import type { GlobalConfig } from 'payload';

export const PaginaMarcoRegulatorio: GlobalConfig = {
  slug: 'pagina-marco-regulatorio',
  label: 'Marco Regulatorio',
  admin: { group: 'Páginas' },
  fields: [
    {
      name: 'hero',
      type: 'group',
      label: 'Encabezado',
      fields: [
        { name: 'titulo', type: 'text', defaultValue: 'Marco Regulatorio' },
        { name: 'subtitulo', type: 'textarea', defaultValue: 'Normativa, políticas y lineamientos para el desarrollo del hidrógeno verde en Chile.' },
      ],
    },
    {
      name: 'documentos',
      type: 'array',
      label: 'Documentos normativos',
      fields: [
        { name: 'titulo', type: 'text', required: true },
        { name: 'descripcion', type: 'textarea', required: true },
        { name: 'relevancia', type: 'textarea', label: 'Relevancia para La Araucanía' },
      ],
    },
  ],
};
