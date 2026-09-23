import { MigrateUpArgs, sql } from '@payloadcms/db-postgres';

// Arregla "Crear nuevo" en Noticias y Eventos, que dejaba la página en blanco en producción.
//
// Causa: la base de producción se creó por push en junio, cuando noticias y eventos aún no
// tenían borradores; los campos obligatorios quedaron como columnas NOT NULL. Al activar el
// autoguardado, "Crear nuevo" inserta de inmediato un borrador vacío, Postgres lo rechaza
// ("null value in column titulo violates not-null constraint") y la vista muere en blanco.
// Ni la baseline (ADD COLUMN IF NOT EXISTS) ni docs/fix_esquema_prod_20260703.sql relajaron
// esas columnas. Con borradores, Payload valida lo obligatorio al PUBLICAR, no en la base.
//
// Lista obtenida comparando columna a columna una restauración de producción contra una base
// creada por las migraciones: son exactamente estas 10. Reproducido y verificado en una réplica.
// Idempotente: solo actúa si la columna existe y todavía es NOT NULL.

const COLUMNAS: Array<[string, string]> = [
  ['noticias', 'titulo'],
  ['noticias', 'slug'],
  ['noticias', 'extracto'],
  ['noticias', 'contenido'],
  ['noticias', 'imagen_id'],
  ['noticias', 'fecha'],
  ['eventos', 'titulo'],
  ['eventos', 'descripcion'],
  ['eventos', 'fecha'],
  ['eventos', 'lugar'],
];

export async function up({ db }: MigrateUpArgs): Promise<void> {
  for (const [tabla, columna] of COLUMNAS) {
    // Se consulta primero (con parámetros) y solo entonces se altera: dentro de un bloque
    // DO $$ Postgres no admite parámetros enlazados. Los nombres vienen de la lista fija de
    // arriba, nunca de datos, así que sql.raw es seguro.
    const res = await db.execute(sql`
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = ${tabla}
        AND column_name = ${columna} AND is_nullable = 'NO'
    `);
    const sigueNotNull = ((res as unknown as { rows?: unknown[] }).rows ?? []).length > 0;
    if (sigueNotNull) {
      await db.execute(sql.raw(`ALTER TABLE "public"."${tabla}" ALTER COLUMN "${columna}" DROP NOT NULL`));
    }
  }
}

// down neutralizado: volver a imponer NOT NULL fallaría en cuanto exista un borrador con
// campos vacíos, que es justamente el estado normal que esta migración habilita.
export async function down(): Promise<void> {
  // Intencionalmente vacío.
}
