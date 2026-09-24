import type { Access } from 'payload';
import { publicados } from '@/lib/published';

/**
 * Funciones de control de acceso reutilizables, basadas en el campo `role`
 * de la colección Users (admin | editor | registrado).
 */

/** Cualquiera puede leer (contenido público del sitio). */
export const anyone: Access = () => true;

/**
 * Colecciones con borradores: quien inició sesión lee todo; el público, solo lo publicado
 * (el mismo filtro `publicados` que usan las páginas). Antes, la API pública entregaba
 * también los borradores.
 */
export const publicadosOSesion: Access = ({ req }) => (req.user ? true : publicados);

/** Solo administradores. */
export const isAdmin: Access = ({ req }) => req.user?.role === 'admin';

/** Administradores y editores: gestionan contenido y entran al panel /admin. */
export const isAdminOrEditor: Access = ({ req }) =>
  req.user?.role === 'admin' || req.user?.role === 'editor';
