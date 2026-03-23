import type { CollectionConfig } from 'payload';

export const Downloads: CollectionConfig = {
  slug: 'downloads',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['documento', 'user', 'downloadedAt'],
  },
  fields: [
    {
      name: 'documento',
      type: 'relationship',
      relationTo: 'documentos',
      required: true,
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
    },
    {
      name: 'downloadedAt',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: { readOnly: true },
    },
    {
      name: 'ip',
      type: 'text',
      admin: { readOnly: true },
    },
    {
      name: 'userAgent',
      type: 'text',
      admin: { readOnly: true },
    },
  ],
};
