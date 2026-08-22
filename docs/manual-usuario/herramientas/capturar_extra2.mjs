// Tercera pasada: (a) contenido de muestra en la base LOCAL para las vistas de edición/versiones,
// (b) menú lateral abierto, (c) páginas públicas desde PRODUCCIÓN (contenido real).
import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const AQUI = dirname(fileURLToPath(import.meta.url));
const RAIZ = join(AQUI, '..', '..', '..');
const OUT = join(AQUI, '..', 'capturas');
const LOCAL = 'http://localhost:3000';
const PROD = process.env.MANUAL_PROD_URL || 'https://h2v-araucania.vercel.app';
const ADMIN = { email: 'e2e-admin@test.local', password: 'E2eAdmin2026!' };
const marcas = JSON.parse(readFileSync(join(OUT, 'marcas.json'), 'utf8'));
const log = (...a) => console.log('[extra2]', ...a);

async function caja(page, sel) {
  const h = await page.locator(sel).first().elementHandle({ timeout: 8000 }).catch(() => null);
  if (!h) return null;
  return h.evaluate((el) => { const b = el.getBoundingClientRect(); return { x: b.left + window.scrollX, y: b.top + window.scrollY, w: b.width, h: b.height }; });
}
async function shot(page, id, { full = false, clip = null, marks = [], settle = 700 } = {}) {
  await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(settle);
  const m = [];
  for (const mk of marks) { const c = await caja(page, mk.loc); if (c) m.push({ n: mk.n, ...c }); else log(`  (marca ${mk.n} de ${id} no encontrada)`); }
  const file = join(OUT, `${id}.png`);
  if (clip) {
    await page.locator(clip).first().screenshot({ path: file });
    const base = await caja(page, clip);
    marcas[id] = { full: false, clip: true, marks: m.map((k) => ({ ...k, x: k.x - base.x, y: k.y - base.y })) };
  } else {
    await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(150);
    await page.screenshot({ path: file, fullPage: full });
    marcas[id] = { full, clip: false, marks: m };
  }
  log(`✓ ${id}`);
}
const lexical = (parrafos) => ({ root: { type: 'root', format: '', indent: 0, version: 1, direction: 'ltr',
  children: parrafos.map((t) => ({ type: 'paragraph', format: '', indent: 0, version: 1, direction: 'ltr', textFormat: 0,
    children: [{ type: 'text', text: t, format: 0, detail: 0, mode: 'normal', style: '', version: 1 }] })) } });

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, locale: 'es-CL' });
const page = await ctx.newPage();
await page.goto(`${LOCAL}/admin/login`);
await page.fill('input[name="email"]', ADMIN.email); await page.fill('input[name="password"]', ADMIN.password);
await page.click('button[type="submit"]'); await page.waitForURL(/\/admin(?!\/login)/, { timeout: 30000 });

// ── (a) contenido de muestra local (idempotente por título) ──
const req = page.request;
async function existe(col, campo, valor) {
  const r = await req.get(`${LOCAL}/api/${col}?where[${campo}][equals]=${encodeURIComponent(valor)}&limit=1&depth=0&draft=true`);
  const j = await r.json(); return j.docs?.[0] || null;
}
async function subirMedia(ruta, alt, mime) {
  const ya = await existe('media', 'alt', alt); if (ya) return ya.id;
  const r = await req.post(`${LOCAL}/api/media`, { multipart: { file: { name: ruta.split('/').pop(), mimeType: mime, buffer: readFileSync(ruta) }, _payload: JSON.stringify({ alt }) } });
  const j = await r.json(); if (!j.doc) log('media error', JSON.stringify(j).slice(0, 200)); return j.doc?.id;
}
const imgId = await subirMedia(join(RAIZ, 'public/images/noticia-h2v.png'), 'Seminario regional de hidrógeno verde (foto de muestra)', 'image/png');
let noticia = await existe('noticias', 'slug', 'seminario-regional-h2v-temuco-2026');
if (!noticia && imgId) {
  const r = await req.post(`${LOCAL}/api/noticias?draft=false`, { data: {
    titulo: 'Seminario regional de hidrógeno verde reúne a más de 120 asistentes en Temuco',
    slug: 'seminario-regional-h2v-temuco-2026',
    extracto: 'El encuentro, organizado por el Bien Público H2V Araucanía, convocó a empresas, academia y servicios públicos para revisar los avances de la hoja de ruta regional.',
    contenido: lexical([
      'El seminario se realizó en Temuco y contó con la participación de representantes del Ministerio de Energía, CORFO, CODESSER, la Universidad de Talca y gremios productivos de la región.',
      'Durante la jornada se presentaron los resultados del estudio de demanda de hidrógeno verde y las oportunidades para los sectores agroforestal y productivo de La Araucanía.',
      'Las presentaciones estarán disponibles en la sección Documentos del sitio.' ]),
    imagen: imgId, fecha: '2026-08-12T12:00:00.000Z', categoria: 'seminario', _status: 'published' } });
  const j = await r.json(); noticia = j.doc; log('noticia creada', noticia?.id, r.status());
  if (!noticia) log('detalle:', JSON.stringify(j).slice(0, 300));
  // segunda versión (para la pestaña Versiones)
  if (noticia) await req.patch(`${LOCAL}/api/noticias/${noticia.id}?draft=false`, { data: { extracto: noticia.extracto + ' Revisa las presentaciones en Documentos.', _status: 'published' } });
}
const pdfs = ['public/docs'].flatMap(() => []); // (los PDFs oficiales son pesados; usamos uno pequeño si existe)
let docId = null;
try {
  const { readdirSync, statSync } = await import('node:fs');
  const cand = readdirSync(join(RAIZ, 'public/docs')).filter((f) => f.endsWith('.pdf')).map((f) => ({ f, s: statSync(join(RAIZ, 'public/docs', f)).size })).sort((a, b) => a.s - b.s)[0];
  if (cand) {
    const pdfId = await subirMedia(join(RAIZ, 'public/docs', cand.f), 'Producto final del Bien Público (PDF de muestra)', 'application/pdf');
    const ya = await existe('documentos', 'titulo', 'Estudio de demanda de hidrógeno verde en La Araucanía');
    if (!ya && pdfId) {
      const r = await req.post(`${LOCAL}/api/documentos`, { data: { titulo: 'Estudio de demanda de hidrógeno verde en La Araucanía', descripcion: 'Informe técnico con la estimación de demanda regional de H2V al 2045 por sector productivo, elaborado por el Bien Público 24BP-269085.', archivo: pdfId, thumbnail: imgId, tipo: 'tecnico', anio: 2026 } });
      const j = await r.json(); docId = j.doc?.id; log('documento creado', docId, r.status());
    }
  }
} catch (e) { log('documento de muestra omitido:', e.message); }
if (!(await existe('eventos', 'titulo', 'Taller de capacitación: H2V para el sector forestal'))) {
  const r = await req.post(`${LOCAL}/api/eventos?draft=false`, { data: { titulo: 'Taller de capacitación: H2V para el sector forestal', descripcion: lexical(['Taller práctico para empresas forestales sobre usos del hidrógeno verde en procesos productivos y logística.']), fecha: '2026-09-10T14:00:00.000Z', lugar: 'Campus Temuco, Universidad de Talca', tipo: 'taller', _status: 'published' } });
  log('evento creado', r.status());
}

// ── (b) vistas de edición con contenido real ──
await page.goto(`${LOCAL}/admin/collections/noticias`);
await shot(page, '05-noticias-lista', { marks: [ { n: 1, loc: 'a[href$="/collections/noticias/create"]' }, { n: 2, loc: '.search-filter input, input[type="search"], input[placeholder*="Buscar"]' }, { n: 3, loc: 'table tbody tr:first-child' }, { n: 4, loc: 'table thead th:has-text("Estado"), table thead th:last-child' } ] });
if (noticia) {
await page.goto(`${LOCAL}/admin/collections/noticias/${noticia.id}`);
await page.waitForSelector('input[name="titulo"]', { timeout: 30000 });
await shot(page, '10-noticia-editar', { full: true, marks: [
  { n: 1, loc: 'a:has-text("Versiones")' }, { n: 2, loc: '.doc-controls__status' },
  { n: 3, loc: 'button:has-text("Publicar cambios"), #action-save' }, { n: 4, loc: '.doc-controls__popup, .doc-controls .popup button, .doc-controls button[aria-label]' },
  { n: 5, loc: 'input[name="titulo"]' }, { n: 6, loc: '[data-lexical-editor="true"]' } ] });
await page.goto(`${LOCAL}/admin/collections/noticias/${noticia.id}/versions`);
await shot(page, '11-versiones', { marks: [ { n: 1, loc: 'table tbody tr:first-child' }, { n: 2, loc: 'a:has-text("Editar")' } ] });
const vlink = page.locator('table tbody tr:first-child a').first();
if (await vlink.count()) { await vlink.click(); await page.waitForTimeout(1500); await shot(page, '11b-version-restaurar', { marks: [ { n: 1, loc: 'button:has-text("Restaurar")' } ] }); }
} else log('sin noticia de muestra: se omiten 10/11');
// documentos: lista con un doc real
await page.goto(`${LOCAL}/admin/collections/documentos`);
await shot(page, '12b-documentos-lista', { marks: [ { n: 1, loc: 'a[href$="/collections/documentos/create"]' }, { n: 2, loc: 'table tbody tr:first-child' } ] });
// media con archivos
await page.goto(`${LOCAL}/admin/collections/media`);
await shot(page, '16-media-lista', { marks: [ { n: 1, loc: 'a[href$="/collections/media/create"]' }, { n: 2, loc: '.search-filter input, input[type="search"]' }, { n: 3, loc: '.collection-list__wrap, table, .grid' } ] });

// ── (c) menú lateral ──
await page.goto(`${LOCAL}/admin`);
await page.waitForTimeout(800);
const navInfo = await page.evaluate(() => Array.from(document.querySelectorAll('[class*="nav"]')).map((e) => e.tagName + '.' + e.className.toString().slice(0, 50) + ' w=' + Math.round(e.getBoundingClientRect().width)).slice(0, 12));
log('nav:', JSON.stringify(navInfo));
let navOk = await page.locator('aside.nav, nav.nav').first().isVisible().catch(() => false);
if (!navOk) { await page.locator('.nav-toggler, button.nav-toggler, .hamburger').first().click().catch(() => {}); await page.waitForTimeout(800); navOk = await page.locator('aside.nav, nav.nav').first().isVisible().catch(() => false); }
log('nav visible:', navOk);
if (navOk) {
  await shot(page, '04-menu-lateral', { clip: 'aside.nav, nav.nav', marks: [
    { n: 1, loc: 'aside.nav a[href$="/collections/noticias"], nav.nav a[href$="/collections/noticias"]' },
    { n: 2, loc: 'aside.nav a[href$="/globals/pagina-inicio"], nav.nav a[href$="/globals/pagina-inicio"]' },
    { n: 3, loc: 'aside.nav a[href$="/globals/contacto"], nav.nav a[href$="/globals/contacto"]' },
    { n: 4, loc: 'aside.nav a[href$="/collections/users"], nav.nav a[href$="/collections/users"]' },
    { n: 5, loc: 'aside.nav a[href$="/globals/guia-admin"], nav.nav a[href$="/globals/guia-admin"]' } ] });
  await shot(page, '03b-panel-menu-abierto', { marks: [ { n: 1, loc: '.nav-toggler, .hamburger' }, { n: 2, loc: 'aside.nav, nav.nav' }, { n: 3, loc: '.dashboard' }, { n: 4, loc: '.app-header__account, a[href$="/admin/account"]' } ] });
}

// ── (d) páginas públicas desde PRODUCCIÓN ──
const pub = await ctx.newPage();
const publicas = [
  ['40-web-inicio', '/'], ['41-web-quienes-somos', '/programa/quienes-somos'], ['42-web-gobernanza', '/programa/gobernanza'],
  ['43-web-noticias', '/noticias'], ['45-web-documentos', '/recursos/documentos'], ['46-web-proyectos', '/proyectos'],
  ['47-web-contacto', '/contacto'], ['48-web-eventos', '/recursos/eventos'], ['49-web-hidrogeno-verde', '/hidrogeno-verde'],
];
for (const [id, path] of publicas) {
  try {
    await pub.goto(`${PROD}${path}`, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await pub.locator('button:has-text("Rechazar")').first().click({ timeout: 3000 }).catch(() => {});
    await pub.waitForTimeout(500);
    await shot(pub, id, { full: true, settle: 2500 });
  } catch (e) { log(`✗ ${id}: ${e.message.split('\n')[0]}`); }
}
try {
  await pub.goto(`${PROD}/noticias`, { waitUntil: 'domcontentloaded', timeout: 45000 });
  const l = pub.locator('a[href^="/noticias/"]').first();
  if (await l.count()) { await l.click(); await pub.waitForLoadState('domcontentloaded'); await shot(pub, '44-web-noticia-detalle', { full: true, settle: 2500 }); }
} catch (e) { log('✗ 44:', e.message.split('\n')[0]); }

// limpieza de borradores vacíos (por si acaso)
for (const col of ['noticias', 'eventos']) {
  const r = await req.get(`${LOCAL}/api/${col}?where[_status][equals]=draft&limit=50&depth=0&draft=true`); const j = await r.json();
  for (const d of j.docs || []) if (!d.titulo || String(d.titulo).trim() === '') { await req.delete(`${LOCAL}/api/${col}/${d.id}`); log(`borrador vacío ${col}/${d.id} eliminado`); }
}
writeFileSync(join(OUT, 'marcas.json'), JSON.stringify(marcas, null, 2));
await browser.close();
log('listo');
