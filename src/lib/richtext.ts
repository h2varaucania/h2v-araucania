// Utilidad para saber si un campo richText (Lexical) tiene contenido real.
// Un editor "vacío" guarda igualmente un nodo root con un párrafo sin hijos,
// así que comprobar solo la existencia del campo no basta.
export function tieneContenido(rich: unknown): boolean {
  const root = (rich as { root?: { children?: Array<{ children?: unknown[] }> } } | null)?.root;
  if (!root?.children?.length) return false;
  return root.children.some((n) => Array.isArray(n?.children) && n.children.length > 0);
}
