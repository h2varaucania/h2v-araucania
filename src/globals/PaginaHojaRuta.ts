import type { GlobalConfig } from 'payload';
import { revalidaGlobal } from '@/hooks/revalidate';

export const PaginaHojaRuta: GlobalConfig = {
  slug: 'pagina-hoja-ruta',
  hooks: { afterChange: [revalidaGlobal('/hidrogeno-verde/hoja-de-ruta')] },
  label: 'Hoja de Ruta',
  admin: {
    group: 'Páginas',
    description: 'Timeline de hitos estratégicos del programa H2V Araucanía (2024-2050).',
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      label: 'Encabezado',
      fields: [
        { name: 'titulo', type: 'text', maxLength: 60, defaultValue: 'Hoja de Ruta', admin: { description: 'Título del banner.' } },
        { name: 'subtitulo', type: 'textarea', maxLength: 250, defaultValue: 'Estrategia regional para el desarrollo del hidrógeno verde en La Araucanía, horizonte 2024-2050.', admin: { description: 'Texto debajo del título.' } },
      ],
    },
    {
      name: 'hitos',
      type: 'array',
      label: 'Hitos del timeline',
      maxRows: 12,
      admin: { description: 'Cada hito se muestra como un punto en la línea de tiempo de la página.' },
      fields: [
        { name: 'periodo', type: 'text', required: true, maxLength: 20, label: 'Año/Período', admin: { description: 'Ej: "2024-2026", "2030", "2050"' } },
        { name: 'titulo', type: 'text', required: true, maxLength: 80 },
        { name: 'descripcion', type: 'textarea', required: true, maxLength: 300 },
      ],
    },
    {
      name: 'notaFinal',
      type: 'textarea',
      label: 'Nota al pie',
      maxLength: 300,
      defaultValue: 'La Hoja de Ruta detallada se publicará como documento descargable una vez completado el proceso de diagnóstico regional.',
      admin: { description: 'Texto que aparece al final de la página.' },
    },
  ],
};
