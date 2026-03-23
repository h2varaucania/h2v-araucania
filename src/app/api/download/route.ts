import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from '@/lib/payload/getPayload';

export async function POST(request: NextRequest) {
  try {
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
        ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
    });

    // Increment download counter on document
    const doc = await payload.findByID({ collection: 'documentos', id: documentId });
    await payload.update({
      collection: 'documentos',
      id: documentId,
      data: { descargas: (doc.descargas || 0) + 1 },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Download tracking error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
