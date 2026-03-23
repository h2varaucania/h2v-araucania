import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from '@/lib/payload/getPayload';

export async function GET(request: NextRequest) {
  try {
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
            { publicado: { equals: true } },
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
        noticias: noticias.docs.map((n: any) => ({
          id: n.id,
          tipo: 'noticia',
          titulo: n.titulo,
          href: `/noticias/${n.slug}`,
          extracto: n.extracto,
        })),
        documentos: documentos.docs.map((d: any) => ({
          id: d.id,
          tipo: 'documento',
          titulo: d.titulo,
          href: `/recursos/documentos`,
          extracto: d.descripcion,
        })),
        proyectos: proyectos.docs.map((p: any) => ({
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
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Error de búsqueda' }, { status: 500 });
  }
}
