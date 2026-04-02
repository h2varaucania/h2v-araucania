import type { Metadata } from 'next';
import RegisterForm from '@/components/forms/RegisterForm';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Registrarse',
  description: 'Crea tu cuenta para acceder a documentos y recursos del programa H2V Araucanía.',
};

export default function Registro() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-h2v-blue">Crear cuenta</h1>
          <p className="text-gray-500 mt-2">Regístrate para acceder a documentos y recursos del programa.</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <RegisterForm />
          <div className="mt-6 text-center text-sm text-gray-500">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="text-h2v-green font-medium hover:underline">
              Inicia sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
