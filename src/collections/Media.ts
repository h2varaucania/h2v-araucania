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
    // Sin tamaños derivados (imageSizes), a propósito: con addRandomSuffix activo en el plugin
    // de Vercel Blob (payload.config.ts), cada tamaño subido pisaba el nombre del original y el
    // sitio terminaba sirviendo una versión recortada (visto el 24-09-2026). El sitio nunca usó
    // esos tamaños: next/image optimiza el original. Las columnas sizes_* de la base quedan
    // huérfanas (ver la migración 20260924_155206_sin_tamanos_imagen_y_tildes).
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
