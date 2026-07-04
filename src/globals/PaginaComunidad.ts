import type { GlobalConfig } from 'payload';
import { revalidaGlobal } from '@/hooks/revalidate';

export const PaginaComunidad: GlobalConfig = {
  slug: 'pagina-comunidad',
  hooks: { afterChange: [revalidaGlobal('/programa/comunidad')] },
  label: 'Comunidad',
  admin: {
    group: 'Páginas',
    description: 'Participación ciudadana, compromiso territorial y glosario Mapudungún.',
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      label: 'Encabezado',
      fields: [
        { name: 'titulo', type: 'text', maxLength: 60, defaultValue: 'Comunidad y Participación', admin: { description: 'Título del banner.' } },
        { name: 'subtitulo', type: 'textarea', maxLength: 300, defaultValue: 'El desarrollo del hidrógeno verde en La Araucanía se construye con la participación activa de las comunidades y actores territoriales.', admin: { description: 'Texto debajo del título.' } },
      ],
    },
    { name: 'introduccion', type: 'richText', label: 'Texto introductorio', admin: { description: 'Párrafo introductorio sobre la participación comunitaria.' } },
    {
      name: 'participacion',
      type: 'group',
      label: 'Participación en gobernanza',
      admin: { description: 'Mecanismos de participación ciudadana en la gobernanza del programa.' },
      fields: [
        { name: 'titulo', type: 'text', maxLength: 60, defaultValue: 'Participación en gobernanza' },
        { name: 'items', type: 'array', maxRows: 8, fields: [
          { name: 'texto', type: 'text', required: true, maxLength: 200 },
        ]},
      ],
    },
    {
      name: 'compromisos',
      type: 'group',
      label: 'Compromiso con el territorio',
      admin: { description: 'Compromisos del programa con las comunidades y el territorio.' },
      fields: [
        { name: 'titulo', type: 'text', maxLength: 60, defaultValue: 'Compromiso con el territorio' },
        { name: 'items', type: 'array', maxRows: 8, fields: [
          { name: 'texto', type: 'text', required: true, maxLength: 200 },
        ]},
      ],
    },
    {
      name: 'glosario',
      type: 'array',
      label: 'Glosario Mapudungún',
      maxRows: 20,
      admin: { description: 'Términos de energía en Mapudungún con su traducción al español. Ej: "Küme Newen" → "Buena energía"' },
      fields: [
        { name: 'mapudungun', type: 'text', required: true, maxLength: 50, label: 'Término en Mapudungún' },
        { name: 'espanol', type: 'text', required: true, maxLength: 100, label: 'Significado en español' },
      ],
    },
  ],
};
