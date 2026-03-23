import type { CollectionConfig } from 'payload';

export const Proyectos: CollectionConfig = {
  slug: 'proyectos',
  admin: {
    useAsTitle: 'nombre',
    defaultColumns: ['nombre', 'empresa', 'etapa', 'region'],
  },
  fields: [
    {
      name: 'nombre',
      type: 'text',
      required: true,
    },
    {
      name: 'descripcion',
      type: 'textarea',
      required: true,
    },
    {
      name: 'empresa',
      type: 'text',
      required: true,
    },
    {
      name: 'etapa',
      type: 'select',
      required: true,
      options: [
        { label: 'Pilotaje', value: 'pilotaje' },
        { label: 'Desarrollo', value: 'desarrollo' },
        { label: 'Operación', value: 'operacion' },
        { label: 'Planificación', value: 'planificacion' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'region',
      type: 'select',
      required: true,
      options: [
        { label: 'Araucanía', value: 'araucania' },
        { label: 'Nacional', value: 'nacional' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'coordenadas',
      type: 'group',
      fields: [
        { name: 'lat', type: 'number', required: true, min: -56, max: -17 },
        { name: 'lng', type: 'number', required: true, min: -76, max: -66 },
      ],
    },
    {
      name: 'capacidadMW',
      type: 'number',
      label: 'Capacidad (MW)',
    },
    {
      name: 'produccionTonAnio',
      type: 'number',
      label: 'Producción (ton/año)',
    },
    {
      name: 'imagen',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'url',
      type: 'text',
      label: 'URL del proyecto',
    },
  ],
};
