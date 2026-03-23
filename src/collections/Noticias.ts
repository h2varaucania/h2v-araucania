import type { CollectionConfig } from 'payload';

export const Noticias: CollectionConfig = {
  slug: 'noticias',
  admin: {
    useAsTitle: 'titulo',
    defaultColumns: ['titulo', 'fecha', 'categoria', 'publicado'],
  },
  fields: [
    {
      name: 'titulo',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'extracto',
      type: 'textarea',
      required: true,
      maxLength: 300,
    },
    {
      name: 'contenido',
      type: 'richText',
      required: true,
    },
    {
      name: 'imagen',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'fecha',
      type: 'date',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'categoria',
      type: 'select',
      options: [
        { label: 'Seminario', value: 'seminario' },
        { label: 'Taller', value: 'taller' },
        { label: 'Gobernanza', value: 'gobernanza' },
        { label: 'Acuerdo', value: 'acuerdo' },
        { label: 'Proyecto', value: 'proyecto' },
        { label: 'General', value: 'general' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'publicado',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
  ],
};
