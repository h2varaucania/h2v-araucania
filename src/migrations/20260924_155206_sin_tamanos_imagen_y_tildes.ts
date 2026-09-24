import { MigrateUpArgs, sql } from '@payloadcms/db-postgres';

// Dos cambios del 24-09-2026:
//
// 1) Media sin tamaños derivados (imageSizes). Con addRandomSuffix en el plugin de Vercel Blob,
//    cada tamaño subido pisaba el nombre del original y el sitio servía una versión recortada.
//    `payload migrate:create` generó DROP de las 18 columnas sizes_* y sus 3 índices; se QUITAN
//    a propósito: son metadatos derivados, pero borrar columnas es irreversible y no hace falta.
//    Quedan huérfanas (nulas en los registros nuevos); Payload ya no las lee ni las escribe.
//
// 2) Título de la sección de noticias de la portada con tilde. El texto vive en tres lugares
//    (código, defaultValue del global y fila de la base): el código ya se corrigió; aquí se
//    corrigen el DEFAULT de la columna y el valor guardado, SOLO si sigue siendo el original sin
//    tilde (si alguien lo personalizó en el panel, no se toca).

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DO $$ BEGIN
    ALTER TABLE "pagina_inicio" ALTER COLUMN "seccion_noticias_titulo" SET DEFAULT 'Últimas Noticias';
  EXCEPTION WHEN undefined_column OR undefined_table THEN null; END $$;

  DO $$ BEGIN
    UPDATE "pagina_inicio" SET "seccion_noticias_titulo" = 'Últimas Noticias'
    WHERE "seccion_noticias_titulo" = 'Ultimas Noticias';
  EXCEPTION WHEN undefined_column OR undefined_table THEN null; END $$;`);
}

// down neutralizado a propósito (precedentes: 20260707_150000 y 20260822_135326): no se
// corre migrate:down en producción, y volver a quitar la tilde no tiene sentido.
export async function down(): Promise<void> {
  // Intencionalmente vacío.
}
