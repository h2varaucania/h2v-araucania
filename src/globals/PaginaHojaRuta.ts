import type { GlobalConfig } from 'payload';

export const PaginaHojaRuta: GlobalConfig = {
  slug: 'pagina-hoja-ruta',
  label: 'Hoja de Ruta',
  admin: { group: 'Páginas' },
  fields: [
    {
      name: 'hero',
      type: 'group',
      label: 'Encabezado',
      fields: [
        { name: 'titulo', type: 'text', defaultValue: 'Hoja de Ruta' },
        { name: 'subtitulo', type: 'textarea', defaultValue: 'Estrategia regional para el desarrollo del hidrógeno verde en La Araucanía, horizonte 2024-2050.' },
      ],
    },
    {
      name: 'hitos',
      type: 'array',
      label: 'Hitos del timeline',
      fields: [
        { name: 'periodo', type: 'text', required: true, label: 'Año/Período' },
        { name: 'titulo', type: 'text', required: true },
        { name: 'descripcion', type: 'textarea', required: true },
      ],
    },
    { name: 'notaFinal', type: 'textarea', label: 'Nota al pie',
      defaultValue: 'La Hoja de Ruta detallada se publicará como documento descargable una vez completado el proceso de diagnóstico regional.' },
  ],
};
