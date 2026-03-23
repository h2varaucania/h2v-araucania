import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import path from 'path';
import { fileURLToPath } from 'url';

import { Users } from '@/collections/Users';
import { Media } from '@/collections/Media';
import { Noticias } from '@/collections/Noticias';
import { Documentos } from '@/collections/Documentos';
import { Proyectos } from '@/collections/Proyectos';
import { Miembros } from '@/collections/Miembros';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: ' — H2V Araucanía Admin',
    },
  },
  collections: [
    Users,
    Media,
    Noticias,
    Documentos,
    Proyectos,
    Miembros,
  ],
  editor: lexicalEditor(),
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  secret: process.env.PAYLOAD_SECRET || 'default-dev-secret-change-me',
  typescript: {
    outputFile: path.resolve(dirname, 'src/payload-types.ts'),
  },
  sharp: true,
});
