#!/usr/bin/env python3
"""Genera los fixtures de F0 para el pipeline KMZ (docs/PLAN_MAPA_KMZ.md §F0).

El fixture (a) real del SEA (sea_mapadeproyectos_2026-08-22.kmz) ya está versionado.
Este script produce el resto, fieles al formato que emiten las herramientas reales,
para que la tubería se pruebe contra los casos que de verdad aparecen y no solo
contra archivos escritos para pasar el test.

Reproducible: no usa fecha ni azar. Correr desde la raíz del repo:
    python3 tests/fixtures/geo/generar-fixtures.py
"""
import os
import struct
import zipfile

AQUI = os.path.dirname(os.path.abspath(__file__))

# Coordenadas en La Araucanía (Temuco ~ -38.74, -72.59) para que el encuadre sea real.
LAT, LNG = -38.74, -72.59


def escribir(nombre: str, data: bytes):
    ruta = os.path.join(AQUI, nombre)
    with open(ruta, "wb") as f:
        f.write(data)
    print(f"  {nombre:38s} {len(data):>7} bytes")


# ─────────────────────────────────────────────────────────────────────────────
# (b) Export estilo Google Earth Pro: "Guardar lugar como… .kmz".
# StyleMap normal/highlight, íconos remotos de maps.google.com, LookAt por
# Placemark, dos carpetas anidadas, Snippet, description en CDATA, punto+línea+polígono.
# ─────────────────────────────────────────────────────────────────────────────
GEPRO_KML = f"""<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2">
<Document>
\t<name>Predios H2V.kmz</name>
\t<StyleMap id="msn_ylw-pushpin">
\t\t<Pair><key>normal</key><styleUrl>#sn_ylw-pushpin</styleUrl></Pair>
\t\t<Pair><key>highlight</key><styleUrl>#sh_ylw-pushpin</styleUrl></Pair>
\t</StyleMap>
\t<Style id="sn_ylw-pushpin">
\t\t<IconStyle><scale>1.1</scale>
\t\t\t<Icon><href>http://maps.google.com/mapfiles/kml/pushpin/ylw-pushpin.png</href></Icon>
\t\t</IconStyle>
\t</Style>
\t<Style id="sh_ylw-pushpin">
\t\t<IconStyle><scale>1.3</scale>
\t\t\t<Icon><href>http://maps.google.com/mapfiles/kml/pushpin/ylw-pushpin.png</href></Icon>
\t\t</IconStyle>
\t</Style>
\t<Style id="poly-verde">
\t\t<LineStyle><color>ff37730d</color><width>2</width></LineStyle>
\t\t<PolyStyle><color>4c37730d</color></PolyStyle>
\t</Style>
\t<Folder>
\t\t<name>Región de La Araucanía</name>
\t\t<Folder>
\t\t\t<name>Comuna de Temuco</name>
\t\t\t<Placemark>
\t\t\t\t<name>Planta piloto H2V Temuco</name>
\t\t\t\t<Snippet maxLines="2">Punto representativo del predio</Snippet>
\t\t\t\t<description><![CDATA[<b>Planta piloto</b><br>Electrólisis PEM 5 MW.<br><a href="http://ejemplo.cl">ficha</a>]]></description>
\t\t\t\t<LookAt>
\t\t\t\t\t<longitude>{LNG}</longitude><latitude>{LAT}</latitude>
\t\t\t\t\t<altitude>0</altitude><heading>0</heading><tilt>0</tilt><range>3000</range>
\t\t\t\t</LookAt>
\t\t\t\t<styleUrl>#msn_ylw-pushpin</styleUrl>
\t\t\t\t<Point><coordinates>{LNG},{LAT},0</coordinates></Point>
\t\t\t</Placemark>
\t\t\t<Placemark>
\t\t\t\t<name>Trazado ducto</name>
\t\t\t\t<styleUrl>#msn_ylw-pushpin</styleUrl>
\t\t\t\t<LineString>
\t\t\t\t\t<tessellate>1</tessellate>
\t\t\t\t\t<coordinates>
\t\t\t\t\t\t{LNG},{LAT},0 {LNG+0.02},{LAT+0.01},0 {LNG+0.05},{LAT+0.005},0
\t\t\t\t\t</coordinates>
\t\t\t\t</LineString>
\t\t\t</Placemark>
\t\t</Folder>
\t\t<Folder>
\t\t\t<name>Comuna de Lautaro</name>
\t\t\t<Placemark>
\t\t\t\t<name>Predio parque eólico</name>
\t\t\t\t<description>Polígono del predio (sin HTML).</description>
\t\t\t\t<styleUrl>#poly-verde</styleUrl>
\t\t\t\t<Polygon>
\t\t\t\t\t<tessellate>1</tessellate>
\t\t\t\t\t<outerBoundaryIs><LinearRing><coordinates>
\t\t\t\t\t\t{LNG+0.1},{LAT+0.1},0 {LNG+0.15},{LAT+0.1},0 {LNG+0.15},{LAT+0.14},0 {LNG+0.1},{LAT+0.14},0 {LNG+0.1},{LAT+0.1},0
\t\t\t\t\t</coordinates></LinearRing></outerBoundaryIs>
\t\t\t\t</Polygon>
\t\t\t</Placemark>
\t\t</Folder>
\t</Folder>
</Document>
</kml>
"""


def kmz(nombre: str, kml_str: str):
    import io
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr("doc.kml", kml_str.encode("utf-8"))
    escribir(nombre, buf.getvalue())


kmz("google_earth_pro.kmz", GEPRO_KML)

# ─────────────────────────────────────────────────────────────────────────────
# (c) Export de Google My Maps en modo "mantener los datos actualizados":
# el .kml es SOLO un NetworkLink → 0 features. Debe dar un mensaje propio.
# ─────────────────────────────────────────────────────────────────────────────
MYMAPS_NETWORKLINK = """<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
<Document>
\t<name>Mi mapa H2V</name>
\t<NetworkLink>
\t\t<name>Mi mapa H2V</name>
\t\t<Link><href>https://www.google.com/maps/d/kml?mid=SOMEID&amp;forcekml=1</href></Link>
\t</NetworkLink>
</Document>
</kml>
"""
escribir("mymaps_networklink.kml", MYMAPS_NETWORKLINK.encode("utf-8"))

# ─────────────────────────────────────────────────────────────────────────────
# Sintéticos: cada uno aísla un caso del pipeline.
# ─────────────────────────────────────────────────────────────────────────────

# KML sin ninguna geometría (solo un Document vacío con carpeta).
escribir("sin_geometria.kml", (
    '<?xml version="1.0" encoding="UTF-8"?>\n'
    '<kml xmlns="http://www.opengis.net/kml/2.2"><Document>'
    '<name>Vacío</name><Folder><name>Nada</name></Folder>'
    '</Document></kml>'
).encode("utf-8"))

# Placemark SIN geometría (togeojson lo emitiría con geometry:null sin skipNullGeometry).
escribir("placemark_sin_geometria.kml", (
    '<?xml version="1.0" encoding="UTF-8"?>\n'
    '<kml xmlns="http://www.opengis.net/kml/2.2"><Document>'
    '<Placemark><name>Solo nombre</name><description>sin punto</description></Placemark>'
    '</Document></kml>'
).encode("utf-8"))

# KML declarado latin-1 con prólogo HONESTO (caso fácil que sí debe transcodificar bien).
LATIN1_HONESTO = (
    '<?xml version="1.0" encoding="iso-8859-1"?>\n'
    '<kml xmlns="http://www.opengis.net/kml/2.2"><Document>'
    '<Placemark><name>Curacaut\xedn</name>'  # í en latin-1 = 0xED
    f'<Point><coordinates>{LNG},{LAT}</coordinates></Point>'
    '</Placemark></Document></kml>'
).encode("latin-1")
escribir("latin1_honesto.kml", LATIN1_HONESTO)

# KML estilo SEA: prólogo MIENTE (dice utf-8, bytes latin-1). Caso difícil.
LATIN1_MENTIROSO = (
    '<?xml version="1.0" encoding="utf-8"?>\n'
    '<kml><Document>'  # además sin xmlns, como el SEA
    '<Placemark><name>Villarrica p\xe1gina</name>'  # á latin-1 = 0xE1
    f'<Point><coordinates>{LNG},{LAT}</coordinates></Point>'
    '</Placemark></Document></kml>'
).encode("latin-1")
escribir("latin1_mentiroso.kml", LATIN1_MENTIROSO)

# Placemark cuyo texto contiene ]]> (rompe CDATA ingenuo al RE-generar el KML).
escribir("cdata_peligroso.kml", (
    '<?xml version="1.0" encoding="UTF-8"?>\n'
    '<kml xmlns="http://www.opengis.net/kml/2.2"><Document>'
    '<Placemark><name>Predio ]]&gt; test</name>'
    '<description><![CDATA[texto con ]]]]><![CDATA[> secuencia y <script>alert(1)</script>]]></description>'
    f'<Point><coordinates>{LNG},{LAT}</coordinates></Point>'
    '</Placemark></Document></kml>'
).encode("utf-8"))

# ZIP válido pero SIN ningún .kml adentro.
import io
buf = io.BytesIO()
with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as z:
    z.writestr("leeme.txt", b"no hay kml aca")
    z.writestr("imgs/foto.png", b"\x89PNG\r\n\x1a\n")
escribir("zip_sin_kml.zip", buf.getvalue())

# "Zip-bomb" pequeña y honesta para la prueba de guardas: una entrada .kml cuyo
# tamaño descomprimido declarado es enorme. NO inflamos de verdad; el filtro de
# fflate debe rechazarla leyendo el header, sin reservar memoria.
# Construimos el ZIP a mano para poder mentir en el uncompressed size del header local.
def zip_con_tamano_mentiroso(nombre_entrada: str, contenido: bytes, tam_declarado: int) -> bytes:
    import zlib
    comp = zlib.compress(contenido, 9)[2:-4]  # raw deflate
    crc = zlib.crc32(contenido) & 0xFFFFFFFF
    nombre_b = nombre_entrada.encode("utf-8")
    # Local file header con uncompressed size MENTIROSO (tam_declarado).
    local = struct.pack("<IHHHHHIIIHH",
                        0x04034b50, 20, 0, 8, 0, 0,
                        crc, len(comp), tam_declarado,
                        len(nombre_b), 0) + nombre_b + comp
    # Central directory
    central = struct.pack("<IHHHHHHIIIHHHHHII",
                          0x02014b50, 20, 20, 0, 8, 0, 0,
                          crc, len(comp), tam_declarado,
                          len(nombre_b), 0, 0, 0, 0, 0, 0) + nombre_b
    end = struct.pack("<IHHHHIIH",
                      0x06054b50, 0, 0, 1, 1,
                      len(central), len(local), 0)
    return local + central + end

escribir("zipbomb_declarada.kmz",
         zip_con_tamano_mentiroso("doc.kml", b"<kml/>", 500 * 1024 * 1024))

print("\nFixtures de F0 generados. El fixture (a) del SEA ya estaba versionado.")
