import type { GlobalConfig } from 'payload';
import { revalidaGlobal } from '@/hooks/revalidate';

export const PaginaSectores: GlobalConfig = {
  slug: 'pagina-sectores',
  hooks: { afterChange: [revalidaGlobal('/hidrogeno-verde/sectores')] },
  label: 'Sectores Productivos',
  admin: {
    group: 'Páginas',
    description: 'Sectores productivos regionales con potencial de integración del H2V (forestal, agro, transporte, etc.).',
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      label: 'Encabezado',
      fields: [
        { name: 'titulo', type: 'text', maxLength: 60, defaultValue: 'Sectores Productivos', admin: { description: 'Título del banner.' } },
        { name: 'subtitulo', type: 'textarea', maxLength: 250, defaultValue: 'Sectores de La Araucanía con potencial de integración del hidrógeno verde para su desarrollo sostenible.', admin: { description: 'Texto debajo del título.' } },
      ],
    },
    {
      name: 'sectores',
      type: 'array',
      label: 'Sectores',
      maxRows: 8,
      admin: { description: 'Cada sector se muestra como una tarjeta con descripción y lista de oportunidades.' },
      fields: [
        { name: 'nombre', type: 'text', required: true, maxLength: 50, admin: { description: 'Ej: "Forestal y Biomasa", "Agroindustrial"' } },
        { name: 'icono', type: 'text', maxLength: 5, label: 'Emoji', admin: { description: 'Un emoji representativo. Ej: "🌲", "🚛"' } },
        { name: 'descripcion', type: 'textarea', required: true, maxLength: 400 },
        { name: 'oportunidades', type: 'array', label: 'Oportunidades', maxRows: 6, fields: [
          { name: 'texto', type: 'text', required: true, maxLength: 120 },
        ]},
      ],
    },
  ],
};
