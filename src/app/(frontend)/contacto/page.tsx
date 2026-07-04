import type { Metadata } from 'next';
import ContactForm, { type ContactFormTextos } from '@/components/forms/ContactForm';
import { getPayload } from '@/lib/payload/getPayload';
import { t, list } from '@/lib/contenido';
import { contactoDefaults as d } from '@/content/defaults/contacto';
import type { Contacto as ContactoGlobalType } from '@/payload-types';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Contacto',
  description: 'Escríbenos para consultas sobre el programa de Hidrógeno Verde en La Araucanía.',
  openGraph: {
    title: 'Contacto | H2V Araucanía',
    description: 'Escríbenos para consultas sobre el programa de Hidrógeno Verde en La Araucanía.',
  },
};

export default async function Contacto() {
  let g: ContactoGlobalType | null = null;
  try {
    const payload = await getPayload();
    g = (await payload.findGlobal({ slug: 'contacto' })) as ContactoGlobalType;
  } catch {
    // Sin CMS disponible: la página completa rinde con los defaults.
  }

  const email = t(g?.email, d.email);
  const telefono = g?.telefono || '';
  const textosForm: ContactFormTextos = {
    etiquetaNombre: t(g?.formEtiquetaNombre, d.formEtiquetaNombre),
    placeholderNombre: t(g?.formPlaceholderNombre, d.formPlaceholderNombre),
    etiquetaEmail: t(g?.formEtiquetaEmail, d.formEtiquetaEmail),
    placeholderEmail: t(g?.formPlaceholderEmail, d.formPlaceholderEmail),
    etiquetaAsunto: t(g?.formEtiquetaAsunto, d.formEtiquetaAsunto),
    opcionPorDefecto: t(g?.formOpcionPorDefecto, d.formOpcionPorDefecto),
    opcionesAsunto: list(
      g?.formOpcionesAsunto?.map((o) => ({ etiqueta: o.etiqueta, valor: o.valor })),
      d.formOpcionesAsunto.map((o) => ({ ...o })),
    ),
    etiquetaMensaje: t(g?.formEtiquetaMensaje, d.formEtiquetaMensaje),
    placeholderMensaje: t(g?.formPlaceholderMensaje, d.formPlaceholderMensaje),
    textoBoton: t(g?.formTextoBoton, d.formTextoBoton),
    textoEnviando: t(g?.formTextoEnviando, d.formTextoEnviando),
    tituloExito: t(g?.formTituloExito, d.formTituloExito),
    textoExito: t(g?.formTextoExito, d.formTextoExito),
    textoOtroMensaje: t(g?.formTextoOtroMensaje, d.formTextoOtroMensaje),
    textoError: t(g?.formTextoError, d.formTextoError),
  };

  return (
    <div>
      <section className="bg-h2v-blue text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-semibold mb-4">{t(g?.tituloPagina, d.tituloPagina)}</h1>
          <p className="text-lg opacity-80">{t(g?.bajadaPagina, d.bajadaPagina)}</p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-xl font-semibold text-h2v-blue mb-6">{t(g?.tituloFormulario, d.tituloFormulario)}</h2>
            <ContactForm textos={textosForm} />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-h2v-blue mb-6">{t(g?.tituloInfo, d.tituloInfo)}</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-h2v-green/10 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-h2v-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-h2v-blue">{t(g?.etiquetaEmail, d.etiquetaEmail)}</p>
                  <a href={`mailto:${email}`} className="text-h2v-green hover:underline">{email}</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-h2v-green/10 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-h2v-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-h2v-blue">{t(g?.etiquetaUbicacion, d.etiquetaUbicacion)}</p>
                  <p className="text-gray-600">{t(g?.ubicacion, d.ubicacion)}</p>
                </div>
              </div>

              {telefono && (
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-h2v-green/10 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-h2v-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-h2v-blue">{t(g?.etiquetaTelefono, d.etiquetaTelefono)}</p>
                    <a href={`tel:${telefono}`} className="text-h2v-green hover:underline">{telefono}</a>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-h2v-green/10 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-h2v-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-h2v-blue">{t(g?.etiquetaPrograma, d.etiquetaPrograma)}</p>
                  <p className="text-gray-600">{t(g?.codigoBP, d.codigoBP)}</p>
                  <p className="text-sm text-gray-400">{t(g?.programaLinea2, d.programaLinea2)}</p>
                </div>
              </div>
            </div>

            <div className="mt-10 p-6 bg-gray-50 rounded-xl">
              <p className="text-sm font-medium text-gray-500 mb-3">{t(g?.tituloEjecutores, d.tituloEjecutores)}</p>
              <div className="space-y-2 text-sm text-gray-700">
                <p>{t(g?.ejecutor1, d.ejecutor1)}</p>
                <p>{t(g?.ejecutor2, d.ejecutor2)}</p>
              </div>
              <p className="text-sm font-medium text-gray-500 mt-4 mb-2">{t(g?.tituloMandante, d.tituloMandante)}</p>
              <p className="text-sm text-gray-700">{t(g?.mandante, d.mandante)}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
