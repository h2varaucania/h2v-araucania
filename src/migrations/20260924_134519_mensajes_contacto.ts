import { MigrateUpArgs, sql } from '@payloadcms/db-postgres';

// Colección `mensajes-contacto`: cada mensaje del formulario de Contacto queda guardado en el
// panel aunque el aviso por correo falle (antes se perdía en silencio).
// Generada con `payload migrate:create` y ENDURECIDA A MANO al estilo defensivo de la
// baseline y de 20260822_135326_mapa_kmz: IF NOT EXISTS en tabla/columna/índices y DO $$ …
// EXCEPTION WHEN duplicate_object en tipos y constraint, para que no falle si parte del
// esquema ya existe. Aditiva: no toca tablas con datos.

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DO $$ BEGIN
    CREATE TYPE "public"."enum_mensajes_contacto_asunto" AS ENUM('consulta', 'colaboracion', 'prensa', 'otro');
  EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_mensajes_contacto_estado_correo" AS ENUM('enviado', 'fallido', 'sin-configurar');
  EXCEPTION WHEN duplicate_object THEN null; END $$;

  CREATE TABLE IF NOT EXISTS "mensajes_contacto" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nombre" varchar NOT NULL,
  	"correo" varchar NOT NULL,
  	"asunto" "enum_mensajes_contacto_asunto" NOT NULL,
  	"mensaje" varchar NOT NULL,
  	"atendido" boolean DEFAULT false,
  	"estado_correo" "enum_mensajes_contacto_estado_correo",
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "mensajes_contacto_id" integer;

  DO $$ BEGIN
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_mensajes_contacto_fk" FOREIGN KEY ("mensajes_contacto_id") REFERENCES "public"."mensajes_contacto"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;

  CREATE INDEX IF NOT EXISTS "mensajes_contacto_updated_at_idx" ON "mensajes_contacto" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "mensajes_contacto_created_at_idx" ON "mensajes_contacto" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_mensajes_contacto_id_idx" ON "payload_locked_documents_rels" USING btree ("mensajes_contacto_id");`);
}

// down neutralizado a propósito (precedentes: 20260707_150000 y 20260822_135326). El down
// generado hacía DROP TABLE "mensajes_contacto" CASCADE, lo que en producción borraría los
// mensajes recibidos. No corremos `migrate:down` en producción; si alguna vez se necesita
// revertir, se hace a mano con un respaldo verificado.
export async function down(): Promise<void> {
  // Intencionalmente vacío: no destruir mensajes de los visitantes.
}
