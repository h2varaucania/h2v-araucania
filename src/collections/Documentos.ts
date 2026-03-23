import type { CollectionConfig } from 'payload';

export const Documentos: CollectionConfig = {
  slug: 'documentos',
  admin: {
    useAsTitle: 'titulo',
    defaultColumns: ['titulo', 'tipo', 'anio', 'descargas'],
  },
  fields: [
    {
      name: 'titulo',
      type: 'text',
      required: true,
    },
    {
      name: 'descripcion',
      type: 'textarea',
      required: true,
    },
    {
      name: 'archivo',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'tipo',
      type: 'select',
      required: true,
      options: [
        { label: 'Técnico', value: 'tecnico' },
        { label: 'Difusión', value: 'difusion' },
        { label: 'Regulatorio', value: 'regulatorio' },
        { label: 'Capacitación', value: 'capacitacion' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'anio',
      type: 'number',
      required: true,
      min: 2024,
      max: 2050,
      admin: { position: 'sidebar' },
    },
    {
      name: 'descargas',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar', readOnly: true },
    },
  ],
};
