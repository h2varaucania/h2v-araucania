import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DO $$ BEGIN CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor', 'registrado'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_noticias_categoria" AS ENUM('seminario', 'taller', 'gobernanza', 'acuerdo', 'proyecto', 'general'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_noticias_status" AS ENUM('draft', 'published'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__noticias_v_version_categoria" AS ENUM('seminario', 'taller', 'gobernanza', 'acuerdo', 'proyecto', 'general'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__noticias_v_version_status" AS ENUM('draft', 'published'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_documentos_tipo" AS ENUM('tecnico', 'difusion', 'regulatorio', 'capacitacion'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_proyectos_etapa" AS ENUM('planificacion', 'pilotaje', 'desarrollo', 'operacion'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_proyectos_region" AS ENUM('araucania', 'nacional'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_miembros_instancia" AS ENUM('consejo', 'comite', 'unidad'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_video_views_evento" AS ENUM('play', 'fin'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_eventos_tipo" AS ENUM('seminario', 'taller', 'feria', 'reunion', 'capacitacion', 'otro'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_eventos_status" AS ENUM('draft', 'published'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__eventos_v_version_tipo" AS ENUM('seminario', 'taller', 'feria', 'reunion', 'capacitacion', 'otro'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__eventos_v_version_status" AS ENUM('draft', 'published'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pagina_h2v_explora_mas_enlace" AS ENUM('/hidrogeno-verde/sectores', '/hidrogeno-verde/capital-humano', '/hidrogeno-verde/hoja-de-ruta', '/hidrogeno-verde/marco-regulatorio', '/proyectos', '/recursos/documentos', '/noticias', '/contacto'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pagina_mediateca_recursos_tipo" AS ENUM('video', 'infografia', 'presentacion', 'documento'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  CREATE TABLE IF NOT EXISTS "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nombre" varchar NOT NULL,
  	"role" "enum_users_role" DEFAULT 'registrado' NOT NULL,
  	"institucion" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
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
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "noticias" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"titulo" varchar,
  	"slug" varchar,
  	"extracto" varchar,
  	"contenido" jsonb,
  	"imagen_id" integer,
  	"fecha" timestamp(3) with time zone,
  	"categoria" "enum_noticias_categoria",
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_noticias_status" DEFAULT 'draft'
  );
  
  CREATE TABLE IF NOT EXISTS "_noticias_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_titulo" varchar,
  	"version_slug" varchar,
  	"version_extracto" varchar,
  	"version_contenido" jsonb,
  	"version_imagen_id" integer,
  	"version_fecha" timestamp(3) with time zone,
  	"version_categoria" "enum__noticias_v_version_categoria",
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__noticias_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE IF NOT EXISTS "documentos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"titulo" varchar NOT NULL,
  	"descripcion" varchar NOT NULL,
  	"archivo_id" integer NOT NULL,
  	"thumbnail_id" integer,
  	"tipo" "enum_documentos_tipo" NOT NULL,
  	"anio" numeric NOT NULL,
  	"descargas" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "proyectos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nombre" varchar NOT NULL,
  	"descripcion" varchar NOT NULL,
  	"empresa" varchar NOT NULL,
  	"etapa" "enum_proyectos_etapa" NOT NULL,
  	"region" "enum_proyectos_region" NOT NULL,
  	"coordenadas_lat" numeric NOT NULL,
  	"coordenadas_lng" numeric NOT NULL,
  	"capacidad_m_w" numeric,
  	"produccion_ton_anio" numeric,
  	"imagen_id" integer,
  	"url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "miembros" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nombre" varchar NOT NULL,
  	"cargo" varchar NOT NULL,
  	"institucion" varchar NOT NULL,
  	"instancia" "enum_miembros_instancia" NOT NULL,
  	"foto_id" integer,
  	"aporte" varchar,
  	"suplente" varchar,
  	"orden" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "downloads" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"documento_id" integer NOT NULL,
  	"user_id" integer,
  	"downloaded_at" timestamp(3) with time zone NOT NULL,
  	"ip" varchar,
  	"user_agent" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "video_views" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"video_titulo" varchar NOT NULL,
  	"video_key" varchar NOT NULL,
  	"evento" "enum_video_views_evento" NOT NULL,
  	"segundos_vistos" numeric DEFAULT 0,
  	"session_id" varchar,
  	"user_id" integer,
  	"watched_at" timestamp(3) with time zone NOT NULL,
  	"ip" varchar,
  	"user_agent" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "eventos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"titulo" varchar,
  	"descripcion" jsonb,
  	"fecha" timestamp(3) with time zone,
  	"fecha_fin" timestamp(3) with time zone,
  	"lugar" varchar,
  	"tipo" "enum_eventos_tipo",
  	"imagen_id" integer,
  	"url_inscripcion" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_eventos_status" DEFAULT 'draft'
  );
  
  CREATE TABLE IF NOT EXISTS "_eventos_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_titulo" varchar,
  	"version_descripcion" jsonb,
  	"version_fecha" timestamp(3) with time zone,
  	"version_fecha_fin" timestamp(3) with time zone,
  	"version_lugar" varchar,
  	"version_tipo" "enum__eventos_v_version_tipo",
  	"version_imagen_id" integer,
  	"version_url_inscripcion" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__eventos_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE IF NOT EXISTS "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"noticias_id" integer,
  	"documentos_id" integer,
  	"proyectos_id" integer,
  	"miembros_id" integer,
  	"downloads_id" integer,
  	"video_views_id" integer,
  	"eventos_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "sitio_general_instituciones" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"nombre" varchar NOT NULL,
  	"logo_id" integer NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "sitio_general" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nombre_sitio" varchar DEFAULT 'H2V Araucanía',
  	"descripcion_s_e_o" varchar DEFAULT 'Plataforma informativa sobre los avances, proyectos y oportunidades del hidrógeno verde en la región de La Araucanía, Chile.',
  	"footer_texto" varchar DEFAULT 'Plataforma informativa del Bien Público 24BP-269085. Programa Estratégico Regional de Hidrógeno Verde en La Araucanía.',
  	"footer_programa" varchar DEFAULT 'Programa Desarrollo Productivo Sostenible — CORFO',
  	"titulo_navegacion" varchar DEFAULT 'Navegación',
  	"titulo_contacto_footer" varchar DEFAULT 'Contacto',
  	"titulo_apoyo_footer" varchar DEFAULT 'Proyecto apoyado por',
  	"derechos" varchar DEFAULT 'Todos los derechos reservados.',
  	"titulo404" varchar DEFAULT 'Página no encontrada',
  	"texto404" varchar DEFAULT 'La página que buscas no existe o fue movida. Puedes volver al inicio o explorar las secciones del programa.',
  	"boton404" varchar DEFAULT 'Volver al inicio',
  	"boton404_secundario" varchar DEFAULT 'Ver proyectos',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "contacto_form_opciones_asunto" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"etiqueta" varchar NOT NULL,
  	"valor" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "contacto" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"titulo_pagina" varchar DEFAULT 'Contacto',
  	"bajada_pagina" varchar DEFAULT 'Escríbenos para consultas, colaboraciones o más información.',
  	"titulo_formulario" varchar DEFAULT 'Envíanos un mensaje',
  	"titulo_info" varchar DEFAULT 'Información de contacto',
  	"etiqueta_email" varchar DEFAULT 'Correo electrónico',
  	"etiqueta_ubicacion" varchar DEFAULT 'Ubicación',
  	"etiqueta_telefono" varchar DEFAULT 'Teléfono',
  	"etiqueta_programa" varchar DEFAULT 'Programa',
  	"programa_linea2" varchar DEFAULT 'Programa Desarrollo Productivo Sostenible — CORFO',
  	"titulo_ejecutores" varchar DEFAULT 'Ejecutado por',
  	"titulo_mandante" varchar DEFAULT 'Mandante',
  	"form_etiqueta_nombre" varchar DEFAULT 'Nombre completo',
  	"form_placeholder_nombre" varchar DEFAULT 'Tu nombre',
  	"form_etiqueta_email" varchar DEFAULT 'Correo electrónico',
  	"form_placeholder_email" varchar DEFAULT 'tu@email.com',
  	"form_etiqueta_asunto" varchar DEFAULT 'Asunto',
  	"form_opcion_por_defecto" varchar DEFAULT 'Selecciona un asunto',
  	"form_etiqueta_mensaje" varchar DEFAULT 'Mensaje',
  	"form_placeholder_mensaje" varchar DEFAULT 'Escribe tu mensaje aquí...',
  	"form_texto_boton" varchar DEFAULT 'Enviar mensaje',
  	"form_texto_enviando" varchar DEFAULT 'Enviando...',
  	"form_titulo_exito" varchar DEFAULT 'Mensaje enviado',
  	"form_texto_exito" varchar DEFAULT 'Gracias por contactarnos. Responderemos a la brevedad.',
  	"form_texto_otro_mensaje" varchar DEFAULT 'Enviar otro mensaje',
  	"form_texto_error" varchar DEFAULT 'Error al enviar. Por favor intenta nuevamente.',
  	"email" varchar DEFAULT 'h2varaucania@gmail.com' NOT NULL,
  	"ubicacion" varchar DEFAULT 'Temuco, Región de La Araucanía, Chile',
  	"telefono" varchar,
  	"ejecutor1" varchar DEFAULT 'CODESSER — Corporación de Desarrollo Social del Sector Rural',
  	"ejecutor2" varchar DEFAULT 'Universidad de Talca — Co-ejecutor técnico',
  	"mandante" varchar DEFAULT 'Subsecretaría de Energía — Ministerio de Energía',
  	"codigo_b_p" varchar DEFAULT 'Bien Público 24BP-269085',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "pagina_inicio_kpis" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"cifra" varchar NOT NULL,
  	"unidad" varchar,
  	"etiqueta" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "pagina_inicio_seccion_explora_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titulo" varchar NOT NULL,
  	"descripcion" varchar NOT NULL,
  	"enlace" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "pagina_inicio" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow" varchar DEFAULT 'Bien Público 24BP-269085 · Programa Estratégico Regional',
  	"hero_titulo" varchar DEFAULT 'Hidrógeno Verde en La Araucanía' NOT NULL,
  	"hero_subtitulo" varchar DEFAULT 'Plataforma informativa sobre los avances, proyectos y oportunidades del hidrógeno verde en la región de La Araucanía, Chile.' NOT NULL,
  	"hero_cta_primario" varchar DEFAULT 'Conozca el Programa',
  	"hero_cta_secundario" varchar DEFAULT 'Ver Proyectos en el Mapa',
  	"seccion_explora_kicker" varchar DEFAULT 'Explora',
  	"seccion_explora_titulo" varchar DEFAULT 'Explora el Programa',
  	"seccion_noticias_kicker" varchar DEFAULT 'Actualidad',
  	"seccion_noticias_titulo" varchar DEFAULT 'Ultimas Noticias',
  	"seccion_noticias_ver_todas" varchar DEFAULT 'Ver todas →',
  	"seccion_instituciones_titulo_apoyo" varchar DEFAULT 'Proyecto apoyado por',
  	"seccion_instituciones_titulo_participantes" varchar DEFAULT 'Instituciones participantes',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "pagina_quienes_somos_instituciones" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"nombre" varchar NOT NULL,
  	"rol" varchar NOT NULL,
  	"logo_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "pagina_quienes_somos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_titulo" varchar DEFAULT 'Quiénes Somos',
  	"hero_subtitulo" varchar DEFAULT 'El Programa Estratégico Regional de Hidrógeno Verde de La Araucanía impulsa el crecimiento socioeconómico regional mediante tecnologías de hidrógeno verde.',
  	"bien_publico_titulo" varchar DEFAULT 'El Bien Público',
  	"bien_publico_contenido" jsonb NOT NULL,
  	"consejo_titulo" varchar DEFAULT 'Consejo de Dirección del Hidrógeno Verde de Araucanía',
  	"consejo_descripcion" varchar DEFAULT 'Instancia estratégica encargada de definir la visión, aprobar planes de desarrollo y supervisar el progreso del proyecto.',
  	"comite_titulo" varchar DEFAULT 'Comité Consultivo Técnico Científico',
  	"comite_descripcion" varchar DEFAULT 'Integrado por miembros de la sociedad civil, ONGs y otros actores relevantes para fiscalizar y transparentar el desarrollo del proyecto.',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "pagina_gobernanza_nivel_estrategico_funciones" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"texto" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "pagina_gobernanza_nivel_operativo_funciones" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"texto" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "pagina_gobernanza_diagrama_equipos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"nombre" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "pagina_gobernanza_actividades" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"foto_id" integer NOT NULL,
  	"titulo" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pagina_gobernanza" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_titulo" varchar DEFAULT 'Modelo de Gobernanza',
  	"hero_subtitulo" varchar DEFAULT 'Estructura de dirección, gestión y control del programa para garantizar transparencia, eficiencia y sostenibilidad.',
  	"descripcion" varchar DEFAULT 'El modelo de gobernanza del programa se divide en dos niveles — estratégico y operativo — para asegurar una gestión integral y sostenible del proyecto.',
  	"nivel_estrategico_titulo" varchar DEFAULT 'Consejo de Dirección del Hidrógeno Verde de Araucanía',
  	"nivel_estrategico_descripcion" varchar DEFAULT 'Instancia máxima de dirección estratégica compuesta por representantes del Gobierno Regional, Ministerios, universidades, asociaciones empresariales, comunidades indígenas y expertos independientes.',
  	"nivel_estrategico_periodicidad" varchar DEFAULT 'Trimestralmente — Presencial y/o videoconferencia',
  	"nivel_operativo_titulo" varchar DEFAULT 'Unidad de Coordinación y Gestión del Proyecto',
  	"nivel_operativo_descripcion" varchar DEFAULT 'Compuesta por el Director del proyecto, equipo técnico, equipo de gestión financiera y equipo de comunicación y participación comunitaria.',
  	"nivel_operativo_periodicidad" varchar DEFAULT 'Cada 15 días — Presencial y/o videoconferencia',
  	"diagrama_consejo" varchar DEFAULT 'Consejo de Dirección H2V',
  	"diagrama_comite" varchar DEFAULT 'Comité Consultivo',
  	"diagrama_unidad" varchar DEFAULT 'Unidad de Coordinación y Gestión',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "pagina_h2v_electrolisis_pasos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titulo" varchar NOT NULL,
  	"descripcion" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "pagina_h2v_electrolizadores" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"nombre" varchar NOT NULL,
  	"descripcion" varchar NOT NULL,
  	"madurez" varchar,
  	"costo" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pagina_h2v_cadena_valor" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titulo" varchar NOT NULL,
  	"descripcion" varchar NOT NULL,
  	"icono" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pagina_h2v_derivados" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"nombre" varchar NOT NULL,
  	"descripcion" varchar NOT NULL,
  	"aplicacion" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pagina_h2v_explora_mas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titulo" varchar NOT NULL,
  	"descripcion" varchar NOT NULL,
  	"enlace" "enum_pagina_h2v_explora_mas_enlace" NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "pagina_h2v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_titulo" varchar DEFAULT 'Hidrógeno Verde',
  	"hero_subtitulo" varchar DEFAULT 'El hidrógeno verde es un vector energético producido mediante electrólisis del agua utilizando energías renovables. No genera emisiones de CO2 y es clave para la descarbonización de la economía.',
  	"que_es_titulo" varchar DEFAULT '¿Qué es el Hidrógeno Verde?',
  	"que_es_contenido" jsonb,
  	"electrolisis_titulo" varchar DEFAULT 'Proceso de Electrólisis',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "pagina_sectores_sectores_oportunidades" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"texto" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "pagina_sectores_sectores" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"nombre" varchar NOT NULL,
  	"icono" varchar,
  	"descripcion" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "pagina_sectores" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_titulo" varchar DEFAULT 'Sectores Productivos',
  	"hero_subtitulo" varchar DEFAULT 'Sectores de La Araucanía con potencial de integración del hidrógeno verde para su desarrollo sostenible.',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "pagina_hoja_ruta_hitos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"periodo" varchar NOT NULL,
  	"titulo" varchar NOT NULL,
  	"descripcion" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "pagina_hoja_ruta" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_titulo" varchar DEFAULT 'Hoja de Ruta',
  	"hero_subtitulo" varchar DEFAULT 'Estrategia regional para el desarrollo del hidrógeno verde en La Araucanía, horizonte 2024-2050.',
  	"nota_final" varchar DEFAULT 'La Hoja de Ruta detallada se publicará como documento descargable una vez completado el proceso de diagnóstico regional.',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "pagina_comunidad_participacion_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"texto" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "pagina_comunidad_compromisos_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"texto" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "pagina_comunidad_glosario" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"mapudungun" varchar NOT NULL,
  	"espanol" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "pagina_comunidad" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_titulo" varchar DEFAULT 'Comunidad y Participación',
  	"hero_subtitulo" varchar DEFAULT 'El desarrollo del hidrógeno verde en La Araucanía se construye con la participación activa de las comunidades y actores territoriales.',
  	"introduccion" jsonb,
  	"participacion_titulo" varchar DEFAULT 'Participación en gobernanza',
  	"compromisos_titulo" varchar DEFAULT 'Compromiso con el territorio',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "pagina_capital_humano_perfiles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"texto" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "pagina_capital_humano_programas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"texto" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "pagina_capital_humano" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_titulo" varchar DEFAULT 'Capital Humano',
  	"hero_subtitulo" varchar DEFAULT 'Formación y desarrollo de competencias para la industria del hidrógeno verde en La Araucanía.',
  	"introduccion" jsonb,
  	"nota_oportunidad" jsonb,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "pagina_marco_regulatorio_documentos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titulo" varchar NOT NULL,
  	"descripcion" varchar NOT NULL,
  	"relevancia" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pagina_marco_regulatorio" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_titulo" varchar DEFAULT 'Marco Regulatorio',
  	"hero_subtitulo" varchar DEFAULT 'Normativa, políticas y lineamientos para el desarrollo del hidrógeno verde en Chile.',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "pagina_transparencia_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titulo" varchar NOT NULL,
  	"descripcion" varchar NOT NULL,
  	"estado" varchar DEFAULT 'Próximamente'
  );
  
  CREATE TABLE IF NOT EXISTS "pagina_transparencia" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_titulo" varchar DEFAULT 'Transparencia',
  	"hero_subtitulo" varchar DEFAULT 'Rendición de cuentas y registro de actividades del programa.',
  	"introduccion" varchar DEFAULT 'El programa de Hidrógeno Verde de La Araucanía se compromete con la transparencia en la gestión de recursos públicos y la rendición de cuentas a la ciudadanía.',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "pagina_mediateca_recursos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titulo" varchar NOT NULL,
  	"tipo" "enum_pagina_mediateca_recursos_tipo" DEFAULT 'video',
  	"url" varchar NOT NULL,
  	"descripcion" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pagina_mediateca" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_titulo" varchar DEFAULT 'Mediateca',
  	"hero_subtitulo" varchar DEFAULT 'Videos, infografías y material multimedia del programa.',
  	"mensaje_vacio_titulo" varchar DEFAULT 'Próximamente se publicará material multimedia.',
  	"mensaje_vacio_subtitulo" varchar DEFAULT 'Videos, infografías y presentaciones del programa se alojarán en esta sección.',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "pagina_proyectos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_titulo" varchar DEFAULT 'Mapa de Proyectos',
  	"hero_subtitulo" varchar DEFAULT 'Proyectos de hidrógeno verde en desarrollo y ejecución a nivel regional y nacional.',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "pagina_privacidad" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_titulo" varchar DEFAULT 'Política de Privacidad',
  	"hero_subtitulo" varchar DEFAULT 'Protección de datos personales conforme a la legislación chilena.',
  	"fecha_actualizacion" varchar DEFAULT 'abril 2026',
  	"contenido" jsonb,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "pagina_accesibilidad" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_titulo" varchar DEFAULT 'Accesibilidad',
  	"hero_subtitulo" varchar DEFAULT 'Nuestro compromiso con un sitio web accesible para todas las personas.',
  	"contenido" jsonb,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "guia_admin" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"instrucciones" jsonb,
  	"guia_completa" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  
  -- Replay defensivo: tablas preexistentes reciben SOLO las columnas que les falten.
  ALTER TABLE "users_sessions" ADD COLUMN IF NOT EXISTS "_order" integer NOT NULL;
  ALTER TABLE "users_sessions" ADD COLUMN IF NOT EXISTS "_parent_id" integer NOT NULL;
  ALTER TABLE "users_sessions" ADD COLUMN IF NOT EXISTS "id" varchar PRIMARY KEY NOT NULL;
  ALTER TABLE "users_sessions" ADD COLUMN IF NOT EXISTS "created_at" timestamp(3) with time zone;
  ALTER TABLE "users_sessions" ADD COLUMN IF NOT EXISTS "expires_at" timestamp(3) with time zone NOT NULL;
  ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "nombre" varchar NOT NULL;
  ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "role" "enum_users_role" DEFAULT 'registrado' NOT NULL;
  ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "institucion" varchar;
  ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL;
  ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL;
  ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "email" varchar NOT NULL;
  ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "reset_password_token" varchar;
  ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "reset_password_expiration" timestamp(3) with time zone;
  ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "salt" varchar;
  ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "hash" varchar;
  ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "login_attempts" numeric DEFAULT 0;
  ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "lock_until" timestamp(3) with time zone;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "alt" varchar NOT NULL;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "url" varchar;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "thumbnail_u_r_l" varchar;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "filename" varchar;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "filesize" numeric;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "width" numeric;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "height" numeric;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "focal_x" numeric;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "focal_y" numeric;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_thumbnail_url" varchar;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_thumbnail_width" numeric;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_thumbnail_height" numeric;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_thumbnail_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_thumbnail_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_thumbnail_filename" varchar;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_card_url" varchar;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_card_width" numeric;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_card_height" numeric;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_card_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_card_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_card_filename" varchar;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_hero_url" varchar;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_hero_width" numeric;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_hero_height" numeric;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_hero_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_hero_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_hero_filename" varchar;
  ALTER TABLE "noticias" ADD COLUMN IF NOT EXISTS "titulo" varchar;
  ALTER TABLE "noticias" ADD COLUMN IF NOT EXISTS "slug" varchar;
  ALTER TABLE "noticias" ADD COLUMN IF NOT EXISTS "extracto" varchar;
  ALTER TABLE "noticias" ADD COLUMN IF NOT EXISTS "contenido" jsonb;
  ALTER TABLE "noticias" ADD COLUMN IF NOT EXISTS "imagen_id" integer;
  ALTER TABLE "noticias" ADD COLUMN IF NOT EXISTS "fecha" timestamp(3) with time zone;
  ALTER TABLE "noticias" ADD COLUMN IF NOT EXISTS "categoria" "enum_noticias_categoria";
  ALTER TABLE "noticias" ADD COLUMN IF NOT EXISTS "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL;
  ALTER TABLE "noticias" ADD COLUMN IF NOT EXISTS "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL;
  ALTER TABLE "noticias" ADD COLUMN IF NOT EXISTS "_status" "enum_noticias_status" DEFAULT 'draft';
  ALTER TABLE "_noticias_v" ADD COLUMN IF NOT EXISTS "parent_id" integer;
  ALTER TABLE "_noticias_v" ADD COLUMN IF NOT EXISTS "version_titulo" varchar;
  ALTER TABLE "_noticias_v" ADD COLUMN IF NOT EXISTS "version_slug" varchar;
  ALTER TABLE "_noticias_v" ADD COLUMN IF NOT EXISTS "version_extracto" varchar;
  ALTER TABLE "_noticias_v" ADD COLUMN IF NOT EXISTS "version_contenido" jsonb;
  ALTER TABLE "_noticias_v" ADD COLUMN IF NOT EXISTS "version_imagen_id" integer;
  ALTER TABLE "_noticias_v" ADD COLUMN IF NOT EXISTS "version_fecha" timestamp(3) with time zone;
  ALTER TABLE "_noticias_v" ADD COLUMN IF NOT EXISTS "version_categoria" "enum__noticias_v_version_categoria";
  ALTER TABLE "_noticias_v" ADD COLUMN IF NOT EXISTS "version_updated_at" timestamp(3) with time zone;
  ALTER TABLE "_noticias_v" ADD COLUMN IF NOT EXISTS "version_created_at" timestamp(3) with time zone;
  ALTER TABLE "_noticias_v" ADD COLUMN IF NOT EXISTS "version__status" "enum__noticias_v_version_status" DEFAULT 'draft';
  ALTER TABLE "_noticias_v" ADD COLUMN IF NOT EXISTS "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL;
  ALTER TABLE "_noticias_v" ADD COLUMN IF NOT EXISTS "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL;
  ALTER TABLE "_noticias_v" ADD COLUMN IF NOT EXISTS "latest" boolean;
  ALTER TABLE "_noticias_v" ADD COLUMN IF NOT EXISTS "autosave" boolean;
  ALTER TABLE "documentos" ADD COLUMN IF NOT EXISTS "titulo" varchar NOT NULL;
  ALTER TABLE "documentos" ADD COLUMN IF NOT EXISTS "descripcion" varchar NOT NULL;
  ALTER TABLE "documentos" ADD COLUMN IF NOT EXISTS "archivo_id" integer NOT NULL;
  ALTER TABLE "documentos" ADD COLUMN IF NOT EXISTS "thumbnail_id" integer;
  ALTER TABLE "documentos" ADD COLUMN IF NOT EXISTS "tipo" "enum_documentos_tipo" NOT NULL;
  ALTER TABLE "documentos" ADD COLUMN IF NOT EXISTS "anio" numeric NOT NULL;
  ALTER TABLE "documentos" ADD COLUMN IF NOT EXISTS "descargas" numeric DEFAULT 0;
  ALTER TABLE "documentos" ADD COLUMN IF NOT EXISTS "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL;
  ALTER TABLE "documentos" ADD COLUMN IF NOT EXISTS "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL;
  ALTER TABLE "proyectos" ADD COLUMN IF NOT EXISTS "nombre" varchar NOT NULL;
  ALTER TABLE "proyectos" ADD COLUMN IF NOT EXISTS "descripcion" varchar NOT NULL;
  ALTER TABLE "proyectos" ADD COLUMN IF NOT EXISTS "empresa" varchar NOT NULL;
  ALTER TABLE "proyectos" ADD COLUMN IF NOT EXISTS "etapa" "enum_proyectos_etapa" NOT NULL;
  ALTER TABLE "proyectos" ADD COLUMN IF NOT EXISTS "region" "enum_proyectos_region" NOT NULL;
  ALTER TABLE "proyectos" ADD COLUMN IF NOT EXISTS "coordenadas_lat" numeric NOT NULL;
  ALTER TABLE "proyectos" ADD COLUMN IF NOT EXISTS "coordenadas_lng" numeric NOT NULL;
  ALTER TABLE "proyectos" ADD COLUMN IF NOT EXISTS "capacidad_m_w" numeric;
  ALTER TABLE "proyectos" ADD COLUMN IF NOT EXISTS "produccion_ton_anio" numeric;
  ALTER TABLE "proyectos" ADD COLUMN IF NOT EXISTS "imagen_id" integer;
  ALTER TABLE "proyectos" ADD COLUMN IF NOT EXISTS "url" varchar;
  ALTER TABLE "proyectos" ADD COLUMN IF NOT EXISTS "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL;
  ALTER TABLE "proyectos" ADD COLUMN IF NOT EXISTS "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL;
  ALTER TABLE "miembros" ADD COLUMN IF NOT EXISTS "nombre" varchar NOT NULL;
  ALTER TABLE "miembros" ADD COLUMN IF NOT EXISTS "cargo" varchar NOT NULL;
  ALTER TABLE "miembros" ADD COLUMN IF NOT EXISTS "institucion" varchar NOT NULL;
  ALTER TABLE "miembros" ADD COLUMN IF NOT EXISTS "instancia" "enum_miembros_instancia" NOT NULL;
  ALTER TABLE "miembros" ADD COLUMN IF NOT EXISTS "foto_id" integer;
  ALTER TABLE "miembros" ADD COLUMN IF NOT EXISTS "aporte" varchar;
  ALTER TABLE "miembros" ADD COLUMN IF NOT EXISTS "suplente" varchar;
  ALTER TABLE "miembros" ADD COLUMN IF NOT EXISTS "orden" numeric DEFAULT 0;
  ALTER TABLE "miembros" ADD COLUMN IF NOT EXISTS "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL;
  ALTER TABLE "miembros" ADD COLUMN IF NOT EXISTS "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL;
  ALTER TABLE "downloads" ADD COLUMN IF NOT EXISTS "documento_id" integer NOT NULL;
  ALTER TABLE "downloads" ADD COLUMN IF NOT EXISTS "user_id" integer;
  ALTER TABLE "downloads" ADD COLUMN IF NOT EXISTS "downloaded_at" timestamp(3) with time zone NOT NULL;
  ALTER TABLE "downloads" ADD COLUMN IF NOT EXISTS "ip" varchar;
  ALTER TABLE "downloads" ADD COLUMN IF NOT EXISTS "user_agent" varchar;
  ALTER TABLE "downloads" ADD COLUMN IF NOT EXISTS "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL;
  ALTER TABLE "downloads" ADD COLUMN IF NOT EXISTS "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL;
  ALTER TABLE "video_views" ADD COLUMN IF NOT EXISTS "video_titulo" varchar NOT NULL;
  ALTER TABLE "video_views" ADD COLUMN IF NOT EXISTS "video_key" varchar NOT NULL;
  ALTER TABLE "video_views" ADD COLUMN IF NOT EXISTS "evento" "enum_video_views_evento" NOT NULL;
  ALTER TABLE "video_views" ADD COLUMN IF NOT EXISTS "segundos_vistos" numeric DEFAULT 0;
  ALTER TABLE "video_views" ADD COLUMN IF NOT EXISTS "session_id" varchar;
  ALTER TABLE "video_views" ADD COLUMN IF NOT EXISTS "user_id" integer;
  ALTER TABLE "video_views" ADD COLUMN IF NOT EXISTS "watched_at" timestamp(3) with time zone NOT NULL;
  ALTER TABLE "video_views" ADD COLUMN IF NOT EXISTS "ip" varchar;
  ALTER TABLE "video_views" ADD COLUMN IF NOT EXISTS "user_agent" varchar;
  ALTER TABLE "video_views" ADD COLUMN IF NOT EXISTS "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL;
  ALTER TABLE "video_views" ADD COLUMN IF NOT EXISTS "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL;
  ALTER TABLE "eventos" ADD COLUMN IF NOT EXISTS "titulo" varchar;
  ALTER TABLE "eventos" ADD COLUMN IF NOT EXISTS "descripcion" jsonb;
  ALTER TABLE "eventos" ADD COLUMN IF NOT EXISTS "fecha" timestamp(3) with time zone;
  ALTER TABLE "eventos" ADD COLUMN IF NOT EXISTS "fecha_fin" timestamp(3) with time zone;
  ALTER TABLE "eventos" ADD COLUMN IF NOT EXISTS "lugar" varchar;
  ALTER TABLE "eventos" ADD COLUMN IF NOT EXISTS "tipo" "enum_eventos_tipo";
  ALTER TABLE "eventos" ADD COLUMN IF NOT EXISTS "imagen_id" integer;
  ALTER TABLE "eventos" ADD COLUMN IF NOT EXISTS "url_inscripcion" varchar;
  ALTER TABLE "eventos" ADD COLUMN IF NOT EXISTS "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL;
  ALTER TABLE "eventos" ADD COLUMN IF NOT EXISTS "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL;
  ALTER TABLE "eventos" ADD COLUMN IF NOT EXISTS "_status" "enum_eventos_status" DEFAULT 'draft';
  ALTER TABLE "_eventos_v" ADD COLUMN IF NOT EXISTS "parent_id" integer;
  ALTER TABLE "_eventos_v" ADD COLUMN IF NOT EXISTS "version_titulo" varchar;
  ALTER TABLE "_eventos_v" ADD COLUMN IF NOT EXISTS "version_descripcion" jsonb;
  ALTER TABLE "_eventos_v" ADD COLUMN IF NOT EXISTS "version_fecha" timestamp(3) with time zone;
  ALTER TABLE "_eventos_v" ADD COLUMN IF NOT EXISTS "version_fecha_fin" timestamp(3) with time zone;
  ALTER TABLE "_eventos_v" ADD COLUMN IF NOT EXISTS "version_lugar" varchar;
  ALTER TABLE "_eventos_v" ADD COLUMN IF NOT EXISTS "version_tipo" "enum__eventos_v_version_tipo";
  ALTER TABLE "_eventos_v" ADD COLUMN IF NOT EXISTS "version_imagen_id" integer;
  ALTER TABLE "_eventos_v" ADD COLUMN IF NOT EXISTS "version_url_inscripcion" varchar;
  ALTER TABLE "_eventos_v" ADD COLUMN IF NOT EXISTS "version_updated_at" timestamp(3) with time zone;
  ALTER TABLE "_eventos_v" ADD COLUMN IF NOT EXISTS "version_created_at" timestamp(3) with time zone;
  ALTER TABLE "_eventos_v" ADD COLUMN IF NOT EXISTS "version__status" "enum__eventos_v_version_status" DEFAULT 'draft';
  ALTER TABLE "_eventos_v" ADD COLUMN IF NOT EXISTS "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL;
  ALTER TABLE "_eventos_v" ADD COLUMN IF NOT EXISTS "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL;
  ALTER TABLE "_eventos_v" ADD COLUMN IF NOT EXISTS "latest" boolean;
  ALTER TABLE "_eventos_v" ADD COLUMN IF NOT EXISTS "autosave" boolean;
  ALTER TABLE "payload_kv" ADD COLUMN IF NOT EXISTS "key" varchar NOT NULL;
  ALTER TABLE "payload_kv" ADD COLUMN IF NOT EXISTS "data" jsonb NOT NULL;
  ALTER TABLE "payload_locked_documents" ADD COLUMN IF NOT EXISTS "global_slug" varchar;
  ALTER TABLE "payload_locked_documents" ADD COLUMN IF NOT EXISTS "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL;
  ALTER TABLE "payload_locked_documents" ADD COLUMN IF NOT EXISTS "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "order" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "parent_id" integer NOT NULL;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "path" varchar NOT NULL;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "users_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "media_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "noticias_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "documentos_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "proyectos_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "miembros_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "downloads_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "video_views_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "eventos_id" integer;
  ALTER TABLE "payload_preferences" ADD COLUMN IF NOT EXISTS "key" varchar;
  ALTER TABLE "payload_preferences" ADD COLUMN IF NOT EXISTS "value" jsonb;
  ALTER TABLE "payload_preferences" ADD COLUMN IF NOT EXISTS "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL;
  ALTER TABLE "payload_preferences" ADD COLUMN IF NOT EXISTS "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL;
  ALTER TABLE "payload_preferences_rels" ADD COLUMN IF NOT EXISTS "order" integer;
  ALTER TABLE "payload_preferences_rels" ADD COLUMN IF NOT EXISTS "parent_id" integer NOT NULL;
  ALTER TABLE "payload_preferences_rels" ADD COLUMN IF NOT EXISTS "path" varchar NOT NULL;
  ALTER TABLE "payload_preferences_rels" ADD COLUMN IF NOT EXISTS "users_id" integer;
  ALTER TABLE "payload_migrations" ADD COLUMN IF NOT EXISTS "name" varchar;
  ALTER TABLE "payload_migrations" ADD COLUMN IF NOT EXISTS "batch" numeric;
  ALTER TABLE "payload_migrations" ADD COLUMN IF NOT EXISTS "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL;
  ALTER TABLE "payload_migrations" ADD COLUMN IF NOT EXISTS "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL;
  ALTER TABLE "sitio_general_instituciones" ADD COLUMN IF NOT EXISTS "_order" integer NOT NULL;
  ALTER TABLE "sitio_general_instituciones" ADD COLUMN IF NOT EXISTS "_parent_id" integer NOT NULL;
  ALTER TABLE "sitio_general_instituciones" ADD COLUMN IF NOT EXISTS "id" varchar PRIMARY KEY NOT NULL;
  ALTER TABLE "sitio_general_instituciones" ADD COLUMN IF NOT EXISTS "nombre" varchar NOT NULL;
  ALTER TABLE "sitio_general_instituciones" ADD COLUMN IF NOT EXISTS "logo_id" integer NOT NULL;
  ALTER TABLE "sitio_general" ADD COLUMN IF NOT EXISTS "nombre_sitio" varchar DEFAULT 'H2V Araucanía';
  ALTER TABLE "sitio_general" ADD COLUMN IF NOT EXISTS "descripcion_s_e_o" varchar DEFAULT 'Plataforma informativa sobre los avances, proyectos y oportunidades del hidrógeno verde en la región de La Araucanía, Chile.';
  ALTER TABLE "sitio_general" ADD COLUMN IF NOT EXISTS "footer_texto" varchar DEFAULT 'Plataforma informativa del Bien Público 24BP-269085. Programa Estratégico Regional de Hidrógeno Verde en La Araucanía.';
  ALTER TABLE "sitio_general" ADD COLUMN IF NOT EXISTS "footer_programa" varchar DEFAULT 'Programa Desarrollo Productivo Sostenible — CORFO';
  ALTER TABLE "sitio_general" ADD COLUMN IF NOT EXISTS "titulo_navegacion" varchar DEFAULT 'Navegación';
  ALTER TABLE "sitio_general" ADD COLUMN IF NOT EXISTS "titulo_contacto_footer" varchar DEFAULT 'Contacto';
  ALTER TABLE "sitio_general" ADD COLUMN IF NOT EXISTS "titulo_apoyo_footer" varchar DEFAULT 'Proyecto apoyado por';
  ALTER TABLE "sitio_general" ADD COLUMN IF NOT EXISTS "derechos" varchar DEFAULT 'Todos los derechos reservados.';
  ALTER TABLE "sitio_general" ADD COLUMN IF NOT EXISTS "titulo404" varchar DEFAULT 'Página no encontrada';
  ALTER TABLE "sitio_general" ADD COLUMN IF NOT EXISTS "texto404" varchar DEFAULT 'La página que buscas no existe o fue movida. Puedes volver al inicio o explorar las secciones del programa.';
  ALTER TABLE "sitio_general" ADD COLUMN IF NOT EXISTS "boton404" varchar DEFAULT 'Volver al inicio';
  ALTER TABLE "sitio_general" ADD COLUMN IF NOT EXISTS "boton404_secundario" varchar DEFAULT 'Ver proyectos';
  ALTER TABLE "sitio_general" ADD COLUMN IF NOT EXISTS "updated_at" timestamp(3) with time zone;
  ALTER TABLE "sitio_general" ADD COLUMN IF NOT EXISTS "created_at" timestamp(3) with time zone;
  ALTER TABLE "contacto_form_opciones_asunto" ADD COLUMN IF NOT EXISTS "_order" integer NOT NULL;
  ALTER TABLE "contacto_form_opciones_asunto" ADD COLUMN IF NOT EXISTS "_parent_id" integer NOT NULL;
  ALTER TABLE "contacto_form_opciones_asunto" ADD COLUMN IF NOT EXISTS "id" varchar PRIMARY KEY NOT NULL;
  ALTER TABLE "contacto_form_opciones_asunto" ADD COLUMN IF NOT EXISTS "etiqueta" varchar NOT NULL;
  ALTER TABLE "contacto_form_opciones_asunto" ADD COLUMN IF NOT EXISTS "valor" varchar NOT NULL;
  ALTER TABLE "contacto" ADD COLUMN IF NOT EXISTS "titulo_pagina" varchar DEFAULT 'Contacto';
  ALTER TABLE "contacto" ADD COLUMN IF NOT EXISTS "bajada_pagina" varchar DEFAULT 'Escríbenos para consultas, colaboraciones o más información.';
  ALTER TABLE "contacto" ADD COLUMN IF NOT EXISTS "titulo_formulario" varchar DEFAULT 'Envíanos un mensaje';
  ALTER TABLE "contacto" ADD COLUMN IF NOT EXISTS "titulo_info" varchar DEFAULT 'Información de contacto';
  ALTER TABLE "contacto" ADD COLUMN IF NOT EXISTS "etiqueta_email" varchar DEFAULT 'Correo electrónico';
  ALTER TABLE "contacto" ADD COLUMN IF NOT EXISTS "etiqueta_ubicacion" varchar DEFAULT 'Ubicación';
  ALTER TABLE "contacto" ADD COLUMN IF NOT EXISTS "etiqueta_telefono" varchar DEFAULT 'Teléfono';
  ALTER TABLE "contacto" ADD COLUMN IF NOT EXISTS "etiqueta_programa" varchar DEFAULT 'Programa';
  ALTER TABLE "contacto" ADD COLUMN IF NOT EXISTS "programa_linea2" varchar DEFAULT 'Programa Desarrollo Productivo Sostenible — CORFO';
  ALTER TABLE "contacto" ADD COLUMN IF NOT EXISTS "titulo_ejecutores" varchar DEFAULT 'Ejecutado por';
  ALTER TABLE "contacto" ADD COLUMN IF NOT EXISTS "titulo_mandante" varchar DEFAULT 'Mandante';
  ALTER TABLE "contacto" ADD COLUMN IF NOT EXISTS "form_etiqueta_nombre" varchar DEFAULT 'Nombre completo';
  ALTER TABLE "contacto" ADD COLUMN IF NOT EXISTS "form_placeholder_nombre" varchar DEFAULT 'Tu nombre';
  ALTER TABLE "contacto" ADD COLUMN IF NOT EXISTS "form_etiqueta_email" varchar DEFAULT 'Correo electrónico';
  ALTER TABLE "contacto" ADD COLUMN IF NOT EXISTS "form_placeholder_email" varchar DEFAULT 'tu@email.com';
  ALTER TABLE "contacto" ADD COLUMN IF NOT EXISTS "form_etiqueta_asunto" varchar DEFAULT 'Asunto';
  ALTER TABLE "contacto" ADD COLUMN IF NOT EXISTS "form_opcion_por_defecto" varchar DEFAULT 'Selecciona un asunto';
  ALTER TABLE "contacto" ADD COLUMN IF NOT EXISTS "form_etiqueta_mensaje" varchar DEFAULT 'Mensaje';
  ALTER TABLE "contacto" ADD COLUMN IF NOT EXISTS "form_placeholder_mensaje" varchar DEFAULT 'Escribe tu mensaje aquí...';
  ALTER TABLE "contacto" ADD COLUMN IF NOT EXISTS "form_texto_boton" varchar DEFAULT 'Enviar mensaje';
  ALTER TABLE "contacto" ADD COLUMN IF NOT EXISTS "form_texto_enviando" varchar DEFAULT 'Enviando...';
  ALTER TABLE "contacto" ADD COLUMN IF NOT EXISTS "form_titulo_exito" varchar DEFAULT 'Mensaje enviado';
  ALTER TABLE "contacto" ADD COLUMN IF NOT EXISTS "form_texto_exito" varchar DEFAULT 'Gracias por contactarnos. Responderemos a la brevedad.';
  ALTER TABLE "contacto" ADD COLUMN IF NOT EXISTS "form_texto_otro_mensaje" varchar DEFAULT 'Enviar otro mensaje';
  ALTER TABLE "contacto" ADD COLUMN IF NOT EXISTS "form_texto_error" varchar DEFAULT 'Error al enviar. Por favor intenta nuevamente.';
  ALTER TABLE "contacto" ADD COLUMN IF NOT EXISTS "email" varchar DEFAULT 'h2varaucania@gmail.com' NOT NULL;
  ALTER TABLE "contacto" ADD COLUMN IF NOT EXISTS "ubicacion" varchar DEFAULT 'Temuco, Región de La Araucanía, Chile';
  ALTER TABLE "contacto" ADD COLUMN IF NOT EXISTS "telefono" varchar;
  ALTER TABLE "contacto" ADD COLUMN IF NOT EXISTS "ejecutor1" varchar DEFAULT 'CODESSER — Corporación de Desarrollo Social del Sector Rural';
  ALTER TABLE "contacto" ADD COLUMN IF NOT EXISTS "ejecutor2" varchar DEFAULT 'Universidad de Talca — Co-ejecutor técnico';
  ALTER TABLE "contacto" ADD COLUMN IF NOT EXISTS "mandante" varchar DEFAULT 'Subsecretaría de Energía — Ministerio de Energía';
  ALTER TABLE "contacto" ADD COLUMN IF NOT EXISTS "codigo_b_p" varchar DEFAULT 'Bien Público 24BP-269085';
  ALTER TABLE "contacto" ADD COLUMN IF NOT EXISTS "updated_at" timestamp(3) with time zone;
  ALTER TABLE "contacto" ADD COLUMN IF NOT EXISTS "created_at" timestamp(3) with time zone;
  ALTER TABLE "pagina_inicio_kpis" ADD COLUMN IF NOT EXISTS "_order" integer NOT NULL;
  ALTER TABLE "pagina_inicio_kpis" ADD COLUMN IF NOT EXISTS "_parent_id" integer NOT NULL;
  ALTER TABLE "pagina_inicio_kpis" ADD COLUMN IF NOT EXISTS "id" varchar PRIMARY KEY NOT NULL;
  ALTER TABLE "pagina_inicio_kpis" ADD COLUMN IF NOT EXISTS "cifra" varchar NOT NULL;
  ALTER TABLE "pagina_inicio_kpis" ADD COLUMN IF NOT EXISTS "unidad" varchar;
  ALTER TABLE "pagina_inicio_kpis" ADD COLUMN IF NOT EXISTS "etiqueta" varchar NOT NULL;
  ALTER TABLE "pagina_inicio_seccion_explora_cards" ADD COLUMN IF NOT EXISTS "_order" integer NOT NULL;
  ALTER TABLE "pagina_inicio_seccion_explora_cards" ADD COLUMN IF NOT EXISTS "_parent_id" integer NOT NULL;
  ALTER TABLE "pagina_inicio_seccion_explora_cards" ADD COLUMN IF NOT EXISTS "id" varchar PRIMARY KEY NOT NULL;
  ALTER TABLE "pagina_inicio_seccion_explora_cards" ADD COLUMN IF NOT EXISTS "titulo" varchar NOT NULL;
  ALTER TABLE "pagina_inicio_seccion_explora_cards" ADD COLUMN IF NOT EXISTS "descripcion" varchar NOT NULL;
  ALTER TABLE "pagina_inicio_seccion_explora_cards" ADD COLUMN IF NOT EXISTS "enlace" varchar NOT NULL;
  ALTER TABLE "pagina_inicio" ADD COLUMN IF NOT EXISTS "hero_eyebrow" varchar DEFAULT 'Bien Público 24BP-269085 · Programa Estratégico Regional';
  ALTER TABLE "pagina_inicio" ADD COLUMN IF NOT EXISTS "hero_titulo" varchar DEFAULT 'Hidrógeno Verde en La Araucanía' NOT NULL;
  ALTER TABLE "pagina_inicio" ADD COLUMN IF NOT EXISTS "hero_subtitulo" varchar DEFAULT 'Plataforma informativa sobre los avances, proyectos y oportunidades del hidrógeno verde en la región de La Araucanía, Chile.' NOT NULL;
  ALTER TABLE "pagina_inicio" ADD COLUMN IF NOT EXISTS "hero_cta_primario" varchar DEFAULT 'Conozca el Programa';
  ALTER TABLE "pagina_inicio" ADD COLUMN IF NOT EXISTS "hero_cta_secundario" varchar DEFAULT 'Ver Proyectos en el Mapa';
  ALTER TABLE "pagina_inicio" ADD COLUMN IF NOT EXISTS "seccion_explora_kicker" varchar DEFAULT 'Explora';
  ALTER TABLE "pagina_inicio" ADD COLUMN IF NOT EXISTS "seccion_explora_titulo" varchar DEFAULT 'Explora el Programa';
  ALTER TABLE "pagina_inicio" ADD COLUMN IF NOT EXISTS "seccion_noticias_kicker" varchar DEFAULT 'Actualidad';
  ALTER TABLE "pagina_inicio" ADD COLUMN IF NOT EXISTS "seccion_noticias_titulo" varchar DEFAULT 'Ultimas Noticias';
  ALTER TABLE "pagina_inicio" ADD COLUMN IF NOT EXISTS "seccion_noticias_ver_todas" varchar DEFAULT 'Ver todas →';
  ALTER TABLE "pagina_inicio" ADD COLUMN IF NOT EXISTS "seccion_instituciones_titulo_apoyo" varchar DEFAULT 'Proyecto apoyado por';
  ALTER TABLE "pagina_inicio" ADD COLUMN IF NOT EXISTS "seccion_instituciones_titulo_participantes" varchar DEFAULT 'Instituciones participantes';
  ALTER TABLE "pagina_inicio" ADD COLUMN IF NOT EXISTS "updated_at" timestamp(3) with time zone;
  ALTER TABLE "pagina_inicio" ADD COLUMN IF NOT EXISTS "created_at" timestamp(3) with time zone;
  ALTER TABLE "pagina_quienes_somos_instituciones" ADD COLUMN IF NOT EXISTS "_order" integer NOT NULL;
  ALTER TABLE "pagina_quienes_somos_instituciones" ADD COLUMN IF NOT EXISTS "_parent_id" integer NOT NULL;
  ALTER TABLE "pagina_quienes_somos_instituciones" ADD COLUMN IF NOT EXISTS "id" varchar PRIMARY KEY NOT NULL;
  ALTER TABLE "pagina_quienes_somos_instituciones" ADD COLUMN IF NOT EXISTS "nombre" varchar NOT NULL;
  ALTER TABLE "pagina_quienes_somos_instituciones" ADD COLUMN IF NOT EXISTS "rol" varchar NOT NULL;
  ALTER TABLE "pagina_quienes_somos_instituciones" ADD COLUMN IF NOT EXISTS "logo_id" integer;
  ALTER TABLE "pagina_quienes_somos" ADD COLUMN IF NOT EXISTS "hero_titulo" varchar DEFAULT 'Quiénes Somos';
  ALTER TABLE "pagina_quienes_somos" ADD COLUMN IF NOT EXISTS "hero_subtitulo" varchar DEFAULT 'El Programa Estratégico Regional de Hidrógeno Verde de La Araucanía impulsa el crecimiento socioeconómico regional mediante tecnologías de hidrógeno verde.';
  ALTER TABLE "pagina_quienes_somos" ADD COLUMN IF NOT EXISTS "bien_publico_titulo" varchar DEFAULT 'El Bien Público';
  ALTER TABLE "pagina_quienes_somos" ADD COLUMN IF NOT EXISTS "bien_publico_contenido" jsonb NOT NULL;
  ALTER TABLE "pagina_quienes_somos" ADD COLUMN IF NOT EXISTS "consejo_titulo" varchar DEFAULT 'Consejo de Dirección del Hidrógeno Verde de Araucanía';
  ALTER TABLE "pagina_quienes_somos" ADD COLUMN IF NOT EXISTS "consejo_descripcion" varchar DEFAULT 'Instancia estratégica encargada de definir la visión, aprobar planes de desarrollo y supervisar el progreso del proyecto.';
  ALTER TABLE "pagina_quienes_somos" ADD COLUMN IF NOT EXISTS "comite_titulo" varchar DEFAULT 'Comité Consultivo Técnico Científico';
  ALTER TABLE "pagina_quienes_somos" ADD COLUMN IF NOT EXISTS "comite_descripcion" varchar DEFAULT 'Integrado por miembros de la sociedad civil, ONGs y otros actores relevantes para fiscalizar y transparentar el desarrollo del proyecto.';
  ALTER TABLE "pagina_quienes_somos" ADD COLUMN IF NOT EXISTS "updated_at" timestamp(3) with time zone;
  ALTER TABLE "pagina_quienes_somos" ADD COLUMN IF NOT EXISTS "created_at" timestamp(3) with time zone;
  ALTER TABLE "pagina_gobernanza_nivel_estrategico_funciones" ADD COLUMN IF NOT EXISTS "_order" integer NOT NULL;
  ALTER TABLE "pagina_gobernanza_nivel_estrategico_funciones" ADD COLUMN IF NOT EXISTS "_parent_id" integer NOT NULL;
  ALTER TABLE "pagina_gobernanza_nivel_estrategico_funciones" ADD COLUMN IF NOT EXISTS "id" varchar PRIMARY KEY NOT NULL;
  ALTER TABLE "pagina_gobernanza_nivel_estrategico_funciones" ADD COLUMN IF NOT EXISTS "texto" varchar NOT NULL;
  ALTER TABLE "pagina_gobernanza_nivel_operativo_funciones" ADD COLUMN IF NOT EXISTS "_order" integer NOT NULL;
  ALTER TABLE "pagina_gobernanza_nivel_operativo_funciones" ADD COLUMN IF NOT EXISTS "_parent_id" integer NOT NULL;
  ALTER TABLE "pagina_gobernanza_nivel_operativo_funciones" ADD COLUMN IF NOT EXISTS "id" varchar PRIMARY KEY NOT NULL;
  ALTER TABLE "pagina_gobernanza_nivel_operativo_funciones" ADD COLUMN IF NOT EXISTS "texto" varchar NOT NULL;
  ALTER TABLE "pagina_gobernanza_diagrama_equipos" ADD COLUMN IF NOT EXISTS "_order" integer NOT NULL;
  ALTER TABLE "pagina_gobernanza_diagrama_equipos" ADD COLUMN IF NOT EXISTS "_parent_id" integer NOT NULL;
  ALTER TABLE "pagina_gobernanza_diagrama_equipos" ADD COLUMN IF NOT EXISTS "id" varchar PRIMARY KEY NOT NULL;
  ALTER TABLE "pagina_gobernanza_diagrama_equipos" ADD COLUMN IF NOT EXISTS "nombre" varchar NOT NULL;
  ALTER TABLE "pagina_gobernanza_actividades" ADD COLUMN IF NOT EXISTS "_order" integer NOT NULL;
  ALTER TABLE "pagina_gobernanza_actividades" ADD COLUMN IF NOT EXISTS "_parent_id" integer NOT NULL;
  ALTER TABLE "pagina_gobernanza_actividades" ADD COLUMN IF NOT EXISTS "id" varchar PRIMARY KEY NOT NULL;
  ALTER TABLE "pagina_gobernanza_actividades" ADD COLUMN IF NOT EXISTS "foto_id" integer NOT NULL;
  ALTER TABLE "pagina_gobernanza_actividades" ADD COLUMN IF NOT EXISTS "titulo" varchar;
  ALTER TABLE "pagina_gobernanza" ADD COLUMN IF NOT EXISTS "hero_titulo" varchar DEFAULT 'Modelo de Gobernanza';
  ALTER TABLE "pagina_gobernanza" ADD COLUMN IF NOT EXISTS "hero_subtitulo" varchar DEFAULT 'Estructura de dirección, gestión y control del programa para garantizar transparencia, eficiencia y sostenibilidad.';
  ALTER TABLE "pagina_gobernanza" ADD COLUMN IF NOT EXISTS "descripcion" varchar DEFAULT 'El modelo de gobernanza del programa se divide en dos niveles — estratégico y operativo — para asegurar una gestión integral y sostenible del proyecto.';
  ALTER TABLE "pagina_gobernanza" ADD COLUMN IF NOT EXISTS "nivel_estrategico_titulo" varchar DEFAULT 'Consejo de Dirección del Hidrógeno Verde de Araucanía';
  ALTER TABLE "pagina_gobernanza" ADD COLUMN IF NOT EXISTS "nivel_estrategico_descripcion" varchar DEFAULT 'Instancia máxima de dirección estratégica compuesta por representantes del Gobierno Regional, Ministerios, universidades, asociaciones empresariales, comunidades indígenas y expertos independientes.';
  ALTER TABLE "pagina_gobernanza" ADD COLUMN IF NOT EXISTS "nivel_estrategico_periodicidad" varchar DEFAULT 'Trimestralmente — Presencial y/o videoconferencia';
  ALTER TABLE "pagina_gobernanza" ADD COLUMN IF NOT EXISTS "nivel_operativo_titulo" varchar DEFAULT 'Unidad de Coordinación y Gestión del Proyecto';
  ALTER TABLE "pagina_gobernanza" ADD COLUMN IF NOT EXISTS "nivel_operativo_descripcion" varchar DEFAULT 'Compuesta por el Director del proyecto, equipo técnico, equipo de gestión financiera y equipo de comunicación y participación comunitaria.';
  ALTER TABLE "pagina_gobernanza" ADD COLUMN IF NOT EXISTS "nivel_operativo_periodicidad" varchar DEFAULT 'Cada 15 días — Presencial y/o videoconferencia';
  ALTER TABLE "pagina_gobernanza" ADD COLUMN IF NOT EXISTS "diagrama_consejo" varchar DEFAULT 'Consejo de Dirección H2V';
  ALTER TABLE "pagina_gobernanza" ADD COLUMN IF NOT EXISTS "diagrama_comite" varchar DEFAULT 'Comité Consultivo';
  ALTER TABLE "pagina_gobernanza" ADD COLUMN IF NOT EXISTS "diagrama_unidad" varchar DEFAULT 'Unidad de Coordinación y Gestión';
  ALTER TABLE "pagina_gobernanza" ADD COLUMN IF NOT EXISTS "updated_at" timestamp(3) with time zone;
  ALTER TABLE "pagina_gobernanza" ADD COLUMN IF NOT EXISTS "created_at" timestamp(3) with time zone;
  ALTER TABLE "pagina_h2v_electrolisis_pasos" ADD COLUMN IF NOT EXISTS "_order" integer NOT NULL;
  ALTER TABLE "pagina_h2v_electrolisis_pasos" ADD COLUMN IF NOT EXISTS "_parent_id" integer NOT NULL;
  ALTER TABLE "pagina_h2v_electrolisis_pasos" ADD COLUMN IF NOT EXISTS "id" varchar PRIMARY KEY NOT NULL;
  ALTER TABLE "pagina_h2v_electrolisis_pasos" ADD COLUMN IF NOT EXISTS "titulo" varchar NOT NULL;
  ALTER TABLE "pagina_h2v_electrolisis_pasos" ADD COLUMN IF NOT EXISTS "descripcion" varchar NOT NULL;
  ALTER TABLE "pagina_h2v_electrolizadores" ADD COLUMN IF NOT EXISTS "_order" integer NOT NULL;
  ALTER TABLE "pagina_h2v_electrolizadores" ADD COLUMN IF NOT EXISTS "_parent_id" integer NOT NULL;
  ALTER TABLE "pagina_h2v_electrolizadores" ADD COLUMN IF NOT EXISTS "id" varchar PRIMARY KEY NOT NULL;
  ALTER TABLE "pagina_h2v_electrolizadores" ADD COLUMN IF NOT EXISTS "nombre" varchar NOT NULL;
  ALTER TABLE "pagina_h2v_electrolizadores" ADD COLUMN IF NOT EXISTS "descripcion" varchar NOT NULL;
  ALTER TABLE "pagina_h2v_electrolizadores" ADD COLUMN IF NOT EXISTS "madurez" varchar;
  ALTER TABLE "pagina_h2v_electrolizadores" ADD COLUMN IF NOT EXISTS "costo" varchar;
  ALTER TABLE "pagina_h2v_cadena_valor" ADD COLUMN IF NOT EXISTS "_order" integer NOT NULL;
  ALTER TABLE "pagina_h2v_cadena_valor" ADD COLUMN IF NOT EXISTS "_parent_id" integer NOT NULL;
  ALTER TABLE "pagina_h2v_cadena_valor" ADD COLUMN IF NOT EXISTS "id" varchar PRIMARY KEY NOT NULL;
  ALTER TABLE "pagina_h2v_cadena_valor" ADD COLUMN IF NOT EXISTS "titulo" varchar NOT NULL;
  ALTER TABLE "pagina_h2v_cadena_valor" ADD COLUMN IF NOT EXISTS "descripcion" varchar NOT NULL;
  ALTER TABLE "pagina_h2v_cadena_valor" ADD COLUMN IF NOT EXISTS "icono" varchar;
  ALTER TABLE "pagina_h2v_derivados" ADD COLUMN IF NOT EXISTS "_order" integer NOT NULL;
  ALTER TABLE "pagina_h2v_derivados" ADD COLUMN IF NOT EXISTS "_parent_id" integer NOT NULL;
  ALTER TABLE "pagina_h2v_derivados" ADD COLUMN IF NOT EXISTS "id" varchar PRIMARY KEY NOT NULL;
  ALTER TABLE "pagina_h2v_derivados" ADD COLUMN IF NOT EXISTS "nombre" varchar NOT NULL;
  ALTER TABLE "pagina_h2v_derivados" ADD COLUMN IF NOT EXISTS "descripcion" varchar NOT NULL;
  ALTER TABLE "pagina_h2v_derivados" ADD COLUMN IF NOT EXISTS "aplicacion" varchar;
  ALTER TABLE "pagina_h2v_explora_mas" ADD COLUMN IF NOT EXISTS "_order" integer NOT NULL;
  ALTER TABLE "pagina_h2v_explora_mas" ADD COLUMN IF NOT EXISTS "_parent_id" integer NOT NULL;
  ALTER TABLE "pagina_h2v_explora_mas" ADD COLUMN IF NOT EXISTS "id" varchar PRIMARY KEY NOT NULL;
  ALTER TABLE "pagina_h2v_explora_mas" ADD COLUMN IF NOT EXISTS "titulo" varchar NOT NULL;
  ALTER TABLE "pagina_h2v_explora_mas" ADD COLUMN IF NOT EXISTS "descripcion" varchar NOT NULL;
  ALTER TABLE "pagina_h2v_explora_mas" ADD COLUMN IF NOT EXISTS "enlace" "enum_pagina_h2v_explora_mas_enlace" NOT NULL;
  ALTER TABLE "pagina_h2v" ADD COLUMN IF NOT EXISTS "hero_titulo" varchar DEFAULT 'Hidrógeno Verde';
  ALTER TABLE "pagina_h2v" ADD COLUMN IF NOT EXISTS "hero_subtitulo" varchar DEFAULT 'El hidrógeno verde es un vector energético producido mediante electrólisis del agua utilizando energías renovables. No genera emisiones de CO2 y es clave para la descarbonización de la economía.';
  ALTER TABLE "pagina_h2v" ADD COLUMN IF NOT EXISTS "que_es_titulo" varchar DEFAULT '¿Qué es el Hidrógeno Verde?';
  ALTER TABLE "pagina_h2v" ADD COLUMN IF NOT EXISTS "que_es_contenido" jsonb;
  ALTER TABLE "pagina_h2v" ADD COLUMN IF NOT EXISTS "electrolisis_titulo" varchar DEFAULT 'Proceso de Electrólisis';
  ALTER TABLE "pagina_h2v" ADD COLUMN IF NOT EXISTS "updated_at" timestamp(3) with time zone;
  ALTER TABLE "pagina_h2v" ADD COLUMN IF NOT EXISTS "created_at" timestamp(3) with time zone;
  ALTER TABLE "pagina_sectores_sectores_oportunidades" ADD COLUMN IF NOT EXISTS "_order" integer NOT NULL;
  ALTER TABLE "pagina_sectores_sectores_oportunidades" ADD COLUMN IF NOT EXISTS "_parent_id" varchar NOT NULL;
  ALTER TABLE "pagina_sectores_sectores_oportunidades" ADD COLUMN IF NOT EXISTS "id" varchar PRIMARY KEY NOT NULL;
  ALTER TABLE "pagina_sectores_sectores_oportunidades" ADD COLUMN IF NOT EXISTS "texto" varchar NOT NULL;
  ALTER TABLE "pagina_sectores_sectores" ADD COLUMN IF NOT EXISTS "_order" integer NOT NULL;
  ALTER TABLE "pagina_sectores_sectores" ADD COLUMN IF NOT EXISTS "_parent_id" integer NOT NULL;
  ALTER TABLE "pagina_sectores_sectores" ADD COLUMN IF NOT EXISTS "id" varchar PRIMARY KEY NOT NULL;
  ALTER TABLE "pagina_sectores_sectores" ADD COLUMN IF NOT EXISTS "nombre" varchar NOT NULL;
  ALTER TABLE "pagina_sectores_sectores" ADD COLUMN IF NOT EXISTS "icono" varchar;
  ALTER TABLE "pagina_sectores_sectores" ADD COLUMN IF NOT EXISTS "descripcion" varchar NOT NULL;
  ALTER TABLE "pagina_sectores" ADD COLUMN IF NOT EXISTS "hero_titulo" varchar DEFAULT 'Sectores Productivos';
  ALTER TABLE "pagina_sectores" ADD COLUMN IF NOT EXISTS "hero_subtitulo" varchar DEFAULT 'Sectores de La Araucanía con potencial de integración del hidrógeno verde para su desarrollo sostenible.';
  ALTER TABLE "pagina_sectores" ADD COLUMN IF NOT EXISTS "updated_at" timestamp(3) with time zone;
  ALTER TABLE "pagina_sectores" ADD COLUMN IF NOT EXISTS "created_at" timestamp(3) with time zone;
  ALTER TABLE "pagina_hoja_ruta_hitos" ADD COLUMN IF NOT EXISTS "_order" integer NOT NULL;
  ALTER TABLE "pagina_hoja_ruta_hitos" ADD COLUMN IF NOT EXISTS "_parent_id" integer NOT NULL;
  ALTER TABLE "pagina_hoja_ruta_hitos" ADD COLUMN IF NOT EXISTS "id" varchar PRIMARY KEY NOT NULL;
  ALTER TABLE "pagina_hoja_ruta_hitos" ADD COLUMN IF NOT EXISTS "periodo" varchar NOT NULL;
  ALTER TABLE "pagina_hoja_ruta_hitos" ADD COLUMN IF NOT EXISTS "titulo" varchar NOT NULL;
  ALTER TABLE "pagina_hoja_ruta_hitos" ADD COLUMN IF NOT EXISTS "descripcion" varchar NOT NULL;
  ALTER TABLE "pagina_hoja_ruta" ADD COLUMN IF NOT EXISTS "hero_titulo" varchar DEFAULT 'Hoja de Ruta';
  ALTER TABLE "pagina_hoja_ruta" ADD COLUMN IF NOT EXISTS "hero_subtitulo" varchar DEFAULT 'Estrategia regional para el desarrollo del hidrógeno verde en La Araucanía, horizonte 2024-2050.';
  ALTER TABLE "pagina_hoja_ruta" ADD COLUMN IF NOT EXISTS "nota_final" varchar DEFAULT 'La Hoja de Ruta detallada se publicará como documento descargable una vez completado el proceso de diagnóstico regional.';
  ALTER TABLE "pagina_hoja_ruta" ADD COLUMN IF NOT EXISTS "updated_at" timestamp(3) with time zone;
  ALTER TABLE "pagina_hoja_ruta" ADD COLUMN IF NOT EXISTS "created_at" timestamp(3) with time zone;
  ALTER TABLE "pagina_comunidad_participacion_items" ADD COLUMN IF NOT EXISTS "_order" integer NOT NULL;
  ALTER TABLE "pagina_comunidad_participacion_items" ADD COLUMN IF NOT EXISTS "_parent_id" integer NOT NULL;
  ALTER TABLE "pagina_comunidad_participacion_items" ADD COLUMN IF NOT EXISTS "id" varchar PRIMARY KEY NOT NULL;
  ALTER TABLE "pagina_comunidad_participacion_items" ADD COLUMN IF NOT EXISTS "texto" varchar NOT NULL;
  ALTER TABLE "pagina_comunidad_compromisos_items" ADD COLUMN IF NOT EXISTS "_order" integer NOT NULL;
  ALTER TABLE "pagina_comunidad_compromisos_items" ADD COLUMN IF NOT EXISTS "_parent_id" integer NOT NULL;
  ALTER TABLE "pagina_comunidad_compromisos_items" ADD COLUMN IF NOT EXISTS "id" varchar PRIMARY KEY NOT NULL;
  ALTER TABLE "pagina_comunidad_compromisos_items" ADD COLUMN IF NOT EXISTS "texto" varchar NOT NULL;
  ALTER TABLE "pagina_comunidad_glosario" ADD COLUMN IF NOT EXISTS "_order" integer NOT NULL;
  ALTER TABLE "pagina_comunidad_glosario" ADD COLUMN IF NOT EXISTS "_parent_id" integer NOT NULL;
  ALTER TABLE "pagina_comunidad_glosario" ADD COLUMN IF NOT EXISTS "id" varchar PRIMARY KEY NOT NULL;
  ALTER TABLE "pagina_comunidad_glosario" ADD COLUMN IF NOT EXISTS "mapudungun" varchar NOT NULL;
  ALTER TABLE "pagina_comunidad_glosario" ADD COLUMN IF NOT EXISTS "espanol" varchar NOT NULL;
  ALTER TABLE "pagina_comunidad" ADD COLUMN IF NOT EXISTS "hero_titulo" varchar DEFAULT 'Comunidad y Participación';
  ALTER TABLE "pagina_comunidad" ADD COLUMN IF NOT EXISTS "hero_subtitulo" varchar DEFAULT 'El desarrollo del hidrógeno verde en La Araucanía se construye con la participación activa de las comunidades y actores territoriales.';
  ALTER TABLE "pagina_comunidad" ADD COLUMN IF NOT EXISTS "introduccion" jsonb;
  ALTER TABLE "pagina_comunidad" ADD COLUMN IF NOT EXISTS "participacion_titulo" varchar DEFAULT 'Participación en gobernanza';
  ALTER TABLE "pagina_comunidad" ADD COLUMN IF NOT EXISTS "compromisos_titulo" varchar DEFAULT 'Compromiso con el territorio';
  ALTER TABLE "pagina_comunidad" ADD COLUMN IF NOT EXISTS "updated_at" timestamp(3) with time zone;
  ALTER TABLE "pagina_comunidad" ADD COLUMN IF NOT EXISTS "created_at" timestamp(3) with time zone;
  ALTER TABLE "pagina_capital_humano_perfiles" ADD COLUMN IF NOT EXISTS "_order" integer NOT NULL;
  ALTER TABLE "pagina_capital_humano_perfiles" ADD COLUMN IF NOT EXISTS "_parent_id" integer NOT NULL;
  ALTER TABLE "pagina_capital_humano_perfiles" ADD COLUMN IF NOT EXISTS "id" varchar PRIMARY KEY NOT NULL;
  ALTER TABLE "pagina_capital_humano_perfiles" ADD COLUMN IF NOT EXISTS "texto" varchar NOT NULL;
  ALTER TABLE "pagina_capital_humano_programas" ADD COLUMN IF NOT EXISTS "_order" integer NOT NULL;
  ALTER TABLE "pagina_capital_humano_programas" ADD COLUMN IF NOT EXISTS "_parent_id" integer NOT NULL;
  ALTER TABLE "pagina_capital_humano_programas" ADD COLUMN IF NOT EXISTS "id" varchar PRIMARY KEY NOT NULL;
  ALTER TABLE "pagina_capital_humano_programas" ADD COLUMN IF NOT EXISTS "texto" varchar NOT NULL;
  ALTER TABLE "pagina_capital_humano" ADD COLUMN IF NOT EXISTS "hero_titulo" varchar DEFAULT 'Capital Humano';
  ALTER TABLE "pagina_capital_humano" ADD COLUMN IF NOT EXISTS "hero_subtitulo" varchar DEFAULT 'Formación y desarrollo de competencias para la industria del hidrógeno verde en La Araucanía.';
  ALTER TABLE "pagina_capital_humano" ADD COLUMN IF NOT EXISTS "introduccion" jsonb;
  ALTER TABLE "pagina_capital_humano" ADD COLUMN IF NOT EXISTS "nota_oportunidad" jsonb;
  ALTER TABLE "pagina_capital_humano" ADD COLUMN IF NOT EXISTS "updated_at" timestamp(3) with time zone;
  ALTER TABLE "pagina_capital_humano" ADD COLUMN IF NOT EXISTS "created_at" timestamp(3) with time zone;
  ALTER TABLE "pagina_marco_regulatorio_documentos" ADD COLUMN IF NOT EXISTS "_order" integer NOT NULL;
  ALTER TABLE "pagina_marco_regulatorio_documentos" ADD COLUMN IF NOT EXISTS "_parent_id" integer NOT NULL;
  ALTER TABLE "pagina_marco_regulatorio_documentos" ADD COLUMN IF NOT EXISTS "id" varchar PRIMARY KEY NOT NULL;
  ALTER TABLE "pagina_marco_regulatorio_documentos" ADD COLUMN IF NOT EXISTS "titulo" varchar NOT NULL;
  ALTER TABLE "pagina_marco_regulatorio_documentos" ADD COLUMN IF NOT EXISTS "descripcion" varchar NOT NULL;
  ALTER TABLE "pagina_marco_regulatorio_documentos" ADD COLUMN IF NOT EXISTS "relevancia" varchar;
  ALTER TABLE "pagina_marco_regulatorio" ADD COLUMN IF NOT EXISTS "hero_titulo" varchar DEFAULT 'Marco Regulatorio';
  ALTER TABLE "pagina_marco_regulatorio" ADD COLUMN IF NOT EXISTS "hero_subtitulo" varchar DEFAULT 'Normativa, políticas y lineamientos para el desarrollo del hidrógeno verde en Chile.';
  ALTER TABLE "pagina_marco_regulatorio" ADD COLUMN IF NOT EXISTS "updated_at" timestamp(3) with time zone;
  ALTER TABLE "pagina_marco_regulatorio" ADD COLUMN IF NOT EXISTS "created_at" timestamp(3) with time zone;
  ALTER TABLE "pagina_transparencia_items" ADD COLUMN IF NOT EXISTS "_order" integer NOT NULL;
  ALTER TABLE "pagina_transparencia_items" ADD COLUMN IF NOT EXISTS "_parent_id" integer NOT NULL;
  ALTER TABLE "pagina_transparencia_items" ADD COLUMN IF NOT EXISTS "id" varchar PRIMARY KEY NOT NULL;
  ALTER TABLE "pagina_transparencia_items" ADD COLUMN IF NOT EXISTS "titulo" varchar NOT NULL;
  ALTER TABLE "pagina_transparencia_items" ADD COLUMN IF NOT EXISTS "descripcion" varchar NOT NULL;
  ALTER TABLE "pagina_transparencia_items" ADD COLUMN IF NOT EXISTS "estado" varchar DEFAULT 'Próximamente';
  ALTER TABLE "pagina_transparencia" ADD COLUMN IF NOT EXISTS "hero_titulo" varchar DEFAULT 'Transparencia';
  ALTER TABLE "pagina_transparencia" ADD COLUMN IF NOT EXISTS "hero_subtitulo" varchar DEFAULT 'Rendición de cuentas y registro de actividades del programa.';
  ALTER TABLE "pagina_transparencia" ADD COLUMN IF NOT EXISTS "introduccion" varchar DEFAULT 'El programa de Hidrógeno Verde de La Araucanía se compromete con la transparencia en la gestión de recursos públicos y la rendición de cuentas a la ciudadanía.';
  ALTER TABLE "pagina_transparencia" ADD COLUMN IF NOT EXISTS "updated_at" timestamp(3) with time zone;
  ALTER TABLE "pagina_transparencia" ADD COLUMN IF NOT EXISTS "created_at" timestamp(3) with time zone;
  ALTER TABLE "pagina_mediateca_recursos" ADD COLUMN IF NOT EXISTS "_order" integer NOT NULL;
  ALTER TABLE "pagina_mediateca_recursos" ADD COLUMN IF NOT EXISTS "_parent_id" integer NOT NULL;
  ALTER TABLE "pagina_mediateca_recursos" ADD COLUMN IF NOT EXISTS "id" varchar PRIMARY KEY NOT NULL;
  ALTER TABLE "pagina_mediateca_recursos" ADD COLUMN IF NOT EXISTS "titulo" varchar NOT NULL;
  ALTER TABLE "pagina_mediateca_recursos" ADD COLUMN IF NOT EXISTS "tipo" "enum_pagina_mediateca_recursos_tipo" DEFAULT 'video';
  ALTER TABLE "pagina_mediateca_recursos" ADD COLUMN IF NOT EXISTS "url" varchar NOT NULL;
  ALTER TABLE "pagina_mediateca_recursos" ADD COLUMN IF NOT EXISTS "descripcion" varchar;
  ALTER TABLE "pagina_mediateca" ADD COLUMN IF NOT EXISTS "hero_titulo" varchar DEFAULT 'Mediateca';
  ALTER TABLE "pagina_mediateca" ADD COLUMN IF NOT EXISTS "hero_subtitulo" varchar DEFAULT 'Videos, infografías y material multimedia del programa.';
  ALTER TABLE "pagina_mediateca" ADD COLUMN IF NOT EXISTS "mensaje_vacio_titulo" varchar DEFAULT 'Próximamente se publicará material multimedia.';
  ALTER TABLE "pagina_mediateca" ADD COLUMN IF NOT EXISTS "mensaje_vacio_subtitulo" varchar DEFAULT 'Videos, infografías y presentaciones del programa se alojarán en esta sección.';
  ALTER TABLE "pagina_mediateca" ADD COLUMN IF NOT EXISTS "updated_at" timestamp(3) with time zone;
  ALTER TABLE "pagina_mediateca" ADD COLUMN IF NOT EXISTS "created_at" timestamp(3) with time zone;
  ALTER TABLE "pagina_proyectos" ADD COLUMN IF NOT EXISTS "hero_titulo" varchar DEFAULT 'Mapa de Proyectos';
  ALTER TABLE "pagina_proyectos" ADD COLUMN IF NOT EXISTS "hero_subtitulo" varchar DEFAULT 'Proyectos de hidrógeno verde en desarrollo y ejecución a nivel regional y nacional.';
  ALTER TABLE "pagina_proyectos" ADD COLUMN IF NOT EXISTS "updated_at" timestamp(3) with time zone;
  ALTER TABLE "pagina_proyectos" ADD COLUMN IF NOT EXISTS "created_at" timestamp(3) with time zone;
  ALTER TABLE "pagina_privacidad" ADD COLUMN IF NOT EXISTS "hero_titulo" varchar DEFAULT 'Política de Privacidad';
  ALTER TABLE "pagina_privacidad" ADD COLUMN IF NOT EXISTS "hero_subtitulo" varchar DEFAULT 'Protección de datos personales conforme a la legislación chilena.';
  ALTER TABLE "pagina_privacidad" ADD COLUMN IF NOT EXISTS "fecha_actualizacion" varchar DEFAULT 'abril 2026';
  ALTER TABLE "pagina_privacidad" ADD COLUMN IF NOT EXISTS "contenido" jsonb;
  ALTER TABLE "pagina_privacidad" ADD COLUMN IF NOT EXISTS "updated_at" timestamp(3) with time zone;
  ALTER TABLE "pagina_privacidad" ADD COLUMN IF NOT EXISTS "created_at" timestamp(3) with time zone;
  ALTER TABLE "pagina_accesibilidad" ADD COLUMN IF NOT EXISTS "hero_titulo" varchar DEFAULT 'Accesibilidad';
  ALTER TABLE "pagina_accesibilidad" ADD COLUMN IF NOT EXISTS "hero_subtitulo" varchar DEFAULT 'Nuestro compromiso con un sitio web accesible para todas las personas.';
  ALTER TABLE "pagina_accesibilidad" ADD COLUMN IF NOT EXISTS "contenido" jsonb;
  ALTER TABLE "pagina_accesibilidad" ADD COLUMN IF NOT EXISTS "updated_at" timestamp(3) with time zone;
  ALTER TABLE "pagina_accesibilidad" ADD COLUMN IF NOT EXISTS "created_at" timestamp(3) with time zone;
  ALTER TABLE "guia_admin" ADD COLUMN IF NOT EXISTS "instrucciones" jsonb;
  ALTER TABLE "guia_admin" ADD COLUMN IF NOT EXISTS "guia_completa" varchar;
  ALTER TABLE "guia_admin" ADD COLUMN IF NOT EXISTS "updated_at" timestamp(3) with time zone;
  ALTER TABLE "guia_admin" ADD COLUMN IF NOT EXISTS "created_at" timestamp(3) with time zone;

  DO $$ BEGIN ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "noticias" ADD CONSTRAINT "noticias_imagen_id_media_id_fk" FOREIGN KEY ("imagen_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_noticias_v" ADD CONSTRAINT "_noticias_v_parent_id_noticias_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."noticias"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_noticias_v" ADD CONSTRAINT "_noticias_v_version_imagen_id_media_id_fk" FOREIGN KEY ("version_imagen_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "documentos" ADD CONSTRAINT "documentos_archivo_id_media_id_fk" FOREIGN KEY ("archivo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "documentos" ADD CONSTRAINT "documentos_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "proyectos" ADD CONSTRAINT "proyectos_imagen_id_media_id_fk" FOREIGN KEY ("imagen_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "miembros" ADD CONSTRAINT "miembros_foto_id_media_id_fk" FOREIGN KEY ("foto_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "downloads" ADD CONSTRAINT "downloads_documento_id_documentos_id_fk" FOREIGN KEY ("documento_id") REFERENCES "public"."documentos"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "downloads" ADD CONSTRAINT "downloads_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "video_views" ADD CONSTRAINT "video_views_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "eventos" ADD CONSTRAINT "eventos_imagen_id_media_id_fk" FOREIGN KEY ("imagen_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_eventos_v" ADD CONSTRAINT "_eventos_v_parent_id_eventos_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."eventos"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_eventos_v" ADD CONSTRAINT "_eventos_v_version_imagen_id_media_id_fk" FOREIGN KEY ("version_imagen_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_noticias_fk" FOREIGN KEY ("noticias_id") REFERENCES "public"."noticias"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_documentos_fk" FOREIGN KEY ("documentos_id") REFERENCES "public"."documentos"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_proyectos_fk" FOREIGN KEY ("proyectos_id") REFERENCES "public"."proyectos"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_miembros_fk" FOREIGN KEY ("miembros_id") REFERENCES "public"."miembros"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_downloads_fk" FOREIGN KEY ("downloads_id") REFERENCES "public"."downloads"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_video_views_fk" FOREIGN KEY ("video_views_id") REFERENCES "public"."video_views"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_eventos_fk" FOREIGN KEY ("eventos_id") REFERENCES "public"."eventos"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "sitio_general_instituciones" ADD CONSTRAINT "sitio_general_instituciones_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "sitio_general_instituciones" ADD CONSTRAINT "sitio_general_instituciones_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."sitio_general"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "contacto_form_opciones_asunto" ADD CONSTRAINT "contacto_form_opciones_asunto_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contacto"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pagina_inicio_kpis" ADD CONSTRAINT "pagina_inicio_kpis_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pagina_inicio"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pagina_inicio_seccion_explora_cards" ADD CONSTRAINT "pagina_inicio_seccion_explora_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pagina_inicio"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pagina_quienes_somos_instituciones" ADD CONSTRAINT "pagina_quienes_somos_instituciones_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pagina_quienes_somos_instituciones" ADD CONSTRAINT "pagina_quienes_somos_instituciones_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pagina_quienes_somos"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pagina_gobernanza_nivel_estrategico_funciones" ADD CONSTRAINT "pagina_gobernanza_nivel_estrategico_funciones_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pagina_gobernanza"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pagina_gobernanza_nivel_operativo_funciones" ADD CONSTRAINT "pagina_gobernanza_nivel_operativo_funciones_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pagina_gobernanza"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pagina_gobernanza_diagrama_equipos" ADD CONSTRAINT "pagina_gobernanza_diagrama_equipos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pagina_gobernanza"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pagina_gobernanza_actividades" ADD CONSTRAINT "pagina_gobernanza_actividades_foto_id_media_id_fk" FOREIGN KEY ("foto_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pagina_gobernanza_actividades" ADD CONSTRAINT "pagina_gobernanza_actividades_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pagina_gobernanza"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pagina_h2v_electrolisis_pasos" ADD CONSTRAINT "pagina_h2v_electrolisis_pasos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pagina_h2v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pagina_h2v_electrolizadores" ADD CONSTRAINT "pagina_h2v_electrolizadores_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pagina_h2v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pagina_h2v_cadena_valor" ADD CONSTRAINT "pagina_h2v_cadena_valor_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pagina_h2v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pagina_h2v_derivados" ADD CONSTRAINT "pagina_h2v_derivados_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pagina_h2v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pagina_h2v_explora_mas" ADD CONSTRAINT "pagina_h2v_explora_mas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pagina_h2v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pagina_sectores_sectores_oportunidades" ADD CONSTRAINT "pagina_sectores_sectores_oportunidades_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pagina_sectores_sectores"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pagina_sectores_sectores" ADD CONSTRAINT "pagina_sectores_sectores_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pagina_sectores"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pagina_hoja_ruta_hitos" ADD CONSTRAINT "pagina_hoja_ruta_hitos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pagina_hoja_ruta"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pagina_comunidad_participacion_items" ADD CONSTRAINT "pagina_comunidad_participacion_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pagina_comunidad"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pagina_comunidad_compromisos_items" ADD CONSTRAINT "pagina_comunidad_compromisos_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pagina_comunidad"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pagina_comunidad_glosario" ADD CONSTRAINT "pagina_comunidad_glosario_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pagina_comunidad"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pagina_capital_humano_perfiles" ADD CONSTRAINT "pagina_capital_humano_perfiles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pagina_capital_humano"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pagina_capital_humano_programas" ADD CONSTRAINT "pagina_capital_humano_programas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pagina_capital_humano"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pagina_marco_regulatorio_documentos" ADD CONSTRAINT "pagina_marco_regulatorio_documentos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pagina_marco_regulatorio"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pagina_transparencia_items" ADD CONSTRAINT "pagina_transparencia_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pagina_transparencia"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pagina_mediateca_recursos" ADD CONSTRAINT "pagina_mediateca_recursos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pagina_mediateca"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  CREATE INDEX IF NOT EXISTS "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX IF NOT EXISTS "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX IF NOT EXISTS "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX IF NOT EXISTS "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX IF NOT EXISTS "media_sizes_hero_sizes_hero_filename_idx" ON "media" USING btree ("sizes_hero_filename");
  CREATE UNIQUE INDEX IF NOT EXISTS "noticias_slug_idx" ON "noticias" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "noticias_imagen_idx" ON "noticias" USING btree ("imagen_id");
  CREATE INDEX IF NOT EXISTS "noticias_updated_at_idx" ON "noticias" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "noticias_created_at_idx" ON "noticias" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "noticias__status_idx" ON "noticias" USING btree ("_status");
  CREATE INDEX IF NOT EXISTS "_noticias_v_parent_idx" ON "_noticias_v" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_noticias_v_version_version_slug_idx" ON "_noticias_v" USING btree ("version_slug");
  CREATE INDEX IF NOT EXISTS "_noticias_v_version_version_imagen_idx" ON "_noticias_v" USING btree ("version_imagen_id");
  CREATE INDEX IF NOT EXISTS "_noticias_v_version_version_updated_at_idx" ON "_noticias_v" USING btree ("version_updated_at");
  CREATE INDEX IF NOT EXISTS "_noticias_v_version_version_created_at_idx" ON "_noticias_v" USING btree ("version_created_at");
  CREATE INDEX IF NOT EXISTS "_noticias_v_version_version__status_idx" ON "_noticias_v" USING btree ("version__status");
  CREATE INDEX IF NOT EXISTS "_noticias_v_created_at_idx" ON "_noticias_v" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "_noticias_v_updated_at_idx" ON "_noticias_v" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "_noticias_v_latest_idx" ON "_noticias_v" USING btree ("latest");
  CREATE INDEX IF NOT EXISTS "_noticias_v_autosave_idx" ON "_noticias_v" USING btree ("autosave");
  CREATE INDEX IF NOT EXISTS "documentos_archivo_idx" ON "documentos" USING btree ("archivo_id");
  CREATE INDEX IF NOT EXISTS "documentos_thumbnail_idx" ON "documentos" USING btree ("thumbnail_id");
  CREATE INDEX IF NOT EXISTS "documentos_updated_at_idx" ON "documentos" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "documentos_created_at_idx" ON "documentos" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "proyectos_imagen_idx" ON "proyectos" USING btree ("imagen_id");
  CREATE INDEX IF NOT EXISTS "proyectos_updated_at_idx" ON "proyectos" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "proyectos_created_at_idx" ON "proyectos" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "miembros_foto_idx" ON "miembros" USING btree ("foto_id");
  CREATE INDEX IF NOT EXISTS "miembros_updated_at_idx" ON "miembros" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "miembros_created_at_idx" ON "miembros" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "downloads_documento_idx" ON "downloads" USING btree ("documento_id");
  CREATE INDEX IF NOT EXISTS "downloads_user_idx" ON "downloads" USING btree ("user_id");
  CREATE INDEX IF NOT EXISTS "downloads_updated_at_idx" ON "downloads" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "downloads_created_at_idx" ON "downloads" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "video_views_user_idx" ON "video_views" USING btree ("user_id");
  CREATE INDEX IF NOT EXISTS "video_views_updated_at_idx" ON "video_views" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "video_views_created_at_idx" ON "video_views" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "eventos_imagen_idx" ON "eventos" USING btree ("imagen_id");
  CREATE INDEX IF NOT EXISTS "eventos_updated_at_idx" ON "eventos" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "eventos_created_at_idx" ON "eventos" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "eventos__status_idx" ON "eventos" USING btree ("_status");
  CREATE INDEX IF NOT EXISTS "_eventos_v_parent_idx" ON "_eventos_v" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_eventos_v_version_version_imagen_idx" ON "_eventos_v" USING btree ("version_imagen_id");
  CREATE INDEX IF NOT EXISTS "_eventos_v_version_version_updated_at_idx" ON "_eventos_v" USING btree ("version_updated_at");
  CREATE INDEX IF NOT EXISTS "_eventos_v_version_version_created_at_idx" ON "_eventos_v" USING btree ("version_created_at");
  CREATE INDEX IF NOT EXISTS "_eventos_v_version_version__status_idx" ON "_eventos_v" USING btree ("version__status");
  CREATE INDEX IF NOT EXISTS "_eventos_v_created_at_idx" ON "_eventos_v" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "_eventos_v_updated_at_idx" ON "_eventos_v" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "_eventos_v_latest_idx" ON "_eventos_v" USING btree ("latest");
  CREATE INDEX IF NOT EXISTS "_eventos_v_autosave_idx" ON "_eventos_v" USING btree ("autosave");
  CREATE UNIQUE INDEX IF NOT EXISTS "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_noticias_id_idx" ON "payload_locked_documents_rels" USING btree ("noticias_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_documentos_id_idx" ON "payload_locked_documents_rels" USING btree ("documentos_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_proyectos_id_idx" ON "payload_locked_documents_rels" USING btree ("proyectos_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_miembros_id_idx" ON "payload_locked_documents_rels" USING btree ("miembros_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_downloads_id_idx" ON "payload_locked_documents_rels" USING btree ("downloads_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_video_views_id_idx" ON "payload_locked_documents_rels" USING btree ("video_views_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_eventos_id_idx" ON "payload_locked_documents_rels" USING btree ("eventos_id");
  CREATE INDEX IF NOT EXISTS "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX IF NOT EXISTS "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX IF NOT EXISTS "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "sitio_general_instituciones_order_idx" ON "sitio_general_instituciones" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "sitio_general_instituciones_parent_id_idx" ON "sitio_general_instituciones" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "sitio_general_instituciones_logo_idx" ON "sitio_general_instituciones" USING btree ("logo_id");
  CREATE INDEX IF NOT EXISTS "contacto_form_opciones_asunto_order_idx" ON "contacto_form_opciones_asunto" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "contacto_form_opciones_asunto_parent_id_idx" ON "contacto_form_opciones_asunto" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pagina_inicio_kpis_order_idx" ON "pagina_inicio_kpis" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pagina_inicio_kpis_parent_id_idx" ON "pagina_inicio_kpis" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pagina_inicio_seccion_explora_cards_order_idx" ON "pagina_inicio_seccion_explora_cards" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pagina_inicio_seccion_explora_cards_parent_id_idx" ON "pagina_inicio_seccion_explora_cards" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pagina_quienes_somos_instituciones_order_idx" ON "pagina_quienes_somos_instituciones" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pagina_quienes_somos_instituciones_parent_id_idx" ON "pagina_quienes_somos_instituciones" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pagina_quienes_somos_instituciones_logo_idx" ON "pagina_quienes_somos_instituciones" USING btree ("logo_id");
  CREATE INDEX IF NOT EXISTS "pagina_gobernanza_nivel_estrategico_funciones_order_idx" ON "pagina_gobernanza_nivel_estrategico_funciones" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pagina_gobernanza_nivel_estrategico_funciones_parent_id_idx" ON "pagina_gobernanza_nivel_estrategico_funciones" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pagina_gobernanza_nivel_operativo_funciones_order_idx" ON "pagina_gobernanza_nivel_operativo_funciones" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pagina_gobernanza_nivel_operativo_funciones_parent_id_idx" ON "pagina_gobernanza_nivel_operativo_funciones" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pagina_gobernanza_diagrama_equipos_order_idx" ON "pagina_gobernanza_diagrama_equipos" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pagina_gobernanza_diagrama_equipos_parent_id_idx" ON "pagina_gobernanza_diagrama_equipos" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pagina_gobernanza_actividades_order_idx" ON "pagina_gobernanza_actividades" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pagina_gobernanza_actividades_parent_id_idx" ON "pagina_gobernanza_actividades" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pagina_gobernanza_actividades_foto_idx" ON "pagina_gobernanza_actividades" USING btree ("foto_id");
  CREATE INDEX IF NOT EXISTS "pagina_h2v_electrolisis_pasos_order_idx" ON "pagina_h2v_electrolisis_pasos" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pagina_h2v_electrolisis_pasos_parent_id_idx" ON "pagina_h2v_electrolisis_pasos" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pagina_h2v_electrolizadores_order_idx" ON "pagina_h2v_electrolizadores" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pagina_h2v_electrolizadores_parent_id_idx" ON "pagina_h2v_electrolizadores" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pagina_h2v_cadena_valor_order_idx" ON "pagina_h2v_cadena_valor" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pagina_h2v_cadena_valor_parent_id_idx" ON "pagina_h2v_cadena_valor" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pagina_h2v_derivados_order_idx" ON "pagina_h2v_derivados" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pagina_h2v_derivados_parent_id_idx" ON "pagina_h2v_derivados" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pagina_h2v_explora_mas_order_idx" ON "pagina_h2v_explora_mas" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pagina_h2v_explora_mas_parent_id_idx" ON "pagina_h2v_explora_mas" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pagina_sectores_sectores_oportunidades_order_idx" ON "pagina_sectores_sectores_oportunidades" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pagina_sectores_sectores_oportunidades_parent_id_idx" ON "pagina_sectores_sectores_oportunidades" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pagina_sectores_sectores_order_idx" ON "pagina_sectores_sectores" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pagina_sectores_sectores_parent_id_idx" ON "pagina_sectores_sectores" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pagina_hoja_ruta_hitos_order_idx" ON "pagina_hoja_ruta_hitos" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pagina_hoja_ruta_hitos_parent_id_idx" ON "pagina_hoja_ruta_hitos" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pagina_comunidad_participacion_items_order_idx" ON "pagina_comunidad_participacion_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pagina_comunidad_participacion_items_parent_id_idx" ON "pagina_comunidad_participacion_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pagina_comunidad_compromisos_items_order_idx" ON "pagina_comunidad_compromisos_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pagina_comunidad_compromisos_items_parent_id_idx" ON "pagina_comunidad_compromisos_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pagina_comunidad_glosario_order_idx" ON "pagina_comunidad_glosario" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pagina_comunidad_glosario_parent_id_idx" ON "pagina_comunidad_glosario" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pagina_capital_humano_perfiles_order_idx" ON "pagina_capital_humano_perfiles" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pagina_capital_humano_perfiles_parent_id_idx" ON "pagina_capital_humano_perfiles" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pagina_capital_humano_programas_order_idx" ON "pagina_capital_humano_programas" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pagina_capital_humano_programas_parent_id_idx" ON "pagina_capital_humano_programas" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pagina_marco_regulatorio_documentos_order_idx" ON "pagina_marco_regulatorio_documentos" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pagina_marco_regulatorio_documentos_parent_id_idx" ON "pagina_marco_regulatorio_documentos" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pagina_transparencia_items_order_idx" ON "pagina_transparencia_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pagina_transparencia_items_parent_id_idx" ON "pagina_transparencia_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pagina_mediateca_recursos_order_idx" ON "pagina_mediateca_recursos" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pagina_mediateca_recursos_parent_id_idx" ON "pagina_mediateca_recursos" USING btree ("_parent_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "noticias" CASCADE;
  DROP TABLE "_noticias_v" CASCADE;
  DROP TABLE "documentos" CASCADE;
  DROP TABLE "proyectos" CASCADE;
  DROP TABLE "miembros" CASCADE;
  DROP TABLE "downloads" CASCADE;
  DROP TABLE "video_views" CASCADE;
  DROP TABLE "eventos" CASCADE;
  DROP TABLE "_eventos_v" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "sitio_general_instituciones" CASCADE;
  DROP TABLE "sitio_general" CASCADE;
  DROP TABLE "contacto_form_opciones_asunto" CASCADE;
  DROP TABLE "contacto" CASCADE;
  DROP TABLE "pagina_inicio_kpis" CASCADE;
  DROP TABLE "pagina_inicio_seccion_explora_cards" CASCADE;
  DROP TABLE "pagina_inicio" CASCADE;
  DROP TABLE "pagina_quienes_somos_instituciones" CASCADE;
  DROP TABLE "pagina_quienes_somos" CASCADE;
  DROP TABLE "pagina_gobernanza_nivel_estrategico_funciones" CASCADE;
  DROP TABLE "pagina_gobernanza_nivel_operativo_funciones" CASCADE;
  DROP TABLE "pagina_gobernanza_diagrama_equipos" CASCADE;
  DROP TABLE "pagina_gobernanza_actividades" CASCADE;
  DROP TABLE "pagina_gobernanza" CASCADE;
  DROP TABLE "pagina_h2v_electrolisis_pasos" CASCADE;
  DROP TABLE "pagina_h2v_electrolizadores" CASCADE;
  DROP TABLE "pagina_h2v_cadena_valor" CASCADE;
  DROP TABLE "pagina_h2v_derivados" CASCADE;
  DROP TABLE "pagina_h2v_explora_mas" CASCADE;
  DROP TABLE "pagina_h2v" CASCADE;
  DROP TABLE "pagina_sectores_sectores_oportunidades" CASCADE;
  DROP TABLE "pagina_sectores_sectores" CASCADE;
  DROP TABLE "pagina_sectores" CASCADE;
  DROP TABLE "pagina_hoja_ruta_hitos" CASCADE;
  DROP TABLE "pagina_hoja_ruta" CASCADE;
  DROP TABLE "pagina_comunidad_participacion_items" CASCADE;
  DROP TABLE "pagina_comunidad_compromisos_items" CASCADE;
  DROP TABLE "pagina_comunidad_glosario" CASCADE;
  DROP TABLE "pagina_comunidad" CASCADE;
  DROP TABLE "pagina_capital_humano_perfiles" CASCADE;
  DROP TABLE "pagina_capital_humano_programas" CASCADE;
  DROP TABLE "pagina_capital_humano" CASCADE;
  DROP TABLE "pagina_marco_regulatorio_documentos" CASCADE;
  DROP TABLE "pagina_marco_regulatorio" CASCADE;
  DROP TABLE "pagina_transparencia_items" CASCADE;
  DROP TABLE "pagina_transparencia" CASCADE;
  DROP TABLE "pagina_mediateca_recursos" CASCADE;
  DROP TABLE "pagina_mediateca" CASCADE;
  DROP TABLE "pagina_proyectos" CASCADE;
  DROP TABLE "pagina_privacidad" CASCADE;
  DROP TABLE "pagina_accesibilidad" CASCADE;
  DROP TABLE "guia_admin" CASCADE;
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_noticias_categoria";
  DROP TYPE "public"."enum_noticias_status";
  DROP TYPE "public"."enum__noticias_v_version_categoria";
  DROP TYPE "public"."enum__noticias_v_version_status";
  DROP TYPE "public"."enum_documentos_tipo";
  DROP TYPE "public"."enum_proyectos_etapa";
  DROP TYPE "public"."enum_proyectos_region";
  DROP TYPE "public"."enum_miembros_instancia";
  DROP TYPE "public"."enum_video_views_evento";
  DROP TYPE "public"."enum_eventos_tipo";
  DROP TYPE "public"."enum_eventos_status";
  DROP TYPE "public"."enum__eventos_v_version_tipo";
  DROP TYPE "public"."enum__eventos_v_version_status";
  DROP TYPE "public"."enum_pagina_h2v_explora_mas_enlace";
  DROP TYPE "public"."enum_pagina_mediateca_recursos_tipo";`)
}
