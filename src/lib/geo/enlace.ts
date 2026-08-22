// Helpers de URLs para el pipeline geográfico (docs/PLAN_MAPA_KMZ.md §4.5).
// Compartidos entre el generador de KML y el mapa público, para no duplicar la
// lógica (el bug de enlaces relativos que rompen el balloon en Google Earth).

// Misma convención y mismo fallback que src/app/robots.ts, sitemap.ts y layout.tsx.
const SITIO = process.env.NEXT_PUBLIC_SITE_URL || 'https://h2varaucania.cl';

/**
 * Convierte una ruta relativa en URL absoluta contra el dominio del sitio.
 * En un KMZ, toda URL relativa se resuelve contra doc.kml (dentro del archivo),
 * no contra el sitio: por eso los enlaces del balloon DEBEN ser absolutos.
 */
export function urlAbsoluta(ruta: string, sitio: string = SITIO): string {
  try {
    return new URL(ruta, sitio).toString();
  } catch {
    return sitio;
  }
}

/**
 * Devuelve la URL solo si es un enlace web http(s) real; si no, null.
 * El campo `url` de un proyecto es texto libre: evita meter `javascript:` u otras
 * cosas en un href tanto en el mapa como en el KMZ distribuido a terceros.
 */
export function enlaceSeguro(url?: string | null): string | null {
  if (!url) return null;
  const limpio = url.trim();
  return /^https?:\/\/[^\s]+$/i.test(limpio) ? limpio : null;
}
