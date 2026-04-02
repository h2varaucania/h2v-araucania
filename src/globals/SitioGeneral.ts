import type { GlobalConfig } from 'payload';

export const SitioGeneral: GlobalConfig = {
  slug: 'sitio-general',
  label: 'Configuración General',
  admin: {
    group: 'Configuración',
    description: 'Nombre del sitio, texto SEO, texto del footer y logos institucionales. Estos valores se usan en toda la plataforma.',
  },
  fields: [
    {
      name: 'nombreSitio',
      type: 'text',
      label: 'Nombre del sitio',
      maxLength: 60,
      defaultValue: 'H2V Araucanía',
      admin: { description: 'Nombre que aparece en la pestaña del navegador y en resultados de búsqueda.' },
    },
    {
      name: 'descripcionSEO',
      type: 'textarea',
      label: 'Descripción SEO',
      maxLength: 200,
      defaultValue: 'Plataforma informativa sobre los avances, proyectos y oportunidades del hidrógeno verde en la región de La Araucanía, Chile.',
      admin: { description: 'Texto que aparece en Google debajo del nombre del sitio. Máximo 200 caracteres.' },
    },
    {
      name: 'footerTexto',
      type: 'textarea',
      label: 'Texto del footer',
      maxLength: 300,
      defaultValue: 'Plataforma informativa del Bien Público 24BP-269085. Programa Estratégico Regional de Hidrógeno Verde en La Araucanía.',
      admin: { description: 'Texto que aparece al pie de todas las páginas del sitio.' },
    },
    {
      name: 'footerPrograma',
      type: 'text',
      label: 'Línea del programa (footer)',
      maxLength: 100,
      defaultValue: 'Programa Desarrollo Productivo Sostenible — CORFO',
      admin: { description: 'Segunda línea del footer. Ej: "Programa Desarrollo Productivo Sostenible — CORFO"' },
    },
    {
      name: 'instituciones',
      type: 'array',
      label: 'Logos institucionales',
      maxRows: 10,
      admin: { description: 'Logos que aparecen en el footer y la página de inicio. Sube los logos de CORFO, CODESSER, UTalca, etc.' },
      fields: [
        { name: 'nombre', type: 'text', required: true, maxLength: 80, label: 'Nombre de la institución' },
        { name: 'logo', type: 'upload', relationTo: 'media', required: true, label: 'Logo' },
      ],
    },
  ],
};
