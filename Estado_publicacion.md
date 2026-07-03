# Estado de publicación — H2V Araucanía

> Memoria viva del proceso de publicación (skill `publicadora_web`). Gana la realidad sobre este archivo.
> Vive en la raíz del repo y se commitea → se respalda en GitHub.

## 1. Encabezado

| Campo | Valor |
|---|---|
| **Proyecto** | H2V Araucanía — sitio del Bien Público 24BP-269085 de hidrógeno verde en La Araucanía |
| **Stack** | Next.js 16 + Payload CMS 3 + PostgreSQL (Neon), desplegado en Vercel |
| **Repositorio** | github.com/h2varaucania/h2v-araucania; colaborador: villalobosecon |
| **URL actual** | https://h2v-araucania.vercel.app (subdominio Vercel; aún sin dominio propio) |
| **Dueño final** | Programa H2V Araucanía (CODESSER + U. de Talca); cuenta central h2varaucania@gmail.com |
| **Responsable de publicación** | Carlos Villalobos |
| **Fecha de creación del estado** | 2026-06-23 |
| **Última actualización** | 2026-06-23 |

## 2. Nivel de presupuesto

- **Nivel:** Mínimo / institucional — Bien Público universitario, sin tráfico masivo ni datos sensibles, pero necesita dominio `.cl` propio para credibilidad institucional.
- **Costo recurrente estimado:** ~USD 0/mes (Vercel Hobby + Neon Free) + dominio `.cl` ~CLP 10.000/año (verificar en nic.cl).
- **Qué dispararía subir de nivel:** datos personales sensibles, tráfico alto, o exigencia de SLA → Vercel Pro + respaldo gestionado.

## 3. Diagnóstico Fase 0 (2026-06-23)

### Qué YA hay (verificado)
- Deploy andando en Vercel (cuenta h2varaucania, Hobby gratis), HTTPS, build OK.
- DB Neon Postgres (neon-crimson-blanket, Free), por `DATABASE_URI`, con datos reales (5 proyectos, 12 miembros, 3 eventos migrados de la DB de abril).
- `/admin` de Payload en español, roles admin/editor/registrado cableados de verdad (API responde 403 a escrituras sin sesión).
- Headers de seguridad completos en `next.config.ts` (CSP, HSTS, X-Frame DENY, nosniff, Referrer-Policy, Permissions-Policy) — verificados en producción.

### Qué FALTA para estar "operativo"
- **Seguridad:** clave del admin DÉBIL (`h2varaucania`); quitar `PAYLOAD_DB_PUSH` de Vercel; 2FA en cuentas; rate-limit explícito.
- **Respaldo:** automatizado de la DB + restauración probada; uploads a almacenamiento persistente (Vercel Blob) — el disco de Vercel es efímero.
- **Dominio:** `h2varaucania.cl` (NIC Chile) apuntado a Vercel con SSL.
- **Manual** del /admin y **acta de traspaso** al dueño.

### Riesgos / gotchas detectados
- Cadena de Neon trae `?channel_binding=require` → puede romper node-postgres; limpiar quitando `channel_binding=require&` y preservando el `?`. URL mal formada da error 3D000.
- `push` de esquema off en producción; DB nueva creada con `PAYLOAD_DB_PUSH=true` en el primer deploy → **falta quitarlo**.
- Uploads del CMS no persisten en Vercel (disco efímero) — los archivos de abril se perdieron.

## 4. Tabla de las 7 fases

| # | Fase | Estado | Decisiones tomadas | Fecha |
|---|---|---|---|---|
| 0 | Diagnóstico y plan | **hecho** | Nivel mínimo/institucional; plan de 6 fases | 2026-06-23 |
| 1 | Seguridad / hardening | **en curso** | Headers ✅, access/roles ✅, secretos ✅; PENDIENTE clave fuerte, quitar PAYLOAD_DB_PUSH, 2FA, rate-limit explícito | 2026-06-23 |
| 2 | Respaldo de datos | pendiente | — | — |
| 3 | Dominio + DNS + hosting | pendiente | Tentativo: h2varaucania.cl en NIC Chile, hosting sigue en Vercel (NO cPanel) | — |
| 4 | Manual del /admin | pendiente | — | — |
| 5 | Entrega / traspaso | pendiente | Tentativo: traspasar todo a la cuenta central h2varaucania | — |
| 6 | Operación continua | pendiente | — | — |

## 5. Decisiones clave

### Dominio
- **Dominio elegido:** (tentativo) h2varaucania.cl — POR CONFIRMAR/COMPRAR
- **Dónde se registró:** NIC Chile (nic.cl) — pendiente
- **A nombre de:** registrar a nombre de la institución/dueño, no personal — pendiente
- **Vence el:** — (agendar al comprar)

### Hosting y DNS
- **Hosting:** Vercel (apropiado para Next+Payload; cPanel NO sirve para este stack)
- **DNS:** pendiente (apuntar A/CNAME a Vercel desde NIC Chile)
- **SSL/HTTPS:** automático de Vercel (activo en el subdominio; se re-emite al apuntar el dominio propio)

### Base de datos y archivos
- **Proveedor de DB:** Neon Postgres, Free (point-in-time restore + branching)
- **Persistencia de uploads:** PENDIENTE — mover a Vercel Blob (sin esto los PDFs/imágenes se pierden)

### Plan de respaldo
- **Qué se respalda y cómo:** PENDIENTE (DB vía scripts/respaldo.sh + point-in-time de Neon; uploads en Blob)
- **Última restauración probada:** — (la migración abril→nuevo del 2026-06-23 fue, de hecho, una restauración exitosa de datos)

### Traspaso
- **A quién se traspasa:** cuenta central h2varaucania@gmail.com — pendiente formalizar
- **El dueño, ¿administra o delega?** por definir

## 6. Bitácora

- **2026-07-03 (tarde)** — **⚠️ REGRESIÓN ACOTADA EN PRODUCCIÓN, fix listo esperando autorización.** El deploy aa02073 salió bien, pero el `PAYLOAD_DB_PUSH` NO aplicó el esquema de drafts: el plan incluía eliminar la columna `publicado` (cambio destructivo) y drizzle-push exige confirmación interactiva que en serverless no existe → abortó TODO el plan (verificado en logs de Vercel: `column "_status" does not exist`). Efecto visible: `/api/eventos` y `/api/noticias` responden 500 y **los 3 eventos de abril no se muestran** en `/recursos/eventos`; el resto del sitio funciona (16/16 rutas 200, defaults). **Fix diseñado y validado** contra una DB scratch local donde Payload generó el esquema exacto: (1) `ALTER TABLE eventos DROP COLUMN IF EXISTS publicado;` + ídem noticias (único cambio destructivo, columna obsoleta), (2) redeploy → el push aplica solo el resto (100% aditivo: enums, `_status`, tablas `_v`, tablas de globals nuevos), (3) `UPDATE eventos SET "_status"='published';` + ídem noticias (los docs existentes vuelven a ser visibles). SQL de respaldo en scratchpad `fix_prod.sql`. El clasificador de Claude Code bloqueó ejecutarlo sin autorización explícita de Carlos → PENDIENTE su OK (2 min de ejecución en el SQL Editor de Neon, sesión ya abierta).
- **2026-07-03** — **Paquete de código de la auditoría EJECUTADO** (Carlos autorizó ejecución completa /goal). Aplicado: **F1** Blob adapter condicional (`@payloadcms/storage-vercel-blob@3.80.0`; se activa con `BLOB_READ_WRITE_TOKEN`; PENDIENTE crear el Blob store en Vercel para activarlo). **F4** drafts+versions en Noticias y Eventos (botones Guardar borrador/Publicar + pestaña Versiones; checkbox `publicado` eliminado; queries migradas al filtro `publicados` de `src/lib/published.ts` que incluye docs legacy sin `_status`; fix de bug preexistente: un borrador era visible por URL directa en `/noticias/[slug]`). **F5** legales editables (globals `pagina-privacidad` y `pagina-accesibilidad` con richText que reemplaza el texto estándar; email leído SIEMPRE de Contacto). **F6** global `pagina-proyectos` (hero), diagrama de gobernanza editable (textos + equipos que se reparten solos) y galería "Evidencia de Actividades" (array de fotos), "Explora más" de H2V editable con select de rutas (no se pueden crear links rotos). **F7** Guía de uso reescrita completa (todos los tipos de contenido, flujo Publicar, problemas comunes: borrador invisible, bloqueo 10 min, borrado permanente). **F8** globals Configuración/Contacto/Guía solo admin. **F9** delete solo admin en todas las colecciones. **F11** categoriasColor centralizado en `src/lib/categorias.ts`. **F12** `importMap.ts` placeholder eliminado (posible causa del dashboard en blanco: TS resuelve `.ts` sobre `.js`). **F13** `maxLoginAttempts: 5`, `lockTime: 10 min` explícitos. tsc OK. **Deuda documentada:** la CLI de Payload (generate:types/importmap) no resuelve el directory import de migraciones (loader tsx); workaround comentado en `payload.config.ts`. **Post-deploy pendiente:** re-publicar (re-guardar) las noticias/eventos existentes en producción para que queden versionados; crear Blob store.
- **2026-07-03** — **Deploy a producción + auditoría de traspaso.** Commit a2b563d pusheado (logo oficial en masthead, Manual Corfo §1.2 en home y footer, set oficial de logos, Comasa habilitada); verificado vivo en https://h2v-araucania.vercel.app (franja "Proyecto apoyado por" presente, headers de seguridad intactos, 16/16 rutas 200). Luego **auditoría completa con lente de traspaso a administrador no experto** (dos barridos de código: frontend y capa admin + verificación de producción). Veredicto: **la arquitectura de la concepción es correcta, no se cambia**; el gap es operacional y de cobertura CMS. 13 hallazgos priorizados (P0: uploads efímeros F1, PAYLOAD_DB_PUSH F2, cadena de cuentas F3) → ver **`Auditoria_traspaso.md`** (nuevo, en la raíz del repo). El plan de la auditoría alimenta las Fases 1–5. Dato corregido: el episodio "dashboard /admin en blanco" YA está resuelto (importMap.js actual incluye CollectionCards); queda F12 (borrar importMap.ts placeholder).
- **2026-06-24** — **Logo oficial del programa** integrado al sitio. Carlos dejó `logos/` en la raíz del repo (11 PNG + el manual de comunicaciones Corfo 2025). Por md5, 10 logos eran byte-idénticos a los ya servidos en `public/logos/`; el único asset nuevo es `Logo Bien Público.png` (identidad oficial: chimenea-hoja verde + "BIEN PÚBLICO H2V AGRO PRODUCTIVO ARAUCANÍA", RGBA transparente 710×555). Se copió a `public/logos/` y se cableó en el **masthead (Header.tsx)** dentro de una píldora blanca (el header es azul y la tinta del logo es oscura/azul → fondo claro para contraste), reemplazando el wordmark de texto. Verificado en vivo: render 56×44, sin errores de consola. → El header pasó de texto a identidad de marca real.
- **2026-06-24** — **Manual de marca Corfo aplicado al sitio (§1.2).** Carlos confirmó que la carpeta `logos/` es el set OFICIAL y pidió aplicar el manual. Leído completo (13 pp., diagramas de orden incluidos). Caso determinado con alta confianza = **§1.2 (financiamiento Corfo)**: la evidencia es la propia carpeta oficial, que trae Corfo (Corfo Azul + DPS Corfo) y **NO** trae GORE, ni CORE, ni el logo del "Comité"; y "24**BP**" es instrumento Corfo. Aplicado: (a) franja de la home reordenada en dos niveles → **"Proyecto apoyado por"** con CORFO + DPS **destacados, a color** (h-14/h-20), y **"Instituciones participantes"** (ejecutor UTalca + colaboradores) en gris y **menores que Corfo** (h-9/h-10) — verificado en vivo: Corfo 56px vs socios 36px; (b) footer: el crédito "Proyecto apoyado por" CORFO+DPS **fijado en código** (ya no editable/borrable desde el CMS) en panel blanco a color. Archivos: `page.tsx`, `Footer.tsx`, `layout.tsx`. typecheck OK; los 4 errores de lint de `page.tsx` son **preexistentes** (no introducidos). **CONFIRMADO por Carlos (2026-07-03):** aplica §1.2 con la evidencia del set oficial; autorizó deploy y pidió auditoría de traspaso (admin no experto en la Seremi).
- **2026-06-24** — Manual de marca archivado: copia en `~/Dev/h2v-araucania/logos/` (repo) y respaldo sincronizado en `OneDrive/.../Investigacion/H2V/Marca/`.
- **2026-06-24** — Set oficial de logos sincronizado a `public/logos/` (lo que SIRVE el sitio): **Comasa habilitada** (se eliminó la versión desactivada `_…Comasa…`) y `Logo Bien Público.png` agregado. La carpeta `logos/` en la raíz del repo es **fuente/staging** (Carlos la dejó ahí). Pendiente `git add` de los PNG nuevos (untracked) antes del commit.
- **2026-06-23** — Skill `publicadora_web` invocada sobre H2V. Fase 0 completada; Fase 1 en curso. Verificaciones de seguridad: headers ✅, API 403 ✅, secretos ✅. Pendientes: clave débil, PAYLOAD_DB_PUSH, 2FA.
- **2026-06-23** — Migración de datos de la DB de abril (Neon) a la nueva con script node+pg (SELECT→INSERT, ON CONFLICT id DO NOTHING, FKs a media anuladas). 5 proyectos + 12 miembros + 3 eventos. Visibles en vivo (páginas force-dynamic, sin redeploy).
- **2026-06-23** — Deploy a Vercel con DB Neon nueva (DATABASE_URI), PAYLOAD_SECRET, PAYLOAD_DB_PUSH=true (primer deploy). Build OK; /admin operativo en español.
- **2026-06-23** — Estado creado desde la plantilla; diagnóstico Fase 0 completado.
