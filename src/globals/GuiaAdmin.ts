import type { GlobalConfig } from 'payload';
import { isAdmin } from '@/lib/access';

export const GuiaAdmin: GlobalConfig = {
  slug: 'guia-admin',
  label: '📋 Guía de uso',
  // La guía la mantiene el administrador; los editores la leen (F8).
  access: { update: isAdmin },
  admin: {
    group: 'Ayuda',
    description: 'Guía paso a paso para administrar el sitio H2V Araucanía: publicar noticias, subir documentos, editar las páginas, gestionar usuarios y resolver problemas comunes.',
  },
  fields: [
    {
      name: 'instrucciones',
      type: 'richText',
      label: 'Instrucciones generales',
      admin: {
        description: 'Esta sección contiene la guía de uso del panel de administración. No necesitas modificarla.',
        readOnly: true,
      },
    },
    // Usamos un campo de texto largo como guía visible
    {
      name: 'guiaCompleta',
      type: 'textarea',
      label: '═══ GUÍA COMPLETA PARA ADMINISTRAR EL SITIO H2V ARAUCANÍA ═══',
      admin: {
        readOnly: true,
        description: `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CÓMO ESTÁ ORGANIZADO ESTE PANEL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
El menú lateral tiene 4 grupos:
• CONTENIDO: lo que publicas seguido (Noticias, Documentos, Proyectos, Miembros, Eventos)
• PÁGINAS: los textos de cada página del sitio (Inicio, Quiénes Somos, Gobernanza, etc.)
• CONFIGURACIÓN: datos institucionales (solo administradores)
• SISTEMA / CUENTAS: archivos subidos y usuarios

Regla de oro: todo campo tiene debajo una explicación breve. Léela antes de llenar.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔵 PASO 1: PUBLICAR UNA NOTICIA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. En el menú lateral, haz clic en "Noticias"
2. Haz clic en el botón "Crear nueva"
3. Completa los campos:
   • Título: El titular de la noticia
   • URL amigable (slug): letras minúsculas y guiones. Ej: "lanzamiento-programa-h2v"
   • Resumen breve: 1-2 oraciones (máx 300 caracteres)
   • Contenido completo: El texto de la noticia. Puedes usar negritas, listas, enlaces
   • Imagen de portada: Haz clic y sube una imagen JPG o PNG
   • Fecha: Selecciona la fecha de la noticia
   • Categoría: Elige una (Seminario, Taller, Gobernanza, etc.)
4. ✅ IMPORTANTE — para que la noticia SE VEA en el sitio, presiona el botón azul
   "Publicar cambios". Si presionas "Guardar borrador", la noticia queda guardada
   SOLO aquí en el admin (útil para terminarla otro día), pero NO aparece en el sitio.
5. ¿Te equivocaste? Abre la noticia → pestaña "Versiones" → elige una versión anterior
   → "Restaurar". Cada guardado deja una copia.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔵 PASO 2: SUBIR UN DOCUMENTO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. En el menú lateral, haz clic en "Documentos"
2. Haz clic en "Crear nuevo"
3. Completa:
   • Título del documento
   • Descripción: 2-3 oraciones sobre el contenido
   • Archivo: Sube el PDF o Word
   • Tipo: Técnico, Difusión, Regulatorio o Capacitación
   • Año: El año del documento
4. Guardar
Los visitantes registrados podrán descargarlo. Cada descarga queda registrada automáticamente
(el contador "descargas" se llena solo: no lo modifiques).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔵 PASO 3: AGREGAR UN PROYECTO AL MAPA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. En el menú lateral, haz clic en "Proyectos"
2. Haz clic en "Crear nuevo"
3. Completa:
   • Nombre del proyecto
   • Descripción breve
   • Empresa responsable
   • Etapa: Planificación, Pilotaje, Desarrollo u Operación
   • Ubicación: Araucanía o Nacional
   • Coordenadas: Ve a Google Maps, haz clic derecho en la ubicación,
     copia la latitud y longitud. Ej: Temuco = Lat -38.7359, Lng -72.5904
   • Capacidad y producción (si los conoces)
4. Guardar
El proyecto aparecerá como un punto en el mapa interactivo.
(El título de la página del mapa se edita en Páginas → Mapa de Proyectos.)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔵 PASO 3.5: DIBUJAR UN PROYECTO EN EL MAPA CON UN KMZ (OPCIONAL)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Además del punto, un proyecto puede mostrar su forma real (el polígono del predio, un
trazado) subiendo un archivo KMZ o KML hecho en Google Earth. Es OPCIONAL: si no subes
nada, el proyecto se ve igual con su marcador de punto.

A) Dibujar la forma en Google Earth (gratis, en earth.google.com o Google Earth Pro):
   1. Ubica el lugar del proyecto.
   2. Usa la herramienta de polígono (o línea) y dibuja el contorno.
   3. Clic derecho sobre lo dibujado → "Guardar lugar como…" → formato KMZ (o KML).

B) Subir la capa al sitio:
   1. Menú lateral → Contenido → "Capas geográficas (KMZ)" → "Crear nuevo".
   2. Título: un nombre claro (ej: "Predio planta Temuco").
   3. Tipo: "Geometría de un proyecto".
   4. Archivo: sube el .kmz o .kml. Al guardar, el sistema lo valida y te muestra en
      "Resultado del procesamiento" qué encontró (cuántas geometrías, avisos). Si el
      archivo tiene un problema, verás un mensaje en español explicando qué corregir.
   5. Guardar.

C) Asociarla al proyecto:
   1. Menú lateral → Contenido → Proyectos → abre el proyecto (o créalo).
   2. En "Capa geográfica (KMZ)", elige la capa que subiste.
   3. Guardar. La forma aparecerá dibujada en el mapa, con el color de la etapa.

Notas:
• Límites: máximo 4 MB por archivo y 50 capas en total. Un KMZ de predio pesa unos pocos KB.
• "Capa de referencia (contexto)": si en vez de un proyecto quieres una capa de fondo
  (por ejemplo, todos los proyectos SEIA de la región), súbela con Tipo = "referencia".
  Aparecerá apagada en el mapa, dentro del control de capas (ícono arriba a la derecha),
  y el visitante la prende si quiere.
• Los visitantes pueden descargar los proyectos como KMZ desde la página del mapa
  ("Descargar todos (KMZ)" / "Abrir en Google Earth"). No tienes que hacer nada para eso.
• Verifica el resultado abriendo la página pública del mapa (Proyectos).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔵 PASO 4: AGREGAR MIEMBROS DE GOBERNANZA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. En el menú lateral, haz clic en "Miembros de Gobernanza"
2. Haz clic en "Crear nuevo"
3. Completa:
   • Nombre completo
   • Cargo: Ej: "Director", "Consejero", "Coordinador"
   • Institución: Ej: "Ministerio de Energía", "CODESSER"
   • Instancia: Elige a cuál pertenece:
     - Consejo de Dirección (nivel estratégico)
     - Comité Consultivo Técnico Científico
     - Unidad de Coordinación y Gestión (nivel operativo)
   • Foto (opcional): Sube una foto cuadrada
   • Orden: Número para ordenar (1 aparece primero)
4. Guardar
Aparecerá automáticamente en "Quiénes Somos" y "Gobernanza".

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔵 PASO 5: CREAR UN EVENTO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. En el menú lateral, haz clic en "Eventos"
2. Haz clic en "Crear nuevo"
3. Completa:
   • Nombre del evento
   • Descripción detallada
   • Fecha de inicio (y de término si dura varios días)
   • Lugar: dirección física o "Online vía Zoom"
   • Tipo: Seminario, Taller, Feria, etc.
   • Enlace de inscripción (opcional): URL a formulario de registro
4. ✅ Presiona "Publicar cambios" para que el evento sea visible
   ("Guardar borrador" lo deja solo en el admin).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔵 PASO 6: SUBIR FOTOS DE ACTIVIDADES (página Gobernanza)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Menú lateral → grupo Páginas → "Gobernanza"
2. Baja hasta "Evidencia de Actividades (galería de fotos)"
3. "Añadir fila" → sube la foto (ideal horizontal) → escribe una descripción breve
   Ej: "Taller con sector forestal, mayo 2026"
4. Guardar
Mientras no subas fotos, la página muestra "Foto próximamente".
En la misma página puedes editar los textos del diagrama "Estructura del Modelo".

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🟢 EDITAR TEXTOS DE LAS PÁGINAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
En el menú lateral, bajo el grupo "Páginas", encontrarás una entrada por página del sitio:
• Página de Inicio: título, subtítulo y tarjetas de la portada
• Quiénes Somos: descripción del Bien Público, instituciones
• Gobernanza: niveles, funciones, diagrama y galería de fotos
• Hidrógeno Verde: contenido educativo, electrolizadores, derivados y tarjetas "Explora más"
• Sectores Productivos: sectores y oportunidades
• Hoja de Ruta: hitos del timeline
• Comunidad: participación, glosario Mapudungún
• Capital Humano: perfiles y programas
• Marco Regulatorio: documentos normativos
• Transparencia: ítems de transparencia
• Mediateca: recursos audiovisuales
• Mapa de Proyectos: título y subtítulo, y en la pestaña "Mapa y KMZ" las etapas
  (nombre y color), los mapas base y los textos de las descargas KMZ
• Política de Privacidad: fecha de actualización y texto legal
• Accesibilidad: texto de la declaración
En todas: lo que dejes vacío usa el texto estándar del sitio; lo que escribas lo reemplaza.

En "Configuración" (solo administradores):
• Configuración General: nombre del sitio, texto del footer, logos de instituciones participantes
• Contacto: email público, ubicación, ejecutores, mandante y código del Bien Público.
  El email que se cambia aquí se actualiza AUTOMÁTICAMENTE en Contacto, el footer,
  Privacidad y Accesibilidad.
Nota: el bloque "Proyecto apoyado por" (CORFO) del sitio es fijo: lo exige el manual de
comunicaciones de Corfo y no se puede quitar desde el panel.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🟡 USUARIOS Y ROLES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Administrador: puede todo (incluido borrar contenido, gestionar usuarios y configuración).
• Editor: puede crear y editar contenido, pero NO puede borrar, NO ve "Usuarios"
  y NO puede tocar la Configuración. Es el rol adecuado para delegar publicaciones.
• Registrado: solo descarga documentos desde el sitio público; no entra a este panel.
Para crear un editor: Usuarios → Crear nuevo → rol "Editor" (solo un administrador puede).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔴 PROBLEMAS COMUNES Y CÓMO SALIR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• "Escribí una noticia y no aparece en el sitio" → seguramente quedó como BORRADOR.
  Ábrela y presiona "Publicar cambios".
• "Me equivoqué al editar" → pestaña "Versiones" del documento → "Restaurar".
• "Borré algo sin querer" → el borrado ES PERMANENTE (por eso solo los administradores
  pueden borrar). Si era importante, se puede recuperar desde el respaldo de la base de
  datos: contacta al soporte técnico.
• "Puse mal la clave varias veces y no puedo entrar" → por seguridad la cuenta se bloquea
  tras 5 intentos. ESPERA 10 MINUTOS y vuelve a intentar. Si olvidaste la clave, usa
  "¿Olvidaste tu contraseña?" en la pantalla de entrada.
• "Subí una imagen y no se ve" → verifica que sea JPG, PNG o WebP (no .txt ni .zip).
• Los cambios publicados se ven en el sitio en segundos: recarga la página del sitio.
  Si no aparecen, revisa que hayas presionado "Publicar cambios" y no "Guardar borrador".

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📎 SOBRE LOS ARCHIVOS (fotos y PDFs)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Imágenes: JPG, PNG o WebP. Documentos: PDF o Word. Mapas: KMZ o KML (ver Paso 3.5).
• Los archivos se guardan en un almacenamiento en la nube y quedan disponibles
  de forma permanente.
• Antes de subir, ponles un nombre claro (ej: "seminario-temuco-2026.pdf").

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        `,
      },
    },
  ],
};
