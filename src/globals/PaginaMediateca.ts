import type { GlobalConfig } from 'payload';
import { revalidaGlobal } from '@/hooks/revalidate';

export const PaginaMediateca: GlobalConfig = {
  slug: 'pagina-mediateca',
  hooks: { afterChange: [revalidaGlobal('/recursos/mediateca')] },
  label: 'Mediateca',
  admin: {
    group: 'Páginas',
    description: 'Videos, infografías y material multimedia. Agrega recursos o deja el mensaje de "próximamente" mientras no haya material.',
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      label: 'Encabezado',
      fields: [
        { name: 'titulo', type: 'text', maxLength: 60, defaultValue: 'Mediateca', admin: { description: 'Título del banner.' } },
        { name: 'subtitulo', type: 'textarea', maxLength: 300, defaultValue: 'Videos, infografías y material multimedia del programa.', admin: { description: 'Texto debajo del título.' } },
      ],
    },
    {
      name: 'recursos',
      type: 'array',
      label: 'Recursos multimedia',
      maxRows: 60,
      admin: { description: 'Cada recurso: título, tipo, enlace y descripción. Si dejas esta lista vacía, se muestra el mensaje de "próximamente".' },
      fields: [
        { name: 'titulo', type: 'text', required: true, maxLength: 120 },
        {
          name: 'tipo',
          type: 'select',
          defaultValue: 'video',
          options: [
            { label: 'Video', value: 'video' },
            { label: 'Infografía', value: 'infografia' },
            { label: 'Presentación', value: 'presentacion' },
            { label: 'Documento', value: 'documento' },
          ],
        },
        { name: 'url', type: 'text', required: true, label: 'Enlace', admin: { description: 'Enlace al video (YouTube/Vimeo) o al archivo.' } },
        { name: 'descripcion', type: 'textarea', maxLength: 240 },
      ],
    },
    {
      name: 'mensajeVacio',
      type: 'group',
      label: 'Mensaje cuando no hay recursos',
      admin: { description: 'Se muestra mientras la lista de recursos esté vacía.' },
      fields: [
        { name: 'titulo', type: 'text', maxLength: 120, defaultValue: 'Próximamente se publicará material multimedia.' },
        { name: 'subtitulo', type: 'text', maxLength: 200, defaultValue: 'Videos, infografías y presentaciones del programa se alojarán en esta sección.' },
      ],
    },
  ],
};
