import type { GlobalConfig } from 'payload';
import { revalidaGlobal } from '@/hooks/revalidate';

export const PaginaQuienesSomos: GlobalConfig = {
  slug: 'pagina-quienes-somos',
  hooks: { afterChange: [revalidaGlobal('/programa/quienes-somos')] },
  label: 'Quiénes Somos',
  admin: {
    group: 'Páginas',
    description: 'Descripción del Bien Público, instituciones participantes y títulos de las secciones de Consejo y Comité.',
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      label: 'Encabezado',
      fields: [
        { name: 'titulo', type: 'text', maxLength: 60, defaultValue: 'Quiénes Somos', admin: { description: 'Título del banner.' } },
        { name: 'subtitulo', type: 'textarea', maxLength: 300, defaultValue: 'El Programa Estratégico Regional de Hidrógeno Verde de La Araucanía impulsa el crecimiento socioeconómico regional mediante tecnologías de hidrógeno verde.', admin: { description: 'Texto debajo del título.' } },
      ],
    },
    {
      name: 'bienPublico',
      type: 'group',
      label: 'El Bien Público',
      admin: { description: 'Descripción del BP 24BP-269085: objetivo, alcance, instituciones.' },
      fields: [
        { name: 'titulo', type: 'text', maxLength: 60, defaultValue: 'El Bien Público' },
        { name: 'contenido', type: 'richText', required: true, admin: { description: 'Texto libre sobre el Bien Público. Puedes usar negritas, listas y enlaces.' } },
      ],
    },
    {
      name: 'instituciones',
      type: 'array',
      label: 'Instituciones participantes',
      maxRows: 10,
      admin: { description: 'Instituciones que participan en el programa (CORFO, CODESSER, UTalca, etc.).' },
      fields: [
        { name: 'nombre', type: 'text', required: true, maxLength: 80, admin: { description: 'Nombre de la institución.' } },
        { name: 'rol', type: 'text', required: true, maxLength: 100, admin: { description: 'Rol en el programa. Ej: "Ejecutor principal", "Co-ejecutor técnico"' } },
        { name: 'logo', type: 'upload', relationTo: 'media', label: 'Logo (opcional)' },
      ],
    },
    {
      name: 'consejoTitulo',
      type: 'text',
      maxLength: 80,
      label: 'Título sección Consejo',
      defaultValue: 'Comité Estratégico del Bien Público',
      admin: { description: 'Título que aparece sobre la lista de miembros del Consejo.' },
    },
    {
      name: 'consejoDescripcion',
      type: 'textarea',
      maxLength: 300,
      label: 'Descripción del Consejo',
      defaultValue: 'Instancia estratégica del proyecto, presidida por la entidad mandante (Seremi de Energía de La Araucanía) con vicepresidencia de CORFO. Sesiona periódicamente desde junio de 2025.',
    },
    {
      name: 'comiteTitulo',
      type: 'text',
      maxLength: 80,
      label: 'Título sección Comité',
      defaultValue: 'Comité Consultivo Técnico Científico',
      admin: { description: 'Título que aparece sobre la lista de miembros del Comité.' },
    },
    {
      name: 'comiteDescripcion',
      type: 'textarea',
      maxLength: 300,
      label: 'Descripción del Comité',
      defaultValue: 'Integrado por miembros de la sociedad civil, ONGs y otros actores relevantes para fiscalizar y transparentar el desarrollo del proyecto.',
    },
  ],
};
