import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from '@/lib/payload/getPayload';
import { rateLimit, getClientIp } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';

// Geometría de UNA capa, servida aparte para que la página no cargue el GeoJSON en
// cada visita (docs/PLAN_MAPA_KMZ.md §4.3-4.4: la web es de difusión, no pesada).
// El mapa la pide solo cuando la necesita; caché larga porque el contenido cambia poco.
const checkLimit = rateLimit('geo-geojson', 60 * 1000, 120);

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const ip = getClientIp(request.headers);
  if (!checkLimit(ip).allowed) {
    return NextResponse.json({ error: 'Demasiadas solicitudes.' }, { status: 429 });
  }
  const { id } = await params;
  try {
    const payload = await getPayload();
    const capa = await payload.findByID({ collection: 'capas-geo', id, depth: 0 });
    const geojson = (capa as { geojson?: unknown })?.geojson;
    if (!geojson) {
      return NextResponse.json({ type: 'FeatureCollection', features: [] });
    }
    return NextResponse.json(geojson, {
      headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
    });
  } catch {
    return NextResponse.json({ error: 'Capa no encontrada.' }, { status: 404 });
  }
}
