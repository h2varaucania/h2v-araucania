import type { CollectionConfig } from 'payload';

/**
 * Registro automático de reproducción de videos de la Mediateca.
 * Espeja el patrón de `Downloads` y cierra el 2º indicador de usabilidad del
 * Modelo de Sustentabilidad (pág. 5): "tiempo de reproducción de los videos"
 * y "# de visualizaciones", con verificador "dashboard con las visualizaciones".
 *
 * Semántica de eventos (los escribe `api/video-event`, no se crean a mano):
 *  - `play`     → una VISUALIZACIÓN (se cuenta 1 por sesión de reproducción).
 *  - `fin`      → cierre de la sesión con el total de segundos efectivamente vistos.
 * El # de visualizaciones = filas con evento `play`; el tiempo total de
 * reproducción = suma de `segundosVistos` de las filas `fin`.
 */
export const VideoViews: CollectionConfig = {
  slug: 'video-views',
  labels: { singular: 'Visualización', plural: 'Registro de Visualizaciones' },
  admin: {
    useAsTitle: 'videoTitulo',
    defaultColumns: ['videoTitulo', 'evento', 'segundosVistos', 'user', 'watchedAt'],
    group: 'Sistema',
    description:
      'Registro automático de reproducción de videos. Esta tabla se llena sola — no crees entradas a mano. Sirve para el indicador CORFO de visualizaciones: cada "play" es una visualización y cada "fin" trae los segundos vistos.',
  },
  access: {
    // Solo el servidor (api/video-event, vía Local API) escribe aquí.
    create: () => false,
    update: () => false,
    delete: ({ req }) => req.user?.role === 'admin',
    read: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    {
      name: 'videoTitulo',
      type: 'text',
      required: true,
      label: 'Video',
      admin: { readOnly: true, description: 'Título del video reproducido.' },
    },
    {
      name: 'videoKey',
      type: 'text',
      required: true,
      label: 'Identificador del video',
      admin: { readOnly: true, position: 'sidebar', description: 'Proveedor e ID del video (ej. youtube:abc123).' },
    },
    {
      name: 'evento',
      type: 'select',
      required: true,
      label: 'Evento',
      options: [
        { label: 'Visualización (play)', value: 'play' },
        { label: 'Fin de sesión', value: 'fin' },
      ],
      admin: { readOnly: true },
    },
    {
      name: 'segundosVistos',
      type: 'number',
      defaultValue: 0,
      label: 'Segundos vistos',
      admin: { readOnly: true, description: 'Segundos efectivamente reproducidos en la sesión (relevante en el evento "fin").' },
    },
    {
      name: 'sessionId',
      type: 'text',
      label: 'Sesión',
      admin: { readOnly: true, position: 'sidebar', description: 'Identificador de la sesión de reproducción (agrupa play y fin).' },
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      label: 'Usuario',
      admin: { readOnly: true, description: 'Usuario registrado que reprodujo el video (si estaba logueado).' },
    },
    {
      name: 'watchedAt',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      label: 'Fecha',
      admin: { readOnly: true },
    },
    {
      name: 'ip',
      type: 'text',
      label: 'Dirección IP',
      admin: { readOnly: true, position: 'sidebar' },
    },
    {
      name: 'userAgent',
      type: 'text',
      label: 'Navegador',
      admin: { readOnly: true, position: 'sidebar' },
    },
  ],
};
