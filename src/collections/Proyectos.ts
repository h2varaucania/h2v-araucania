import type { CollectionConfig } from 'payload';

export const Proyectos: CollectionConfig = {
  slug: 'proyectos',
  labels: { singular: 'Proyecto', plural: 'Proyectos' },
  admin: {
    useAsTitle: 'nombre',
    defaultColumns: ['nombre', 'empresa', 'etapa', 'region'],
    group: 'Contenido',
    description: 'Agrega proyectos de hidrógeno verde que aparecerán en el Mapa de Proyectos. Cada proyecto se muestra como un marcador en el mapa con su información.',
  },
  fields: [
    {
      name: 'nombre',
      type: 'text',
      required: true,
      maxLength: 100,
      label: 'Nombre del proyecto',
      admin: { description: 'Ej: "Planta piloto H2V Temuco", "Proyecto eólico Araucanía Norte"' },
    },
    {
      name: 'descripcion',
      type: 'textarea',
      required: true,
      maxLength: 400,
      label: 'Descripción',
      admin: { description: 'Descripción breve del proyecto (2-4 oraciones). Aparece en el popup del mapa.' },
    },
    {
      name: 'empresa',
      type: 'text',
      required: true,
      maxLength: 80,
      label: 'Empresa o entidad',
      admin: { description: 'Nombre de la empresa u organización responsable del proyecto.' },
    },
    {
      name: 'etapa',
      type: 'select',
      required: true,
      label: 'Etapa actual',
      options: [
        { label: 'Planificación', value: 'planificacion' },
        { label: 'Pilotaje', value: 'pilotaje' },
        { label: 'Desarrollo', value: 'desarrollo' },
        { label: 'Operación', value: 'operacion' },
      ],
      admin: { position: 'sidebar', description: 'En qué etapa se encuentra el proyecto actualmente.' },
    },
    {
      name: 'region',
      type: 'select',
      required: true,
      label: 'Ubicación',
      options: [
        { label: 'Araucanía', value: 'araucania' },
        { label: 'Nacional (otra región)', value: 'nacional' },
      ],
      admin: { position: 'sidebar', description: 'Si es un proyecto en La Araucanía o en otra región de Chile.' },
    },
    {
      name: 'coordenadas',
      type: 'group',
      label: 'Coordenadas geográficas',
      admin: { description: 'Latitud y longitud para ubicar el proyecto en el mapa. Puedes obtenerlas desde Google Maps haciendo clic derecho en la ubicación.' },
      fields: [
        { name: 'lat', type: 'number', required: true, min: -56, max: -17, label: 'Latitud', admin: { description: 'Ej: -38.7359 (Temuco)' } },
        { name: 'lng', type: 'number', required: true, min: -76, max: -66, label: 'Longitud', admin: { description: 'Ej: -72.5904 (Temuco)' } },
      ],
    },
    {
      name: 'capacidadMW',
      type: 'number',
      label: 'Capacidad (MW)',
      admin: { position: 'sidebar', description: 'Capacidad instalada en megawatts (si aplica).' },
    },
    {
      name: 'produccionTonAnio',
      type: 'number',
      label: 'Producción (ton/año)',
      admin: { position: 'sidebar', description: 'Producción estimada en toneladas por año (si aplica).' },
    },
    {
      name: 'imagen',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagen del proyecto (opcional)',
      admin: { description: 'Foto o render del proyecto.' },
    },
    {
      name: 'url',
      type: 'text',
      label: 'Enlace externo (opcional)',
      admin: { description: 'URL al sitio web del proyecto o empresa, si existe.' },
    },
  ],
};
