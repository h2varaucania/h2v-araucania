import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from '@/lib/payload/getPayload';
import { rateLimit, getClientIp } from '@/lib/rateLimit';

// Generoso: los "play"/"fin" son pocos por sesión, pero varios videos por visita.
const checkLimit = rateLimit('video-event', 5 * 60 * 1000, 120);

const EVENTOS = new Set(['play', 'fin']);
const MAX_SEGUNDOS = 24 * 60 * 60; // tope de seguridad (1 día) contra datos basura

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request.headers);
    const { allowed } = checkLimit(ip);
    if (!allowed) {
      return NextResponse.json({ error: 'Demasiadas solicitudes.' }, { status: 429 });
    }

    // sendBeacon manda el cuerpo como texto/blob; leerlo como texto y parsear a mano
    // es más robusto que request.json() ante distintos content-type.
    const raw = await request.text();
    let body: Record<string, unknown> = {};
    try {
      body = raw ? JSON.parse(raw) : {};
    } catch {
      return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
    }

    const videoKey = typeof body.videoKey === 'string' ? body.videoKey.slice(0, 120) : '';
    const videoTitulo = typeof body.videoTitulo === 'string' ? body.videoTitulo.slice(0, 200) : '';
    const evento = typeof body.evento === 'string' ? body.evento : '';
    const sessionId = typeof body.sessionId === 'string' ? body.sessionId.slice(0, 60) : '';
    const segundosRaw = Number(body.segundos);
    const segundos = Number.isFinite(segundosRaw)
      ? Math.max(0, Math.min(MAX_SEGUNDOS, Math.round(segundosRaw)))
      : 0;

    if (!videoKey || !videoTitulo || !EVENTOS.has(evento)) {
      return NextResponse.json({ error: 'Parámetros inválidos' }, { status: 400 });
    }

    const payload = await getPayload();

    // Usuario logueado (si lo hay) para el verificador "usuarios que reprodujeron".
    // Los IDs de esta base son numéricos (Postgres serial).
    let userId: number | undefined;
    try {
      const authed = await payload.auth({ headers: request.headers });
      if (typeof authed?.user?.id === 'number') userId = authed.user.id;
    } catch {
      // Anónimo: se registra solo IP/navegador.
    }

    await payload.create({
      collection: 'video-views',
      data: {
        videoTitulo,
        videoKey,
        evento: evento as 'play' | 'fin',
        segundosVistos: evento === 'fin' ? segundos : 0,
        sessionId,
        ...(userId ? { user: userId } : {}),
        watchedAt: new Date().toISOString(),
        ip,
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') console.error('Video event tracking error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
