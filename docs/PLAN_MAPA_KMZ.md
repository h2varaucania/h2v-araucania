# Plan: Mapa de proyectos con capas KMZ (compatible con Google Earth)

Estado: **propuesta, pendiente de aprobación de Carlos** (2026-08-21).
Autor del estudio y del plan: Claude (sesión H2V). Referencia estudiada: visores del SEA (sig.sea.gob.cl).

---

## 0. Resumen ejecutivo

El SEA muestra sus proyectos como **un punto representativo por proyecto** sobre un mapa
ArcGIS, con filtros, clusters, popup con ficha y botón al expediente, y permite **descargar el
resultado filtrado como KMZ** para abrirlo en Google Earth. En un segundo visor (Análisis
Territorial) además **acepta KMZ/KML/GeoJSON subidos por el usuario** y los dibuja.

Nuestro sitio ya tiene el 60% de la base: mapa Leaflet con marcadores por proyecto, popup,
filtros por etapa/región y colección `proyectos` en Payload con coordenadas, imagen y enlace.
Lo que falta, y es lo que pide Carlos, es **el ciclo KMZ completo**:

1. El administrador sube un **KMZ/KML por proyecto** (polígono del predio, trazado, puntos) y
   el mapa público lo dibuja encima del marcador.
2. Cualquier visitante **descarga un KMZ** de un proyecto o de todos los proyectos (con los
   mismos datos del popup) y lo abre en **Google Earth** sin errores ni tildes rotas.
3. Opcional: capas de referencia subibles por el admin (p. ej. el KMZ de proyectos SEIA de
   La Araucanía exportado desde el propio visor del SEA) que se prenden y apagan en el mapa.

Todo con las reglas de la casa: texto 100% editable (EDITABILIDAD_TOTAL), migraciones
disciplinadas (cero SQL manual), e2e sobre datos reales, prueba del dueño.

---

## 1. Estudio del SEA: "la forma"

### 1.1 Dónde están los mapas
Portada sea.gob.cl → bloque "Mapas Interactivos" con tres visores en `sig.sea.gob.cl`:

| Visor | URL | Qué hace |
|---|---|---|
| Mapa de Proyectos | `/mapadeproyectos/` | Puntos de los ~29.352 proyectos del SEIA (1.049 en La Araucanía). Filtros, clusters, popup, exportación CSV/XLS/KMZ. |
| Análisis Territorial | `/analisisTerritorialExterno/` | El usuario dibuja punto/línea/polígono, digita coordenadas **o sube un KMZ/KML/GeoJSON**; el visor cruza esa geometría con capas (áreas protegidas, DPA, etc.) y exporta resultados en KML/GeoJSON/XLS/PDF. |
| Líneas de Base | `/mapaLineasBaseEIA/` | Selección por polígono → lista de proyectos dentro → CSV/KMZ/XLS. |

### 1.2 Arquitectura (lo que vimos en el código que sirven)
- **Front**: ArcGIS JS API 3.25 (Mapa de Proyectos) y 3.44 (Análisis Territorial), AngularJS 1.x,
  jQuery, Bootstrap 3, `ClusterFeatureLayer.js` para clusters, `BasemapGallery` (mapa base SEA,
  OSM, Bing aéreo/híbrido), `Measurement` (medir área/distancia), `HomeButton`, `Scalebar`,
  `Bookmarks` (vistas guardadas), `Geocoder`.
- **Datos**: servicio ArcGIS Server `Produccion/EdicionPuntoRepresentativo/MapServer/0`
  (geometría **punto**, consultable por REST con token que emite `generate_arcgis_token.php`).
  Campos: `ID_EXPEDIENTE, NOMBRE_PROYECTO, FORMA_PRESENTACION (EIA/DIA), LETRA_TIPOLOGIA,
  NOMBRE_TIPOLOGIA, REGION (clave romana: IX = Araucanía), COMUNAS, TITULAR,
  ESTADO_EVALUACION, FECHA_PRESENTACION, FECHA_CALIFICACION, INVERSION_US, URL_EXPEDIENTE, X, Y`.
  Paginación de 1.000 registros; filtro inicial `MODIFICADO=1` (puntos validados por el SEA).
- **Configuración** en XML (`config.xml`, `tipologias.xml`, `bookmarks.xml`): textos, disclaimers,
  servicios, regiones, límites (p. ej. `ManejoKMZ maxObjetosProceso=50`).

### 1.3 UI (la forma visible)
- Barra superior: logo, título, **Medir Área / Medir Distancia**, extent anterior/inicio/siguiente, marcadores.
- Panel izquierdo oscuro: disclaimer legal, toggles **Mostrar EIA / Mostrar DIA** (íconos), toggles por
  **estado** con banderas de color (verde aprobado, amarilla en calificación, roja rechazado, blanca otros),
  casilla "Filtrar por área de visualización", paginación, y tres botones: *Opciones de Búsqueda*,
  *Listado y Filtros Avanzados*, *Selección de Proyectos por Polígono*.
- Panel flotante "Lista Proyectos": chips de filtro (Nombre, Tipología DS95/DS40, Fecha presentación,
  Fecha cierre, Estados, Región) + tabla paginada + botones **CSV / imprimir / XLS / KMZ**.
- Mapa: galería de mapas base arriba a la derecha, panel "Capas Base" abajo a la derecha, escala,
  zoom deslizante, disclaimer en el pie.
- **Popup** (InfoTemplate): título = estado con bandera; cuerpo = nombre, región, comunas, fecha de
  presentación, fecha de cierre, tipología, titular, inversión, coordenadas, lista de "Documentos
  Línea Base" (se cargan por AJAX desde e-SEIA) y botón verde **"Abrir Expediente"**.
- Modal de bienvenida obligatorio que pide el perfil del usuario (titular, consultor, ciudadano, …).

### 1.4 Cómo exportan el KMZ
Formulario vacío que hace `POST PHP/file.php?type=kmz&page=N`; el servidor (PHP, sesión) genera el
archivo con la última consulta. Lo descargamos y lo abrimos: `data_export_2026-08-22.kmz` =
`doc.kml` + `imgs/eia_1..4.png` + `imgs/dia_1..4.png` (íconos **embebidos dentro del KMZ**, un
`<Style>` por forma × estado con `IconStyle scale 0.5` + `hotSpot`, un `<Schema>` con `SimpleField`
por atributo y Placemarks con `SchemaData`; un Document por página de 1.000).

**Errores del propio SEA que NOSOTROS debemos evitar** (sacados de su KMZ real):
1. Declaran `encoding="utf-8"` pero escriben bytes **Latin-1** ("p\xE1gina"): los parsers XML
   estrictos rechazan el archivo y Google Earth muestra tildes rotas.
2. `<kml>` **sin namespace** `xmlns="http://www.opengis.net/kml/2.2"` (no es válido contra el esquema OGC).
3. `<Document id="">` vacío, `displayName` con CDATA doblemente escapado, nombres de campo con fugas
   de .NET (`inversion_us.ToString`, `nuevo_`).

### 1.5 Cómo ingieren KMZ subidos (Análisis Territorial)
El archivo se sube al servidor para obtener una URL y luego `new KMLLayer(url)` (el API de Esri lo
convierte vía su servicio KML en línea, por eso exige URL pública), con un tope de 50 objetos y
mensajes de error configurables; los GeoJSON se leen en el navegador con `FileReader`. La exportación
de resultados construye el KML a mano (`Placemark` + `ExtendedData` + geometría) y lo entrega como
`.kml` con FileSaver. Conclusión para nosotros: **validar y normalizar el KMZ al subirlo** es el
patrón robusto; depender de servicios externos para parsear (como hace Esri) no lo es.

### 1.6 Dato útil encontrado
En el SEIA hay hoy **19 proyectos con "hidrógeno" o "H2V" en el nombre** (H2 Magallanes, INNA,
Volta, HyEx, Quintero, Calama…) y **ninguno en La Araucanía**. La capa SEIA de Araucanía (1.049
puntos) se puede exportar como KMZ desde su visor y subirse a nuestro mapa como capa de referencia
(sección 5.4), sin consumir su token ni su API desde nuestro sitio.

---

## 2. Lo que ya tenemos (y la brecha)

| Pieza | Hoy | Brecha |
|---|---|---|
| Mapa | Leaflet 1.9 + OSM, marcadores por etapa (colores), clusters NO, popup HTML, filtros región/etapa, lista de tarjetas, fitBounds | Sin polígonos/trazados, sin capas, sin descarga KMZ, sin mapa base satelital, sin clusters (innecesarios con pocos proyectos) |
| Colección `proyectos` | nombre, descripción, empresa, etapa, región, coordenadas (lat/lng), capacidadMW, produccionTonAnio, imagen, url | Sin campo de **capa geográfica**; sin geometría derivada; sin bbox/centroide |
| Uploads | Colección `media` (imágenes/PDF/Office) en Vercel Blob | Sin tipos KMZ/KML; sin validación geográfica |
| Textos | Global `pagina-proyectos` (hero) | Faltan textos del bloque KMZ (leyenda, botones, ayuda) editables |
| Pruebas | Playwright e2e (12 specs), vitest | Sin pruebas geo |

---

## 3. /goal

**Objetivo**: que el mapa de proyectos del sitio muestre, además del marcador, la **geometría real
de cada proyecto cargada por el administrador como KMZ/KML**, y que cualquier visitante pueda
**descargar un KMZ válido (por proyecto y global) que abra limpio en Google Earth**, con el mismo
estándar de editabilidad, migraciones y pruebas del resto del sitio.

**Criterios de aceptación (medibles)**
1. El admin sube un `.kmz` o `.kml` en la ficha de un proyecto; si el archivo es inválido, el panel
   muestra un **error en español explicando qué está mal** (no "Something went wrong").
2. Al guardar, `/proyectos` dibuja la geometría (polígonos, líneas, puntos) con los colores de la
   etapa, el popup sigue funcionando y el mapa encuadra la capa.
3. `GET /api/geo/proyectos/[id].kmz` y `GET /api/geo/proyectos.kmz` devuelven un KMZ que:
   - es un ZIP válido con `doc.kml` como primera entrada;
   - es **UTF-8 real y declarado**, `xmlns` KML 2.2, coordenadas `lon,lat[,alt]`;
   - contiene, por proyecto, `name`, `description` (HTML en CDATA con los mismos datos del popup y
     enlace al sitio), `ExtendedData` tipado, estilo por etapa con ícono embebido, y la geometría
     subida (o el punto si no hay capa);
   - **abre sin advertencias en Google Earth Pro y en Google Earth web (importar)**, y el
     round-trip KMZ → togeojson → mismas coordenadas pasa en vitest.
4. `GET /api/geo/proyectos.kml` entrega un **NetworkLink** para que Google Earth refresque solo.
5. Todos los textos nuevos (títulos, leyenda, botones "Abrir en Google Earth", ayuda) son editables
   en `/admin` (global `pagina-proyectos`) con defaults en `src/content/defaults/proyectos.ts`.
6. Suite e2e en verde con 3 specs nuevas (sube KMZ real → se dibuja; descarga KMZ → válido;
   admin muestra error claro ante KMZ corrupto). `npm run build`, `typecheck`, `lint` limpios.
7. Prueba del dueño: Carlos o Daniel suben un KMZ real (p. ej. dibujado en Google Earth) y lo ven
   en el sitio; descargan el KMZ global y lo abren en Google Earth. 2/2.

**Fuera de alcance** (explícito): clustering (no hay volumen), medición de áreas, selección por
polígono, capas WMS externas, edición de geometrías en el admin. Se anotan como "fase futura".

---

## 4. Diseño de la solución

### 4.1 Modelo de datos
- **Nueva colección `capas-geo`** (upload, grupo "Contenido", etiqueta "Capas geográficas (KMZ)"):
  - `upload.mimeTypes`: `application/vnd.google-earth.kmz`, `application/vnd.google-earth.kml+xml`,
    `application/zip`, `application/octet-stream`, `application/xml`, `text/xml`
    (los navegadores **no** mandan un MIME fiable para `.kmz`; la validación real es por contenido).
  - Campos: `titulo` (requerido), `descripcion`, `tipo` (select: `proyecto` | `referencia`),
    `color` (opcional), y campos **derivados de solo lectura** que llena el hook: `geojson` (json),
    `bbox` (4 números), `centroide` (lat/lng), `nFeatures`, `tiposGeometria`, `resumenValidacion`.
  - Almacenamiento: mismo Vercel Blob (agregar `'capas-geo': true` al plugin). Tope **4 MB**
    (límite de body de Vercel Serverless = 4,5 MB; un KMZ de predio pesa KB).
- **`proyectos`**: nuevo campo `capa` (upload → `capas-geo`, opcional) + `mostrarMarcador` (bool,
  default true) + `ajustarVistaACapa` (bool). Se mantiene `coordenadas` como punto representativo
  (igual que el SEA), y si no se ingresa, el hook lo rellena con el centroide de la capa.
- **`pagina-proyectos`** (global): pestaña "Mapa y KMZ" con `tituloCapas`, `textoAyudaKmz`,
  `botonDescargarProyecto`, `botonDescargarTodo`, `leyendaEtapas[]`, `textoLicenciaDatos`,
  `mostrarCapasReferencia` (bool). Defaults en `src/content/defaults/proyectos.ts`.

### 4.2 Pipeline de ingestión (servidor, en `beforeChange` de `capas-geo`)
`req.file.data` (Buffer) → si empieza con `PK` es ZIP: `fflate.unzipSync` con guardas (≤ 30 MB
descomprimido, ≤ 200 entradas, ruta sin `..`), tomar `doc.kml` o el primer `*.kml`; si no es ZIP,
tratar como KML plano. Detectar encoding por el prólogo XML y **transcodificar a UTF-8** (el error del
SEA). `@xmldom/xmldom` → `@tmcw/togeojson.kml()` → GeoJSON. Validar: ≥ 1 feature, ≤ 5.000 features,
coordenadas en rango WGS84 y dentro de una caja amplia de Chile (aviso, no bloqueo), ignorar
`NetworkLink`/`GroundOverlay` (se listan en `resumenValidacion`). Calcular bbox/centroide/conteos
y guardar. Ante error: `throw new ValidationError` con mensaje en español ("El KMZ no contiene
ningún doc.kml", "El KML no tiene geometrías", "Coordenadas fuera de rango: ¿invertiste lat/lng?").

### 4.3 Render público (Leaflet)
- `ProyectosMap` recibe `capa?: { geojson, bbox }` por proyecto y dibuja `L.geoJSON` con estilo por
  etapa (relleno 0,25, borde 2 px, color de `etapaColor`); marcador opcional encima; `fitBounds` a la
  unión de capas + marcadores. Popups también sobre la geometría. Botón en popup y en tarjeta:
  **"Descargar KMZ"** (`/api/geo/proyectos/[id].kmz`) y arriba del mapa **"Descargar todos (KMZ)"**
  + **"Abrir en Google Earth"** (mismo archivo; explicación de cómo importarlo).
- Mapa base adicional **satélite** (Esri World Imagery, uso permitido con atribución) con control
  de capas de Leaflet; capas de referencia (4.4) como overlays conmutables.
- El GeoJSON llega ya normalizado desde el servidor → **sin unzip ni parseo en el navegador**,
  sin librerías extra en el bundle cliente.

### 4.4 Capas de referencia (opcional, misma tubería)
`capas-geo` con `tipo=referencia` se listan en el control de capas (apagadas por defecto). Caso de
uso inmediato: el KMZ de proyectos SEIA de La Araucanía exportado desde el visor del SEA (1.049
puntos) con su propia simbología; otras: red eléctrica, comunas.

### 4.5 Exportación KMZ/KML (route handlers)
`src/app/api/geo/proyectos/[id].kmz/route.ts`, `proyectos.kmz/route.ts`, `proyectos.kml/route.ts`
(NetworkLink con `refreshMode onInterval`). Generador `src/lib/geo/kml.ts` (plantilla a mano,
escapado XML estricto, CDATA para HTML) + `src/lib/geo/kmz.ts` (`fflate.zipSync`, `doc.kml` primero,
íconos PNG por etapa embebidos en `files/`). Cada Placemark: `name`, `description` (CDATA con
nombre, empresa, etapa, región, capacidad, producción, enlace a `/proyectos#id` y enlace externo),
`ExtendedData/Data`, `styleUrl` por etapa, geometría (`MultiGeometry` si hay capa + punto). Cabeceras:
`Content-Type: application/vnd.google-earth.kmz`, `Content-Disposition: attachment; filename="h2v-araucania-<slug>.kmz"`,
`Cache-Control` corto. Respeta `publicado` (solo proyectos publicados).

### 4.6 Checklist "compatible con Google Earth" (se verifica en vitest)
- [ ] ZIP válido, `doc.kml` primera entrada, sin carpetas absolutas.
- [ ] `<?xml version="1.0" encoding="UTF-8"?>` y bytes UTF-8 reales.
- [ ] `<kml xmlns="http://www.opengis.net/kml/2.2">`.
- [ ] Coordenadas `lon,lat,alt` con punto decimal y sin espacios dentro de la tupla.
- [ ] `Polygon` cerrado (primer = último vértice), anillos exteriores antihorarios.
- [ ] Íconos referenciados por ruta relativa existente dentro del KMZ (o https absoluto).
- [ ] `description` en CDATA; ningún `&` sin escapar fuera de CDATA.
- [ ] Tamaño < 5 MB y < 2.000 placemarks por archivo (límite de Google My Maps/Earth web al importar).
- [ ] Round-trip con `@tmcw/togeojson` recupera el mismo número de features y coordenadas (±1e-6).

---

## 5. Fases de implementación (orden, archivos, pruebas)

### F0. Cimientos (½ día)
- `npm i fflate @tmcw/togeojson @xmldom/xmldom` (+ `@types/geojson`). Todas MIT, puras JS, aptas
  para serverless, sin binarios.
- `src/lib/geo/{kmz-leer.ts, kml-escribir.ts, kmz-escribir.ts, validar.ts}` con **vitest**
  (fixtures: KMZ válido de polígono, KML de puntos, KMZ Latin-1, ZIP sin doc.kml, KML sin geometría,
  zip-bomb pequeño).
- Defaults `src/content/defaults/proyectos.ts`.

### F1. Modelo + migraciones (½ día)
- Colección `capas-geo` con hook de ingestión; campos nuevos en `proyectos`; pestaña en
  `pagina-proyectos`; Blob plugin con la nueva colección; revalidación cableada.
- `payload migrate:create` → revisar la migración de esquema (debe ser aditiva: CREATE TABLE/ADD
  COLUMN IF NOT EXISTS como la baseline) + migración de datos con los defaults de textos.
- **Regenerar importMap** (`npm run payload:importmap`, con el token dummy) y validar admin en
  build de producción local (la lección del admin en negro).
- Probar el hook subiendo fixtures por la Local API.

### F2. Mapa público + descargas (1 día)
- `ProyectosMap.tsx`/`Loader`/`page.tsx`: geometrías, control de capas, satélite, botones KMZ,
  textos desde el global.
- Route handlers de KMZ/KML; pruebas vitest de la salida; prueba manual en Google Earth Pro
  (Carlos) y Google Earth web (importar).
- e2e nuevas: `kmz-se-dibuja.spec.ts` (sube fixture por Local API → `/proyectos` tiene `path.leaflet-interactive`
  > 0 y el popup abre), `kmz-descarga.spec.ts` (GET → zip → doc.kml UTF-8 con N placemarks),
  `admin-kmz-error.spec.ts` (subir ZIP sin KML → mensaje en español visible).

### F3. Capas de referencia + pulido (½ día)
- Overlays conmutables, leyenda editable, KMZ SEIA Araucanía como primera capa (lo exporta Daniel o
  Carlos desde el visor del SEA y lo sube; **no** se automatiza contra el token del SEA).
- Guía de administración: sección "Subir un KMZ" (actualizar `docs/Guia_Administracion_H2V_Araucania.pdf`
  y `GuiaAdmin` en el CMS) con la explicación de cómo dibujar un polígono en Google Earth y exportarlo.

### F4. Cierre
- `npm run build` + `typecheck` + `lint` + e2e completa contra build de producción local con la base
  migrada; push; migrate-in-build en Vercel; verificación en prod (admin renderiza, `/proyectos` 200,
  KMZ descarga y abre); prueba del dueño 2/2; memoria e inventario de literales actualizados.

Esfuerzo total estimado: **2,5 a 3 días de trabajo efectivo**, secuencial, sin agentes.

---

## 6. Riesgos y mitigaciones (los gotchas ya pagados en este repo, aplicados)

| Riesgo | Mitigación |
|---|---|
| Admin en negro por importMap desactualizado al tocar plugins/colecciones upload | Regenerar importMap con el plugin Blob ACTIVO; validar con build prod local antes de push |
| Migración envenenada (error dentro de la transacción) | Guardas por SQL ANTES de escribir; nada de try/catch como control de flujo; validar en base vacía y en clon de prod |
| MIME del `.kmz` inconsistente entre navegadores/SO | Lista MIME amplia + validación por contenido en el hook (única verdad) |
| Body > 4,5 MB en Vercel | Tope de 4 MB en `upload.limits.fileSize` de la colección + mensaje claro; documentado en la descripción del campo |
| KML con encoding distinto a UTF-8 (caso SEA) | Detección de prólogo y transcodificación; test con fixture Latin-1 |
| Zip-bomb / rutas maliciosas | Límites de entradas/tamaño; ignorar rutas con `..`; solo se procesan `*.kml` |
| KML con miles de vértices → página lenta | Tope de features; simplificación opcional fuera de alcance; aviso en `resumenValidacion` |
| `revalidatePath` durante render (bug QA #12) | Los hooks nuevos usan los mismos helpers ya corregidos (`revalidaColeccion` con guarda de borrador) |
| Google Earth web rechaza archivos grandes | < 5 MB y < 2.000 placemarks por archivo; si se excede, paginar el KMZ global |
| Textos no editables | Todo literal nuevo pasa por defaults + global + `t()`; se suma al `INVENTARIO_LITERALES.md` |

---

## 7. Decisiones que necesito de Carlos

1. **Alcance**: ¿F0–F2 (KMZ por proyecto + descargas) ahora y F3 (capas de referencia, KMZ SEIA) después, o todo de una vez?
2. **Mapa base satelital**: ¿incluir Esri World Imagery (gratuito con atribución) además de OSM? (El SEA lo usa.)
3. **¿Quién prueba en Google Earth Pro?** Yo puedo generar y validar por software; la apertura real en Google Earth la hace Carlos o Daniel (prueba del dueño).
4. **Capa SEIA Araucanía**: ¿la exporta Daniel desde el visor del SEA como primera capa de referencia?

---

## Anexo A. Evidencia recogida del SEA (para trazabilidad)
- `https://sig.sea.gob.cl/mapadeproyectos/` (config.xml, Map.js, Filter.js, index): ArcGIS JS 3.25, servicio
  `arcgisv11.sea.gob.cl/.../EdicionPuntoRepresentativo/MapServer/0`, `PHP/file.php?type=kmz`.
- `https://sig.sea.gob.cl/analisisTerritorialExterno/` (EvaluacionPorArchivo.js, Map.js, ResultadoEvaluacion.js):
  ingestión KMZ/KML vía `KMLLayer(url)`, GeoJSON vía `FileReader`, exportación KML/GeoJSON a mano.
- `https://sig.sea.gob.cl/mapaLineasBaseEIA/`: selección por polígono + exportación CSV/KMZ/XLS.
- KMZ real descargado `data_export_2026-08-22.kmz` (doc.kml + 8 íconos), analizado en la sección 1.4.
- Consulta REST: 29.352 proyectos (`MODIFICADO=1`), 1.049 en `REGION='IX'`, 19 con "hidrógeno/H2V" en el nombre.
