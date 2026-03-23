/**
 * Feature flags para control modular de la plataforma.
 *
 * MINIMALISTA (Parte I): Solo flags "always on" = true
 * MAXIMALISTA (Apéndice A): Activar via variables de entorno NEXT_PUBLIC_FEAT_*
 *
 * Deploy minimalista: .env con todos FEAT_* en false
 * Deploy maximalista: .env con todos FEAT_* en true
 */

const isEnabled = (key: string): boolean =>
  process.env[`NEXT_PUBLIC_FEAT_${key}`] === 'true';

export const features = {
  // ===== Parte I — Siempre activos =====
  noticias: true,
  mapaProyectos: true,
  recursos: true,
  gobernanza: true,
  quienesSomos: true,
  contacto: true,
  auth: true,
  buscador: true,

  // ===== Apéndice A — Toggleables =====
  hidrogenoVerde: isEnabled('H2V'),
  sectores: isEnabled('SECTORES'),
  capitalHumano: isEnabled('CAPITAL_HUMANO'),
  hojaDeRuta: isEnabled('HOJA_RUTA'),
  marcoRegulatorio: isEnabled('REGULATORIO'),
  eventos: isEnabled('EVENTOS'),
  comunidad: isEnabled('COMUNIDAD'),
  transparencia: isEnabled('TRANSPARENCIA'),
  mediateca: isEnabled('MEDIATECA'),
  i18n: isEnabled('I18N'),
  mapaAvanzado: isEnabled('MAPA_PLUS'),
  dashboard: isEnabled('DASHBOARD'),
  asistenteIA: isEnabled('AI'),
  encuestas: isEnabled('ENCUESTAS'),
  pwa: isEnabled('PWA'),
  apiAbierta: isEnabled('API'),
} as const;

export type FeatureKey = keyof typeof features;
