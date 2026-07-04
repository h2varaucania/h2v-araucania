import type { CollectionConfig } from 'payload';
import { anyone, isAdmin, isAdminOrEditor } from '@/lib/access';
import { revalidaColeccion, revalidaColeccionAlBorrar } from '@/hooks/revalidate';

export const Noticias: CollectionConfig = {
  slug: 'noticias',
  hooks: { afterChange: [revalidaColeccion(['/', '/noticias'], '/noticias')], afterDelete: [revalidaColeccionAlBorrar(['/', '/noticias'], '/noticias')] },
  labels: { singular: 'Noticia', plural: 'Noticias' },
  access: {
    read: anyone,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    // Borrar es permanente (no hay papelera): reservado a administradores (F9).
    delete: isAdmin,
  },
  // Borradores y versiones (F4, Auditoria_traspaso.md): el editor ve botones explícitos
  // "Guardar borrador" / "Publicar" (mucho más claros que una casilla), y cada guardado
  // deja una versión restaurable desde la pestaña "Versiones".
  versions: {
    drafts: { autosave: true },
    maxPerDoc: 20,
  },
  admin: {
    useAsTitle: 'titulo',
    defaultColumns: ['titulo', 'fecha', 'categoria', '_status'],
    group: 'Contenido',
    description: 'Publica noticias sobre seminarios, talleres, reuniones de gobernanza, acuerdos y avances del programa. Las noticias aparecen en la sección "Noticias" y en la página de inicio. Usa "Publicar" para que la noticia sea visible; "Guardar borrador" la deja solo aquí en el admin.',
  },
  fields: [
    {
      name: 'titulo',
      type: 'text',
      required: true,
      maxLength: 120,
      label: 'Título de la noticia',
      admin: { description: 'Título principal que verán los visitantes. Sé claro y descriptivo.' },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'URL amigable',
      admin: {
        position: 'sidebar',
        description: 'Identificador único para la URL. Usa solo letras minúsculas, números y guiones. Ej: "lanzamiento-programa-h2v"',
      },
    },
    {
      name: 'extracto',
      type: 'textarea',
      required: true,
      maxLength: 300,
      label: 'Resumen breve',
      admin: { description: 'Resumen de 1-2 oraciones que aparece en el listado de noticias. Máximo 300 caracteres.' },
    },
    {
      name: 'contenido',
      type: 'richText',
      required: true,
      label: 'Contenido completo',
      admin: { description: 'El texto completo de la noticia. Puedes agregar párrafos, negritas, listas, enlaces e imágenes.' },
    },
    {
      name: 'imagen',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Imagen de portada',
      admin: { description: 'Imagen principal de la noticia. Sube una imagen JPG o PNG (recomendado: 1200x630 px).' },
    },
    {
      name: 'fecha',
      type: 'date',
      required: true,
      label: 'Fecha de publicación',
      admin: { position: 'sidebar', description: 'Fecha que se mostrará en la noticia.' },
    },
    {
      name: 'categoria',
      type: 'select',
      label: 'Categoría',
      options: [
        { label: 'Seminario', value: 'seminario' },
        { label: 'Taller', value: 'taller' },
        { label: 'Gobernanza', value: 'gobernanza' },
        { label: 'Acuerdo', value: 'acuerdo' },
        { label: 'Proyecto', value: 'proyecto' },
        { label: 'General', value: 'general' },
      ],
      admin: { position: 'sidebar', description: 'Categoría para filtrar la noticia.' },
    },
  ],
};
