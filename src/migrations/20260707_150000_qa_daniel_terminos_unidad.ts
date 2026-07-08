import { type MigrateUpArgs, sql } from '@payloadcms/db-postgres';

// Migración de DATOS por el QA de Daniel Acevedo (planilla 07-07-26):
// • #9/#10: la Unidad de Coordinación queda SOLO con los 4 cargos del Modelo
//   de Sustentabilidad, todos "Por definir" (los nombres de funcionarios
//   antiguos salen). El Comité Estratégico (instancia consejo) NO se toca.
// • #7/#8: terminología de las bases en los datos ya poblados: CODESSER es
//   "Beneficiario" y la Universidad de Talca "Coejecutor".
// Idempotente: los UPDATE solo escriben donde encuentran los valores viejos.

const CARGOS_UNIDAD = [
  { cargo: 'Director del proyecto', orden: 1 },
  { cargo: 'Equipo técnico', orden: 2 },
  { cargo: 'Equipo de gestión financiera', orden: 3 },
  { cargo: 'Equipo de comunicación y participación comunitaria', orden: 4 },
];

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  const context = { disableRevalidate: true };

  // ── 1. Unidad de Coordinación → solo cargos "Por definir" (QA #9/#10) ──
  await payload.delete({
    collection: 'miembros',
    req,
    context,
    where: { instancia: { equals: 'unidad' } },
  });
  for (const c of CARGOS_UNIDAD) {
    await payload.create({
      collection: 'miembros',
      req,
      context,
      data: {
        nombre: 'Por definir',
        cargo: c.cargo,
        institucion: 'Por definir',
        instancia: 'unidad',
        orden: c.orden,
      },
    });
  }

  // ── 2. Términos de las bases en datos poblados (QA #7/#8) ──
  await db.execute(sql`
    UPDATE pagina_quienes_somos_instituciones
       SET rol = 'Beneficiario — Corporación de Desarrollo Social del Sector Rural'
     WHERE rol ILIKE '%ejecutor principal%'
  `);
  await db.execute(sql`
    UPDATE pagina_quienes_somos_instituciones
       SET rol = 'Coejecutor'
     WHERE rol ILIKE '%co-ejecutor%'
  `);
  await db.execute(sql`
    UPDATE contacto
       SET ejecutor1 = 'CODESSER (Beneficiario) — Corporación de Desarrollo Social del Sector Rural'
     WHERE ejecutor1 = 'CODESSER — Corporación de Desarrollo Social del Sector Rural'
  `);
  await db.execute(sql`
    UPDATE contacto
       SET ejecutor2 = 'Universidad de Talca — Coejecutor'
     WHERE ejecutor2 ILIKE '%co-ejecutor%'
  `);
  // Alinea los DEFAULT de columna con los defaults del código (evita un diff
  // fantasma de drizzle push en dev).
  await db.execute(sql`ALTER TABLE contacto ALTER COLUMN ejecutor1 SET DEFAULT 'CODESSER (Beneficiario) — Corporación de Desarrollo Social del Sector Rural'`);
  await db.execute(sql`ALTER TABLE contacto ALTER COLUMN ejecutor2 SET DEFAULT 'Universidad de Talca — Coejecutor'`);
  // Aportes del Comité cargados por la migración 20260704_213000.
  await db.execute(sql`
    UPDATE miembros
       SET aporte = 'Beneficiario del Bien Público (entidad ejecutora).'
     WHERE aporte = 'Entidad ejecutora del Bien Público.'
  `);
  await db.execute(sql`
    UPDATE miembros
       SET aporte = 'Coejecutor del Bien Público.'
     WHERE aporte = 'Co-ejecutor técnico del Bien Público.'
  `);
  // Párrafo de "El Bien Público" sembrado originalmente (solo si el dueño no
  // lo reescribió: el WHERE exige la frase vieja). Reemplazo textual dentro
  // del JSON de Lexical: la frase no contiene comillas ni escapes.
  await db.execute(sql`
    UPDATE pagina_quienes_somos
       SET bien_publico_contenido = replace(
             bien_publico_contenido::text,
             'CODESSER actúa como ejecutor principal y la Universidad de Talca como co-ejecutor técnico',
             'CODESSER actúa como beneficiario (entidad ejecutora) y la Universidad de Talca como coejecutor'
           )::jsonb
     WHERE bien_publico_contenido::text LIKE '%ejecutor principal%'
  `);
}

export async function down(): Promise<void> {
  // Correctivo de datos: no hay estado anterior que valga la pena restaurar.
}
