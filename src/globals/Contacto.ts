import type { GlobalConfig } from 'payload';
import { isAdmin } from '@/lib/access';
import { revalidaGlobal } from '@/hooks/revalidate';
import { contactoDefaults as d } from '@/content/defaults/contacto';

export const ContactoGlobal: GlobalConfig = {
  slug: 'contacto',
  hooks: { afterChange: [revalidaGlobal('/contacto', '/')] },
  label: 'Contacto',
  // Datos institucionales (email público, mandante, código BP): solo administradores (F8).
  access: { update: isAdmin },
  admin: {
    group: 'Configuración',
    description:
      'TODO lo que se ve en la página de Contacto: textos de la página, formulario y datos institucionales (también usados en el footer).',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Página',
          description: 'Títulos y etiquetas visibles en la página de Contacto.',
          fields: [
            { name: 'tituloPagina', type: 'text', maxLength: 60, defaultValue: d.tituloPagina, label: 'Título de la página', admin: { description: 'El título grande del encabezado azul. Ej: "Contacto"' } },
            { name: 'bajadaPagina', type: 'text', maxLength: 200, defaultValue: d.bajadaPagina, label: 'Bajada del encabezado', admin: { description: 'Frase bajo el título. Ej: "Escríbenos para consultas..."' } },
            { name: 'tituloFormulario', type: 'text', maxLength: 60, defaultValue: d.tituloFormulario, label: 'Título de la columna del formulario', admin: { description: 'Ej: "Envíanos un mensaje"' } },
            { name: 'tituloInfo', type: 'text', maxLength: 60, defaultValue: d.tituloInfo, label: 'Título de la columna de información', admin: { description: 'Ej: "Información de contacto"' } },
            { name: 'etiquetaEmail', type: 'text', maxLength: 40, defaultValue: d.etiquetaEmail, label: 'Etiqueta del correo', admin: { description: 'Ej: "Correo electrónico"' } },
            { name: 'etiquetaUbicacion', type: 'text', maxLength: 40, defaultValue: d.etiquetaUbicacion, label: 'Etiqueta de la ubicación', admin: { description: 'Ej: "Ubicación"' } },
            { name: 'etiquetaTelefono', type: 'text', maxLength: 40, defaultValue: d.etiquetaTelefono, label: 'Etiqueta del teléfono', admin: { description: 'Ej: "Teléfono"' } },
            { name: 'etiquetaPrograma', type: 'text', maxLength: 40, defaultValue: d.etiquetaPrograma, label: 'Etiqueta del programa', admin: { description: 'Ej: "Programa"' } },
            { name: 'programaLinea2', type: 'text', maxLength: 100, defaultValue: d.programaLinea2, label: 'Línea secundaria del programa', admin: { description: 'Texto pequeño bajo el código del Bien Público.' } },
            { name: 'tituloEjecutores', type: 'text', maxLength: 40, defaultValue: d.tituloEjecutores, label: 'Título del bloque de ejecutores', admin: { description: 'Ej: "Ejecutado por"' } },
            { name: 'tituloMandante', type: 'text', maxLength: 40, defaultValue: d.tituloMandante, label: 'Título del bloque del mandante', admin: { description: 'Ej: "Mandante"' } },
          ],
        },
        {
          label: 'Formulario',
          description: 'Etiquetas, opciones y mensajes del formulario de contacto.',
          fields: [
            { name: 'formEtiquetaNombre', type: 'text', maxLength: 40, defaultValue: d.formEtiquetaNombre, label: 'Etiqueta del nombre', admin: { description: 'Ej: "Nombre completo"' } },
            { name: 'formPlaceholderNombre', type: 'text', maxLength: 60, defaultValue: d.formPlaceholderNombre, label: 'Texto de ejemplo del nombre', admin: { description: 'Texto gris dentro del campo. Ej: "Tu nombre"' } },
            { name: 'formEtiquetaEmail', type: 'text', maxLength: 40, defaultValue: d.formEtiquetaEmail, label: 'Etiqueta del correo', admin: { description: 'Ej: "Correo electrónico"' } },
            { name: 'formPlaceholderEmail', type: 'text', maxLength: 60, defaultValue: d.formPlaceholderEmail, label: 'Texto de ejemplo del correo', admin: { description: 'Ej: "tu@email.com"' } },
            { name: 'formEtiquetaAsunto', type: 'text', maxLength: 40, defaultValue: d.formEtiquetaAsunto, label: 'Etiqueta del asunto', admin: { description: 'Ej: "Asunto"' } },
            { name: 'formOpcionPorDefecto', type: 'text', maxLength: 60, defaultValue: d.formOpcionPorDefecto, label: 'Opción por defecto del asunto', admin: { description: 'Primera opción del selector. Ej: "Selecciona un asunto"' } },
            {
              name: 'formOpcionesAsunto',
              type: 'array',
              label: 'Opciones de asunto',
              labels: { singular: 'Opción', plural: 'Opciones' },
              defaultValue: d.formOpcionesAsunto.map((o) => ({ ...o })),
              admin: { description: 'Los asuntos que puede elegir quien escribe. Agrega, quita o reordena arrastrando.' },
              fields: [
                { name: 'etiqueta', type: 'text', required: true, maxLength: 60, label: 'Texto visible', admin: { description: 'Ej: "Consulta general"' } },
                { name: 'valor', type: 'text', required: true, maxLength: 40, label: 'Valor interno', admin: { description: 'Identificador sin espacios. Ej: "consulta"' } },
              ],
            },
            { name: 'formEtiquetaMensaje', type: 'text', maxLength: 40, defaultValue: d.formEtiquetaMensaje, label: 'Etiqueta del mensaje', admin: { description: 'Ej: "Mensaje"' } },
            { name: 'formPlaceholderMensaje', type: 'text', maxLength: 80, defaultValue: d.formPlaceholderMensaje, label: 'Texto de ejemplo del mensaje', admin: { description: 'Ej: "Escribe tu mensaje aquí..."' } },
            { name: 'formTextoBoton', type: 'text', maxLength: 40, defaultValue: d.formTextoBoton, label: 'Texto del botón', admin: { description: 'Ej: "Enviar mensaje"' } },
            { name: 'formTextoEnviando', type: 'text', maxLength: 40, defaultValue: d.formTextoEnviando, label: 'Texto mientras envía', admin: { description: 'Ej: "Enviando..."' } },
            { name: 'formTituloExito', type: 'text', maxLength: 60, defaultValue: d.formTituloExito, label: 'Título del mensaje de éxito', admin: { description: 'Ej: "Mensaje enviado"' } },
            { name: 'formTextoExito', type: 'text', maxLength: 150, defaultValue: d.formTextoExito, label: 'Texto del mensaje de éxito', admin: { description: 'Ej: "Gracias por contactarnos. Responderemos a la brevedad."' } },
            { name: 'formTextoOtroMensaje', type: 'text', maxLength: 60, defaultValue: d.formTextoOtroMensaje, label: 'Texto de "enviar otro"', admin: { description: 'Ej: "Enviar otro mensaje"' } },
            { name: 'formTextoError', type: 'text', maxLength: 150, defaultValue: d.formTextoError, label: 'Texto de error', admin: { description: 'Ej: "Error al enviar. Por favor intenta nuevamente."' } },
          ],
        },
        {
          label: 'Datos institucionales',
          description: 'Correo, ubicación y entidades del programa (se usan también en el footer).',
          fields: [
            {
              name: 'email',
              type: 'email',
              required: true,
              label: 'Email de contacto',
              defaultValue: d.email,
              admin: { description: 'Email público al que llegarán los mensajes del formulario de contacto.' },
            },
            {
              name: 'ubicacion',
              type: 'text',
              label: 'Ubicación',
              maxLength: 100,
              defaultValue: d.ubicacion,
              admin: { description: 'Dirección o ciudad que se muestra en la página de contacto.' },
            },
            {
              name: 'telefono',
              type: 'text',
              label: 'Teléfono (opcional)',
              maxLength: 20,
              admin: { description: 'Número de teléfono público. Déjalo vacío si no aplica.' },
            },
            {
              name: 'ejecutor1',
              type: 'text',
              label: 'Beneficiario (entidad ejecutora)',
              maxLength: 100,
              defaultValue: d.ejecutor1,
              admin: { description: 'Beneficiario del Bien Público según las bases: CODESSER.' },
            },
            {
              name: 'ejecutor2',
              type: 'text',
              label: 'Coejecutor',
              maxLength: 100,
              defaultValue: d.ejecutor2,
              admin: { description: 'Coejecutor del Bien Público según las bases: Universidad de Talca.' },
            },
            {
              name: 'mandante',
              type: 'text',
              label: 'Mandante',
              maxLength: 100,
              defaultValue: d.mandante,
              admin: { description: 'Institución mandante del programa.' },
            },
            {
              name: 'codigoBP',
              type: 'text',
              label: 'Código Bien Público',
              maxLength: 30,
              defaultValue: d.codigoBP,
              admin: { description: 'Código CORFO del Bien Público.' },
            },
          ],
        },
      ],
    },
  ],
};
