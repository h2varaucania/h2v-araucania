import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getPayload } from "@/lib/payload/getPayload";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'H2V Araucanía — Hidrógeno Verde en La Araucanía',
  description: 'Plataforma informativa sobre los avances, proyectos y oportunidades del hidrógeno verde en la región de La Araucanía, Chile.',
  openGraph: {
    title: 'H2V Araucanía — Hidrógeno Verde en La Araucanía',
    description: 'Plataforma informativa sobre los avances, proyectos y oportunidades del hidrógeno verde en la región de La Araucanía, Chile.',
  },
};

const defaultCards = [
  { titulo: "Quienes Somos", descripcion: "Conoce el equipo, el Consejo Directivo y las instituciones que impulsan el hidrogeno verde en La Araucania.", enlace: "/programa/quienes-somos", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" },
  { titulo: "Gobernanza", descripcion: "Estructura de gobernanza del programa: niveles estrategico y operativo, actores y roles.", enlace: "/programa/gobernanza", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
  { titulo: "Mapa de Proyectos", descripcion: "Visualiza proyectos de hidrogeno verde en la region y a nivel nacional.", enlace: "/proyectos", icon: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" },
  { titulo: "Documentos", descripcion: "Accede a estudios, diagnosticos, documentos tecnicos y material de difusion del programa.", enlace: "/recursos/documentos", icon: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" },
  { titulo: "Noticias", descripcion: "Ultimas noticias, seminarios, talleres y avances del programa de hidrogeno verde.", enlace: "/noticias", icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" },
  { titulo: "Contacto", descripcion: "Escribenos para consultas, colaboraciones o mas informacion sobre el programa.", enlace: "/contacto", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
];

const defaultLogos = [
  { src: "/logos/BP H2V Araucanía - Logo Corfo Azul.png", alt: "CORFO" },
  { src: "/logos/BP H2V Araucanía - Logo Utalca.png", alt: "Universidad de Talca" },
  { src: "/logos/BP H2V Araucanía - Logo Seremi Energía Araucanía.png", alt: "Seremi de Energia Araucania" },
  { src: "/logos/BP H2V Araucanía - Logo CES4.0.png", alt: "CES 4.0" },
  { src: "/logos/BP H2V Araucanía - Corma_logo_color.png", alt: "CORMA" },
  { src: "/logos/BP H2V Araucanía - Logo Asoc Biomasa-Photoroom.png", alt: "Asociacion de Biomasa" },
  { src: "/logos/BP H2V Araucanía - Logo FIA-Photoroom.png", alt: "FIA" },
];

export default async function Home() {
  let hero = { titulo: 'Hidrogeno Verde en La Araucania', subtitulo: 'Plataforma informativa sobre los avances, proyectos y oportunidades del hidrogeno verde en la region de La Araucania, Chile.', ctaPrimario: 'Conozca el Programa', ctaSecundario: 'Ver Proyectos en el Mapa' };
  let cards = defaultCards;
  let seccionTitulo = 'Explora el Programa';
  let instituciones = defaultLogos;
  let latestNoticias: Array<{ id: string; titulo: string; slug: string; fecha: string; extracto: string; categoria?: string }> = [];

  try {
    const payload = await getPayload();
    const data = await payload.findGlobal({ slug: 'pagina-inicio' });
    const sitio = await payload.findGlobal({ slug: 'sitio-general' });
    if ((sitio?.instituciones as any[])?.length > 0) {
      instituciones = (sitio.instituciones as any[])
        .map((inst: any) => ({ src: inst.logo?.url || '', alt: inst.nombre as string }))
        .filter((i) => i.src);
    }
    if (data?.hero?.titulo) hero.titulo = data.hero.titulo;
    if (data?.hero?.subtitulo) hero.subtitulo = data.hero.subtitulo;
    if (data?.hero?.ctaPrimario) hero.ctaPrimario = data.hero.ctaPrimario;
    if (data?.hero?.ctaSecundario) hero.ctaSecundario = data.hero.ctaSecundario;
    if (data?.seccionExplora?.titulo) seccionTitulo = data.seccionExplora.titulo;
    if (data?.seccionExplora?.cards?.length > 0) {
      cards = data.seccionExplora.cards.map((c: Record<string, string>, i: number) => ({
        titulo: c.titulo,
        descripcion: c.descripcion,
        enlace: c.enlace,
        icon: defaultCards[i]?.icon || defaultCards[0].icon,
      }));
    }

    // Fetch latest 3 published noticias
    const { docs } = await payload.find({
      collection: 'noticias',
      where: { publicado: { equals: true } },
      sort: '-fecha',
      limit: 3,
    });
    latestNoticias = docs.map((n) => ({
      id: n.id as string,
      titulo: n.titulo as string,
      slug: n.slug as string,
      fecha: n.fecha as string,
      extracto: n.extracto as string,
      categoria: n.categoria as string | undefined,
    }));
  } catch {
    // Use defaults
  }

  const categoriasColor: Record<string, string> = {
    general: 'bg-blue-100 text-blue-700',
    gobernanza: 'bg-purple-100 text-purple-700',
    proyecto: 'bg-green-100 text-green-700',
    seminario: 'bg-amber-100 text-amber-700',
    taller: 'bg-cyan-100 text-cyan-700',
    acuerdo: 'bg-rose-100 text-rose-700',
  };

  return (
    <>
      <section className="relative py-20 md:py-32 px-4 bg-gradient-to-br from-h2v-green to-h2v-blue">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">{hero.titulo}</h1>
          <p className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl mx-auto">{hero.subtitulo}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/programa/quienes-somos" className="px-8 py-3 bg-white text-h2v-blue font-semibold rounded-full hover:bg-white/90 transition-colors">{hero.ctaPrimario}</Link>
            <Link href="/proyectos" className="px-8 py-3 border-2 border-white/60 text-white font-semibold rounded-full hover:bg-white/10 transition-colors">{hero.ctaSecundario}</Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-h2v-blue text-center mb-12">{seccionTitulo}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card) => (
              <Link key={card.enlace} href={card.enlace} className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-lg border border-gray-100 hover:border-h2v-green/30 transition-all duration-200">
                <div className="w-12 h-12 rounded-lg bg-h2v-green/10 flex items-center justify-center mb-4 group-hover:bg-h2v-green/20 transition-colors">
                  <svg className="w-6 h-6 text-h2v-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={card.icon} />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-h2v-blue mb-2 group-hover:text-h2v-green transition-colors">{card.titulo}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{card.descripcion}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Noticias */}
      {latestNoticias.length > 0 && (
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-h2v-blue">Ultimas Noticias</h2>
              <Link href="/noticias" className="text-sm font-medium text-h2v-green hover:underline">
                Ver todas
              </Link>
            </div>
            <div className="space-y-4">
              {latestNoticias.map((noticia) => (
                <article key={noticia.id} className="bg-gray-50 rounded-xl p-6 hover:shadow-md border border-gray-100 hover:border-h2v-green/20 transition-all">
                  <div className="flex items-center gap-3 mb-2">
                    <time className="text-sm text-gray-400" dateTime={noticia.fecha}>
                      {new Date(noticia.fecha).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </time>
                    {noticia.categoria && (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoriasColor[noticia.categoria] || 'bg-gray-100 text-gray-600'}`}>
                        {noticia.categoria}
                      </span>
                    )}
                  </div>
                  <Link href={`/noticias/${noticia.slug}`}>
                    <h3 className="text-lg font-semibold text-h2v-blue hover:text-h2v-green transition-colors mb-1">
                      {noticia.titulo}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-600">{noticia.extracto}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-12 px-4 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-sm text-gray-400 uppercase tracking-wider mb-8">Instituciones participantes</p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {instituciones.map((logo) => (
              <Image key={logo.alt} src={logo.src} alt={logo.alt} width={100} height={50} className="h-10 md:h-12 w-auto grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300" />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
