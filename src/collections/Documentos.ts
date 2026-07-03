import type { CollectionConfig } from 'payload';
import { anyone, isAdmin, isAdminOrEditor } from '@/lib/access';

export const Documentos: CollectionConfig = {
  slug: 'documentos',
  labels: { singular: 'Documento', plural: 'Documentos' },
  access: {
    read: anyone,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    // Borrar es permanente (no hay papelera): reservado a administradores (F9).
    delete: isAdmin,
  },
  admin: {
    useAsTitle: 'titulo',
    defaultColumns: ['titulo', 'tipo', 'anio', 'descargas'],
    group: 'Contenido',
    description: 'Sube documentos técnicos, de difusión, regulatorios o de capacitación. Aparecen en la sección "Recursos y Documentación" del sitio. Los visitantes registrados pueden descargarlos y cada descarga queda registrada.',
  },
  fields: [
    {
      name: 'titulo',
      type: 'text',
      required: true,
      maxLength: 120,
      label: 'Título del documento',
      admin: { description: 'Nombre descriptivo del documento. Ej: "Estrategia Nacional de Hidrógeno Verde"' },
    },
    {
      name: 'descripcion',
      type: 'textarea',
      required: true,
      maxLength: 400,
      label: 'Descripción',
      admin: { description: 'Breve descripción del contenido del documento (2-3 oraciones).' },
    },
    {
      name: 'archivo',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Archivo para descargar',
      admin: { description: 'Sube el archivo PDF o Word que los visitantes podrán descargar.' },
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagen de portada (opcional)',
      admin: { description: 'Imagen que se mostrará como miniatura del documento. Si no subes una, se usará un icono genérico.' },
    },
    {
      name: 'tipo',
      type: 'select',
      required: true,
      label: 'Tipo de documento',
      options: [
        { label: 'Técnico', value: 'tecnico' },
        { label: 'Difusión', value: 'difusion' },
        { label: 'Regulatorio', value: 'regulatorio' },
        { label: 'Capacitación', value: 'capacitacion' },
      ],
      admin: { position: 'sidebar', description: 'Categoría del documento. Los visitantes pueden filtrar por tipo.' },
    },
    {
      name: 'anio',
      type: 'number',
      required: true,
      min: 2024,
      max: 2050,
      label: 'Año',
      admin: { position: 'sidebar', description: 'Año del documento. Los visitantes pueden filtrar por año.' },
    },
    {
      name: 'descargas',
      type: 'number',
      defaultValue: 0,
      label: 'Descargas',
      admin: { position: 'sidebar', readOnly: true, description: 'Contador automático de descargas. No lo modifiques manualmente.' },
    },
  ],
};
