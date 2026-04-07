import Link from 'next/link';
import Image from 'next/image';

type FooterProps = {
  texto?: string;
  programa?: string;
};

export default function Footer({ texto, programa }: FooterProps) {
  return (
    <footer className="bg-h2v-blue text-white" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl font-bold">H2V</span>
              <span className="text-xl font-bold text-h2v-green-light">Araucanía</span>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">
              {texto || 'Plataforma informativa del Bien Público 24BP-269085. Programa Estratégico Regional de Hidrógeno Verde en La Araucanía.'}
            </p>
          </div>

          {/* Column 2: Quick links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-white/90">
              Navegación
            </h3>
            <ul className="space-y-2">
              {[
                { label: 'Quiénes Somos', href: '/programa/quienes-somos' },
                { label: 'Gobernanza', href: '/programa/gobernanza' },
                { label: 'Noticias', href: '/noticias' },
                { label: 'Proyectos', href: '/proyectos' },
                { label: 'Documentos', href: '/recursos/documentos' },
                { label: 'Contacto', href: '/contacto' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/60 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact + Logos */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-white/90">
              Contacto
            </h3>
            <p className="text-sm text-white/60 mb-1">h2varaucania@gmail.com</p>
            <p className="text-sm text-white/60 mb-6">Temuco, La Araucanía, Chile</p>

            <h3 className="text-sm font-semibold uppercase tracking-wider mb-3 text-white/90">
              Proyecto apoyado por
            </h3>
            <div className="flex items-center gap-4 flex-wrap">
              <Image
                src="/logos/BP H2V Araucanía - Logo Corfo Azul.png"
                alt="CORFO"
                width={80}
                height={40}
                className="h-8 w-auto brightness-0 invert opacity-70"
              />
              <Image
                src="/logos/BP H2V Araucanía - DPS Corfo Blanco.png"
                alt="Desarrollo Productivo Sostenible"
                width={80}
                height={40}
                className="h-8 w-auto opacity-70"
              />
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} H2V Araucanía. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/politica-privacidad" className="text-xs text-white/40 hover:text-white/70 transition-colors">
              Privacidad
            </Link>
            <Link href="/accesibilidad" className="text-xs text-white/40 hover:text-white/70 transition-colors">
              Accesibilidad
            </Link>
            <span className="text-xs text-white/40">
              {programa || 'Programa Desarrollo Productivo Sostenible — CORFO'}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
