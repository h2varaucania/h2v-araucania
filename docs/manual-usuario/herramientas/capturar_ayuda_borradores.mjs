// Recaptura las figuras 06 (noticia) y 15 (evento), cuyo texto de ayuda cambió en sep-2026.
// Igual que capturar.mjs: admin LOCAL con el usuario e2e, viewport 1440x900 @2x,
// marcas por selector (bounding box) y MERGE sobre capturas/marcas.json.
// Requiere el servidor local en :3000.
import { chromium } from 'playwright';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const BASE = process.env.BASE || 'http://127.0.0.1:3000';
const AQUI = dirname(fileURLToPath(import.meta.url));
const OUT = join(AQUI, '..', 'capturas');
const MARCAS = join(OUT, 'marcas.json');
const ADMIN = { email: 'e2e-admin@test.local', password: 'E2eAdmin2026!' };

const marcas = existsSync(MARCAS) ? JSON.parse(readFileSync(MARCAS, 'utf8')) : {};
const fallas = [];
function log(...a) { console.log('[capturar_ayuda]', ...a); }

async function caja(page, locator) {
  const h = await locator.first().elementHandle({ timeout: 8000 }).catch(() => null);
  if (!h) return null;
  await h.scrollIntoViewIfNeeded().catch(() => {});
  return h.evaluate((el) => {
    const b = el.getBoundingClientRect();
    return { x: b.left + window.scrollX, y: b.top + window.scrollY, w: b.width, h: b.height };
  });
}

async function shot(page, id, opts = {}) {
  try {
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(opts.settle ?? 700);
    const m = [];
    for (const mk of opts.marks || []) {
      const loc = typeof mk.loc === 'string' ? page.locator(mk.loc) : mk.loc;
      const c = await caja(page, loc);
      if (c) m.push({ n: mk.n, ...c, etiqueta: mk.etiqueta || '' });
      else log(`  (marca ${mk.n} de ${id} no encontrada)`);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(150);
    const file = join(OUT, `${id}.png`);
    if (opts.clip) {
      const loc = typeof opts.clip === 'string' ? page.locator(opts.clip) : opts.clip;
      await loc.first().screenshot({ path: file });
      const base = await caja(page, loc);
      marcas[id] = { full: false, clip: true, marks: m.map((k) => ({ ...k, x: k.x - base.x, y: k.y - base.y })) };
    } else {
      await page.screenshot({ path: file, fullPage: !!opts.full });
      marcas[id] = { full: !!opts.full, clip: false, marks: m };
    }
    log(`✓ ${id}`);
  } catch (e) {
    fallas.push(`${id}: ${e.message.split('\n')[0]}`);
    log(`✗ ${id}: ${e.message.split('\n')[0]}`);
  }
}

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, locale: 'es-CL' });
const page = await ctx.newPage();

const login = await ctx.request.post(`${BASE}/api/users/login`, { data: ADMIN });
if (!login.ok()) throw new Error(`login: ${login.status()}`);
await page.goto(`${BASE}/admin`);
await page.waitForURL('**/admin**', { timeout: 20000 });

await page.goto(`${BASE}/admin/collections/noticias/create`);
await page.waitForSelector('input[name="titulo"]', { timeout: 30000 });
await shot(page, '06-noticia-crear', { full: true, marks: [
  { n: 1, loc: 'input[name="titulo"]' }, { n: 2, loc: 'textarea[name="extracto"]' },
  { n: 3, loc: '[data-lexical-editor="true"]' }, { n: 4, loc: '#field-imagen, .field-type.upload' },
  { n: 5, loc: 'input[name="slug"]' }, { n: 6, loc: '#field-fecha, .field-type.date' },
  { n: 7, loc: '#field-categoria, .field-type.select' },
  { n: 8, loc: 'button:has-text("Publicar cambios"), #action-save' } ] });

await page.goto(`${BASE}/admin/collections/eventos/create`);
await page.waitForSelector('input[name="titulo"]', { timeout: 30000 });
await shot(page, '15-evento-crear', { full: true, marks: [
  { n: 1, loc: 'input[name="titulo"]' }, { n: 2, loc: '[data-lexical-editor="true"]' },
  { n: 3, loc: '#field-fecha' }, { n: 4, loc: '#field-fechaFin' }, { n: 5, loc: 'input[name="lugar"]' },
  { n: 6, loc: 'button:has-text("Publicar cambios"), #action-save' } ] });

writeFileSync(MARCAS, JSON.stringify(marcas, null, 1));
log(fallas.length ? `FALLAS: ${fallas.join(' | ')}` : 'todas las capturas OK');
await browser.close();
process.exit(fallas.length ? 1 : 0);
