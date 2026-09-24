import type { CollectionConfig } from 'payload';
import { isAdmin, isAdminOrEditor } from '@/lib/access';
import { contactoDefaults } from '@/content/defaults/contacto';

/** Asuntos del formulario de Contacto (mismos valores que valida /api/contact). */
export const OPCIONES_ASUNTO = contactoDefaults.formOpcionesAsunto.map((o) => ({
  label: o.etiqueta,
  value: o.valor,
}));

/**
 * Cada mensaje del formulario de Contacto se guarda aquí ANTES de intentar el aviso por
 * correo: si el envío falla (hoy el remitente de prueba de Resend solo entrega a su dueño),
 * el mensaje no se pierde. Solo la ruta /api/contact crea documentos (Local API con
 * overrideAccess); por REST nadie puede crearlos.
 */
export const MensajesContacto: CollectionConfig = {
  slug: 'mensajes-contacto',
  labels: { singular: 'Mensaje de contacto', plural: 'Mensajes de contacto' },
  defaultSort: '-createdAt',
  admin: {
    useAsTitle: 'nombre',
    defaultColumns: ['nombre', 'asunto', 'atendido', 'createdAt'],
    group: 'Contenido',
    description:
      'Los mensajes que envían los visitantes desde la página Contacto. Todos quedan guardados aquí, aunque el aviso por correo no llegue. Para responder, escriba a la persona desde su propio correo y después marque «Atendido».',
  },
  access: {
    create: () => false,
    read: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'nombre',
      type: 'text',
      required: true,
      label: 'Nombre',
      admin: { readOnly: true },
    },
    {
      name: 'correo',
      type: 'email',
      required: true,
      label: 'Correo de la persona',
      admin: { readOnly: true, description: 'Responda a esta dirección desde su propio correo.' },
    },
    {
      name: 'asunto',
      type: 'select',
      required: true,
      label: 'Asunto',
      options: OPCIONES_ASUNTO,
      admin: { readOnly: true },
    },
    {
      name: 'mensaje',
      type: 'textarea',
      required: true,
      label: 'Mensaje',
      admin: { readOnly: true },
    },
    {
      name: 'atendido',
      type: 'checkbox',
      defaultValue: false,
      label: 'Atendido',
      admin: { position: 'sidebar', description: 'Márquelo cuando haya respondido el mensaje.' },
    },
    {
      name: 'estadoCorreo',
      type: 'select',
      label: 'Aviso por correo',
      options: [
        { label: 'Enviado', value: 'enviado' },
        { label: 'No se pudo enviar', value: 'fallido' },
        { label: 'Correo no configurado', value: 'sin-configurar' },
      ],
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Si el aviso llegó al correo del programa. El mensaje queda guardado aquí de todas formas.',
      },
    },
  ],
};
