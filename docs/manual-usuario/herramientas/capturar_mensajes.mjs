// Captura las figuras 18 (lista de mensajes de contacto) y 19 (un mensaje abierto), de la
// sección "Leer los mensajes del formulario de Contacto" (sep-2026).
// Igual que capturar.mjs: admin LOCAL con el usuario e2e, viewport 1440x900 @2x,
// marcas por selector (bounding box) y MERGE sobre capturas/marcas.json.
// Requiere el servidor local (BASE, por defecto :3000) con algunos mensajes de ejemplo.
// Capturas SIN fullPage: la barra lateral del formulario es sticky y en fullPage las
// marcas quedarían corridas (ver README).
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
function log(...a) { console.log('[capturar_mensajes]', ...a); }

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
    await page.screenshot({ path: join(OUT, `${id}.png`) });
    marcas[id] = { full: false, clip: false, marks: m };
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

// 18 · Lista: dónde está en el menú (1) y un mensaje de la lista (2).
await page.goto(`${BASE}/admin/collections/mensajes-contacto`);
await page.waitForSelector('table tbody tr', { timeout: 30000 });
// Si el menú lateral quedó cerrado, se abre para que se vea dónde está la sección.
const itemMenu = page.locator('nav').getByText('Mensajes de contacto', { exact: true });
if (!(await itemMenu.isVisible().catch(() => false))) {
  await page.locator('.nav-toggler, button[class*="nav-toggler"]').first().click().catch(() => {});
  await page.waitForTimeout(800);
}
await shot(page, '18-mensajes-lista', { marks: [
  // En su propia página, Payload muestra el ítem del menú sin enlace: se ubica por texto.
  { n: 1, loc: page.locator('nav').getByText('Mensajes de contacto', { exact: true }) },
  { n: 2, loc: 'table tbody tr:first-child td.cell-nombre a' },
  { n: 3, loc: 'table thead th:has-text("Atendido")' } ] });

// 19 · Un mensaje abierto: correo (1), mensaje (2), Atendido (3), aviso por correo (4), Guardar (5).
await page.locator('table tbody tr:first-child td.cell-nombre a').first().click();
await page.waitForSelector('textarea[name="mensaje"]', { timeout: 30000 });
await shot(page, '19-mensaje-detalle', { marks: [
  { n: 1, loc: 'input[name="correo"]' },
  { n: 2, loc: 'textarea[name="mensaje"]' },
  { n: 3, loc: '#field-atendido' },
  { n: 4, loc: '#field-estadoCorreo' },
  { n: 5, loc: '#action-save' } ] });

await browser.close();
writeFileSync(MARCAS, JSON.stringify(marcas, null, 1));
if (fallas.length) { console.error('FALLAS:', fallas); process.exit(1); }
log('listo');
