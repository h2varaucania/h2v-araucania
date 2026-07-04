// SOLO LECTURA. Confirma a qué base apunta DATABASE_URI comparando su contenido
// con el sitio en vivo. No escribe nada.
import pg from 'pg';
const uri = process.env.DATABASE_URI || '';
if (!uri || /localhost/.test(uri)) { console.error('DATABASE_URI inválida'); process.exit(1); }
const host = (uri.match(/@([^/:?]+)/) || [])[1];
const c = new pg.Client({ connectionString: uri });
const rows = (q) => c.query(q).then(r => r.rows).catch(() => null);
try {
  await c.connect();
  console.log('host:', host);
  const sg = await rows(`SELECT nombre_sitio FROM sitio_general LIMIT 1`);
  console.log('sitio_general.nombre_sitio:', sg ? sg[0]?.nombre_sitio : 'n/a');
  for (const t of ['proyectos', 'users', 'documentos', 'noticias', 'eventos', 'miembros']) {
    const r = await rows(`SELECT count(*)::int n FROM ${t}`);
    console.log(`  ${t}:`, r ? r[0].n : 'n/a');
  }
  const vv = await rows(`SELECT 1 FROM information_schema.tables WHERE table_name='video_views'`);
  console.log('video_views existe:', !!(vv && vv.length));
  const pr = await rows(`SELECT nombre FROM proyectos ORDER BY id LIMIT 3`);
  console.log('primeros proyectos:', pr ? pr.map(x => x.nombre).join(' | ') : 'n/a');
} catch (e) { console.error('Error:', e.message); process.exitCode = 1; }
finally { await c.end(); }
