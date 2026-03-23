import type { CollectionConfig } from 'payload';

export const Miembros: CollectionConfig = {
  slug: 'miembros',
  admin: {
    useAsTitle: 'nombre',
    defaultColumns: ['nombre', 'cargo', 'institucion', 'instancia'],
  },
  fields: [
    {
      name: 'nombre',
      type: 'text',
      required: true,
    },
    {
      name: 'cargo',
      type: 'text',
      required: true,
    },
    {
      name: 'institucion',
      type: 'text',
      required: true,
    },
    {
      name: 'instancia',
      type: 'select',
      required: true,
      options: [
        { label: 'Consejo de Dirección', value: 'consejo' },
        { label: 'Comité Consultivo Técnico Científico', value: 'comite' },
        { label: 'Unidad de Coordinación y Gestión', value: 'unidad' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'foto',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'aporte',
      type: 'textarea',
      label: 'Aporte al BP',
    },
    {
      name: 'suplente',
      type: 'text',
      label: 'Nombre suplente',
    },
    {
      name: 'orden',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
  ],
};
