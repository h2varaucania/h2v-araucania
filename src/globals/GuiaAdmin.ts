import type { GlobalConfig } from 'payload';

export const GuiaAdmin: GlobalConfig = {
  slug: 'guia-admin',
  label: '📋 Guía de uso',
  admin: {
    group: 'Ayuda',
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
   • ✅ IMPORTANTE: Marca la casilla "Publicada" para que aparezca en el sitio
4. Haz clic en "Guardar"
La noticia aparecerá automáticamente en la sección Noticias y en la página de inicio.

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
Los visitantes registrados podrán descargarlo. Cada descarga queda registrada automáticamente.

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
   • ✅ Marca "Publicado" para que sea visible
4. Guardar

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🟢 EDITAR TEXTOS DE LAS PÁGINAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
En el menú lateral, bajo el grupo "Páginas", encontrarás:
• Página de Inicio: Editar el título, subtítulo y tarjetas del hero
• Quiénes Somos: Editar descripción del BP, instituciones
• Gobernanza: Editar funciones, descripciones de cada nivel
• Hidrógeno Verde: Editar contenido educativo, electrolizadores, derivados
• Sectores Productivos: Agregar o editar sectores y oportunidades
• Hoja de Ruta: Agregar o editar hitos del timeline
• Comunidad: Editar participación, glosario Mapudungún
• Capital Humano: Editar perfiles y programas
• Marco Regulatorio: Agregar o editar documentos normativos

En "Configuración":
• Configuración General: Nombre del sitio, texto del footer, logos
• Contacto: Email, ubicación, datos institucionales

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔴 IMPORTANTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Siempre marca "Publicado/a" para que el contenido sea visible
• Las imágenes deben ser JPG o PNG (no se aceptan archivos de texto)
• Los documentos para descarga deben ser PDF o Word
• Después de guardar, el cambio se refleja en el sitio en segundos
• Si cometes un error, simplemente edita y guarda de nuevo

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        `,
      },
    },
  ],
};
