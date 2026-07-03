import type { GlobalConfig } from 'payload';

export const PaginaAccesibilidad: GlobalConfig = {
  slug: 'pagina-accesibilidad',
  label: 'Accesibilidad',
  admin: {
    group: 'Páginas',
    description:
      'Página de Declaración de Accesibilidad. El email de contacto que muestra la página se toma de Configuración → Contacto.',
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
          defaultValue: 'Accesibilidad',
          admin: { description: 'Título del banner.' },
        },
        {
          name: 'subtitulo',
          type: 'textarea',
          maxLength: 300,
          defaultValue: 'Nuestro compromiso con un sitio web accesible para todas las personas.',
          admin: { description: 'Texto debajo del título.' },
        },
      ],
    },
    {
      name: 'contenido',
      type: 'richText',
      label: 'Texto completo de la declaración (opcional)',
      admin: {
        description:
          'Si escribes aquí, este texto REEMPLAZA completo al texto estándar de la página. Si lo dejas vacío, se muestra el texto estándar del programa.',
      },
    },
  ],
};
