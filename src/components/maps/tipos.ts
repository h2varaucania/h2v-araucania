// Tipos compartidos entre la página (servidor) y el mapa (cliente).
// Nada de geojson viaja en estos tipos: la geometría se pide aparte (peso).

export type CapaMeta = {
  id: string;
  titulo?: string;
  color?: string;
  nFeatures?: number;
  bbox?: [number, number, number, number];
};

export type ProyectoMapa = {
  id: string;
  nombre: string;
  descripcion: string;
  empresa: string;
  etapa: string;
  region: string;
  coordenadas: { lat: number; lng: number };
  capacidadMW?: number;
  produccionTonAnio?: number;
  imagen?: { url: string; alt?: string };
  url?: string;
  capa?: CapaMeta;
  mostrarMarcador?: boolean;
};

export type EtapaVista = { valor: string; etiqueta: string; color: string };

export type MapaBaseVista = {
  nombre: string;
  urlPlantilla: string;
  atribucion: string;
  maxZoom?: number;
  esSatelital?: boolean;
};

export type TextosMapaVista = {
  tituloDescargas: string;
  ayudaKmz: string;
  botonDescargarTodo: string;
  botonDescargarProyecto: string;
  botonAbrirGoogleEarth: string;
  botonCentrar: string;
  etiquetaUbicacion: string;
  etiquetaEtapa: string;
  ariaControlCapas: string;
  textoVerProyecto: string;
};

export type MapaProps = {
  proyectos: ProyectoMapa[];
  capasReferencia: CapaMeta[];
  etapas: EtapaVista[];
  mapasBase: MapaBaseVista[];
  textos: TextosMapaVista;
};
