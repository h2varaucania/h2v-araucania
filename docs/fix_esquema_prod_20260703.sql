-- fix_v2: esquema faltante en producción (drafts F4 + globals nuevos + transparencia/mediateca de junio)
-- Fuente: pg_dump del esquema generado por Payload 3.80 (scratch local, mismo commit desplegado)
BEGIN;

-- 1) Enums faltantes
DO $$ BEGIN
CREATE TYPE public.enum__eventos_v_version_status AS ENUM (
    'draft',
    'published'
);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
CREATE TYPE public.enum__eventos_v_version_tipo AS ENUM (
    'seminario',
    'taller',
    'feria',
    'reunion',
    'capacitacion',
    'otro'
);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
CREATE TYPE public.enum__noticias_v_version_categoria AS ENUM (
    'seminario',
    'taller',
    'gobernanza',
    'acuerdo',
    'proyecto',
    'general'
);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
CREATE TYPE public.enum__noticias_v_version_status AS ENUM (
    'draft',
    'published'
);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
CREATE TYPE public.enum_eventos_status AS ENUM (
    'draft',
    'published'
);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
CREATE TYPE public.enum_noticias_status AS ENUM (
    'draft',
    'published'
);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
CREATE TYPE public.enum_pagina_h2v_explora_mas_enlace AS ENUM (
    '/hidrogeno-verde/sectores',
    '/hidrogeno-verde/capital-humano',
    '/hidrogeno-verde/hoja-de-ruta',
    '/hidrogeno-verde/marco-regulatorio',
    '/proyectos',
    '/recursos/documentos',
    '/noticias',
    '/contacto'
);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
CREATE TYPE public.enum_pagina_mediateca_recursos_tipo AS ENUM (
    'video',
    'infografia',
    'presentacion',
    'documento'
);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 2) Columnas faltantes en tablas existentes
ALTER TABLE public.eventos ADD COLUMN IF NOT EXISTS "_status" public.enum_eventos_status DEFAULT 'draft'::public.enum_eventos_status;
ALTER TABLE public.noticias ADD COLUMN IF NOT EXISTS "_status" public.enum_noticias_status DEFAULT 'draft'::public.enum_noticias_status;
ALTER TABLE public.pagina_gobernanza ADD COLUMN IF NOT EXISTS "diagrama_consejo" character varying DEFAULT 'Consejo de Dirección H2V'::character varying;
ALTER TABLE public.pagina_gobernanza ADD COLUMN IF NOT EXISTS "diagrama_comite" character varying DEFAULT 'Comité Consultivo'::character varying;
ALTER TABLE public.pagina_gobernanza ADD COLUMN IF NOT EXISTS "diagrama_unidad" character varying DEFAULT 'Unidad de Coordinación y Gestión'::character varying;

-- 3) Tablas faltantes (verbatim del dump, sin OWNER)
CREATE TABLE IF NOT EXISTS public._eventos_v (
    id integer NOT NULL,
    parent_id integer,
    version_titulo character varying,
    version_descripcion jsonb,
    version_fecha timestamp(3) with time zone,
    version_fecha_fin timestamp(3) with time zone,
    version_lugar character varying,
    version_tipo public.enum__eventos_v_version_tipo,
    version_imagen_id integer,
    version_url_inscripcion character varying,
    version_updated_at timestamp(3) with time zone,
    version_created_at timestamp(3) with time zone,
    version__status public.enum__eventos_v_version_status DEFAULT 'draft'::public.enum__eventos_v_version_status,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    latest boolean,
    autosave boolean
);
CREATE SEQUENCE IF NOT EXISTS public._eventos_v_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

CREATE TABLE IF NOT EXISTS public._noticias_v (
    id integer NOT NULL,
    parent_id integer,
    version_titulo character varying,
    version_slug character varying,
    version_extracto character varying,
    version_contenido jsonb,
    version_imagen_id integer,
    version_fecha timestamp(3) with time zone,
    version_categoria public.enum__noticias_v_version_categoria,
    version_updated_at timestamp(3) with time zone,
    version_created_at timestamp(3) with time zone,
    version__status public.enum__noticias_v_version_status DEFAULT 'draft'::public.enum__noticias_v_version_status,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    latest boolean,
    autosave boolean
);
CREATE SEQUENCE IF NOT EXISTS public._noticias_v_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

CREATE TABLE IF NOT EXISTS public.pagina_accesibilidad (
    id integer NOT NULL,
    hero_titulo character varying DEFAULT 'Accesibilidad'::character varying,
    hero_subtitulo character varying DEFAULT 'Nuestro compromiso con un sitio web accesible para todas las personas.'::character varying,
    contenido jsonb,
    updated_at timestamp(3) with time zone,
    created_at timestamp(3) with time zone
);
CREATE SEQUENCE IF NOT EXISTS public.pagina_accesibilidad_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

CREATE TABLE IF NOT EXISTS public.pagina_gobernanza_actividades (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    foto_id integer NOT NULL,
    titulo character varying
);

CREATE TABLE IF NOT EXISTS public.pagina_gobernanza_diagrama_equipos (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    nombre character varying NOT NULL
);

CREATE TABLE IF NOT EXISTS public.pagina_h2v_explora_mas (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    titulo character varying NOT NULL,
    descripcion character varying NOT NULL,
    enlace public.enum_pagina_h2v_explora_mas_enlace NOT NULL
);

CREATE TABLE IF NOT EXISTS public.pagina_mediateca (
    id integer NOT NULL,
    hero_titulo character varying DEFAULT 'Mediateca'::character varying,
    hero_subtitulo character varying DEFAULT 'Videos, infografías y material multimedia del programa.'::character varying,
    mensaje_vacio_titulo character varying DEFAULT 'Próximamente se publicará material multimedia.'::character varying,
    mensaje_vacio_subtitulo character varying DEFAULT 'Videos, infografías y presentaciones del programa se alojarán en esta sección.'::character varying,
    updated_at timestamp(3) with time zone,
    created_at timestamp(3) with time zone
);
CREATE SEQUENCE IF NOT EXISTS public.pagina_mediateca_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

CREATE TABLE IF NOT EXISTS public.pagina_mediateca_recursos (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    titulo character varying NOT NULL,
    tipo public.enum_pagina_mediateca_recursos_tipo DEFAULT 'video'::public.enum_pagina_mediateca_recursos_tipo,
    url character varying NOT NULL,
    descripcion character varying
);

CREATE TABLE IF NOT EXISTS public.pagina_privacidad (
    id integer NOT NULL,
    hero_titulo character varying DEFAULT 'Política de Privacidad'::character varying,
    hero_subtitulo character varying DEFAULT 'Protección de datos personales conforme a la legislación chilena.'::character varying,
    fecha_actualizacion character varying DEFAULT 'abril 2026'::character varying,
    contenido jsonb,
    updated_at timestamp(3) with time zone,
    created_at timestamp(3) with time zone
);
CREATE SEQUENCE IF NOT EXISTS public.pagina_privacidad_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

CREATE TABLE IF NOT EXISTS public.pagina_proyectos (
    id integer NOT NULL,
    hero_titulo character varying DEFAULT 'Mapa de Proyectos'::character varying,
    hero_subtitulo character varying DEFAULT 'Proyectos de hidrógeno verde en desarrollo y ejecución a nivel regional y nacional.'::character varying,
    updated_at timestamp(3) with time zone,
    created_at timestamp(3) with time zone
);
CREATE SEQUENCE IF NOT EXISTS public.pagina_proyectos_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

CREATE TABLE IF NOT EXISTS public.pagina_transparencia (
    id integer NOT NULL,
    hero_titulo character varying DEFAULT 'Transparencia'::character varying,
    hero_subtitulo character varying DEFAULT 'Rendición de cuentas y registro de actividades del programa.'::character varying,
    introduccion character varying DEFAULT 'El programa de Hidrógeno Verde de La Araucanía se compromete con la transparencia en la gestión de recursos públicos y la rendición de cuentas a la ciudadanía.'::character varying,
    updated_at timestamp(3) with time zone,
    created_at timestamp(3) with time zone
);
CREATE SEQUENCE IF NOT EXISTS public.pagina_transparencia_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

CREATE TABLE IF NOT EXISTS public.pagina_transparencia_items (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    titulo character varying NOT NULL,
    descripcion character varying NOT NULL,
    estado character varying DEFAULT 'Próximamente'::character varying
);

-- 3b) defaults de secuencia, PKs y FKs de las tablas nuevas
ALTER TABLE ONLY public._eventos_v ALTER COLUMN id SET DEFAULT nextval('public._eventos_v_id_seq'::regclass);
ALTER TABLE ONLY public._noticias_v ALTER COLUMN id SET DEFAULT nextval('public._noticias_v_id_seq'::regclass);
ALTER TABLE ONLY public.pagina_accesibilidad ALTER COLUMN id SET DEFAULT nextval('public.pagina_accesibilidad_id_seq'::regclass);
ALTER TABLE ONLY public.pagina_mediateca ALTER COLUMN id SET DEFAULT nextval('public.pagina_mediateca_id_seq'::regclass);
ALTER TABLE ONLY public.pagina_privacidad ALTER COLUMN id SET DEFAULT nextval('public.pagina_privacidad_id_seq'::regclass);
ALTER TABLE ONLY public.pagina_proyectos ALTER COLUMN id SET DEFAULT nextval('public.pagina_proyectos_id_seq'::regclass);
ALTER TABLE ONLY public.pagina_transparencia ALTER COLUMN id SET DEFAULT nextval('public.pagina_transparencia_id_seq'::regclass);
ALTER SEQUENCE public._eventos_v_id_seq OWNED BY public._eventos_v.id;
ALTER SEQUENCE public._noticias_v_id_seq OWNED BY public._noticias_v.id;
ALTER SEQUENCE public.pagina_accesibilidad_id_seq OWNED BY public.pagina_accesibilidad.id;
ALTER SEQUENCE public.pagina_mediateca_id_seq OWNED BY public.pagina_mediateca.id;
ALTER SEQUENCE public.pagina_privacidad_id_seq OWNED BY public.pagina_privacidad.id;
ALTER SEQUENCE public.pagina_proyectos_id_seq OWNED BY public.pagina_proyectos.id;
ALTER SEQUENCE public.pagina_transparencia_id_seq OWNED BY public.pagina_transparencia.id;
ALTER TABLE ONLY public._eventos_v ADD CONSTRAINT _eventos_v_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public._noticias_v ADD CONSTRAINT _noticias_v_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.pagina_accesibilidad ADD CONSTRAINT pagina_accesibilidad_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.pagina_gobernanza_actividades ADD CONSTRAINT pagina_gobernanza_actividades_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.pagina_gobernanza_diagrama_equipos ADD CONSTRAINT pagina_gobernanza_diagrama_equipos_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.pagina_h2v_explora_mas ADD CONSTRAINT pagina_h2v_explora_mas_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.pagina_mediateca ADD CONSTRAINT pagina_mediateca_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.pagina_mediateca_recursos ADD CONSTRAINT pagina_mediateca_recursos_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.pagina_privacidad ADD CONSTRAINT pagina_privacidad_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.pagina_proyectos ADD CONSTRAINT pagina_proyectos_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.pagina_transparencia_items ADD CONSTRAINT pagina_transparencia_items_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.pagina_transparencia ADD CONSTRAINT pagina_transparencia_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public._eventos_v ADD CONSTRAINT _eventos_v_parent_id_eventos_id_fk FOREIGN KEY (parent_id) REFERENCES public.eventos(id) ON DELETE SET NULL;
ALTER TABLE ONLY public._eventos_v ADD CONSTRAINT _eventos_v_version_imagen_id_media_id_fk FOREIGN KEY (version_imagen_id) REFERENCES public.media(id) ON DELETE SET NULL;
ALTER TABLE ONLY public._noticias_v ADD CONSTRAINT _noticias_v_parent_id_noticias_id_fk FOREIGN KEY (parent_id) REFERENCES public.noticias(id) ON DELETE SET NULL;
ALTER TABLE ONLY public._noticias_v ADD CONSTRAINT _noticias_v_version_imagen_id_media_id_fk FOREIGN KEY (version_imagen_id) REFERENCES public.media(id) ON DELETE SET NULL;
ALTER TABLE ONLY public.pagina_gobernanza_actividades ADD CONSTRAINT pagina_gobernanza_actividades_foto_id_media_id_fk FOREIGN KEY (foto_id) REFERENCES public.media(id) ON DELETE SET NULL;
ALTER TABLE ONLY public.pagina_gobernanza_actividades ADD CONSTRAINT pagina_gobernanza_actividades_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.pagina_gobernanza(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.pagina_gobernanza_diagrama_equipos ADD CONSTRAINT pagina_gobernanza_diagrama_equipos_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.pagina_gobernanza(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.pagina_h2v_explora_mas ADD CONSTRAINT pagina_h2v_explora_mas_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.pagina_h2v(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.pagina_mediateca_recursos ADD CONSTRAINT pagina_mediateca_recursos_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.pagina_mediateca(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.pagina_transparencia_items ADD CONSTRAINT pagina_transparencia_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.pagina_transparencia(id) ON DELETE CASCADE;

-- 4) Índices de tablas nuevas y de columnas nuevas
CREATE INDEX IF NOT EXISTS _eventos_v_autosave_idx ON public._eventos_v USING btree (autosave);
CREATE INDEX IF NOT EXISTS _eventos_v_created_at_idx ON public._eventos_v USING btree (created_at);
CREATE INDEX IF NOT EXISTS _eventos_v_latest_idx ON public._eventos_v USING btree (latest);
CREATE INDEX IF NOT EXISTS _eventos_v_parent_idx ON public._eventos_v USING btree (parent_id);
CREATE INDEX IF NOT EXISTS _eventos_v_updated_at_idx ON public._eventos_v USING btree (updated_at);
CREATE INDEX IF NOT EXISTS _eventos_v_version_version__status_idx ON public._eventos_v USING btree (version__status);
CREATE INDEX IF NOT EXISTS _eventos_v_version_version_created_at_idx ON public._eventos_v USING btree (version_created_at);
CREATE INDEX IF NOT EXISTS _eventos_v_version_version_imagen_idx ON public._eventos_v USING btree (version_imagen_id);
CREATE INDEX IF NOT EXISTS _eventos_v_version_version_updated_at_idx ON public._eventos_v USING btree (version_updated_at);
CREATE INDEX IF NOT EXISTS _noticias_v_autosave_idx ON public._noticias_v USING btree (autosave);
CREATE INDEX IF NOT EXISTS _noticias_v_created_at_idx ON public._noticias_v USING btree (created_at);
CREATE INDEX IF NOT EXISTS _noticias_v_latest_idx ON public._noticias_v USING btree (latest);
CREATE INDEX IF NOT EXISTS _noticias_v_parent_idx ON public._noticias_v USING btree (parent_id);
CREATE INDEX IF NOT EXISTS _noticias_v_updated_at_idx ON public._noticias_v USING btree (updated_at);
CREATE INDEX IF NOT EXISTS _noticias_v_version_version__status_idx ON public._noticias_v USING btree (version__status);
CREATE INDEX IF NOT EXISTS _noticias_v_version_version_created_at_idx ON public._noticias_v USING btree (version_created_at);
CREATE INDEX IF NOT EXISTS _noticias_v_version_version_imagen_idx ON public._noticias_v USING btree (version_imagen_id);
CREATE INDEX IF NOT EXISTS _noticias_v_version_version_slug_idx ON public._noticias_v USING btree (version_slug);
CREATE INDEX IF NOT EXISTS _noticias_v_version_version_updated_at_idx ON public._noticias_v USING btree (version_updated_at);
CREATE INDEX IF NOT EXISTS eventos__status_idx ON public.eventos USING btree (_status);
CREATE INDEX IF NOT EXISTS noticias__status_idx ON public.noticias USING btree (_status);
CREATE INDEX IF NOT EXISTS pagina_gobernanza_actividades_foto_idx ON public.pagina_gobernanza_actividades USING btree (foto_id);
CREATE INDEX IF NOT EXISTS pagina_gobernanza_actividades_order_idx ON public.pagina_gobernanza_actividades USING btree (_order);
CREATE INDEX IF NOT EXISTS pagina_gobernanza_actividades_parent_id_idx ON public.pagina_gobernanza_actividades USING btree (_parent_id);
CREATE INDEX IF NOT EXISTS pagina_gobernanza_diagrama_equipos_order_idx ON public.pagina_gobernanza_diagrama_equipos USING btree (_order);
CREATE INDEX IF NOT EXISTS pagina_gobernanza_diagrama_equipos_parent_id_idx ON public.pagina_gobernanza_diagrama_equipos USING btree (_parent_id);
CREATE INDEX IF NOT EXISTS pagina_h2v_explora_mas_order_idx ON public.pagina_h2v_explora_mas USING btree (_order);
CREATE INDEX IF NOT EXISTS pagina_h2v_explora_mas_parent_id_idx ON public.pagina_h2v_explora_mas USING btree (_parent_id);
CREATE INDEX IF NOT EXISTS pagina_mediateca_recursos_order_idx ON public.pagina_mediateca_recursos USING btree (_order);
CREATE INDEX IF NOT EXISTS pagina_mediateca_recursos_parent_id_idx ON public.pagina_mediateca_recursos USING btree (_parent_id);
CREATE INDEX IF NOT EXISTS pagina_transparencia_items_order_idx ON public.pagina_transparencia_items USING btree (_order);
CREATE INDEX IF NOT EXISTS pagina_transparencia_items_parent_id_idx ON public.pagina_transparencia_items USING btree (_parent_id);

-- 5) Los documentos existentes eran públicos: quedan publicados
UPDATE public.eventos SET "_status"='published';
UPDATE public.noticias SET "_status"='published';

COMMIT;