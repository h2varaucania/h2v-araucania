import type { GlobalConfig } from 'payload';

export const PaginaCapitalHumano: GlobalConfig = {
  slug: 'pagina-capital-humano',
  label: 'Capital Humano',
  admin: {
    group: 'Páginas',
    description: 'Perfiles laborales emergentes y programas de formación del BP para la industria H2V.',
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      label: 'Encabezado',
      fields: [
        { name: 'titulo', type: 'text', maxLength: 60, defaultValue: 'Capital Humano', admin: { description: 'Título del banner.' } },
        { name: 'subtitulo', type: 'textarea', maxLength: 250, defaultValue: 'Formación y desarrollo de competencias para la industria del hidrógeno verde en La Araucanía.', admin: { description: 'Texto debajo del título.' } },
      ],
    },
    { name: 'introduccion', type: 'richText', label: 'Texto introductorio', admin: { description: 'Párrafo introductorio sobre capital humano y formación.' } },
    {
      name: 'perfiles',
      type: 'array',
      label: 'Perfiles laborales emergentes',
      maxRows: 10,
      admin: { description: 'Nuevos perfiles laborales que surgen con la industria del H2V.' },
      fields: [{ name: 'texto', type: 'text', required: true, maxLength: 120 }],
    },
    {
      name: 'programas',
      type: 'array',
      label: 'Programas de formación del BP',
      maxRows: 10,
      admin: { description: 'Programas de capacitación que ofrece o gestionará el Bien Público.' },
      fields: [{ name: 'texto', type: 'text', required: true, maxLength: 150 }],
    },
    { name: 'notaOportunidad', type: 'richText', label: 'Nota de oportunidad regional', admin: { description: 'Texto sobre la oportunidad que representa el H2V para la fuerza laboral regional.' } },
  ],
};
