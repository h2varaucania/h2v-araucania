import type { GlobalConfig } from 'payload';

export const SitioGeneral: GlobalConfig = {
  slug: 'sitio-general',
  label: 'Configuración General',
  admin: { group: 'Configuración' },
  fields: [
    { name: 'nombreSitio', type: 'text', defaultValue: 'H2V Araucanía' },
    { name: 'descripcionSEO', type: 'textarea', defaultValue: 'Plataforma informativa sobre los avances, proyectos y oportunidades del hidrógeno verde en la región de La Araucanía, Chile.' },
    { name: 'footerTexto', type: 'textarea', defaultValue: 'Plataforma informativa del Bien Público 24BP-269085. Programa Estratégico Regional de Hidrógeno Verde en La Araucanía.' },
    { name: 'footerPrograma', type: 'text', defaultValue: 'Programa Desarrollo Productivo Sostenible — CORFO' },
    {
      name: 'instituciones',
      type: 'array',
      label: 'Logos institucionales (footer e inicio)',
      fields: [
        { name: 'nombre', type: 'text', required: true },
        { name: 'logo', type: 'upload', relationTo: 'media', required: true },
      ],
    },
  ],
};
