import type { CollectionConfig } from 'payload';
import { isAdmin } from '@/lib/access';

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Usuario', plural: 'Usuarios' },
  // Límites de login explícitos (F13, Auditoria_traspaso.md): 5 intentos fallidos bloquean la
  // cuenta por 10 minutos. Documentado en la Guía de uso ("si te bloqueas, espera 10 minutos").
  auth: {
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000, // 10 minutos
  },
  access: {
    // Acceso al panel /admin: solo administradores y editores.
    // Los usuarios "registrado" usan el sitio público, no el panel.
    admin: ({ req }) => req.user?.role === 'admin' || req.user?.role === 'editor',
    // La gestión de usuarios queda reservada a administradores.
    read: isAdmin,
    update: isAdmin,
    delete: isAdmin,
    // `create` se deja abierto para el registro público; el rol se sanitiza en beforeChange.
  },
  admin: {
    useAsTitle: 'email',
    group: 'Cuentas y acceso',
    description:
      'Usuarios de la plataforma. Administradores y editores gestionan contenido; los registrados solo pueden descargar documentos.',
  },
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        if (operation === 'create') {
          const { totalDocs } = await req.payload.count({ collection: 'users' });
          // El primer usuario del sitio es SIEMPRE administrador
          // (evita la trampa de quedar sin acceso al panel).
          if (totalDocs === 0) {
            return { ...data, role: 'admin' };
          }
          // Registro público (no creado por un administrador): se fuerza el rol básico,
          // para que nadie pueda auto-asignarse admin/editor desde fuera del panel.
          if (req.user?.role !== 'admin') {
            return { ...data, role: 'registrado' };
          }
        }
        return data;
      },
    ],
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
      admin: {
        position: 'sidebar',
        description:
          'Administrador: acceso total. Editor: puede crear y editar noticias, documentos, eventos. Registrado: solo puede descargar documentos. (El primer usuario del sitio siempre se crea como Administrador.)',
      },
    },
    {
      name: 'institucion',
      type: 'text',
      label: 'Institución (opcional)',
      admin: { description: 'Organización a la que pertenece el usuario.' },
    },
  ],
};
