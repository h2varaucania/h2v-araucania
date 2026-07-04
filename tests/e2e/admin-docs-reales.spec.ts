import { test, expect, type Page } from '@playwright/test';
import { E2E_ADMIN } from './global-setup.mts';

// §5.3.1 — El admin abre documentos REALES con contenido (caza el Lexical #17:
// un doc con un node type no registrado revienta el editor y el dueño queda
// fuera de SU contenido). Nada de pantallas "create" vacías.

async function login(page: Page) {
  await page.goto('/admin/login');
  await page.fill('input[name="email"]', E2E_ADMIN.email);
  await page.fill('input[name="password"]', E2E_ADMIN.password);
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/admin(?!\/login)/, { timeout: 20_000 });
}

test('el panel de administración renderiza (no pantalla en negro)', async ({ page }) => {
  await page.goto('/admin/login');
  await expect(page.locator('form')).toBeVisible({ timeout: 20_000 });
  await expect(page.locator('text=Something went wrong')).toHaveCount(0);
});

for (const coleccion of ['noticias', 'eventos'] as const) {
  test(`un doc real de ${coleccion} abre en el editor sin reventar`, async ({ page }) => {
    await login(page);
    await page.goto(`/admin/collections/${coleccion}`);
    const rows = page.locator('tbody tr a');
    const n = await rows.count();
    test.skip(n === 0, `sin docs de ${coleccion} en esta base`);
    await rows.first().click();
    await expect(page.locator('[data-lexical-editor="true"]').first()).toBeVisible({ timeout: 20_000 });
    await expect(page.locator('text=Something went wrong')).toHaveCount(0);
  });
}

test('el global Contacto abre con sus pestañas', async ({ page }) => {
  await login(page);
  await page.goto('/admin/globals/contacto');
  await expect(page.locator('text=Formulario').first()).toBeVisible({ timeout: 20_000 });
  await expect(page.locator('text=Something went wrong')).toHaveCount(0);
});
