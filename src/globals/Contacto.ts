import type { GlobalConfig } from 'payload';

export const ContactoGlobal: GlobalConfig = {
  slug: 'contacto',
  label: 'Contacto',
  admin: { group: 'Configuración' },
  fields: [
    { name: 'email', type: 'email', required: true, defaultValue: 'h2varaucania@gmail.com' },
    { name: 'ubicacion', type: 'text', defaultValue: 'Temuco, Región de La Araucanía, Chile' },
    { name: 'telefono', type: 'text' },
    { name: 'ejecutor1', type: 'text', defaultValue: 'CODESSER — Corporación de Desarrollo Social del Sector Rural' },
    { name: 'ejecutor2', type: 'text', defaultValue: 'Universidad de Talca — Co-ejecutor técnico' },
    { name: 'mandante', type: 'text', defaultValue: 'Subsecretaría de Energía — Ministerio de Energía' },
    { name: 'codigoBP', type: 'text', defaultValue: 'Bien Público 24BP-269085' },
  ],
};
