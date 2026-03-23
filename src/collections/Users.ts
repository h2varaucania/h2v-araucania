import type { CollectionConfig } from 'payload';

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Usuario', plural: 'Usuarios' },
  auth: true,
  admin: {
    useAsTitle: 'email',
    description: 'Usuarios registrados en la plataforma. Los administradores y editores pueden gestionar contenido. Los usuarios registrados pueden descargar documentos.',
  },
  fields: [
    {
      name: 'nombre',
      type: 'text',
      required: true,
      label: 'Nombre completo',
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'registrado',
      label: 'Rol',
      options: [
        { label: 'Administrador (acceso total)', value: 'admin' },
        { label: 'Editor (puede publicar contenido)', value: 'editor' },
        { label: 'Registrado (puede descargar documentos)', value: 'registrado' },
      ],
      admin: { position: 'sidebar', description: 'Administrador: acceso total. Editor: puede crear y editar noticias, documentos, eventos. Registrado: solo puede descargar documentos.' },
    },
    {
      name: 'institucion',
      type: 'text',
      label: 'Institución (opcional)',
      admin: { description: 'Organización a la que pertenece el usuario.' },
    },
  ],
};
