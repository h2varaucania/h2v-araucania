# Manual Tecnico — H2V Araucania

> Plataforma informativa del Bien Publico 24BP-269085
> Version del documento: abril 2026

---

## 1. Descripcion del Proyecto

**H2V Araucania** es la plataforma web del Programa Estrategico Regional de Hidrogeno Verde en La Araucania, financiado por CORFO como Bien Publico (codigo 24BP-269085).

| Rol | Institucion |
|---|---|
| Ejecutor principal | CODESSER (Corporacion de Desarrollo Social del Sector Rural) |
| Co-ejecutor tecnico | Universidad de Talca |
| Mandante | Subsecretaria de Energia — Ministerio de Energia |

La plataforma sirve como centro informativo para difusion de noticias, documentos, proyectos de H2V en un mapa interactivo, gobernanza del programa, hoja de ruta, y capacitacion.

---

## 2. Stack Tecnologico

| Componente | Tecnologia | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16.2.1 |
| CMS | Payload CMS | 3.80.0 |
| Base de datos | PostgreSQL | 16 (Alpine) |
| ORM/DB adapter | @payloadcms/db-postgres | 3.80.0 |
| Editor de texto enriquecido | @payloadcms/richtext-lexical | 3.80.0 |
| CSS | Tailwind CSS | 4 |
| React | React | 19.2.4 |
| Mapas | Leaflet | 1.9.4 |
| Email | Resend | 6.9.4 |
| Validacion | Zod | 4.3.6 |
| Procesamiento de imagenes | sharp | 0.34.5 |
| Lenguaje | TypeScript | 5.x |
| Runtime | Node.js | 22 (Alpine en Docker) |

---

## 3. Arquitectura General

```
                    +--------------+
                    |  PostgreSQL   |
                    |  (puerto 5432)|
                    +------+-------+
                           |
                    +------+-------+
                    | Payload CMS  |
                    | (ORM + Admin)|
                    +------+-------+
                           |
                    +------+-------+
                    |   Next.js    |
                    | App Router   |
                    |  (puerto 3000)|
                    +------+-------+
                           |
              +------------+------------+
              |                         |
     (frontend) rutas             (payload) admin
     publicas SSR/SSG             panel /admin
```

- **Next.js App Router** maneja tanto el frontend publico como el panel de administracion de Payload.
- **Payload CMS** se ejecuta embebido dentro de Next.js (no como servicio separado). La configuracion se encuentra en `payload.config.ts` en la raiz del proyecto.
- **PostgreSQL 16** almacena todos los datos (contenido, usuarios, media metadata).
- Los archivos subidos (imagenes, PDFs) se guardan en `public/uploads/`.

---

## 4. Estructura de Directorios

```
h2v-araucania/
├── docs/                          # Documentacion del proyecto
├── public/
│   └── uploads/                   # Archivos subidos via Payload
├── src/
│   ├── app/
│   │   ├── (frontend)/            # Rutas publicas del sitio
│   │   │   ├── page.tsx           # Pagina de inicio
│   │   │   ├── layout.tsx         # Layout del frontend (Navbar + Footer)
│   │   │   ├── contacto/
│   │   │   ├── noticias/
│   │   │   │   ├── page.tsx       # Listado de noticias
│   │   │   │   └── [slug]/page.tsx # Detalle de noticia
│   │   │   ├── proyectos/         # Mapa de proyectos H2V
│   │   │   ├── programa/
│   │   │   │   ├── quienes-somos/
│   │   │   │   ├── gobernanza/
│   │   │   │   ├── comunidad/
│   │   │   │   └── transparencia/
│   │   │   ├── hidrogeno-verde/
│   │   │   │   ├── page.tsx       # Que es el H2V
│   │   │   │   ├── sectores/
│   │   │   │   ├── capital-humano/
│   │   │   │   ├── hoja-de-ruta/
│   │   │   │   └── marco-regulatorio/
│   │   │   ├── recursos/
│   │   │   │   ├── documentos/
│   │   │   │   ├── eventos/
│   │   │   │   └── mediateca/
│   │   │   ├── login/
│   │   │   └── registro/
│   │   ├── (payload)/             # Admin panel de Payload (autogenerado)
│   │   ├── api/
│   │   │   ├── contact/route.ts   # Formulario de contacto
│   │   │   ├── download/route.ts  # Registro de descargas
│   │   │   ├── search/route.ts    # Busqueda global
│   │   │   └── seed/route.ts      # Seed de datos iniciales
│   │   ├── layout.tsx             # Root layout
│   │   └── globals.css            # Estilos globales (Tailwind)
│   ├── collections/               # Definiciones de colecciones Payload
│   │   ├── Users.ts
│   │   ├── Media.ts
│   │   ├── Noticias.ts
│   │   ├── Documentos.ts
│   │   ├── Proyectos.ts
│   │   ├── Miembros.ts
│   │   ├── Downloads.ts
│   │   └── Eventos.ts
│   ├── globals/                   # Definiciones de globals Payload
│   │   ├── SitioGeneral.ts
│   │   ├── Contacto.ts
│   │   ├── PaginaInicio.ts
│   │   ├── PaginaQuienesSomos.ts
│   │   ├── PaginaGobernanza.ts
│   │   ├── PaginaH2V.ts
│   │   ├── PaginaSectores.ts
│   │   ├── PaginaHojaRuta.ts
│   │   ├── PaginaComunidad.ts
│   │   ├── PaginaCapitalHumano.ts
│   │   ├── PaginaMarcoRegulatorio.ts
│   │   └── GuiaAdmin.ts
│   ├── components/
│   │   ├── charts/                # Graficos
│   │   ├── forms/                 # Formularios (contacto, registro)
│   │   ├── layout/                # Navbar, Footer, etc.
│   │   ├── maps/                  # Mapa Leaflet de proyectos
│   │   └── ui/                    # Componentes de UI genericos
│   ├── lib/
│   │   ├── analytics/             # Google Analytics
│   │   ├── auth/                  # Utilidades de autenticacion
│   │   ├── db/                    # Utilidades de base de datos
│   │   ├── features.ts            # Feature flags
│   │   ├── forms/                 # Validacion de formularios
│   │   ├── i18n/                  # Internacionalizacion
│   │   ├── layout/                # Utilidades de layout
│   │   ├── mapbox/                # Configuracion de mapas
│   │   ├── maps/                  # Utilidades de mapas
│   │   ├── payload/
│   │   │   └── getPayload.ts      # Helper para obtener instancia Payload
│   │   ├── rateLimit.ts           # Rate limiter in-memory
│   │   └── ui/                    # Utilidades de UI
│   └── payload-types.ts           # Tipos autogenerados por Payload
├── payload.config.ts              # Configuracion central de Payload CMS
├── package.json
├── docker-compose.yml             # Orquestacion dev/base
├── docker-compose.prod.yml        # Override de produccion
├── Dockerfile                     # Build multi-stage (Alpine)
├── .env.local.example             # Plantilla de variables de entorno
└── tsconfig.json
```

---

## 5. Colecciones (Collections)

Las colecciones son las tablas de datos del CMS. Se definen en `src/collections/`.

### 5.1 Users (`users`)

- **Grupo admin:** Sistema
- **Autenticacion:** Integrada en Payload (`auth: true`)
- **Campos:** `email` (titulo), `nombre`, `role` (admin/editor/registrado), `institucion`
- **Roles:**
  - `admin` — Acceso total al panel y a la gestion de usuarios
  - `editor` — Puede crear y editar contenido (noticias, documentos, eventos)
  - `registrado` — Solo puede descargar documentos en el frontend

### 5.2 Media (`media`)

- **Grupo admin:** Sistema
- **Upload:** Archivos se guardan en `public/uploads/`
- **MIME types permitidos:** JPEG, PNG, WebP, GIF, SVG, PDF, DOCX, PPTX, XLSX
- **Tamanos de imagen generados automaticamente:**
  - `thumbnail` (400x300)
  - `card` (768x512)
  - `hero` (1920x1080)
- **Campos:** `alt` (descripcion, requerido)

### 5.3 Noticias (`noticias`)

- **Grupo admin:** Contenido
- **Campos:** `titulo` (max 120), `slug` (unico, URL-friendly), `extracto` (max 300), `contenido` (richText), `imagen` (relacion a media), `fecha`, `categoria` (seminario/taller/gobernanza/acuerdo/proyecto/general), `publicado` (checkbox)
- **Importante:** Solo las noticias con `publicado: true` aparecen en el frontend.

### 5.4 Documentos (`documentos`)

- **Grupo admin:** Contenido
- **Campos:** `titulo` (max 120), `descripcion` (max 400), `archivo` (relacion a media), `thumbnail` (opcional), `tipo` (tecnico/difusion/regulatorio/capacitacion), `anio`, `descargas` (auto-incrementado, read-only)
- El contador de descargas se incrementa automaticamente via `/api/download`.

### 5.5 Proyectos (`proyectos`)

- **Grupo admin:** Contenido
- **Campos:** `nombre` (max 100), `descripcion` (max 400), `empresa` (max 80), `etapa` (planificacion/pilotaje/desarrollo/operacion), `region` (araucania/nacional), `coordenadas` (grupo: `lat` y `lng`), `capacidadMW`, `produccionTonAnio`, `imagen` (opcional), `url` (opcional)
- Las coordenadas son requeridas y representan la ubicacion en el mapa Leaflet.
- Rangos validos: lat [-56, -17], lng [-76, -66] (territorio chileno).

### 5.6 Miembros de Gobernanza (`miembros`)

- **Grupo admin:** Contenido
- **Campos:** `nombre` (max 80), `cargo` (max 60), `institucion` (max 80), `instancia` (consejo/comite/unidad), `foto` (opcional), `aporte` (textarea), `suplente` (opcional), `orden` (numerico, menor = primero)
- Instancias de gobernanza:
  - Consejo de Direccion (nivel estrategico)
  - Comite Consultivo Tecnico Cientifico
  - Unidad de Coordinacion y Gestion (nivel operativo)

### 5.7 Downloads (`downloads`)

- **Grupo admin:** Sistema
- **Acceso:** Solo lectura para admins. No se crea ni modifica manualmente.
- **Campos:** `documento` (relacion), `user` (relacion, opcional), `downloadedAt`, `ip`, `userAgent`
- Se usa para indicadores CORFO. Cada descarga de documento queda registrada automaticamente.

### 5.8 Eventos (`eventos`)

- **Grupo admin:** Contenido
- **Campos:** `titulo` (max 120), `descripcion` (richText), `fecha`, `fechaFin` (opcional), `lugar` (max 100), `tipo` (seminario/taller/feria/reunion/capacitacion/otro), `imagen` (opcional), `urlInscripcion` (opcional), `publicado` (checkbox)
- Solo los eventos con `publicado: true` aparecen en el frontend.

---

## 6. Globals

Los globals son documentos singleton editables que controlan el contenido de cada pagina. Se definen en `src/globals/`.

### 6.1 Configuracion

| Global | Slug | Descripcion |
|---|---|---|
| Configuracion General | `sitio-general` | Nombre del sitio, descripcion SEO, texto del footer, logos institucionales |
| Contacto | `contacto` | Email, ubicacion, telefono, datos institucionales (ejecutor, co-ejecutor, mandante, codigo BP) |

### 6.2 Paginas

| Global | Slug | Contenido que controla |
|---|---|---|
| Pagina de Inicio | `pagina-inicio` | Hero (titulo, subtitulo, CTAs), tarjetas de acceso rapido |
| Quienes Somos | `pagina-quienes-somos` | Descripcion del BP, instituciones participantes |
| Gobernanza | `pagina-gobernanza` | Funciones, descripciones de cada nivel de gobernanza |
| Hidrogeno Verde | `pagina-h2v` | Contenido educativo, electrolizadores, derivados |
| Sectores | `pagina-sectores` | Sectores productivos y oportunidades |
| Hoja de Ruta | `pagina-hoja-ruta` | Hitos del timeline |
| Comunidad | `pagina-comunidad` | Participacion ciudadana, glosario Mapudungun |
| Capital Humano | `pagina-capital-humano` | Perfiles profesionales y programas de capacitacion |
| Marco Regulatorio | `pagina-marco-regulatorio` | Documentos normativos |

### 6.3 Ayuda

| Global | Slug | Descripcion |
|---|---|---|
| Guia de uso | `guia-admin` | Guia integrada en el panel admin (read-only). Instrucciones para administradores. |

---

## 7. Variables de Entorno

Copiar `.env.local.example` como `.env.local` (desarrollo) o `.env` (Docker).

```bash
cp .env.local.example .env.local
```

### Variables requeridas

| Variable | Descripcion | Ejemplo |
|---|---|---|
| `DATABASE_URI` | Connection string de PostgreSQL | `postgresql://h2v_admin:h2v_dev_2026@localhost:5432/h2v_araucania` |
| `PAYLOAD_SECRET` | Clave secreta para Payload CMS. Generar con `openssl rand -base64 32`. **No usar el valor por defecto.** | (string aleatorio de 32+ caracteres) |
| `NEXT_PUBLIC_SITE_URL` | URL publica del sitio | `http://localhost:3000` |

### Variables de Docker (usadas por docker-compose)

| Variable | Descripcion | Default |
|---|---|---|
| `POSTGRES_DB` | Nombre de la base de datos | `h2v_araucania` |
| `POSTGRES_USER` | Usuario PostgreSQL | `h2v_admin` |
| `POSTGRES_PASSWORD` | Password PostgreSQL (requerido) | — |
| `POSTGRES_PORT` | Puerto expuesto de PostgreSQL | `5432` |
| `APP_PORT` | Puerto expuesto de la app | `3000` |

### Variables opcionales

| Variable | Descripcion |
|---|---|
| `RESEND_API_KEY` | API key de Resend para envio de emails del formulario de contacto. Sin esta key el contacto funciona en modo dev (log a consola). |
| `CONTACT_EMAIL` | Email destino del formulario de contacto. Default: `h2varaucania@gmail.com` |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Token de Mapbox (si se usa mapa avanzado) |
| `NEXT_PUBLIC_GA_ID` | ID de Google Analytics |
| `SENTRY_DSN` | DSN de Sentry para monitoreo de errores |
| `SENTRY_AUTH_TOKEN` | Token de autenticacion de Sentry |
| `VIMEO_ACCESS_TOKEN` | Token de acceso de Vimeo (mediateca) |

### Feature flags

Todas siguen el patron `NEXT_PUBLIC_FEAT_*`. Valor `'true'` activa la feature, cualquier otro valor la desactiva.

| Variable | Feature |
|---|---|
| `NEXT_PUBLIC_FEAT_H2V` | Pagina "Que es el Hidrogeno Verde" |
| `NEXT_PUBLIC_FEAT_SECTORES` | Pagina de sectores productivos |
| `NEXT_PUBLIC_FEAT_CAPITAL_HUMANO` | Pagina de capital humano |
| `NEXT_PUBLIC_FEAT_HOJA_RUTA` | Pagina de hoja de ruta |
| `NEXT_PUBLIC_FEAT_REGULATORIO` | Pagina de marco regulatorio |
| `NEXT_PUBLIC_FEAT_EVENTOS` | Seccion de eventos |
| `NEXT_PUBLIC_FEAT_COMUNIDAD` | Pagina de comunidad |
| `NEXT_PUBLIC_FEAT_TRANSPARENCIA` | Pagina de transparencia |
| `NEXT_PUBLIC_FEAT_MEDIATECA` | Mediateca de videos |
| `NEXT_PUBLIC_FEAT_I18N` | Internacionalizacion |
| `NEXT_PUBLIC_FEAT_MAPA_PLUS` | Mapa avanzado (Mapbox) |
| `NEXT_PUBLIC_FEAT_DASHBOARD` | Dashboard de indicadores |
| `NEXT_PUBLIC_FEAT_AI` | Asistente IA |
| `NEXT_PUBLIC_FEAT_ENCUESTAS` | Modulo de encuestas |
| `NEXT_PUBLIC_FEAT_PWA` | Progressive Web App |
| `NEXT_PUBLIC_FEAT_API` | API abierta |

Las features del Parte I (noticias, mapa de proyectos, recursos, gobernanza, quienes somos, contacto, auth, buscador) estan siempre activas en el codigo.

---

## 8. Desarrollo Local

### Prerequisitos

- **Node.js 22+** (recomendado: usar nvm)
- **PostgreSQL 16** (local o via Docker)
- **npm** (incluido con Node.js)

### Opcion A: PostgreSQL local

```bash
# 1. Clonar el repositorio
git clone <url-del-repo> h2v-araucania
cd h2v-araucania

# 2. Instalar dependencias
npm install

# 3. Crear la base de datos
createdb h2v_araucania
# O con psql:
# psql -c "CREATE DATABASE h2v_araucania;"

# 4. Configurar variables de entorno
cp .env.local.example .env.local
# Editar .env.local con tus valores:
#   DATABASE_URI=postgresql://tu_usuario:tu_password@localhost:5432/h2v_araucania
#   PAYLOAD_SECRET=<generar con: openssl rand -base64 32>

# 5. Iniciar el servidor de desarrollo
npm run dev
# Disponible en http://localhost:3000
# Panel admin en http://localhost:3000/admin
```

### Opcion B: Docker Compose (recomendado)

```bash
# 1. Clonar y configurar
git clone <url-del-repo> h2v-araucania
cd h2v-araucania
cp .env.local.example .env
# Editar .env con valores reales para PAYLOAD_SECRET y POSTGRES_PASSWORD

# 2. Levantar servicios
docker compose up --build

# La app estara en http://localhost:3000
# PostgreSQL en localhost:5432
```

### Seed de datos iniciales

En modo desarrollo, se puede poblar la base de datos con datos de ejemplo:

```bash
curl -X POST "http://localhost:3000/api/seed?key=seed-h2v-2026"
```

Esto crea:
- Un usuario admin (`admin@h2varaucania.cl` / `H2vAdmin2026!`)
- Configuracion general del sitio
- Datos de contacto
- Contenido de paginas
- Noticias, documentos, proyectos y miembros de ejemplo

**Importante:** El seed esta bloqueado en produccion (`NODE_ENV=production`).

### Scripts disponibles

| Script | Descripcion |
|---|---|
| `npm run dev` | Servidor de desarrollo con hot reload |
| `npm run build` | Build de produccion |
| `npm run start` | Iniciar servidor de produccion (requiere build previo) |
| `npm run lint` | Ejecutar ESLint (cero warnings permitidos) |
| `npm run typecheck` | Verificacion de tipos TypeScript |
| `npm run payload:generate` | Regenerar tipos de Payload (`src/payload-types.ts`) |
| `npm run seed` | Ejecutar seed via CLI (tsx) |

---

## 9. Despliegue en Produccion

### Opcion 1: Docker (recomendado)

```bash
# Construir y desplegar con Docker Compose
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

El Dockerfile usa un build multi-stage de 3 etapas:
1. **deps** — Instala dependencias incluyendo sharp compilado para Alpine
2. **builder** — Ejecuta `npm run build` para generar la app standalone
3. **runner** — Imagen minima de produccion con usuario no-root

Consideraciones:
- Los uploads se persisten en el volumen Docker `h2v-uploads`
- La base de datos se persiste en `h2v-pgdata`
- El usuario del contenedor es `nextjs` (UID 1001), no root
- Puerto expuesto: 3000 (configurable via `APP_PORT`)

### Opcion 2: Vercel

- Next.js 16 es compatible nativo con Vercel
- Se requiere una base de datos PostgreSQL externa (ej. Neon, Supabase, Railway)
- Configurar todas las variables de entorno en el dashboard de Vercel
- Los uploads deben usar almacenamiento externo (S3, Cloudflare R2) ya que Vercel no tiene filesystem persistente

---

## 10. Rutas API

Todas las rutas API estan en `src/app/api/` y usan rate limiting.

### POST `/api/contact`

Formulario de contacto. Valida con Zod y envia email via Resend (si esta configurado).

- **Rate limit:** 5 envios por 15 minutos por IP
- **Body:** `{ nombre, email, asunto, mensaje }`
- `asunto` acepta: `consulta`, `colaboracion`, `prensa`, `otro`
- Sin `RESEND_API_KEY`, opera en modo dev (log a consola)

### POST `/api/download`

Registra una descarga de documento e incrementa el contador.

- **Rate limit:** 20 descargas por 5 minutos por IP
- **Body:** `{ documentId }`
- Crea un registro en la coleccion `downloads`
- Incrementa el campo `descargas` del documento

### GET `/api/search?q=<query>`

Busqueda global en noticias (publicadas), documentos y proyectos.

- **Rate limit:** 30 busquedas por minuto por IP
- Busca por `contains` en titulo, extracto/descripcion, empresa
- Retorna maximo 5 resultados por tipo
- Query minima: 2 caracteres

### POST `/api/seed?key=seed-h2v-2026`

Seed de datos iniciales. Solo funciona en desarrollo.

- **Bloqueado en produccion** (`NODE_ENV=production` retorna 403)
- Requiere key `seed-h2v-2026` como query parameter

---

## 11. Patron de Acceso a Datos del CMS

El patron estandar para obtener datos de Payload en componentes server-side:

```typescript
import { getPayload } from '@/lib/payload/getPayload';

export default async function MiPagina() {
  const payload = await getPayload();

  // Obtener un global
  let datos;
  try {
    datos = await payload.findGlobal({ slug: 'pagina-inicio' });
  } catch {
    datos = null; // fallback si no hay datos
  }

  // Obtener una coleccion
  const noticias = await payload.find({
    collection: 'noticias',
    where: { publicado: { equals: true } },
    sort: '-fecha',
    limit: 6,
  });

  return <div>{/* renderizar datos */}</div>;
}
```

Puntos clave:
- `getPayload()` es un wrapper ligero que importa la configuracion y retorna la instancia de Payload
- Siempre envolver `findGlobal` en try/catch con fallback (los globals pueden no tener datos en una DB nueva)
- Las queries de coleccion usan la API de Payload (`find`, `findByID`, `create`, `update`)
- En el frontend, los datos se obtienen en componentes de servidor (Server Components de React 19)

---

## 12. Seguridad

### Rate Limiting

Implementado en `src/lib/rateLimit.ts`. Es un rate limiter in-memory (no persistente entre reinicios).

| Endpoint | Limite | Ventana |
|---|---|---|
| `/api/contact` | 5 requests | 15 minutos |
| `/api/download` | 20 requests | 5 minutos |
| `/api/search` | 30 requests | 1 minuto |

Para despliegues multi-instancia se recomienda reemplazar por rate limiting basado en Redis.

### Validacion de Entrada

- El formulario de contacto valida con **Zod** (nombre, email, asunto enum, mensaje con limites de longitud)
- Los campos de coleccion tienen `maxLength`, `min`, `max` y `required` definidos en Payload

### Autenticacion

- Payload CMS maneja autenticacion con sesiones
- Tres roles: `admin`, `editor`, `registrado`
- La coleccion `Downloads` tiene control de acceso explicito: solo admins pueden leer, nadie puede crear/editar manualmente

### Otros

- Dockerfile usa usuario no-root (`nextjs:nodejs`)
- PAYLOAD_SECRET lanza error si no esta configurado o usa el valor por defecto
- El seed esta bloqueado en produccion
- `getClientIp()` lee `x-forwarded-for` o `x-real-ip` para rate limiting detras de proxy

---

## 13. Feature Flags

El sistema de feature flags se define en `src/lib/features.ts`.

Hay dos categorias:

1. **Parte I (siempre activas):** `noticias`, `mapaProyectos`, `recursos`, `gobernanza`, `quienesSomos`, `contacto`, `auth`, `buscador` — hardcoded como `true`.

2. **Apendice A (toggleables):** Se activan via variables de entorno `NEXT_PUBLIC_FEAT_*`. Se leen en tiempo de build (son prefijo `NEXT_PUBLIC_`, accesibles en cliente y servidor).

Para usar un flag en un componente:

```typescript
import { features } from '@/lib/features';

export default function MiComponente() {
  if (!features.hidrogenoVerde) return null;
  return <div>Contenido de H2V</div>;
}
```

**Deploy minimalista:** Todos los `FEAT_*` en `false` (solo Parte I).
**Deploy maximalista:** Todos los `FEAT_*` en `true` (toda la funcionalidad).

---

## 14. Generacion de Tipos

Payload genera automaticamente los tipos TypeScript para todas las colecciones y globals:

```bash
npm run payload:generate
```

Esto actualiza `src/payload-types.ts`. Ejecutar despues de cualquier cambio en colecciones o globals.

---

## 15. Notas para Traspaso

1. **Base de datos:** Payload maneja las migraciones automaticamente al iniciar. No hay archivos de migracion manuales.
2. **Uploads:** En Docker se persisten en el volumen `h2v-uploads`. En desarrollo local estan en `public/uploads/` (ignorado por git).
3. **Email:** Si `RESEND_API_KEY` no esta configurado, el formulario de contacto funciona pero no envia emails (log a consola).
4. **Mapas:** El mapa de proyectos usa Leaflet (open source). El feature flag `MAPA_PLUS` habilita un mapa avanzado con Mapbox (requiere token).
5. **Admin panel:** Accesible en `/admin`. Payload genera la UI automaticamente a partir de las definiciones de colecciones y globals.
6. **Guia admin integrada:** El global `GuiaAdmin` contiene instrucciones para usuarios no tecnicos, visibles directamente en el panel admin bajo el grupo "Ayuda".
