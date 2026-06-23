import type { Access } from 'payload';

/**
 * Funciones de control de acceso reutilizables, basadas en el campo `role`
 * de la colección Users (admin | editor | registrado).
 */

/** Cualquiera puede leer (contenido público del sitio). */
export const anyone: Access = () => true;

/** Solo administradores. */
export const isAdmin: Access = ({ req }) => req.user?.role === 'admin';

/** Administradores y editores: gestionan contenido y entran al panel /admin. */
export const isAdminOrEditor: Access = ({ req }) =>
  req.user?.role === 'admin' || req.user?.role === 'editor';
