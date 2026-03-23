import type { GlobalConfig } from 'payload';

export const PaginaCapitalHumano: GlobalConfig = {
  slug: 'pagina-capital-humano',
  label: 'Capital Humano',
  admin: { group: 'Páginas' },
  fields: [
    {
      name: 'hero',
      type: 'group',
      label: 'Encabezado',
      fields: [
        { name: 'titulo', type: 'text', defaultValue: 'Capital Humano' },
        { name: 'subtitulo', type: 'textarea', defaultValue: 'Formación y desarrollo de competencias para la industria del hidrógeno verde en La Araucanía.' },
      ],
    },
    { name: 'introduccion', type: 'richText', label: 'Texto introductorio' },
    {
      name: 'perfiles',
      type: 'array',
      label: 'Perfiles emergentes',
      fields: [{ name: 'texto', type: 'text', required: true }],
    },
    {
      name: 'programas',
      type: 'array',
      label: 'Programas del BP',
      fields: [{ name: 'texto', type: 'text', required: true }],
    },
    { name: 'notaOportunidad', type: 'richText', label: 'Nota de oportunidad regional' },
  ],
};
