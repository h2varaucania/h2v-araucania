# Checklist de seguridad — H2V Araucanía (Fase 1)

> Estado verificado contra producción el 2026-06-23. Marca: ✅ hecho · ⬜ pendiente · ➖ no aplica.
> Cada ítem se verifica contra la fuente viva (comando o panel), no se asume.

## Acceso y claves
- [~] **Clave del admin** — se MANTIENE SIMPLE a propósito durante el poblado de contenido (decisión 2026-07-04, ver `Plan_de_traspaso.md`). Riesgo acotado: la clave del `/admin` ≠ la del correo/infra (un acceso indebido solo llega al panel de contenido); hay rate-limit 5/10min; contenido versionado y respaldado. **Se cambia en la entrega, con protocolo de clave compartida.** Mitigación real = 2FA en la capa de infraestructura (abajo).
- ⬜ **2FA en la infraestructura** — prioridad sobre la clave del /admin: es la capa irrecuperable (correo maestro, Vercel, Neon, GitHub). Lo activa Carlos con su teléfono mientras sea custodio.
- ✅ **Secretos fuera de git** — `.env`, `.env.local`, `.env.production` ignorados; solo `.env.example` (plantilla sin secretos) rastreado. Secretos viven en las Environment Variables de Vercel.
- ✅ **`PAYLOAD_DB_PUSH` quitado de Vercel** (2026-07-03) — eliminado del proyecto (Production y Preview). Nota: se comprobó que el push nunca aplicó diffs en runtime serverless; los cambios de esquema van por SQL en Neon (ver `docs/fix_esquema_prod_20260703.sql`).

## Roles y permisos (control de acceso REAL)
- ✅ **`access` por colección** — read público, create/update/delete admin/editor. Verificado: `POST /api/noticias` sin sesión → **403 "No tienes permiso"**.
- ✅ **`access.admin` del panel** — restringido a admin/editor (registrado no entra al panel).
- ✅ **Hook primer-usuario-admin** — el primer usuario se fuerza a admin (verificado en la creación del admin de producción).
- ✅ **Sanitización del registro público** — el rol del registro público se fuerza a `registrado`.

## Protección del panel
- ✅ **Rate-limit de login** — declarado explícito en `Users.ts` (2026-07-03): `maxLoginAttempts: 5`, `lockTime: 10 min`. Documentado en la Guía de uso ("si te bloqueas, espera 10 minutos").
- ✅ **Globals de configuración solo admin** (2026-07-03) — `sitio-general`, `contacto`, `guia-admin` con `update: isAdmin`; un editor ya no puede cambiar el email institucional.
- ✅ **Borrado solo admin** (2026-07-03) — `delete: isAdmin` en todas las colecciones (el borrado es permanente, sin papelera).
- ➖ **Password Protection de plataforma** — no aplica (sitio público de difusión; solo tendría sentido para staging).
- ➖ **IP allowlist** — no aplica (datos públicos; rompería el acceso legítimo).

## Headers de seguridad (verificados con `curl -I` en producción)
- ✅ **CSP** — `default-src 'self'` + orígenes acotados (GA, Mapbox); `frame-ancestors 'none'`, `base-uri 'self'`, `form-action 'self'`.
- ✅ **HSTS** — `max-age=63072000; includeSubDomains; preload`.
- ✅ **X-Frame-Options: DENY**.
- ✅ **X-Content-Type-Options: nosniff**.
- ✅ **Referrer-Policy: strict-origin-when-cross-origin**.
- ✅ **Permissions-Policy** — cámara/micrófono off, geolocalización self.
- ⬜ Confirmar nota A en https://securityheaders.com.

## Cuentas y 2FA
- ⬜ **2FA en GitHub** (h2varaucania) — verificar/activar.
- ⬜ **2FA en Vercel** (h2varaucania) — verificar/activar.
- ⬜ **2FA en el correo central** (h2varaucania@gmail.com) — la **llave maestra**; idealmente passkey/llave física.
- ✅ **Menor privilegio** — villalobosecon es colaborador del repo (no owner de org).

## Comprobaciones automáticas (rehacer tras cambios)
- ✅ `curl -I https://h2v-araucania.vercel.app` → headers presentes.
- ✅ `POST /api/noticias` sin sesión → 403.
- ⬜ 6 logins fallidos → cuenta bloqueada temporalmente.
- ✅ `.env` en `.gitignore` y ningún `.env` real rastreado.

## Resumen
El **código** ya viene sólido (headers A, access control real, secretos bien). Lo que falta es **operacional**: cambiar la clave débil (urgente), quitar `PAYLOAD_DB_PUSH`, activar 2FA, y opcionalmente declarar el rate-limit explícito. Ninguno cuesta dinero.
