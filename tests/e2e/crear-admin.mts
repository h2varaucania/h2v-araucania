// Crea/asegura el admin e2e vía Local API (lo invoca global-setup con tsx).
// El hook de Users sanitiza el rol en CREATE sin req.user → se fija con UPDATE.
import { getPayload } from 'payload';
import config from '../../payload.config';

const EMAIL = 'e2e-admin@test.local';
const payload = await getPayload({ config });
const existing = await payload.find({ collection: 'users', where: { email: { equals: EMAIL } }, limit: 1 });
let id: number;
if (existing.totalDocs === 0) {
  const u = await payload.create({ collection: 'users', data: { email: EMAIL, password: 'E2eAdmin2026!', nombre: 'E2E Admin', role: 'admin' } });
  id = u.id;
} else {
  id = existing.docs[0].id;
}
await payload.update({ collection: 'users', id, data: { role: 'admin' } });
console.log('e2e admin listo (rol admin)');
process.exit(0);
