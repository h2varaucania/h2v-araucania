import { test, expect } from '@playwright/test';
import { E2E_ADMIN } from './global-setup.mts';

// §5.3.2 — "Guardar = la web se actualiza": un cambio por API se ve en la
// ruta pública (force-dynamic hoy; revalidación al guardar cuando sea estático).

test('editar la bajada de Contacto se refleja en /contacto', async ({ request, page }) => {
  const login = await request.post('/api/users/login', {
    data: { email: E2E_ADMIN.email, password: E2E_ADMIN.password },
  });
  expect(login.ok()).toBeTruthy();
  const { token } = await login.json();
  const auth = { Authorization: `JWT ${token}` };

  const antes = await (await request.get('/api/globals/contacto', { headers: auth })).json();
  const original: string = antes.bajadaPagina || 'Escríbenos para consultas, colaboraciones o más información.';
  const marcador = `Edición e2e ${Date.now()}`;

  const patch = await request.post('/api/globals/contacto', {
    headers: auth,
    data: { bajadaPagina: marcador },
  });
  expect(patch.ok()).toBeTruthy();

  try {
    await page.goto('/contacto');
    await expect(page.locator(`text=${marcador}`)).toBeVisible({ timeout: 15_000 });
  } finally {
    await request.post('/api/globals/contacto', { headers: auth, data: { bajadaPagina: original } });
  }
});
