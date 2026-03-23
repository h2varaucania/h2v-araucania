'use client';

import Link from 'next/link';
import { useState } from 'react';
import { features } from '@/lib/features';

type NavItem = {
  label: string;
  href: string;
  children?: NavItem[];
};

function getNavItems(): NavItem[] {
  const programaChildren: NavItem[] = [
    { label: 'Quiénes Somos', href: '/programa/quienes-somos' },
    { label: 'Gobernanza', href: '/programa/gobernanza' },
  ];
  if (features.comunidad) programaChildren.push({ label: 'Comunidad', href: '/programa/comunidad' });
  if (features.transparencia) programaChildren.push({ label: 'Transparencia', href: '/programa/transparencia' });

  const h2vChildren: NavItem[] = [];
  if (features.hidrogenoVerde) h2vChildren.push({ label: '¿Qué es el H2V?', href: '/hidrogeno-verde' });
  if (features.sectores) h2vChildren.push({ label: 'Sectores Productivos', href: '/hidrogeno-verde/sectores' });
  if (features.capitalHumano) h2vChildren.push({ label: 'Capital Humano', href: '/hidrogeno-verde/capital-humano' });
  if (features.hojaDeRuta) h2vChildren.push({ label: 'Hoja de Ruta', href: '/hidrogeno-verde/hoja-de-ruta' });
  if (features.marcoRegulatorio) h2vChildren.push({ label: 'Marco Regulatorio', href: '/hidrogeno-verde/marco-regulatorio' });

  const recursosChildren: NavItem[] = [
    { label: 'Documentos', href: '/recursos/documentos' },
  ];
  if (features.eventos) recursosChildren.push({ label: 'Eventos', href: '/recursos/eventos' });
  if (features.mediateca) recursosChildren.push({ label: 'Mediateca', href: '/recursos/mediateca' });

  const items: NavItem[] = [
    { label: 'Inicio', href: '/' },
    { label: 'Programa', href: '/programa/quienes-somos', children: programaChildren },
  ];

  if (h2vChildren.length > 0) {
    items.push({ label: 'Hidrógeno Verde', href: '/hidrogeno-verde', children: h2vChildren });
  }

  items.push({ label: 'Proyectos', href: '/proyectos' });
  items.push({ label: 'Recursos', href: '/recursos/documentos', children: recursosChildren });
  items.push({ label: 'Noticias', href: '/noticias' });
  items.push({ label: 'Contacto', href: '/contacto' });

  return items;
}

function DropdownItem({ item }: { item: NavItem }) {
  const [open, setOpen] = useState(false);

  if (!item.children || item.children.length === 0) {
    return (
      <Link
        href={item.href}
        className="px-3 py-2 text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 rounded-md transition-colors"
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 rounded-md transition-colors"
        aria-expanded={open}
        aria-haspopup="true"
      >
        {item.label}
        <svg className="w-3.5 h-3.5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-1 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50">
          {item.children.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-[#0D7377]/5 hover:text-[#0D7377] transition-colors"
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navItems = getNavItems();

  return (
    <header className="bg-[#1B3A5C] sticky top-0 z-40 shadow-md" role="banner">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Navegación principal">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="H2V Araucanía - Inicio">
            <span className="text-xl font-bold text-white">H2V</span>
            <span className="text-xl font-bold text-[#4ECDC4]">Araucanía</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <DropdownItem key={item.href + item.label} item={item} />
            ))}
          </div>

          {/* Auth buttons - desktop */}
          <div className="hidden lg:flex items-center gap-2">
            <Link
              href="/login"
              className="px-4 py-1.5 text-sm text-white/80 hover:text-white transition-colors"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/registro"
              className="px-4 py-1.5 text-sm bg-[#0D7377] text-white rounded-full hover:bg-[#0D7377]/90 transition-colors"
            >
              Registrarse
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 text-white/80 hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {mobileOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-white/10 py-4 space-y-1">
            {navItems.map((item) => (
              <div key={item.href + item.label}>
                <Link
                  href={item.href}
                  className="block px-3 py-2 text-base font-medium text-white/90 hover:text-white hover:bg-white/10 rounded-md"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
                {item.children?.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    className="block pl-8 pr-3 py-1.5 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-md"
                    onClick={() => setMobileOpen(false)}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            ))}
            <div className="border-t border-white/10 pt-4 mt-4 flex flex-col gap-2 px-3">
              <Link href="/login" className="text-sm text-white/80 hover:text-white">Iniciar sesión</Link>
              <Link href="/registro" className="text-sm bg-[#0D7377] text-white rounded-full px-4 py-2 text-center hover:bg-[#0D7377]/90">Registrarse</Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
