import { test, expect } from '@playwright/test';

// §5.3.3 — Las rutas clave responden 200 con contenido real (no cascarones).

const RUTAS: Array<{ ruta: string; marcador: string }> = [
  { ruta: '/', marcador: 'Hidr' },
  { ruta: '/contacto', marcador: 'contacto' },
  { ruta: '/programa/quienes-somos', marcador: 'Comité Estratégico' },
  { ruta: '/recursos/documentos', marcador: 'Documentación' },
  { ruta: '/noticias', marcador: 'Noticias' },
];

for (const { ruta, marcador } of RUTAS) {
  test(`${ruta} responde 200 con contenido`, async ({ page }) => {
    const resp = await page.goto(ruta);
    expect(resp?.status()).toBe(200);
    await expect(page.locator(`text=${marcador}`).first()).toBeVisible({ timeout: 15_000 });
  });
}
