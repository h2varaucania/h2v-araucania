import { test, expect } from '@playwright/test';

// §4.5 — las rutas de descarga entregan un KMZ/KML válido (funciona aun con 0 proyectos).
test('GET /api/geo/proyectos/kmz devuelve un KMZ (ZIP con doc.kml)', async ({ request }) => {
  const r = await request.get('/api/geo/proyectos/kmz');
  expect(r.status()).toBe(200);
  expect(r.headers()['content-type']).toContain('application/vnd.google-earth.kmz');
  const buf = await r.body();
  expect(buf[0]).toBe(0x50); // 'P'
  expect(buf[1]).toBe(0x4b); // 'K' → es un ZIP
  // doc.kml debe estar nombrado dentro del archivo
  expect(buf.toString('latin1')).toContain('doc.kml');
});

test('GET /api/geo/proyectos/kml devuelve un NetworkLink con intervalo explícito', async ({ request }) => {
  const r = await request.get('/api/geo/proyectos/kml');
  expect(r.status()).toBe(200);
  expect(r.headers()['content-type']).toContain('application/vnd.google-earth.kml+xml');
  const txt = await r.text();
  expect(txt).toContain('<NetworkLink>');
  expect(txt).toContain('<refreshInterval>3600</refreshInterval>');
  expect(txt).toMatch(/<href>https?:\/\//); // href absoluto
});
