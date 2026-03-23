import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

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
    GuiaAdmin,
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
  sharp,
});
