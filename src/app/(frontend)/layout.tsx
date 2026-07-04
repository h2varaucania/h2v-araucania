import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Analytics from "@/components/Analytics";
import CookieBanner from "@/components/CookieBanner";
import { getPayload } from "@/lib/payload/getPayload";
import { Public_Sans, Spectral, IBM_Plex_Mono } from "next/font/google";
import "../globals.css";

// Tríada del sistema de diseño H2V. next/font las auto-hospeda en el build (sin
// request externo en runtime → compatible con el CSP), con font-display: swap.
const publicSans = Public_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-public-sans", display: "swap" });
const spectral = Spectral({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-spectral", display: "swap" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-plex-mono", display: "swap" });

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
    // Pre-lanzamiento: el sitio NO se indexa en buscadores mientras se puebla el contenido.
    // Para permitir indexación en el lanzamiento: setear SITE_INDEXABLE=true en Vercel y redeployar.
    ...(process.env.SITE_INDEXABLE === 'true'
      ? {}
      : { robots: { index: false, follow: false, googleBot: { index: false, follow: false } } }),
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
  let footerEmail = 'h2varaucania@gmail.com';
  let footerUbicacion = 'Temuco, La Araucanía, Chile';
  let tituloNavegacion = 'Navegación';
  let tituloContacto = 'Contacto';
  let tituloApoyo = 'Proyecto apoyado por';
  let derechos = 'Todos los derechos reservados.';

  try {
    const payload = await getPayload();
    const sitio = await payload.findGlobal({ slug: 'sitio-general' });
    if (sitio?.footerTexto) footerTexto = sitio.footerTexto as string;
    if (sitio?.footerPrograma) footerPrograma = sitio.footerPrograma as string;
    if (sitio?.tituloNavegacion) tituloNavegacion = sitio.tituloNavegacion as string;
    if (sitio?.tituloContactoFooter) tituloContacto = sitio.tituloContactoFooter as string;
    if (sitio?.tituloApoyoFooter) tituloApoyo = sitio.tituloApoyoFooter as string;
    if (sitio?.derechos) derechos = sitio.derechos as string;
    const contacto = await payload.findGlobal({ slug: 'contacto' });
    if (contacto?.email) footerEmail = contacto.email as string;
    if (contacto?.ubicacion) footerUbicacion = contacto.ubicacion as string;
  } catch {
    // Use defaults
  }

  return (
    <html lang="es" className={`h-full scroll-smooth ${publicSans.variable} ${spectral.variable} ${plexMono.variable}`}>
      <body className="min-h-full flex flex-col antialiased">
        <Analytics />
        <a href="#main-content" className="skip-link">
          Saltar al contenido principal
        </a>
        <Header />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer texto={footerTexto} programa={footerPrograma} email={footerEmail} ubicacion={footerUbicacion} tituloNavegacion={tituloNavegacion} tituloContacto={tituloContacto} tituloApoyo={tituloApoyo} derechos={derechos} />
        <CookieBanner />
      </body>
    </html>
  );
}
