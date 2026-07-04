import type { Metadata } from 'next';
import { getPayload } from '@/lib/payload/getPayload';
import { tieneContenido } from '@/lib/richtext';
import { RichText } from '@payloadcms/richtext-lexical/react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Accesibilidad',
  description: 'Declaración de accesibilidad del sitio web H2V Araucanía.',
};

export default async function Accesibilidad() {
  // Defaults de respaldo; el CMS (global "Accesibilidad") los sobreescribe.
  const hero = {
    titulo: 'Accesibilidad',
    subtitulo: 'Nuestro compromiso con un sitio web accesible para todas las personas.',
  };
  let contenidoCMS: unknown = null;
  // El email se toma SIEMPRE de Configuración → Contacto (una sola fuente).
  let email = 'h2varaucania@gmail.com';

  try {
    const payload = await getPayload();
    const data = await payload.findGlobal({ slug: 'pagina-accesibilidad' });
    if (data?.hero?.titulo) hero.titulo = data.hero.titulo;
    if (data?.hero?.subtitulo) hero.subtitulo = data.hero.subtitulo;
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
          {contenidoCMS ? (
            <RichText data={contenidoCMS as never} />
          ) : (
            <>
              <h2>Compromiso</h2>
              <p>
                El programa H2V Araucanía se compromete a garantizar la accesibilidad de este sitio web para todas las personas, incluyendo personas con discapacidad. Trabajamos para cumplir con las Pautas de Accesibilidad para el Contenido Web (WCAG) 2.1 nivel AA.
              </p>

              <h2>Medidas implementadas</h2>
              <ul>
                <li><strong>Navegación por teclado:</strong> Todas las funciones del sitio son accesibles mediante teclado. Se incluye un enlace para saltar al contenido principal.</li>
                <li><strong>Textos alternativos:</strong> Las imágenes incluyen descripciones alternativas (atributo alt).</li>
                <li><strong>Estructura semántica:</strong> Se utilizan encabezados jerárquicos (h1-h6) y elementos HTML semánticos para facilitar la navegación con lectores de pantalla.</li>
                <li><strong>Contraste de colores:</strong> Los colores del sitio cumplen con las ratios mínimas de contraste WCAG AA.</li>
                <li><strong>Diseño responsivo:</strong> El sitio se adapta a diferentes tamaños de pantalla y niveles de zoom.</li>
                <li><strong>Idioma:</strong> El atributo <code>lang=&quot;es&quot;</code> está configurado para que los lectores de pantalla identifiquen correctamente el idioma.</li>
                <li><strong>Formularios accesibles:</strong> Los campos de formulario incluyen etiquetas descriptivas y mensajes de error claros.</li>
                <li><strong>Atributos ARIA:</strong> Se utilizan roles y propiedades ARIA donde es necesario para mejorar la experiencia con tecnología asistiva.</li>
              </ul>

              <h2>Limitaciones conocidas</h2>
              <p>
                Algunas funciones pueden tener limitaciones de accesibilidad:
              </p>
              <ul>
                <li>El mapa interactivo de proyectos (basado en Leaflet) puede no ser completamente accesible para usuarios de lectores de pantalla. La lista de proyectos debajo del mapa proporciona la misma información en formato accesible.</li>
                <li>Documentos PDF descargables pueden no cumplir completamente con estándares de accesibilidad.</li>
              </ul>

              <h2>Retroalimentación</h2>
              <p>
                Si encuentras barreras de accesibilidad en este sitio, por favor escríbenos a{' '}
                <a href={`mailto:${email}`} className="text-h2v-green">{email}</a>.
                Nos comprometemos a responder dentro de 5 días hábiles y a trabajar en las mejoras necesarias.
              </p>

              <h2>Estándares</h2>
              <p>
                Este sitio busca cumplir con:
              </p>
              <ul>
                <li>WCAG 2.1 nivel AA</li>
                <li>Ley N° 20.422 sobre Igualdad de Oportunidades e Inclusión Social de Personas con Discapacidad (Chile)</li>
                <li>Decreto N° 1 de 2015 del Ministerio Secretaría General de la Presidencia, que aprueba norma técnica sobre accesibilidad web</li>
              </ul>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
