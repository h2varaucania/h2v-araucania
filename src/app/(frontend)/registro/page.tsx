import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Crear cuenta',
  description: 'Los documentos del programa H2V Araucanía se descargan sin necesidad de una cuenta.',
};

// El sitio no ofrece registro público: los documentos se descargan sin cuenta y las
// cuentas del panel las crea un Administrador (Users.create = isAdmin).
export default function Registro() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-h2v-blue">No necesitas una cuenta</h1>
          <p className="text-gray-500 mt-2">
            Todos los documentos del programa se descargan libremente, sin registrarse.
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <Link
            href="/recursos/documentos"
            className="inline-block bg-h2v-green text-white font-medium px-6 py-3 rounded-lg hover:opacity-90"
          >
            Ir a Documentos
          </Link>
          <div className="mt-6 text-sm text-gray-500">
            ¿Eres parte del equipo del programa?{' '}
            <Link href="/login" className="text-h2v-green font-medium hover:underline">
              Inicia sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
