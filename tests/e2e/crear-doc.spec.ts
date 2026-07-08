import { test, expect, type Page } from '@playwright/test';
import { E2E_ADMIN } from './global-setup.mts';

// §5.3.1 — La vista "Crear nuevo" también es contenido del dueño (QA Daniel
// 07-07-26, ítem #12: crear noticia dejaba el admin EN BLANCO). Cubre el
// gotcha: con autosave, el borrador inicial se crea durante el render del
// server component, donde un revalidatePath en afterChange es ilegal.

async function login(page: Page) {
  await page.goto('/admin/login');
  await page.fill('input[name="email"]', E2E_ADMIN.email);
  await page.fill('input[name="password"]', E2E_ADMIN.password);
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/admin(?!\/login)/, { timeout: 20_000 });
}

for (const coleccion of ['noticias', 'eventos'] as const) {
  test(`"Crear nuevo" de ${coleccion} renderiza el formulario (no página en blanco)`, async ({ page }) => {
    await login(page);
    await page.goto(`/admin/collections/${coleccion}/create`);
    await expect(page.locator('input[name="titulo"]')).toBeVisible({ timeout: 20_000 });
    await expect(page.locator('text=Something went wrong')).toHaveCount(0);
  });
}
