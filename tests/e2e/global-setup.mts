// Setup e2e: crea el admin de pruebas usando el pipeline tsx probado del repo.
import { execSync } from 'node:child_process';

export const E2E_ADMIN = { email: 'e2e-admin@test.local', password: 'E2eAdmin2026!' };

export default function globalSetup() {
  execSync('npx tsx tests/e2e/crear-admin.mts', {
    stdio: 'inherit',
    env: { ...process.env, TSX_TSCONFIG_PATH: './tsconfig.json' },
  });
}
