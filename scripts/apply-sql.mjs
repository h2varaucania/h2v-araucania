// Aplica un archivo .sql contra la base apuntada por DATABASE_URI (Neon prod).
// Uso:  set -a; source .env.prod.local; set +a; node scripts/apply-sql.mjs docs/archivo.sql
// Guardas: exige DATABASE_URI, rechaza localhost, y hace PREFLIGHT (confirma que la
// base tenga el esquema actual antes de tocar nada — evita aplicar a una base stale).
import { readFileSync } from 'node:fs';
import pg from 'pg';

const sqlFile = process.argv[2];
if (!sqlFile) {
  console.error('❌ Falta la ruta del .sql. Uso: node scripts/apply-sql.mjs docs/archivo.sql');
  process.exit(1);
}

const uri = process.env.DATABASE_URI || process.env.DATABASE_URI_UNPOOLED || '';
if (!uri) {
  console.error('❌ DATABASE_URI no está en el entorno. Cárgalo desde .env.prod.local.');
  process.exit(1);
}
if (/localhost|127\.0\.0\.1/.test(uri)) {
  console.error('❌ DATABASE_URI apunta a localhost. Este script es para producción (Neon). Abortado.');
  process.exit(1);
}

const host = (uri.match(/@([^/:?]+)/) || [])[1] || '???';
const sql = readFileSync(sqlFile, 'utf8');
const client = new pg.Client({ connectionString: uri });

const rows = (q, params = []) => client.query(q, params).then((r) => r.rows);
const hasCol = async (t, c) =>
  (await rows(`SELECT 1 FROM information_schema.columns WHERE table_name=$1 AND column_name=$2`, [t, c])).length > 0;
const hasTable = async (t) =>
  (await rows(`SELECT 1 FROM information_schema.tables WHERE table_name=$1`, [t])).length > 0;
const count = async (t) => {
  try { return (await rows(`SELECT count(*)::int AS n FROM ${t}`))[0].n; } catch { return 'n/a'; }
};

try {
  console.log(`🔌 Conectando a: ${host}`);
  await client.connect();

  // ── PREFLIGHT: ¿es la base de producción actual? ──
  const noticiasStatus = await hasCol('noticias', '_status');       // marcador de fix_v2
  const transparencia = await hasTable('pagina_transparencia');     // tabla de fix_v2
  const lockedRels = await hasTable('payload_locked_documents_rels');
  const videoViewsYa = await hasTable('video_views');
  console.log('🧪 Preflight:');
  console.log(`   noticias._status: ${noticiasStatus} | pagina_transparencia: ${transparencia} | payload_locked_documents_rels: ${lockedRels} | video_views ya existe: ${videoViewsYa}`);
  console.log(`   contenido → proyectos: ${await count('proyectos')} · documentos: ${await count('documentos')} · users: ${await count('users')} · noticias: ${await count('noticias')}`);

  if (!noticiasStatus || !transparencia || !lockedRels) {
    console.error('❌ Esta base NO tiene el esquema actual (fix_v2). Podría ser stale/equivocada. Abortado SIN aplicar.');
    process.exit(2);
  }
  if (videoViewsYa) {
    console.log('ℹ️  video_views ya existe; el SQL es idempotente, sigo para asegurar columnas/FK/enganche.');
  }

  // ── APLICAR ──
  console.log(`▶️  Aplicando ${sqlFile} ...`);
  await client.query(sql);
  console.log('✅ SQL aplicado sin error.\n');

  // ── VERIFICAR ──
  const [{ n: filas }] = await rows('SELECT count(*)::int AS n FROM video_views');
  const [{ n: cols }] = await rows(`SELECT count(*)::int AS n FROM information_schema.columns WHERE table_name='video_views'`);
  const [{ n: rel }] = await rows(`SELECT count(*)::int AS n FROM information_schema.columns WHERE table_name='payload_locked_documents_rels' AND column_name='video_views_id'`);
  console.log('🔎 Verificación:');
  console.log(`   • video_views: ${filas} filas (esperado 0), ${cols} columnas (esperado 12)`);
  console.log(`   • payload_locked_documents_rels.video_views_id: ${rel === 1 ? 'presente ✓' : 'AUSENTE ✗'}`);
} catch (err) {
  console.error('❌ Error:', err.message);
  process.exitCode = 1;
} finally {
  await client.end();
}
