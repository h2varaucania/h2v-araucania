/**
 * Identifica el proveedor y el id de un enlace de video (YouTube / Vimeo).
 * Se usa en dos lados: la página Mediateca decide si un recurso es un video
 * incrustable, y <VideoPlayer> lo incrusta y rastrea. El `key` (proveedor:id)
 * es el identificador estable con el que se agrupan las visualizaciones.
 */
export type VideoProvider = 'youtube' | 'vimeo';

export interface ParsedVideo {
  provider: VideoProvider;
  id: string;
  key: string; // `${provider}:${id}`
}

export function parseVideo(url: string | undefined | null): ParsedVideo | null {
  if (!url || typeof url !== 'string') return null;
  const u = url.trim();

  // YouTube: youtu.be/ID, watch?v=ID, embed/ID, shorts/ID
  const yt =
    u.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/i);
  if (yt?.[1]) {
    return { provider: 'youtube', id: yt[1], key: `youtube:${yt[1]}` };
  }

  // Vimeo: vimeo.com/123456789, player.vimeo.com/video/123456789
  const vm = u.match(/vimeo\.com\/(?:video\/)?(\d{6,})/i);
  if (vm?.[1]) {
    return { provider: 'vimeo', id: vm[1], key: `vimeo:${vm[1]}` };
  }

  return null;
}
