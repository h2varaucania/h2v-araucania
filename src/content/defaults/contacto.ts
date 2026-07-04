// Única fuente de verdad del contenido inicial de la página Contacto
// (EDITABILIDAD_TOTAL §3.2). Copiado VERBATIM de la página/formulario al
// momento del retrofit. Alimenta: defaultValue del global, fallbacks t() del
// componente, y la migración de datos.
export const contactoDefaults = {
  // Página
  tituloPagina: 'Contacto',
  bajadaPagina: 'Escríbenos para consultas, colaboraciones o más información.',
  tituloFormulario: 'Envíanos un mensaje',
  tituloInfo: 'Información de contacto',
  etiquetaEmail: 'Correo electrónico',
  etiquetaUbicacion: 'Ubicación',
  etiquetaTelefono: 'Teléfono',
  etiquetaPrograma: 'Programa',
  programaLinea2: 'Programa Desarrollo Productivo Sostenible — CORFO',
  tituloEjecutores: 'Ejecutado por',
  tituloMandante: 'Mandante',
  // Formulario
  formEtiquetaNombre: 'Nombre completo',
  formPlaceholderNombre: 'Tu nombre',
  formEtiquetaEmail: 'Correo electrónico',
  formPlaceholderEmail: 'tu@email.com',
  formEtiquetaAsunto: 'Asunto',
  formOpcionPorDefecto: 'Selecciona un asunto',
  formOpcionesAsunto: [
    { etiqueta: 'Consulta general', valor: 'consulta' },
    { etiqueta: 'Propuesta de colaboración', valor: 'colaboracion' },
    { etiqueta: 'Prensa y comunicaciones', valor: 'prensa' },
    { etiqueta: 'Otro', valor: 'otro' },
  ],
  formEtiquetaMensaje: 'Mensaje',
  formPlaceholderMensaje: 'Escribe tu mensaje aquí...',
  formTextoBoton: 'Enviar mensaje',
  formTextoEnviando: 'Enviando...',
  formTituloExito: 'Mensaje enviado',
  formTextoExito: 'Gracias por contactarnos. Responderemos a la brevedad.',
  formTextoOtroMensaje: 'Enviar otro mensaje',
  formTextoError: 'Error al enviar. Por favor intenta nuevamente.',
  // Datos institucionales (ya existían en el global; se repiten como fallback)
  email: 'h2varaucania@gmail.com',
  ubicacion: 'Temuco, Región de La Araucanía, Chile',
  codigoBP: 'Bien Público 24BP-269085',
  ejecutor1: 'CODESSER — Corporación de Desarrollo Social del Sector Rural',
  ejecutor2: 'Universidad de Talca — Co-ejecutor técnico',
  mandante: 'Subsecretaría de Energía — Ministerio de Energía',
} as const;

export type ContactoDefaults = typeof contactoDefaults;
