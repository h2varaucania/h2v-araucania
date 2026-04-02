import type { GlobalConfig } from 'payload';

export const PaginaInicio: GlobalConfig = {
  slug: 'pagina-inicio',
  label: 'Página de Inicio',
  admin: {
    group: 'Páginas',
    description: 'Contenido del hero, botones y tarjetas de acceso rápido de la página principal.',
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      label: 'Sección Hero (banner principal)',
      fields: [
        {
          name: 'titulo',
          type: 'text',
          required: true,
          maxLength: 80,
          defaultValue: 'Hidrógeno Verde en La Araucanía',
          admin: { description: 'Título grande que aparece sobre el banner principal.' },
        },
        {
          name: 'subtitulo',
          type: 'textarea',
          required: true,
          maxLength: 250,
          defaultValue: 'Plataforma informativa sobre los avances, proyectos y oportunidades del hidrógeno verde en la región de La Araucanía, Chile.',
          admin: { description: 'Texto debajo del título. Máximo 250 caracteres.' },
        },
        {
          name: 'ctaPrimario',
          type: 'text',
          maxLength: 40,
          defaultValue: 'Conozca el Programa',
          admin: { description: 'Texto del botón principal. Ej: "Conozca el Programa"' },
        },
        {
          name: 'ctaSecundario',
          type: 'text',
          maxLength: 40,
          defaultValue: 'Ver Proyectos en el Mapa',
          admin: { description: 'Texto del botón secundario. Ej: "Ver Proyectos en el Mapa"' },
        },
      ],
    },
    {
      name: 'seccionExplora',
      type: 'group',
      label: 'Sección "Explora el Programa"',
      fields: [
        {
          name: 'titulo',
          type: 'text',
          maxLength: 60,
          defaultValue: 'Explora el Programa',
          admin: { description: 'Título de la sección de tarjetas de acceso rápido.' },
        },
        {
          name: 'cards',
          type: 'array',
          label: 'Tarjetas de acceso rápido',
          maxRows: 6,
          admin: { description: 'Tarjetas que aparecen debajo del hero. Cada una lleva a una sección del sitio.' },
          fields: [
            { name: 'titulo', type: 'text', required: true, maxLength: 50, admin: { description: 'Ej: "Mapa de Proyectos", "Noticias"' } },
            { name: 'descripcion', type: 'textarea', required: true, maxLength: 150, admin: { description: 'Breve descripción de la sección (1 oración).' } },
            { name: 'enlace', type: 'text', required: true, maxLength: 100, admin: { description: 'Ruta de la sección. Ej: "/proyectos", "/noticias"' } },
          ],
        },
      ],
    },
  ],
};
