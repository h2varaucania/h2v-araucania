'use client';

import { useSyncExternalStore } from 'react';
import Link from 'next/link';

const CONSENT_KEY = 'h2v-cookie-consent';

// El consentimiento vive fuera de React (localStorage): useSyncExternalStore es el
// patrón correcto para leerlo — sin useState/useEffect. En SSR el banner no se
// muestra (snapshot de servidor "pendiente"); al hidratar se lee el valor real.
// Analytics lee localStorage por su cuenta, así que aquí solo persistimos y
// notificamos los cambios.
function subscribe(onChange: () => void) {
  window.addEventListener('cookie-consent-changed', onChange);
  return () => window.removeEventListener('cookie-consent-changed', onChange);
}
const getSnapshot = () => localStorage.getItem(CONSENT_KEY);
const getServerSnapshot = () => 'ssr-pending';

function persist(value: 'accepted' | 'declined') {
  localStorage.setItem(CONSENT_KEY, value);
  window.dispatchEvent(new Event('cookie-consent-changed'));
  if (value === 'accepted') {
    // Señal que Analytics escucha para activarse al instante (sin recargar).
    window.dispatchEvent(new Event('cookie-consent-granted'));
  }
}

export default function CookieBanner() {
  const consent = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Visible solo cuando el usuario aún no ha decidido (null en localStorage).
  if (consent !== null) return null;

  return (
    <div
      role="dialog"
      aria-label="Consentimiento de cookies"
      className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
    >
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-2xl border border-gray-200 p-4 md:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1 text-sm text-gray-600">
          <p>
            Este sitio utiliza cookies técnicas necesarias y, con tu consentimiento, cookies de análisis (Google Analytics) para mejorar la experiencia.{' '}
            <Link href="/politica-privacidad" className="text-h2v-green underline">
              Política de Privacidad
            </Link>
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => persist('declined')}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Rechazar
          </button>
          <button
            onClick={() => persist('accepted')}
            className="px-4 py-2 text-sm text-white bg-h2v-green rounded-lg hover:bg-h2v-green/90 transition-colors font-medium"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
