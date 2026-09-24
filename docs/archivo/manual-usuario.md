# Manual de Usuario — Panel de Administracion H2V Araucania

> Guia para administradores y editores del sitio web del Programa de Hidrogeno Verde en La Araucania.
> Bien Publico 24BP-269085 — CORFO

---

## 1. Como Acceder al Panel de Administracion

1. Abre tu navegador (Chrome, Firefox o Safari).
2. Ve a la direccion del sitio seguida de `/admin`. Por ejemplo: `https://h2varaucania.cl/admin`
3. Ingresa tu **email** y **contrasena**.
4. Haz clic en **Iniciar sesion**.

Si no tienes cuenta, solicita al administrador del sistema que te cree una.

---

## 2. Vista General del Panel

Al ingresar veras un menu lateral (sidebar) a la izquierda. Esta organizado en grupos:

### Contenido
Aqui gestionas todo lo que ven los visitantes del sitio:
- **Noticias** — Publicaciones sobre el programa (seminarios, talleres, avances)
- **Documentos** — Archivos para descargar (PDFs, informes, presentaciones)
- **Proyectos** — Proyectos de hidrogeno verde que aparecen en el mapa
- **Miembros de Gobernanza** — Integrantes del Consejo, Comite y Unidad de Coordinacion
- **Eventos** — Seminarios, talleres, ferias y capacitaciones

### Paginas
Aqui editas los textos de cada pagina del sitio:
- Pagina de Inicio
- Quienes Somos
- Gobernanza
- Hidrogeno Verde
- Sectores Productivos
- Hoja de Ruta
- Comunidad
- Capital Humano
- Marco Regulatorio

### Configuracion
Ajustes generales del sitio:
- **Configuracion General** — Nombre del sitio, texto del footer, logos
- **Contacto** — Email, ubicacion, datos institucionales

### Sistema
- **Usuarios** — Gestion de cuentas de usuario
- **Archivos multimedia** — Todas las imagenes y archivos subidos
- **Registro de Descargas** — Historial automatico de descargas de documentos (solo lectura)

### Ayuda
- **Guia de uso** — Instrucciones resumidas dentro del mismo panel

---

## 3. Publicar una Noticia

Las noticias aparecen en la seccion "Noticias" del sitio y las mas recientes se muestran en la pagina de inicio.

### Pasos:

1. En el menu lateral, haz clic en **Noticias**.
2. Haz clic en el boton **Crear nueva** (arriba a la derecha).
3. Completa los siguientes campos:

| Campo | Que escribir | Obligatorio |
|---|---|---|
| **Titulo de la noticia** | El titular que veran los visitantes. Maximo 120 caracteres. Ejemplo: "Exitoso seminario de H2V en Temuco" | Si |
| **URL amigable** (en la barra lateral) | Identificador para la direccion web. Usa solo letras minusculas, numeros y guiones. Ejemplo: `exitoso-seminario-h2v-temuco`. No uses espacios ni tildes. | Si |
| **Resumen breve** | Un resumen de 1-2 oraciones que aparece en el listado de noticias. Maximo 300 caracteres. | Si |
| **Contenido completo** | El texto completo de la noticia. Puedes usar **negritas**, *cursivas*, listas con viñetas, enlaces y agregar imagenes dentro del texto. | Si |
| **Imagen de portada** | Haz clic en el campo y sube una imagen JPG o PNG. Tamano recomendado: 1200x630 pixeles. Esta imagen aparece como portada de la noticia. | Si |
| **Fecha de publicacion** (en la barra lateral) | La fecha que se mostrara en la noticia. Seleccionala del calendario. | Si |
| **Categoria** (en la barra lateral) | Elige una opcion: Seminario, Taller, Gobernanza, Acuerdo, Proyecto o General. Sirve para que los visitantes filtren noticias. | No |
| **Publicada** (en la barra lateral) | **Marca esta casilla** para que la noticia sea visible en el sitio. Si no la marcas, la noticia queda guardada como borrador y solo se ve en el admin. | No (pero necesario para que sea visible) |

4. Haz clic en **Guardar**.

La noticia aparecera en el sitio en segundos.

### Para editar una noticia existente:
1. Ve a **Noticias** en el menu lateral.
2. Haz clic en el titulo de la noticia que quieras editar.
3. Modifica los campos que necesites.
4. Haz clic en **Guardar**.

### Para despublicar una noticia:
1. Abre la noticia.
2. Desmarca la casilla **Publicada** en la barra lateral.
3. Guarda. La noticia dejara de ser visible en el sitio pero no se borra.

---

## 4. Subir un Documento

Los documentos aparecen en la seccion "Recursos y Documentacion" del sitio. Los visitantes registrados pueden descargarlos.

### Pasos:

1. En el menu lateral, haz clic en **Documentos**.
2. Haz clic en **Crear nuevo**.
3. Completa los campos:

| Campo | Que escribir | Obligatorio |
|---|---|---|
| **Titulo del documento** | Nombre descriptivo. Ejemplo: "Estrategia Nacional de Hidrogeno Verde". Maximo 120 caracteres. | Si |
| **Descripcion** | Breve explicacion del contenido (2-3 oraciones). Maximo 400 caracteres. | Si |
| **Archivo para descargar** | Haz clic y sube el archivo PDF o Word que los visitantes podran descargar. | Si |
| **Imagen de portada** | Opcional. Si subes una imagen, se usara como miniatura. Si no, se mostrara un icono generico. | No |
| **Tipo de documento** (en la barra lateral) | Elige: Tecnico, Difusion, Regulatorio o Capacitacion. Los visitantes pueden filtrar por tipo. | Si |
| **Ano** (en la barra lateral) | El ano del documento (numero entre 2024 y 2050). Los visitantes pueden filtrar por ano. | Si |
| **Descargas** (en la barra lateral) | Este campo se actualiza solo. Muestra cuantas veces se ha descargado el documento. **No lo modifiques.** | — (automatico) |

4. Haz clic en **Guardar**.

El documento estara disponible inmediatamente en el sitio.

---

## 5. Agregar un Proyecto al Mapa

Los proyectos aparecen como marcadores en el mapa interactivo de la seccion "Proyectos".

### Pasos:

1. En el menu lateral, haz clic en **Proyectos**.
2. Haz clic en **Crear nuevo**.
3. Completa los campos:

| Campo | Que escribir | Obligatorio |
|---|---|---|
| **Nombre del proyecto** | Ejemplo: "Planta piloto H2V Temuco". Maximo 100 caracteres. | Si |
| **Descripcion** | Descripcion breve (2-4 oraciones). Aparece en el popup del mapa cuando alguien hace clic en el marcador. Maximo 400 caracteres. | Si |
| **Empresa o entidad** | Nombre de la empresa u organizacion responsable. Maximo 80 caracteres. | Si |
| **Etapa actual** (en la barra lateral) | Elige: Planificacion, Pilotaje, Desarrollo u Operacion. | Si |
| **Ubicacion** (en la barra lateral) | Elige: Araucania (si el proyecto esta en la region) o Nacional (si esta en otra region). | Si |
| **Latitud** | Numero negativo. Ejemplo para Temuco: `-38.7359` | Si |
| **Longitud** | Numero negativo. Ejemplo para Temuco: `-72.5904` | Si |
| **Capacidad (MW)** (en la barra lateral) | Capacidad instalada en megawatts, si se conoce. | No |
| **Produccion (ton/ano)** (en la barra lateral) | Produccion estimada en toneladas por ano, si se conoce. | No |
| **Imagen del proyecto** | Foto o render del proyecto. | No |
| **Enlace externo** | URL al sitio web del proyecto o empresa. | No |

### Como obtener las coordenadas:
1. Abre **Google Maps** (maps.google.com).
2. Busca la ubicacion del proyecto.
3. Haz **clic derecho** sobre el punto exacto en el mapa.
4. Aparecera un menu; el primer item muestra los numeros de latitud y longitud (ejemplo: `-38.7359, -72.5904`).
5. Haz clic en esos numeros para copiarlos.
6. Pega la latitud en el campo "Latitud" y la longitud en "Longitud".

4. Haz clic en **Guardar**.

El proyecto aparecera como un punto en el mapa del sitio.

---

## 6. Agregar un Miembro de Gobernanza

Los miembros aparecen en las paginas "Quienes Somos" y "Gobernanza", organizados por instancia.

### Pasos:

1. En el menu lateral, haz clic en **Miembros de Gobernanza**.
2. Haz clic en **Crear nuevo**.
3. Completa los campos:

| Campo | Que escribir | Obligatorio |
|---|---|---|
| **Nombre completo** | Nombre y apellido. Maximo 80 caracteres. | Si |
| **Cargo** | Ejemplo: "Presidente", "Director", "Consejero", "Coordinador Programa". Maximo 60 caracteres. | Si |
| **Institucion** | La organizacion que representa. Ejemplo: "Ministerio de Energia", "CODESSER", "Universidad de Talca". Maximo 80 caracteres. | Si |
| **Instancia de gobernanza** (en la barra lateral) | Elige a que grupo pertenece: | Si |
| | - **Consejo de Direccion** — Nivel estrategico. Toma decisiones principales del programa. | |
| | - **Comite Consultivo Tecnico Cientifico** — Asesoria tecnica y cientifica. | |
| | - **Unidad de Coordinacion y Gestion** — Nivel operativo. Ejecuta el dia a dia del programa. | |
| **Foto** | Foto de perfil. Recomendado: formato cuadrado, minimo 200x200 pixeles. | No |
| **Aporte al programa** | Descripcion breve de como contribuye. Ejemplo: "Vinculacion con el sector y orientacion estrategica". | No |
| **Nombre del suplente** | Si la persona tiene un suplente, escribe su nombre aqui. | No |
| **Orden de aparicion** (en la barra lateral) | Numero para ordenar la lista. El numero 1 aparece primero, el 2 segundo, etc. | No |

4. Haz clic en **Guardar**.

---

## 7. Crear un Evento

Los eventos aparecen en la seccion "Eventos" del sitio.

### Pasos:

1. En el menu lateral, haz clic en **Eventos**.
2. Haz clic en **Crear nuevo**.
3. Completa los campos:

| Campo | Que escribir | Obligatorio |
|---|---|---|
| **Nombre del evento** | Ejemplo: "Seminario Internacional de Hidrogeno Verde". Maximo 120 caracteres. | Si |
| **Descripcion** | Detalle del evento: programa, expositores, objetivos, publico objetivo. Puedes usar negritas, listas y enlaces. | Si |
| **Fecha de inicio** (en la barra lateral) | Dia en que comienza el evento. | Si |
| **Fecha de termino** (en la barra lateral) | Solo si el evento dura mas de un dia. | No |
| **Lugar** | Direccion fisica o "Online via Zoom". Ejemplo: "Hotel Dreams, Temuco". Maximo 100 caracteres. | Si |
| **Tipo de evento** (en la barra lateral) | Elige: Seminario, Taller, Feria, Reunion, Capacitacion u Otro. | No |
| **Imagen o afiche** | Imagen promocional del evento. | No |
| **Enlace de inscripcion** | URL al formulario de inscripcion (Google Forms, Eventbrite, etc.). | No |
| **Publicado** (en la barra lateral) | **Marca esta casilla** para que el evento sea visible en el sitio. | No (pero necesario para que sea visible) |

4. Haz clic en **Guardar**.

---

## 8. Editar el Contenido de las Paginas

Cada pagina del sitio tiene textos que puedes modificar desde el panel. Estos textos se llaman "Globals" y funcionan de manera diferente a las noticias o documentos: no creas varios, sino que editas un unico registro por pagina.

### Pasos:

1. En el menu lateral, busca el grupo **Paginas**.
2. Haz clic en la pagina que quieras editar (por ejemplo, "Pagina de Inicio").
3. Veras los campos editables de esa pagina. Modifica lo que necesites.
4. Haz clic en **Guardar**.

### Que puedes editar en cada pagina:

- **Pagina de Inicio:** Titulo y subtitulo del banner principal, texto de los botones, tarjetas de acceso rapido (puedes agregar hasta 6 tarjetas con titulo, descripcion y enlace).
- **Quienes Somos:** Descripcion del Bien Publico, instituciones participantes.
- **Gobernanza:** Funciones y descripciones de cada nivel de la gobernanza.
- **Hidrogeno Verde:** Contenido educativo sobre que es el H2V, tipos de electrolizadores, derivados.
- **Sectores Productivos:** Sectores de la economia regional y oportunidades con H2V.
- **Hoja de Ruta:** Hitos y fechas del timeline del programa.
- **Comunidad:** Participacion ciudadana, glosario en Mapudungun.
- **Capital Humano:** Perfiles profesionales necesarios y programas de capacitacion.
- **Marco Regulatorio:** Documentos normativos aplicables.

---

## 9. Cambiar la Configuracion del Sitio

### Configuracion General

1. En el menu lateral, bajo **Configuracion**, haz clic en **Configuracion General**.
2. Puedes editar:
   - **Nombre del sitio** — Aparece en la pestana del navegador y en resultados de Google. Default: "H2V Araucania".
   - **Descripcion SEO** — Texto que aparece en Google debajo del nombre del sitio. Maximo 200 caracteres.
   - **Texto del footer** — Texto al pie de todas las paginas.
   - **Linea del programa (footer)** — Segunda linea del footer. Ejemplo: "Programa Desarrollo Productivo Sostenible — CORFO".
   - **Logos institucionales** — Logos de CORFO, CODESSER, UTalca, etc. que aparecen en el footer y la pagina de inicio. Puedes agregar hasta 10. Para cada uno, ingresa el nombre de la institucion y sube el logo.
3. Haz clic en **Guardar**.

### Contacto

1. En el menu lateral, bajo **Configuracion**, haz clic en **Contacto**.
2. Puedes editar:
   - **Email de contacto** — Email publico al que llegan los mensajes del formulario de contacto.
   - **Ubicacion** — Ciudad o direccion que se muestra en la pagina de contacto.
   - **Telefono** — Numero de telefono publico (dejar vacio si no aplica).
   - **Ejecutor principal** — Nombre de CODESSER.
   - **Co-ejecutor** — Nombre de la Universidad de Talca.
   - **Mandante** — Subsecretaria de Energia.
   - **Codigo Bien Publico** — El codigo CORFO (24BP-269085).
3. Haz clic en **Guardar**.

---

## 10. Gestionar Usuarios

Solo los usuarios con rol **Administrador** pueden gestionar otros usuarios.

### Crear un nuevo usuario:

1. En el menu lateral, bajo **Sistema**, haz clic en **Usuarios**.
2. Haz clic en **Crear nuevo**.
3. Completa:
   - **Email** — La direccion de correo del usuario.
   - **Contrasena** — Una contrasena segura.
   - **Nombre completo** — Nombre y apellido.
   - **Rol** (en la barra lateral):
     - **Administrador** — Acceso total. Puede crear usuarios, editar todo y ver el registro de descargas.
     - **Editor** — Puede crear y editar noticias, documentos, eventos y proyectos.
     - **Registrado** — Solo puede descargar documentos en el sitio publico. No tiene acceso al panel admin.
   - **Institucion** (opcional) — La organizacion a la que pertenece.
4. Haz clic en **Guardar**.

### Cambiar el rol de un usuario:
1. Ve a **Usuarios**.
2. Haz clic en el email del usuario.
3. Cambia el campo **Rol** en la barra lateral.
4. Guarda.

---

## 11. Subir Archivos Multimedia

Todos los archivos (imagenes, PDFs, documentos) se guardan en la seccion **Archivos multimedia** bajo el grupo Sistema.

### Formatos aceptados:
- **Imagenes:** JPG, PNG, WebP, GIF, SVG
- **Documentos:** PDF, Word (.docx), PowerPoint (.pptx), Excel (.xlsx)

### Al subir una imagen:
- Se generan automaticamente tres tamanos: miniatura (400x300), tarjeta (768x512) y banner (1920x1080).
- Siempre completa el campo **Descripcion del archivo** (campo "alt"). Ejemplo: "Foto reunion marzo 2026", "Logo CORFO". Esto ayuda a encontrar el archivo despues y mejora la accesibilidad del sitio.

### Tip:
No necesitas ir a "Archivos multimedia" para subir archivos. Cuando creas una noticia, documento o proyecto, puedes subir el archivo directamente desde el campo correspondiente.

---

## 12. Ver el Registro de Descargas

El sistema registra automaticamente cada descarga de documento. Esto es util para los indicadores CORFO.

1. En el menu lateral, bajo **Sistema**, haz clic en **Registro de Descargas**.
2. Veras una tabla con:
   - Que documento fue descargado
   - Que usuario lo descargo (si estaba logueado)
   - Fecha y hora de la descarga

**Nota:** Esta tabla se llena sola. No necesitas crear entradas. Los datos son de solo lectura.

---

## 13. Consejos y Errores Comunes

### Casilla "Publicado/a"
- Las noticias y eventos tienen una casilla llamada **Publicada** o **Publicado** en la barra lateral derecha.
- Si olvidas marcarla, el contenido queda guardado pero **no es visible** en el sitio publico.
- Revisa siempre esta casilla antes de guardar.

### URL amigable (slug) de las noticias
- Usa solo **letras minusculas**, **numeros** y **guiones** (-)
- No uses espacios, tildes, enes ni caracteres especiales
- Ejemplo correcto: `seminario-h2v-temuco-2026`
- Ejemplo incorrecto: `Seminario H2V Temuco 2026!`
- Cada slug debe ser unico. Si ves un error de "valor duplicado", cambia el slug.

### Imagenes
- Solo se aceptan archivos de imagen (JPG, PNG, WebP) y documentos (PDF, Word). No subas archivos .txt.
- Para noticias, el tamano recomendado de imagen es **1200x630 pixeles**.
- Para fotos de miembros de gobernanza, usa formato **cuadrado** (minimo 200x200 pixeles).

### Coordenadas de proyectos
- La latitud para Chile siempre es un **numero negativo** (entre -17 y -56).
- La longitud para Chile siempre es un **numero negativo** (entre -66 y -76).
- Si el marcador aparece en un lugar inesperado, revisa que no hayas invertido latitud y longitud.

### Guardar cambios
- Despues de hacer clic en **Guardar**, los cambios se reflejan en el sitio en segundos.
- Si cometes un error, simplemente abre el elemento, corrige y guarda de nuevo.
- Payload guarda un historial, asi que no hay riesgo de perder informacion.

### Contador de descargas
- El campo "Descargas" en los documentos se actualiza automaticamente.
- **No lo modifiques manualmente**, ya que esto alteraria las estadisticas.

### Orden de miembros de gobernanza
- Usa el campo **Orden de aparicion** para controlar quien aparece primero.
- Los numeros menores aparecen antes. Ejemplo: orden 1 sale antes que orden 5.
- Si dos miembros tienen el mismo numero, el orden puede variar.

### Errores al guardar
- Si ves un mensaje de error rojo, revisa que todos los campos obligatorios esten completos.
- Los campos obligatorios estan marcados con un asterisco (*) o muestran un mensaje de error especifico.
- Si el error persiste, contacta al soporte tecnico.

---

## 14. Resumen de Acciones Rapidas

| Quiero... | Donde ir |
|---|---|
| Publicar una noticia | Noticias > Crear nueva |
| Subir un documento | Documentos > Crear nuevo |
| Agregar un proyecto al mapa | Proyectos > Crear nuevo |
| Agregar un miembro de gobernanza | Miembros de Gobernanza > Crear nuevo |
| Crear un evento | Eventos > Crear nuevo |
| Editar el texto de una pagina | Paginas > (elegir pagina) |
| Cambiar el email de contacto | Configuracion > Contacto |
| Cambiar los logos del footer | Configuracion > Configuracion General |
| Crear un usuario | Sistema > Usuarios > Crear nuevo |
| Ver cuantas descargas tiene un documento | Sistema > Registro de Descargas |
| Ver la guia de ayuda | Ayuda > Guia de uso |

---

## Anexo (2026-07-04): qué se edita dónde — estándar "editabilidad total"

**Regla de oro: si ves un texto en la web, se cambia en el panel** (`/admin`).
Guarda y recarga la página pública: el cambio se ve al instante.

| Quiero cambiar… | Voy a… |
|---|---|
| Textos de la página de Contacto (títulos, formulario, asuntos) | Globals → **Contacto** (pestañas Página / Formulario / Datos institucionales) |
| Portada: título, eyebrow, cifras (KPIs), títulos de secciones | Globals → **Página de Inicio** |
| Pie de página (títulos de columnas, derechos) y textos del error 404 | Globals → **Configuración General** |
| Integrantes del Comité Estratégico / Unidad | Contenido → **Miembros de Gobernanza** |
| Noticias, Documentos, Eventos, Proyectos | Contenido → su colección |

**Perímetro honesto (lo que NO se edita desde el panel, a propósito):**
- El diseño: colores, tipografías, disposición y animaciones.
- El crédito obligatorio a Corfo del pie de página (Manual de Comunicaciones §1.2) — fijo en código para que no pueda borrarse por error.
- Símbolos de interfaz (flechas, iconos) y textos legales de fallback mientras se completa su migración al panel.

Si un texto visible NO aparece en esta tabla, es un pendiente del inventario
(`docs/INVENTARIO_LITERALES.md`) — repórtalo como defecto, no como "así es".
