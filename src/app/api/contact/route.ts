import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { rateLimit, getClientIp } from '@/lib/rateLimit';
import { getPayload } from '@/lib/payload/getPayload';
import { NOMBRE_REMITENTE, REMITENTE_CORREO } from '@/lib/correo';
import { OPCIONES_ASUNTO } from '@/collections/MensajesContacto';

const contactSchema = z.object({
  nombre: z.string().min(2).max(100),
  email: z.string().email(),
  asunto: z.enum(['consulta', 'colaboracion', 'prensa', 'otro']),
  mensaje: z.string().min(10).max(5000),
});

type DatosContacto = z.infer<typeof contactSchema>;
type EstadoCorreo = 'enviado' | 'fallido' | 'sin-configurar';

// 5 contact submissions per 15 minutes per IP
const checkLimit = rateLimit('contact', 15 * 60 * 1000, 5);

// Aviso por correo al programa. OJO: el SDK de Resend NO lanza excepciones cuando Resend
// rechaza el envío: devuelve { error }. Hay que revisarlo, o el fallo pasa en silencio.
async function avisarPorCorreo(data: DatosContacto): Promise<EstadoCorreo> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey === 'your-resend-api-key') return 'sin-configurar';

  const asunto = OPCIONES_ASUNTO.find((o) => o.value === data.asunto)?.label ?? data.asunto;
  try {
    const { Resend } = await import('resend');
    const { error } = await new Resend(apiKey).emails.send({
      from: `${NOMBRE_REMITENTE} <${REMITENTE_CORREO}>`,
      to: process.env.CONTACT_EMAIL || 'h2varaucania@gmail.com',
      replyTo: data.email,
      subject: `[Contacto Web] ${asunto} - ${data.nombre}`,
      text: `Nombre: ${data.nombre}\nEmail: ${data.email}\nAsunto: ${asunto}\n\nMensaje:\n${data.mensaje}\n\n(El mensaje también quedó guardado en el panel: Contenido → Mensajes de contacto.)`,
    });
    if (error) {
      console.error('[CONTACT] Resend rechazó el aviso por correo:', error.message);
      return 'fallido';
    }
    return 'enviado';
  } catch (err) {
    console.error('[CONTACT] Error al enviar el aviso por correo:', err);
    return 'fallido';
  }
}

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

    // 1) Primero se guarda en el panel (Contenido → Mensajes de contacto): así el mensaje
    //    no se pierde aunque el correo falle.
    const payload = await getPayload();
    let mensajeId: number | string | null = null;
    try {
      const doc = await payload.create({
        collection: 'mensajes-contacto',
        data: { nombre: data.nombre, correo: data.email, asunto: data.asunto, mensaje: data.mensaje },
        overrideAccess: true,
      });
      mensajeId = doc.id;
    } catch (err) {
      console.error('[CONTACT] No se pudo guardar el mensaje en la base de datos:', err);
    }

    // 2) Después, el aviso por correo; su resultado queda anotado en el mensaje guardado.
    const estadoCorreo = await avisarPorCorreo(data);
    if (mensajeId !== null) {
      await payload
        .update({ collection: 'mensajes-contacto', id: mensajeId, data: { estadoCorreo }, overrideAccess: true })
        .catch((err) => console.error('[CONTACT] No se pudo anotar el estado del correo:', err));
    }

    // Solo es un error si el mensaje no quedó en ninguna parte.
    if (mensajeId === null && estadoCorreo !== 'enviado') {
      return NextResponse.json({ error: 'No se pudo enviar el mensaje.' }, { status: 500 });
    }
    return NextResponse.json({ success: true, message: 'Mensaje enviado correctamente. Responderemos a la brevedad.' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Datos invalidos', details: error.issues }, { status: 400 });
    }
    if (process.env.NODE_ENV !== 'production') console.error('Contact form error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
