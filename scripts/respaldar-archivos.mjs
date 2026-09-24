// Respaldo de los ARCHIVOS subidos al sitio (imágenes, PDF, capas KMZ), que el respaldo
// diario de la base de datos (.github/workflows/backup-db.yml) NO incluye: esos archivos
// viven en Vercel Blob. Usa solo la API pública del sitio: no necesita ninguna clave.
//
// Uso (Node 18 o superior), desde la carpeta donde se quiere guardar la copia:
//   node scripts/respaldar-archivos.mjs [https://dirección-del-sitio] [carpeta-destino]
// Por defecto: https://h2v-araucania.vercel.app y ./respaldo-archivos-AAAAMMDD
// Se puede repetir: los archivos que ya están con el mismo tamaño no se vuelven a bajar.
// Deja un indice.json con los datos de cada archivo (id, nombre, descripción, tipo).
// Restaurar: ver scripts/restore-db.md, sección "Archivos subidos".
import { mkdir, writeFile, stat } from 'node:fs/promises';
import { join } from 'node:path';

const BASE = (process.argv[2] || 'https://h2v-araucania.vercel.app').replace(/\/$/, '');
const hoy = new Date().toISOString().slice(0, 10).replace(/-/g, '');
const DESTINO = process.argv[3] || `respaldo-archivos-${hoy}`;
const COLECCIONES = ['media', 'capas-geo'];

async function listar(coleccion) {
  const docs = [];
  for (let pagina = 1; ; pagina++) {
    const r = await fetch(`${BASE}/api/${coleccion}?limit=100&page=${pagina}&depth=0`);
    if (!r.ok) throw new Error(`${coleccion}: HTTP ${r.status} al listar`);
    const d = await r.json();
    docs.push(...d.docs);
    if (!d.hasNextPage) return docs;
  }
}

async function yaEsta(ruta, bytes) {
  try {
    return (await stat(ruta)).size === bytes;
  } catch {
    return false;
  }
}

async function bajar(url, ruta, bytes) {
  if (bytes && (await yaEsta(ruta, bytes))) return 'igual';
  const r = await fetch(url.startsWith('http') ? url : `${BASE}${url}`);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  await writeFile(ruta, Buffer.from(await r.arrayBuffer()));
  return 'bajado';
}

const indice = { sitio: BASE, fecha: new Date().toISOString(), colecciones: {} };
let bajados = 0, iguales = 0;
const fallas = [];
// Tamaños derivados que el sitio no encuentra: desde que se activó addRandomSuffix
// (payload.config.ts), las imágenes nuevas quedan con estos tamaños inaccesibles. El sitio
// usa el original, así que es un aviso, no una falla del respaldo.
const avisos = [];

for (const coleccion of COLECCIONES) {
  const carpeta = join(DESTINO, coleccion);
  await mkdir(carpeta, { recursive: true });
  const docs = await listar(coleccion);
  indice.colecciones[coleccion] = docs.map((d) => ({
    id: d.id, filename: d.filename, alt: d.alt ?? d.titulo ?? null, mimeType: d.mimeType, filesize: d.filesize,
  }));
  for (const d of docs) {
    // El original y, en imágenes, sus tamaños derivados (miniatura, tarjeta, portada).
    const piezas = [{ url: d.url, filename: d.filename, filesize: d.filesize, original: true }];
    for (const s of Object.values(d.sizes || {})) if (s?.url && s.filename) piezas.push(s);
    for (const p of piezas) {
      if (!p.url || !p.filename) continue;
      try {
        if ((await bajar(p.url, join(carpeta, p.filename), p.filesize)) === 'igual') iguales++;
        else bajados++;
      } catch (e) {
        (p.original ? fallas : avisos).push(`${coleccion}/${p.filename}: ${e.message}`);
      }
    }
  }
  console.log(`${coleccion}: ${docs.length} registros`);
}

await writeFile(join(DESTINO, 'indice.json'), JSON.stringify(indice, null, 1));
console.log(`Listo en ${DESTINO}: ${bajados} archivos bajados, ${iguales} ya estaban.`);
if (avisos.length) {
  console.log(`Aviso: ${avisos.length} tamaños reducidos de imágenes no existen en el sitio (el sitio usa el original; no afecta el respaldo).`);
}
if (fallas.length) {
  console.error(`No se pudieron bajar ${fallas.length}:\n  ${fallas.join('\n  ')}`);
  process.exit(1);
}
