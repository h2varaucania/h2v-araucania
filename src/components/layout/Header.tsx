'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import SearchDialog from '@/components/ui/SearchDialog';
import { features } from '@/lib/features';

type NavItem = {
  label: string;
  href: string;
  featureFlag?: keyof typeof features;
  children?: NavItem[];
};

const allNavItems: NavItem[] = [
  { label: 'Inicio', href: '/' },
  {
    label: 'Programa', href: '/programa/quienes-somos',
    children: [
      { label: 'Quienes Somos', href: '/programa/quienes-somos' },
      { label: 'Gobernanza', href: '/programa/gobernanza' },
      { label: 'Comunidad', href: '/programa/comunidad', featureFlag: 'comunidad' },
      { label: 'Transparencia', href: '/programa/transparencia', featureFlag: 'transparencia' },
    ],
  },
  {
    label: 'Hidrogeno Verde', href: '/hidrogeno-verde', featureFlag: 'hidrogenoVerde',
    children: [
      { label: 'Que es el H2V?', href: '/hidrogeno-verde' },
      { label: 'Sectores Productivos', href: '/hidrogeno-verde/sectores', featureFlag: 'sectores' },
      { label: 'Capital Humano', href: '/hidrogeno-verde/capital-humano', featureFlag: 'capitalHumano' },
      { label: 'Hoja de Ruta', href: '/hidrogeno-verde/hoja-de-ruta', featureFlag: 'hojaDeRuta' },
      { label: 'Marco Regulatorio', href: '/hidrogeno-verde/marco-regulatorio', featureFlag: 'marcoRegulatorio' },
    ],
  },
  { label: 'Proyectos', href: '/proyectos' },
  {
    label: 'Recursos', href: '/recursos/documentos',
    children: [
      { label: 'Documentos', href: '/recursos/documentos' },
      { label: 'Eventos', href: '/recursos/eventos', featureFlag: 'eventos' },
      { label: 'Mediateca', href: '/recursos/mediateca', featureFlag: 'mediateca' },
    ],
  },
  { label: 'Noticias', href: '/noticias' },
  { label: 'Contacto', href: '/contacto' },
];

function filterNavByFeatures(items: NavItem[]): NavItem[] {
  return items
    .filter((item) => !item.featureFlag || features[item.featureFlag])
    .map((item) => ({
      ...item,
      children: item.children ? filterNavByFeatures(item.children) : undefined,
    }))
    .filter((item) => !item.children || item.children.length > 0);
}

function DropdownItem({ item }: { item: NavItem }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setOpen((prev) => !prev);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  }, []);

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  if (!item.children || item.children.length === 0) {
    return (
      <div className="relative">
        <Link
          href={item.href}
          className="px-3 py-2 text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 rounded-md transition-colors"
        >
          {item.label}
        </Link>
      </div>
    );
  }

  return (
    <div
      ref={dropdownRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 rounded-md transition-colors"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
      >
        {item.label}
        <svg className="w-3.5 h-3.5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-1 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50" role="menu">
          {item.children.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              role="menuitem"
              className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-h2v-green/5 hover:text-h2v-green transition-colors"
              onClick={() => setOpen(false)}
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
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const navItems = useMemo(() => filterNavByFeatures(allNavItems), []);

  // Close mobile menu on Escape
  useEffect(() => {
    if (!mobileOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [mobileOpen]);

  // Focus trap for mobile menu
  useEffect(() => {
    if (!mobileOpen || !mobileMenuRef.current) return;
    const menu = mobileMenuRef.current;
    const focusable = menu.querySelectorAll<HTMLElement>('a, button, input, [tabindex]:not([tabindex="-1"])');
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    const trap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };

    menu.addEventListener('keydown', trap);
    first.focus();
    return () => menu.removeEventListener('keydown', trap);
  }, [mobileOpen]);

  return (
    <header className="bg-h2v-blue sticky top-0 z-40 shadow-md" role="banner">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Navegacion principal">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0" aria-label="H2V Araucania - Inicio">
            <span className="inline-flex items-center rounded-md bg-white px-2 py-1 shadow-sm">
              <Image
                src="/logos/BP H2V Araucanía - Logo Bien Público.png"
                alt="H2V Araucania - Bien Publico Agro Productivo Araucania"
                width={710}
                height={555}
                priority
                className="h-10 w-auto md:h-11"
              />
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <DropdownItem key={item.href + item.label} item={item} />
            ))}
          </div>

          {/* Search - desktop */}
          <div className="hidden lg:flex items-center gap-2">
            <SearchDialog />
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 text-white/80 hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Cerrar menu' : 'Abrir menu'}
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
          <div ref={mobileMenuRef} className="lg:hidden border-t border-white/10 py-4 space-y-1" role="menu">
            {navItems.map((item) => (
              <div key={item.href + item.label}>
                <Link
                  href={item.href}
                  role="menuitem"
                  className="block px-3 py-2 text-base font-medium text-white/90 hover:text-white hover:bg-white/10 rounded-md"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
                {item.children?.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    role="menuitem"
                    className="block pl-8 pr-3 py-1.5 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-md"
                    onClick={() => setMobileOpen(false)}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}
