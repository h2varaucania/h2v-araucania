import type { GlobalConfig } from 'payload';

export const PaginaQuienesSomos: GlobalConfig = {
  slug: 'pagina-quienes-somos',
  label: 'Quiénes Somos',
  admin: { group: 'Páginas' },
  fields: [
    {
      name: 'hero',
      type: 'group',
      label: 'Encabezado',
      fields: [
        { name: 'titulo', type: 'text', defaultValue: 'Quiénes Somos' },
        { name: 'subtitulo', type: 'textarea', defaultValue: 'El Programa Estratégico Regional de Hidrógeno Verde de La Araucanía impulsa el crecimiento socioeconómico regional mediante tecnologías de hidrógeno verde.' },
      ],
    },
    {
      name: 'bienPublico',
      type: 'group',
      label: 'El Bien Público',
      fields: [
        { name: 'titulo', type: 'text', defaultValue: 'El Bien Público' },
        { name: 'contenido', type: 'richText', required: true },
      ],
    },
    {
      name: 'instituciones',
      type: 'array',
      label: 'Instituciones participantes',
      fields: [
        { name: 'nombre', type: 'text', required: true },
        { name: 'rol', type: 'text', required: true },
        { name: 'logo', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      name: 'consejoTitulo', type: 'text', label: 'Título sección Consejo',
      defaultValue: 'Consejo de Dirección del Hidrógeno Verde de Araucanía',
    },
    {
      name: 'consejoDescripcion', type: 'textarea', label: 'Descripción del Consejo',
      defaultValue: 'Instancia estratégica encargada de definir la visión, aprobar planes de desarrollo y supervisar el progreso del proyecto.',
    },
    {
      name: 'comiteTitulo', type: 'text', label: 'Título sección Comité',
      defaultValue: 'Comité Consultivo Técnico Científico',
    },
    {
      name: 'comiteDescripcion', type: 'textarea', label: 'Descripción del Comité',
      defaultValue: 'Integrado por miembros de la sociedad civil, ONGs y otros actores relevantes para fiscalizar y transparentar el desarrollo del proyecto.',
    },
  ],
};
