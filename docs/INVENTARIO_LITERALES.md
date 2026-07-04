# Inventario de literales JSX (EDITABILIDAD_TOTAL §8.1) — 2026-07-04

Auditoría: `grep -rnoE '>[A-ZÁÉÍÓÚÑa-z][^<>{}]{8,}<' "src/app/(frontend)" src/components`
Punto de partida: **117 literales en 22 archivos**.

## Hecho en la ola 1 (commit 240b3a5)
| Página/componente | Estado |
|---|---|
| `contacto/page.tsx` + `ContactForm` | ✅ CERO literales (piloto vertical: 27 campos, tabs, array de asuntos) |
| `page.tsx` (home) | ✅ eyebrow, KPIs (array), kickers, títulos de secciones y logos |
| `Footer` | ✅ títulos de columnas, leyenda de apoyo, derechos |
| `not-found` (404 frontend) | ✅ título, texto y botones |
| quienes-somos (títulos del Comité) | ✅ vía campos existentes + defaults |

## Pendiente (destino asignado; trabajar página por página)
| Archivo | Literales | Destino |
|---|---|---|
| `accesibilidad/page.tsx` | 18 | Son FALLBACKS de un global ya editable → mover a `content/defaults/legales.ts` |
| `politica-privacidad/page.tsx` | 13 | Ídem legales |
| `programa/gobernanza/page.tsx` | 13 | Campos nuevos en `PaginaGobernanza` (títulos de secciones, etiquetas del diagrama) |
| `RegisterForm` / `LoginForm` | 9 | Grupo "Cuentas" en `SitioGeneral` (etiquetas y mensajes) |
| `hidrogeno-verde/page.tsx` | 7 | Títulos de secciones → `PaginaH2V` |
| `quienes-somos/page.tsx` | 6 | Títulos "Instituciones Participantes"/"Unidad de Coordinación" → campos nuevos |
| `ProyectosMap` | 5 | Etiquetas de UI del mapa → `PaginaProyectos` |
| `comunidad` / `capital-humano` | 8 | Títulos de bloques → sus globals |
| `noticias` / `eventos` / `documentos` / `sectores` / `marco-regulatorio` | 9 | Títulos/etiquetas → sus globals |
| `SearchDialog` | 2 | Placeholder y vacío → `SitioGeneral` |
| `registro` / `login` páginas | 4 | Junto con los forms |

Regla: cada página nueva = defaults verbatim → campos (+tabs) → `t()/list()` →
migración pareada (o solo código si el campo ya existe) → commit con suite verde.

## Pendientes de infraestructura (checklist §9)
- [ ] Resend (email adapter): instalar `@payloadcms/email-resend`, configurar
      condicional a `RESEND_API_KEY`, probar reset de clave. SIN esto, "olvidé
      mi clave" no envía correo (el warning sale en el log del build).
- [ ] `tabs` en los globals grandes restantes (patrón: `Contacto.ts`).
- [ ] Paso a estático + revalidación (los hooks ya están cableados).
