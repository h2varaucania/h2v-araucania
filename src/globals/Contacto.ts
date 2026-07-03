import type { GlobalConfig } from 'payload';
import { isAdmin } from '@/lib/access';

export const ContactoGlobal: GlobalConfig = {
  slug: 'contacto',
  label: 'Contacto',
  // Datos institucionales (email público, mandante, código BP): solo administradores (F8).
  access: { update: isAdmin },
  admin: {
    group: 'Configuración',
    description: 'Datos de contacto que aparecen en la página de Contacto y en el footer del sitio.',
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      label: 'Email de contacto',
      defaultValue: 'h2varaucania@gmail.com',
      admin: { description: 'Email público al que llegarán los mensajes del formulario de contacto.' },
    },
    {
      name: 'ubicacion',
      type: 'text',
      label: 'Ubicación',
      maxLength: 100,
      defaultValue: 'Temuco, Región de La Araucanía, Chile',
      admin: { description: 'Dirección o ciudad que se muestra en la página de contacto.' },
    },
    {
      name: 'telefono',
      type: 'text',
      label: 'Teléfono (opcional)',
      maxLength: 20,
      admin: { description: 'Número de teléfono público. Déjalo vacío si no aplica.' },
    },
    {
      name: 'ejecutor1',
      type: 'text',
      label: 'Ejecutor principal',
      maxLength: 100,
      defaultValue: 'CODESSER — Corporación de Desarrollo Social del Sector Rural',
      admin: { description: 'Nombre completo del ejecutor principal del Bien Público.' },
    },
    {
      name: 'ejecutor2',
      type: 'text',
      label: 'Co-ejecutor',
      maxLength: 100,
      defaultValue: 'Universidad de Talca — Co-ejecutor técnico',
      admin: { description: 'Nombre del co-ejecutor técnico.' },
    },
    {
      name: 'mandante',
      type: 'text',
      label: 'Mandante',
      maxLength: 100,
      defaultValue: 'Subsecretaría de Energía — Ministerio de Energía',
      admin: { description: 'Institución mandante del programa.' },
    },
    {
      name: 'codigoBP',
      type: 'text',
      label: 'Código Bien Público',
      maxLength: 30,
      defaultValue: 'Bien Público 24BP-269085',
      admin: { description: 'Código CORFO del Bien Público.' },
    },
  ],
};
