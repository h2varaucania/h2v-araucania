import type { GlobalConfig } from 'payload';
import { revalidaGlobal } from '@/hooks/revalidate';

export const PaginaInicio: GlobalConfig = {
  slug: 'pagina-inicio',
  hooks: { afterChange: [revalidaGlobal('/')] },
  label: 'Página de Inicio',
  admin: {
    group: 'Páginas',
    description: 'Contenido del hero, botones y tarjetas de acceso rápido de la página principal.',
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      label: 'Sección Hero (banner principal)',
      fields: [
        {
          name: 'eyebrow',
          type: 'text',
          maxLength: 90,
          defaultValue: 'Bien Público 24BP-269085 · Programa Estratégico Regional',
          label: 'Línea superior (eyebrow)',
          admin: { description: 'Texto pequeño en mayúsculas sobre el título. Ej: "Bien Público 24BP-269085 · Programa Estratégico Regional"' },
        },
        {
          name: 'titulo',
          type: 'text',
          required: true,
          maxLength: 80,
          defaultValue: 'Hidrógeno Verde en La Araucanía',
          admin: { description: 'Título grande que aparece sobre el banner principal.' },
        },
        {
          name: 'subtitulo',
          type: 'textarea',
          required: true,
          maxLength: 250,
          defaultValue: 'Plataforma informativa sobre los avances, proyectos y oportunidades del hidrógeno verde en la región de La Araucanía, Chile.',
          admin: { description: 'Texto debajo del título. Máximo 250 caracteres.' },
        },
        {
          name: 'ctaPrimario',
          type: 'text',
          maxLength: 40,
          defaultValue: 'Conozca el Programa',
          admin: { description: 'Texto del botón principal. Ej: "Conozca el Programa"' },
        },
        {
          name: 'ctaSecundario',
          type: 'text',
          maxLength: 40,
          defaultValue: 'Ver Proyectos en el Mapa',
          admin: { description: 'Texto del botón secundario. Ej: "Ver Proyectos en el Mapa"' },
        },
      ],
    },
    {
      name: 'kpis',
      type: 'array',
      label: 'Banda de indicadores (KPIs)',
      labels: { singular: 'Indicador', plural: 'Indicadores' },
      maxRows: 6,
      defaultValue: [
        { cifra: '9', unidad: '', etiqueta: 'Instituciones' },
        { cifra: '88.745', unidad: 't/año', etiqueta: 'Demanda H₂V al 2045' },
        { cifra: '32', unidad: '', etiqueta: 'Comunas' },
        { cifra: '2024–2050', unidad: '', etiqueta: 'Hoja de ruta' },
      ],
      admin: { description: 'Las cifras destacadas bajo el banner (barra azul). Agrega, quita o reordena arrastrando.' },
      fields: [
        { name: 'cifra', type: 'text', required: true, maxLength: 20, label: 'Cifra', admin: { description: 'El número grande. Ej: "88.745" o "2024–2050"' } },
        { name: 'unidad', type: 'text', maxLength: 15, label: 'Unidad (opcional)', admin: { description: 'Se muestra junto a la cifra en verde. Ej: "t/año"' } },
        { name: 'etiqueta', type: 'text', required: true, maxLength: 40, label: 'Etiqueta', admin: { description: 'Texto pequeño bajo la cifra. Ej: "Comunas"' } },
      ],
    },
    {
      name: 'seccionExplora',
      type: 'group',
      label: 'Sección "Explora el Programa"',
      fields: [
        {
          name: 'kicker',
          type: 'text',
          maxLength: 30,
          defaultValue: 'Explora',
          label: 'Kicker (palabra sobre el título)',
          admin: { description: 'Palabra pequeña en verde sobre el título de la sección. Ej: "Explora"' },
        },
        {
          name: 'titulo',
          type: 'text',
          maxLength: 60,
          defaultValue: 'Explora el Programa',
          admin: { description: 'Título de la sección de tarjetas de acceso rápido.' },
        },
        {
          name: 'cards',
          type: 'array',
          label: 'Tarjetas de acceso rápido',
          maxRows: 6,
          admin: { description: 'Tarjetas que aparecen debajo del hero. Cada una lleva a una sección del sitio.' },
          fields: [
            { name: 'titulo', type: 'text', required: true, maxLength: 50, admin: { description: 'Ej: "Mapa de Proyectos", "Noticias"' } },
            { name: 'descripcion', type: 'textarea', required: true, maxLength: 150, admin: { description: 'Breve descripción de la sección (1 oración).' } },
            { name: 'enlace', type: 'text', required: true, maxLength: 100, admin: { description: 'Ruta de la sección. Ej: "/proyectos", "/noticias"' } },
          ],
        },
      ],
    },
    {
      name: 'seccionNoticias',
      type: 'group',
      label: 'Sección "Últimas Noticias"',
      fields: [
        { name: 'kicker', type: 'text', maxLength: 30, defaultValue: 'Actualidad', label: 'Kicker', admin: { description: 'Palabra pequeña en verde sobre el título. Ej: "Actualidad"' } },
        { name: 'titulo', type: 'text', maxLength: 60, defaultValue: 'Ultimas Noticias', label: 'Título', admin: { description: 'Título de la sección de noticias en la portada.' } },
        { name: 'verTodas', type: 'text', maxLength: 30, defaultValue: 'Ver todas →', label: 'Texto del enlace "ver todas"', admin: { description: 'Enlace a la página de noticias. Ej: "Ver todas →"' } },
      ],
    },
    {
      name: 'seccionInstituciones',
      type: 'group',
      label: 'Sección de logos institucionales',
      fields: [
        { name: 'tituloApoyo', type: 'text', maxLength: 60, defaultValue: 'Proyecto apoyado por', label: 'Título del bloque Corfo', admin: { description: 'Leyenda sobre los logos de Corfo (exigida por el Manual de Comunicaciones). Ej: "Proyecto apoyado por"' } },
        { name: 'tituloParticipantes', type: 'text', maxLength: 60, defaultValue: 'Instituciones participantes', label: 'Título del bloque de participantes', admin: { description: 'Leyenda sobre los logos de las instituciones. Ej: "Instituciones participantes"' } },
      ],
    },
  ],
};
