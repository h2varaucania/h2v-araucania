import type { Metadata } from 'next';
import LoginForm from '@/components/forms/LoginForm';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Iniciar sesión',
  description: 'Accede a tu cuenta para descargar documentos y participar en el programa.',
};

export default function Login() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-h2v-blue">Iniciar sesión</h1>
          <p className="text-gray-500 mt-2">Accede para descargar documentos y participar en el programa.</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <LoginForm />
          <div className="mt-6 text-center text-sm text-gray-500">
            ¿No tienes cuenta?{' '}
            <Link href="/registro" className="text-h2v-green font-medium hover:underline">
              Regístrate aquí
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
