import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { rateLimit, getClientIp } from '@/lib/rateLimit';

const contactSchema = z.object({
  nombre: z.string().min(2).max(100),
  email: z.string().email(),
  asunto: z.enum(['consulta', 'colaboracion', 'prensa', 'otro']),
  mensaje: z.string().min(10).max(5000),
});

// 5 contact submissions per 15 minutes per IP
const checkLimit = rateLimit('contact', 15 * 60 * 1000, 5);

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request.headers);
    const { allowed, retryAfterMs } = checkLimit(ip);
    if (!allowed) {
      return NextResponse.json(
        { error: 'Demasiados mensajes enviados. Intenta nuevamente en 15 minutos.' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil(retryAfterMs / 1000)) } }
      );
    }

    const body = await request.json();
    const data = contactSchema.parse(body);

    // Send email via Resend if configured
    if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 'your-resend-api-key') {
      const { Resend } = await import('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: 'H2V Araucania <noreply@h2varaucania.cl>',
        to: process.env.CONTACT_EMAIL || 'h2varaucania@gmail.com',
        subject: `[Contacto Web] ${data.asunto} - ${data.nombre}`,
        text: `Nombre: ${data.nombre}\nEmail: ${data.email}\nAsunto: ${data.asunto}\n\nMensaje:\n${data.mensaje}`,
      });
    } else {
      console.log('[CONTACT][DEV MODE - email not sent, configure RESEND_API_KEY]', data);
    }

    const isDevMode = !process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'your-resend-api-key';

    return NextResponse.json({
      success: true,
      message: isDevMode
        ? 'Mensaje recibido (modo desarrollo: el email no se envio. Configure RESEND_API_KEY en produccion).'
        : 'Mensaje enviado correctamente. Responderemos a la brevedad.',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Datos invalidos', details: error.issues }, { status: 400 });
    }
    if (process.env.NODE_ENV !== 'production') console.error('Contact form error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
