// @vitest-environment node
// Pruebas del pipeline KMZ (docs/PLAN_MAPA_KMZ.md §F0 y checklist §4.6).
// Entorno NODE a propósito: jsdom trae un DOMParser global que NO es el de
// producción (serverless no tiene DOMParser) y parsea distinto el XML inválido.

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { unzipSync } from 'fflate';
import { kml as kmlToGeoJson } from '@tmcw/togeojson';
import { DOMParser } from '@xmldom/xmldom';

import { decodificarXml } from './decodificar';
import { ingerirKmz } from './leer-kmz';
import { ErrorIngesta } from './mensajes';
import { kmlColor, cdata, escapeXml, generarKml } from './kml';
import { generarKmz } from './kmz';
import { normalizarDescripcion, aTextoPlano } from './sanear';
import { enlaceSeguro, urlAbsoluta } from './enlace';
import { etapas, textosKml } from '@/content/defaults/proyectos';
import type { ProyectoKml } from './tipos';

const fix = (n: string): Uint8Array =>
  new Uint8Array(readFileSync(fileURLToPath(new URL('../../../tests/fixtures/geo/' + n, import.meta.url))));

// ─── decodificación por sniff de bytes ───
describe('decodificarXml', () => {
  it('recupera el KMZ real del SEA (utf-8 declarado, bytes Latin-1) sin U+FFFD', () => {
    const files = unzipSync(fix('sea_mapadeproyectos_2026-08-22.kmz'), { filter: (f) => /\.kml$/i.test(f.name) });
    const r = decodificarXml(files['doc.kml']);
    expect(r.encodingUsado).toBe('windows-1252');
    expect(r.reescrito).toBe(true);
    expect(r.texto).toContain('página');
    expect(r.texto).not.toContain('�');
    expect(r.texto).toMatch(/^<\?xml version="1\.0" encoding="UTF-8"\?>/);
  });

  it('transcodifica un KML con prólogo latin-1 honesto', () => {
    const r = decodificarXml(fix('latin1_honesto.kml'));
    expect(r.texto).toContain('Curacautín');
    expect(r.texto).not.toContain('�');
  });

  it('deja intacto un UTF-8 válido', () => {
    const r = decodificarXml(fix('mymaps_networklink.kml'));
    expect(r.encodingUsado).toBe('utf-8');
    expect(r.reescrito).toBe(false);
  });
});

// ─── helpers de color / XML ───
describe('kmlColor', () => {
  it('convierte #rrggbb a aabbggrr (byte medio 9E, no 95)', () => {
    expect(kmlColor('#F59E0B', 1)).toBe('ff0b9ef5');
    expect(kmlColor('#10B981', 1)).toBe('ff81b910');
  });
  it('aplica el alfa', () => {
    expect(kmlColor('#F59E0B', 0.9)).toBe('e60b9ef5');
    expect(kmlColor('#000000', 0)).toBe('00000000');
  });
});

describe('cdata', () => {
  it("particiona ']]>' de modo que el texto sobrevive al parseo XML", () => {
    const original = 'texto ]]> peligroso con <b>etiquetas</b> & símbolos';
    const xml = `<r>${cdata(original)}</r>`;
    const doc = new DOMParser().parseFromString(xml, 'text/xml');
    // Si la partición fallara, el ]]> cerraría el CDATA y el XML quedaría mal formado
    // o el textContent perdería parte del texto.
    expect(doc.documentElement?.textContent).toBe(original);
  });
});

describe('escapeXml', () => {
  it('escapa los cinco caracteres especiales', () => {
    expect(escapeXml('a & b < c > d " e \' f')).toBe('a &amp; b &lt; c &gt; d &quot; e &apos; f');
  });
});

// ─── saneo ───
describe('sanear', () => {
  it('normaliza description objeto {@type:html} a texto plano', () => {
    const d = { '@type': 'html', value: '<b>Hola</b> <a href="x">link</a>' };
    expect(normalizarDescripcion(d)).toBe('Hola link');
  });
  it('quita <script> del texto', () => {
    expect(aTextoPlano('ok <script>alert(1)</script> fin')).toBe('ok fin');
  });
});

// ─── enlaces ───
describe('enlace', () => {
  it('enlaceSeguro solo acepta http(s)', () => {
    expect(enlaceSeguro('https://ejemplo.cl')).toBe('https://ejemplo.cl');
    expect(enlaceSeguro('javascript:alert(1)')).toBeNull();
    expect(enlaceSeguro('')).toBeNull();
    expect(enlaceSeguro(null)).toBeNull();
  });
  it('urlAbsoluta resuelve rutas relativas contra el sitio', () => {
    expect(urlAbsoluta('/proyectos#1', 'https://h2varaucania.cl')).toBe('https://h2varaucania.cl/proyectos#1');
  });
});

// ─── ingestión: casos válidos ───
describe('ingerirKmz — válidos', () => {
  it('digiere el KMZ estilo Google Earth Pro (punto + línea + polígono)', () => {
    const r = ingerirKmz(fix('google_earth_pro.kmz'));
    expect(r.nFeatures).toBe(3);
    expect(new Set(r.tiposGeometria)).toEqual(new Set(['Point', 'LineString', 'Polygon']));
    // bbox dentro de La Araucanía
    expect(r.bbox[0]).toBeGreaterThan(-74);
    expect(r.bbox[2]).toBeLessThan(-71);
    expect(r.bbox[1]).toBeGreaterThan(-40);
    expect(r.bbox[3]).toBeLessThan(-37);
    // description saneada a texto plano (sin HTML)
    const pt = r.geojson.features.find((f) => f.geometry?.type === 'Point');
    expect(String(pt?.properties.description ?? '')).not.toContain('<');
  });

  it('digiere un KML plano con encoding mentiroso (utf-8 declarado, latin-1)', () => {
    const r = ingerirKmz(fix('latin1_mentiroso.kml'));
    expect(r.nFeatures).toBe(1);
    expect(JSON.stringify(r.geojson)).toContain('página');
  });

  it('conserva las coordenadas del punto tras el round-trip (togeojson)', () => {
    const r = ingerirKmz(fix('latin1_mentiroso.kml'));
    const p = r.geojson.features[0].geometry;
    expect(p?.type).toBe('Point');
    if (p?.type === 'Point') {
      expect(p.coordinates[0]).toBeCloseTo(-72.59, 5);
      expect(p.coordinates[1]).toBeCloseTo(-38.74, 5);
    }
  });
});

// ─── ingestión: errores con mensaje en español ───
describe('ingerirKmz — errores', () => {
  const casos: Array<[string, string]> = [
    ['zip_sin_kml.zip', 'zipSinKml'],
    ['mymaps_networklink.kml', 'soloNetworkLink'],
    ['sin_geometria.kml', 'sinGeometria'],
    ['placemark_sin_geometria.kml', 'sinGeometria'],
    ['zipbomb_declarada.kmz', 'zipEntradaEnorme'],
  ];
  for (const [archivo, clave] of casos) {
    it(`${archivo} → ${clave}`, () => {
      try {
        ingerirKmz(fix(archivo));
        throw new Error('no lanzó');
      } catch (e) {
        expect(e).toBeInstanceOf(ErrorIngesta);
        expect((e as ErrorIngesta).clave).toBe(clave);
        expect((e as ErrorIngesta).message).toMatch(/[a-záéíóúñ]/i); // texto en español, no vacío
      }
    });
  }

  it('rechaza coordenadas fuera de rango WGS84', () => {
    const kmlMalo = '<?xml version="1.0" encoding="UTF-8"?><kml xmlns="http://www.opengis.net/kml/2.2"><Document>' +
      '<Placemark><name>x</name><Point><coordinates>-72.5,200</coordinates></Point></Placemark></Document></kml>';
    expect(() => ingerirKmz(new TextEncoder().encode(kmlMalo))).toThrow(ErrorIngesta);
  });
});

// ─── generación KML/KMZ + round-trip completo ───
describe('generarKml / generarKmz', () => {
  const proyectos: ProyectoKml[] = [
    {
      id: 1, nombre: 'Planta ]]> con símbolos & <raros>', empresa: 'Acme', etapa: 'operacion',
      region: 'Araucanía', capacidadMW: 5, url: 'https://ejemplo.cl',
      punto: { lat: -38.74, lng: -72.59 },
      geometria: { type: 'Polygon', coordinates: [[[-72.6, -38.75], [-72.5, -38.75], [-72.5, -38.7], [-72.6, -38.7], [-72.6, -38.75]]] },
      mostrarMarcador: true,
    },
    {
      id: 2, nombre: 'Solo punto', etapa: 'planificacion',
      punto: { lat: -39.0, lng: -72.2 }, url: 'javascript:alert(1)',
    },
  ];

  it('produce un KML válido con los requisitos de Google Earth', () => {
    const kml = generarKml(proyectos, { etapas, textos: textosKml, sitio: 'https://h2varaucania.cl' });
    expect(kml).toMatch(/^<\?xml version="1\.0" encoding="UTF-8"\?>/);
    expect(kml).toContain('<kml xmlns="http://www.opengis.net/kml/2.2">');
    expect(kml).toContain('<LookAt>');
    expect(kml).toContain('<Folder><name>Operación</name>');
    expect(kml).toContain('<StyleMap id="etapa-operacion">');
    expect(kml).toContain('<BalloonStyle>');
    // color aabbggrr de operación (#10B981)
    expect(kml).toContain('<color>ff81b910</color>');
    // enlace del sitio absoluto, no relativo
    expect(kml).not.toMatch(/href="\/proyectos/);
    expect(kml).toContain('https://h2varaucania.cl/proyectos#1');
    // el enlace javascript: del proyecto 2 NO aparece
    expect(kml).not.toContain('javascript:');
    // el ']]>' del nombre queda neutralizado (escapeHtml lo vuelve ]]&gt;), así que
    // no hay ningún ]]> crudo que cierre un CDATA antes de tiempo.
    expect(kml).toContain('Planta ]]&gt; con');
    expect(kml.split('<![CDATA[').length - 1).toBe(kml.split(']]></description>').length - 1);
  });

  it('empaqueta un KMZ con doc.kml primero y round-trip por togeojson', () => {
    const kml = generarKml(proyectos, { etapas, textos: textosKml });
    const kmz = generarKmz(kml);
    const entradas = unzipSync(kmz);
    expect(Object.keys(entradas)[0]).toBe('doc.kml'); // primera entrada
    expect(Object.keys(entradas)).toContain('files/icono-punto.png');
    // re-parseo con el mismo runtime de producción
    const doc = new DOMParser().parseFromString(new TextDecoder().decode(entradas['doc.kml']), 'text/xml');
    const fc = kmlToGeoJson(doc as unknown as Document, { skipNullGeometry: true });
    expect(fc.features.length).toBe(2); // ambos placemarks sobreviven → XML bien formado
  });

  it('el KMZ generado se puede volver a ingerir sin error', () => {
    const kml = generarKml(proyectos, { etapas, textos: textosKml });
    const kmz = generarKmz(kml);
    const r = ingerirKmz(kmz, { maxVertices: 2000 });
    expect(r.nFeatures).toBe(2);
  });
});
