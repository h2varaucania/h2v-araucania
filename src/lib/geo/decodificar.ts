// Decodificación de bytes → texto XML del pipeline (docs/PLAN_MAPA_KMZ.md §4.2).
// REGLA: nunca creerle al prólogo. El KMZ real del SEA declara encoding="utf-8"
// pero escribe bytes Latin-1; decidir por el prólogo produce U+FFFD en silencio.
// Verificado empíricamente contra tests/fixtures/geo/sea_mapadeproyectos_*.kmz.

import { ErrorIngesta } from './mensajes';

export interface ResultadoDecodificar {
  texto: string;
  encodingUsado: string;
  /** true si hubo que caer a un encoding distinto al UTF-8 declarado. */
  reescrito: boolean;
}

/** Decodifica por SNIFF DE BYTES, no por el prólogo. */
export function decodificarXml(buf: Uint8Array): ResultadoDecodificar {
  // 1) BOM UTF-16 explícito.
  if (buf.length >= 2) {
    if (buf[0] === 0xff && buf[1] === 0xfe) return limpiar(dec(buf, 'utf-16le'), 'utf-16le', true);
    if (buf[0] === 0xfe && buf[1] === 0xff) return limpiar(dec(buf, 'utf-16be'), 'utf-16be', true);
  }
  // 2) UTF-8 estricto: si los bytes son UTF-8 válido, es la verdad.
  try {
    const texto = new TextDecoder('utf-8', { fatal: true }).decode(buf);
    return limpiar(texto, 'utf-8', false);
  } catch {
    // 3) No es UTF-8. Windows-1252 (superset de Latin-1: cubre comillas y guiones
    //    tipográficos que ISO-8859-1 deja indefinidos). Node lo trae nativo.
    try {
      return limpiar(dec(buf, 'windows-1252'), 'windows-1252', true);
    } catch {
      throw new ErrorIngesta('noDecodificable');
    }
  }
}

function dec(buf: Uint8Array, enc: string): string {
  return new TextDecoder(enc, { fatal: false }).decode(buf);
}

function limpiar(texto: string, enc: string, reescrito: boolean): ResultadoDecodificar {
  // Quitar BOM textual sobrante y reescribir el prólogo a UTF-8 (o quitarlo),
  // porque a partir de aquí el string ya es Unicode y se serializa como UTF-8.
  let t = texto.replace(/^﻿/, '');
  t = t.replace(/^<\?xml[^>]*\?>\s*/i, '<?xml version="1.0" encoding="UTF-8"?>\n');
  return { texto: t, encodingUsado: enc, reescrito };
}
