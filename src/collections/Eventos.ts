import type { CollectionConfig } from 'payload';

export const Eventos: CollectionConfig = {
  slug: 'eventos',
  labels: { singular: 'Evento', plural: 'Eventos' },
  admin: {
    useAsTitle: 'titulo',
    defaultColumns: ['titulo', 'fecha', 'lugar', 'tipo', 'publicado'],
    description: 'Publica eventos del programa: seminarios, talleres, ferias, reuniones y capacitaciones. Aparecen en la sección "Eventos" del sitio.',
  },
  fields: [
    {
      name: 'titulo',
      type: 'text',
      required: true,
      label: 'Nombre del evento',
      admin: { description: 'Ej: "Seminario Internacional de Hidrógeno Verde", "Taller de capacitación para sector forestal"' },
    },
    {
      name: 'descripcion',
      type: 'richText',
      required: true,
      label: 'Descripción',
      admin: { description: 'Detalle del evento: programa, expositores, objetivos, público objetivo.' },
    },
    {
      name: 'fecha',
      type: 'date',
      required: true,
      label: 'Fecha de inicio',
      admin: { position: 'sidebar', description: 'Día en que comienza el evento.' },
    },
    {
      name: 'fechaFin',
      type: 'date',
      label: 'Fecha de término (opcional)',
      admin: { position: 'sidebar', description: 'Solo si el evento dura más de un día.' },
    },
    {
      name: 'lugar',
      type: 'text',
      required: true,
      label: 'Lugar',
      admin: { description: 'Ej: "Hotel Dreams, Temuco", "Online vía Zoom", "Universidad de La Frontera, Temuco"' },
    },
    {
      name: 'tipo',
      type: 'select',
      label: 'Tipo de evento',
      options: [
        { label: 'Seminario', value: 'seminario' },
        { label: 'Taller', value: 'taller' },
        { label: 'Feria', value: 'feria' },
        { label: 'Reunión', value: 'reunion' },
        { label: 'Capacitación', value: 'capacitacion' },
        { label: 'Otro', value: 'otro' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'imagen',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagen o afiche (opcional)',
      admin: { description: 'Imagen promocional del evento.' },
    },
    {
      name: 'urlInscripcion',
      type: 'text',
      label: 'Enlace de inscripción (opcional)',
      admin: { description: 'URL al formulario de inscripción. Ej: enlace a Google Forms o Eventbrite.' },
    },
    {
      name: 'publicado',
      type: 'checkbox',
      defaultValue: false,
      label: 'Publicado',
      admin: { position: 'sidebar', description: 'Marca para que el evento sea visible en el sitio público.' },
    },
  ],
};
