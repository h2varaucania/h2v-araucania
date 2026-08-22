import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { E2E_ADMIN } from './global-setup.mts';

// §Criterio 2 — al subir una capa KMZ y asociarla a un proyecto, la geometría se
// dibuja en /proyectos (path.leaflet-interactive aparece con polígonos/líneas).
test('una capa KMZ subida se dibuja en el mapa público', async ({ request, page }) => {
  const login = await request.post('/api/users/login', { data: E2E_ADMIN });
  expect(login.ok()).toBeTruthy();
  const token = (await login.json()).token as string;
  const auth = { Authorization: `JWT ${token}` };

  // El dibujo de capas va detrás del flag mapaAvanzado (NEXT_PUBLIC_FEAT_MAPA_PLUS),
  // resuelto en el servidor. Si está apagado (default), no hay funciones KMZ y se omite
  // el test. El mapa es ssr:false, así que hay que esperar a que hidrate para decidir.
  await page.goto('/proyectos');
  let flagOn = true;
  try {
    await page.getByRole('link', { name: /Descargar todos/i }).waitFor({ state: 'visible', timeout: 8000 });
  } catch {
    flagOn = false;
  }
  test.skip(!flagOn, 'mapaAvanzado apagado en este build (NEXT_PUBLIC_FEAT_MAPA_PLUS)');

  const buf = readFileSync(fileURLToPath(new URL('../fixtures/geo/google_earth_pro.kmz', import.meta.url)));
  let capaId: string | number | undefined;
  let proyId: string | number | undefined;
  try {
    const capaRes = await request.post('/api/capas-geo', {
      headers: auth,
      multipart: {
        _payload: JSON.stringify({ titulo: 'Predio e2e', tipo: 'proyecto' }),
        file: { name: 'google_earth_pro.kmz', mimeType: 'application/vnd.google-earth.kmz', buffer: buf },
      },
    });
    expect(capaRes.ok()).toBeTruthy();
    capaId = (await capaRes.json()).doc.id;

    const proyRes = await request.post('/api/proyectos', {
      headers: { ...auth, 'Content-Type': 'application/json' },
      data: {
        nombre: 'Proyecto e2e con capa', descripcion: 'demo', empresa: 'e2e',
        etapa: 'operacion', region: 'araucania',
        coordenadas: { lat: -38.74, lng: -72.59 }, capa: capaId,
      },
    });
    expect(proyRes.ok()).toBeTruthy();
    proyId = (await proyRes.json()).doc.id;

    await page.goto('/proyectos');
    // la geometría del polígono se dibuja como un <path> interactivo de Leaflet
    await expect(page.locator('path.leaflet-interactive').first()).toBeVisible({ timeout: 20_000 });
  } finally {
    if (proyId) await request.delete(`/api/proyectos/${proyId}`, { headers: auth });
    if (capaId) await request.delete(`/api/capas-geo/${capaId}`, { headers: auth });
  }
});
