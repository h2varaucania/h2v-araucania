import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section
        className="relative py-20 md:py-32 px-4"
        style={{ background: "linear-gradient(135deg, #0D7377 0%, #1B3A5C 100%)" }}
      >
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            Hidrógeno Verde en<br />La Araucanía
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Plataforma informativa sobre los avances, proyectos y oportunidades
            del hidrógeno verde en la región de La Araucanía, Chile.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/programa/quienes-somos"
              className="px-8 py-3 bg-white text-[#1B3A5C] font-semibold rounded-full hover:bg-white/90 transition-colors"
            >
              Conozca el Programa
            </Link>
            <Link
              href="/proyectos"
              className="px-8 py-3 border-2 border-white/60 text-white font-semibold rounded-full hover:bg-white/10 transition-colors"
            >
              Ver Proyectos en el Mapa
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Access Cards */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1B3A5C] text-center mb-12">
            Explora el Programa
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Quiénes Somos",
                desc: "Conoce el equipo, el Consejo Directivo y las instituciones que impulsan el hidrógeno verde en La Araucanía.",
                href: "/programa/quienes-somos",
                icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
              },
              {
                title: "Gobernanza",
                desc: "Estructura de gobernanza del programa: niveles estratégico y operativo, actores y roles.",
                href: "/programa/gobernanza",
                icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
              },
              {
                title: "Mapa de Proyectos",
                desc: "Visualiza proyectos de hidrógeno verde en la región y a nivel nacional.",
                href: "/proyectos",
                icon: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7",
              },
              {
                title: "Documentos",
                desc: "Accede a estudios, diagnósticos, documentos técnicos y material de difusión del programa.",
                href: "/recursos/documentos",
                icon: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z",
              },
              {
                title: "Noticias",
                desc: "Últimas noticias, seminarios, talleres y avances del programa de hidrógeno verde.",
                href: "/noticias",
                icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z",
              },
              {
                title: "Contacto",
                desc: "Escríbenos para consultas, colaboraciones o más información sobre el programa.",
                href: "/contacto",
                icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
              },
            ].map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-lg border border-gray-100 hover:border-[#0D7377]/30 transition-all duration-200"
              >
                <div className="w-12 h-12 rounded-lg bg-[#0D7377]/10 flex items-center justify-center mb-4 group-hover:bg-[#0D7377]/20 transition-colors">
                  <svg className="w-6 h-6 text-[#0D7377]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={card.icon} />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-[#1B3A5C] mb-2 group-hover:text-[#0D7377] transition-colors">
                  {card.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {card.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Institutional logos bar */}
      <section className="py-12 px-4 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-sm text-gray-400 uppercase tracking-wider mb-8">
            Instituciones participantes
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {[
              { src: "/logos/BP H2V Araucanía - Logo Corfo Azul.png", alt: "CORFO" },
              { src: "/logos/BP H2V Araucanía - Logo Utalca.png", alt: "Universidad de Talca" },
              { src: "/logos/BP H2V Araucanía - Logo Seremi Energía Araucanía.png", alt: "Seremi de Energía Araucanía" },
              { src: "/logos/BP H2V Araucanía - Logo CES4.0.png", alt: "CES 4.0" },
              { src: "/logos/BP H2V Araucanía - Corma_logo_color.png", alt: "CORMA" },
              { src: "/logos/BP H2V Araucanía - Logo Asoc Biomasa-Photoroom.png", alt: "Asociación de Biomasa" },
              { src: "/logos/BP H2V Araucanía - Logo FIA-Photoroom.png", alt: "FIA" },
            ].map((logo) => (
              <Image
                key={logo.alt}
                src={logo.src}
                alt={logo.alt}
                width={100}
                height={50}
                className="h-10 md:h-12 w-auto grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
