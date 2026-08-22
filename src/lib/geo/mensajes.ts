// Catálogo de mensajes de error en español del pipeline de ingestión
// (docs/PLAN_MAPA_KMZ.md, criterio de aceptación 1). Toda excepción del pipeline
// se relanza con uno de estos textos, para que el admin nunca vea "Something went
// wrong". En el hook de Payload se envuelven en `new APIError(msg, 400, undefined, true)`.

export const MENSAJES = {
  demasiadoGrande: 'El archivo supera los 4 MB permitidos. Un KMZ de predio pesa unos pocos KB; revisa si incluye imágenes o capas que no corresponden.',
  zipSinKml: 'El archivo comprimido no contiene ningún KML (doc.kml). Exporta el mapa como KMZ o KML desde Google Earth.',
  zipEntradaEnorme: 'El archivo contiene una entrada demasiado grande al descomprimir. Puede estar dañado o no ser un KMZ de proyecto.',
  zipRutaInvalida: 'El archivo comprimido contiene rutas no permitidas. Vuelve a exportarlo desde Google Earth.',
  noDecodificable: 'No se pudo leer el texto del archivo (codificación desconocida). Vuelve a exportarlo desde Google Earth como KML.',
  xmlInvalido: 'El archivo no es un KML válido (XML mal formado). Vuelve a exportarlo desde Google Earth.',
  sinGeometria: 'El archivo no contiene ninguna geometría (punto, línea o polígono). Dibuja al menos una forma antes de exportarlo.',
  soloNetworkLink: 'Este archivo es un enlace a un mapa en línea (NetworkLink), no contiene las geometrías. En Google My Maps usa "Exportar a KML/KMZ" y desmarca "Mantener los datos actualizados".',
  demasiadasFeatures: 'El archivo tiene demasiadas geometrías (más de 5.000). Esta plataforma es de difusión; sube una capa acotada al proyecto.',
  fueraDeRango: 'El archivo tiene coordenadas fuera de rango. ¿Quizás la latitud y la longitud están invertidas?',
  desconocido: 'No se pudo procesar el archivo. Verifica que sea un KMZ o KML válido exportado desde Google Earth.',
} as const;

export type ClaveMensaje = keyof typeof MENSAJES;

/** Error del pipeline con un mensaje ya en español, listo para el admin. */
export class ErrorIngesta extends Error {
  readonly clave: ClaveMensaje;
  constructor(clave: ClaveMensaje) {
    super(MENSAJES[clave]);
    this.name = 'ErrorIngesta';
    this.clave = clave;
  }
}
