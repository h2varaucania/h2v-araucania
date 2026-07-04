'use client';

import { useEffect, useRef } from 'react';
import type { ParsedVideo } from '@/lib/videoEmbed';

interface Props {
  video: ParsedVideo;
  titulo: string;
}

/**
 * Reproductor con rastreo propio de uso (indicador CORFO del Modelo de
 * Sustentabilidad). Incrusta YouTube (IFrame API) o Vimeo (SDK), y registra:
 *  - una VISUALIZACIÓN al primer play (evento `play`),
 *  - los segundos efectivamente vistos al cerrar la sesión (evento `fin`, vía sendBeacon).
 * Envía a /api/video-event, que lo guarda en la colección `video-views`.
 */

// La YouTube IFrame API es un singleton global; se carga una sola vez.
let ytApiPromise: Promise<unknown> | null = null;
function loadYouTubeAPI(): Promise<unknown> {
  if (typeof window === 'undefined') return Promise.reject(new Error('no window'));
  const w = window as unknown as { YT?: { Player?: unknown }; onYouTubeIframeAPIReady?: () => void };
  if (w.YT?.Player) return Promise.resolve(w.YT);
  if (ytApiPromise) return ytApiPromise;
  ytApiPromise = new Promise((resolve) => {
    const prev = w.onYouTubeIframeAPIReady;
    w.onYouTubeIframeAPIReady = () => {
      if (typeof prev === 'function') prev();
      resolve(w.YT);
    };
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);
  });
  return ytApiPromise;
}

function genSessionId(): string {
  try {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  } catch {
    /* fallback */
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default function VideoPlayer({ video, titulo }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let destroyed = false;
    const sessionId = genSessionId();
    let watched = 0; // segundos efectivamente vistos
    let lastTime = 0; // último currentTime observado (para calcular deltas)
    let playSent = false;
    let finSent = false;
    let ytPoll: ReturnType<typeof setInterval> | null = null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let ytPlayer: any = null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let vimeoPlayer: any = null;

    const post = (evento: 'play' | 'fin', useBeacon = false) => {
      const body = JSON.stringify({
        videoKey: video.key,
        videoTitulo: titulo,
        evento,
        segundos: Math.round(watched),
        sessionId,
      });
      try {
        if (useBeacon && typeof navigator !== 'undefined' && navigator.sendBeacon) {
          navigator.sendBeacon('/api/video-event', new Blob([body], { type: 'application/json' }));
        } else {
          fetch('/api/video-event', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body,
            keepalive: true,
          }).catch(() => {});
        }
      } catch {
        /* el rastreo nunca debe romper la reproducción */
      }
    };

    const markPlay = () => {
      if (playSent) return;
      playSent = true;
      post('play');
    };
    const sendFin = (useBeacon = false) => {
      if (finSent || !playSent) return; // sin play no hay fin
      finSent = true;
      post('fin', useBeacon);
    };
    // Acumula tiempo visto protegiendo contra saltos (seek/adelantos).
    const accumulate = (current: number) => {
      const delta = current - lastTime;
      if (delta > 0 && delta < 3) watched += delta;
      lastTime = current;
    };

    const onVisibility = () => {
      if (document.visibilityState === 'hidden') sendFin(true);
    };
    const onPageHide = () => sendFin(true);

    if (video.provider === 'youtube') {
      const mount = document.createElement('div');
      containerRef.current?.appendChild(mount);
      loadYouTubeAPI()
        .then((YT) => {
          if (destroyed || !YT) return;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const YTApi = YT as any;
          ytPlayer = new YTApi.Player(mount, {
            width: '100%',
            height: '100%',
            videoId: video.id,
            host: 'https://www.youtube-nocookie.com',
            playerVars: { rel: 0, modestbranding: 1 },
            events: {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onStateChange: (e: any) => {
                if (e.data === 1) {
                  // PLAYING
                  markPlay();
                  try {
                    lastTime = ytPlayer.getCurrentTime?.() ?? lastTime;
                  } catch {
                    /* noop */
                  }
                  if (!ytPoll) {
                    ytPoll = setInterval(() => {
                      try {
                        accumulate(ytPlayer.getCurrentTime?.() ?? lastTime);
                      } catch {
                        /* noop */
                      }
                    }, 1000);
                  }
                } else {
                  if (ytPoll) {
                    clearInterval(ytPoll);
                    ytPoll = null;
                  }
                  if (e.data === 0) sendFin(); // ENDED
                }
              },
            },
          });
        })
        .catch(() => {});
    } else {
      import('@vimeo/player')
        .then(({ default: Player }) => {
          if (destroyed) return;
          const el = document.createElement('div');
          containerRef.current?.appendChild(el);
          vimeoPlayer = new Player(el, { id: Number(video.id), dnt: true });
          vimeoPlayer.on('play', () => markPlay());
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          vimeoPlayer.on('timeupdate', (d: any) => {
            if (typeof d?.seconds === 'number') accumulate(d.seconds);
          });
          vimeoPlayer.on('ended', () => sendFin());
        })
        .catch(() => {});
    }

    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pagehide', onPageHide);

    return () => {
      destroyed = true;
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pagehide', onPageHide);
      if (ytPoll) clearInterval(ytPoll);
      sendFin(false); // al desmontar, cerrar la sesión si hubo reproducción
      try {
        ytPlayer?.destroy?.();
      } catch {
        /* noop */
      }
      try {
        vimeoPlayer?.destroy?.();
      } catch {
        /* noop */
      }
    };
  }, [video.key, video.id, video.provider, titulo]);

  return (
    <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
      <div
        ref={containerRef}
        className="h-full w-full [&>div]:h-full [&>div]:w-full [&_iframe]:h-full [&_iframe]:w-full"
      />
    </div>
  );
}
