import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob';
import { resendAdapter } from '@payloadcms/email-resend';
import { es } from '@payloadcms/translations/languages/es';
import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

// NOTA: import con extensión .ts explícita (+ allowImportingTsExtensions en tsconfig) para
// que resuelva en los TRES toolchains: Next (dev/build), tsc, y el loader tsx de la CLI de
// Payload (que no resuelve directory imports ni mapea .js→.ts tras el pathsMatcher). La CLI
// además necesita TSX_TSCONFIG_PATH fijado al tsconfig del proyecto (ver script npm
// `payload:generate`): sin eso, tsx no aplica los alias `@/` y los generate:* fallan con
// ERR_MODULE_NOT_FOUND. Resuelto 2026-07-04.
import { migrations } from './src/migrations/index.ts';

// Collections
import { Users } from '@/collections/Users';
import { Media } from '@/collections/Media';
import { Noticias } from '@/collections/Noticias';
import { Documentos } from '@/collections/Documentos';
import { Proyectos } from '@/collections/Proyectos';
import { Miembros } from '@/collections/Miembros';
import { Downloads } from '@/collections/Downloads';
import { VideoViews } from '@/collections/VideoViews';
import { Eventos } from '@/collections/Eventos';

// Globals (contenido editable de cada página)
import { PaginaInicio } from '@/globals/PaginaInicio';
import { PaginaQuienesSomos } from '@/globals/PaginaQuienesSomos';
import { PaginaGobernanza } from '@/globals/PaginaGobernanza';
import { PaginaH2V } from '@/globals/PaginaH2V';
import { PaginaSectores } from '@/globals/PaginaSectores';
import { PaginaHojaRuta } from '@/globals/PaginaHojaRuta';
import { PaginaComunidad } from '@/globals/PaginaComunidad';
import { PaginaCapitalHumano } from '@/globals/PaginaCapitalHumano';
import { PaginaMarcoRegulatorio } from '@/globals/PaginaMarcoRegulatorio';
import { PaginaTransparencia } from '@/globals/PaginaTransparencia';
import { PaginaMediateca } from '@/globals/PaginaMediateca';
import { PaginaProyectos } from '@/globals/PaginaProyectos';
import { PaginaPrivacidad } from '@/globals/PaginaPrivacidad';
import { PaginaAccesibilidad } from '@/globals/PaginaAccesibilidad';
import { ContactoGlobal } from '@/globals/Contacto';
import { SitioGeneral } from '@/globals/SitioGeneral';
import { GuiaAdmin } from '@/globals/GuiaAdmin';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: ' — H2V Araucanía Admin',
    },
  },
  // Panel de administración en español.
  i18n: {
    supportedLanguages: { es },
    fallbackLanguage: 'es',
  },
  collections: [
    Users,
    Media,
    Noticias,
    Documentos,
    Proyectos,
    Miembros,
    Downloads,
    VideoViews,
    Eventos,
  ],
  globals: [
    SitioGeneral,
    ContactoGlobal,
    PaginaInicio,
    PaginaQuienesSomos,
    PaginaGobernanza,
    PaginaH2V,
    PaginaSectores,
    PaginaHojaRuta,
    PaginaComunidad,
    PaginaCapitalHumano,
    PaginaMarcoRegulatorio,
    PaginaTransparencia,
    PaginaMediateca,
    PaginaProyectos,
    PaginaPrivacidad,
    PaginaAccesibilidad,
    GuiaAdmin,
  ],
  editor: lexicalEditor(),
  // Persistencia de uploads (F1, Auditoria_traspaso.md): el disco de Vercel es efímero, así que
  // en producción los archivos de Media van a Vercel Blob. Se activa solo si existe el token
  // (lo inyecta Vercel al conectar un Blob store al proyecto); en dev local se sigue usando disco.
  // ⚠ GOTCHA (2026-07-04): al ser condicional, el importMap del admin DEBE generarse con el
  // plugin ACTIVO (`npm run payload:importmap`, que fija un token dummy con formato válido).
  // Si se genera sin token, falta VercelBlobClientUploadHandler en el mapa y el admin de
  // producción queda EN NEGRO (error solo visible en los logs de runtime de Vercel).
  // Email transaccional (EDITABILIDAD_TOTAL §5.5): sin esto, "olvidé mi clave"
  // no envía correo. Se activa solo si existe RESEND_API_KEY (Vercel/local).
  // Remitente onboarding@resend.dev hasta verificar dominio propio en Resend.
  ...(process.env.RESEND_API_KEY
    ? {
        email: resendAdapter({
          apiKey: process.env.RESEND_API_KEY,
          defaultFromAddress: 'onboarding@resend.dev',
          defaultFromName: 'H2V Araucanía',
        }),
      }
    : {}),
  plugins: [
    ...(process.env.BLOB_READ_WRITE_TOKEN
      ? [
          vercelBlobStorage({
            collections: { media: true },
            token: process.env.BLOB_READ_WRITE_TOKEN,
          }),
        ]
      : []),
  ],
  db: postgresAdapter({
    pool: {
      // Acepta la cadena de conexión local (DATABASE_URI) o la que inyecta Vercel/Neon
      // al crear la base de datos (POSTGRES_URL / DATABASE_URL).
      connectionString:
        process.env.DATABASE_URI ||
        process.env.POSTGRES_URL ||
        process.env.DATABASE_POSTGRES_URL ||
        process.env.DATABASE_URL ||
        '',
    },
    // En dev usa push (drizzle) para sincronizar el esquema. En producción (Vercel) el push
    // está apagado, salvo que se active PAYLOAD_DB_PUSH=true para el primer deploy contra una
    // base de datos nueva (crea las tablas). Quitar esa variable una vez creado el esquema.
    push: process.env.PAYLOAD_DB_PUSH === 'true' || process.env.NODE_ENV !== 'production',
    prodMigrations: migrations,
  }),
  secret: (() => {
    const s = process.env.PAYLOAD_SECRET;
    if (!s || s === 'your-secret-key-change-in-production') {
      throw new Error('PAYLOAD_SECRET is not set or is using the default value. Generate one with: openssl rand -base64 32');
    }
    return s;
  })(),
  typescript: {
    outputFile: path.resolve(dirname, 'src/payload-types.ts'),
  },
  sharp,
});
