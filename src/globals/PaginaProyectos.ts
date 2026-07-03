import type { GlobalConfig } from 'payload';

export const PaginaProyectos: GlobalConfig = {
  slug: 'pagina-proyectos',
  label: 'Mapa de Proyectos',
  admin: {
    group: 'Páginas',
    description:
      'Encabezado de la página del Mapa de Proyectos. Los proyectos que aparecen en el mapa se gestionan en Contenido → Proyectos.',
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      label: 'Encabezado',
      fields: [
        {
          name: 'titulo',
          type: 'text',
          maxLength: 60,
          defaultValue: 'Mapa de Proyectos',
          admin: { description: 'Título del banner.' },
        },
        {
          name: 'subtitulo',
          type: 'textarea',
          maxLength: 300,
          defaultValue: 'Proyectos de hidrógeno verde en desarrollo y ejecución a nivel regional y nacional.',
          admin: { description: 'Texto debajo del título.' },
        },
      ],
    },
  ],
};
