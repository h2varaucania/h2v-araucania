import type { GlobalConfig } from 'payload';
import { revalidaGlobal } from '@/hooks/revalidate';
import {
  etapas,
  mapasBase,
  textosMapa,
  textosKml,
  proyectosDefaults,
} from '@/content/defaults/proyectos';

// Fuente única de los textos y del vocabulario del mapa: los defaultValue salen de
// src/content/defaults/proyectos.ts, que también alimentan el componente del mapa y
// el generador de KML (EDITABILIDAD_TOTAL §3.2 + docs/PLAN_MAPA_KMZ.md §4.1).

export const PaginaProyectos: GlobalConfig = {
  slug: 'pagina-proyectos',
  hooks: { afterChange: [revalidaGlobal('/proyectos')] },
  label: 'Mapa de Proyectos',
  admin: {
    group: 'Páginas',
    description:
      'Encabezado, textos y configuración del Mapa de Proyectos. Los proyectos que aparecen en el mapa se gestionan en Contenido → Proyectos; sus geometrías, en Contenido → Capas geográficas.',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Encabezado',
          fields: [
            {
              name: 'hero',
              type: 'group',
              label: 'Encabezado',
              fields: [
                {
                  name: 'titulo',
                  type: 'text',
                  maxLength: 60,
                  defaultValue: proyectosDefaults.heroTitulo,
                  admin: { description: 'Título del banner.' },
                },
                {
                  name: 'subtitulo',
                  type: 'textarea',
                  maxLength: 300,
                  defaultValue: proyectosDefaults.heroSubtitulo,
                  admin: { description: 'Texto debajo del título.' },
                },
              ],
            },
          ],
        },
        {
          label: 'Mapa y KMZ',
          description: 'Etapas, mapas base y textos de la sección de descargas KMZ.',
          fields: [
            {
              name: 'etapas',
              type: 'array',
              label: 'Etapas de los proyectos',
              admin: {
                description: 'Vocabulario y color de cada etapa. Se usa en el mapa, la leyenda, los filtros y el KMZ. El "valor" debe coincidir con el de la etapa en cada proyecto.',
              },
              defaultValue: etapas.map((e) => ({ valor: e.valor, etiqueta: e.etiqueta, color: e.color })),
              fields: [
                { name: 'valor', type: 'text', required: true, maxLength: 40, admin: { description: 'Clave interna (no cambiar): planificacion, pilotaje, desarrollo, operacion.' } },
                { name: 'etiqueta', type: 'text', required: true, maxLength: 40, admin: { description: 'Nombre visible. Ej: "Pilotaje".' } },
                { name: 'color', type: 'text', required: true, maxLength: 7, admin: { description: 'Color hex. Ej: "#F59E0B".' } },
              ],
            },
            {
              name: 'mapasBase',
              type: 'array',
              label: 'Mapas base',
              admin: {
                description: 'Capas de fondo del mapa (calle, satélite). El visitante elige. Cambiar el proveedor aquí no requiere programar.',
              },
              defaultValue: mapasBase.map((m) => ({ ...m })),
              fields: [
                { name: 'nombre', type: 'text', required: true, maxLength: 40 },
                { name: 'urlPlantilla', type: 'text', required: true, maxLength: 300, admin: { description: 'Plantilla de teselas con {z}/{x}/{y}.' } },
                { name: 'atribucion', type: 'text', required: true, maxLength: 300, admin: { description: 'Crédito del proveedor (obligatorio legalmente).' } },
                { name: 'maxZoom', type: 'number', defaultValue: 18 },
                { name: 'esSatelital', type: 'checkbox', defaultValue: false },
              ],
            },
            {
              name: 'textosMapa',
              type: 'group',
              label: 'Textos del mapa y las descargas',
              fields: [
                { name: 'tituloDescargas', type: 'text', maxLength: 80, defaultValue: textosMapa.tituloDescargas },
                { name: 'ayudaKmz', type: 'textarea', maxLength: 300, defaultValue: textosMapa.ayudaKmz },
                { name: 'botonDescargarTodo', type: 'text', maxLength: 60, defaultValue: textosMapa.botonDescargarTodo },
                { name: 'botonDescargarProyecto', type: 'text', maxLength: 60, defaultValue: textosMapa.botonDescargarProyecto },
                { name: 'botonAbrirGoogleEarth', type: 'text', maxLength: 60, defaultValue: textosMapa.botonAbrirGoogleEarth },
                { name: 'botonCentrar', type: 'text', maxLength: 40, defaultValue: textosMapa.botonCentrar },
                { name: 'etiquetaUbicacion', type: 'text', maxLength: 40, defaultValue: textosMapa.etiquetaUbicacion },
                { name: 'etiquetaEtapa', type: 'text', maxLength: 40, defaultValue: textosMapa.etiquetaEtapa },
                { name: 'ariaControlCapas', type: 'text', maxLength: 60, defaultValue: textosMapa.ariaControlCapas },
                { name: 'textoVerProyecto', type: 'text', maxLength: 60, defaultValue: textosMapa.textoVerProyecto },
              ],
            },
            {
              name: 'textosKml',
              type: 'group',
              label: 'Textos dentro del archivo KMZ (Google Earth)',
              fields: [
                { name: 'nombreDocumento', type: 'text', maxLength: 80, defaultValue: textosKml.nombreDocumento },
                { name: 'etiquetaEmpresa', type: 'text', maxLength: 40, defaultValue: textosKml.etiquetaEmpresa },
                { name: 'etiquetaEtapa', type: 'text', maxLength: 40, defaultValue: textosKml.etiquetaEtapa },
                { name: 'etiquetaRegion', type: 'text', maxLength: 40, defaultValue: textosKml.etiquetaRegion },
                { name: 'etiquetaCapacidad', type: 'text', maxLength: 40, defaultValue: textosKml.etiquetaCapacidad },
                { name: 'etiquetaProduccion', type: 'text', maxLength: 40, defaultValue: textosKml.etiquetaProduccion },
                { name: 'textoVerSitio', type: 'text', maxLength: 60, defaultValue: textosKml.textoVerSitio },
                { name: 'textoEnlaceExterno', type: 'text', maxLength: 60, defaultValue: textosKml.textoEnlaceExterno },
                { name: 'licencia', type: 'text', maxLength: 200, defaultValue: textosKml.licencia },
                { name: 'nombreNetworkLink', type: 'text', maxLength: 80, defaultValue: textosKml.nombreNetworkLink },
              ],
            },
          ],
        },
      ],
    },
  ],
};
