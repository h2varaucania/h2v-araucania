import type { GlobalConfig } from 'payload';

export const PaginaH2V: GlobalConfig = {
  slug: 'pagina-h2v',
  label: 'Hidrógeno Verde',
  admin: { group: 'Páginas' },
  fields: [
    {
      name: 'hero',
      type: 'group',
      label: 'Encabezado',
      fields: [
        { name: 'titulo', type: 'text', defaultValue: 'Hidrógeno Verde' },
        { name: 'subtitulo', type: 'textarea', defaultValue: 'El hidrógeno verde es un vector energético producido mediante electrólisis del agua utilizando energías renovables. No genera emisiones de CO2 y es clave para la descarbonización de la economía.' },
      ],
    },
    {
      name: 'queEs',
      type: 'group',
      label: '¿Qué es el H2V?',
      fields: [
        { name: 'titulo', type: 'text', defaultValue: '¿Qué es el Hidrógeno Verde?' },
        { name: 'contenido', type: 'richText' },
      ],
    },
    {
      name: 'electrolisis',
      type: 'group',
      label: 'Proceso de Electrólisis',
      fields: [
        { name: 'titulo', type: 'text', defaultValue: 'Proceso de Electrólisis' },
        { name: 'pasos', type: 'array', label: 'Pasos', fields: [
          { name: 'titulo', type: 'text', required: true },
          { name: 'descripcion', type: 'textarea', required: true },
        ]},
      ],
    },
    {
      name: 'electrolizadores',
      type: 'array',
      label: 'Tipos de Electrolizadores',
      fields: [
        { name: 'nombre', type: 'text', required: true },
        { name: 'descripcion', type: 'textarea', required: true },
        { name: 'madurez', type: 'text' },
        { name: 'costo', type: 'text' },
      ],
    },
    {
      name: 'cadenaValor',
      type: 'array',
      label: 'Cadena de Valor',
      fields: [
        { name: 'titulo', type: 'text', required: true },
        { name: 'descripcion', type: 'text', required: true },
        { name: 'icono', type: 'text', label: 'Emoji/icono' },
      ],
    },
    {
      name: 'derivados',
      type: 'array',
      label: 'Derivados del H2V',
      fields: [
        { name: 'nombre', type: 'text', required: true },
        { name: 'descripcion', type: 'textarea', required: true },
        { name: 'aplicacion', type: 'text' },
      ],
    },
  ],
};
