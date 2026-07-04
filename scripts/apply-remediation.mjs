// Remediación de esquema de producción (2026-07-04): prod quedó en el esquema
// inicial; aplica fix_v2 (drafts + 5 globals faltantes, aditivo/idempotente) y
// luego video_views, y VERIFICA que el esquema quede completo. SOLO añade.
import { readFileSync } from 'node:fs';
import pg from 'pg';

const uri = process.env.DATABASE_URI || '';
if (!uri || /localhost/.test(uri)) { console.error('DATABASE_URI inválida/localhost'); process.exit(1); }
const host = (uri.match(/@([^/:?]+)/) || [])[1];
const c = new pg.Client({ connectionString: uri });
const rows = (q, p = []) => c.query(q, p).then((r) => r.rows);
const hasTable = async (t) => (await rows(`SELECT 1 FROM information_schema.tables WHERE table_name=$1`, [t])).length > 0;
const hasCol = async (t, col) => (await rows(`SELECT 1 FROM information_schema.columns WHERE table_name=$1 AND column_name=$2`, [t, col])).length > 0;

try {
  console.log('🔌', host);
  await c.connect();

  for (const f of ['docs/fix_esquema_prod_20260703.sql', 'docs/fix_video_views_prod_20260704.sql']) {
    console.log(`▶️  Aplicando ${f} ...`);
    await c.query(readFileSync(f, 'utf8'));
    console.log(`   ✓ ${f} aplicado`);
  }

  // ── Verificación de completitud del esquema ──
  console.log('\n🔎 Verificación de esquema:');
  const tablasEsperadas = [
    '_noticias_v', '_eventos_v',
    'pagina_transparencia', 'pagina_transparencia_items',
    'pagina_mediateca', 'pagina_mediateca_recursos',
    'pagina_proyectos', 'pagina_privacidad', 'pagina_accesibilidad',
    'pagina_gobernanza_actividades', 'pagina_gobernanza_diagrama_equipos',
    'pagina_h2v_explora_mas',
    'video_views',
  ];
  let faltan = 0;
  for (const t of tablasEsperadas) {
    const ok = await hasTable(t);
    if (!ok) faltan++;
    console.log(`   ${ok ? '✓' : '✗ FALTA'}  ${t}`);
  }
  const colChecks = [
    ['noticias', '_status'], ['eventos', '_status'],
    ['pagina_gobernanza', 'diagrama_consejo'],
    ['payload_locked_documents_rels', 'video_views_id'],
  ];
  for (const [t, col] of colChecks) {
    const ok = await hasCol(t, col);
    if (!ok) faltan++;
    console.log(`   ${ok ? '✓' : '✗ FALTA'}  ${t}.${col}`);
  }
  const totalTablas = (await rows(`SELECT count(*)::int n FROM information_schema.tables WHERE table_schema='public'`))[0].n;
  console.log(`\n   Total tablas ahora: ${totalTablas} (antes 45)`);
  console.log(faltan === 0 ? '\n✅ Esquema COMPLETO. Nada falta.' : `\n❌ Quedan ${faltan} piezas faltantes — revisar.`);
  process.exitCode = faltan === 0 ? 0 : 3;
} catch (e) {
  console.error('❌ Error:', e.message);
  process.exitCode = 1;
} finally {
  await c.end();
}
