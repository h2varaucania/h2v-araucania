import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Analytics from "@/components/Analytics";
import CookieBanner from "@/components/CookieBanner";
import { getPayload } from "@/lib/payload/getPayload";
import "../globals.css";

export const dynamic = 'force-dynamic';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://h2varaucania.cl';

export async function generateMetadata(): Promise<Metadata> {
  let description = 'Plataforma informativa sobre los avances, proyectos y oportunidades del hidrógeno verde en la región de La Araucanía, Chile.';
  let siteName = 'H2V Araucanía';

  try {
    const payload = await getPayload();
    const sitio = await payload.findGlobal({ slug: 'sitio-general' });
    if (sitio?.descripcionSEO) description = sitio.descripcionSEO as string;
    if (sitio?.nombreSitio) siteName = sitio.nombreSitio as string;
  } catch {
    // Use default description
  }

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${siteName} — Hidrógeno Verde en La Araucanía`,
      template: `%s | ${siteName}`,
    },
    description,
    openGraph: {
      type: 'website',
      locale: 'es_CL',
      siteName,
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
  let footerInstituciones: { nombre: string; logo: string }[] = [];
  let footerEmail = 'h2varaucania@gmail.com';
  let footerUbicacion = 'Temuco, La Araucanía, Chile';

  try {
    const payload = await getPayload();
    const sitio = await payload.findGlobal({ slug: 'sitio-general' });
    if (sitio?.footerTexto) footerTexto = sitio.footerTexto as string;
    if (sitio?.footerPrograma) footerPrograma = sitio.footerPrograma as string;
    if ((sitio?.instituciones as any[])?.length > 0) {
      footerInstituciones = (sitio.instituciones as any[])
        .map((inst: any) => ({
          nombre: inst.nombre,
          logo: inst.logo?.url || '',
        }))
        .filter((i) => i.logo);
    }
    const contacto = await payload.findGlobal({ slug: 'contacto' });
    if (contacto?.email) footerEmail = contacto.email as string;
    if (contacto?.ubicacion) footerUbicacion = contacto.ubicacion as string;
  } catch {
    // Use defaults
  }

  return (
    <html lang="es" className="h-full scroll-smooth">
      <body className="min-h-full flex flex-col antialiased">
        <Analytics />
        <a href="#main-content" className="skip-link">
          Saltar al contenido principal
        </a>
        <Header />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer texto={footerTexto} programa={footerPrograma} instituciones={footerInstituciones} email={footerEmail} ubicacion={footerUbicacion} />
        <CookieBanner />
      </body>
    </html>
  );
}
