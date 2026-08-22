// Única fuente de verdad del contenido de la página Mapa de Proyectos y del
// vocabulario de etapas (EDITABILIDAD_TOTAL §3.2 + docs/PLAN_MAPA_KMZ.md §4.1).
// Alimenta: defaultValue del global `pagina-proyectos`, el select de la colección
// `proyectos`, los fallbacks del componente del mapa, y el generador de KML.
// VERBATIM de lo que hoy está cableado en ProyectosMap.tsx y proyectos/page.tsx.

import type { Etapa, TextosKml } from '@/lib/geo/tipos';

// Vocabulario de etapas: valor (clave estable, la del select), etiqueta y color.
// Reemplaza los objetos etapaColor/etapaLabel hoy duplicados en ProyectosMap.tsx.
export const etapas: Etapa[] = [
  { valor: 'planificacion', etiqueta: 'Planificación', color: '#F59E0B' },
  { valor: 'pilotaje', etiqueta: 'Pilotaje', color: '#3B82F6' },
  { valor: 'desarrollo', etiqueta: 'Desarrollo', color: '#8B5CF6' },
  { valor: 'operacion', etiqueta: 'Operación', color: '#10B981' },
];

// Mapas base editables (el proveedor se puede cambiar sin redeploy). El satelital
// de Esri es legacy: el mapa cae a OSM en `tileerror` (docs/PLAN_MAPA_KMZ.md §4.3).
export interface MapaBase {
  nombre: string;
  urlPlantilla: string;
  atribucion: string;
  maxZoom: number;
  esSatelital: boolean;
}

export const mapasBase: MapaBase[] = [
  {
    nombre: 'Mapa',
    urlPlantilla: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    atribucion: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 18,
    esSatelital: false,
  },
  {
    nombre: 'Satélite',
    urlPlantilla: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    atribucion: 'Imagen &copy; Esri, Maxar, Earthstar Geographics',
    maxZoom: 18,
    esSatelital: true,
  },
];

// Textos de la sección de mapa/descargas (editables en el global).
export const textosMapa = {
  tituloDescargas: 'Descargar los proyectos',
  ayudaKmz: 'Descarga los proyectos en formato KMZ y ábrelos en Google Earth para explorarlos en 3D.',
  botonDescargarTodo: 'Descargar todos (KMZ)',
  botonDescargarProyecto: 'Descargar KMZ',
  botonAbrirGoogleEarth: 'Abrir en Google Earth',
  botonCentrar: 'Centrar mapa',
  etiquetaUbicacion: 'Ubicación',
  etiquetaEtapa: 'Etapa',
  ariaControlCapas: 'Capas del mapa',
  textoVerProyecto: 'Ver sitio del proyecto →',
} as const;

// Textos que van dentro del KML generado.
export const textosKml: TextosKml = {
  nombreDocumento: 'Proyectos H2V Araucanía',
  etiquetaEmpresa: 'Empresa',
  etiquetaEtapa: 'Etapa',
  etiquetaRegion: 'Región',
  etiquetaCapacidad: 'Capacidad',
  etiquetaProduccion: 'Producción',
  textoVerSitio: 'Ver en el sitio H2V Araucanía',
  textoEnlaceExterno: 'Sitio del proyecto',
  licencia: 'Datos: Programa H2V Araucanía. Cartografía referencial.',
  nombreNetworkLink: 'Proyectos H2V Araucanía',
};

// Hero de la página (retrofit de los defaults inline del global y los fallbacks
// del hero cableados hoy en proyectos/page.tsx: una sola fuente).
export const proyectosDefaults = {
  heroTitulo: 'Mapa de Proyectos',
  heroSubtitulo: 'Proyectos de hidrógeno verde en desarrollo y ejecución a nivel regional y nacional.',
} as const;
