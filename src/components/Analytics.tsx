'use client';

import Script from 'next/script';
import { useState, useEffect } from 'react';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const CONSENT_KEY = 'h2v-cookie-consent';

/**
 * Google Analytics 4 — solo se activa si:
 * 1. NEXT_PUBLIC_GA_ID está configurado
 * 2. El usuario aceptó cookies (localStorage)
 */
export default function Analytics() {
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    // Check initial consent
    if (localStorage.getItem(CONSENT_KEY) === 'accepted') {
      setConsented(true);
    }

    // Listen for consent granted from CookieBanner
    function onConsent() {
      setConsented(true);
    }
    window.addEventListener('cookie-consent-granted', onConsent);
    return () => window.removeEventListener('cookie-consent-granted', onConsent);
  }, []);

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
