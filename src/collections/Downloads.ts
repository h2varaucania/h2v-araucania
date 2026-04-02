import type { CollectionConfig } from 'payload';

export const Downloads: CollectionConfig = {
  slug: 'downloads',
  labels: { singular: 'Descarga', plural: 'Registro de Descargas' },
  admin: {
    useAsTitle: 'documento',
    defaultColumns: ['documento', 'user', 'downloadedAt'],
    group: 'Sistema',
    description:
      'Registro automático de descargas de documentos. Esta tabla se llena sola — no necesitas crear entradas manualmente. Úsala para ver quién descargó qué documento y cuándo (indicadores CORFO).',
  },
  access: {
    create: () => false,
    update: () => false,
    delete: ({ req }) => req.user?.role === 'admin',
    read: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    {
      name: 'documento',
      type: 'relationship',
      relationTo: 'documentos',
      required: true,
      label: 'Documento descargado',
      admin: { readOnly: true, description: 'El documento que fue descargado.' },
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      label: 'Usuario',
      admin: { readOnly: true, description: 'Usuario registrado que realizó la descarga (si estaba logueado).' },
    },
    {
      name: 'downloadedAt',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      label: 'Fecha de descarga',
      admin: { readOnly: true },
    },
    {
      name: 'ip',
      type: 'text',
      label: 'Dirección IP',
      admin: { readOnly: true, position: 'sidebar' },
    },
    {
      name: 'userAgent',
      type: 'text',
      label: 'Navegador',
      admin: { readOnly: true, position: 'sidebar' },
    },
  ],
};
