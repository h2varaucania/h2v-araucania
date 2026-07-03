# Auditoría de traspaso — H2V Araucanía

> **Fecha:** 2026-07-03 · **Auditor:** Claude (sesión publicadora_web) · **Commit auditado:** a2b563d (producción)
> **Lente:** ¿puede esta web traspasarse a un administrador **no experto** (el "veterinario de la Seremi de Energía")
> que la administre solo vía `/admin`, sin programador y sin costo recurrente relevante?
> Método: dos barridos de código (frontend público y capa admin de Payload) + verificación contra producción viva
> (16/16 rutas HTTP 200, headers de seguridad presentes, API protegida con 403 sin sesión).

---

## 1. Veredicto sobre la arquitectura (la concepción)

**La concepción es correcta y no hay que cambiarla.** Un CMS headless (Payload) con panel `/admin` en
español + frontend Next.js + Postgres gestionado (Neon) + hosting gestionado (Vercel) es exactamente la
arquitectura que minimiza el costo de administración en conocimiento y dinero:

| Decisión de la concepción | Evaluación | Por qué |
|---|---|---|
| Contenido en DB editable vía `/admin` con clave | ✅ correcta | El no-experto edita formularios, nunca código |
| Panel en español, con descripciones de ayuda en **todos** los campos | ✅ correcta | Verificado: 8 colecciones y 14 globals, todos con labels ES y `admin.description` |
| Roles reales (admin/editor/registrado) con access control verificado | ✅ correcta | POST sin sesión → 403 en producción; registro público no puede autoasignarse rol |
| Guía de uso **dentro** del admin (global "📋 Guía de uso") | ✅ gran acierto | El manual vive donde el usuario lo necesita (hoy incompleta, ver F7) |
| Defaults de respaldo en código si el CMS está vacío | ✅ correcta | El sitio nunca se ve roto; el CMS siempre puede sobreescribir |
| Vercel Hobby + Neon Free | ✅ correcta | USD 0/mes; escala sobra para un sitio de difusión |
| Crédito Corfo fijo en código (no editable) | ✅ correcta | Obligación del Manual Corfo §1.2: nadie puede borrarlo por error |

**Alternativas descartadas con razón:** WordPress (mantención/seguridad más caras, plugins que se rompen),
sitio estático sin CMS (perdería el `/admin`, cada cambio pasaría por un programador), VPS/cPanel (este stack
necesita Node corriendo; cPanel no sirve y un VPS exige un sysadmin que no habrá).

**El gap NO es arquitectónico.** Es (a) una trampa de plataforma (uploads efímeros), (b) ~6 zonas de contenido
que quedaron fuera del CMS, y (c) operación (claves, 2FA, respaldo, guía). Todo corregible sin tocar el stack.

---

## 2. Hallazgos priorizados

### P0 — Bloquean el traspaso (resolver ANTES de entregar)

**F1. Los archivos subidos se pierden (disco efímero de Vercel).** `Media.ts` guarda en `public/uploads`
(disco local). En Vercel eso desaparece en el próximo deploy. **Ya ocurrió**: los PDFs de abril se perdieron.
Es una trampa silenciosa perfecta para un no-experto: sube un PDF, lo ve funcionando, y días después
desaparece "solo". *Fix:* adapter `@payloadcms/storage-vercel-blob` (Vercel Blob, tier gratuito de Hobby
cubre el volumen actual; verificar límites vigentes al activar). **Esfuerzo: 1–2 h. Sin esto NO se puede
traspasar.**

**F2. `PAYLOAD_DB_PUSH` sigue en Vercel.** Deja abierta la puerta a que un deploy altere el esquema de la
DB de producción. *Fix seguro (no a ciegas):* primero verificar en la DB Neon que la migración inicial figura
en `payload_migrations`; si no figura, registrarla; recién entonces quitar la variable y redeployar. Hacerlo
a ciegas puede tumbar el arranque (las migraciones intentarían recrear tablas existentes). **Esfuerzo: 15–30 min.**

**F3. Cadena de cuentas y claves (el traspaso real).** La clave admin sigue débil; sin 2FA en GitHub/Vercel/
Neon/Gmail. El correo `h2varaucania@gmail.com` es la llave maestra de todo. Traspasar la web ES traspasar
esta cadena de cuentas de forma ordenada (acta de la Fase 5 de la skill). **Esfuerzo: sesión de 1 h con el dueño.**

### P1 — Fricción diaria del no-experto (resolver en la semana del traspaso)

**F4. Contenido invisible en silencio.** Noticias y Eventos nacen con "Publicada" = false (`Noticias.ts:86`,
`Eventos.ts:86`). El error más probable del no-experto: crea la noticia, no marca la casilla, y el sitio no
la muestra sin ningún aviso. *Fix recomendado:* activar `versions + drafts` de Payload en Noticias/Eventos →
botones explícitos "Guardar borrador / Publicar" (UX correcta para no-expertos) e historial restaurable.
OJO: crea tablas nuevas → requiere migración coordinada con F2. *Fix mínimo alternativo:* default `true`.
**Esfuerzo: 1–2 h (drafts) o 5 min (default).**

**F5. Las páginas legales ignoran el CMS.** `/politica-privacidad` y `/accesibilidad` son 100% estáticas:
el email institucional está clavado 3 veces en código y la fecha dice "abril 2026". Si el administrador cambia
el email en `/admin` → Contacto, estas páginas quedan mintiendo. *Fix:* leerlas del global `contacto` (email)
y mover el texto legal a un global editable. **Esfuerzo: 1–2 h.**

**F6. Zonas sin campo CMS (requieren programador para cambiar una palabra):**
- `/proyectos`: título y subtítulo del hero clavados (`proyectos/page.tsx:45-47`). Única página editorial sin global. *Fix: global `pagina-proyectos`.* (45 min)
- `/programa/gobernanza`: el diagrama de estructura (SVG con cargos) y la galería "Evidencia de Actividades" ("Foto próximamente" ×4) están en código (`gobernanza/page.tsx:163-208`). Cuando cambie la gobernanza o lleguen fotos reales, hoy hay que programar. *Fix: campos en el global + collection de fotos.* (2–3 h)
- `/hidrogeno-verde`: tarjetas "Explora más" fijas (`page.tsx:198-203`). (30 min)

**F7. La Guía de uso cubre 5 de 22 tipos de contenido.** Excelente donde existe (Noticias, Documentos,
Proyectos, Miembros, Eventos), pero el resto de globals/páginas queda sin paso a paso (mitigado por las
descripciones por campo). *Fix:* completarla + advertencias operativas (qué pasa al borrar, qué es "Publicada",
qué hacer si te bloqueas en el login). **Esfuerzo: 1–2 h de redacción. Insumo directo de la Fase 4 (manual).**

**F8. Un "editor" puede tocar la configuración institucional.** Ningún global declara `access`, así que un
editor edita "Configuración General" y "Contacto" igual que un admin. Si el dueño delega "solo publicar
noticias", esa persona también puede cambiar el email institucional. *Fix:* `access.update: isAdmin` en
`sitio-general`, `contacto` y `guia-admin`. **Esfuerzo: 30 min.**

**F9. Borrado permanente al alcance del editor.** `delete: isAdminOrEditor` en todas las colecciones; sin
papelera. *Fix:* `delete: isAdmin` en colecciones de contenido + versions (F4) para restaurar ediciones.
**Esfuerzo: 15 min.**

### P2 — Robustez futura (deuda menor, no bloquea)

- **F10.** Feature flags de 9 secciones viven en `src/lib/features.ts` (código). Apagar una sección → 404 en links del menú y el no-experto no puede ni causarlo ni arreglarlo. Si algún día se quiere esa palanca, moverla a un global CMS. (2–3 h)
- **F11.** `categoriasColor` duplicado en 2 archivos; íconos/colores asignados por índice (categoría nueva → sin color hasta tocar código). (1 h)
- **F12.** `importMap.ts` placeholder vacío junto al `importMap.js` real: confusión servida para el próximo programador; borrarlo. El episodio "dashboard en blanco" está corregido (el importMap actual incluye `CollectionCards`), pero no hay check automático que impida que se repita. (15 min)
- **F13.** `maxLoginAttempts`/`lockTime` no declarados (corren defaults de Payload sin documentar). Declararlos + instrucción de desbloqueo en la Guía. (15 min)

### Verificado sin hallazgos
Links internos: **cero rotos** (Header, Footer, home, 404). Producción: 16/16 rutas 200, CSP/HSTS/X-Frame/
nosniff presentes, API de escritura 403 sin sesión. Franja de financiadores conforme Manual Corfo §1.2.

---

## 3. Plan de traspaso recomendado

| Orden | Qué | Hallazgos | Esfuerzo |
|---|---|---|---|
| 1 | Persistencia de uploads (Blob) + quitar `PAYLOAD_DB_PUSH` con verificación | F1, F2 | ~2 h |
| 2 | Respaldo automatizado + restauración probada (Fase 2 de la skill) | — | ~2 h |
| 3 | Cobertura CMS: legales, /proyectos, gobernanza, drafts, access, delete | F4–F9 | ~1 jornada |
| 4 | Guía de uso completa + manual de usuario (Fase 4) | F7 | ~2 h |
| 5 | Dominio propio `.cl` apuntado a Vercel (Fase 3) | — | trámite NIC + 30 min |
| 6 | Claves fuertes + 2FA + acta de traspaso de cuentas (Fases 1 y 5) | F3 | sesión con el dueño |

**Costo total de dejarla traspasable: ~2 jornadas de trabajo técnico una vez, USD 0/mes recurrente**
(+ dominio ~CLP 10.000/año, verificar en nic.cl). Después del traspaso, el no-experto administra el 100%
del contenido cotidiano sin tocar código, y el único evento que requiere programador es evolucionar el
sitio (secciones nuevas), no operarlo.

---

## 4. Registro

- Auditoría ejecutada con dos barridos paralelos de código + verificación de producción, sobre commit a2b563d.
- Este archivo es insumo directo de las Fases 1–5 del `Estado_publicacion.md`; los fixes de código pueden
  ejecutarse de inmediato sobre este repo.
