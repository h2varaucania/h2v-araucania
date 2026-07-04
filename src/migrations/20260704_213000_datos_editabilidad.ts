import { type MigrateUpArgs, sql } from '@payloadcms/db-postgres';
import { contactoDefaults as dc } from '../content/defaults/contacto';
import { inicioDefaults as di } from '../content/defaults/inicio';
import { sitioDefaults as ds } from '../content/defaults/sitio';

// Migración de DATOS pareada con la baseline (EDITABILIDAD_TOTAL §5.4):
// 1) Rellena los campos NUEVOS de los globals con el contenido real (verbatim
//    de las páginas). Solo toca campos nuevos: updateGlobal es merge parcial,
//    así que NO pisa nada que el dueño ya haya editado.
// 2) Carga el Comité Estratégico real (actas firmadas de las sesiones 2/4/5,
//    confirmado por Carlos Villalobos el 2026-07-04) reemplazando los asientos
//    "Por definir" del seed. Idempotente: puede correr más de una vez.

const COMITE: Array<{
  nombre: string;
  cargo: string;
  institucion: string;
  suplente?: string;
  aporte?: string;
  orden: number;
}> = [
  { nombre: 'Fernando Figueroa', cargo: 'Presidente', institucion: 'Ministerio de Energía — Seremi Araucanía', aporte: 'Preside el Comité Estratégico. Contraparte técnica de la entidad mandante.', orden: 1 },
  { nombre: 'Alejandra Bejcek', cargo: 'Vicepresidenta', institucion: 'CORFO', aporte: 'Vicepresidencia del Comité. Seguimiento del Bien Público.', orden: 2 },
  { nombre: 'Claudia Martínez', cargo: 'Miembro Titular', institucion: 'CODESSER', suplente: 'Fabián Azócar', aporte: 'Entidad ejecutora del Bien Público.', orden: 3 },
  { nombre: 'Ernesto Santibáñez', cargo: 'Miembro Titular', institucion: 'Universidad de Talca', suplente: 'Carlos Villalobos', aporte: 'Co-ejecutor técnico del Bien Público.', orden: 4 },
  { nombre: 'José Antonio Vallejos', cargo: 'Miembro Titular', institucion: 'CORMA', aporte: 'Representación del sector forestal.', orden: 5 },
  { nombre: 'Fernando Madariaga', cargo: 'Miembro Titular', institucion: 'Comasa', aporte: 'Director del proyecto Comasa H2V.', orden: 6 },
  { nombre: 'Marcos Rebolledo', cargo: 'Miembro Titular', institucion: 'FIA — Fundación para la Innovación Agraria', aporte: 'Fomento de la innovación agraria.', orden: 7 },
  { nombre: 'Pablo Palma', cargo: 'Miembro Titular', institucion: 'AGBA — Asoc. Gremial de Productores de la Biomasa', aporte: 'Representación del sector biomasa.', orden: 8 },
  { nombre: 'Daniel Acevedo', cargo: 'Secretaría Técnica', institucion: 'Universidad de Talca', suplente: 'María Isabel Guzmán', aporte: 'Secretaría técnica del Comité Estratégico.', orden: 9 },
];

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  const context = { disableRevalidate: true };

  // ── 1. Contacto: textos de página y formulario (solo campos nuevos) ──
  await payload.updateGlobal({
    slug: 'contacto',
    req,
    context,
    data: {
      tituloPagina: dc.tituloPagina,
      bajadaPagina: dc.bajadaPagina,
      tituloFormulario: dc.tituloFormulario,
      tituloInfo: dc.tituloInfo,
      etiquetaEmail: dc.etiquetaEmail,
      etiquetaUbicacion: dc.etiquetaUbicacion,
      etiquetaTelefono: dc.etiquetaTelefono,
      etiquetaPrograma: dc.etiquetaPrograma,
      programaLinea2: dc.programaLinea2,
      tituloEjecutores: dc.tituloEjecutores,
      tituloMandante: dc.tituloMandante,
      formEtiquetaNombre: dc.formEtiquetaNombre,
      formPlaceholderNombre: dc.formPlaceholderNombre,
      formEtiquetaEmail: dc.formEtiquetaEmail,
      formPlaceholderEmail: dc.formPlaceholderEmail,
      formEtiquetaAsunto: dc.formEtiquetaAsunto,
      formOpcionPorDefecto: dc.formOpcionPorDefecto,
      formOpcionesAsunto: dc.formOpcionesAsunto.map((o) => ({ ...o })),
      formEtiquetaMensaje: dc.formEtiquetaMensaje,
      formPlaceholderMensaje: dc.formPlaceholderMensaje,
      formTextoBoton: dc.formTextoBoton,
      formTextoEnviando: dc.formTextoEnviando,
      formTituloExito: dc.formTituloExito,
      formTextoExito: dc.formTextoExito,
      formTextoOtroMensaje: dc.formTextoOtroMensaje,
      formTextoError: dc.formTextoError,
    },
  });

  // ── 2. Página de Inicio: eyebrow, KPIs y textos de sección (solo nuevos) ──
  const inicio = await payload.findGlobal({ slug: 'pagina-inicio', req, depth: 0 });
  await payload.updateGlobal({
    slug: 'pagina-inicio',
    req,
    context,
    data: {
      hero: { ...(inicio?.hero ?? {}), eyebrow: inicio?.hero?.eyebrow || di.eyebrow },
      kpis: inicio?.kpis?.length ? inicio.kpis : di.kpis.map((k) => ({ ...k })),
      seccionExplora: {
        ...(inicio?.seccionExplora ?? {}),
        kicker: inicio?.seccionExplora?.kicker || di.kickerExplora,
      },
      seccionNoticias: {
        kicker: di.kickerNoticias,
        titulo: di.tituloNoticias,
        verTodas: di.textoVerTodas,
      },
      seccionInstituciones: {
        tituloApoyo: di.tituloApoyo,
        tituloParticipantes: di.tituloParticipantes,
      },
    },
  });

  // ── 3. Sitio general: footer y 404 (solo nuevos) ──
  await payload.updateGlobal({
    slug: 'sitio-general',
    req,
    context,
    data: {
      tituloNavegacion: ds.tituloNavegacion,
      tituloContactoFooter: ds.tituloContactoFooter,
      tituloApoyoFooter: ds.tituloApoyoFooter,
      derechos: ds.derechos,
      titulo404: ds.titulo404,
      texto404: ds.texto404,
      boton404: ds.boton404,
      boton404Secundario: ds.boton404Secundario,
    },
  });

  // ── 4. Comité Estratégico real (reemplaza asientos "Por definir" del consejo) ──
  await payload.delete({
    collection: 'miembros',
    req,
    context,
    where: {
      and: [
        { instancia: { equals: 'consejo' } },
        { or: [{ nombre: { equals: 'Por definir' } }, { nombre: { like: 'Por designar' } }] },
      ],
    },
  });
  for (const m of COMITE) {
    const existe = await payload.find({
      collection: 'miembros',
      req,
      where: { and: [{ instancia: { equals: 'consejo' } }, { nombre: { equals: m.nombre } }] },
      limit: 1,
    });
    if (existe.totalDocs === 0) {
      await payload.create({ collection: 'miembros', req, context, data: { ...m, instancia: 'consejo' } });
    }
  }

  // ── 5. Títulos del bloque de gobernanza (nombre real del órgano) ──
  // Solo sobre globals YA poblados (fila existente = instalación en marcha,
  // ej. prod). GUARD por SQL ANTES de escribir: un error capturado dentro de
  // la transacción la envenena y revierte en silencio los pasos anteriores
  // (trampa pagada en este mismo retrofit). En instalación nueva, el seed
  // pone estos textos.
  const filas = await db.execute(sql`
    SELECT (SELECT count(*) FROM pagina_quienes_somos)::int AS qs,
           (SELECT count(*) FROM pagina_gobernanza)::int AS gob
  `);
  const fila = (filas as unknown as { rows?: Array<{ qs: number; gob: number }> }).rows?.[0];
  if (fila && Number(fila.qs) > 0) {
    await payload.updateGlobal({
      slug: 'pagina-quienes-somos',
      req,
      context,
      data: {
        consejoTitulo: 'Comité Estratégico del Bien Público',
        consejoDescripcion:
          'Instancia estratégica del proyecto, presidida por la entidad mandante (Seremi de Energía de La Araucanía) con vicepresidencia de CORFO. Reúne a las instituciones ejecutoras y a representantes de los sectores forestal, biomasa, agrario y energético. Sesiona periódicamente desde junio de 2025.',
      },
    });
  } else {
    payload.logger.info('pagina-quienes-somos sin poblar aún: los títulos del Comité los pone el seed.');
  }
  if (fila && Number(fila.gob) > 0) {
    const gob = await payload.findGlobal({ slug: 'pagina-gobernanza', req, depth: 0 });
    await payload.updateGlobal({
      slug: 'pagina-gobernanza',
      req,
      context,
      data: {
        nivelEstrategico: {
          ...(gob?.nivelEstrategico ?? {}),
          titulo: 'Comité Estratégico del Bien Público',
          descripcion:
            'Instancia máxima de dirección estratégica del proyecto, presidida por la entidad mandante (Seremi de Energía) con vicepresidencia de CORFO e integrada por CODESSER, la Universidad de Talca, CORMA, Comasa, FIA y AGBA. Opera desde junio de 2025 con sesiones periódicas documentadas en actas.',
        },
      },
    });
  } else {
    payload.logger.info('pagina-gobernanza sin poblar aún: los títulos del Comité los pone el seed.');
  }

  payload.logger.info('Datos de editabilidad cargados (defaults + Comité Estratégico).');
}

export async function down(): Promise<void> {
  // Migración de datos: no se revierte (el contenido pasa a ser del dueño).
}
