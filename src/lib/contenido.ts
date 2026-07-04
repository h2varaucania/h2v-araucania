// Helpers de contenido (EDITABILIDAD_TOTAL §3.3): el componente NUNCA lleva
// literales; todo texto visible sale del CMS con fallback a los defaults
// centralizados de src/content/defaults/*.
export const t = (v: string | null | undefined, fb: string): string =>
  v && v.trim() ? v : fb;

export const list = <T,>(v: T[] | null | undefined, fb: T[]): T[] =>
  v && v.length ? v : fb;
