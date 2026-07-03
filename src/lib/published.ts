import type { Where } from 'payload';

// Filtro de "contenido publicado" para colecciones con borradores (versions.drafts).
// Un documento publicado tiene _status = 'published'. Se incluye también a los documentos
// creados ANTES de activar los borradores (no tienen _status): eran públicos y deben seguir
// siéndolo. Al re-guardarlos desde el admin quedan versionados y la segunda condición
// se vuelve inocua.
export const publicados: Where = {
  or: [
    { _status: { equals: 'published' } },
    { _status: { exists: false } },
  ],
};
