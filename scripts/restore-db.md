# Restaurar la base de datos H2V desde un respaldo

> Los respaldos los genera a diario el workflow `.github/workflows/backup-db.yml`
> (GitHub → pestaña **Actions** → "Respaldo diario de la base de datos" → cada run tiene
> un artefacto `h2v-backup-AAAAMMDD-HHMMSS.sql.gz`). Retención: 90 días.

## Capas de protección (de menor a mayor desastre)
1. **"Deshice algo hace un rato"** → Neon tiene *point-in-time restore* de las últimas horas
   (retención de historial; consola Neon → Backup & Restore). No requiere estos dumps.
2. **"Se corrompió / borré datos hace días"** o **"perdí el proyecto Neon entero"** → usar el
   dump de GitHub Actions (esto es lo que hace durable el respaldo, independiente de Neon).

## Cómo restaurar un dump

### 1. Obtener el dump
- GitHub → **Actions** → workflow "Respaldo diario…" → abrir un run → sección **Artifacts** →
  descargar el `.zip`, descomprimir → queda `h2v-backup-AAAAMMDD-HHMMSS.sql.gz`.
- O por CLI: `gh run download <run-id> -R h2varaucania/h2v-araucania`

### 2. Elegir destino
Restaurar SIEMPRE en una base **vacía** (el dump trae los `CREATE TABLE`). Nunca encima de una
base con datos que quieras conservar. Opciones de destino:
- **Una rama nueva de Neon** (recomendado para probar sin tocar producción): consola Neon →
  Branches → crear rama → usar su cadena de conexión directa.
- Un Postgres 17 local (para inspeccionar): ver la prueba de restauración más abajo.

### 3. Restaurar
```bash
gunzip -k h2v-backup-AAAAMMDD-HHMMSS.sql.gz          # deja el .sql
psql "<CADENA_DIRECTA_DEL_DESTINO>" < h2v-backup-AAAAMMDD-HHMMSS.sql
```
Notas:
- Usar Postgres **17** y la cadena **directa** (sin `-pooler`).
- El dump se generó con `--no-owner --no-privileges`, así que no falla por diferencias de rol.
- Verificar después: `psql "<destino>" -c "SELECT count(*) FROM proyectos;"` etc.

## Prueba de restauración (validación local, sin tocar producción)
```bash
# 1) levantar un Postgres 17 efímero
docker run -d --name h2v-restore-test -e POSTGRES_PASSWORD=test postgres:17-alpine
# 2) restaurar el dump dentro
gzip -dc h2v-backup-AAAAMMDD-HHMMSS.sql.gz | docker exec -i h2v-restore-test psql -U postgres
# 3) verificar conteos
docker exec h2v-restore-test psql -U postgres -c \
  "SELECT 'proyectos' t, count(*) FROM proyectos UNION ALL SELECT 'miembros', count(*) FROM miembros UNION ALL SELECT 'eventos', count(*) FROM eventos;"
# 4) limpiar
docker rm -f h2v-restore-test
```

## Límites conocidos (honestos)
- Los artefactos de GitHub Actions se conservan **90 días**; los más antiguos se eliminan solos.
  Para archivado más largo o copia fuera de GitHub, subir el dump también a un bucket
  (p. ej. Vercel Blob, ya configurado) o a almacenamiento institucional. Requiere un paso extra
  en el workflow; pendiente si se decide.
- El dump contiene datos personales (correos de usuarios, hashes de contraseña). Los artefactos
  son privados (solo colaboradores del repo). No publicarlos.
