// Tipos compartidos del pipeline geográfico (docs/PLAN_MAPA_KMZ.md).
// GeoJSON mínimo tipado a mano (evita depender de @types/geojson en runtime).

export type Posicion = number[]; // [lng, lat] (KML/GeoJSON: longitud primero)

export type Geometria =
  | { type: 'Point'; coordinates: Posicion }
  | { type: 'MultiPoint'; coordinates: Posicion[] }
  | { type: 'LineString'; coordinates: Posicion[] }
  | { type: 'MultiLineString'; coordinates: Posicion[][] }
  | { type: 'Polygon'; coordinates: Posicion[][] }
  | { type: 'MultiPolygon'; coordinates: Posicion[][][] }
  | { type: 'GeometryCollection'; geometries: Geometria[] };

export interface Feature {
  type: 'Feature';
  geometry: Geometria | null;
  properties: Record<string, unknown>;
}

export interface FeatureCollection {
  type: 'FeatureCollection';
  features: Feature[];
}

/** [minLng, minLat, maxLng, maxLat] */
export type BBox = [number, number, number, number];

/** Resultado de digerir un KMZ/KML: geometría lista + metadatos derivados. */
export interface ResultadoIngesta {
  geojson: FeatureCollection;
  bbox: BBox;
  centroide: { lat: number; lng: number };
  nFeatures: number;
  nVertices: number;
  tiposGeometria: string[];
  /** Qué se descartó, transcodificó o simplificó (se guarda para que el admin lo vea). */
  resumen: string[];
}

/** Un proyecto listo para exportar a KML. */
export interface ProyectoKml {
  id: string | number;
  nombre: string;
  empresa?: string;
  etapa: string;
  region?: string;
  comuna?: string;
  capacidadMW?: number | null;
  produccionTonAnio?: number | null;
  /** Enlace externo declarado por el admin (texto libre; se valida antes de usar). */
  url?: string | null;
  /** Punto representativo del proyecto. */
  punto: { lat: number; lng: number };
  /** Geometría subida (polígono/línea/…); si falta, se exporta solo el punto. */
  geometria?: Geometria | null;
  mostrarMarcador?: boolean;
}

/** Vocabulario de una etapa: única fuente (defaults/proyectos.ts). */
export interface Etapa {
  valor: string;
  etiqueta: string;
  /** Color hex #rrggbb. */
  color: string;
}

/** Textos del KML, editables desde el CMS. */
export interface TextosKml {
  nombreDocumento: string;
  etiquetaEmpresa: string;
  etiquetaEtapa: string;
  etiquetaRegion: string;
  etiquetaCapacidad: string;
  etiquetaProduccion: string;
  textoVerSitio: string;
  textoEnlaceExterno: string;
  licencia: string;
  nombreNetworkLink: string;
}
