import type { CollectionConfig } from 'payload';

export const Miembros: CollectionConfig = {
  slug: 'miembros',
  labels: { singular: 'Miembro', plural: 'Miembros de Gobernanza' },
  admin: {
    useAsTitle: 'nombre',
    defaultColumns: ['nombre', 'cargo', 'institucion', 'instancia'],
    description: 'Gestiona los integrantes del Consejo de Dirección, Comité Consultivo y Unidad de Coordinación. Aparecen en las páginas "Quiénes Somos" y "Gobernanza".',
  },
  fields: [
    {
      name: 'nombre',
      type: 'text',
      required: true,
      label: 'Nombre completo',
      admin: { description: 'Nombre y apellido de la persona.' },
    },
    {
      name: 'cargo',
      type: 'text',
      required: true,
      label: 'Cargo',
      admin: { description: 'Ej: "Presidente", "Director", "Consejero", "Coordinador Programa"' },
    },
    {
      name: 'institucion',
      type: 'text',
      required: true,
      label: 'Institución',
      admin: { description: 'Organización que representa. Ej: "Ministerio de Energía", "CODESSER", "Universidad de Talca"' },
    },
    {
      name: 'instancia',
      type: 'select',
      required: true,
      label: 'Instancia de gobernanza',
      options: [
        { label: 'Consejo de Dirección (nivel estratégico)', value: 'consejo' },
        { label: 'Comité Consultivo Técnico Científico', value: 'comite' },
        { label: 'Unidad de Coordinación y Gestión (nivel operativo)', value: 'unidad' },
      ],
      admin: { position: 'sidebar', description: 'A qué instancia de la gobernanza pertenece esta persona.' },
    },
    {
      name: 'foto',
      type: 'upload',
      relationTo: 'media',
      label: 'Foto (opcional)',
      admin: { description: 'Foto de perfil. Recomendado: formato cuadrado, mínimo 200x200 px.' },
    },
    {
      name: 'aporte',
      type: 'textarea',
      label: 'Aporte al programa',
      admin: { description: 'Descripción breve de cómo contribuye al programa. Ej: "Vinculación con el sector y orientación estratégica"' },
    },
    {
      name: 'suplente',
      type: 'text',
      label: 'Nombre del suplente (opcional)',
    },
    {
      name: 'orden',
      type: 'number',
      defaultValue: 0,
      label: 'Orden de aparición',
      admin: { position: 'sidebar', description: 'Número para ordenar. Menor número aparece primero. Ej: 1, 2, 3...' },
    },
  ],
};
