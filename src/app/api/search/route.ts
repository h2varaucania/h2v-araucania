import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from '@/lib/payload/getPayload';
import { rateLimit, getClientIp } from '@/lib/rateLimit';
import { publicados } from '@/lib/published';

// 30 searches per minute per IP
const checkLimit = rateLimit('search', 60 * 1000, 30);

export async function GET(request: NextRequest) {
  try {
    const ip = getClientIp(request.headers);
    const { allowed, retryAfterMs } = checkLimit(ip);
    if (!allowed) {
      return NextResponse.json(
        { error: 'Demasiadas busquedas. Intenta en unos segundos.' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil(retryAfterMs / 1000)) } }
      );
    }

    const q = request.nextUrl.searchParams.get('q');

    if (!q || q.length < 2) {
      return NextResponse.json({ results: [] });
    }

    const payload = await getPayload();

    const [noticias, documentos, proyectos] = await Promise.all([
      payload.find({
        collection: 'noticias',
        where: {
          and: [
            publicados,
            {
              or: [
                { titulo: { contains: q } },
                { extracto: { contains: q } },
              ],
            },
          ],
        },
        limit: 5,
      }),
      payload.find({
        collection: 'documentos',
        where: {
          or: [
            { titulo: { contains: q } },
            { descripcion: { contains: q } },
          ],
        },
        limit: 5,
      }),
      payload.find({
        collection: 'proyectos',
        where: {
          or: [
            { nombre: { contains: q } },
            { descripcion: { contains: q } },
            { empresa: { contains: q } },
          ],
        },
        limit: 5,
      }),
    ]);

    return NextResponse.json({
      results: {
        noticias: noticias.docs.map((n) => ({
          id: n.id,
          tipo: 'noticia',
          titulo: n.titulo,
          href: `/noticias/${n.slug}`,
          extracto: n.extracto,
        })),
        documentos: documentos.docs.map((d) => ({
          id: d.id,
          tipo: 'documento',
          titulo: d.titulo,
          href: `/recursos/documentos`,
          extracto: d.descripcion,
        })),
        proyectos: proyectos.docs.map((p) => ({
          id: p.id,
          tipo: 'proyecto',
          titulo: p.nombre,
          href: `/proyectos`,
          extracto: p.descripcion,
        })),
      },
      total: noticias.totalDocs + documentos.totalDocs + proyectos.totalDocs,
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') console.error('Search error:', error);
    return NextResponse.json({ error: 'Error de busqueda' }, { status: 500 });
  }
}
