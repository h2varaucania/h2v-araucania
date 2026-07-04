import { defineConfig } from '@playwright/test';

// e2e del estándar EDITABILIDAD_TOTAL §5.3: protegen al dueño, no al código.
// Requisitos para correr: servidor en :3000 (next start) y DATABASE_URI local.
// `npm run test:e2e` se encarga de todo (ver package.json).
export default defineConfig({
  testDir: './tests/e2e',
  timeout: 60_000,
  retries: 0,
  workers: 1,
  globalSetup: './tests/e2e/global-setup.mts',
  use: {
    baseURL: process.env.E2E_BASE_URL || 'http://localhost:3000',
    screenshot: 'only-on-failure',
  },
  reporter: [['list']],
});
