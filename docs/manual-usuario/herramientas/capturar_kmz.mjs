// Capturas de la sección "Dibujar la forma de un proyecto (KMZ)" del manual.
// Igual que capturar.mjs: admin LOCAL con el usuario e2e, viewport 1440x900 @2x,
// marcas por selector (bounding box) y MERGE sobre capturas/marcas.json.
// Requiere el servidor local en :3000 con NEXT_PUBLIC_FEAT_MAPA_PLUS=true.
import { chromium } from 'playwright';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const BASE = process.env.BASE || 'http://127.0.0.1:3000';
const AQUI = dirname(fileURLToPath(import.meta.url));
const OUT = join(AQUI, '..', 'capturas');
const MARCAS = join(OUT, 'marcas.json');
const ADMIN = { email: 'e2e-admin@test.local', password: 'E2eAdmin2026!' };
const FIXTURE = join(AQUI, '..', '..', '..', 'tests', 'fixtures', 'geo', 'google_earth_pro.kmz');

const marcas = existsSync(MARCAS) ? JSON.parse(readFileSync(MARCAS, 'utf8')) : {};
const fallas = [];
function log(...a) { console.log('[capturar_kmz]', ...a); }

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

// Datos demo vía REST (mismo camino que el e2e): capa KMZ + proyecto asociado.
const login = await ctx.request.post(`${BASE}/api/users/login`, { data: ADMIN });
if (!login.ok()) throw new Error(`login: ${login.status()}`);
const token = (await login.json()).token;
const auth = { Authorization: `JWT ${token}` };

// Idempotencia: borra demos previos con los mismos nombres (por si se corre dos veces).
for (const [col, campo, valor] of [
  ['proyectos', 'nombre', 'Planta piloto H2V Temuco'],
  ['capas-geo', 'titulo', 'Predio planta Temuco'],
]) {
  const prev = await ctx.request.get(`${BASE}/api/${col}?where[${campo}][equals]=${encodeURIComponent(valor)}&limit=10`, { headers: auth });
  for (const d of (await prev.json()).docs || []) {
    await ctx.request.delete(`${BASE}/api/${col}/${d.id}`, { headers: auth });
  }
}

const buf = readFileSync(FIXTURE);
const capaRes = await ctx.request.post(`${BASE}/api/capas-geo`, {
  headers: auth,
  multipart: {
    _payload: JSON.stringify({ titulo: 'Predio planta Temuco', tipo: 'proyecto' }),
    file: { name: 'predio-planta-temuco.kmz', mimeType: 'application/vnd.google-earth.kmz', buffer: buf },
  },
});
if (!capaRes.ok()) throw new Error(`capa: ${capaRes.status()} ${await capaRes.text()}`);
const capaId = (await capaRes.json()).doc.id;
log('capa demo id', capaId);

const proyRes = await ctx.request.post(`${BASE}/api/proyectos`, {
  headers: { ...auth, 'Content-Type': 'application/json' },
  data: {
    nombre: 'Planta piloto H2V Temuco', descripcion: 'Proyecto de demostración del manual.',
    empresa: 'Empresa demo', etapa: 'operacion', region: 'araucania',
    coordenadas: { lat: -38.74, lng: -72.59 }, capa: capaId,
  },
});
if (!proyRes.ok()) throw new Error(`proyecto: ${proyRes.status()} ${await proyRes.text()}`);
const proyId = (await proyRes.json()).doc.id;
log('proyecto demo id', proyId);

// El login por API ya dejó la cookie en el contexto: el navegador entra directo.
await page.goto(`${BASE}/admin`);
await page.waitForURL('**/admin**', { timeout: 20000 });

// 13b: la capa guardada, con el archivo y el resultado del procesamiento.
await page.goto(`${BASE}/admin/collections/capas-geo/${capaId}`);
await shot(page, '13b-capa-kmz', { full: true, settle: 1200, marks: [
  { n: 1, loc: '#field-titulo' },
  { n: 2, loc: '#field-tipo, .field-type.select:has(#field-tipo)' },
  { n: 3, loc: '.file-field, .file-details, [class*="file-field"]' },
  { n: 4, loc: '#field-resumenValidacion' },
  { n: 5, loc: '#action-save' },
] });

// 13c: el campo "Capa geográfica (KMZ)" dentro del proyecto (recorte al formulario).
await page.goto(`${BASE}/admin/collections/proyectos/${proyId}`);
// (solo una marca: el checkbox "Mostrar también el marcador" está en la barra lateral
// sticky y sus coordenadas no calzan en capturas de página completa)
await shot(page, '13c-proyecto-capa', { full: true, settle: 1200, marks: [
  { n: 1, loc: '#field-capa, .field-type.upload:has-text("Capa")' },
] });

// 46b: el mapa público con el polígono dibujado y las descargas KMZ (flag encendido).
await page.goto(`${BASE}/proyectos`);
await page.locator('path.leaflet-interactive').first().waitFor({ state: 'visible', timeout: 25000 });
await shot(page, '46b-web-proyectos-kmz', { settle: 1500, marks: [
  { n: 1, loc: 'a:has-text("Descargar todos")' },
  { n: 2, loc: '.leaflet-control-layers' },
] });

writeFileSync(MARCAS, JSON.stringify(marcas, null, 1));
log(fallas.length ? `FALLAS: ${fallas.join(' | ')}` : 'todas las capturas OK');
await browser.close();
process.exit(fallas.length ? 1 : 0);
