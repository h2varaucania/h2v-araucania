// Capturas complementarias (selectores afinados tras la primera pasada) + limpieza de
// borradores vacíos que el autosave crea al visitar "Crear nuevo". Mismo uso que capturar.mjs.
import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const AQUI = dirname(fileURLToPath(import.meta.url));
const OUT = join(AQUI, '..', 'capturas');
const BASE = process.env.MANUAL_BASE_URL || 'http://localhost:3000';
const ADMIN = { email: 'e2e-admin@test.local', password: 'E2eAdmin2026!' };
const marcas = JSON.parse(readFileSync(join(OUT, 'marcas.json'), 'utf8'));
const log = (...a) => console.log('[extra]', ...a);

async function caja(page, sel) {
  const h = await page.locator(sel).first().elementHandle({ timeout: 8000 }).catch(() => null);
  if (!h) return null;
  return h.evaluate((el) => { const b = el.getBoundingClientRect(); return { x: b.left + window.scrollX, y: b.top + window.scrollY, w: b.width, h: b.height }; });
}
async function shot(page, id, { full = false, clip = null, marks = [] } = {}) {
  await page.waitForTimeout(600);
  const m = [];
  for (const mk of marks) { const c = await caja(page, mk.loc); if (c) m.push({ n: mk.n, ...c }); else log(`  (marca ${mk.n} de ${id} no encontrada)`); }
  const file = join(OUT, `${id}.png`);
  if (clip) {
    await page.locator(clip).first().screenshot({ path: file });
    const base = await caja(page, clip);
    marcas[id] = { full: false, clip: true, marks: m.map((k) => ({ ...k, x: k.x - base.x, y: k.y - base.y })) };
  } else {
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: file, fullPage: full });
    marcas[id] = { full, clip: false, marks: m };
  }
  log(`✓ ${id}`);
}

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, locale: 'es-CL' });
const page = await ctx.newPage();
await page.goto(`${BASE}/admin/login`);
await page.fill('input[name="email"]', ADMIN.email); await page.fill('input[name="password"]', ADMIN.password);
await page.click('button[type="submit"]'); await page.waitForURL(/\/admin(?!\/login)/, { timeout: 30000 });

// 04b: panel con el menú lateral ABIERTO (el hamburger arriba a la izquierda)
await page.goto(`${BASE}/admin`);
await page.waitForTimeout(800);
const navVisible = await page.locator('nav.nav').first().isVisible().catch(() => false);
if (!navVisible) { await page.locator('.nav-toggler, button[aria-label*="men"], .hamburger, header button').first().click().catch(() => {}); await page.waitForTimeout(700); }
await shot(page, '03b-panel-menu-abierto', { marks: [
  { n: 1, loc: '.nav-toggler, .hamburger, header button' }, { n: 2, loc: 'nav.nav' }, { n: 3, loc: '.dashboard' },
  { n: 4, loc: '.app-header__account, a[href$="/admin/account"]' } ] });

// 07/08: editor de texto (barra flotante y menú "/")
await page.goto(`${BASE}/admin/collections/noticias/create`);
await page.waitForSelector('input[name="titulo"]', { timeout: 30000 });
const ed = page.locator('[data-lexical-editor="true"]').first();
await ed.click();
await page.keyboard.type('Texto de ejemplo: al seleccionar palabras aparece la barra de formato (negrita, cursiva, enlaces, títulos).');
await page.keyboard.press('Meta+A'); await page.waitForTimeout(800);
await shot(page, '07-editor-barra', { clip: '.rich-text-lexical.field-type', marks: [ { n: 1, loc: '.inline-toolbar-popup' }, { n: 2, loc: '.toolbar-popup__dropdown-text' } ] });
await page.keyboard.press('End'); await page.keyboard.press('Enter'); await page.keyboard.type('/'); await page.waitForTimeout(800);
await shot(page, '08-editor-slash', { clip: '.rich-text-lexical.field-type', marks: [ { n: 1, loc: '.slash-menu-popup' } ] });
await page.keyboard.press('Escape');

// 10/11: una noticia PUBLICADA real (no el borrador recién creado)
const pub = await page.request.get(`${BASE}/api/noticias?where[_status][equals]=published&limit=1&depth=0`);
const pubJson = await pub.json();
const idPub = pubJson?.docs?.[0]?.id;
if (idPub) {
  await page.goto(`${BASE}/admin/collections/noticias/${idPub}`);
  await page.waitForSelector('input[name="titulo"]', { timeout: 30000 });
  await shot(page, '10-noticia-editar', { marks: [
    { n: 1, loc: 'a:has-text("Versiones")' }, { n: 2, loc: '.doc-controls__status' },
    { n: 3, loc: 'button:has-text("Publicar cambios"), #action-save' }, { n: 4, loc: '.doc-controls__popup, .doc-controls .popup button' },
    { n: 5, loc: 'input[name="titulo"]' } ] });
  await page.goto(`${BASE}/admin/collections/noticias/${idPub}/versions`);
  await page.waitForTimeout(800);
  await shot(page, '11-versiones', { marks: [ { n: 1, loc: 'table tbody tr:first-child' }, { n: 2, loc: 'a:has-text("Editar")' } ] });
  // 11b: una versión abierta (botón Restaurar)
  const primeraVersion = page.locator('table tbody tr:first-child a').first();
  if (await primeraVersion.count()) {
    await primeraVersion.click(); await page.waitForTimeout(1200);
    await shot(page, '11b-version-restaurar', { marks: [ { n: 1, loc: 'button:has-text("Restaurar")' } ] });
  }
} else log('sin noticia publicada en la base local');

// limpieza: borradores vacíos creados por el autosave en noticias/eventos
for (const col of ['noticias', 'eventos']) {
  const r = await page.request.get(`${BASE}/api/${col}?where[_status][equals]=draft&limit=50&depth=0&draft=true`);
  const j = await r.json();
  for (const d of j.docs || []) {
    if (!d.titulo || String(d.titulo).trim() === '') {
      const del = await page.request.delete(`${BASE}/api/${col}/${d.id}`);
      log(`borrador vacío ${col}/${d.id} eliminado (${del.status()})`);
    }
  }
}
writeFileSync(join(OUT, 'marcas.json'), JSON.stringify(marcas, null, 2));
await browser.close();
log('listo');
