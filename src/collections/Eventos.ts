import type { CollectionConfig } from 'payload';

export const Eventos: CollectionConfig = {
  slug: 'eventos',
  admin: {
    useAsTitle: 'titulo',
    defaultColumns: ['titulo', 'fecha', 'lugar', 'tipo'],
  },
  fields: [
    {
      name: 'titulo',
      type: 'text',
      required: true,
    },
    {
      name: 'descripcion',
      type: 'richText',
      required: true,
    },
    {
      name: 'fecha',
      type: 'date',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'fechaFin',
      type: 'date',
      admin: { position: 'sidebar' },
    },
    {
      name: 'lugar',
      type: 'text',
      required: true,
    },
    {
      name: 'tipo',
      type: 'select',
      options: [
        { label: 'Seminario', value: 'seminario' },
        { label: 'Taller', value: 'taller' },
        { label: 'Feria', value: 'feria' },
        { label: 'Reunión', value: 'reunion' },
        { label: 'Capacitación', value: 'capacitacion' },
        { label: 'Otro', value: 'otro' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'imagen',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'urlInscripcion',
      type: 'text',
      label: 'URL de inscripción',
    },
    {
      name: 'publicado',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
  ],
};
