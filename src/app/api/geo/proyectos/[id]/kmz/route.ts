import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from '@/lib/payload/getPayload';
import { rateLimit, getClientIp } from '@/lib/rateLimit';
import { cargarProyectosParaKmz, cargarEtapas, cargarTextosKml } from '@/lib/geo/servidor';
import { generarKml } from '@/lib/geo/kml';
import { generarKmz } from '@/lib/geo/kmz';

export const dynamic = 'force-dynamic';

// KMZ de UN proyecto. 30 descargas / 5 min por IP.
const checkLimit = rateLimit('geo-kmz-uno', 5 * 60 * 1000, 30);

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const ip = getClientIp(request.headers);
  if (!checkLimit(ip).allowed) {
    return NextResponse.json({ error: 'Demasiadas descargas. Intenta en unos minutos.' }, { status: 429 });
  }
  const { id } = await params;
  try {
    const payload = await getPayload();
    const [proyectos, etapas, textos] = await Promise.all([
      cargarProyectosParaKmz(payload, id),
      cargarEtapas(payload),
      cargarTextosKml(payload),
    ]);
    if (proyectos.length === 0) {
      return NextResponse.json({ error: 'Proyecto no encontrado.' }, { status: 404 });
    }
    const slug = (proyectos[0].nombre || 'proyecto')
      .toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'proyecto';
    const kml = generarKml(proyectos, { etapas, textos });
    const kmz = generarKmz(kml);
    return new NextResponse(Buffer.from(kmz), {
      headers: {
        'Content-Type': 'application/vnd.google-earth.kmz',
        'Content-Disposition': `attachment; filename="h2v-araucania-${slug}.kmz"`,
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') console.error('KMZ proyecto error:', e);
    return NextResponse.json({ error: 'No se pudo generar el archivo.' }, { status: 500 });
  }
}
