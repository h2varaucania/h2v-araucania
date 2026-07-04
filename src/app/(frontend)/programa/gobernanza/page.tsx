import type { Metadata } from 'next';
import Image from 'next/image';
import { getPayload } from '@/lib/payload/getPayload';
import type { Miembro } from '@/payload-types';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Gobernanza',
  description: 'Modelo de gobernanza del Programa de Hidrógeno Verde en La Araucanía: niveles estratégico y operativo.',
  openGraph: {
    title: 'Gobernanza | H2V Araucanía',
    description: 'Modelo de gobernanza del Programa de Hidrógeno Verde en La Araucanía: niveles estratégico y operativo.',
  },
};

const defaultFuncionesEstrategico = [
  'Definir y ajustar la visión y los objetivos estratégicos del proyecto',
  'Aprobar el plan de desarrollo del hidrógeno verde en la región',
  'Establecer políticas y directrices para la sostenibilidad del proyecto',
  'Supervisar el progreso del proyecto y evaluar su impacto',
  'Garantizar la participación de todas las partes interesadas',
  'Gestionar la transparencia y la rendición de cuentas',
  'Monitorear oportunidades de financiamiento público y/o privado',
  'Mediar en caso de discrepancias entre los actores',
];

const defaultFuncionesOperativo = [
  'Implementar el plan de desarrollo del hidrógeno verde',
  'Gestionar los recursos financieros y técnicos del proyecto',
  'Coordinar las actividades de los diferentes actores involucrados',
  'Monitorear y evaluar el desempeño del proyecto',
  'Comunicar los avances del proyecto a las partes interesadas',
  'Implementar mesas de trabajo técnicas para actividades específicas',
  'Promover redes de colaboración entre los actores',
  'Retroalimentar al Consejo respecto de oportunidades y requerimientos',
];

export default async function Gobernanza() {
  const hero = { titulo: 'Modelo de Gobernanza', subtitulo: 'Estructura de dirección, gestión y control del programa para garantizar transparencia, eficiencia y sostenibilidad.' };
  let descripcion = 'El modelo de gobernanza del programa se divide en dos niveles — estratégico y operativo — para asegurar una gestión integral y sostenible del proyecto. Define quién tiene el poder y la responsabilidad, cómo se toman las decisiones, y cómo se supervisa y evalúa el desempeño.';
  const estrategico = { titulo: 'Consejo de Dirección del Hidrógeno Verde de Araucanía', descripcion: 'Instancia máxima de dirección estratégica compuesta por representantes del Gobierno Regional, Ministerios, universidades, asociaciones empresariales, comunidades indígenas y expertos independientes.', funciones: defaultFuncionesEstrategico, periodicidad: 'Trimestralmente — Presencial y/o videoconferencia' };
  const operativo = { titulo: 'Unidad de Coordinación y Gestión del Proyecto', descripcion: 'Compuesta por el Director del proyecto, equipo técnico, equipo de gestión financiera y equipo de comunicación y participación comunitaria.', funciones: defaultFuncionesOperativo, periodicidad: 'Cada 15 días — Presencial y/o videoconferencia' };
  let unidadMiembros: Miembro[] = [];
  // Diagrama y galería editables desde el CMS (F6, Auditoria_traspaso.md).
  const diagrama = {
    consejo: 'Consejo de Dirección H2V',
    comite: 'Comité Consultivo',
    unidad: 'Unidad de Coordinación y Gestión',
    equipos: ['Director', 'Equipo Técnico', 'Gestión Financiera', 'Comunicaciones'],
  };
  let actividades: { url: string; alt: string; titulo?: string }[] = [];

  try {
    const payload = await getPayload();
    const data = await payload.findGlobal({ slug: 'pagina-gobernanza' });
    if (data?.hero?.titulo) hero.titulo = data.hero.titulo;
    if (data?.hero?.subtitulo) hero.subtitulo = data.hero.subtitulo;
    if (data?.descripcion) descripcion = data.descripcion;
    if (data?.nivelEstrategico?.titulo) estrategico.titulo = data.nivelEstrategico.titulo;
    if (data?.nivelEstrategico?.descripcion) estrategico.descripcion = data.nivelEstrategico.descripcion;
    if (data?.nivelEstrategico?.funciones && data.nivelEstrategico.funciones.length > 0) {
      estrategico.funciones = data.nivelEstrategico.funciones.map((f) => f.texto);
    }
    if (data?.nivelEstrategico?.periodicidad) estrategico.periodicidad = data.nivelEstrategico.periodicidad;
    if (data?.nivelOperativo?.titulo) operativo.titulo = data.nivelOperativo.titulo;
    if (data?.nivelOperativo?.descripcion) operativo.descripcion = data.nivelOperativo.descripcion;
    if (data?.nivelOperativo?.funciones && data.nivelOperativo.funciones.length > 0) {
      operativo.funciones = data.nivelOperativo.funciones.map((f) => f.texto);
    }
    if (data?.nivelOperativo?.periodicidad) operativo.periodicidad = data.nivelOperativo.periodicidad;
    if (data?.diagrama?.consejo) diagrama.consejo = data.diagrama.consejo;
    if (data?.diagrama?.comite) diagrama.comite = data.diagrama.comite;
    if (data?.diagrama?.unidad) diagrama.unidad = data.diagrama.unidad;
    if (data?.diagrama?.equipos && data.diagrama.equipos.length > 0) {
      diagrama.equipos = data.diagrama.equipos.map((e) => e.nombre);
    }
    if (data?.actividades && data.actividades.length > 0) {
      actividades = data.actividades
        .map((a) => {
          const foto = typeof a.foto === 'object' && a.foto !== null ? a.foto : null;
          return {
            url: foto?.url || '',
            alt: foto?.alt || a.titulo || 'Actividad del programa',
            titulo: a.titulo ?? undefined,
          };
        })
        .filter((a) => a.url);
    }

    // Get miembros for the team table
    const miembrosResult = await payload.find({ collection: 'miembros', where: { instancia: { equals: 'unidad' } }, sort: 'orden', limit: 50 });
    unidadMiembros = miembrosResult.docs;
  } catch {
    // keep default empty array
  }

  function FuncionList({ items, color }: { items: string[]; color: string }) {
    return (
      <ul className="space-y-2 text-sm text-gray-600 mb-6">
        {items.map((fn, i) => (
          <li key={i} className="flex items-start gap-2">
            <svg className={`w-4 h-4 ${color} mt-0.5 shrink-0`} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {fn}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div>
      <section className="bg-h2v-blue text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-semibold mb-4">{hero.titulo}</h1>
          <p className="text-lg opacity-80 max-w-2xl mx-auto">{hero.subtitulo}</p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-gray-700 text-lg leading-relaxed mb-8">{descripcion}</p>
        </div>
      </section>

      {/* Nivel Estratégico */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-h2v-green flex items-center justify-center text-white font-bold">1</div>
            <h2 className="text-2xl font-bold text-h2v-blue">Nivel Estratégico</h2>
          </div>
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 mb-8">
            <h3 className="text-xl font-semibold text-h2v-green mb-4">{estrategico.titulo}</h3>
            <p className="text-gray-600 mb-6">{estrategico.descripcion}</p>
            <h4 className="font-semibold text-h2v-blue mb-3">Funciones:</h4>
            <FuncionList items={estrategico.funciones} color="text-h2v-green" />
            <div className="flex items-center gap-4 p-4 bg-h2v-green/5 rounded-lg">
              <svg className="w-5 h-5 text-h2v-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <div><p className="font-medium text-h2v-blue">Reuniones del Consejo</p><p className="text-sm text-gray-500">{estrategico.periodicidad}</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* Nivel Operativo */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-h2v-blue flex items-center justify-center text-white font-bold">2</div>
            <h2 className="text-2xl font-bold text-h2v-blue">Nivel Operativo</h2>
          </div>
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 mb-8">
            <h3 className="text-xl font-semibold text-h2v-green mb-4">{operativo.titulo}</h3>
            <p className="text-gray-600 mb-6">{operativo.descripcion}</p>
            <h4 className="font-semibold text-h2v-blue mb-3">Funciones:</h4>
            <FuncionList items={operativo.funciones} color="text-h2v-blue" />
            <div className="flex items-center gap-4 p-4 bg-h2v-blue/5 rounded-lg">
              <svg className="w-5 h-5 text-h2v-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <div><p className="font-medium text-h2v-blue">Reuniones de coordinación</p><p className="text-sm text-gray-500">{operativo.periodicidad}</p></div>
            </div>
          </div>

          {/* Equipo */}
          {unidadMiembros.length > 0 && (
            <>
              <h3 className="text-xl font-semibold text-h2v-blue mb-4">Equipo del Proyecto</h3>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-h2v-blue text-white">
                    <tr>
                      <th className="px-6 py-3 text-sm font-medium">Institución</th>
                      <th className="px-6 py-3 text-sm font-medium">Cargo</th>
                      <th className="px-6 py-3 text-sm font-medium">Titular</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {unidadMiembros.map((m, i) => (
                      <tr key={m.id} className={i % 2 === 1 ? 'bg-gray-50' : ''}>
                        <td className="px-6 py-3 text-sm font-medium text-gray-900">{m.institucion}</td>
                        <td className="px-6 py-3 text-sm text-gray-600">{m.cargo}</td>
                        <td className="px-6 py-3 text-sm text-gray-600">{m.nombre}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Diagrama — textos editables en /admin → Páginas → Gobernanza → Diagrama */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-h2v-blue mb-8">Estructura del Modelo</h2>
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100" role="img" aria-label={`Diagrama: ${diagrama.consejo} (nivel estratégico) conectado al ${diagrama.comite}, y debajo la ${diagrama.unidad} (nivel operativo) con ${diagrama.equipos.length} equipos`}>
            <svg viewBox="0 0 800 350" className="w-full max-w-2xl mx-auto" aria-hidden="true">
              <rect x="200" y="20" width="400" height="60" rx="12" fill="var(--h2v-green)" />
              <text x="400" y="55" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">{diagrama.consejo}</text>
              <rect x="550" y="100" width="220" height="50" rx="10" fill="#4ECDC4" />
              <text x="660" y="130" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">{diagrama.comite}</text>
              <line x1="500" y1="80" x2="550" y2="110" stroke="#94A3B8" strokeWidth="2" strokeDasharray="6" />
              <line x1="400" y1="80" x2="400" y2="160" stroke="#94A3B8" strokeWidth="2" />
              <rect x="150" y="160" width="500" height="60" rx="12" fill="var(--h2v-blue)" />
              <text x="400" y="195" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">{diagrama.unidad}</text>
              {diagrama.equipos.map((label, i) => {
                // Reparte las cajas (ancho 120) uniformemente en el ancho del lienzo (800).
                const slot = 800 / diagrama.equipos.length;
                const x = Math.round(slot * i + slot / 2 - 60);
                return (
                  <g key={i}>
                    <line x1={x + 60} y1="220" x2={x + 60} y2="270" stroke="#94A3B8" strokeWidth="1.5" />
                    <rect x={x} y="270" width="120" height="45" rx="8" fill="#F1F5F9" stroke="#CBD5E1" />
                    <text x={x + 60} y="297" textAnchor="middle" fill="var(--h2v-blue)" fontSize="11" fontWeight="600">{label}</text>
                  </g>
                );
              })}
              <text x="30" y="55" fill="var(--h2v-green)" fontSize="11" fontWeight="bold">NIVEL</text>
              <text x="30" y="70" fill="var(--h2v-green)" fontSize="11" fontWeight="bold">ESTRATÉGICO</text>
              <text x="30" y="195" fill="var(--h2v-blue)" fontSize="11" fontWeight="bold">NIVEL</text>
              <text x="30" y="210" fill="var(--h2v-blue)" fontSize="11" fontWeight="bold">OPERATIVO</text>
            </svg>
          </div>
        </div>
      </section>

      {/* Galería — fotos editables en /admin → Páginas → Gobernanza → Evidencia de Actividades */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-h2v-blue mb-8">Evidencia de Actividades</h2>
          {actividades.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {actividades.map((foto, i) => (
                <figure key={i} className="space-y-2">
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                    <Image src={foto.url} alt={foto.alt} fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
                  </div>
                  {foto.titulo && <figcaption className="text-xs text-gray-500">{foto.titulo}</figcaption>}
                </figure>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="aspect-[4/3] bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm border border-gray-200">
                    <div className="text-center">
                      <svg className="w-8 h-8 mx-auto mb-2 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      Foto próximamente
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-400 mt-4 italic">Las fotografías se irán incorporando a medida que se desarrolle el programa.</p>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
