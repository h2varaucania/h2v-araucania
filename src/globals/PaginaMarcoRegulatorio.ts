import type { GlobalConfig } from 'payload';
import { revalidaGlobal } from '@/hooks/revalidate';

export const PaginaMarcoRegulatorio: GlobalConfig = {
  slug: 'pagina-marco-regulatorio',
  hooks: { afterChange: [revalidaGlobal('/hidrogeno-verde/marco-regulatorio')] },
  label: 'Marco Regulatorio',
  admin: {
    group: 'Páginas',
    description: 'Normativa y políticas nacionales relevantes para el desarrollo del H2V en Chile.',
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      label: 'Encabezado',
      fields: [
        { name: 'titulo', type: 'text', maxLength: 60, defaultValue: 'Marco Regulatorio', admin: { description: 'Título del banner.' } },
        { name: 'subtitulo', type: 'textarea', maxLength: 250, defaultValue: 'Normativa, políticas y lineamientos para el desarrollo del hidrógeno verde en Chile.', admin: { description: 'Texto debajo del título.' } },
      ],
    },
    {
      name: 'documentos',
      type: 'array',
      label: 'Documentos normativos',
      maxRows: 15,
      admin: { description: 'Leyes, estrategias y planes relevantes. Cada uno se muestra como una tarjeta.' },
      fields: [
        { name: 'titulo', type: 'text', required: true, maxLength: 100, admin: { description: 'Nombre completo de la ley o documento. Ej: "Ley 21.305 de Eficiencia Energética"' } },
        { name: 'descripcion', type: 'textarea', required: true, maxLength: 400 },
        { name: 'relevancia', type: 'textarea', maxLength: 300, label: 'Relevancia para La Araucanía', admin: { description: 'Cómo se aplica este documento al contexto regional.' } },
      ],
    },
  ],
};
