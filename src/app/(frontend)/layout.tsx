import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getPayload } from "@/lib/payload/getPayload";
import "../globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://h2varaucania.cl';

export async function generateMetadata(): Promise<Metadata> {
  let description = 'Plataforma informativa sobre los avances, proyectos y oportunidades del hidrógeno verde en la región de La Araucanía, Chile.';

  try {
    const payload = await getPayload();
    const sitio = await payload.findGlobal({ slug: 'sitio-general' });
    if (sitio?.descripcion) description = sitio.descripcion as string;
  } catch {
    // Use default description
  }

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: 'H2V Araucanía — Hidrógeno Verde en La Araucanía',
      template: '%s | H2V Araucanía',
    },
    description,
    openGraph: {
      type: 'website',
      locale: 'es_CL',
      siteName: 'H2V Araucanía',
    },
    twitter: {
      card: 'summary_large_image',
    },
    manifest: '/manifest.json',
  };
}

export default async function FrontendLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let footerTexto = 'Plataforma informativa del Bien Público 24BP-269085. Programa Estratégico Regional de Hidrógeno Verde en La Araucanía.';
  let footerPrograma = 'Programa Desarrollo Productivo Sostenible — CORFO';

  try {
    const payload = await getPayload();
    const sitio = await payload.findGlobal({ slug: 'sitio-general' });
    if (sitio?.footerTexto) footerTexto = sitio.footerTexto as string;
    if (sitio?.footerPrograma) footerPrograma = sitio.footerPrograma as string;
  } catch {
    // Use defaults
  }

  return (
    <html lang="es" className="h-full scroll-smooth">
      <body className="min-h-full flex flex-col antialiased">
        <a href="#main-content" className="skip-link">
          Saltar al contenido principal
        </a>
        <Header />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer texto={footerTexto} programa={footerPrograma} />
      </body>
    </html>
  );
}
