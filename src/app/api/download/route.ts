import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from '@/lib/payload/getPayload';
import { rateLimit, getClientIp } from '@/lib/rateLimit';

// 20 downloads per 5 minutes per IP
const checkLimit = rateLimit('download', 5 * 60 * 1000, 20);

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request.headers);
    const { allowed } = checkLimit(ip);
    if (!allowed) {
      return NextResponse.json(
        { error: 'Demasiadas descargas. Intenta en unos minutos.' },
        { status: 429 }
      );
    }

    const { documentId } = await request.json();

    if (!documentId) {
      return NextResponse.json({ error: 'documentId required' }, { status: 400 });
    }

    const payload = await getPayload();

    // Record download
    await payload.create({
      collection: 'downloads',
      data: {
        documento: documentId,
        downloadedAt: new Date().toISOString(),
        ip,
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
    });

    // Increment download counter on document
    const doc = await payload.findByID({ collection: 'documentos', id: documentId });
    await payload.update({
      collection: 'documentos',
      id: documentId,
      data: { descargas: ((doc.descargas as number) || 0) + 1 },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') console.error('Download tracking error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
