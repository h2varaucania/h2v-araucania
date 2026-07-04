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
  ({ doc, context }) => {
    if (!context?.disableRevalidate) {
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
