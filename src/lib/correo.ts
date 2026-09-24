/**
 * Remitente de los correos que envía el sitio: la recuperación de contraseña (Payload) y
 * el aviso de cada mensaje del formulario de Contacto.
 *
 * Mientras el sitio no tenga un dominio propio verificado en Resend, se usa la dirección de
 * prueba de Resend, que SOLO entrega al correo dueño de la cuenta Resend: a cualquier otro
 * destinatario Resend responde 403. Con un dominio verificado basta crear en Vercel la
 * variable EMAIL_FROM (p. ej. no-responder@midominio.cl) y volver a publicar.
 */
export const REMITENTE_CORREO = process.env.EMAIL_FROM || 'onboarding@resend.dev';
export const NOMBRE_REMITENTE = 'H2V Araucanía';
