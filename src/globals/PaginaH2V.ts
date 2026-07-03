import type { GlobalConfig } from 'payload';

export const PaginaH2V: GlobalConfig = {
  slug: 'pagina-h2v',
  label: 'Hidrógeno Verde',
  admin: {
    group: 'Páginas',
    description: 'Contenido educativo: qué es el H2V, electrólisis, tipos de electrolizadores, cadena de valor y derivados.',
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      label: 'Encabezado',
      fields: [
        { name: 'titulo', type: 'text', maxLength: 60, defaultValue: 'Hidrógeno Verde', admin: { description: 'Título del banner.' } },
        { name: 'subtitulo', type: 'textarea', maxLength: 300, defaultValue: 'El hidrógeno verde es un vector energético producido mediante electrólisis del agua utilizando energías renovables. No genera emisiones de CO2 y es clave para la descarbonización de la economía.', admin: { description: 'Texto debajo del título del banner.' } },
      ],
    },
    {
      name: 'queEs',
      type: 'group',
      label: '¿Qué es el H2V?',
      admin: { description: 'Sección introductoria sobre qué es el hidrógeno verde.' },
      fields: [
        { name: 'titulo', type: 'text', maxLength: 60, defaultValue: '¿Qué es el Hidrógeno Verde?' },
        { name: 'contenido', type: 'richText', admin: { description: 'Texto libre explicando qué es el H2V. Puedes usar negritas, listas y enlaces.' } },
      ],
    },
    {
      name: 'electrolisis',
      type: 'group',
      label: 'Proceso de Electrólisis',
      admin: { description: 'Pasos del proceso de electrólisis mostrados como tarjetas numeradas.' },
      fields: [
        { name: 'titulo', type: 'text', maxLength: 60, defaultValue: 'Proceso de Electrólisis' },
        { name: 'pasos', type: 'array', label: 'Pasos', maxRows: 6, fields: [
          { name: 'titulo', type: 'text', required: true, maxLength: 60, admin: { description: 'Ej: "Fuente renovable", "Electrolizador"' } },
          { name: 'descripcion', type: 'textarea', required: true, maxLength: 200 },
        ]},
      ],
    },
    {
      name: 'electrolizadores',
      type: 'array',
      label: 'Tipos de Electrolizadores',
      maxRows: 5,
      admin: { description: 'Tipos de electrolizadores (PEM, Alcalino, SOEC, etc.) con sus características.' },
      fields: [
        { name: 'nombre', type: 'text', required: true, maxLength: 40 },
        { name: 'descripcion', type: 'textarea', required: true, maxLength: 300 },
        { name: 'madurez', type: 'text', maxLength: 40, label: 'Nivel de madurez', admin: { description: 'Ej: "Comercial", "En desarrollo"' } },
        { name: 'costo', type: 'text', maxLength: 40, label: 'Rango de costo', admin: { description: 'Ej: "$800-1500/kW"' } },
      ],
    },
    {
      name: 'cadenaValor',
      type: 'array',
      label: 'Cadena de Valor',
      maxRows: 6,
      admin: { description: 'Etapas de la cadena de valor del H2V: producción, almacenamiento, transporte, uso.' },
      fields: [
        { name: 'titulo', type: 'text', required: true, maxLength: 40 },
        { name: 'descripcion', type: 'text', required: true, maxLength: 150 },
        { name: 'icono', type: 'text', maxLength: 5, label: 'Emoji/icono', admin: { description: 'Un emoji representativo. Ej: "⚡", "🔋"' } },
      ],
    },
    {
      name: 'derivados',
      type: 'array',
      label: 'Derivados del H2V',
      maxRows: 6,
      admin: { description: 'Productos derivados del hidrógeno verde: amoníaco, metanol, e-combustibles, etc.' },
      fields: [
        { name: 'nombre', type: 'text', required: true, maxLength: 50 },
        { name: 'descripcion', type: 'textarea', required: true, maxLength: 300 },
        { name: 'aplicacion', type: 'text', maxLength: 80, label: 'Aplicación principal', admin: { description: 'Ej: "Fertilizantes verdes", "Transporte marítimo"' } },
      ],
    },
    {
      name: 'exploraMas',
      type: 'array',
      label: 'Sección "Explora más" (tarjetas al final)',
      maxRows: 4,
      admin: { description: 'Tarjetas de enlace al final de la página. Si no agregas ninguna, se muestran las 4 estándar (Sectores, Capital Humano, Hoja de Ruta, Marco Regulatorio).' },
      fields: [
        { name: 'titulo', type: 'text', required: true, maxLength: 40 },
        { name: 'descripcion', type: 'text', required: true, maxLength: 80 },
        {
          name: 'enlace',
          type: 'select',
          required: true,
          label: 'Página de destino',
          admin: { description: 'Se elige de la lista para evitar enlaces rotos.' },
          options: [
            { label: 'Sectores Productivos', value: '/hidrogeno-verde/sectores' },
            { label: 'Capital Humano', value: '/hidrogeno-verde/capital-humano' },
            { label: 'Hoja de Ruta', value: '/hidrogeno-verde/hoja-de-ruta' },
            { label: 'Marco Regulatorio', value: '/hidrogeno-verde/marco-regulatorio' },
            { label: 'Mapa de Proyectos', value: '/proyectos' },
            { label: 'Documentos', value: '/recursos/documentos' },
            { label: 'Noticias', value: '/noticias' },
            { label: 'Contacto', value: '/contacto' },
          ],
        },
      ],
    },
  ],
};
