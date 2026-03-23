import type { CollectionConfig } from 'payload';

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  fields: [
    {
      name: 'nombre',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'registrado',
      options: [
        { label: 'Administrador', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'Registrado', value: 'registrado' },
      ],
    },
    {
      name: 'institucion',
      type: 'text',
    },
  ],
};
