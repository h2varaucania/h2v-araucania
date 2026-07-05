# La interfaz de administración: descripción técnica

> **Qué es este documento.** La contraparte técnica de `EDITABILIDAD_TOTAL.md`:
> aquella define la *doctrina* (qué debe ser editable y por qué); este describe
> *cómo quedó construido* el panel que la cumple, en el proyecto h2v-araucania.
> **Para quién.** Para el proyecto hermano (o la sesión de Claude que lo
> mantiene) que quiera entender, auditar o replicar este panel. Es autocontenido.
> **Stack de referencia.** Payload CMS 3.80 embebido en Next.js 16 (App Router,
> Turbopack), Postgres (Neon) vía `@payloadcms/db-postgres`, deploy en Vercel.
> **Regla de oro heredada.** Todo texto visible nace editable; el código solo
> lleva diseño y estructura. Lo que sigue es la maquinaria que lo hace cierto.

---

## 1. Montaje del panel (Payload dentro de Next)

Payload 3 no es un servicio aparte: se monta como un **route group** dentro de
la misma app Next. Conviven dos árboles bajo `src/app/`:

```
src/app/
├── (frontend)/      → el sitio público (React Server Components, force-dynamic)
└── (payload)/       → el panel /admin y la REST/GraphQL API de Payload
    ├── layout.tsx            → RootLayout de @payloadcms/next/layouts
    ├── admin/[[...segments]] → todas las vistas del panel (catch-all)
    ├── admin/importMap.js    → GENERADO: mapa de componentes cliente (ver §6)
    ├── api/[...slug]         → REST + GraphQL de Payload
    └── serverFunctions.ts    → server actions que el panel invoca
```

- **Config única:** `payload.config.ts` en la raíz (no en `src/`), importado con
  alias `@payload-config`. Declara `admin`, `collections`, `globals`, `editor`,
  `db`, `email`, `plugins`, `secret`, `i18n`.
- **Idioma del panel:** español forzado —
  `i18n: { supportedLanguages: { es }, fallbackLanguage: 'es' }` con
  `import { es } from '@payloadcms/translations/languages/es'`. El *chrome* de
  Payload (botones, menús, mensajes) sale en español sin trabajo extra.
- **Meta del admin:** `admin.meta.titleSuffix` da el `<title>` de las pestañas
  (`… — H2V Araucanía Admin`), útil para reconocer el panel.
- **No hay componentes de admin custom** (`admin.components` vacío): el panel es
  Payload puro. Toda la "personalización para dummies" se logra con **labels,
  descripciones y agrupación de campos**, no con React a medida. Esto abarata el
  mantenimiento drásticamente (es el punto entero del CMS).

> **Import con extensión `.ts` explícita.** `payload.config.ts` importa las
> migraciones como `from './src/migrations/index.ts'` (con `.ts`), y el
> `tsconfig` tiene `allowImportingTsExtensions: true`. Sin eso, la CLI de Payload
> (loader `tsx`) no resuelve el *directory import* y los `generate:*` fallan.

---

## 2. Modelo de contenido: colecciones vs. globals

La distinción es la columna vertebral de la editabilidad.

| Tipo | Cuándo | En este proyecto |
|---|---|---|
| **Colección** | Lista repetible que crece | `Noticias`, `Documentos`, `Proyectos`, `Miembros`, `Eventos`, `Media`, `Users`, `Downloads`, `VideoViews` |
| **Global** | Todos los textos de UNA página (o config única) | 14 globals de página + `SitioGeneral`, `Contacto`, `GuiaAdmin` |

**El patrón clave: un global por página.** Cada página del sitio tiene su global
(`PaginaInicio`, `PaginaQuienesSomos`, `PaginaGobernanza`, `PaginaH2V`, …). Ese
global contiene el 100% de los textos de esa página: títulos, bajadas, párrafos,
y las "columnas/tarjetas" como **arrays reordenables** (nunca `col1/col2/col3`).
`SitioGeneral` guarda lo transversal (footer, 404, logos); `Contacto` los datos
institucionales; `GuiaAdmin` el manual embebido (ver §10).

**Agrupación en el menú** (`admin.group`): los globals se reparten en grupos con
nombre humano — *Páginas*, *Configuración*, *Ayuda* — para que el administrador
navegue por bloques, no por una lista plana de 17 entradas.

---

## 3. Cómo se hace "editable" un texto (el patrón, en 4 piezas)

Para mudar un literal del JSX al panel sin perder el diseño ni el contenido
actual, cada texto pasa por cuatro piezas coordinadas. Ejemplo real: la página
de Contacto (`src/globals/Contacto.ts` + `src/app/(frontend)/contacto/page.tsx`).

**1) Módulo de defaults — única fuente de verdad** (`src/content/defaults/*.ts`):
el contenido real actual, copiado *verbatim*. Alimenta las otras tres piezas.

```ts
// src/content/defaults/contacto.ts
export const contactoDefaults = {
  tituloFormulario: 'Envíanos un mensaje',
  formOpcionesAsunto: [{ etiqueta: 'Consulta general', valor: 'consulta' }, /*…*/],
  // …todo el texto que antes estaba cableado
} as const;
```

**2) El global consume el default como `defaultValue`** (el panel nace lleno,
nunca vacío) y organiza los campos en **pestañas** con ayuda en español:

```ts
{ type: 'tabs', tabs: [{ label: 'Formulario', fields: [
  { name: 'tituloFormulario', type: 'text', defaultValue: d.tituloFormulario,
    admin: { description: 'Ej: "Envíanos un mensaje"' } },
  { name: 'formOpcionesAsunto', type: 'array', labels: { singular: 'Opción', plural: 'Opciones' },
    defaultValue: d.formOpcionesAsunto.map(o => ({ ...o })), fields: [ /* etiqueta, valor */ ] },
]}]}
```

> Las `tabs` **sin `name`** son solo presentación (no cambian el esquema), así
> que se pueden añadir sin migración. Con `name` sí crean estructura.

**3) El componente lee del CMS con fallback** — cero literales. Dos helpers
(`src/lib/contenido.ts`):

```ts
export const t = (v, fb) => (v && v.trim() ? v : fb);
export const list = (v, fb) => (v && v.length ? v : fb);
// uso:  <h2>{t(g?.tituloFormulario, d.tituloFormulario)}</h2>
```

**4) Una migración de datos rellena el global** ya existente en producción con
los defaults (ver §8). `updateGlobal` es *merge parcial*: solo toca los campos
que incluye, así que **no pisa lo que el dueño ya editó**.

**Criterio de "hecho" (auditoría):** el `grep` de literales JSX debe dar cero.
```bash
grep -rnoE '>[A-ZÁÉÍÓÚÑa-z][^<>{}]{8,}<' "src/app/(frontend)" src/components
```
El inventario vivo de lo pendiente está en `docs/INVENTARIO_LITERALES.md`.

---

## 4. Control de acceso y roles

Tres roles en el campo `role` de `Users` (`admin | editor | registrado`),
tres helpers reutilizables (`src/lib/access.ts`):

```ts
export const anyone: Access = () => true;                                   // lectura pública
export const isAdmin: Access = ({ req }) => req.user?.role === 'admin';
export const isAdminOrEditor: Access = ({ req }) =>
  req.user?.role === 'admin' || req.user?.role === 'editor';
```

- **Colecciones de contenido** (Noticias, Documentos, Eventos, Proyectos,
  Miembros, Media): `read: anyone`, `create/update: isAdminOrEditor`,
  `delete: isAdmin` (el borrado es permanente → solo admin).
- **Globals de configuración** (`SitioGeneral`, `Contacto`): `update: isAdmin`.
- **Puerta del panel** (`Users.access.admin`): solo `admin`/`editor` entran a
  `/admin`; un `registrado` usa el sitio público, no el panel.

**Hook anti-trampas en `Users`** (`beforeChange`, operation `create`):
- El **primer usuario** del sitio se fuerza a `admin` (evita quedar sin acceso).
- Un registro público (sin `req.user` admin) se sanea a `registrado` (nadie se
  auto-asigna admin/editor desde fuera del panel).

**Límites de login** (`auth`): `maxLoginAttempts: 5`, `lockTime: 10 min`.

> **Gotcha (verificado):** el hook sanea el rol en el **CREATE**. Para crear un
> admin por Local API (p. ej. setup de tests) hace falta un **UPDATE posterior**
> del rol, porque el create sin `req.user` lo baja a `registrado`.

---

## 5. El editor de texto enriquecido (Lexical) y el menú «/»

`editor: lexicalEditor()` — el editor por defecto de Payload 3, con su set de
features estándar. En los campos `richText` (p. ej. contenido de noticia) el
administrador dispone de:

- **Barra flotante** al seleccionar texto: negrita, cursiva, subrayado, tachado,
  enlace, código, alineación, super/subíndice.
- **Menú «/»**: en línea vacía, `/` abre un selector para **insertar bloques**:
  encabezados (H1–H4), listas (viñetas / numeradas / checklist), cita,
  línea horizontal, subir imagen (upload), relación.

**Regla dura (features ⊇ node types).** Todo tipo de nodo que el contenido pueda
contener DEBE estar registrado en las features del campo. Si un documento trae
un tipo no registrado, **el panel no puede ni abrirlo** (error Lexical #17). Tras
tocar features o colecciones: `payload generate:types` **y**
`payload generate:importmap` (ver §6). Un test e2e abre documentos reales para
cazar exactamente esto (§9).

---

## 6. `importMap` — la trampa más cara (y su vacuna)

El panel de Payload es RSC + componentes cliente. `admin/importMap.js`
(**generado**, no se edita a mano) mapea cada componente cliente que el panel
necesita cargar (features del editor, handlers de plugins, campos custom).

> ### ⚠️ Gotcha crítico: plugin condicional → admin EN NEGRO
> El adapter de Vercel Blob se registra **condicional al token**:
> ```ts
> plugins: [ ...(process.env.BLOB_READ_WRITE_TOKEN ? [vercelBlobStorage({…})] : []) ]
> ```
> Si el `importMap` se genera **sin** el token (plugin inactivo), **no incluye**
> el componente cliente del plugin (`VercelBlobClientUploadHandler`). Al activar
> el Blob store en producción (token presente), el panel pide ese componente,
> **no lo encuentra en el mapa, y renderiza NEGRO** — sin errores en la consola
> del navegador; el error solo aparece en los *logs de runtime* del servidor
> (`getFromImportMap: PayloadComponent not found in importMap { … }`).
>
> **Vacuna:** regenerar el importMap con el plugin **activo**. Script del repo:
> ```json
> "payload:importmap": "TSX_TSCONFIG_PATH=./tsconfig.json BLOB_READ_WRITE_TOKEN=vercel_blob_rw_dummygen0000_dummygen0000 payload generate:importmap"
> ```
> El token dummy tiene formato válido (`vercel_blob_rw_<id>_<rand>`) para que el
> adapter lo parsee y se registre. **Regla general: cualquier plugin condicional
> por env que registre componentes → generar el importMap con el plugin ACTIVO.**

---

## 7. Persistencia y servicios (todo condicional por env)

- **Uploads (Vercel Blob).** El disco de Vercel es efímero: en producción los
  archivos de `Media` van a Blob (`collections: { media: true }`). Condicional a
  `BLOB_READ_WRITE_TOKEN`; en dev local se usa disco.
  > **Gotcha:** el store puede quedar conectado vía **OIDC** (Vercel 2026 inyecta
  > `BLOB_STORE_ID` + webhook, pero **no** un token estático). El adapter EXIGE
  > `BLOB_READ_WRITE_TOKEN` con formato `vercel_blob_rw_…`. Fix en el dashboard:
  > store → Projects → *Update Project Connection* → marcar *"Add a read-write
  > token env var"*. Requiere redeploy.
  > **Gotcha 2:** `/public/uploads` suele estar en `.gitignore` → sus archivos no
  > llegan a Vercel. Assets que deban llegar a producción van en carpetas
  > *trackeadas* (`public/docs`, `public/images`); y desde rutas API se leen por
  > `fetch(origin + ruta)`, no por FS (el FS serverless no trae `public/`).
- **Email (Resend).** `resendAdapter`, condicional a `RESEND_API_KEY`. Sin él,
  "olvidé mi clave" no envía correo. Remitente `onboarding@resend.dev` hasta
  verificar dominio propio.
- **`Media`** es la colección de subida (`upload: { staticDir, mimeTypes,
  imageSizes }`); `sharp` genera los tamaños (thumbnail/card/hero).

---

## 8. Base de datos y migraciones disciplinadas

```ts
db: postgresAdapter({
  pool: { connectionString: process.env.DATABASE_URI || process.env.POSTGRES_URL || … },
  push: process.env.PAYLOAD_DB_PUSH === 'true' || process.env.NODE_ENV !== 'production',
  prodMigrations: migrations,
})
```

- **Dev:** `push` de drizzle sincroniza el esquema al vuelo (no requiere migrar).
- **Producción:** `push` apagado; el esquema lo aplican **migraciones**. El build
  las corre solo, vía `vercel.json`:
  ```json
  { "buildCommand": "TSX_TSCONFIG_PATH=./tsconfig.json npx payload migrate && npm run build" }
  ```
  **CERO SQL manual contra producción.**

**Baseline defensiva.** La migración inicial se *squashea* y se hace idempotente
a mano, de modo que sirva para una **base vacía Y para una base ya poblada**:
`CREATE TYPE` envuelto en `DO $$ … EXCEPTION WHEN duplicate_object $$`, `CREATE
TABLE/INDEX … IF NOT EXISTS`, `ADD CONSTRAINT` con guard, y un **replay de
`ADD COLUMN IF NOT EXISTS`** de cada columna (para que una tabla preexistente
reciba solo lo que le falta). Validar SIEMPRE contra una base temporal vacía y
contra un clon del respaldo real antes de commitear.

**Migración de datos pareada.** Cada cambio de esquema va acompañado, en la
misma tanda, de una migración que rellena los campos nuevos con los defaults.
Usa el Local API (`payload.updateGlobal`, merge parcial → no pisa lo del dueño),
con `context: { disableRevalidate: true }` para no disparar cientos de
revalidaciones.

> ### ⚠️ Dos trampas de las migraciones de datos (pagadas)
> 1. **`findGlobal` aplica los `defaultValue` al leer.** Un "guard de existencia"
>    que lee por API SIEMPRE ve datos (los defaults), aunque la fila no exista.
>    Para saber si un global ya está poblado, **contar por SQL**
>    (`db.execute(sql\`SELECT count(*) …\`)`), no leer por API.
> 2. **Un error capturado DENTRO de la transacción la envenena.** Un `try/catch`
>    como control de flujo alrededor de un `updateGlobal` que valida y falla deja
>    la transacción *aborted* y **revierte en silencio los pasos anteriores**.
>    Poner el guard (el `count`) **ANTES** de escribir; nunca `try/catch` para
>    decidir si escribir.
> 3. **Regla de emparejamiento:** el relleno de datos va INMEDIATAMENTE después
>    de su cambio de esquema; el relleno inicial de una instalación nueva lo hace
>    el SEED. Jamás editar una migración ya aplicada (si quedó mala, se neutraliza
>    con una no-op).

---

## 9. Drafts, versiones y revalidación

- **Drafts + versions** en Noticias y Eventos:
  `versions: { drafts: { autosave: true }, maxPerDoc: 20 }`. El editor ve botones
  explícitos *Publicar cambios* / *Guardar borrador*; cada guardado deja una
  versión restaurable. El frontend filtra por `_status` con un helper compartido
  (`src/lib/published.ts`) que además incluye docs legacy sin `_status`.
- **Revalidación al guardar** (`src/hooks/revalidate.ts`): hooks `afterChange`
  en cada global y colección llaman `revalidatePath` de sus rutas, con guard
  `context.disableRevalidate` para seeds/migraciones. Hoy el frontend es
  `force-dynamic` (cada visita consulta la base, así que "guardar = se ve al
  tiro" ya se cumple); dejar los hooks cableados habilita migrar a estático
  + revalidación página por página sin volver a tocar los globals.

---

## 10. UX del panel "para dummies"

Sin una línea de React custom, solo con la config declarativa:

- **`admin.description` en CADA campo y colección**, en español llano y con
  ejemplo (`'Se muestra entre paréntesis, ej. 2015–2017'`). El manual de usuario
  nace de aquí.
- **`admin.group`** reparte el menú en bloques con nombre humano.
- **`labels: { singular, plural }`** en arrays y colecciones (filas colapsables
  y reordenables arrastrando).
- **`useAsTitle` / `defaultColumns`** por colección para que las listas sean
  legibles.
- **`admin.readOnly` / `admin.hidden`** para lo que el dueño no debe tocar
  (contadores automáticos, campos de sistema).
- **Guía embebida:** el global `GuiaAdmin` (grupo *Ayuda*, `readOnly`) lleva el
  manual paso a paso DENTRO del panel — el mismo contenido que el PDF de traspaso
  (`docs/Guia_Administracion_H2V_Araucania.pdf`).

---

## 11. Tests que protegen al dueño (e2e Playwright)

`npm run test:e2e` (`tests/e2e/`), tres suites del estándar (§5.3 de la doctrina):

1. **El admin abre documentos REALES** con contenido (no pantallas "create"
   vacías): entra a cada colección con richText, abre el primer doc y exige
   editor visible + cero "Something went wrong". Este test caza el Lexical #17 y
   la pantalla-negra del importMap.
2. **La edición se refleja:** cambia un campo por API → la ruta pública lo muestra.
3. **Rutas clave 200** con contenido real.

Setup vía `tsx` (el pipeline probado del repo) que crea un admin de pruebas.

---

## 12. Gotchas pagados — la tabla-regalo

| Síntoma | Causa raíz | Vacuna |
|---|---|---|
| `/admin` renderiza **en negro**, sin error en consola | Plugin condicional (Blob) → falta su componente cliente en el `importMap` | Regenerar importMap con el plugin ACTIVO (token dummy con formato válido) |
| Un doc no abre en el panel ("Something went wrong") | Node type en el contenido no registrado en las features del editor | features ⊇ node types + `generate:importmap` + test que abre docs reales |
| Uploads se pierden tras redeploy | Disco de Vercel efímero / store en modo OIDC sin token estático | Blob adapter condicional + conexión con `BLOB_READ_WRITE_TOKEN` |
| Migración de datos revienta en base fresca | Local API + esquema declarado que una migración posterior recién crea | Emparejar cada relleno con su cambio de esquema; el seed hace la carga inicial |
| Migración "revierte sola" pasos previos | `try/catch` como control de flujo dentro de la transacción → tx aborted | Guard por `SELECT count(*)` ANTES de escribir, no `try/catch` |
| Guard de existencia siempre "ve" datos | `findGlobal` aplica `defaultValue` al leer | Contar filas por SQL, no leer por API |
| Primer usuario queda sin acceso al panel | Rol por defecto del registro público | `beforeChange`: primer usuario = admin; registro público = registrado |
| `payload generate:*` falla con `ERR_MODULE_NOT_FOUND` | Alias `@/` no resueltos por el loader `tsx` de la CLI | Fijar `TSX_TSCONFIG_PATH=./tsconfig.json`; import de migraciones con `.ts` explícito |
| Edición del panel "no aplica" en prod | Confiar en `PAYLOAD_DB_PUSH` en runtime (no aplica diffs con esquema existente) | Migraciones en el build (`vercel.json`), nunca push runtime |

---

## 13. Mapa de archivos clave

```
payload.config.ts                 # config única (admin, colecciones, globals, editor, db, email, plugins, i18n)
vercel.json                       # migrate en el build (cero SQL manual)
src/
├── collections/*.ts              # Users, Media, Noticias, Documentos, Proyectos, Miembros, Eventos, …
├── globals/*.ts                  # 14 globals de página + SitioGeneral, Contacto, GuiaAdmin
├── content/defaults/*.ts         # única fuente de verdad del contenido inicial (verbatim)
├── lib/
│   ├── access.ts                 # anyone / isAdmin / isAdminOrEditor
│   ├── contenido.ts              # helpers t() / list()
│   └── published.ts              # filtro de publicados (incluye legacy sin _status)
├── hooks/revalidate.ts           # revalidación afterChange por global/colección
├── migrations/                   # baseline defensiva + migraciones de datos pareadas
├── payload-types.ts              # GENERADO (payload:generate)
└── app/(payload)/admin/importMap.js  # GENERADO con plugin activo (payload:importmap)
tests/e2e/                        # 3 suites Playwright (§11)
docs/EDITABILIDAD_TOTAL.md        # la doctrina (del proyecto hermano)
docs/INVENTARIO_LITERALES.md      # pendientes de mudanza al panel
```

---

## 14. Cómo replicar en el proyecto hermano (resumen operativo)

1. Un **global por página** + `SitioGeneral`/`Contacto`; agrupar con `admin.group`.
2. Por página: **defaults verbatim** → campos con `defaultValue` + `tabs` +
   `admin.description` → componente con `t()/list()` → **migración de datos
   pareada**. Commit por página, suite verde.
3. `access.ts` con los tres helpers; hook de `Users` (primer=admin, registro
   público=registrado); `auth` con límites de login; i18n `es`.
4. Editor: `lexicalEditor()`; tras tocar features/colecciones,
   `generate:types` **y** `generate:importmap` (este último con los plugins
   condicionales ACTIVOS).
5. Servicios condicionales por env (Blob, Resend) — y generar el importMap con
   ellos activos.
6. Migraciones disciplinadas: baseline defensiva idempotente + `vercel.json` con
   `migrate` en el build; validar en base vacía y en clon del respaldo.
7. e2e que **abra documentos reales**; el resto del checklist en
   `EDITABILIDAD_TOTAL.md §9`.
8. Guía embebida (`GuiaAdmin` global, readOnly) + manual imprimible de traspaso.

---

*Origen: h2v-araucania, implementación de la doctrina `EDITABILIDAD_TOTAL.md`
(2026-07-04/05). Si algo aquí contradice el código, gana el código: audita,
ajusta y anota la diferencia en este mismo archivo.*
