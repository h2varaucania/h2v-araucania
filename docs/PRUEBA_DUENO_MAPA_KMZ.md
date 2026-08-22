# Prueba del dueño — Mapa de proyectos con KMZ

Guion corto para que **Carlos o Daniel** validen el mapa KMZ end-to-end en Google Earth
(criterio de aceptación 7 de docs/PLAN_MAPA_KMZ.md). Marca cada casilla; anota el
resultado en el PR o en un comentario.

## A. Subir una capa desde el panel (rol admin o editor)
1. [ ] Entra a `/admin` → Contenido → **Capas geográficas (KMZ)** → *Crear nuevo*.
2. [ ] Título: "Predio de prueba". Tipo: "Geometría de un proyecto".
3. [ ] Sube un `.kmz` o `.kml` hecho en Google Earth (polígono, línea o punto).
4. [ ] Al guardar, revisa **"Resultado del procesamiento"**: debe decir qué encontró
       (n.º de geometrías, avisos). Sin pantallas en blanco ni textos en inglés.
5. [ ] Prueba el camino de error: sube un archivo cualquiera que no sea KMZ/KML
       → debe salir un **mensaje en español** explicando el problema.

## B. Asociarla a un proyecto
6. [ ] Contenido → Proyectos → abre uno (o créalo con coordenadas) → campo
       **"Capa geográfica (KMZ)"** → elige la capa → Guardar.

## C. Verla en el sitio público (`/proyectos`)
7. [ ] La **forma** (polígono/línea) aparece dibujada, con el color de la etapa.
8. [ ] El **marcador** del punto sigue visible (si dejaste esa opción).
9. [ ] El **popup** del proyecto abre con sus datos y el enlace "Descargar KMZ".
10. [ ] Cambia el mapa base a **Satélite** (control arriba a la derecha) y confirma que
        la geometría calza sobre la imagen.
11. [ ] Si cargaste una capa de **referencia**, préndela en el control de capas: debe
        cargar y dibujarse solo al activarla.

## D. Abrir en Google Earth (lo esencial de esta prueba)
12. [ ] En `/proyectos`, botón **"Descargar todos (KMZ)"** → se baja `h2v-araucania-proyectos.kmz`.
13. [ ] Ábrelo en **Google Earth Pro** (o earth.google.com → Importar archivo KML):
    - [ ] Las **tildes** se ven bien en nombres y descripciones (no "Ã±", no cuadros).
    - [ ] Cada proyecto está en su **carpeta por etapa**, con su color.
    - [ ] Al abrir, la vista queda **encuadrada en La Araucanía** (no en otro lugar).
    - [ ] El **globo** de un proyecto muestra sus datos y el enlace "Ver en el sitio…"
          **abre el sitio** (no queda muerto).
14. [ ] Botón **"Descargar KMZ"** de un solo proyecto (en su popup o tarjeta) → baja ese
        proyecto y abre igual en Google Earth.

## Resultado
- Fecha: ______  Quién: ______
- ¿Todo OK? ______  Observaciones: ______________________________________________

> Nota: el archivo de prueba (b) para el equipo de desarrollo está versionado en
> `tests/fixtures/geo/google_earth_pro.kmz`. La capa real de "proyectos SEIA de La
> Araucanía" la exporta Daniel desde el visor del SEA (sig.sea.gob.cl) y la sube como
> capa de **referencia** (Paso 3.5 de la Guía de uso en el panel).
