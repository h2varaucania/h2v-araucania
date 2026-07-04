'use client';

import { useState } from 'react';
import { contactoDefaults as d } from '@/content/defaults/contacto';

// Textos 100% editables desde el panel (EDITABILIDAD_TOTAL): la página los lee
// del global Contacto y los pasa como props; los defaults cubren cualquier hueco.
export type ContactFormTextos = {
  etiquetaNombre: string;
  placeholderNombre: string;
  etiquetaEmail: string;
  placeholderEmail: string;
  etiquetaAsunto: string;
  opcionPorDefecto: string;
  opcionesAsunto: { etiqueta: string; valor: string }[];
  etiquetaMensaje: string;
  placeholderMensaje: string;
  textoBoton: string;
  textoEnviando: string;
  tituloExito: string;
  textoExito: string;
  textoOtroMensaje: string;
  textoError: string;
};

const textosPorDefecto: ContactFormTextos = {
  etiquetaNombre: d.formEtiquetaNombre,
  placeholderNombre: d.formPlaceholderNombre,
  etiquetaEmail: d.formEtiquetaEmail,
  placeholderEmail: d.formPlaceholderEmail,
  etiquetaAsunto: d.formEtiquetaAsunto,
  opcionPorDefecto: d.formOpcionPorDefecto,
  opcionesAsunto: d.formOpcionesAsunto.map((o) => ({ ...o })),
  etiquetaMensaje: d.formEtiquetaMensaje,
  placeholderMensaje: d.formPlaceholderMensaje,
  textoBoton: d.formTextoBoton,
  textoEnviando: d.formTextoEnviando,
  tituloExito: d.formTituloExito,
  textoExito: d.formTextoExito,
  textoOtroMensaje: d.formTextoOtroMensaje,
  textoError: d.formTextoError,
};

export default function ContactForm({ textos = textosPorDefecto }: { textos?: ContactFormTextos }) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');

    const form = e.currentTarget;
    const data = {
      nombre: (form.elements.namedItem('nombre') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      asunto: (form.elements.namedItem('asunto') as HTMLSelectElement).value,
      mensaje: (form.elements.namedItem('mensaje') as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatus('success');
        form.reset();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
        <svg className="w-12 h-12 mx-auto mb-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-lg font-semibold text-green-800 mb-2">{textos.tituloExito}</h3>
        <p className="text-green-600 text-sm">{textos.textoExito}</p>
        <button onClick={() => setStatus('idle')} className="mt-4 text-sm text-green-700 underline">{textos.textoOtroMensaje}</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">{textos.etiquetaNombre}</label>
        <input type="text" id="nombre" name="nombre" required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-h2v-green focus:border-transparent outline-none" placeholder={textos.placeholderNombre} />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">{textos.etiquetaEmail}</label>
        <input type="email" id="email" name="email" required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-h2v-green focus:border-transparent outline-none" placeholder={textos.placeholderEmail} />
      </div>
      <div>
        <label htmlFor="asunto" className="block text-sm font-medium text-gray-700 mb-1">{textos.etiquetaAsunto}</label>
        <select id="asunto" name="asunto" required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-h2v-green focus:border-transparent outline-none">
          <option value="">{textos.opcionPorDefecto}</option>
          {textos.opcionesAsunto.map((o) => (
            <option key={o.valor} value={o.valor}>{o.etiqueta}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="mensaje" className="block text-sm font-medium text-gray-700 mb-1">{textos.etiquetaMensaje}</label>
        <textarea id="mensaje" name="mensaje" rows={5} required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-h2v-green focus:border-transparent outline-none resize-none" placeholder={textos.placeholderMensaje} />
      </div>
      {status === 'error' && (
        <p className="text-red-600 text-sm">{textos.textoError}</p>
      )}
      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full px-6 py-3 bg-h2v-green text-white font-semibold rounded-lg hover:bg-h2v-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === 'sending' ? textos.textoEnviando : textos.textoBoton}
      </button>
    </form>
  );
}
