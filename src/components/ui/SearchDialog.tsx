'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';

type SearchResult = {
  id: string;
  tipo: string;
  titulo: string;
  href: string;
  extracto: string;
};

type SearchResults = {
  noticias: SearchResult[];
  documentos: SearchResult[];
  proyectos: SearchResult[];
};

const tipoIcon: Record<string, string> = {
  noticia: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z',
  documento: 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z',
  proyecto: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7',
};

const tipoLabel: Record<string, string> = {
  noticia: 'Noticias',
  documento: 'Documentos',
  proyecto: 'Proyectos',
};

export default function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>(undefined);

  // Keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  const search = useCallback(async (q: string) => {
    if (q.length < 2) { setResults(null); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.results || null);
    } catch { setResults(null); }
    setLoading(false);
  }, []);

  function handleInput(value: string) {
    setQuery(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(value), 300);
  }

  const allResults = results
    ? [...(results.noticias || []), ...(results.documentos || []), ...(results.proyectos || [])]
    : [];

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-white/60 hover:text-white/90 transition-colors"
        aria-label="Buscar (Ctrl+K)"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span className="hidden lg:inline">Buscar...</span>
        <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-white/10 rounded">
          <span>⌘</span>K
        </kbd>
      </button>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setOpen(false)} />

      {/* Dialog */}
      <div className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-lg z-50 px-4" role="dialog" aria-label="Búsqueda">
        <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
          {/* Input */}
          <div className="flex items-center gap-3 px-4 border-b border-gray-100">
            <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => handleInput(e.target.value)}
              placeholder="Buscar noticias, documentos, proyectos..."
              className="flex-1 py-4 text-base outline-none placeholder:text-gray-400"
              aria-label="Buscar"
            />
            <button onClick={() => setOpen(false)} className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">ESC</button>
          </div>

          {/* Results */}
          <div className="max-h-80 overflow-y-auto">
            {loading && (
              <div className="py-8 text-center text-gray-400 text-sm">Buscando...</div>
            )}
            {!loading && query.length >= 2 && allResults.length === 0 && (
              <div className="py-8 text-center text-gray-400 text-sm">
                No se encontraron resultados para &quot;{query}&quot;
              </div>
            )}
            {!loading && allResults.length > 0 && (
              <div className="py-2">
                {(['noticia', 'documento', 'proyecto'] as const).map((tipo) => {
                  const items = allResults.filter((r) => r.tipo === tipo);
                  if (items.length === 0) return null;
                  return (
                    <div key={tipo}>
                      <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        {tipoLabel[tipo]}
                      </div>
                      {items.map((item) => (
                        <Link
                          key={item.id}
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                        >
                          <svg className="w-5 h-5 text-h2v-green mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={tipoIcon[tipo]} />
                          </svg>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{item.titulo}</p>
                            <p className="text-xs text-gray-400 truncate">{item.extracto}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}
            {!loading && query.length < 2 && (
              <div className="py-8 text-center text-gray-300 text-sm">
                Escribe al menos 2 caracteres para buscar
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
