import type { GlobalConfig } from 'payload';

export const PaginaInicio: GlobalConfig = {
  slug: 'pagina-inicio',
  label: 'Página de Inicio',
  admin: {
    group: 'Páginas',
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      label: 'Sección Hero',
      fields: [
        { name: 'titulo', type: 'text', required: true, defaultValue: 'Hidrógeno Verde en La Araucanía' },
        { name: 'subtitulo', type: 'textarea', required: true, defaultValue: 'Plataforma informativa sobre los avances, proyectos y oportunidades del hidrógeno verde en la región de La Araucanía, Chile.' },
        { name: 'ctaPrimario', type: 'text', defaultValue: 'Conozca el Programa' },
        { name: 'ctaSecundario', type: 'text', defaultValue: 'Ver Proyectos en el Mapa' },
      ],
    },
    {
      name: 'seccionExplora',
      type: 'group',
      label: 'Sección Explora el Programa',
      fields: [
        { name: 'titulo', type: 'text', defaultValue: 'Explora el Programa' },
        {
          name: 'cards',
          type: 'array',
          label: 'Tarjetas de acceso rápido',
          fields: [
            { name: 'titulo', type: 'text', required: true },
            { name: 'descripcion', type: 'textarea', required: true },
            { name: 'enlace', type: 'text', required: true },
          ],
        },
      ],
    },
  ],
};
