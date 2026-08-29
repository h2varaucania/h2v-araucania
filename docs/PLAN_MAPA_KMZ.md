# Plan v2: Mapa de proyectos con capas KMZ (compatible con Google Earth)

> **ESTADO DE IMPLEMENTACIÓN (2026-08-28): COMPLETO Y EN PRODUCCIÓN.** F0–F4 desplegadas
> (push autorizado por Carlos, con respaldo previo de la BD vía `backup-db.yml` y
> verificación en prod: migración corrió, `/proyectos` y `/admin` 200, KMZ válido con
> URLs absolutas correctas, CDN cachea — `x-vercel-cache: HIT`). El flag
> `NEXT_PUBLIC_FEAT_MAPA_PLUS` queda **APAGADO** en producción: los visitantes ven el
> mapa igual que antes hasta que el sostenedor lo encienda en Vercel (efecto en runtime,
> sin recompilar). Suite: 162 vitest + 16 e2e verde, typecheck y lint limpios. Pendiente
> del dueño: la prueba en Google Earth (docs/PRUEBA_DUENO_MAPA_KMZ.md) y la capa SEIA de
> referencia. El Manual de Usuario v1.1 documenta la función (sección 4.6 y Anexos A/B/D).

Estado: **v2, 2026-08-21, lista para aprobación final de Carlos.** La v1 (misma fecha) pasó por una
revisión adversarial con 57 agentes (5 críticos por lente, un verificador por hallazgo con mandato
de refutar, segundo verificador en los graves, y un crítico de completitud): 30 hallazgos
confirmados, 0 refutados, 8 faltantes. Todos están integrados aquí; el Anexo B lista cada cambio
v1→v2 y su origen. Veredicto del crítico de completitud sobre la v1: "no todavía"; la condición que
pedía (cerrar por escrito el contrato de salida KML y el contrato real de togeojson/xmldom y probarlos
contra archivos reales versionados ANTES de escribir código) es ahora la fase F0.

Decisiones ya tomadas por Carlos (2026-08-21): alcance completo F0–F3; mapa base satelital sí; la
prueba real en Google Earth la hace Carlos o Daniel; la capa SEIA de La Araucanía la exporta Daniel a
mano desde el visor del SEA; revisión con agentes autorizada (hecha).

---

## 0. Principio rector (Carlos): difusión, no servidor SIG

> "Súper importante que esa infraestructura con los KMZ sea factible de cargar y no tengamos
> problemas con que la página quede pesada. El objetivo de la página es ser difusión del bien
> público y no un servidor de proyectos."

Se traduce en reglas duras, todas verificables (criterio de aceptación 8):

| Regla | Cómo se cumple |
|---|---|
| Cero librerías nuevas en el navegador | KMZ se descomprime, valida, sanea y simplifica **en el servidor al subir**; el visitante recibe GeoJSON liviano. fflate/togeojson/xmldom viven solo en el servidor |
| Presupuesto por capa | Geometría simplificada (Douglas-Peucker) a ≤ 2.000 vértices y ≤ 150 KB por capa de proyecto; ≤ 300 KB por capa de referencia |
| Presupuesto por página | `/proyectos` sin capas no sube de peso respecto a hoy (HTML 28 KB + JS 200 KB gzip, medido 2026-08-21); el HTML/RSC nunca incluye geometrías |
| Carga bajo demanda | La página trae solo puntos + cajas envolventes; la geometría de cada proyecto se pide **después** de montar el mapa desde un endpoint cacheado; las capas de referencia van apagadas y se descargan solo al prenderlas |
| Descargas, no hosting | KMZ generado al vuelo desde datos que ya están en la base, con caché y límite de tasa; sin tiles, sin WMS, sin buscador tipo SEIA; tope de 50 capas en total |
| Subida simple para Daniel | Un campo "Capa KMZ" en la ficha del proyecto, 4 MB máximo, errores en español; nada más que configurar |
| Interruptor | Todo el bloque KMZ va detrás del flag ya existente `mapaAvanzado` (`NEXT_PUBLIC_FEAT_MAPA_PLUS`): se puede desplegar apagado y apagar en producción sin redeploy de código |

Fuera de alcance, explícito: visor SIG tipo SEA (clusters, medición, selección por polígono, 29 mil
puntos), edición de geometrías en el admin, previsualización de mapa dentro del admin (se verifica en
`/proyectos`; así lo dirá la guía), capas WMS externas.

---

## 1. Estudio del SEA: "la forma" (resumen; evidencia en Anexo A)

### 1.1 Dónde están los mapas
Portada sea.gob.cl → "Mapas Interactivos" → tres visores en `sig.sea.gob.cl`:

| Visor | Qué hace |
|---|---|
| Mapa de Proyectos (`/mapadeproyectos/`) | Puntos de ~29.352 proyectos del SEIA (1.049 en La Araucanía). Filtros, clusters, popup, exportación CSV/XLS/KMZ |
| Análisis Territorial (`/analisisTerritorialExterno/`) | El usuario dibuja o **sube un KMZ/KML/GeoJSON**; el visor lo cruza con capas y exporta KML/GeoJSON/XLS/PDF |
| Líneas de Base (`/mapaLineasBaseEIA/`) | Selección por polígono → lista de proyectos → CSV/KMZ/XLS |

### 1.2 Arquitectura
ArcGIS JS API 3.25/3.44 + AngularJS + jQuery + Bootstrap; `ClusterFeatureLayer`, `BasemapGallery`
(SEA/OSM/Bing), `Measurement`, `Bookmarks`, `Geocoder`. Datos: servicio ArcGIS
`Produccion/EdicionPuntoRepresentativo/MapServer/0` (geometría **punto**; campos `ID_EXPEDIENTE,
NOMBRE_PROYECTO, FORMA_PRESENTACION, LETRA/NOMBRE_TIPOLOGIA, REGION` (clave romana: IX), `COMUNAS,
TITULAR, ESTADO_EVALUACION, FECHA_*, INVERSION_US, URL_EXPEDIENTE, X, Y`), paginación 1.000, filtro
`MODIFICADO=1`. Configuración en XML (`config.xml`, `tipologias.xml`, `bookmarks.xml`).

### 1.3 UI
Barra superior (medir área/distancia, extents, marcadores); panel izquierdo con toggles EIA/DIA y
banderas por estado (verde aprobado, amarilla en calificación, roja rechazado, blanca otros),
"filtrar por área de visualización", paginación; panel flotante "Lista Proyectos" con chips de filtro
(nombre, tipología DS95/DS40, fechas, estado, región), tabla y botones CSV/imprimir/XLS/KMZ; galería de
mapas base; popup con estado + nombre, región, comunas, fechas, tipología, titular, inversión,
coordenadas, documentos de línea base y botón "Abrir Expediente"; modal de bienvenida con perfil.

### 1.4 Su KMZ real (fixture versionado: `tests/fixtures/geo/sea_mapadeproyectos_2026-08-22.kmz`)
`doc.kml` + `imgs/eia_1..4.png` + `imgs/dia_1..4.png` (íconos embebidos), un `<Style>` por forma ×
estado (`IconStyle scale 0.5` + `hotSpot`), `<Schema>` con `SimpleField` por atributo, Placemarks con
`SchemaData`, un Document por página de 1.000. **Defectos reales que nosotros evitamos**:
1. Declara `encoding="utf-8"` pero escribe bytes **Latin-1** ("p\xE1gina"): parsers estrictos lo
   rechazan; decodificarlo como UTF-8 produce U+FFFD en silencio.
2. `<kml>` sin `xmlns="http://www.opengis.net/kml/2.2"`.
3. `<Document id="">`, `displayName` con CDATA doblemente escapado, campos con fugas de .NET
   (`inversion_us.ToString`, `nuevo_`).
4. La última entrada del ZIP (`imgs/dia_4.png`) tiene **CRC inválido** (`zipfile.testzip()` lo
   detecta): un descompresor estricto aborta; Google Earth lo tolera. Nuestra ingestión solo lee la
   entrada KML y no debe caerse por entradas no-KML corruptas.

### 1.5 Cómo ingieren KMZ subidos
Suben el archivo al servidor para obtener una URL y usan `new KMLLayer(url)` (Esri parsea en un
servicio externo), tope de 50 objetos; GeoJSON con `FileReader`. Exportan resultados armando KML a
mano (`Placemark` + `ExtendedData` + geometría) como `.kml` con FileSaver. Conclusión: validar y
normalizar en el servidor al subir es el patrón robusto; depender de servicios externos no lo es.

### 1.6 Dato útil
En el SEIA hay 19 proyectos con "hidrógeno"/"H2V" en el nombre (H2 Magallanes, INNA, Volta, HyEx,
Quintero, Calama…) y ninguno en La Araucanía.

---

## 2. Lo que ya tenemos (y la brecha)

| Pieza | Hoy | Brecha |
|---|---|---|
| Mapa | Leaflet 1.9 + OSM, marcadores por etapa, popup HTML, filtros región/etapa, tarjetas, fitBounds; `filtered` sin memo y un solo efecto que redibuja y reencuadra en cada render | Sin geometrías, sin capas, sin descarga KMZ, sin satélite, vocabulario de etapas cableado en 4 sitios |
| Colección `proyectos` | nombre, descripción, empresa, etapa, región, coordenadas (requeridas), capacidadMW, produccionTonAnio, imagen, url; **sin borradores** (`versions` solo en noticias/eventos) | Sin capa geográfica, sin geometría derivada |
| Uploads | `media` (imágenes/PDF/Office) en Vercel Blob; `access` explícito | Sin tipos KMZ/KML; sin validación geográfica |
| Textos | Global `pagina-proyectos` con defaults inline + un segundo juego de fallbacks en `proyectos/page.tsx`; **no existe** `src/content/defaults/proyectos.ts` | Faltan textos del bloque KMZ y la fuente única |
| Pruebas | Playwright e2e (12 specs, servidor levantado a mano), vitest (133 tests, `environment: jsdom`), CI solo lint+tsc+build | Sin pruebas geo; vitest no está en CI; jsdom no es el runtime de producción |
| Rutas públicas | `src/lib/rateLimit.ts` aplicado a las 4 rutas existentes (contact, download, search, video-event) | Las rutas `/api/geo/*` deben seguir el mismo patrón |

---

## 3. /goal

**Objetivo**: que el mapa de proyectos muestre, además del marcador, la **geometría real de cada
proyecto cargada por el administrador como KMZ/KML**, y que cualquier visitante pueda **descargar un
KMZ válido (por proyecto y global) que abra limpio en Google Earth**, sin que la página se haga pesada y
con el estándar de editabilidad, migraciones y pruebas del resto del sitio.

**Criterios de aceptación (medibles)**
1. El admin sube un `.kmz`/`.kml` en la ficha de un proyecto; si es inválido, el panel muestra un
   **error en español que explica qué está mal** (texto exacto verificado en e2e; nunca "Something went
   wrong"). Casos cubiertos: ZIP sin KML, KML sin geometrías, KML solo-NetworkLink (export de Google
   My Maps "mantener actualizado"), placemarks sin geometría, coordenadas fuera de rango, archivo > 4 MB,
   entrada KML corrupta.
2. Al guardar, `/proyectos` dibuja la geometría con el color de la etapa, el popup sigue funcionando
   (con mouse y con teclado vía la lista de tarjetas) y el mapa encuadra la unión de capas y marcadores.
3. `GET /api/geo/proyectos/<id>/kmz` y `GET /api/geo/proyectos/kmz` devuelven un KMZ que:
   - es ZIP válido con `doc.kml` como primera entrada; < 4 MB (tope de respuesta de Vercel);
   - es **UTF-8 real y declarado**, `<kml xmlns="http://www.opengis.net/kml/2.2">`, coordenadas
     `lon,lat` sin altitud;
   - por proyecto: `name`, `description` (HTML en CDATA con los mismos datos del popup y **enlaces
     absolutos** al sitio), `ExtendedData`, `styleUrl` por etapa, geometría subida (o el punto);
   - colores KML en `aabbggrr` verificados contra el hex de la etapa; `<LookAt>` inicial sobre La
     Araucanía; `<Folder>` por etapa; `StyleMap` normal/highlight; `BalloonStyle`;
   - round-trip KMZ → `@tmcw/togeojson` en vitest (entorno **node**) recupera el mismo número de
     features y coordenadas (±1e-6); el fixture real del SEA se ingiere completo.
4. `GET /api/geo/proyectos/kml` entrega un **NetworkLink** con `href` absoluto, `refreshMode
   onInterval` + `refreshInterval 3600`, `viewRefreshMode never`, `Content-Type
   application/vnd.google-earth.kml+xml`.
5. Todo texto nuevo (títulos, leyenda, botones, ayuda, etiquetas del balloon, nombre del Document,
   licencia, mapas base y su atribución, **vocabulario y color de las etapas**) es editable en `/admin`
   (global `pagina-proyectos`) con fuente única en `src/content/defaults/proyectos.ts`; `INVENTARIO_LITERALES.md`
   actualizado (incluye `src/lib/geo/*` y `src/app/api/geo/*`).
6. **Verificado localmente antes del push**, en este orden: `npm run lint`, `npm run typecheck`,
   `npm test` (vitest, ahora también en CI), `npm run build`, suite e2e completa contra build de
   producción local con base migrada (12 specs actuales + 3 nuevas), y el log pegado en el commit/PR.
7. **Prueba del dueño con guion** (Carlos o Daniel, 2/2): (a) sube el KMZ de prueba versionado y lo ve
   en `/proyectos`; (b) descarga el KMZ global y lo abre en Google Earth Pro y en Google Earth web
   (importar): tildes intactas en name y description, geometría en el lugar correcto sobre imagen
   satelital, enlaces del globo clickeables y aterrizando en el sitio, encuadre inicial en La
   Araucanía, descarga por proyecto funciona. Resultado anotado en el PR.
8. **Peso**: HTML/RSC de `/proyectos` sin capas no supera el actual; con 5 proyectos con capa, el
   total de GeoJSON cargado después del montaje ≤ 300 KB y ninguna capa > 150 KB; Lighthouse
   rendimiento no cae bajo la nota actual. Medido con `curl --compressed` y anotado en el PR.

---

## 4. Diseño de la solución

### 4.1 Modelo de datos
- **Nueva colección `capas-geo`** (upload, grupo "Contenido", etiqueta "Capas geográficas (KMZ)"):
  - `access` **obligatorio y explícito**, idéntico a Media: `{ read: anyone, create: isAdminOrEditor,
    update: isAdminOrEditor, delete: isAdmin }`. Regla nueva del repo: toda colección declara sus
    cuatro operadores, nunca hereda el default (`Boolean(user)` dejaría subir capas a cualquier
    usuario `registrado`). Prueba: 403 con rol `registrado` (vitest con Local API + `user`).
  - **Sin `upload.mimeTypes`**: Payload valida el MIME por contenido (`file-type`) ANTES de los hooks y
    con mensajes literales en inglés; un `.kml` con BOM o sin prólogo cae en `text/plain` y sería
    rechazado en inglés. Sin lista, Payload solo bloquea ejecutables/scripts y el 100 % de la
    validación ocurre en nuestro hook, en español.
  - `upload.staticDir` explícito a `public/uploads/capas-geo` (ya ignorado por git; sin esto Payload
    escribiría en `./capas-geo/` en la raíz del repo).
  - Campos: `titulo` (requerido, maxLength), `descripcion`, `tipo` (select `proyecto | referencia`),
    `color` (hex, opcional), y derivados de solo lectura llenados por el hook: `geojson` (json, `admin.hidden`:
    el campo json se renderiza con Monaco y una capa grande colgaría el navegador de Daniel), `bbox`
    (**group** de 4 números `minLng/minLat/maxLng/maxLat`, no `hasMany`: evita una tabla auxiliar),
    `centroide` (group lat/lng), `nFeatures`, `nVertices`, `tiposGeometria`, `resumenValidacion`
    (textarea readOnly: qué se descartó/simplificó/transcodificó). Derivados con `admin.readOnly` +
    `disableListColumn`.
  - `defaultPopulate` que **excluye `geojson`** (titulo, tipo, color, bbox, centroide, nFeatures,
    nVertices): ninguna población automática por relación arrastra la geometría.
  - Blob: agregar `'capas-geo': true` al plugin; `addRandomSuffix: true` y `cacheControlMaxAge`
    corto (p. ej. 3600) para esta colección (el default es 1 año: re-subir un KMZ con el mismo nombre
    dejaría el descargable viejo en el CDN). El `.kmz` original queda público por diseño del plugin
    (`access: 'public'`); se documenta. `clientUploads` **jamás** (el archivo no pasaría por el
    servidor y el hook no vería `req.file`).
  - Tope de 4 MB **en el hook** (`req.file.size`); `upload.limits` no existe por colección en Payload
    3.80 (solo global, y afectaría a Media).
- **`proyectos`**: `capa` (upload → `capas-geo`, opcional), `mostrarMarcador` (bool, default true).
  `coordenadas` siguen **requeridas** (el formulario del admin valida en cliente antes de enviar; el
  autorrelleno desde el centroide no es posible sin relajar el esquema y no vale su migración): la
  descripción del campo explica cómo obtenerlas y el `resumenValidacion` de la capa muestra el centroide
  para copiarlo. `proyectos` **no tiene borradores**: la exportación incluye todos los proyectos (como
  `/proyectos` hoy).
- **`pagina-proyectos`** (global), pestaña "Mapa y KMZ": `etapas[]` = `{valor, etiqueta, color}`
  (**única fuente** del vocabulario: alimenta el select de la colección vía defaults, marcadores,
  chips, leyenda, popup y `<Style>` del KML), `mapasBase[]` = `{nombre, urlPlantilla, atribucion,
  maxZoom, esSatelital}`, `textosMapa` (títulos, ayuda KMZ, botones, "Centrar mapa", aria-labels del
  control de capas), `textosKmz` (etiquetas del balloon, nombre del Document y de las carpetas,
  licencia/atribución, nombre del NetworkLink). Defaults en **`src/content/defaults/proyectos.ts`
  (nuevo)**, con retrofit de las dos fuentes actuales (defaults inline del global y fallbacks del
  hero en `proyectos/page.tsx`) para que quede una sola. Todos los `text` con `maxLength` (lo exige
  `src/tests/unit/globals.test.ts`); agregar `capas-geo` y `pagina-proyectos` a las listas manuales de
  `collections.test.ts` / `globals.test.ts`.

### 4.2 Pipeline de ingestión (servidor, `beforeChange` de `capas-geo`, TODO dentro de un try/catch)
1. Si no hay `req.file` (edición de metadatos): **conservar intactos** geojson/bbox/centroide/
   nFeatures/resumenValidacion (test).
2. `req.file.size > 4 MB` → error en español.
3. Si el buffer empieza con `PK`: `fflate.unzipSync(buf, { filter })` donde el `filter` acepta solo
   entradas `*.kml`, rechaza rutas con `..` o absolutas, rechaza `originalSize` > 10 MB por entrada y
   acumula el total (≤ 10 MB; **la guarda va en el filter, no después**: `unzipSync` reserva memoria
   según el tamaño declarado por el atacante). Tomar `doc.kml` o el primer `.kml`. Las entradas
   no-KML (íconos) se ignoran y un CRC inválido en ellas no aborta (caso SEA). Si no es ZIP, tratar
   como KML plano (mismo tope de 10 MB).
4. **Decodificar por sniff de bytes, nunca por el prólogo** (el prólogo del SEA miente): BOM
   `FF FE`/`FE FF` → UTF-16; si no, `new TextDecoder('utf-8', { fatal: true })`; si lanza, reintentar
   con el encoding declarado salvo que sea utf-8, y como último recurso `windows-1252`; quitar BOM y
   **reescribir el prólogo** a `encoding="UTF-8"`; anotar el fallback en `resumenValidacion`.
5. `new DOMParser()` de **`@xmldom/xmldom`** (importado explícitamente, nunca el global: en Node
   serverless no existe y el de jsdom parsea distinto), con `onError` que rechace XML mal formado y
   sin procesar DOCTYPE/entidades externas → `@tmcw/togeojson.kml(doc, { skipNullGeometry: true })`.
6. Validar: ≥ 1 feature **con geometría no nula** (mensaje propio para el caso "solo NetworkLink" y
   para "placemarks sin geometría"); ≤ 5.000 features; coordenadas en rango WGS84; caja amplia de Chile
   (aviso, no bloqueo); descartar features sin geometría, `NetworkLink`, `GroundOverlay`, `gx:` y
   altitud (se listan en el resumen).
7. **Propiedades: lista blanca y texto plano.** Conservar solo `name`, `description` y `ExtendedData`;
   `description` puede venir como string o como `{ '@type': 'html', value }` (togeojson 7): un solo
   helper la normaliza, **quita todo HTML** (texto plano, ≤ 500 caracteres) y lo mismo para el resto.
   Nada del archivo subido llega como HTML al popup ni al KML generado (XSS almacenado cerrado por
   diseño; sin sanitizador de HTML en el bundle).
8. **Simplificar y presupuestar**: Douglas-Peucker (implementación propia de ~40 líneas, sin
   dependencia) hasta ≤ 2.000 vértices por capa de proyecto y ≤ 8.000 por capa de referencia; si el
   GeoJSON resultante supera 150 KB / 300 KB, seguir simplificando y anotar. Precisión de coordenadas
   a 6 decimales.
9. Calcular bbox/centroide/conteos solo sobre features con geometría; guardar.
10. Cualquier excepción (fflate, xmldom, togeojson, la nuestra) se relanza como
    `new APIError(mensajeEnEspañol, 400, undefined, true)` → toast en español en el admin. Mensajes
    catalogados en `src/lib/geo/mensajes.ts` (y, por editabilidad, reflejados en la guía).
Presupuesto de tiempo/memoria: medir en F0 con el fixture del SEA y dejar los números escritos;
declarar `functions` con `maxDuration`/`memory` en `vercel.json` para la ruta de Payload y las geo.

### 4.3 Render público (Leaflet), liviano
- `page.tsx` consulta `proyectos` con `depth: 1` y `select` acotado; pasa al mapa solo `{id, nombre,
  …, capa?: {id, bbox, nFeatures, color}}` (nunca geometrías). El mapa, después de montar, pide
  `GET /api/geo/capas/<id>/geojson` (cacheado: `s-maxage` + `stale-while-revalidate`) para cada capa
  de proyecto visible y dibuja `L.geoJSON` con estilo por etapa (relleno 0,25, borde 2 px); puntos de
  capas con `L.circleMarker` sobre `renderer: L.canvas()`; marcador opcional encima; popups también
  sobre la geometría (contenido construido con `escapeHtml`/DOM, nunca HTML crudo). Si la capa no
  resuelve, degrada al marcador.
- `filtered` con `useMemo`; efecto de **dibujo** separado del efecto de **encuadre** (fitBounds solo
  cuando cambia el conjunto filtrado); toggles de satélite/overlays con `L.control.layers` y refs,
  nunca estado React que remonte capas; botón visible "Centrar mapa"; `aria-label` del control de
  capas y textos de popup en español desde el global; la lista de tarjetas es el equivalente accesible
  por teclado (botón "Ver en el mapa" que abre el popup).
- Mapas base editables (`mapasBase[]`): OSM + satelital. Default satelital: Esri World Imagery (legacy,
  con atribución) **con fallback automático a OSM** en `tileerror` y riesgo documentado (Esri lo declara
  desactivable sin aviso; alternativas: API key de ArcGIS, Sentinel-2 cloudless de EOX, IDE Chile).
  Cambiar de proveedor no requiere redeploy.
- Botones: "Descargar KMZ" por proyecto (popup y tarjeta), "Descargar todos (KMZ)" y "Abrir en Google
  Earth" (mismo archivo + instrucción breve), todos con texto editable.
- CSP: `connect-src 'self'` cubre el fetch de GeoJSON; `img-src https:` cubre teselas; no se usan
  íconos remotos de archivos subidos (todo es color propio).

### 4.4 Capas de referencia (misma tubería, más estrictas)
`capas-geo` con `tipo=referencia` aparecen en el control de capas **apagadas**; su GeoJSON se pide
solo al prenderlas, por el mismo endpoint cacheado, y se dibujan **con el `color` propio de la capa**
(se abandona "con su propia simbología": los íconos PNG del KMZ se descartan y el CSP bloquea
`http://maps.google.com/...`). Primer caso de uso: el KMZ SEIA Araucanía (1.049 puntos) que exporta
Daniel; simplificado y presupuestado (≤ 300 KB). Tope total de 50 capas (validación en el hook).

### 4.5 Exportación KMZ/KML (route handlers, contrato cerrado)
Rutas (segmentos completos; `[id].kmz` **no** es un segmento dinámico válido en el App Router):
- `src/app/api/geo/proyectos/[id]/kmz/route.ts` → `/api/geo/proyectos/<id>/kmz`
- `src/app/api/geo/proyectos/kmz/route.ts` → `/api/geo/proyectos/kmz` (todos; `limit: 1000`)
- `src/app/api/geo/proyectos/kml/route.ts` → NetworkLink
- `src/app/api/geo/capas/[id]/geojson/route.ts` → GeoJSON de una capa (4.3)
Todas con `export const dynamic = 'force-dynamic'`, `Cache-Control: public, s-maxage=3600,
stale-while-revalidate=86400`, `rateLimit` + `getClientIp` como las 4 rutas existentes. El nombre
de archivo lo fija `Content-Disposition: attachment; filename="h2v-araucania-<slug>.kmz"` (+
`filename*=UTF-8''…`).

Generador `src/lib/geo/kml.ts` + `kmz.ts` (`fflate.zipSync`, `doc.kml` primera entrada, ícono en
`files/`). Contrato del KML de salida:
- `<?xml version="1.0" encoding="UTF-8"?>` y bytes UTF-8; `<kml xmlns="http://www.opengis.net/kml/2.2">`.
- `<Document>` con `name` editable, `<LookAt>` sobre el bbox unión (fallback: La Araucanía), un
  `<Folder>` por etapa (nombre editable), `<Style>` + `<StyleMap>` normal/highlight por etapa con ids
  estables (`etapa-<valor>`), **un solo ícono neutro** (círculo blanco PNG embebido, generado una vez
  con `sharp` en F0) teñido con `<IconStyle><color>`; `<LineStyle>`/`<PolyStyle>` con el color de la
  etapa; `<BalloonStyle><text>$[description]</text></BalloonStyle>` (evita la tabla cruda de
  ExtendedData y el pie "Cómo llegar").
- Color KML = `aabbggrr`: helper `kmlColor('#F59E0B', 0.9)` → `e60b95f5`, con test.
- Placemark: `name`, `description` = CDATA con HTML propio (nombre, empresa, etapa, región, capacidad,
  producción, enlace al sitio y enlace externo) donde todo valor del CMS pasa por `escapeHtml`, toda
  URL por `urlAbsoluta()` (`new URL(ruta, NEXT_PUBLIC_SITE_URL || 'https://h2varaucania.cl')`, misma
  convención que robots/sitemap/layout) y el enlace externo por `enlaceSeguro()` (movido a
  `src/lib/geo/enlace.ts` y compartido con el mapa); **partición obligatoria de `]]>`** como
  `]]]]><![CDATA[>`; filtrado de caracteres de control no válidos en XML 1.0; `ExtendedData/Data`
  tipados; `styleUrl`.
- Geometría: punto si no hay capa; si hay capa, `MultiGeometry` con la geometría + el punto
  (si `mostrarMarcador`). Mapeo: `Polygon.rings[0]` → `outerBoundaryIs`, `rings[1..n]` →
  `innerBoundaryIs`; `MultiPolygon`/`MultiLineString`/`GeometryCollection` → `MultiGeometry`;
  siempre `<tessellate>1</tessellate>` y `<altitudeMode>clampToGround</altitudeMode>`; se descarta
  la tercera coordenada; no se fuerza la orientación de anillos.
- Tamaño: < 4 MB por respuesta (tope de Vercel); si el KMZ global lo excede, se pagina en varios
  Documents/archivos (aviso en el plan, improbable con el presupuesto de 4.2).
- NetworkLink (`proyectos/kml`), literal:
  ```xml
  <?xml version="1.0" encoding="UTF-8"?>
  <kml xmlns="http://www.opengis.net/kml/2.2"><NetworkLink>
    <name>Proyectos H2V Araucanía</name><open>1</open>
    <Link><href>https://h2varaucania.cl/api/geo/proyectos/kmz</href>
      <refreshMode>onInterval</refreshMode><refreshInterval>3600</refreshInterval>
      <viewRefreshMode>never</viewRefreshMode></Link>
  </NetworkLink></kml>
  ```
  (sin `refreshInterval` explícito el default es 4 s: 21.600 invocaciones diarias por cliente).
- Nota: `X-Robots-Tag: noindex` global del sitio también cubre los `.kmz/.kml`; correcto mientras el
  sitio esté pre-lanzamiento. En previews de Vercel con protección, el NetworkLink no refresca (solo
  producción).

### 4.6 Checklist "compatible con Google Earth" (todo en vitest, entorno node)
- [ ] ZIP válido, `doc.kml` primera entrada, ícono referenciado existe dentro del KMZ.
- [ ] Prólogo UTF-8 y bytes UTF-8 reales (`TextDecoder fatal` no lanza); `xmlns` 2.2 presente.
- [ ] Coordenadas `lon,lat` con punto decimal, sin espacios en la tupla, sin altitud.
- [ ] Polígonos cerrados; agujeros en `innerBoundaryIs`; `tessellate 1`; `clampToGround`.
- [ ] Colores `aabbggrr` coinciden con el hex de cada etapa.
- [ ] `description` en CDATA; ningún `]]>` sin particionar; ningún `&` sin escapar fuera de CDATA;
      ningún `href="/"` ni `src="/"` relativo; sin caracteres de control.
- [ ] `<LookAt>` presente; `<Folder>` por etapa; `StyleMap` y `BalloonStyle` presentes.
- [ ] < 4 MB y < 2.000 placemarks por archivo.
- [ ] Round-trip con `@tmcw/togeojson`: mismo número de features y coordenadas (±1e-6).
- [ ] Los tres fixtures reales se ingieren: SEA, export de Google Earth Pro, export de My Maps.

### 4.7 Contrato de librerías (verificado en F0, fijado en package.json)
`fflate` (unzip/zip, `filter` para guardas), `@tmcw/togeojson` ≥ 7 (`skipNullGeometry`, `description`
como objeto `{'@type':'html', value}`), `@xmldom/xmldom` ≥ 0.9.10 (piso por GHSA-f6ww-3ggp-fr8h; sin
entidades externas). Versiones con piso explícito y lockfile commiteado. Tests de `src/lib/geo/` con
`// @vitest-environment node` y una aserción de que el módulo importa `DOMParser` de xmldom.

---

## 5. Fases (orden, archivos, pruebas)

### F0. Contrato y cimientos (1 día)
- `npm i fflate @tmcw/togeojson @xmldom/xmldom` con pisos; `@types/geojson`.
- **Fixtures reales versionados** en `tests/fixtures/geo/`: (a) `sea_mapadeproyectos_2026-08-22.kmz`
  (ya versionado; doc.kml + íconos, prólogo mentiroso, CRC inválido en la última entrada); (b) un
  "Guardar lugar como… .kmz" de Google Earth Pro con polígono + trazado + punto en dos carpetas
  anidadas, `StyleMap`, `LookAt`, íconos remotos (lo genera Carlos/Daniel o se construye fiel al
  formato); (c) un export de Google My Maps en modo "mantener actualizado" (KML solo-NetworkLink).
  Más los sintéticos: KML sin geometrías, placemark sin geometría, ZIP sin KML, KML Latin-1 con prólogo
  honesto, zip-bomb pequeña, `descripcion` con `]]>`.
- `src/lib/geo/{leer-kmz,decodificar,simplificar,sanear,kml,kmz,mensajes,enlace}.ts` con vitest en
  entorno node: los 3 reales se ingieren y hacen round-trip; `kmlColor`; partición CDATA; encoding
  por sniff; guardas de zip; presupuesto (mide ms/MB con el fixture SEA y los anota aquí).
- `src/content/defaults/proyectos.ts` (etapas, mapasBase, textosMapa, textosKmz) + retrofit de las
  dos fuentes actuales. Ícono neutro PNG generado con `sharp` y versionado.
- CI: paso `npm test` en `.github/workflows/ci.yml` (133 tests, 0,8 s, sin servidor).

### F1. Modelo + migraciones (1 día)
- Colección `capas-geo` (access, sin mimeTypes, staticDir, defaultPopulate, derivados ocultos/readOnly,
  hook de ingestión); campos en `proyectos`; pestaña en `pagina-proyectos`; Blob plugin con la nueva
  colección (`addRandomSuffix`, cache corto); revalidación con los helpers existentes; flag
  `mapaAvanzado`.
- `npm run payload:generate` y **commitear `src/payload-types.ts` en el mismo commit** (CI y build
  corren `tsc`; la guarda `git diff --exit-code src/payload-types.ts` se agrega a F4/CI).
- `payload migrate:create` → **endurecer a mano** el DDL (drizzle-kit 0.31.7 emite `CREATE TABLE`/
  `ADD COLUMN`/`ADD CONSTRAINT` pelados): `IF NOT EXISTS` en tablas/columnas/índices y `DO $$ …
  EXCEPTION WHEN duplicate_object` en tipos/constraints; **neutralizar el `down`** (sin DROP de datos,
  comentario con el motivo, precedente `20260707_150000`); migración de datos pareada con los defaults
  de textos (guardas SQL antes de escribir). Validar contra base vacía y contra clon de prod
  (`migrate:status` antes/después).
- Regenerar importMap con el plugin Blob ACTIVO y validar admin en build de producción local.
- Pruebas: hook con todos los fixtures por Local API; 403 para `registrado`; edición sin archivo
  conserva derivados; unit tests de esquema (maxLength, listas) en verde.

### F2. Mapa público + descargas (1 día)
- `page.tsx`/`ProyectosMap`/`Loader`: select+depth, carga diferida de GeoJSON, estilos desde
  `etapas[]`, control de capas, satélite con fallback, botones KMZ, a11y, memo/effects.
- Route handlers (`[id]/kmz`, `kmz`, `kml`, `capas/[id]/geojson`) con rate limit y caché; vitest de
  la salida contra el checklist 4.6.
- e2e nuevas (patrón del repo: fixtures en `tests/e2e/fixtures/`, subida por HTTP multipart con JWT
  como `edicion-se-refleja.spec.ts`, `finally` que borra proyecto y capa, `test.skip` si no hay datos):
  `kmz-se-dibuja.spec.ts` (fixture **polígono** → `path.leaflet-interactive` > 0 y popup abre),
  `kmz-descarga.spec.ts` (GET `/api/geo/proyectos/<id>/kmz` y `/kmz` → 200, content-type, ZIP, doc.kml
  UTF-8 con N placemarks), `admin-kmz-error.spec.ts` (ZIP sin KML → texto exacto en español).
- Medición de peso (criterio 8) y guion de la prueba del dueño listo.

### F3. Capas de referencia + pulido (½ día)
- Overlays conmutables (lazy, color propio), leyenda editable, KMZ SEIA Araucanía como primera capa
  (lo sube Daniel), tope de 50 capas.
- Guía de administración (`docs/Guia_Administracion_H2V_Araucania.pdf` + `GuiaAdmin`): "Subir un
  KMZ" (cómo dibujar en Google Earth y exportar; límites; qué significa cada mensaje; verificar en
  `/proyectos`).

### F4. Cierre (½ día)
- Criterio 6 completo en local; push; **antes del primer `migrate` contra prod, disparar el workflow
  `backup-db.yml` y anotar el dump**; migrate-in-build en Vercel; post-deploy: `migrate:status`,
  conteo de `capas_geo`/`proyectos.capa`, admin renderiza, `/proyectos` 200, KMZ descarga y abre;
  si `payload migrate` falla, el build aborta y queda la versión anterior (documentado). Prueba del
  dueño 2/2; memoria, inventario de literales y este plan actualizados.

Esfuerzo total: **~4 días efectivos**, secuencial, sin agentes (la v1 decía 2,5–3; la diferencia son
los fixtures reales, el endurecimiento de la migración, el endpoint de GeoJSON y los tests).

---

## 6. Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Admin en negro por importMap | Regenerar con plugin Blob ACTIVO; build prod local antes de push |
| Migración generada no idempotente / `down` destructivo | Endurecer DDL a mano (IF NOT EXISTS, DO$$), `down` neutralizado, validar en vacía + clon de prod, backup antes del primer migrate |
| `payload-types.ts` desactualizado rompe `tsc`/build | `payload:generate` + commit en el mismo cambio; guarda `git diff --exit-code` |
| MIME del `.kmz` inconsistente / mensajes en inglés de Payload | Sin `mimeTypes`; validación 100 % en el hook; `APIError` público en español |
| Body > 4,5 MB en Vercel | Tope 4 MB en el hook (`req.file.size`); nunca `clientUploads`; respuestas KMZ < 4 MB |
| Encoding mentiroso (caso SEA) | Sniff de bytes + `TextDecoder fatal` + windows-1252; prólogo reescrito; fixture real |
| Zip-bomb / rutas / DOM gigante | `filter` de fflate con topes declarados y acumulados; solo `*.kml`; doc.kml ≤ 10 MB; `functions.maxDuration/memory` |
| XSS almacenado vía name/description | Lista blanca + texto plano al ingerir; popups con `escapeHtml`/DOM; KML con HTML propio escapado |
| Inyección XML en el KML generado | Escapado estricto, partición de `]]>`, control chars filtrados, `enlaceSeguro`, URLs absolutas |
| Página pesada | Presupuestos 0/4.2, GeoJSON diferido y cacheado, `defaultPopulate` sin geojson, simplificación, canvas |
| Esri legacy desactivado | Mapas base editables con fallback a OSM en `tileerror` |
| `revalidatePath` en render | Helpers existentes con guarda de borrador |
| Google Earth rechaza el archivo | Contrato 4.5 + checklist 4.6 en vitest + fixtures reales + guion de prueba del dueño |
| Textos no editables | Fuente única `defaults/proyectos.ts`, `etapas[]`, inventario ampliado a `src/lib/` y `src/app/api/` |

---

## 7. Decisiones

Resueltas por Carlos (2026-08-21): alcance completo; satélite sí; prueba del dueño Carlos/Daniel; capa
SEIA la exporta Daniel; principio rector "difusión, no servidor SIG".

Tomadas en la v2 por diseño (avisar si Carlos discrepa): capas de referencia con color propio (sin
íconos del KMZ); sin previsualización de mapa en el admin (se verifica en `/proyectos`); `coordenadas`
siguen obligatorias; Esri legacy como satelital por defecto con fallback y proveedor editable; el
bloque KMZ detrás del flag `mapaAvanzado`.

---

## Anexo A. Evidencia del SEA
- `https://sig.sea.gob.cl/mapadeproyectos/` (config.xml, Map.js, Filter.js, index): ArcGIS JS 3.25;
  `arcgisv11.sea.gob.cl/.../EdicionPuntoRepresentativo/MapServer/0`; `PHP/file.php?type=kmz`.
- `https://sig.sea.gob.cl/analisisTerritorialExterno/` (EvaluacionPorArchivo.js, Map.js,
  ResultadoEvaluacion.js): ingestión vía `KMLLayer(url)`, GeoJSON vía `FileReader`, exportación KML a
  mano.
- `https://sig.sea.gob.cl/mapaLineasBaseEIA/`: polígono + CSV/KMZ/XLS.
- KMZ real `data_export_2026-08-22.kmz` → `tests/fixtures/geo/sea_mapadeproyectos_2026-08-22.kmz`.
- REST: 29.352 proyectos (`MODIFICADO=1`), 1.049 en `REGION='IX'`, 19 con "hidrógeno/H2V".

## Anexo B. Cambios v1 → v2 (origen: revisión adversarial 2026-08-21)
| Cambio | Origen |
|---|---|
| Rutas con segmentos completos (`[id]/kmz`, `kmz`, `kml`) | hallazgos 1, 2, 7 (bloqueante) |
| Saneo por lista blanca + texto plano; popups sin HTML crudo | 3 (bloqueante) |
| `access` explícito en `capas-geo` + prueba 403 | 4 (bloqueante) |
| Encoding por sniff de bytes, no por prólogo; fixture real | 5, 20 |
| NetworkLink completo (href absoluto, 3600 s, never, Content-Type) | 6 |
| URLs absolutas en el balloon; partición `]]>`; `enlaceSeguro` compartido | 8, 21 |
| `APIError` público en español; sin `mimeTypes`; try/catch total | 9, 27 |
| `etapas[]` y `textosKmz` como fuente única; inventario ampliado; `defaults/proyectos.ts` nuevo con retrofit | 10, completitud |
| GeoJSON diferido por endpoint cacheado; `defaultPopulate`; presupuesto de peso; criterio 8 | 11, 14, principio rector |
| Eliminado "publicado"; `limit` explícito; coordenadas siguen requeridas | 12, 15, 17, 19 |
| Tope 4 MB en el hook; `clientUploads` prohibido; guardas de fflate en el `filter`; respuesta < 4 MB | 13, 16, 18 |
| Capas de referencia con color propio | 22 |
| Mapeo de polígonos/multigeometrías, `tessellate`, `clampToGround` | 23 |
| Mapas base editables con fallback; riesgo Esri documentado | 24 |
| `useMemo`, efectos separados, control de capas en refs, a11y | 25 |
| Endurecer migración generada; `down` neutral; backup; `migrate:status` | 26, 30 |
| `npm test` en CI; criterio 6 "local"; e2e con patrón del repo | 28, 29 |
| Fixtures reales; contrato togeojson (`skipNullGeometry`, description objeto, versiones); contrato KML (aabbggrr, ícono único, LookAt, StyleMap, BalloonStyle, Folder); `payload:generate`; vitest en node; budgets/rate limit/`functions`; ciclo de vida de la capa (cache Blob, staticDir, edición sin archivo); `geojson` oculto en admin; flag `mapaAvanzado`; bbox como group; tests de esquema | crítico de completitud |
