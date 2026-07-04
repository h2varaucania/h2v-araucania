import type { Metadata } from 'next';
import { getPayload } from '@/lib/payload/getPayload';
import type { Documento } from '@/payload-types';
import DocumentosClient from './DocumentosClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Documentos y Recursos',
  description: 'Documentos técnicos y de difusión del programa de Hidrógeno Verde en La Araucanía.',
  openGraph: {
    title: 'Documentos y Recursos | H2V Araucanía',
    description: 'Documentos técnicos y de difusión del programa de Hidrógeno Verde en La Araucanía.',
  },
};

export default async function Documentos() {
  let docs: Documento[] = [];
  let anios: number[] = [];
  let tipos: Documento['tipo'][] = [];

  try {
    const payload = await getPayload();
    const result = await payload.find({
      collection: 'documentos',
      sort: '-anio',
      limit: 50,
    });
    docs = result.docs;

    // Extract unique years and types for filters
    anios = [...new Set(docs.map((d) => d.anio))].sort((a, b) => b - a);
    tipos = [...new Set(docs.map((d) => d.tipo))];
  } catch {
    // DB unavailable — render empty state
  }

  return (
    <div>
      <section className="bg-h2v-blue text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Recursos y Documentación</h1>
          <p className="text-lg opacity-80">
            Accede a documentos técnicos, estudios y material de difusión del programa.
          </p>
        </div>
      </section>

      <DocumentosClient
        documentos={JSON.parse(JSON.stringify(docs))}
        anios={anios}
        tipos={tipos}
      />
    </div>
  );
}
