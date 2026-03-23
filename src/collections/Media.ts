import type { CollectionConfig } from 'payload';

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Archivo multimedia',
    plural: 'Archivos multimedia',
  },
  admin: {
    useAsTitle: 'alt',
    description: 'Sube imágenes (JPG, PNG, WebP) y documentos (PDF, Word). Estos archivos se usan en noticias, documentos y otras secciones del sitio.',
  },
  upload: {
    staticDir: '../public/uploads',
    mimeTypes: ['image/*', 'application/pdf', 'application/vnd.openxmlformats-officedocument.*'],
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 768, height: 512, position: 'centre' },
      { name: 'hero', width: 1920, height: 1080, position: 'centre' },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      label: 'Descripción del archivo',
      admin: {
        description: 'Describe brevemente el contenido del archivo. Ej: "Logo CORFO", "Foto reunión Consejo Directivo marzo 2026". Este texto aparece cuando la imagen no carga y es leído por lectores de pantalla.',
      },
    },
  ],
};
