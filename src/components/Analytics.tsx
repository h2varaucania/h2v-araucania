'use client';

import Script from 'next/script';
import { useSyncExternalStore } from 'react';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const CONSENT_KEY = 'h2v-cookie-consent';

// El consentimiento vive fuera de React (localStorage + evento del CookieBanner):
// useSyncExternalStore es el patrón correcto para leerlo — sin estado ni efectos,
// SSR-safe (en servidor siempre "no consentido").
function subscribe(onChange: () => void) {
  window.addEventListener('cookie-consent-granted', onChange);
  return () => window.removeEventListener('cookie-consent-granted', onChange);
}
const getSnapshot = () => localStorage.getItem(CONSENT_KEY) === 'accepted';
const getServerSnapshot = () => false;

/**
 * Google Analytics 4 — solo se activa si:
 * 1. NEXT_PUBLIC_GA_ID está configurado
 * 2. El usuario aceptó cookies (localStorage)
 */
export default function Analytics() {
  const consented = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (!GA_ID || !consented) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', {
            page_path: window.location.pathname,
            anonymize_ip: true,
          });
        `}
      </Script>
    </>
  );
}
