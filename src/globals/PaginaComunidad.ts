import type { GlobalConfig } from 'payload';

export const PaginaComunidad: GlobalConfig = {
  slug: 'pagina-comunidad',
  label: 'Comunidad',
  admin: { group: 'Páginas' },
  fields: [
    {
      name: 'hero',
      type: 'group',
      label: 'Encabezado',
      fields: [
        { name: 'titulo', type: 'text', defaultValue: 'Comunidad y Participación' },
        { name: 'subtitulo', type: 'textarea', defaultValue: 'El desarrollo del hidrógeno verde en La Araucanía se construye con la participación activa de las comunidades y actores territoriales.' },
      ],
    },
    { name: 'introduccion', type: 'richText', label: 'Texto introductorio' },
    {
      name: 'participacion',
      type: 'group',
      label: 'Participación en gobernanza',
      fields: [
        { name: 'titulo', type: 'text', defaultValue: 'Participación en gobernanza' },
        { name: 'items', type: 'array', fields: [
          { name: 'texto', type: 'text', required: true },
        ]},
      ],
    },
    {
      name: 'compromisos',
      type: 'group',
      label: 'Compromiso con el territorio',
      fields: [
        { name: 'titulo', type: 'text', defaultValue: 'Compromiso con el territorio' },
        { name: 'items', type: 'array', fields: [
          { name: 'texto', type: 'text', required: true },
        ]},
      ],
    },
    {
      name: 'glosario',
      type: 'array',
      label: 'Glosario Mapudungún',
      fields: [
        { name: 'mapudungun', type: 'text', required: true },
        { name: 'espanol', type: 'text', required: true },
      ],
    },
  ],
};
