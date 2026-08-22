import { NextResponse } from 'next/server';
import { urlAbsoluta } from '@/lib/geo/enlace';
import { getPayload } from '@/lib/payload/getPayload';
import { cargarTextosKml } from '@/lib/geo/servidor';
import { escapeXml } from '@/lib/geo/kml';

export const dynamic = 'force-dynamic';

// NetworkLink para Google Earth: se abre una vez y refresca solo el KMZ cada hora.
// Sin <refreshInterval> el default de KML es 4 s → 21.600 golpes/día por cliente.
export async function GET() {
  let nombre = 'Proyectos H2V Araucanía';
  try {
    const payload = await getPayload();
    const t = await cargarTextosKml(payload);
    nombre = t.nombreNetworkLink || nombre;
  } catch {
    // usa el nombre por defecto
  }
  const href = urlAbsoluta('/api/geo/proyectos/kmz');
  const kml = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2"><NetworkLink>
  <name>${escapeXml(nombre)}</name>
  <open>1</open>
  <Link>
    <href>${escapeXml(href)}</href>
    <refreshMode>onInterval</refreshMode>
    <refreshInterval>3600</refreshInterval>
    <viewRefreshMode>never</viewRefreshMode>
  </Link>
</NetworkLink></kml>`;
  return new NextResponse(kml, {
    headers: {
      'Content-Type': 'application/vnd.google-earth.kml+xml',
      'Content-Disposition': 'attachment; filename="h2v-araucania-proyectos.kml"',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
