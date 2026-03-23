import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const contactSchema = z.object({
  nombre: z.string().min(2).max(100),
  email: z.string().email(),
  asunto: z.enum(['consulta', 'colaboracion', 'prensa', 'otro']),
  mensaje: z.string().min(10).max(5000),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = contactSchema.parse(body);

    // For now, log the contact. In production, use Resend to send email.
    // import { Resend } from 'resend';
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'H2V Araucanía <noreply@h2varaucania.cl>',
    //   to: process.env.CONTACT_EMAIL || 'h2varaucania@gmail.com',
    //   subject: `[Contacto Web] ${data.asunto} - ${data.nombre}`,
    //   text: `Nombre: ${data.nombre}\nEmail: ${data.email}\nAsunto: ${data.asunto}\n\nMensaje:\n${data.mensaje}`,
    // });

    console.log('[CONTACT]', data);

    return NextResponse.json({ success: true, message: 'Mensaje enviado correctamente' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Datos inválidos', details: error.errors }, { status: 400 });
    }
    console.error('Contact form error:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
