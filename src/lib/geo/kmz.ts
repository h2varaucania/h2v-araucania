// Empaqueta un KML + el ícono en un KMZ válido (docs/PLAN_MAPA_KMZ.md §4.5).
// doc.kml va como PRIMERA entrada (Google Earth carga el primer .kml del archivo).

import { zipSync, strToU8 } from 'fflate';
import { ICONO_PUNTO_B64 } from './icono';

function base64AU8(b64: string): Uint8Array {
  if (typeof Buffer !== 'undefined') return new Uint8Array(Buffer.from(b64, 'base64'));
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

/**
 * Genera el KMZ. `doc.kml` primero; el ícono en `files/icono-punto.png` (la ruta que
 * referencia el <IconStyle> del KML). Nivel de compresión moderado (el KML comprime bien).
 */
export function generarKmz(kml: string): Uint8Array {
  const icono = base64AU8(ICONO_PUNTO_B64);
  // fflate preserva el orden de las claves del objeto: doc.kml debe ir primero.
  return zipSync(
    {
      'doc.kml': strToU8(kml),
      'files/icono-punto.png': [icono, { level: 0 }], // PNG ya comprimido: no recomprimir
    },
    { level: 6 },
  );
}
