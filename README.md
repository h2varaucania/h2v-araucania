# Sitio web H2V Araucanía

Plataforma informativa del Bien Público "Empoderando a los sectores Agroforestal y Productivo con
Hidrógeno Verde" (CORFO 24BP-269085), del Programa Estratégico Regional de Hidrógeno Verde de La
Araucanía. Beneficiario: CODESSER. Coejecutor: Universidad de Talca. Se entrega a la SEREMI de
Energía de La Araucanía.

- Sitio: https://h2v-araucania.vercel.app · Panel de administración: `/admin`
- Next.js 16 + Payload CMS 3 (una sola aplicación), PostgreSQL en Neon, archivos en Vercel Blob,
  correos con Resend, alojado en Vercel. Cada cambio en `main` se publica solo.

## Qué documento leer

| Si usted... | Lea |
|---|---|
| Publica contenido en el panel | Manual de Usuario: `docs/manual-usuario/Manual_Usuario_H2V_Araucania.pdf` (o `.docx`) |
| Participa en el traspaso a la SEREMI | Protocolo de entrega: `docs/traspaso/Protocolo_Entrega_H2V_SEREMI.pdf` |
| Mantiene el sitio (cuentas, respaldos, dominio, actualizaciones) | Guía técnica: `docs/tecnico/Guia_Tecnica_H2V_Araucania.pdf` |
| Va a programar | Esta página, la Guía técnica y `AGENTS.md` |

Los documentos de `docs/archivo/` están reemplazados; se conservan solo como historia.

## Trabajar en local

Requisitos: Node 22, Docker y git.

```bash
cp .env.example .env            # valores locales, no los de producción
docker compose up -d postgres   # PostgreSQL local
npm ci
npm run dev                     # http://localhost:3000 y http://localhost:3000/admin
```

Antes de proponer un cambio: `npm run lint && npx tsc --noEmit && npm test && npm run build`
(lo mismo que corre GitHub en `.github/workflows/ci.yml`).

## Reglas que no se negocian

- Todo texto visible se edita en el panel (`docs/EDITABILIDAD_TOTAL.md`); el código solo lleva
  diseño y estructura.
- El esquema de la base cambia **solo** con migraciones (`src/migrations/`), que Vercel aplica al
  publicar (`vercel.json`). Nunca `PAYLOAD_DB_PUSH` ni SQL a mano en producción.
- Antes de publicar un cambio, sacar un respaldo: GitHub → Actions → "Respaldo diario de la base
  de datos" → Run workflow. Restaurar: `scripts/restore-db.md`. Archivos subidos:
  `scripts/respaldar-archivos.mjs`.
- Ninguna clave ni contraseña va al repositorio.
