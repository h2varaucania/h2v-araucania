import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    -- ============================================================
    -- H2V Araucanía — Initial Migration
    -- Generated: 2026-04-02
    -- ============================================================

    -- ============ PAYLOAD INTERNAL: MIGRATIONS TABLE ============
    -- Required FIRST: migrate() records each migration in this table
    -- within the same transaction. Without it, the INSERT fails and
    -- the entire transaction (all 45 tables) rolls back.
    CREATE TABLE IF NOT EXISTS payload_migrations (
        id serial PRIMARY KEY,
        name varchar,
        batch numeric,
        updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
        created_at timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    CREATE INDEX IF NOT EXISTS payload_migrations_created_at_idx ON payload_migrations USING btree (created_at);
    CREATE INDEX IF NOT EXISTS payload_migrations_updated_at_idx ON payload_migrations USING btree (updated_at);

    -- ======================== ENUMS =============================
    CREATE TYPE enum_documentos_tipo AS ENUM (
        'tecnico',
        'difusion',
        'regulatorio',
        'capacitacion'
    );
    CREATE TYPE enum_eventos_tipo AS ENUM (
        'seminario',
        'taller',
        'feria',
        'reunion',
        'capacitacion',
        'otro'
    );
    CREATE TYPE enum_miembros_instancia AS ENUM (
        'consejo',
        'comite',
        'unidad'
    );
    CREATE TYPE enum_noticias_categoria AS ENUM (
        'seminario',
        'taller',
        'gobernanza',
        'acuerdo',
        'proyecto',
        'general'
    );
    CREATE TYPE enum_proyectos_etapa AS ENUM (
        'planificacion',
        'pilotaje',
        'desarrollo',
        'operacion'
    );
    CREATE TYPE enum_proyectos_region AS ENUM (
        'araucania',
        'nacional'
    );
    CREATE TYPE enum_users_role AS ENUM (
        'admin',
        'editor',
        'registrado'
    );

    -- ======================== TABLES ============================
    CREATE TABLE contacto (
        id integer NOT NULL,
        email character varying DEFAULT 'h2varaucania@gmail.com'::character varying NOT NULL,
        ubicacion character varying DEFAULT 'Temuco, Región de La Araucanía, Chile'::character varying,
        telefono character varying,
        ejecutor1 character varying DEFAULT 'CODESSER — Corporación de Desarrollo Social del Sector Rural'::character varying,
        ejecutor2 character varying DEFAULT 'Universidad de Talca — Co-ejecutor técnico'::character varying,
        mandante character varying DEFAULT 'Subsecretaría de Energía — Ministerio de Energía'::character varying,
        codigo_b_p character varying DEFAULT 'Bien Público 24BP-269085'::character varying,
        updated_at timestamp(3) with time zone,
        created_at timestamp(3) with time zone
    );
    CREATE SEQUENCE contacto_id_seq
        AS integer
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;
    ALTER SEQUENCE contacto_id_seq OWNED BY contacto.id;

    CREATE TABLE documentos (
        id integer NOT NULL,
        titulo character varying NOT NULL,
        descripcion character varying NOT NULL,
        archivo_id integer NOT NULL,
        thumbnail_id integer,
        tipo enum_documentos_tipo NOT NULL,
        anio numeric NOT NULL,
        descargas numeric DEFAULT 0,
        updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
        created_at timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    CREATE SEQUENCE documentos_id_seq
        AS integer
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;
    ALTER SEQUENCE documentos_id_seq OWNED BY documentos.id;

    CREATE TABLE downloads (
        id integer NOT NULL,
        documento_id integer NOT NULL,
        user_id integer,
        downloaded_at timestamp(3) with time zone NOT NULL,
        ip character varying,
        user_agent character varying,
        updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
        created_at timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    CREATE SEQUENCE downloads_id_seq
        AS integer
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;
    ALTER SEQUENCE downloads_id_seq OWNED BY downloads.id;

    CREATE TABLE eventos (
        id integer NOT NULL,
        titulo character varying NOT NULL,
        descripcion jsonb NOT NULL,
        fecha timestamp(3) with time zone NOT NULL,
        fecha_fin timestamp(3) with time zone,
        lugar character varying NOT NULL,
        tipo enum_eventos_tipo,
        imagen_id integer,
        url_inscripcion character varying,
        publicado boolean DEFAULT false,
        updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
        created_at timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    CREATE SEQUENCE eventos_id_seq
        AS integer
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;
    ALTER SEQUENCE eventos_id_seq OWNED BY eventos.id;

    CREATE TABLE guia_admin (
        id integer NOT NULL,
        instrucciones jsonb,
        guia_completa character varying,
        updated_at timestamp(3) with time zone,
        created_at timestamp(3) with time zone
    );
    CREATE SEQUENCE guia_admin_id_seq
        AS integer
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;
    ALTER SEQUENCE guia_admin_id_seq OWNED BY guia_admin.id;

    CREATE TABLE media (
        id integer NOT NULL,
        alt character varying NOT NULL,
        updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
        created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
        url character varying,
        thumbnail_u_r_l character varying,
        filename character varying,
        mime_type character varying,
        filesize numeric,
        width numeric,
        height numeric,
        focal_x numeric,
        focal_y numeric,
        sizes_thumbnail_url character varying,
        sizes_thumbnail_width numeric,
        sizes_thumbnail_height numeric,
        sizes_thumbnail_mime_type character varying,
        sizes_thumbnail_filesize numeric,
        sizes_thumbnail_filename character varying,
        sizes_card_url character varying,
        sizes_card_width numeric,
        sizes_card_height numeric,
        sizes_card_mime_type character varying,
        sizes_card_filesize numeric,
        sizes_card_filename character varying,
        sizes_hero_url character varying,
        sizes_hero_width numeric,
        sizes_hero_height numeric,
        sizes_hero_mime_type character varying,
        sizes_hero_filesize numeric,
        sizes_hero_filename character varying
    );
    CREATE SEQUENCE media_id_seq
        AS integer
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;
    ALTER SEQUENCE media_id_seq OWNED BY media.id;

    CREATE TABLE miembros (
        id integer NOT NULL,
        nombre character varying NOT NULL,
        cargo character varying NOT NULL,
        institucion character varying NOT NULL,
        instancia enum_miembros_instancia NOT NULL,
        foto_id integer,
        aporte character varying,
        suplente character varying,
        orden numeric DEFAULT 0,
        updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
        created_at timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    CREATE SEQUENCE miembros_id_seq
        AS integer
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;
    ALTER SEQUENCE miembros_id_seq OWNED BY miembros.id;

    CREATE TABLE noticias (
        id integer NOT NULL,
        titulo character varying NOT NULL,
        slug character varying NOT NULL,
        extracto character varying NOT NULL,
        contenido jsonb NOT NULL,
        imagen_id integer NOT NULL,
        fecha timestamp(3) with time zone NOT NULL,
        categoria enum_noticias_categoria,
        publicado boolean DEFAULT false,
        updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
        created_at timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    CREATE SEQUENCE noticias_id_seq
        AS integer
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;
    ALTER SEQUENCE noticias_id_seq OWNED BY noticias.id;

    CREATE TABLE pagina_capital_humano (
        id integer NOT NULL,
        hero_titulo character varying DEFAULT 'Capital Humano'::character varying,
        hero_subtitulo character varying DEFAULT 'Formación y desarrollo de competencias para la industria del hidrógeno verde en La Araucanía.'::character varying,
        introduccion jsonb,
        nota_oportunidad jsonb,
        updated_at timestamp(3) with time zone,
        created_at timestamp(3) with time zone
    );
    CREATE SEQUENCE pagina_capital_humano_id_seq
        AS integer
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;
    ALTER SEQUENCE pagina_capital_humano_id_seq OWNED BY pagina_capital_humano.id;

    CREATE TABLE pagina_capital_humano_perfiles (
        _order integer NOT NULL,
        _parent_id integer NOT NULL,
        id character varying NOT NULL,
        texto character varying NOT NULL
    );
    CREATE TABLE pagina_capital_humano_programas (
        _order integer NOT NULL,
        _parent_id integer NOT NULL,
        id character varying NOT NULL,
        texto character varying NOT NULL
    );

    CREATE TABLE pagina_comunidad (
        id integer NOT NULL,
        hero_titulo character varying DEFAULT 'Comunidad y Participación'::character varying,
        hero_subtitulo character varying DEFAULT 'El desarrollo del hidrógeno verde en La Araucanía se construye con la participación activa de las comunidades y actores territoriales.'::character varying,
        introduccion jsonb,
        participacion_titulo character varying DEFAULT 'Participación en gobernanza'::character varying,
        compromisos_titulo character varying DEFAULT 'Compromiso con el territorio'::character varying,
        updated_at timestamp(3) with time zone,
        created_at timestamp(3) with time zone
    );
    CREATE TABLE pagina_comunidad_compromisos_items (
        _order integer NOT NULL,
        _parent_id integer NOT NULL,
        id character varying NOT NULL,
        texto character varying NOT NULL
    );
    CREATE TABLE pagina_comunidad_glosario (
        _order integer NOT NULL,
        _parent_id integer NOT NULL,
        id character varying NOT NULL,
        mapudungun character varying NOT NULL,
        espanol character varying NOT NULL
    );
    CREATE SEQUENCE pagina_comunidad_id_seq
        AS integer
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;
    ALTER SEQUENCE pagina_comunidad_id_seq OWNED BY pagina_comunidad.id;

    CREATE TABLE pagina_comunidad_participacion_items (
        _order integer NOT NULL,
        _parent_id integer NOT NULL,
        id character varying NOT NULL,
        texto character varying NOT NULL
    );

    CREATE TABLE pagina_gobernanza (
        id integer NOT NULL,
        hero_titulo character varying DEFAULT 'Modelo de Gobernanza'::character varying,
        hero_subtitulo character varying DEFAULT 'Estructura de dirección, gestión y control del programa para garantizar transparencia, eficiencia y sostenibilidad.'::character varying,
        descripcion character varying DEFAULT 'El modelo de gobernanza del programa se divide en dos niveles — estratégico y operativo — para asegurar una gestión integral y sostenible del proyecto.'::character varying,
        nivel_estrategico_titulo character varying DEFAULT 'Consejo de Dirección del Hidrógeno Verde de Araucanía'::character varying,
        nivel_estrategico_descripcion character varying DEFAULT 'Instancia máxima de dirección estratégica compuesta por representantes del Gobierno Regional, Ministerios, universidades, asociaciones empresariales, comunidades indígenas y expertos independientes.'::character varying,
        nivel_estrategico_periodicidad character varying DEFAULT 'Trimestralmente — Presencial y/o videoconferencia'::character varying,
        nivel_operativo_titulo character varying DEFAULT 'Unidad de Coordinación y Gestión del Proyecto'::character varying,
        nivel_operativo_descripcion character varying DEFAULT 'Compuesta por el Director del proyecto, equipo técnico, equipo de gestión financiera y equipo de comunicación y participación comunitaria.'::character varying,
        nivel_operativo_periodicidad character varying DEFAULT 'Cada 15 días — Presencial y/o videoconferencia'::character varying,
        updated_at timestamp(3) with time zone,
        created_at timestamp(3) with time zone
    );
    CREATE SEQUENCE pagina_gobernanza_id_seq
        AS integer
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;
    ALTER SEQUENCE pagina_gobernanza_id_seq OWNED BY pagina_gobernanza.id;

    CREATE TABLE pagina_gobernanza_nivel_estrategico_funciones (
        _order integer NOT NULL,
        _parent_id integer CONSTRAINT pagina_gobernanza_nivel_estrategico_funcion__parent_id_not_null NOT NULL,
        id character varying NOT NULL,
        texto character varying NOT NULL
    );
    CREATE TABLE pagina_gobernanza_nivel_operativo_funciones (
        _order integer NOT NULL,
        _parent_id integer NOT NULL,
        id character varying NOT NULL,
        texto character varying NOT NULL
    );

    CREATE TABLE pagina_h2v (
        id integer NOT NULL,
        hero_titulo character varying DEFAULT 'Hidrógeno Verde'::character varying,
        hero_subtitulo character varying DEFAULT 'El hidrógeno verde es un vector energético producido mediante electrólisis del agua utilizando energías renovables. No genera emisiones de CO2 y es clave para la descarbonización de la economía.'::character varying,
        que_es_titulo character varying DEFAULT '¿Qué es el Hidrógeno Verde?'::character varying,
        que_es_contenido jsonb,
        electrolisis_titulo character varying DEFAULT 'Proceso de Electrólisis'::character varying,
        updated_at timestamp(3) with time zone,
        created_at timestamp(3) with time zone
    );
    CREATE TABLE pagina_h2v_cadena_valor (
        _order integer NOT NULL,
        _parent_id integer NOT NULL,
        id character varying NOT NULL,
        titulo character varying NOT NULL,
        descripcion character varying NOT NULL,
        icono character varying
    );
    CREATE TABLE pagina_h2v_derivados (
        _order integer NOT NULL,
        _parent_id integer NOT NULL,
        id character varying NOT NULL,
        nombre character varying NOT NULL,
        descripcion character varying NOT NULL,
        aplicacion character varying
    );
    CREATE TABLE pagina_h2v_electrolisis_pasos (
        _order integer NOT NULL,
        _parent_id integer NOT NULL,
        id character varying NOT NULL,
        titulo character varying NOT NULL,
        descripcion character varying NOT NULL
    );
    CREATE TABLE pagina_h2v_electrolizadores (
        _order integer NOT NULL,
        _parent_id integer NOT NULL,
        id character varying NOT NULL,
        nombre character varying NOT NULL,
        descripcion character varying NOT NULL,
        madurez character varying,
        costo character varying
    );
    CREATE SEQUENCE pagina_h2v_id_seq
        AS integer
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;
    ALTER SEQUENCE pagina_h2v_id_seq OWNED BY pagina_h2v.id;

    CREATE TABLE pagina_hoja_ruta (
        id integer NOT NULL,
        hero_titulo character varying DEFAULT 'Hoja de Ruta'::character varying,
        hero_subtitulo character varying DEFAULT 'Estrategia regional para el desarrollo del hidrógeno verde en La Araucanía, horizonte 2024-2050.'::character varying,
        nota_final character varying DEFAULT 'La Hoja de Ruta detallada se publicará como documento descargable una vez completado el proceso de diagnóstico regional.'::character varying,
        updated_at timestamp(3) with time zone,
        created_at timestamp(3) with time zone
    );
    CREATE TABLE pagina_hoja_ruta_hitos (
        _order integer NOT NULL,
        _parent_id integer NOT NULL,
        id character varying NOT NULL,
        periodo character varying NOT NULL,
        titulo character varying NOT NULL,
        descripcion character varying NOT NULL
    );
    CREATE SEQUENCE pagina_hoja_ruta_id_seq
        AS integer
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;
    ALTER SEQUENCE pagina_hoja_ruta_id_seq OWNED BY pagina_hoja_ruta.id;

    CREATE TABLE pagina_inicio (
        id integer NOT NULL,
        hero_titulo character varying DEFAULT 'Hidrógeno Verde en La Araucanía'::character varying NOT NULL,
        hero_subtitulo character varying DEFAULT 'Plataforma informativa sobre los avances, proyectos y oportunidades del hidrógeno verde en la región de La Araucanía, Chile.'::character varying NOT NULL,
        hero_cta_primario character varying DEFAULT 'Conozca el Programa'::character varying,
        hero_cta_secundario character varying DEFAULT 'Ver Proyectos en el Mapa'::character varying,
        seccion_explora_titulo character varying DEFAULT 'Explora el Programa'::character varying,
        updated_at timestamp(3) with time zone,
        created_at timestamp(3) with time zone
    );
    CREATE SEQUENCE pagina_inicio_id_seq
        AS integer
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;
    ALTER SEQUENCE pagina_inicio_id_seq OWNED BY pagina_inicio.id;

    CREATE TABLE pagina_inicio_seccion_explora_cards (
        _order integer NOT NULL,
        _parent_id integer NOT NULL,
        id character varying NOT NULL,
        titulo character varying NOT NULL,
        descripcion character varying NOT NULL,
        enlace character varying NOT NULL
    );

    CREATE TABLE pagina_marco_regulatorio (
        id integer NOT NULL,
        hero_titulo character varying DEFAULT 'Marco Regulatorio'::character varying,
        hero_subtitulo character varying DEFAULT 'Normativa, políticas y lineamientos para el desarrollo del hidrógeno verde en Chile.'::character varying,
        updated_at timestamp(3) with time zone,
        created_at timestamp(3) with time zone
    );
    CREATE TABLE pagina_marco_regulatorio_documentos (
        _order integer NOT NULL,
        _parent_id integer NOT NULL,
        id character varying NOT NULL,
        titulo character varying NOT NULL,
        descripcion character varying NOT NULL,
        relevancia character varying
    );
    CREATE SEQUENCE pagina_marco_regulatorio_id_seq
        AS integer
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;
    ALTER SEQUENCE pagina_marco_regulatorio_id_seq OWNED BY pagina_marco_regulatorio.id;

    CREATE TABLE pagina_quienes_somos (
        id integer NOT NULL,
        hero_titulo character varying DEFAULT 'Quiénes Somos'::character varying,
        hero_subtitulo character varying DEFAULT 'El Programa Estratégico Regional de Hidrógeno Verde de La Araucanía impulsa el crecimiento socioeconómico regional mediante tecnologías de hidrógeno verde.'::character varying,
        bien_publico_titulo character varying DEFAULT 'El Bien Público'::character varying,
        bien_publico_contenido jsonb NOT NULL,
        consejo_titulo character varying DEFAULT 'Consejo de Dirección del Hidrógeno Verde de Araucanía'::character varying,
        consejo_descripcion character varying DEFAULT 'Instancia estratégica encargada de definir la visión, aprobar planes de desarrollo y supervisar el progreso del proyecto.'::character varying,
        comite_titulo character varying DEFAULT 'Comité Consultivo Técnico Científico'::character varying,
        comite_descripcion character varying DEFAULT 'Integrado por miembros de la sociedad civil, ONGs y otros actores relevantes para fiscalizar y transparentar el desarrollo del proyecto.'::character varying,
        updated_at timestamp(3) with time zone,
        created_at timestamp(3) with time zone
    );
    CREATE SEQUENCE pagina_quienes_somos_id_seq
        AS integer
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;
    ALTER SEQUENCE pagina_quienes_somos_id_seq OWNED BY pagina_quienes_somos.id;

    CREATE TABLE pagina_quienes_somos_instituciones (
        _order integer NOT NULL,
        _parent_id integer NOT NULL,
        id character varying NOT NULL,
        nombre character varying NOT NULL,
        rol character varying NOT NULL,
        logo_id integer
    );

    CREATE TABLE pagina_sectores (
        id integer NOT NULL,
        hero_titulo character varying DEFAULT 'Sectores Productivos'::character varying,
        hero_subtitulo character varying DEFAULT 'Sectores de La Araucanía con potencial de integración del hidrógeno verde para su desarrollo sostenible.'::character varying,
        updated_at timestamp(3) with time zone,
        created_at timestamp(3) with time zone
    );
    CREATE SEQUENCE pagina_sectores_id_seq
        AS integer
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;
    ALTER SEQUENCE pagina_sectores_id_seq OWNED BY pagina_sectores.id;

    CREATE TABLE pagina_sectores_sectores (
        _order integer NOT NULL,
        _parent_id integer NOT NULL,
        id character varying NOT NULL,
        nombre character varying NOT NULL,
        icono character varying,
        descripcion character varying NOT NULL
    );
    CREATE TABLE pagina_sectores_sectores_oportunidades (
        _order integer NOT NULL,
        _parent_id character varying NOT NULL,
        id character varying NOT NULL,
        texto character varying NOT NULL
    );

    CREATE TABLE payload_kv (
        id integer NOT NULL,
        key character varying NOT NULL,
        data jsonb NOT NULL
    );
    CREATE SEQUENCE payload_kv_id_seq
        AS integer
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;
    ALTER SEQUENCE payload_kv_id_seq OWNED BY payload_kv.id;

    CREATE TABLE payload_locked_documents (
        id integer NOT NULL,
        global_slug character varying,
        updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
        created_at timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    CREATE SEQUENCE payload_locked_documents_id_seq
        AS integer
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;
    ALTER SEQUENCE payload_locked_documents_id_seq OWNED BY payload_locked_documents.id;

    CREATE TABLE payload_locked_documents_rels (
        id integer NOT NULL,
        "order" integer,
        parent_id integer NOT NULL,
        path character varying NOT NULL,
        users_id integer,
        media_id integer,
        noticias_id integer,
        documentos_id integer,
        proyectos_id integer,
        miembros_id integer,
        downloads_id integer,
        eventos_id integer
    );
    CREATE SEQUENCE payload_locked_documents_rels_id_seq
        AS integer
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;
    ALTER SEQUENCE payload_locked_documents_rels_id_seq OWNED BY payload_locked_documents_rels.id;

    CREATE TABLE payload_preferences (
        id integer NOT NULL,
        key character varying,
        value jsonb,
        updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
        created_at timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    CREATE SEQUENCE payload_preferences_id_seq
        AS integer
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;
    ALTER SEQUENCE payload_preferences_id_seq OWNED BY payload_preferences.id;

    CREATE TABLE payload_preferences_rels (
        id integer NOT NULL,
        "order" integer,
        parent_id integer NOT NULL,
        path character varying NOT NULL,
        users_id integer
    );
    CREATE SEQUENCE payload_preferences_rels_id_seq
        AS integer
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;
    ALTER SEQUENCE payload_preferences_rels_id_seq OWNED BY payload_preferences_rels.id;

    CREATE TABLE proyectos (
        id integer NOT NULL,
        nombre character varying NOT NULL,
        descripcion character varying NOT NULL,
        empresa character varying NOT NULL,
        etapa enum_proyectos_etapa NOT NULL,
        region enum_proyectos_region NOT NULL,
        coordenadas_lat numeric NOT NULL,
        coordenadas_lng numeric NOT NULL,
        capacidad_m_w numeric,
        produccion_ton_anio numeric,
        imagen_id integer,
        url character varying,
        updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
        created_at timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    CREATE SEQUENCE proyectos_id_seq
        AS integer
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;
    ALTER SEQUENCE proyectos_id_seq OWNED BY proyectos.id;

    CREATE TABLE sitio_general (
        id integer NOT NULL,
        nombre_sitio character varying DEFAULT 'H2V Araucanía'::character varying,
        descripcion_s_e_o character varying DEFAULT 'Plataforma informativa sobre los avances, proyectos y oportunidades del hidrógeno verde en la región de La Araucanía, Chile.'::character varying,
        footer_texto character varying DEFAULT 'Plataforma informativa del Bien Público 24BP-269085. Programa Estratégico Regional de Hidrógeno Verde en La Araucanía.'::character varying,
        footer_programa character varying DEFAULT 'Programa Desarrollo Productivo Sostenible — CORFO'::character varying,
        updated_at timestamp(3) with time zone,
        created_at timestamp(3) with time zone
    );
    CREATE SEQUENCE sitio_general_id_seq
        AS integer
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;
    ALTER SEQUENCE sitio_general_id_seq OWNED BY sitio_general.id;

    CREATE TABLE sitio_general_instituciones (
        _order integer NOT NULL,
        _parent_id integer NOT NULL,
        id character varying NOT NULL,
        nombre character varying NOT NULL,
        logo_id integer NOT NULL
    );

    CREATE TABLE users (
        id integer NOT NULL,
        nombre character varying NOT NULL,
        role enum_users_role DEFAULT 'registrado'::enum_users_role NOT NULL,
        institucion character varying,
        updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
        created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
        email character varying NOT NULL,
        reset_password_token character varying,
        reset_password_expiration timestamp(3) with time zone,
        salt character varying,
        hash character varying,
        login_attempts numeric DEFAULT 0,
        lock_until timestamp(3) with time zone
    );
    CREATE SEQUENCE users_id_seq
        AS integer
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;
    ALTER SEQUENCE users_id_seq OWNED BY users.id;

    CREATE TABLE users_sessions (
        _order integer NOT NULL,
        _parent_id integer NOT NULL,
        id character varying NOT NULL,
        created_at timestamp(3) with time zone,
        expires_at timestamp(3) with time zone NOT NULL
    );

    -- ==================== COLUMN DEFAULTS =======================
    ALTER TABLE ONLY contacto ALTER COLUMN id SET DEFAULT nextval('contacto_id_seq'::regclass);
    ALTER TABLE ONLY documentos ALTER COLUMN id SET DEFAULT nextval('documentos_id_seq'::regclass);
    ALTER TABLE ONLY downloads ALTER COLUMN id SET DEFAULT nextval('downloads_id_seq'::regclass);
    ALTER TABLE ONLY eventos ALTER COLUMN id SET DEFAULT nextval('eventos_id_seq'::regclass);
    ALTER TABLE ONLY guia_admin ALTER COLUMN id SET DEFAULT nextval('guia_admin_id_seq'::regclass);
    ALTER TABLE ONLY media ALTER COLUMN id SET DEFAULT nextval('media_id_seq'::regclass);
    ALTER TABLE ONLY miembros ALTER COLUMN id SET DEFAULT nextval('miembros_id_seq'::regclass);
    ALTER TABLE ONLY noticias ALTER COLUMN id SET DEFAULT nextval('noticias_id_seq'::regclass);
    ALTER TABLE ONLY pagina_capital_humano ALTER COLUMN id SET DEFAULT nextval('pagina_capital_humano_id_seq'::regclass);
    ALTER TABLE ONLY pagina_comunidad ALTER COLUMN id SET DEFAULT nextval('pagina_comunidad_id_seq'::regclass);
    ALTER TABLE ONLY pagina_gobernanza ALTER COLUMN id SET DEFAULT nextval('pagina_gobernanza_id_seq'::regclass);
    ALTER TABLE ONLY pagina_h2v ALTER COLUMN id SET DEFAULT nextval('pagina_h2v_id_seq'::regclass);
    ALTER TABLE ONLY pagina_hoja_ruta ALTER COLUMN id SET DEFAULT nextval('pagina_hoja_ruta_id_seq'::regclass);
    ALTER TABLE ONLY pagina_inicio ALTER COLUMN id SET DEFAULT nextval('pagina_inicio_id_seq'::regclass);
    ALTER TABLE ONLY pagina_marco_regulatorio ALTER COLUMN id SET DEFAULT nextval('pagina_marco_regulatorio_id_seq'::regclass);
    ALTER TABLE ONLY pagina_quienes_somos ALTER COLUMN id SET DEFAULT nextval('pagina_quienes_somos_id_seq'::regclass);
    ALTER TABLE ONLY pagina_sectores ALTER COLUMN id SET DEFAULT nextval('pagina_sectores_id_seq'::regclass);
    ALTER TABLE ONLY payload_kv ALTER COLUMN id SET DEFAULT nextval('payload_kv_id_seq'::regclass);
    ALTER TABLE ONLY payload_locked_documents ALTER COLUMN id SET DEFAULT nextval('payload_locked_documents_id_seq'::regclass);
    ALTER TABLE ONLY payload_locked_documents_rels ALTER COLUMN id SET DEFAULT nextval('payload_locked_documents_rels_id_seq'::regclass);
    ALTER TABLE ONLY payload_preferences ALTER COLUMN id SET DEFAULT nextval('payload_preferences_id_seq'::regclass);
    ALTER TABLE ONLY payload_preferences_rels ALTER COLUMN id SET DEFAULT nextval('payload_preferences_rels_id_seq'::regclass);
    ALTER TABLE ONLY proyectos ALTER COLUMN id SET DEFAULT nextval('proyectos_id_seq'::regclass);
    ALTER TABLE ONLY sitio_general ALTER COLUMN id SET DEFAULT nextval('sitio_general_id_seq'::regclass);
    ALTER TABLE ONLY users ALTER COLUMN id SET DEFAULT nextval('users_id_seq'::regclass);

    -- ==================== PRIMARY KEYS ==========================
    ALTER TABLE ONLY contacto ADD CONSTRAINT contacto_pkey PRIMARY KEY (id);
    ALTER TABLE ONLY documentos ADD CONSTRAINT documentos_pkey PRIMARY KEY (id);
    ALTER TABLE ONLY downloads ADD CONSTRAINT downloads_pkey PRIMARY KEY (id);
    ALTER TABLE ONLY eventos ADD CONSTRAINT eventos_pkey PRIMARY KEY (id);
    ALTER TABLE ONLY guia_admin ADD CONSTRAINT guia_admin_pkey PRIMARY KEY (id);
    ALTER TABLE ONLY media ADD CONSTRAINT media_pkey PRIMARY KEY (id);
    ALTER TABLE ONLY miembros ADD CONSTRAINT miembros_pkey PRIMARY KEY (id);
    ALTER TABLE ONLY noticias ADD CONSTRAINT noticias_pkey PRIMARY KEY (id);
    ALTER TABLE ONLY pagina_capital_humano_perfiles ADD CONSTRAINT pagina_capital_humano_perfiles_pkey PRIMARY KEY (id);
    ALTER TABLE ONLY pagina_capital_humano ADD CONSTRAINT pagina_capital_humano_pkey PRIMARY KEY (id);
    ALTER TABLE ONLY pagina_capital_humano_programas ADD CONSTRAINT pagina_capital_humano_programas_pkey PRIMARY KEY (id);
    ALTER TABLE ONLY pagina_comunidad_compromisos_items ADD CONSTRAINT pagina_comunidad_compromisos_items_pkey PRIMARY KEY (id);
    ALTER TABLE ONLY pagina_comunidad_glosario ADD CONSTRAINT pagina_comunidad_glosario_pkey PRIMARY KEY (id);
    ALTER TABLE ONLY pagina_comunidad_participacion_items ADD CONSTRAINT pagina_comunidad_participacion_items_pkey PRIMARY KEY (id);
    ALTER TABLE ONLY pagina_comunidad ADD CONSTRAINT pagina_comunidad_pkey PRIMARY KEY (id);
    ALTER TABLE ONLY pagina_gobernanza_nivel_estrategico_funciones ADD CONSTRAINT pagina_gobernanza_nivel_estrategico_funciones_pkey PRIMARY KEY (id);
    ALTER TABLE ONLY pagina_gobernanza_nivel_operativo_funciones ADD CONSTRAINT pagina_gobernanza_nivel_operativo_funciones_pkey PRIMARY KEY (id);
    ALTER TABLE ONLY pagina_gobernanza ADD CONSTRAINT pagina_gobernanza_pkey PRIMARY KEY (id);
    ALTER TABLE ONLY pagina_h2v_cadena_valor ADD CONSTRAINT pagina_h2v_cadena_valor_pkey PRIMARY KEY (id);
    ALTER TABLE ONLY pagina_h2v_derivados ADD CONSTRAINT pagina_h2v_derivados_pkey PRIMARY KEY (id);
    ALTER TABLE ONLY pagina_h2v_electrolisis_pasos ADD CONSTRAINT pagina_h2v_electrolisis_pasos_pkey PRIMARY KEY (id);
    ALTER TABLE ONLY pagina_h2v_electrolizadores ADD CONSTRAINT pagina_h2v_electrolizadores_pkey PRIMARY KEY (id);
    ALTER TABLE ONLY pagina_h2v ADD CONSTRAINT pagina_h2v_pkey PRIMARY KEY (id);
    ALTER TABLE ONLY pagina_hoja_ruta_hitos ADD CONSTRAINT pagina_hoja_ruta_hitos_pkey PRIMARY KEY (id);
    ALTER TABLE ONLY pagina_hoja_ruta ADD CONSTRAINT pagina_hoja_ruta_pkey PRIMARY KEY (id);
    ALTER TABLE ONLY pagina_inicio ADD CONSTRAINT pagina_inicio_pkey PRIMARY KEY (id);
    ALTER TABLE ONLY pagina_inicio_seccion_explora_cards ADD CONSTRAINT pagina_inicio_seccion_explora_cards_pkey PRIMARY KEY (id);
    ALTER TABLE ONLY pagina_marco_regulatorio_documentos ADD CONSTRAINT pagina_marco_regulatorio_documentos_pkey PRIMARY KEY (id);
    ALTER TABLE ONLY pagina_marco_regulatorio ADD CONSTRAINT pagina_marco_regulatorio_pkey PRIMARY KEY (id);
    ALTER TABLE ONLY pagina_quienes_somos_instituciones ADD CONSTRAINT pagina_quienes_somos_instituciones_pkey PRIMARY KEY (id);
    ALTER TABLE ONLY pagina_quienes_somos ADD CONSTRAINT pagina_quienes_somos_pkey PRIMARY KEY (id);
    ALTER TABLE ONLY pagina_sectores ADD CONSTRAINT pagina_sectores_pkey PRIMARY KEY (id);
    ALTER TABLE ONLY pagina_sectores_sectores_oportunidades ADD CONSTRAINT pagina_sectores_sectores_oportunidades_pkey PRIMARY KEY (id);
    ALTER TABLE ONLY pagina_sectores_sectores ADD CONSTRAINT pagina_sectores_sectores_pkey PRIMARY KEY (id);
    ALTER TABLE ONLY payload_kv ADD CONSTRAINT payload_kv_pkey PRIMARY KEY (id);
    ALTER TABLE ONLY payload_locked_documents ADD CONSTRAINT payload_locked_documents_pkey PRIMARY KEY (id);
    ALTER TABLE ONLY payload_locked_documents_rels ADD CONSTRAINT payload_locked_documents_rels_pkey PRIMARY KEY (id);
    ALTER TABLE ONLY payload_preferences ADD CONSTRAINT payload_preferences_pkey PRIMARY KEY (id);
    ALTER TABLE ONLY payload_preferences_rels ADD CONSTRAINT payload_preferences_rels_pkey PRIMARY KEY (id);
    ALTER TABLE ONLY proyectos ADD CONSTRAINT proyectos_pkey PRIMARY KEY (id);
    ALTER TABLE ONLY sitio_general_instituciones ADD CONSTRAINT sitio_general_instituciones_pkey PRIMARY KEY (id);
    ALTER TABLE ONLY sitio_general ADD CONSTRAINT sitio_general_pkey PRIMARY KEY (id);
    ALTER TABLE ONLY users ADD CONSTRAINT users_pkey PRIMARY KEY (id);
    ALTER TABLE ONLY users_sessions ADD CONSTRAINT users_sessions_pkey PRIMARY KEY (id);

    -- ======================== INDEXES ===========================
    CREATE INDEX documentos_archivo_idx ON documentos USING btree (archivo_id);
    CREATE INDEX documentos_created_at_idx ON documentos USING btree (created_at);
    CREATE INDEX documentos_thumbnail_idx ON documentos USING btree (thumbnail_id);
    CREATE INDEX documentos_updated_at_idx ON documentos USING btree (updated_at);
    CREATE INDEX downloads_created_at_idx ON downloads USING btree (created_at);
    CREATE INDEX downloads_documento_idx ON downloads USING btree (documento_id);
    CREATE INDEX downloads_updated_at_idx ON downloads USING btree (updated_at);
    CREATE INDEX downloads_user_idx ON downloads USING btree (user_id);
    CREATE INDEX eventos_created_at_idx ON eventos USING btree (created_at);
    CREATE INDEX eventos_imagen_idx ON eventos USING btree (imagen_id);
    CREATE INDEX eventos_updated_at_idx ON eventos USING btree (updated_at);
    CREATE INDEX media_created_at_idx ON media USING btree (created_at);
    CREATE UNIQUE INDEX media_filename_idx ON media USING btree (filename);
    CREATE INDEX media_sizes_card_sizes_card_filename_idx ON media USING btree (sizes_card_filename);
    CREATE INDEX media_sizes_hero_sizes_hero_filename_idx ON media USING btree (sizes_hero_filename);
    CREATE INDEX media_sizes_thumbnail_sizes_thumbnail_filename_idx ON media USING btree (sizes_thumbnail_filename);
    CREATE INDEX media_updated_at_idx ON media USING btree (updated_at);
    CREATE INDEX miembros_created_at_idx ON miembros USING btree (created_at);
    CREATE INDEX miembros_foto_idx ON miembros USING btree (foto_id);
    CREATE INDEX miembros_updated_at_idx ON miembros USING btree (updated_at);
    CREATE INDEX noticias_created_at_idx ON noticias USING btree (created_at);
    CREATE INDEX noticias_imagen_idx ON noticias USING btree (imagen_id);
    CREATE UNIQUE INDEX noticias_slug_idx ON noticias USING btree (slug);
    CREATE INDEX noticias_updated_at_idx ON noticias USING btree (updated_at);
    CREATE INDEX pagina_capital_humano_perfiles_order_idx ON pagina_capital_humano_perfiles USING btree (_order);
    CREATE INDEX pagina_capital_humano_perfiles_parent_id_idx ON pagina_capital_humano_perfiles USING btree (_parent_id);
    CREATE INDEX pagina_capital_humano_programas_order_idx ON pagina_capital_humano_programas USING btree (_order);
    CREATE INDEX pagina_capital_humano_programas_parent_id_idx ON pagina_capital_humano_programas USING btree (_parent_id);
    CREATE INDEX pagina_comunidad_compromisos_items_order_idx ON pagina_comunidad_compromisos_items USING btree (_order);
    CREATE INDEX pagina_comunidad_compromisos_items_parent_id_idx ON pagina_comunidad_compromisos_items USING btree (_parent_id);
    CREATE INDEX pagina_comunidad_glosario_order_idx ON pagina_comunidad_glosario USING btree (_order);
    CREATE INDEX pagina_comunidad_glosario_parent_id_idx ON pagina_comunidad_glosario USING btree (_parent_id);
    CREATE INDEX pagina_comunidad_participacion_items_order_idx ON pagina_comunidad_participacion_items USING btree (_order);
    CREATE INDEX pagina_comunidad_participacion_items_parent_id_idx ON pagina_comunidad_participacion_items USING btree (_parent_id);
    CREATE INDEX pagina_gobernanza_nivel_estrategico_funciones_order_idx ON pagina_gobernanza_nivel_estrategico_funciones USING btree (_order);
    CREATE INDEX pagina_gobernanza_nivel_estrategico_funciones_parent_id_idx ON pagina_gobernanza_nivel_estrategico_funciones USING btree (_parent_id);
    CREATE INDEX pagina_gobernanza_nivel_operativo_funciones_order_idx ON pagina_gobernanza_nivel_operativo_funciones USING btree (_order);
    CREATE INDEX pagina_gobernanza_nivel_operativo_funciones_parent_id_idx ON pagina_gobernanza_nivel_operativo_funciones USING btree (_parent_id);
    CREATE INDEX pagina_h2v_cadena_valor_order_idx ON pagina_h2v_cadena_valor USING btree (_order);
    CREATE INDEX pagina_h2v_cadena_valor_parent_id_idx ON pagina_h2v_cadena_valor USING btree (_parent_id);
    CREATE INDEX pagina_h2v_derivados_order_idx ON pagina_h2v_derivados USING btree (_order);
    CREATE INDEX pagina_h2v_derivados_parent_id_idx ON pagina_h2v_derivados USING btree (_parent_id);
    CREATE INDEX pagina_h2v_electrolisis_pasos_order_idx ON pagina_h2v_electrolisis_pasos USING btree (_order);
    CREATE INDEX pagina_h2v_electrolisis_pasos_parent_id_idx ON pagina_h2v_electrolisis_pasos USING btree (_parent_id);
    CREATE INDEX pagina_h2v_electrolizadores_order_idx ON pagina_h2v_electrolizadores USING btree (_order);
    CREATE INDEX pagina_h2v_electrolizadores_parent_id_idx ON pagina_h2v_electrolizadores USING btree (_parent_id);
    CREATE INDEX pagina_hoja_ruta_hitos_order_idx ON pagina_hoja_ruta_hitos USING btree (_order);
    CREATE INDEX pagina_hoja_ruta_hitos_parent_id_idx ON pagina_hoja_ruta_hitos USING btree (_parent_id);
    CREATE INDEX pagina_inicio_seccion_explora_cards_order_idx ON pagina_inicio_seccion_explora_cards USING btree (_order);
    CREATE INDEX pagina_inicio_seccion_explora_cards_parent_id_idx ON pagina_inicio_seccion_explora_cards USING btree (_parent_id);
    CREATE INDEX pagina_marco_regulatorio_documentos_order_idx ON pagina_marco_regulatorio_documentos USING btree (_order);
    CREATE INDEX pagina_marco_regulatorio_documentos_parent_id_idx ON pagina_marco_regulatorio_documentos USING btree (_parent_id);
    CREATE INDEX pagina_quienes_somos_instituciones_logo_idx ON pagina_quienes_somos_instituciones USING btree (logo_id);
    CREATE INDEX pagina_quienes_somos_instituciones_order_idx ON pagina_quienes_somos_instituciones USING btree (_order);
    CREATE INDEX pagina_quienes_somos_instituciones_parent_id_idx ON pagina_quienes_somos_instituciones USING btree (_parent_id);
    CREATE INDEX pagina_sectores_sectores_oportunidades_order_idx ON pagina_sectores_sectores_oportunidades USING btree (_order);
    CREATE INDEX pagina_sectores_sectores_oportunidades_parent_id_idx ON pagina_sectores_sectores_oportunidades USING btree (_parent_id);
    CREATE INDEX pagina_sectores_sectores_order_idx ON pagina_sectores_sectores USING btree (_order);
    CREATE INDEX pagina_sectores_sectores_parent_id_idx ON pagina_sectores_sectores USING btree (_parent_id);
    CREATE UNIQUE INDEX payload_kv_key_idx ON payload_kv USING btree (key);
    CREATE INDEX payload_locked_documents_created_at_idx ON payload_locked_documents USING btree (created_at);
    CREATE INDEX payload_locked_documents_global_slug_idx ON payload_locked_documents USING btree (global_slug);
    CREATE INDEX payload_locked_documents_rels_documentos_id_idx ON payload_locked_documents_rels USING btree (documentos_id);
    CREATE INDEX payload_locked_documents_rels_downloads_id_idx ON payload_locked_documents_rels USING btree (downloads_id);
    CREATE INDEX payload_locked_documents_rels_eventos_id_idx ON payload_locked_documents_rels USING btree (eventos_id);
    CREATE INDEX payload_locked_documents_rels_media_id_idx ON payload_locked_documents_rels USING btree (media_id);
    CREATE INDEX payload_locked_documents_rels_miembros_id_idx ON payload_locked_documents_rels USING btree (miembros_id);
    CREATE INDEX payload_locked_documents_rels_noticias_id_idx ON payload_locked_documents_rels USING btree (noticias_id);
    CREATE INDEX payload_locked_documents_rels_order_idx ON payload_locked_documents_rels USING btree ("order");
    CREATE INDEX payload_locked_documents_rels_parent_idx ON payload_locked_documents_rels USING btree (parent_id);
    CREATE INDEX payload_locked_documents_rels_path_idx ON payload_locked_documents_rels USING btree (path);
    CREATE INDEX payload_locked_documents_rels_proyectos_id_idx ON payload_locked_documents_rels USING btree (proyectos_id);
    CREATE INDEX payload_locked_documents_rels_users_id_idx ON payload_locked_documents_rels USING btree (users_id);
    CREATE INDEX payload_locked_documents_updated_at_idx ON payload_locked_documents USING btree (updated_at);
    CREATE INDEX payload_preferences_created_at_idx ON payload_preferences USING btree (created_at);
    CREATE INDEX payload_preferences_key_idx ON payload_preferences USING btree (key);
    CREATE INDEX payload_preferences_rels_order_idx ON payload_preferences_rels USING btree ("order");
    CREATE INDEX payload_preferences_rels_parent_idx ON payload_preferences_rels USING btree (parent_id);
    CREATE INDEX payload_preferences_rels_path_idx ON payload_preferences_rels USING btree (path);
    CREATE INDEX payload_preferences_rels_users_id_idx ON payload_preferences_rels USING btree (users_id);
    CREATE INDEX payload_preferences_updated_at_idx ON payload_preferences USING btree (updated_at);
    CREATE INDEX proyectos_created_at_idx ON proyectos USING btree (created_at);
    CREATE INDEX proyectos_imagen_idx ON proyectos USING btree (imagen_id);
    CREATE INDEX proyectos_updated_at_idx ON proyectos USING btree (updated_at);
    CREATE INDEX sitio_general_instituciones_logo_idx ON sitio_general_instituciones USING btree (logo_id);
    CREATE INDEX sitio_general_instituciones_order_idx ON sitio_general_instituciones USING btree (_order);
    CREATE INDEX sitio_general_instituciones_parent_id_idx ON sitio_general_instituciones USING btree (_parent_id);
    CREATE INDEX users_created_at_idx ON users USING btree (created_at);
    CREATE UNIQUE INDEX users_email_idx ON users USING btree (email);
    CREATE INDEX users_sessions_order_idx ON users_sessions USING btree (_order);
    CREATE INDEX users_sessions_parent_id_idx ON users_sessions USING btree (_parent_id);
    CREATE INDEX users_updated_at_idx ON users USING btree (updated_at);

    -- ==================== FOREIGN KEYS ==========================
    ALTER TABLE ONLY documentos ADD CONSTRAINT documentos_archivo_id_media_id_fk FOREIGN KEY (archivo_id) REFERENCES media(id) ON DELETE SET NULL;
    ALTER TABLE ONLY documentos ADD CONSTRAINT documentos_thumbnail_id_media_id_fk FOREIGN KEY (thumbnail_id) REFERENCES media(id) ON DELETE SET NULL;
    ALTER TABLE ONLY downloads ADD CONSTRAINT downloads_documento_id_documentos_id_fk FOREIGN KEY (documento_id) REFERENCES documentos(id) ON DELETE SET NULL;
    ALTER TABLE ONLY downloads ADD CONSTRAINT downloads_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;
    ALTER TABLE ONLY eventos ADD CONSTRAINT eventos_imagen_id_media_id_fk FOREIGN KEY (imagen_id) REFERENCES media(id) ON DELETE SET NULL;
    ALTER TABLE ONLY miembros ADD CONSTRAINT miembros_foto_id_media_id_fk FOREIGN KEY (foto_id) REFERENCES media(id) ON DELETE SET NULL;
    ALTER TABLE ONLY noticias ADD CONSTRAINT noticias_imagen_id_media_id_fk FOREIGN KEY (imagen_id) REFERENCES media(id) ON DELETE SET NULL;
    ALTER TABLE ONLY pagina_capital_humano_perfiles ADD CONSTRAINT pagina_capital_humano_perfiles_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES pagina_capital_humano(id) ON DELETE CASCADE;
    ALTER TABLE ONLY pagina_capital_humano_programas ADD CONSTRAINT pagina_capital_humano_programas_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES pagina_capital_humano(id) ON DELETE CASCADE;
    ALTER TABLE ONLY pagina_comunidad_compromisos_items ADD CONSTRAINT pagina_comunidad_compromisos_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES pagina_comunidad(id) ON DELETE CASCADE;
    ALTER TABLE ONLY pagina_comunidad_glosario ADD CONSTRAINT pagina_comunidad_glosario_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES pagina_comunidad(id) ON DELETE CASCADE;
    ALTER TABLE ONLY pagina_comunidad_participacion_items ADD CONSTRAINT pagina_comunidad_participacion_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES pagina_comunidad(id) ON DELETE CASCADE;
    ALTER TABLE ONLY pagina_gobernanza_nivel_estrategico_funciones ADD CONSTRAINT pagina_gobernanza_nivel_estrategico_funciones_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES pagina_gobernanza(id) ON DELETE CASCADE;
    ALTER TABLE ONLY pagina_gobernanza_nivel_operativo_funciones ADD CONSTRAINT pagina_gobernanza_nivel_operativo_funciones_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES pagina_gobernanza(id) ON DELETE CASCADE;
    ALTER TABLE ONLY pagina_h2v_cadena_valor ADD CONSTRAINT pagina_h2v_cadena_valor_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES pagina_h2v(id) ON DELETE CASCADE;
    ALTER TABLE ONLY pagina_h2v_derivados ADD CONSTRAINT pagina_h2v_derivados_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES pagina_h2v(id) ON DELETE CASCADE;
    ALTER TABLE ONLY pagina_h2v_electrolisis_pasos ADD CONSTRAINT pagina_h2v_electrolisis_pasos_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES pagina_h2v(id) ON DELETE CASCADE;
    ALTER TABLE ONLY pagina_h2v_electrolizadores ADD CONSTRAINT pagina_h2v_electrolizadores_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES pagina_h2v(id) ON DELETE CASCADE;
    ALTER TABLE ONLY pagina_hoja_ruta_hitos ADD CONSTRAINT pagina_hoja_ruta_hitos_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES pagina_hoja_ruta(id) ON DELETE CASCADE;
    ALTER TABLE ONLY pagina_inicio_seccion_explora_cards ADD CONSTRAINT pagina_inicio_seccion_explora_cards_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES pagina_inicio(id) ON DELETE CASCADE;
    ALTER TABLE ONLY pagina_marco_regulatorio_documentos ADD CONSTRAINT pagina_marco_regulatorio_documentos_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES pagina_marco_regulatorio(id) ON DELETE CASCADE;
    ALTER TABLE ONLY pagina_quienes_somos_instituciones ADD CONSTRAINT pagina_quienes_somos_instituciones_logo_id_media_id_fk FOREIGN KEY (logo_id) REFERENCES media(id) ON DELETE SET NULL;
    ALTER TABLE ONLY pagina_quienes_somos_instituciones ADD CONSTRAINT pagina_quienes_somos_instituciones_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES pagina_quienes_somos(id) ON DELETE CASCADE;
    ALTER TABLE ONLY pagina_sectores_sectores_oportunidades ADD CONSTRAINT pagina_sectores_sectores_oportunidades_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES pagina_sectores_sectores(id) ON DELETE CASCADE;
    ALTER TABLE ONLY pagina_sectores_sectores ADD CONSTRAINT pagina_sectores_sectores_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES pagina_sectores(id) ON DELETE CASCADE;
    ALTER TABLE ONLY payload_locked_documents_rels ADD CONSTRAINT payload_locked_documents_rels_documentos_fk FOREIGN KEY (documentos_id) REFERENCES documentos(id) ON DELETE CASCADE;
    ALTER TABLE ONLY payload_locked_documents_rels ADD CONSTRAINT payload_locked_documents_rels_downloads_fk FOREIGN KEY (downloads_id) REFERENCES downloads(id) ON DELETE CASCADE;
    ALTER TABLE ONLY payload_locked_documents_rels ADD CONSTRAINT payload_locked_documents_rels_eventos_fk FOREIGN KEY (eventos_id) REFERENCES eventos(id) ON DELETE CASCADE;
    ALTER TABLE ONLY payload_locked_documents_rels ADD CONSTRAINT payload_locked_documents_rels_media_fk FOREIGN KEY (media_id) REFERENCES media(id) ON DELETE CASCADE;
    ALTER TABLE ONLY payload_locked_documents_rels ADD CONSTRAINT payload_locked_documents_rels_miembros_fk FOREIGN KEY (miembros_id) REFERENCES miembros(id) ON DELETE CASCADE;
    ALTER TABLE ONLY payload_locked_documents_rels ADD CONSTRAINT payload_locked_documents_rels_noticias_fk FOREIGN KEY (noticias_id) REFERENCES noticias(id) ON DELETE CASCADE;
    ALTER TABLE ONLY payload_locked_documents_rels ADD CONSTRAINT payload_locked_documents_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES payload_locked_documents(id) ON DELETE CASCADE;
    ALTER TABLE ONLY payload_locked_documents_rels ADD CONSTRAINT payload_locked_documents_rels_proyectos_fk FOREIGN KEY (proyectos_id) REFERENCES proyectos(id) ON DELETE CASCADE;
    ALTER TABLE ONLY payload_locked_documents_rels ADD CONSTRAINT payload_locked_documents_rels_users_fk FOREIGN KEY (users_id) REFERENCES users(id) ON DELETE CASCADE;
    ALTER TABLE ONLY payload_preferences_rels ADD CONSTRAINT payload_preferences_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES payload_preferences(id) ON DELETE CASCADE;
    ALTER TABLE ONLY payload_preferences_rels ADD CONSTRAINT payload_preferences_rels_users_fk FOREIGN KEY (users_id) REFERENCES users(id) ON DELETE CASCADE;
    ALTER TABLE ONLY proyectos ADD CONSTRAINT proyectos_imagen_id_media_id_fk FOREIGN KEY (imagen_id) REFERENCES media(id) ON DELETE SET NULL;
    ALTER TABLE ONLY sitio_general_instituciones ADD CONSTRAINT sitio_general_instituciones_logo_id_media_id_fk FOREIGN KEY (logo_id) REFERENCES media(id) ON DELETE SET NULL;
    ALTER TABLE ONLY sitio_general_instituciones ADD CONSTRAINT sitio_general_instituciones_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES sitio_general(id) ON DELETE CASCADE;
    ALTER TABLE ONLY users_sessions ADD CONSTRAINT users_sessions_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES users(id) ON DELETE CASCADE;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    -- ============================================================
    -- H2V Araucanía — Rollback Initial Migration
    -- Drop in reverse dependency order: FKs → tables → sequences → enums
    -- ============================================================

    -- ==================== DROP FOREIGN KEYS =====================
    ALTER TABLE IF EXISTS users_sessions DROP CONSTRAINT IF EXISTS users_sessions_parent_id_fk;
    ALTER TABLE IF EXISTS sitio_general_instituciones DROP CONSTRAINT IF EXISTS sitio_general_instituciones_parent_id_fk;
    ALTER TABLE IF EXISTS sitio_general_instituciones DROP CONSTRAINT IF EXISTS sitio_general_instituciones_logo_id_media_id_fk;
    ALTER TABLE IF EXISTS proyectos DROP CONSTRAINT IF EXISTS proyectos_imagen_id_media_id_fk;
    ALTER TABLE IF EXISTS payload_preferences_rels DROP CONSTRAINT IF EXISTS payload_preferences_rels_users_fk;
    ALTER TABLE IF EXISTS payload_preferences_rels DROP CONSTRAINT IF EXISTS payload_preferences_rels_parent_fk;
    ALTER TABLE IF EXISTS payload_locked_documents_rels DROP CONSTRAINT IF EXISTS payload_locked_documents_rels_users_fk;
    ALTER TABLE IF EXISTS payload_locked_documents_rels DROP CONSTRAINT IF EXISTS payload_locked_documents_rels_proyectos_fk;
    ALTER TABLE IF EXISTS payload_locked_documents_rels DROP CONSTRAINT IF EXISTS payload_locked_documents_rels_parent_fk;
    ALTER TABLE IF EXISTS payload_locked_documents_rels DROP CONSTRAINT IF EXISTS payload_locked_documents_rels_noticias_fk;
    ALTER TABLE IF EXISTS payload_locked_documents_rels DROP CONSTRAINT IF EXISTS payload_locked_documents_rels_miembros_fk;
    ALTER TABLE IF EXISTS payload_locked_documents_rels DROP CONSTRAINT IF EXISTS payload_locked_documents_rels_media_fk;
    ALTER TABLE IF EXISTS payload_locked_documents_rels DROP CONSTRAINT IF EXISTS payload_locked_documents_rels_eventos_fk;
    ALTER TABLE IF EXISTS payload_locked_documents_rels DROP CONSTRAINT IF EXISTS payload_locked_documents_rels_downloads_fk;
    ALTER TABLE IF EXISTS payload_locked_documents_rels DROP CONSTRAINT IF EXISTS payload_locked_documents_rels_documentos_fk;
    ALTER TABLE IF EXISTS pagina_sectores_sectores DROP CONSTRAINT IF EXISTS pagina_sectores_sectores_parent_id_fk;
    ALTER TABLE IF EXISTS pagina_sectores_sectores_oportunidades DROP CONSTRAINT IF EXISTS pagina_sectores_sectores_oportunidades_parent_id_fk;
    ALTER TABLE IF EXISTS pagina_quienes_somos_instituciones DROP CONSTRAINT IF EXISTS pagina_quienes_somos_instituciones_parent_id_fk;
    ALTER TABLE IF EXISTS pagina_quienes_somos_instituciones DROP CONSTRAINT IF EXISTS pagina_quienes_somos_instituciones_logo_id_media_id_fk;
    ALTER TABLE IF EXISTS pagina_marco_regulatorio_documentos DROP CONSTRAINT IF EXISTS pagina_marco_regulatorio_documentos_parent_id_fk;
    ALTER TABLE IF EXISTS pagina_inicio_seccion_explora_cards DROP CONSTRAINT IF EXISTS pagina_inicio_seccion_explora_cards_parent_id_fk;
    ALTER TABLE IF EXISTS pagina_hoja_ruta_hitos DROP CONSTRAINT IF EXISTS pagina_hoja_ruta_hitos_parent_id_fk;
    ALTER TABLE IF EXISTS pagina_h2v_electrolizadores DROP CONSTRAINT IF EXISTS pagina_h2v_electrolizadores_parent_id_fk;
    ALTER TABLE IF EXISTS pagina_h2v_electrolisis_pasos DROP CONSTRAINT IF EXISTS pagina_h2v_electrolisis_pasos_parent_id_fk;
    ALTER TABLE IF EXISTS pagina_h2v_derivados DROP CONSTRAINT IF EXISTS pagina_h2v_derivados_parent_id_fk;
    ALTER TABLE IF EXISTS pagina_h2v_cadena_valor DROP CONSTRAINT IF EXISTS pagina_h2v_cadena_valor_parent_id_fk;
    ALTER TABLE IF EXISTS pagina_gobernanza_nivel_operativo_funciones DROP CONSTRAINT IF EXISTS pagina_gobernanza_nivel_operativo_funciones_parent_id_fk;
    ALTER TABLE IF EXISTS pagina_gobernanza_nivel_estrategico_funciones DROP CONSTRAINT IF EXISTS pagina_gobernanza_nivel_estrategico_funciones_parent_id_fk;
    ALTER TABLE IF EXISTS pagina_comunidad_participacion_items DROP CONSTRAINT IF EXISTS pagina_comunidad_participacion_items_parent_id_fk;
    ALTER TABLE IF EXISTS pagina_comunidad_glosario DROP CONSTRAINT IF EXISTS pagina_comunidad_glosario_parent_id_fk;
    ALTER TABLE IF EXISTS pagina_comunidad_compromisos_items DROP CONSTRAINT IF EXISTS pagina_comunidad_compromisos_items_parent_id_fk;
    ALTER TABLE IF EXISTS pagina_capital_humano_programas DROP CONSTRAINT IF EXISTS pagina_capital_humano_programas_parent_id_fk;
    ALTER TABLE IF EXISTS pagina_capital_humano_perfiles DROP CONSTRAINT IF EXISTS pagina_capital_humano_perfiles_parent_id_fk;
    ALTER TABLE IF EXISTS noticias DROP CONSTRAINT IF EXISTS noticias_imagen_id_media_id_fk;
    ALTER TABLE IF EXISTS miembros DROP CONSTRAINT IF EXISTS miembros_foto_id_media_id_fk;
    ALTER TABLE IF EXISTS eventos DROP CONSTRAINT IF EXISTS eventos_imagen_id_media_id_fk;
    ALTER TABLE IF EXISTS downloads DROP CONSTRAINT IF EXISTS downloads_user_id_users_id_fk;
    ALTER TABLE IF EXISTS downloads DROP CONSTRAINT IF EXISTS downloads_documento_id_documentos_id_fk;
    ALTER TABLE IF EXISTS documentos DROP CONSTRAINT IF EXISTS documentos_thumbnail_id_media_id_fk;
    ALTER TABLE IF EXISTS documentos DROP CONSTRAINT IF EXISTS documentos_archivo_id_media_id_fk;

    -- ==================== DROP TABLES ===========================
    -- Child/junction tables first (those with FKs to parent tables)
    DROP TABLE IF EXISTS users_sessions CASCADE;
    DROP TABLE IF EXISTS sitio_general_instituciones CASCADE;
    DROP TABLE IF EXISTS payload_preferences_rels CASCADE;
    DROP TABLE IF EXISTS payload_locked_documents_rels CASCADE;
    DROP TABLE IF EXISTS pagina_sectores_sectores_oportunidades CASCADE;
    DROP TABLE IF EXISTS pagina_sectores_sectores CASCADE;
    DROP TABLE IF EXISTS pagina_quienes_somos_instituciones CASCADE;
    DROP TABLE IF EXISTS pagina_marco_regulatorio_documentos CASCADE;
    DROP TABLE IF EXISTS pagina_inicio_seccion_explora_cards CASCADE;
    DROP TABLE IF EXISTS pagina_hoja_ruta_hitos CASCADE;
    DROP TABLE IF EXISTS pagina_h2v_electrolizadores CASCADE;
    DROP TABLE IF EXISTS pagina_h2v_electrolisis_pasos CASCADE;
    DROP TABLE IF EXISTS pagina_h2v_derivados CASCADE;
    DROP TABLE IF EXISTS pagina_h2v_cadena_valor CASCADE;
    DROP TABLE IF EXISTS pagina_gobernanza_nivel_operativo_funciones CASCADE;
    DROP TABLE IF EXISTS pagina_gobernanza_nivel_estrategico_funciones CASCADE;
    DROP TABLE IF EXISTS pagina_comunidad_participacion_items CASCADE;
    DROP TABLE IF EXISTS pagina_comunidad_glosario CASCADE;
    DROP TABLE IF EXISTS pagina_comunidad_compromisos_items CASCADE;
    DROP TABLE IF EXISTS pagina_capital_humano_programas CASCADE;
    DROP TABLE IF EXISTS pagina_capital_humano_perfiles CASCADE;

    -- Parent tables (those referenced by child tables)
    DROP TABLE IF EXISTS downloads CASCADE;
    DROP TABLE IF EXISTS documentos CASCADE;
    DROP TABLE IF EXISTS noticias CASCADE;
    DROP TABLE IF EXISTS eventos CASCADE;
    DROP TABLE IF EXISTS miembros CASCADE;
    DROP TABLE IF EXISTS proyectos CASCADE;
    DROP TABLE IF EXISTS payload_preferences CASCADE;
    DROP TABLE IF EXISTS payload_locked_documents CASCADE;
    DROP TABLE IF EXISTS payload_kv CASCADE;
    DROP TABLE IF EXISTS pagina_sectores CASCADE;
    DROP TABLE IF EXISTS pagina_quienes_somos CASCADE;
    DROP TABLE IF EXISTS pagina_marco_regulatorio CASCADE;
    DROP TABLE IF EXISTS pagina_inicio CASCADE;
    DROP TABLE IF EXISTS pagina_hoja_ruta CASCADE;
    DROP TABLE IF EXISTS pagina_h2v CASCADE;
    DROP TABLE IF EXISTS pagina_gobernanza CASCADE;
    DROP TABLE IF EXISTS pagina_comunidad CASCADE;
    DROP TABLE IF EXISTS pagina_capital_humano CASCADE;
    DROP TABLE IF EXISTS sitio_general CASCADE;
    DROP TABLE IF EXISTS guia_admin CASCADE;
    DROP TABLE IF EXISTS media CASCADE;
    DROP TABLE IF EXISTS contacto CASCADE;
    DROP TABLE IF EXISTS users CASCADE;

    -- ==================== DROP SEQUENCES ========================
    DROP SEQUENCE IF EXISTS contacto_id_seq;
    DROP SEQUENCE IF EXISTS documentos_id_seq;
    DROP SEQUENCE IF EXISTS downloads_id_seq;
    DROP SEQUENCE IF EXISTS eventos_id_seq;
    DROP SEQUENCE IF EXISTS guia_admin_id_seq;
    DROP SEQUENCE IF EXISTS media_id_seq;
    DROP SEQUENCE IF EXISTS miembros_id_seq;
    DROP SEQUENCE IF EXISTS noticias_id_seq;
    DROP SEQUENCE IF EXISTS pagina_capital_humano_id_seq;
    DROP SEQUENCE IF EXISTS pagina_comunidad_id_seq;
    DROP SEQUENCE IF EXISTS pagina_gobernanza_id_seq;
    DROP SEQUENCE IF EXISTS pagina_h2v_id_seq;
    DROP SEQUENCE IF EXISTS pagina_hoja_ruta_id_seq;
    DROP SEQUENCE IF EXISTS pagina_inicio_id_seq;
    DROP SEQUENCE IF EXISTS pagina_marco_regulatorio_id_seq;
    DROP SEQUENCE IF EXISTS pagina_quienes_somos_id_seq;
    DROP SEQUENCE IF EXISTS pagina_sectores_id_seq;
    DROP SEQUENCE IF EXISTS payload_kv_id_seq;
    DROP SEQUENCE IF EXISTS payload_locked_documents_id_seq;
    DROP SEQUENCE IF EXISTS payload_locked_documents_rels_id_seq;
    DROP SEQUENCE IF EXISTS payload_preferences_id_seq;
    DROP SEQUENCE IF EXISTS payload_preferences_rels_id_seq;
    DROP SEQUENCE IF EXISTS proyectos_id_seq;
    DROP SEQUENCE IF EXISTS sitio_general_id_seq;
    DROP SEQUENCE IF EXISTS users_id_seq;

    -- ==================== DROP ENUMS ============================
    DROP TYPE IF EXISTS enum_documentos_tipo;
    DROP TYPE IF EXISTS enum_eventos_tipo;
    DROP TYPE IF EXISTS enum_miembros_instancia;
    DROP TYPE IF EXISTS enum_noticias_categoria;
    DROP TYPE IF EXISTS enum_proyectos_etapa;
    DROP TYPE IF EXISTS enum_proyectos_region;
    DROP TYPE IF EXISTS enum_users_role;

    -- ==================== DROP PAYLOAD INTERNAL ==================
    DROP TABLE IF EXISTS payload_migrations CASCADE;
  `)
}
