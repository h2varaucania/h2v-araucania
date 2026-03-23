'use client';

import { useState } from 'react';

export default function ContactForm() {
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
        <h3 className="text-lg font-semibold text-green-800 mb-2">Mensaje enviado</h3>
        <p className="text-green-600 text-sm">Gracias por contactarnos. Responderemos a la brevedad.</p>
        <button onClick={() => setStatus('idle')} className="mt-4 text-sm text-green-700 underline">Enviar otro mensaje</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
        <input type="text" id="nombre" name="nombre" required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D7377] focus:border-transparent outline-none" placeholder="Tu nombre" />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
        <input type="email" id="email" name="email" required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D7377] focus:border-transparent outline-none" placeholder="tu@email.com" />
      </div>
      <div>
        <label htmlFor="asunto" className="block text-sm font-medium text-gray-700 mb-1">Asunto</label>
        <select id="asunto" name="asunto" required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D7377] focus:border-transparent outline-none">
          <option value="">Selecciona un asunto</option>
          <option value="consulta">Consulta general</option>
          <option value="colaboracion">Propuesta de colaboración</option>
          <option value="prensa">Prensa y comunicaciones</option>
          <option value="otro">Otro</option>
        </select>
      </div>
      <div>
        <label htmlFor="mensaje" className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
        <textarea id="mensaje" name="mensaje" rows={5} required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D7377] focus:border-transparent outline-none resize-none" placeholder="Escribe tu mensaje aquí..." />
      </div>
      {status === 'error' && (
        <p className="text-red-600 text-sm">Error al enviar. Por favor intenta nuevamente.</p>
      )}
      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full px-6 py-3 bg-[#0D7377] text-white font-semibold rounded-lg hover:bg-[#0D7377]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === 'sending' ? 'Enviando...' : 'Enviar mensaje'}
      </button>
    </form>
  );
}
