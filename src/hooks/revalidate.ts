import { revalidatePath } from 'next/cache';
import type { GlobalAfterChangeHook, CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload';

// Revalidación al guardar (EDITABILIDAD_TOTAL §5.1): "guardar = la web se
// actualiza sola". Hoy el frontend es force-dynamic (cada visita consulta la
// base), así que esto es un no-op funcional; dejarlo cableado habilita migrar
// página a página a estático sin tocar los globals de nuevo.
// El guard `context.disableRevalidate` evita cientos de revalidaciones en
// seeds/migraciones masivas (tras ellas, un redeploy regenera todo).

export const revalidaGlobal = (...paths: string[]): GlobalAfterChangeHook =>
  ({ doc, context }) => {
    if (!context?.disableRevalidate) paths.forEach((p) => revalidatePath(p));
    return doc;
  };

export const revalidaColeccion = (
  paths: string[],
  slugPrefix?: string,
): CollectionAfterChangeHook =>
  ({ doc, previousDoc, context }) => {
    // Guardar un BORRADOR no cambia lo público → no revalida. Imprescindible
    // además porque, con autosave, el borrador inicial de "Crear nuevo" se crea
    // DURANTE el render del server component del admin, donde revalidatePath es
    // ilegal (Next aborta y la vista queda en blanco — QA #12, 07-07-26). Solo
    // publicar, editar algo publicado o despublicar revalidan; en colecciones
    // sin versions no existe _status y se revalida siempre.
    const esBorrador = doc?._status && doc._status !== 'published';
    const veniaPublicado = previousDoc?._status === 'published';
    if (!context?.disableRevalidate && (!esBorrador || veniaPublicado)) {
      paths.forEach((p) => revalidatePath(p));
      if (slugPrefix && doc?.slug) revalidatePath(`${slugPrefix}/${doc.slug}`);
    }
    return doc;
  };

export const revalidaColeccionAlBorrar = (
  paths: string[],
  slugPrefix?: string,
): CollectionAfterDeleteHook =>
  ({ doc, context }) => {
    if (!context?.disableRevalidate) {
      paths.forEach((p) => revalidatePath(p));
      if (slugPrefix && doc?.slug) revalidatePath(`${slugPrefix}/${doc.slug}`);
    }
    return doc;
  };
