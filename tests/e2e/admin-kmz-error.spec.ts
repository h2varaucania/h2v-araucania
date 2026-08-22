import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { E2E_ADMIN } from './global-setup.mts';

// §Criterio 1 — un archivo inválido produce un error EN ESPAÑOL, no "Something went wrong".
test('subir un ZIP sin KML es rechazado con mensaje en español', async ({ request }) => {
  const login = await request.post('/api/users/login', { data: E2E_ADMIN });
  expect(login.ok()).toBeTruthy();
  const token = (await login.json()).token as string;

  const buf = readFileSync(fileURLToPath(new URL('../fixtures/geo/zip_sin_kml.zip', import.meta.url)));
  const r = await request.post('/api/capas-geo', {
    headers: { Authorization: `JWT ${token}` },
    multipart: {
      _payload: JSON.stringify({ titulo: 'archivo malo', tipo: 'proyecto' }),
      file: { name: 'zip_sin_kml.zip', mimeType: 'application/zip', buffer: buf },
    },
  });
  expect(r.status()).toBe(400);
  const cuerpo = await r.text();
  expect(cuerpo).toMatch(/KML|comprimido/i); // mensaje en español del catálogo
  expect(cuerpo).not.toContain('Something went wrong');
});
