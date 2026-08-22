// Captura las pantallas del Manual de Usuario contra el sitio LOCAL (next standalone en :3000)
// con el admin e2e local. Genera capturas/<id>.png y capturas/marcas.json (cajas de los
// elementos a señalar, en px CSS) que luego anotar.py convierte en figuras numeradas.
// Uso (desde la raíz del repo, con el servidor local arriba):
//   node docs/manual-usuario/herramientas/capturar.mjs
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = dirname(fileURLToPath(import.meta.url));
const OUT = join(AQUI, '..', 'capturas');
mkdirSync(OUT, { recursive: true });
const BASE = process.env.MANUAL_BASE_URL || 'http://localhost:3000';
const ADMIN = { email: 'e2e-admin@test.local', password: 'E2eAdmin2026!' }; // solo existe en la base LOCAL

const marcas = {};
const fallas = [];

function log(...a) { console.log('[capturar]', ...a); }

async function caja(page, locator) {
  const h = await locator.first().elementHandle({ timeout: 8000 }).catch(() => null);
  if (!h) return null;
  await h.scrollIntoViewIfNeeded().catch(() => {});
  const r = await h.evaluate((el) => {
    const b = el.getBoundingClientRect();
    return { x: b.left + window.scrollX, y: b.top + window.scrollY, w: b.width, h: b.height };
  });
  return r;
}

// Toma una captura. opts: { full, clip (locator), marks: [{n, loc}], settle }
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
      // coordenadas relativas al recorte
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

// ───────────── A. ACCESO ─────────────
await page.goto(`${BASE}/admin/login`);
await shot(page, '01-login', { marks: [
  { n: 1, loc: 'input[name="email"]' }, { n: 2, loc: 'input[name="password"]' },
  { n: 3, loc: 'button[type="submit"]' }, { n: 4, loc: 'a[href*="forgot"]' } ] });

await page.goto(`${BASE}/admin/forgot`);
await shot(page, '02-olvide-clave', { marks: [ { n: 1, loc: 'input[name="email"]' }, { n: 2, loc: 'button[type="submit"]' } ] });

await page.goto(`${BASE}/admin/login`);
await page.fill('input[name="email"]', ADMIN.email);
await page.fill('input[name="password"]', ADMIN.password);
await page.click('button[type="submit"]');
await page.waitForURL(/\/admin(?!\/login)/, { timeout: 30000 });

// ───────────── B. PANEL ─────────────
await page.goto(`${BASE}/admin`);
await shot(page, '03-panel', { marks: [
  { n: 1, loc: 'nav.nav, .nav' }, { n: 2, loc: '.dashboard__group, .dashboard' },
  { n: 3, loc: '.app-header__account, a[href$="/admin/account"], .account' } ] });
await shot(page, '04-menu-lateral', { clip: 'nav.nav, .nav', marks: [
  { n: 1, loc: 'nav a[href$="/collections/noticias"]' }, { n: 2, loc: 'nav a[href$="/globals/pagina-inicio"]' },
  { n: 3, loc: 'nav a[href$="/globals/contacto"]' }, { n: 4, loc: 'nav a[href$="/collections/users"]' },
  { n: 5, loc: 'nav a[href$="/globals/guia-admin"]' } ] });

// ───────────── C. NOTICIAS ─────────────
await page.goto(`${BASE}/admin/collections/noticias`);
await shot(page, '05-noticias-lista', { marks: [
  { n: 1, loc: 'a[href$="/collections/noticias/create"], .list-header a.btn, .list-header button' },
  { n: 2, loc: '.search-filter input, input[placeholder*="Buscar"], input[type="search"]' },
  { n: 3, loc: 'table tbody tr:first-child' } ] });

await page.goto(`${BASE}/admin/collections/noticias/create`);
await page.waitForSelector('input[name="titulo"]', { timeout: 30000 });
await shot(page, '06-noticia-crear', { full: true, marks: [
  { n: 1, loc: 'input[name="titulo"]' }, { n: 2, loc: 'textarea[name="extracto"]' },
  { n: 3, loc: '[data-lexical-editor="true"]' }, { n: 4, loc: '#field-imagen, .field-type.upload' },
  { n: 5, loc: 'input[name="slug"]' }, { n: 6, loc: '#field-fecha, .field-type.date' },
  { n: 7, loc: '#field-categoria, .field-type.select' },
  { n: 8, loc: 'button:has-text("Publicar cambios"), #action-save' },
  { n: 9, loc: 'button:has-text("Guardar borrador"), #action-save-draft' } ] });

// editor: texto de ejemplo + barra flotante
const editor = page.locator('[data-lexical-editor="true"]').first();
await editor.click();
await page.keyboard.type('Texto de ejemplo para el manual: selecciona una palabra y aparece la barra de formato.');
await page.keyboard.press('Meta+A');
await page.waitForTimeout(600);
await shot(page, '07-editor-barra', { clip: '#field-contenido, .field-type.richText', settle: 300, marks: [
  { n: 1, loc: '.toolbar-popup, .inline-toolbar, [class*="toolbar"]' } ] });
await page.keyboard.press('End');
await page.keyboard.press('Enter');
await page.keyboard.type('/');
await page.waitForTimeout(700);
await shot(page, '08-editor-slash', { clip: '#field-contenido, .field-type.richText', settle: 300, marks: [
  { n: 1, loc: '.slash-menu-popup, [class*="slash-menu"], [role="listbox"]' } ] });
await page.keyboard.press('Escape');

// diálogo de subir imagen
const btnUpload = page.locator('#field-imagen button, .field-type.upload button').first();
await btnUpload.click().catch(() => {});
await page.waitForTimeout(900);
await shot(page, '09-subir-imagen', { settle: 400, marks: [ { n: 1, loc: '.drawer__content, dialog, .upload__dropzone, input[type="file"]' } ] });
await page.keyboard.press('Escape').catch(() => {});
await page.waitForTimeout(400);

// noticia existente: pestañas y botones
await page.goto(`${BASE}/admin/collections/noticias`);
const primera = page.locator('table tbody tr a').first();
const hayNoticias = await primera.count();
if (hayNoticias) {
  await primera.click();
  await page.waitForSelector('input[name="titulo"]', { timeout: 30000 });
  await shot(page, '10-noticia-editar', { marks: [
    { n: 1, loc: 'a:has-text("Versiones"), .doc-tab:has-text("Versiones")' },
    { n: 2, loc: '.status, .doc-controls__status, [class*="status"]' },
    { n: 3, loc: 'button:has-text("Publicar cambios"), #action-save' },
    { n: 4, loc: 'button:has-text("Guardar borrador"), #action-save-draft' },
    { n: 5, loc: '.doc-controls__popup, .popup-button, button[aria-label*="Más"], .doc-controls button:has(svg)' } ] });
  const url = page.url();
  await page.goto(url.replace(/\?.*$/, '') + '/versions');
  await shot(page, '11-versiones', { marks: [ { n: 1, loc: 'table tbody tr:first-child a, table tbody tr:first-child' } ] });
}

// ───────────── D. OTRAS COLECCIONES ─────────────
await page.goto(`${BASE}/admin/collections/documentos/create`);
await page.waitForSelector('input[name="titulo"]', { timeout: 30000 });
await shot(page, '12-documento-crear', { full: true, marks: [
  { n: 1, loc: 'input[name="titulo"]' }, { n: 2, loc: 'textarea[name="descripcion"]' },
  { n: 3, loc: '#field-archivo' }, { n: 4, loc: '#field-thumbnail' },
  { n: 5, loc: '#field-tipo' }, { n: 6, loc: '#field-anio' },
  { n: 7, loc: '#action-save, button:has-text("Guardar")' } ] });

await page.goto(`${BASE}/admin/collections/proyectos/create`);
await page.waitForSelector('input[name="nombre"]', { timeout: 30000 });
await shot(page, '13-proyecto-crear', { full: true, marks: [
  { n: 1, loc: 'input[name="nombre"]' }, { n: 2, loc: 'textarea[name="descripcion"]' },
  { n: 3, loc: 'input[name="empresa"]' }, { n: 4, loc: '#field-coordenadas' },
  { n: 5, loc: '#field-etapa' }, { n: 6, loc: '#field-region' },
  { n: 7, loc: '#field-imagen' }, { n: 8, loc: 'input[name="url"]' },
  { n: 9, loc: '#action-save, button:has-text("Guardar")' } ] });

await page.goto(`${BASE}/admin/collections/miembros/create`);
await page.waitForSelector('input[name="nombre"]', { timeout: 30000 });
await shot(page, '14-miembro-crear', { full: true, marks: [
  { n: 1, loc: 'input[name="nombre"]' }, { n: 2, loc: 'input[name="cargo"]' },
  { n: 3, loc: 'input[name="institucion"]' }, { n: 4, loc: '#field-instancia' },
  { n: 5, loc: '#field-foto' }, { n: 6, loc: 'textarea[name="aporte"]' },
  { n: 7, loc: 'input[name="suplente"]' }, { n: 8, loc: '#field-orden' },
  { n: 9, loc: '#action-save, button:has-text("Guardar")' } ] });

await page.goto(`${BASE}/admin/collections/eventos/create`);
await page.waitForSelector('input[name="titulo"]', { timeout: 30000 });
await shot(page, '15-evento-crear', { full: true, marks: [
  { n: 1, loc: 'input[name="titulo"]' }, { n: 2, loc: '[data-lexical-editor="true"]' },
  { n: 3, loc: '#field-fecha' }, { n: 4, loc: '#field-fechaFin' }, { n: 5, loc: 'input[name="lugar"]' },
  { n: 6, loc: 'button:has-text("Publicar cambios"), #action-save' } ] });

await page.goto(`${BASE}/admin/collections/media`);
await shot(page, '16-media-lista', { marks: [ { n: 1, loc: 'a[href$="/collections/media/create"], .list-header a.btn' }, { n: 2, loc: '.search-filter input, input[type="search"]' } ] });
await page.goto(`${BASE}/admin/collections/media/create`);
await shot(page, '17-media-subir', { marks: [ { n: 1, loc: '.dropzone, .file-field__upload, input[type="file"]' }, { n: 2, loc: 'input[name="alt"]' }, { n: 3, loc: '#action-save, button:has-text("Guardar")' } ] });

// ───────────── E. PÁGINAS (GLOBALS) ─────────────
const globals = [
  ['20-pagina-inicio', 'pagina-inicio'], ['21-quienes-somos', 'pagina-quienes-somos'],
  ['22-gobernanza', 'pagina-gobernanza'], ['24-sitio-general', 'sitio-general'],
  ['25-hoja-ruta', 'pagina-hoja-ruta'], ['26-hidrogeno-verde', 'pagina-h2v'],
  ['27-guia-admin', 'guia-admin'], ['28-mapa-proyectos', 'pagina-proyectos'],
];
for (const [id, slug] of globals) {
  await page.goto(`${BASE}/admin/globals/${slug}`);
  await page.waitForSelector('form', { timeout: 30000 });
  await shot(page, id, { full: true, marks: [
    { n: 1, loc: '.array-field__add-row, button:has-text("Añadir"), button:has-text("Agregar")' },
    { n: 2, loc: '#action-save, button:has-text("Guardar")' } ] });
}
// Contacto: pestañas
await page.goto(`${BASE}/admin/globals/contacto`);
await page.waitForSelector('form', { timeout: 30000 });
await shot(page, '23-contacto-pagina', { marks: [ { n: 1, loc: '.tabs-field__tabs, [class*="tabs-field__tab"]' }, { n: 2, loc: '#action-save, button:has-text("Guardar")' } ] });
await page.locator('button:has-text("Datos institucionales")').first().click().catch(() => {});
await page.waitForTimeout(600);
await shot(page, '23b-contacto-datos', { full: true, marks: [ { n: 1, loc: 'input[name="email"]' }, { n: 2, loc: 'input[name="ubicacion"]' } ] });

// ───────────── F. USUARIOS Y CUENTA ─────────────
await page.goto(`${BASE}/admin/collections/users`);
await shot(page, '30-usuarios-lista', { marks: [ { n: 1, loc: 'a[href$="/collections/users/create"], .list-header a.btn' }, { n: 2, loc: 'table tbody tr:first-child' } ] });
await page.goto(`${BASE}/admin/collections/users/create`);
await page.waitForSelector('input[name="email"]', { timeout: 30000 });
await shot(page, '31-usuario-crear', { full: true, marks: [
  { n: 1, loc: 'input[name="email"]' }, { n: 2, loc: 'input[name="password"]' },
  { n: 3, loc: 'input[name="confirm-password"], input[name="confirmPassword"]' },
  { n: 4, loc: 'input[name="nombre"]' }, { n: 5, loc: '#field-role' },
  { n: 6, loc: '#action-save, button:has-text("Guardar")' } ] });
await page.goto(`${BASE}/admin/account`);
await shot(page, '32-mi-cuenta', { full: true, marks: [
  { n: 1, loc: 'button:has-text("Cambiar contraseña"), button:has-text("contraseña")' },
  { n: 2, loc: 'a[href$="/admin/logout"], button:has-text("Cerrar sesión")' } ] });
await page.goto(`${BASE}/admin/logout`);
await shot(page, '33-salir', {});

// ───────────── G. SITIO PÚBLICO (para "así se ve") ─────────────
const publicas = [
  ['40-web-inicio', '/'], ['41-web-quienes-somos', '/programa/quienes-somos'], ['42-web-gobernanza', '/programa/gobernanza'],
  ['43-web-noticias', '/noticias'], ['45-web-documentos', '/recursos/documentos'], ['46-web-proyectos', '/proyectos'],
  ['47-web-contacto', '/contacto'], ['48-web-eventos', '/recursos/eventos'],
];
for (const [id, path] of publicas) {
  await page.goto(`${BASE}${path}`);
  // cerrar banner de cookies si aparece
  await page.locator('button:has-text("Rechazar")').first().click({ timeout: 2000 }).catch(() => {});
  await shot(page, id, { full: true, settle: 1500 });
}
// detalle de una noticia
await page.goto(`${BASE}/noticias`);
const linkNoticia = page.locator('a[href^="/noticias/"]').first();
if (await linkNoticia.count()) {
  await linkNoticia.click();
  await page.waitForLoadState('networkidle').catch(() => {});
  await shot(page, '44-web-noticia-detalle', { full: true, settle: 1200 });
}

writeFileSync(join(OUT, 'marcas.json'), JSON.stringify(marcas, null, 2));
await browser.close();
log(`listo. ${Object.keys(marcas).length} capturas; ${fallas.length} fallas`);
if (fallas.length) { console.log('FALLAS:\n - ' + fallas.join('\n - ')); }
