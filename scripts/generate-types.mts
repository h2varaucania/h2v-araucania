/**
 * Genera src/payload-types.ts. Reemplaza a `payload generate:types`, cuyo CLI
 * no funciona en este repo por dos incompatibilidades (2026-07-04):
 *  1. Su `tsImport` ancla el tsconfig en node_modules/payload/ → nunca aplica
 *     los alias `@/` del proyecto (ERR_MODULE_NOT_FOUND en @/collections).
 *  2. Su barrel `payload/node` arrastra loadEnv.js → interop roto de @next/env
 *     bajo tsx (Cannot destructure 'loadEnvConfig').
 * Este script corre bajo `tsx` puro (tsconfig del cwd → alias OK), carga el
 * config por import dinámico (interop homogéneo) e invoca generateTypes
 * importado DIRECTO de dist (sin el barrel). Uso: npm run payload:generate
 */
import { pathToFileURL } from 'node:url';

const cfgMod = await import('@payload-config');
const config = await cfgMod.default;

let generateTypes: (cfg: unknown) => Promise<void>;
try {
  // @ts-expect-error — subpath interno de payload sin tipos publicados (a propósito:
  // evita el barrel payload/node, que rompe por interop de @next/env).
  ({ generateTypes } = await import('payload/dist/bin/generateTypes.js'));
} catch {
  // exports-map del paquete puede bloquear el subpath: ir por file URL.
  const url = pathToFileURL(
    new URL('../node_modules/payload/dist/bin/generateTypes.js', import.meta.url).pathname,
  ).href;
  ({ generateTypes } = await import(url));
}

await generateTypes(config);
console.log('✅ src/payload-types.ts generado');
