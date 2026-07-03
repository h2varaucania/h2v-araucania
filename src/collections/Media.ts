import type { CollectionConfig } from 'payload';
import { anyone, isAdmin, isAdminOrEditor } from '@/lib/access';
import path from 'path';
import { fileURLToPath } from 'url';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Archivo multimedia',
    plural: 'Archivos multimedia',
  },
  access: {
    read: anyone,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    // Borrar es permanente y puede romper noticias/documentos que usan el archivo (F9).
    delete: isAdmin,
  },
  admin: {
    useAsTitle: 'alt',
    group: 'Sistema',
    description: 'Sube imágenes (JPG, PNG, WebP) y documentos (PDF, Word). Estos archivos se usan en noticias, documentos y otras secciones del sitio. NO subas archivos de texto plano (.txt) — solo imágenes y PDFs.',
  },
  upload: {
    staticDir: path.resolve(dirname, '../../..', 'public/uploads'),
    mimeTypes: [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/svg+xml',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ],
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
        description: 'Describe brevemente el contenido. Ej: "Logo CORFO", "Foto reunión marzo 2026".',
      },
    },
  ],
};
