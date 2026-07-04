# Plan de traspaso por fases — H2V Araucanía

> **Decisión de gobernanza (Carlos, 2026-07-04).** El sitio NO se entrega completo de inmediato.
> Se entrega en dos fases para evitar que un destinatario no experto colapse sin red de rescate:
> primero solo la administración de **contenido**; la **infraestructura** se transfiere recién
> tras ~6 meses de capacitación, momento en que el responsable de publicación cesa su
> responsabilidad ("me lavo las manos") mediante un acta final.

---

## Las dos capas (por qué se separan)

| Capa | Qué es | Quién la usa | Poder |
|---|---|---|---|
| **Contenido** | El panel `/admin` de Payload | El destinatario (Seremi) desde ya | Publicar/editar noticias, documentos, eventos, proyectos, páginas |
| **Infraestructura** | Correo central + Vercel + Neon + GitHub | Custodio técnico (Carlos/programa) por ahora | Redeploy, base de datos, dominio, borrar todo |

A un administrador no técnico se le entrega **solo la capa de contenido**. La de infraestructura son las
"llaves del edificio" y se entregan al final, con capacitación previa.

---

## FASE 1 — Ahora: solo contenido (en curso)

### Qué recibe el destinatario
- **Un usuario `/admin` propio con rol `editor`** (no admin). Con su nombre y correo, auditable y revocable.
- Con rol `editor` **puede**: crear y editar todo el contenido y los textos de las páginas; usar "Guardar
  borrador" / "Publicar cambios"; subir archivos.
- Con rol `editor` **NO puede** (red de seguridad): borrar contenido, borrar archivos, gestionar usuarios,
  ni cambiar la Configuración institucional (correo de contacto, código BP, footer). Esos quedan reservados
  al `admin`. → El no experto no puede romper nada catastrófico durante el aprendizaje.
- La **Guía de uso** (menú → 📋 Guía de uso) es su material de referencia dentro del propio panel.

### Qué retiene el programa (custodio técnico, Carlos)
- Cuenta `admin` del `/admin` (Carlos): `h2varaucania@gmail.com`.
- Las 4 llaves de infraestructura, con **2FA activo** y **códigos de respaldo guardados en el gestor
  institucional del programa** (no solo en un teléfono personal, para que un teléfono perdido ≠ bloqueo):
  1. Correo central `h2varaucania@gmail.com` (Google 2FA)
  2. Vercel (`h2varaucania-1077s-projects`)
  3. Neon (proyecto `neon-crimson-blanket`, entra por SSO de Google)
  4. GitHub (`h2varaucania`)

### Estado de la Fase 1
- [~] **Clave del `/admin`: se mantiene simple A PROPÓSITO** durante el poblado de contenido (Carlos la
      comparte con un ayudante para cargar noticias/documentos). Decisión de riesgo aceptada (2026-07-04):
      la clave del `/admin` es distinta de la del correo/infra (un acceso indebido solo alcanza el panel de
      contenido, no las llaves maestras), hay bloqueo por 5 intentos/10 min, y el contenido es versionado y
      respaldado. **Se cambia en la entrega, con protocolo de clave compartida** (ver Fase 2).
- [ ] **2FA en las 4 cuentas de infraestructura** (Google, Vercel, GitHub; Neon vía SSO de Google) +
      códigos de respaldo al gestor del programa. Lo ejecuta Carlos (requiere su teléfono). **Prioridad:**
      es la capa irrecuperable; blindarla es lo que hace aceptable dejar la clave del `/admin` simple.
- [ ] Usuario `editor` del destinatario: **EN ESPERA** — aún no hay persona designada en la Seremi.
- [ ] (Opcional) Usuario `editor` para el **ayudante** que puebla la página, en vez de compartir la clave
      de admin: le da acceso de carga sin exponer la cuenta admin, y se revoca al terminar.
- [ ] Entregar credenciales por canal seguro (gestor de contraseñas, nunca chat/mail plano).

---

## FASE 2 — En ~6 meses (meta: 2027-01-04): traspaso de infraestructura

Tras la capacitación, se transfiere la capa de infraestructura y Carlos cesa su responsabilidad.

### Precondiciones (capacitación cumplida)
- El destinatario opera el `/admin` con soltura (publica, edita, sube, restaura versiones) sin apoyo.
- La Seremi designa un **responsable técnico permanente** (o acepta un proveedor de mantención).
- Respaldo automatizado de la DB andando y **restauración probada al menos una vez** (Fase 2 de la skill).
- Dominio propio definido (Fase 3, opcional: `h2varaucania.cl`).

### Qué se transfiere y cómo
- Correo central: la Seremi cambia la clave y **reemite el 2FA en su dispositivo**; Carlos retira el suyo.
- Vercel / Neon / GitHub: por SSO del correo central quedan bajo la institución; o se transfiere la
  propiedad del proyecto/repo a una cuenta institucional.
- El destinatario `editor` se promueve a `admin` (o se crea el admin institucional).

### Cierre de responsabilidad ("lavado de manos")
- **Acta de traspaso** firmada (usar `acta_traspaso.plantilla.md` de la skill `publicadora_web`), que deja
  constancia de: qué se entregó, credenciales entregadas y por qué canal, estado del respaldo, y que a
  partir de la fecha la operación y sus consecuencias quedan a cargo de la institución.

---

## Reglas de credenciales (ambas fases)
- Nunca se comparten claves por chat ni correo en texto plano.
- Canal: gestor de contraseñas compartido, o entrega en persona.
- El 2FA de infraestructura vive donde el programa lo controle mientras sea custodio; se reemite al traspasar.

## Bitácora del plan
- **2026-07-04** — Carlos decide el traspaso por fases (contenido ahora, infra en ~6 meses tras capacitación).
  Motivo: entrega inmediata total colapsaría al destinatario no experto sin red de rescate.
