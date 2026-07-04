import type { Metadata } from 'next';
import { getPayload } from '@/lib/payload/getPayload';
import { tieneContenido } from '@/lib/richtext';
import { RichText } from '@payloadcms/richtext-lexical/react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Política de Privacidad',
  description: 'Política de privacidad y protección de datos personales de H2V Araucanía.',
};

export default async function PoliticaPrivacidad() {
  // Defaults de respaldo; el CMS (global "Política de Privacidad") los sobreescribe.
  const hero = {
    titulo: 'Política de Privacidad',
    subtitulo: 'Protección de datos personales conforme a la legislación chilena.',
  };
  let fechaActualizacion = 'abril 2026';
  let contenidoCMS: unknown = null;
  // El email se toma SIEMPRE de Configuración → Contacto (una sola fuente).
  let email = 'h2varaucania@gmail.com';

  try {
    const payload = await getPayload();
    const data = await payload.findGlobal({ slug: 'pagina-privacidad' });
    if (data?.hero?.titulo) hero.titulo = data.hero.titulo;
    if (data?.hero?.subtitulo) hero.subtitulo = data.hero.subtitulo;
    if (data?.fechaActualizacion) fechaActualizacion = data.fechaActualizacion;
    if (tieneContenido(data?.contenido)) contenidoCMS = data.contenido;
    const contacto = await payload.findGlobal({ slug: 'contacto' });
    if (contacto?.email) email = contacto.email as string;
  } catch {
    // DB unavailable — usar defaults
  }

  return (
    <div>
      <section className="bg-h2v-blue text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-semibold mb-4">{hero.titulo}</h1>
          <p className="text-lg opacity-80">{hero.subtitulo}</p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto prose prose-lg prose-headings:text-h2v-blue">
          <p className="text-gray-600 text-lg">
            Última actualización: {fechaActualizacion}
          </p>

          {contenidoCMS ? (
            <RichText data={contenidoCMS as never} />
          ) : (
            <>
              <h2>1. Responsable del tratamiento</h2>
              <p>
                El responsable del tratamiento de datos personales recopilados a través de este sitio web es el Programa Estratégico Regional de Hidrógeno Verde en La Araucanía (Bien Público 24BP-269085), ejecutado por CODESSER y co-ejecutado por la Universidad de Talca, con el mandato de la Subsecretaría de Energía del Ministerio de Energía de Chile, y financiado por CORFO.
              </p>

              <h2>2. Datos que recopilamos</h2>
              <p>A través de este sitio web podemos recopilar:</p>
              <ul>
                <li><strong>Datos de contacto:</strong> nombre, correo electrónico y mensaje cuando utilizas el formulario de contacto.</li>
                <li><strong>Datos de registro:</strong> nombre y correo electrónico si creas una cuenta de usuario.</li>
                <li><strong>Datos de uso:</strong> información técnica anonimizada sobre la navegación en el sitio (páginas visitadas, tiempo de permanencia) mediante Google Analytics, solo si aceptas las cookies de análisis.</li>
                <li><strong>Datos de descarga:</strong> registro anónimo de documentos descargados para fines estadísticos del programa.</li>
              </ul>

              <h2>3. Finalidad del tratamiento</h2>
              <p>Los datos personales se utilizan exclusivamente para:</p>
              <ul>
                <li>Responder consultas enviadas a través del formulario de contacto.</li>
                <li>Gestionar el acceso a la plataforma para usuarios registrados.</li>
                <li>Generar estadísticas agregadas de uso del sitio para mejorar el programa.</li>
                <li>Cumplir con las obligaciones de rendición de cuentas ante CORFO.</li>
              </ul>

              <h2>4. Base legal</h2>
              <p>
                El tratamiento de datos personales se realiza conforme a la Ley N° 19.628 sobre Protección de la Vida Privada de Chile. La base legal para el tratamiento es el consentimiento del titular, que se manifiesta al enviar el formulario de contacto o al crear una cuenta de usuario.
              </p>

              <h2>5. Compartición de datos</h2>
              <p>
                No compartimos datos personales con terceros, salvo en los siguientes casos:
              </p>
              <ul>
                <li>Cuando sea requerido por ley o por una autoridad competente.</li>
                <li>Con proveedores de servicios tecnológicos que procesan datos en nuestro nombre (alojamiento web, correo electrónico), bajo acuerdos de confidencialidad.</li>
              </ul>

              <h2>6. Derechos del titular</h2>
              <p>
                Conforme a la Ley N° 19.628, tienes derecho a:
              </p>
              <ul>
                <li><strong>Acceder</strong> a tus datos personales.</li>
                <li><strong>Rectificar</strong> datos inexactos o incompletos.</li>
                <li><strong>Cancelar</strong> (eliminar) tus datos cuando ya no sean necesarios.</li>
                <li><strong>Oponerte</strong> al tratamiento de tus datos.</li>
              </ul>
              <p>
                Para ejercer estos derechos, escribe a <a href={`mailto:${email}`} className="text-h2v-green">{email}</a>.
              </p>

              <h2>7. Cookies</h2>
              <p>
                Este sitio utiliza cookies técnicas necesarias para su funcionamiento. Las cookies de análisis (Google Analytics) solo se activan si aceptas expresamente su uso a través del banner de cookies.
              </p>

              <h2>8. Seguridad</h2>
              <p>
                Implementamos medidas técnicas y organizativas para proteger los datos personales contra acceso no autorizado, pérdida o alteración, incluyendo cifrado HTTPS, control de acceso y políticas de seguridad de la información.
              </p>

              <h2>9. Contacto</h2>
              <p>
                Para consultas sobre esta política, escribe a <a href={`mailto:${email}`} className="text-h2v-green">{email}</a>.
              </p>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
