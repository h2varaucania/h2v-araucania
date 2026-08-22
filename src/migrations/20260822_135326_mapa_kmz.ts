import { MigrateUpArgs, sql } from '@payloadcms/db-postgres';

// Mapa de proyectos con capas KMZ (docs/PLAN_MAPA_KMZ.md, F1).
// Generada con `payload migrate:create` y ENDURECIDA A MANO al estilo defensivo de
// la baseline: drizzle-kit 0.31.7 emite DDL pelado (CREATE TABLE/ADD COLUMN/ADD
// CONSTRAINT sin guardas) y en dev ya hubo push, en prod ya corrió la baseline; sin
// IF NOT EXISTS / DO $$ la migración fallaría en una base que ya tiene parte del
// esquema. Verificada contra base vacía y contra clon con esquema pre-existente.
// Aditiva: crea la colección `capas-geo`, la relación en `proyectos` y los campos
// del global `pagina-proyectos`. El `down` se deja neutralizado a propósito (ver abajo).

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DO $$ BEGIN
    CREATE TYPE "public"."enum_capas_geo_tipo" AS ENUM('proyecto', 'referencia');
  EXCEPTION WHEN duplicate_object THEN null; END $$;

  CREATE TABLE IF NOT EXISTS "capas_geo" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"titulo" varchar NOT NULL,
  	"descripcion" varchar,
  	"tipo" "enum_capas_geo_tipo" DEFAULT 'proyecto' NOT NULL,
  	"color" varchar,
  	"resumen_validacion" varchar,
  	"n_features" numeric,
  	"n_vertices" numeric,
  	"tipos_geometria" varchar,
  	"geojson" jsonb,
  	"bbox_min_lng" numeric,
  	"bbox_min_lat" numeric,
  	"bbox_max_lng" numeric,
  	"bbox_max_lat" numeric,
  	"centroide_lat" numeric,
  	"centroide_lng" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );

  CREATE TABLE IF NOT EXISTS "pagina_proyectos_etapas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"valor" varchar NOT NULL,
  	"etiqueta" varchar NOT NULL,
  	"color" varchar NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "pagina_proyectos_mapas_base" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"nombre" varchar NOT NULL,
  	"url_plantilla" varchar NOT NULL,
  	"atribucion" varchar NOT NULL,
  	"max_zoom" numeric DEFAULT 18,
  	"es_satelital" boolean DEFAULT false
  );

  ALTER TABLE "contacto" ALTER COLUMN "ejecutor1" SET DEFAULT 'CODESSER (Beneficiario) — Corporación de Desarrollo Social del Sector Rural';
  ALTER TABLE "contacto" ALTER COLUMN "ejecutor2" SET DEFAULT 'Universidad de Talca — Coejecutor';
  ALTER TABLE "pagina_quienes_somos" ALTER COLUMN "consejo_titulo" SET DEFAULT 'Comité Estratégico del Bien Público';
  ALTER TABLE "pagina_quienes_somos" ALTER COLUMN "consejo_descripcion" SET DEFAULT 'Instancia estratégica del proyecto, presidida por la entidad mandante (Seremi de Energía de La Araucanía) con vicepresidencia de CORFO. Sesiona periódicamente desde junio de 2025.';
  ALTER TABLE "pagina_gobernanza" ALTER COLUMN "nivel_estrategico_titulo" SET DEFAULT 'Comité Estratégico del Bien Público';

  ALTER TABLE "proyectos" ADD COLUMN IF NOT EXISTS "capa_id" integer;
  ALTER TABLE "proyectos" ADD COLUMN IF NOT EXISTS "mostrar_marcador" boolean DEFAULT true;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "capas_geo_id" integer;
  ALTER TABLE "pagina_proyectos" ADD COLUMN IF NOT EXISTS "textos_mapa_titulo_descargas" varchar DEFAULT 'Descargar los proyectos';
  ALTER TABLE "pagina_proyectos" ADD COLUMN IF NOT EXISTS "textos_mapa_ayuda_kmz" varchar DEFAULT 'Descarga los proyectos en formato KMZ y ábrelos en Google Earth para explorarlos en 3D.';
  ALTER TABLE "pagina_proyectos" ADD COLUMN IF NOT EXISTS "textos_mapa_boton_descargar_todo" varchar DEFAULT 'Descargar todos (KMZ)';
  ALTER TABLE "pagina_proyectos" ADD COLUMN IF NOT EXISTS "textos_mapa_boton_descargar_proyecto" varchar DEFAULT 'Descargar KMZ';
  ALTER TABLE "pagina_proyectos" ADD COLUMN IF NOT EXISTS "textos_mapa_boton_abrir_google_earth" varchar DEFAULT 'Abrir en Google Earth';
  ALTER TABLE "pagina_proyectos" ADD COLUMN IF NOT EXISTS "textos_mapa_boton_centrar" varchar DEFAULT 'Centrar mapa';
  ALTER TABLE "pagina_proyectos" ADD COLUMN IF NOT EXISTS "textos_mapa_etiqueta_ubicacion" varchar DEFAULT 'Ubicación';
  ALTER TABLE "pagina_proyectos" ADD COLUMN IF NOT EXISTS "textos_mapa_etiqueta_etapa" varchar DEFAULT 'Etapa';
  ALTER TABLE "pagina_proyectos" ADD COLUMN IF NOT EXISTS "textos_mapa_aria_control_capas" varchar DEFAULT 'Capas del mapa';
  ALTER TABLE "pagina_proyectos" ADD COLUMN IF NOT EXISTS "textos_mapa_texto_ver_proyecto" varchar DEFAULT 'Ver sitio del proyecto →';
  ALTER TABLE "pagina_proyectos" ADD COLUMN IF NOT EXISTS "textos_kml_nombre_documento" varchar DEFAULT 'Proyectos H2V Araucanía';
  ALTER TABLE "pagina_proyectos" ADD COLUMN IF NOT EXISTS "textos_kml_etiqueta_empresa" varchar DEFAULT 'Empresa';
  ALTER TABLE "pagina_proyectos" ADD COLUMN IF NOT EXISTS "textos_kml_etiqueta_etapa" varchar DEFAULT 'Etapa';
  ALTER TABLE "pagina_proyectos" ADD COLUMN IF NOT EXISTS "textos_kml_etiqueta_region" varchar DEFAULT 'Región';
  ALTER TABLE "pagina_proyectos" ADD COLUMN IF NOT EXISTS "textos_kml_etiqueta_capacidad" varchar DEFAULT 'Capacidad';
  ALTER TABLE "pagina_proyectos" ADD COLUMN IF NOT EXISTS "textos_kml_etiqueta_produccion" varchar DEFAULT 'Producción';
  ALTER TABLE "pagina_proyectos" ADD COLUMN IF NOT EXISTS "textos_kml_texto_ver_sitio" varchar DEFAULT 'Ver en el sitio H2V Araucanía';
  ALTER TABLE "pagina_proyectos" ADD COLUMN IF NOT EXISTS "textos_kml_texto_enlace_externo" varchar DEFAULT 'Sitio del proyecto';
  ALTER TABLE "pagina_proyectos" ADD COLUMN IF NOT EXISTS "textos_kml_licencia" varchar DEFAULT 'Datos: Programa H2V Araucanía. Cartografía referencial.';
  ALTER TABLE "pagina_proyectos" ADD COLUMN IF NOT EXISTS "textos_kml_nombre_network_link" varchar DEFAULT 'Proyectos H2V Araucanía';

  DO $$ BEGIN
    ALTER TABLE "pagina_proyectos_etapas" ADD CONSTRAINT "pagina_proyectos_etapas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pagina_proyectos"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN
    ALTER TABLE "pagina_proyectos_mapas_base" ADD CONSTRAINT "pagina_proyectos_mapas_base_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pagina_proyectos"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN
    ALTER TABLE "proyectos" ADD CONSTRAINT "proyectos_capa_id_capas_geo_id_fk" FOREIGN KEY ("capa_id") REFERENCES "public"."capas_geo"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_capas_geo_fk" FOREIGN KEY ("capas_geo_id") REFERENCES "public"."capas_geo"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;

  CREATE INDEX IF NOT EXISTS "capas_geo_updated_at_idx" ON "capas_geo" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "capas_geo_created_at_idx" ON "capas_geo" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "capas_geo_filename_idx" ON "capas_geo" USING btree ("filename");
  CREATE INDEX IF NOT EXISTS "pagina_proyectos_etapas_order_idx" ON "pagina_proyectos_etapas" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pagina_proyectos_etapas_parent_id_idx" ON "pagina_proyectos_etapas" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pagina_proyectos_mapas_base_order_idx" ON "pagina_proyectos_mapas_base" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pagina_proyectos_mapas_base_parent_id_idx" ON "pagina_proyectos_mapas_base" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "proyectos_capa_idx" ON "proyectos" USING btree ("capa_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_capas_geo_id_idx" ON "payload_locked_documents_rels" USING btree ("capas_geo_id");`);
}

// down neutralizado a propósito (precedente: 20260707_150000). El down generado por
// drizzle hacía DROP TABLE "capas_geo"/... CASCADE, lo que en producción borraría las
// capas que el administrador ya cargó. No corremos `migrate:down` en producción (solo
// migrate-in-build hacia adelante); si alguna vez se necesita revertir, se hace a mano
// con un respaldo verificado. Ver docs/PLAN_MAPA_KMZ.md §6.
export async function down(): Promise<void> {
  // Intencionalmente vacío: no destruir datos del dueño.
}
