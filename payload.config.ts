import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { es } from '@payloadcms/translations/languages/es';
import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

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
    GuiaAdmin,
  ],
  editor: lexicalEditor(),
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
