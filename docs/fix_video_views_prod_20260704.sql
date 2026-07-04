-- ════════════════════════════════════════════════════════════════════════
-- H2V Araucanía — Esquema de producción: colección `video_views`
-- Cierra el 2º indicador de usabilidad del Modelo de Sustentabilidad (pág. 5):
-- "tiempo de reproducción de los videos" y "# de visualizaciones".
--
-- Se aplica en Neon (push está APAGADO en producción). Calcado 1:1 de las
-- convenciones de la tabla `downloads` de la migración inicial.
-- Idempotente y transaccional.
-- ════════════════════════════════════════════════════════════════════════
BEGIN;

-- 1) Enum del campo `evento` (select play|fin)
DO $$ BEGIN
  CREATE TYPE enum_video_views_evento AS ENUM ('play', 'fin');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 2) Tabla
CREATE TABLE IF NOT EXISTS video_views (
    id integer NOT NULL,
    video_titulo character varying NOT NULL,
    video_key character varying NOT NULL,
    evento enum_video_views_evento NOT NULL,
    segundos_vistos numeric DEFAULT 0,
    session_id character varying,
    user_id integer,
    watched_at timestamp(3) with time zone NOT NULL,
    ip character varying,
    user_agent character varying,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);

-- 3) Secuencia del id
CREATE SEQUENCE IF NOT EXISTS video_views_id_seq
    AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE video_views_id_seq OWNED BY video_views.id;
ALTER TABLE ONLY video_views ALTER COLUMN id SET DEFAULT nextval('video_views_id_seq'::regclass);

-- 4) Primary key
DO $$ BEGIN
  ALTER TABLE ONLY video_views ADD CONSTRAINT video_views_pkey PRIMARY KEY (id);
EXCEPTION WHEN duplicate_table OR duplicate_object OR invalid_table_definition THEN NULL;
END $$;

-- 5) Índices (created_at, updated_at, user) como en `downloads`
CREATE INDEX IF NOT EXISTS video_views_created_at_idx ON video_views USING btree (created_at);
CREATE INDEX IF NOT EXISTS video_views_updated_at_idx ON video_views USING btree (updated_at);
CREATE INDEX IF NOT EXISTS video_views_user_idx ON video_views USING btree (user_id);

-- 6) FK del usuario
DO $$ BEGIN
  ALTER TABLE ONLY video_views
    ADD CONSTRAINT video_views_user_id_users_id_fk
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 7) Enganche a payload_locked_documents_rels (lo usa el admin; si falta, el
--    panel puede fallar al abrir la colección). Mismo patrón que downloads.
ALTER TABLE payload_locked_documents_rels ADD COLUMN IF NOT EXISTS video_views_id integer;
CREATE INDEX IF NOT EXISTS payload_locked_documents_rels_video_views_id_idx
    ON payload_locked_documents_rels USING btree (video_views_id);
DO $$ BEGIN
  ALTER TABLE ONLY payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_video_views_fk
    FOREIGN KEY (video_views_id) REFERENCES video_views(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

COMMIT;

-- Verificación rápida (correr aparte tras el COMMIT):
--   SELECT count(*) FROM video_views;                          -- debe dar 0
--   \d video_views                                             -- 12 columnas
--   SELECT column_name FROM information_schema.columns
--     WHERE table_name='payload_locked_documents_rels' AND column_name='video_views_id';
