import type { GlobalConfig } from 'payload';
import { revalidaGlobal } from '@/hooks/revalidate';

export const PaginaPrivacidad: GlobalConfig = {
  slug: 'pagina-privacidad',
  hooks: { afterChange: [revalidaGlobal('/politica-privacidad')] },
  label: 'Política de Privacidad',
  admin: {
    group: 'Páginas',
    description:
      'Página legal de Política de Privacidad. El email de contacto que muestra la página se toma de Configuración → Contacto (no hay que tocarlo aquí).',
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
          defaultValue: 'Política de Privacidad',
          admin: { description: 'Título del banner.' },
        },
        {
          name: 'subtitulo',
          type: 'textarea',
          maxLength: 300,
          defaultValue: 'Protección de datos personales conforme a la legislación chilena.',
          admin: { description: 'Texto debajo del título.' },
        },
      ],
    },
    {
      name: 'fechaActualizacion',
      type: 'text',
      maxLength: 40,
      label: 'Última actualización',
      defaultValue: 'abril 2026',
      admin: {
        description: 'Se muestra al inicio de la política. Actualízala cada vez que cambies el texto. Ej: "julio 2026".',
      },
    },
    {
      name: 'contenido',
      type: 'richText',
      label: 'Texto completo de la política (opcional)',
      admin: {
        description:
          'Si escribes aquí, este texto REEMPLAZA completo al texto estándar de la página. Si lo dejas vacío, se muestra el texto estándar del programa.',
      },
    },
  ],
};
