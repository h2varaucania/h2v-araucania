'use client';

import { useState } from 'react';

type Documento = {
  id: string;
  titulo: string;
  descripcion: string;
  tipo: string;
  anio: number;
  descargas: number;
  archivo?: { url?: string };
};

const tipoLabel: Record<string, string> = {
  tecnico: 'Técnico',
  difusion: 'Difusión',
  regulatorio: 'Regulatorio',
  capacitacion: 'Capacitación',
};

const tipoColor: Record<string, string> = {
  tecnico: 'bg-blue-100 text-blue-700',
  difusion: 'bg-amber-100 text-amber-700',
  regulatorio: 'bg-purple-100 text-purple-700',
  capacitacion: 'bg-green-100 text-green-700',
};

export default function DocumentosClient({
  documentos,
  anios,
  tipos,
}: {
  documentos: Documento[];
  anios: number[];
  tipos: string[];
}) {
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [filtroAnio, setFiltroAnio] = useState<string>('todos');

  const filtered = documentos.filter((d) => {
    if (filtroTipo !== 'todos' && d.tipo !== filtroTipo) return false;
    if (filtroAnio !== 'todos' && d.anio !== Number(filtroAnio)) return false;
    return true;
  });

  async function handleDownload(doc: Documento) {
    // Track download
    try {
      await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId: doc.id }),
      });
    } catch {
      // Non-blocking
    }
    // Open file
    if (doc.archivo?.url) {
      window.open(doc.archivo.url, '_blank');
    }
  }

  return (
    <>
      {/* Filtros */}
      <section className="py-6 px-4 bg-gray-50 border-b border-gray-200">
        <div className="max-w-6xl mx-auto flex flex-wrap gap-3 items-center">
          <span className="text-sm font-medium text-gray-500">Tipo:</span>
          <button
            onClick={() => setFiltroTipo('todos')}
            className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${filtroTipo === 'todos' ? 'bg-h2v-green text-white border-h2v-green' : 'border-gray-200 bg-white text-gray-600 hover:border-h2v-green'}`}
          >
            Todos
          </button>
          {tipos.map((t) => (
            <button
              key={t}
              onClick={() => setFiltroTipo(t)}
              className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${filtroTipo === t ? 'bg-h2v-green text-white border-h2v-green' : 'border-gray-200 bg-white text-gray-600 hover:border-h2v-green'}`}
            >
              {tipoLabel[t] || t}
            </button>
          ))}
          {anios.length > 0 && (
            <>
              <span className="text-sm font-medium text-gray-500 ml-4">Año:</span>
              <button
                onClick={() => setFiltroAnio('todos')}
                className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${filtroAnio === 'todos' ? 'bg-h2v-green text-white border-h2v-green' : 'border-gray-200 bg-white text-gray-600 hover:border-h2v-green'}`}
              >
                Todos
              </button>
              {anios.map((a) => (
                <button
                  key={a}
                  onClick={() => setFiltroAnio(String(a))}
                  className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${filtroAnio === String(a) ? 'bg-h2v-green text-white border-h2v-green' : 'border-gray-200 bg-white text-gray-600 hover:border-h2v-green'}`}
                >
                  {a}
                </button>
              ))}
            </>
          )}
        </div>
      </section>

      {/* Documentos */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-400 text-lg">
                {documentos.length === 0
                  ? 'Los documentos se irán incorporando durante la ejecución del Bien Público.'
                  : 'No hay documentos que coincidan con los filtros seleccionados.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((doc) => (
                <div key={doc.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:border-h2v-green/20 transition-all group">
                  <div className="h-40 bg-gradient-to-br from-h2v-green/5 to-h2v-blue/10 flex items-center justify-center">
                    <svg className="w-12 h-12 text-h2v-green/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tipoColor[doc.tipo] || 'bg-gray-100 text-gray-600'}`}>
                        {tipoLabel[doc.tipo] || doc.tipo}
                      </span>
                      <span className="text-xs text-gray-400">{doc.anio}</span>
                      {doc.descargas > 0 && (
                        <span className="text-xs text-gray-400 ml-auto">{doc.descargas} descargas</span>
                      )}
                    </div>
                    <h3 className="font-semibold text-h2v-blue group-hover:text-h2v-green transition-colors mb-2">
                      {doc.titulo}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2">{doc.descripcion}</p>
                    <button
                      onClick={() => handleDownload(doc)}
                      className="mt-4 flex items-center gap-2 text-sm font-medium text-h2v-green hover:underline"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Descargar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
