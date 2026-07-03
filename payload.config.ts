import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob';
import { es } from '@payloadcms/translations/languages/es';
import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

// NOTA (deuda conocida): este directory import resuelve bien en Next (dev y build de
// producción), pero el loader tsx de la CLI de Payload no lo resuelve, así que
// `payload generate:types` / `generate:importmap` fallan con ERR_MODULE_NOT_FOUND.
// Workaround si necesitas regenerar: comenta temporalmente este import y `prodMigrations`,
// corre el comando, y descomenta. (Probado: ./index y ./index.js tampoco resuelven en esa CLI.)
import { migrations } from './src/migrations';

// Collections
import { Users } from '@/collections/Users';
import { Media } from '@/collections/Media';
import { Noticias } from '@/collections/Noticias';
import { Documentos } from '@/collections/Documentos';
import { Proyectos } from '@/collections/Proyectos';
import { Miembros } from '@/collections/Miembros';
import { Downloads } from '@/collections/Downloads';
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
