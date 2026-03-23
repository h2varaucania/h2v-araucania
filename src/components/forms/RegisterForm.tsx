'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    const form = e.currentTarget;
    const nombre = (form.elements.namedItem('nombre') as HTMLInputElement).value;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;
    const confirmPassword = (form.elements.namedItem('confirmPassword') as HTMLInputElement).value;
    const institucion = (form.elements.namedItem('institucion') as HTMLInputElement).value;

    if (password !== confirmPassword) {
      setErrorMsg('Las contraseñas no coinciden');
      setStatus('error');
      return;
    }

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          email,
          password,
          institucion: institucion || undefined,
          role: 'registrado',
        }),
      });

      if (res.ok || res.status === 201) {
        // Auto-login after registration
        const loginRes = await fetch('/api/users/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
          credentials: 'include',
        });

        if (loginRes.ok) {
          router.push('/');
          router.refresh();
        } else {
          setStatus('success');
        }
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data?.errors?.[0]?.message || 'Error al crear la cuenta');
        setStatus('error');
      }
    } catch {
      setErrorMsg('Error de conexión');
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-4">
        <svg className="w-12 h-12 mx-auto mb-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-green-700 font-medium">Cuenta creada exitosamente</p>
        <p className="text-sm text-gray-500 mt-2">Ya puedes iniciar sesión.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">Nombre completo *</label>
        <input type="text" id="nombre" name="nombre" required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D7377] focus:border-transparent outline-none" placeholder="Tu nombre" />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico *</label>
        <input type="email" id="email" name="email" required autoComplete="email" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D7377] focus:border-transparent outline-none" placeholder="tu@email.com" />
      </div>
      <div>
        <label htmlFor="institucion" className="block text-sm font-medium text-gray-700 mb-1">Institución (opcional)</label>
        <input type="text" id="institucion" name="institucion" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D7377] focus:border-transparent outline-none" placeholder="Universidad, empresa, organización..." />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Contraseña *</label>
        <input type="password" id="password" name="password" required minLength={6} autoComplete="new-password" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D7377] focus:border-transparent outline-none" placeholder="Mínimo 6 caracteres" />
      </div>
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirmar contraseña *</label>
        <input type="password" id="confirmPassword" name="confirmPassword" required minLength={6} autoComplete="new-password" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D7377] focus:border-transparent outline-none" placeholder="Repite tu contraseña" />
      </div>
      {status === 'error' && (
        <p className="text-red-600 text-sm" role="alert">{errorMsg}</p>
      )}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full px-6 py-3 bg-[#0D7377] text-white font-semibold rounded-lg hover:bg-[#0D7377]/90 transition-colors disabled:opacity-50"
      >
        {status === 'loading' ? 'Creando cuenta...' : 'Crear cuenta'}
      </button>
      <p className="text-xs text-gray-400 text-center">
        Al registrarte aceptas el uso de tus datos conforme a la política de privacidad del programa.
      </p>
    </form>
  );
}
