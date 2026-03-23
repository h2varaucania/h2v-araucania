import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "../globals.css";

export default function FrontendLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
        <Footer />
      </body>
    </html>
  );
}
