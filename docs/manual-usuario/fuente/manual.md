---
titulo: Manual de Usuario del Sitio Web H2V Araucanía
subtitulo: Cómo administrar y editar completamente el sitio desde el panel de administración
version: 1.1
fecha: 28 de agosto de 2026
destinatario: Secretaría Regional Ministerial de Energía, Región de La Araucanía
elaborado: Bien Público "Empoderando a los sectores Agroforestal y Productivo con Hidrógeno Verde" (código CORFO 24BP-269085). Beneficiario: CODESSER. Coejecutor: Universidad de Talca.
sitio: https://h2v-araucania.vercel.app
---

# Antes de empezar

## Para quién es este manual y cómo leerlo

Este manual está escrito para las personas de la Secretaría Regional Ministerial (SEREMI) de Energía de La Araucanía que recibirán el sitio web del Bien Público H2V Araucanía y que deberán mantenerlo actualizado: publicar noticias, subir documentos, cambiar textos, actualizar los integrantes de la gobernanza, crear cuentas para nuevos colegas, etc.

No se necesita ningún conocimiento técnico. Si usted sabe usar el correo electrónico y un procesador de texto, puede administrar este sitio. Todo se hace desde el navegador (Chrome, Edge, Firefox o Safari), en una dirección web que llamaremos "el panel".

El manual está organizado por tareas: primero cómo entrar, después cómo está organizado el panel, luego las tareas frecuentes paso a paso (con una captura de pantalla en cada paso importante), después cómo editar los textos de cada página del sitio, y al final la gestión de usuarios, la lista de problemas frecuentes y los anexos de referencia.

A lo largo del texto encontrará cuatro tipos de recuadros:

> 💡 Consejo: una recomendación práctica para hacer mejor la tarea.

> ⚠️ Atención: algo que conviene revisar antes de seguir, o un error frecuente.

> ✅ Resultado: qué debería ver usted cuando el paso salió bien.

> 🔒 Seguridad: una indicación para proteger el sitio y las cuentas.

En las capturas de pantalla, los globos rojos numerados (1, 2, 3...) señalan los elementos que se mencionan en el texto.

## Qué es el sitio y de qué partes se compone

El sitio web H2V Araucanía es la plataforma informativa pública del Programa Estratégico Regional de Hidrógeno Verde de La Araucanía. Tiene dos caras:

- **El sitio público**, que ve cualquier visitante en la dirección del sitio (por ejemplo `https://h2v-araucania.vercel.app`). Muestra la portada, las páginas del programa (Quiénes Somos, Gobernanza), las páginas educativas sobre hidrógeno verde, el mapa de proyectos, los documentos, las noticias, los eventos y el formulario de contacto.
- **El panel de administración**, al que solo entran las personas con cuenta, en la dirección del sitio seguida de `/admin` (por ejemplo `https://h2v-araucania.vercel.app/admin`). Desde el panel se edita todo lo que se ve en el sitio público.

![Portada del sitio público tal como la ve cualquier visitante.](40-web-inicio.png)

La siguiente tabla es el "mapa" que conviene tener a mano: qué se ve en el sitio y dónde se edita en el panel. Se explica en detalle en los capítulos siguientes.

| Lo que se ve en el sitio público | Dónde se edita en el panel |
|---|---|
| Portada: línea superior, título, subtítulo, botones, cifras (KPIs), tarjetas "Explora el Programa", títulos de las secciones | Páginas → **Página de Inicio** |
| Portada: las últimas noticias | Contenido → **Noticias** (aparecen solas las más recientes publicadas) |
| Portada y pie de página: logos de instituciones participantes | Configuración → **Configuración General** → Logos institucionales |
| Quiénes Somos: textos, descripción del Bien Público, instituciones, títulos de las secciones | Páginas → **Quiénes Somos** |
| Quiénes Somos y Gobernanza: las personas del Comité Estratégico, del Comité Consultivo y de la Unidad de Coordinación | Contenido → **Miembros de Gobernanza** |
| Gobernanza: niveles, funciones, diagrama, galería de fotos | Páginas → **Gobernanza** |
| Hidrógeno Verde, Sectores Productivos, Capital Humano, Hoja de Ruta, Marco Regulatorio | Páginas → la página del mismo nombre |
| Mapa de Proyectos: los puntos del mapa | Contenido → **Proyectos** |
| Mapa de Proyectos: título y subtítulo de la página | Páginas → **Mapa de Proyectos** |
| Recursos y Documentación | Contenido → **Documentos** |
| Eventos | Contenido → **Eventos** |
| Noticias | Contenido → **Noticias** |
| Comunidad, Transparencia, Mediateca | Páginas → la página del mismo nombre |
| Contacto: textos, formulario, correo y datos institucionales | Configuración → **Contacto** |
| Pie de página (títulos, derechos) y página "no encontrada" (404) | Configuración → **Configuración General** |
| Política de Privacidad y Accesibilidad | Páginas → **Política de Privacidad** / **Accesibilidad** |
| Nombre del sitio en la pestaña del navegador y en Google | Configuración → **Configuración General** |

## La regla de oro y sus excepciones

La regla de oro del sitio es simple: **si usted lo ve en la web, se cambia en el panel**. Cada página tiene su formulario, cada texto tiene su campo, y cada campo tiene debajo una explicación breve de para qué sirve. Al guardar, el cambio se ve en el sitio en segundos: basta recargar la página del sitio público.

Hay unas pocas cosas que, a propósito, no se editan desde el panel:

- **El diseño**: colores, tipografías, disposición de los elementos y animaciones.
- **El menú de navegación** (Inicio, Programa, Hidrógeno Verde, Proyectos, Recursos, Noticias, Contacto) y la estructura de las páginas.
- **El crédito obligatorio a CORFO** ("Proyecto apoyado por" con el logo de CORFO y del programa Desarrollo Productivo Sostenible), que exige el Manual de Comunicaciones de CORFO y por eso está fijo, para que no pueda borrarse por error.
- **La dirección de correo a la que llegan los mensajes del formulario de contacto** (se configura en el servidor, no en el panel; vea el Anexo D).

Para cualquiera de esas cosas hay que pedir el cambio al soporte técnico (vea el Anexo D, "Ficha técnica de la plataforma").

## Qué necesita para trabajar

- Un computador con un navegador actualizado (Chrome, Edge, Firefox o Safari). El panel también funciona en tablet, pero es más cómodo en pantalla grande.
- Una **cuenta** en el panel: un correo electrónico y una contraseña. La crea una persona con rol Administrador (vea el capítulo "Usuarios, roles y seguridad").
- Conexión a internet.

<<<salto>>>

# Entrar y salir del panel

## Entrar al panel

1. Abra el navegador y escriba la dirección del sitio seguida de `/admin`. Por ejemplo: `https://h2v-araucania.vercel.app/admin`.
2. Escriba su **Correo electrónico** (1) y su **Contraseña** (2).
3. Haga clic en **Iniciar sesión** (3).

![Pantalla de entrada al panel: correo (1), contraseña (2), botón de entrar (3) y enlace para recuperar la contraseña (4).](01-login.png)

> ✅ Resultado: se abre el "Panel de Control", con los grupos Cuentas y acceso, Sistema, Contenido, Configuración, Páginas y Ayuda.

> 💡 Consejo: guarde la dirección del panel en los favoritos del navegador. El navegador también puede recordar la contraseña; úselo solo en un computador institucional y personal, nunca en uno compartido.

## Olvidé mi contraseña

1. En la pantalla de entrada, haga clic en el enlace **¿Olvidaste tu contraseña?** (4 en la figura anterior).
2. Escriba el correo electrónico de su cuenta (1) y haga clic en el botón de enviar (2).
3. Revise su bandeja de entrada (y la carpeta de correo no deseado). Recibirá un mensaje con un enlace para crear una contraseña nueva. El enlace dura un tiempo limitado; si expiró, repita el procedimiento.

![Recuperación de contraseña: correo (1) y botón de enviar (2).](02-olvide-clave.png)

> ℹ️ Nota: el correo de recuperación lo envía el sitio automáticamente. Mientras el programa no tenga su propio dominio verificado, el remitente puede ser una dirección genérica del servicio de correo; revise la carpeta de correo no deseado si no lo ve en un par de minutos.

## Me bloqueé: "demasiados intentos"

Por seguridad, después de **5 intentos fallidos** de contraseña la cuenta se bloquea durante **10 minutos**. No es una falla: espere 10 minutos y vuelva a intentar. Si no recuerda la contraseña, use "¿Olvidaste tu contraseña?". Un Administrador también puede desbloquear la cuenta de inmediato desde Usuarios (botón **Forzar Desbloqueo** en la ficha del usuario).

## Cambiar mi contraseña y cerrar sesión

1. Haga clic en el círculo de la esquina superior derecha (su cuenta) y entre a su perfil, o vaya directamente a la dirección del sitio seguida de `/admin/account`.
2. Haga clic en **Cambiar contraseña** (1), escriba la nueva contraseña dos veces y pulse **Guardar**.
3. Para salir, en el mismo menú de su cuenta elija **Cerrar sesión** (o visite `/admin/logout`).

![Página "Mi cuenta": botón Cambiar contraseña (1). En esta página también puede elegir el idioma del panel y el tema claro u oscuro.](32-mi-cuenta.png)

![Confirmación de que la sesión se cerró correctamente.](33-salir.png)

> 🔒 Seguridad: cierre sesión siempre que use un computador que no sea el suyo. Use contraseñas largas (12 caracteres o más), distintas a las de otros servicios, y no las comparta por correo ni por WhatsApp.

<<<salto>>>

# Conocer el panel

## El Panel de Control

Al entrar se ve el **Panel de Control**: una página con tarjetas agrupadas. Cada tarjeta lleva a una lista (Noticias, Documentos...) o al formulario de una página del sitio (Página de Inicio, Quiénes Somos...). El botón con el símbolo "+" en una tarjeta crea un elemento nuevo directamente.

![Panel de Control con los grupos de tarjetas. Arriba a la izquierda, el botón de menú (1) abre el menú lateral; arriba a la derecha, el círculo de su cuenta (4).](03b-panel-menu-abierto.png)

Los grupos son:

| Grupo | Qué contiene | Quién lo ve |
|---|---|---|
| **Contenido** | Noticias, Documentos, Proyectos, Miembros de Gobernanza, Eventos. Lo que se publica con frecuencia. | Administradores y editores |
| **Páginas** | Un formulario por cada página del sitio: Página de Inicio, Quiénes Somos, Gobernanza, Hidrógeno Verde, Sectores Productivos, Hoja de Ruta, Comunidad, Capital Humano, Marco Regulatorio, Transparencia, Mediateca, Mapa de Proyectos, Política de Privacidad, Accesibilidad. | Administradores y editores |
| **Configuración** | Configuración General (nombre del sitio, pie de página, logos) y Contacto (datos institucionales y formulario). | Solo administradores |
| **Sistema** | Archivos multimedia (todas las imágenes y PDF subidos), Registro de Descargas y Registro de Visualizaciones (estadísticas automáticas, solo lectura). | Administradores y editores |
| **Cuentas y acceso** | Usuarios. | Solo administradores |
| **Ayuda** | Guía de uso: un resumen de este manual dentro del propio panel. | Todos |

## El menú lateral

El menú lateral se abre y se cierra con el botón de tres líneas de la esquina superior izquierda. Tiene los mismos grupos que el Panel de Control; cada grupo se puede plegar o desplegar haciendo clic en su nombre. Es la forma más rápida de moverse por el panel.

![Menú lateral desplegado. Señalados: Noticias (1), Página de Inicio (2), Contacto (3), Usuarios (4) y la Guía de uso (5).](04-menu-lateral.png)

## Dos tipos de cosas: listas y páginas

En el panel hay dos tipos de cosas, y conviene distinguirlas desde el principio:

- **Listas** (en el panel se llaman "colecciones"): Noticias, Documentos, Proyectos, Miembros de Gobernanza, Eventos, Archivos multimedia, Usuarios. Son conjuntos de elementos: usted crea uno nuevo, lo edita o lo elimina. Al entrar se ve una tabla con todos los elementos y el botón **Crear nuevo**.
- **Páginas** (en el panel se llaman "globales"): Página de Inicio, Quiénes Somos, Gobernanza, Contacto, Configuración General, etc. Cada una es un único formulario con los textos de esa página del sitio. No se crean ni se borran: solo se editan y se guardan.

![Lista de Noticias: botón Crear nuevo (1), buscador (2), filas de la tabla (3) y columna de estado (4). Al hacer clic en una fila se abre la noticia para editarla.](05-noticias-lista.png)

## Anatomía de un formulario

Todos los formularios del panel se parecen. Tomemos como ejemplo el formulario de una noticia nueva:

![Formulario de una noticia nueva. Campos principales (1 a 4), barra lateral (5 a 7) y botón Publicar cambios (8).](06-noticia-crear.png)

- **Título del formulario y descripción**: arriba, el nombre de lo que está editando y una frase que explica para qué sirve.
- **Barra de estado**: muestra si el elemento está en **Borrador** o **Publicado**, cuándo se modificó por última vez, y a la derecha el botón principal (**Publicar cambios** o **Guardar**, según el caso) y un botón de tres puntos con acciones adicionales (Duplicar, Eliminar).
- **Campos principales** (columna izquierda): los textos, el contenido, las imágenes.
- **Barra lateral** (columna derecha): los datos de clasificación, como la URL amigable, la fecha o la categoría.
- **Asterisco rojo** junto al nombre de un campo: el campo es obligatorio. Si falta, el panel no deja guardar y marca el campo en rojo.
- **Texto gris bajo cada campo**: la explicación de qué escribir. Léala siempre antes de llenar el campo; ahí están los ejemplos y los límites de largo.
- **Pestañas Editar / Versiones / API** (arriba a la derecha, en las noticias y eventos): "Versiones" guarda el historial de cada guardado y permite volver atrás.

## Borrador, publicado y versiones

Las **Noticias** y los **Eventos** tienen dos estados:

- **Borrador**: está guardado en el panel pero **no se ve en el sitio público**. Sirve para preparar una noticia con calma o terminarla otro día.
- **Publicado**: se ve en el sitio público.

Mientras usted escribe una noticia o un evento, el panel **guarda el borrador automáticamente** cada pocos segundos (por eso no hay un botón "Guardar borrador": no hace falta). Para que el contenido se vea en el sitio, debe pulsar el botón **Publicar cambios**. Si después modifica una noticia ya publicada, los cambios quedan como borrador hasta que vuelva a pulsar **Publicar cambios**; mientras tanto, el sitio sigue mostrando la última versión publicada.

![Una noticia publicada: pestaña Versiones (1), estado (2), botón Publicar cambios (3), menú de acciones (4), título (5) y contenido (6).](10-noticia-editar.png)

Cada vez que se publica queda una **versión** guardada. Si se equivocó, puede volver a una versión anterior:

1. Abra la noticia o el evento y haga clic en la pestaña **Versiones** (el número indica cuántas hay).
2. Haga clic en la versión a la que quiere volver (la lista muestra fecha y hora).
3. Pulse **Restaurar**. Esa versión pasa a ser la actual (y queda registrada como una versión nueva, así que nunca se pierde nada).

![Pestaña Versiones: cada fila (1) es un guardado con su fecha y hora.](11-versiones.png)

![Una versión abierta: el botón Restaurar (1) la convierte en la versión vigente.](11b-version-restaurar.png)

> ⚠️ Atención: los Documentos, Proyectos, Miembros y las Páginas no tienen borradores: al pulsar **Guardar** el cambio se publica de inmediato en el sitio.

> ⚠️ Atención: **Eliminar es permanente** (no hay papelera). Por eso solo los Administradores pueden eliminar. Antes de eliminar algo, piense si basta con despublicarlo (dejarlo en borrador) o con editarlo.

## Subir imágenes y archivos

Muchos formularios tienen un campo de archivo (por ejemplo, "Imagen de portada" en las noticias, "Archivo para descargar" en los documentos, "Logo" en las instituciones). Todos funcionan igual: el recuadro ofrece **Crear nuevo** (subir un archivo desde su computador), **Elegir de los existentes** (usar un archivo ya subido antes) o arrastrar y soltar el archivo desde el escritorio sobre el recuadro.

Al pulsar **Crear nuevo** se abre el cuadro de subida:

![Cuadro de subida de un archivo: "Selecciona un archivo" abre el explorador de su computador; "Descripción del archivo" es obligatoria; "Guardar" termina la subida.](09-subir-imagen.png)

1. Pulse **Selecciona un archivo** y elija el archivo en su computador (o arrástrelo al recuadro).
2. Escriba la **Descripción del archivo** (obligatoria). Es un texto corto que dice qué es: "Foto seminario Temuco agosto 2026", "Logo Seremi Energía". Sirve para encontrar el archivo después y para las personas que usan lectores de pantalla.
3. Pulse **Guardar**. El archivo queda subido y asociado al campo.

| Tipo de archivo | Formatos aceptados | Recomendaciones |
|---|---|---|
| Imágenes | JPG, PNG, WebP, GIF, SVG | Portada de noticia: 1200 x 630 píxeles. Fotos de personas: cuadradas, mínimo 200 x 200. Fotos de galería: horizontales. |
| Documentos | PDF, Word (.docx), PowerPoint (.pptx), Excel (.xlsx) | Prefiera PDF para lo que el público descarga. |

> 💡 Consejo: antes de subir un archivo, póngale un nombre claro en su computador (por ejemplo `seminario-temuco-2026.pdf`). Las imágenes muy pesadas (más de 5 MB) hacen lenta la página: reduzca el tamaño antes de subirlas.

Todos los archivos subidos quedan también en **Sistema → Archivos multimedia**, donde se pueden buscar y reutilizar (vea "Archivos multimedia" en el capítulo de tareas).

## El editor de texto

El contenido de las noticias, la descripción de los eventos y algunos textos largos de las páginas se escriben en un editor de texto enriquecido, parecido a un procesador de texto sencillo. Funciona así:

- **Escriba** directamente donde dice "Comience a escribir, o presione '/' para comandos".
- **Para dar formato** (negrita, cursiva, subrayado, enlace, alineación), **seleccione el texto con el ratón**: aparece una barra flotante con los botones.
- **Para insertar un elemento** (un título, una lista, una cita, una imagen), escriba el símbolo **/** al comienzo de una línea vacía, o pulse el botón **+** que aparece al lado izquierdo de la línea: se abre un menú con las opciones; elija una.

![Barra flotante que aparece al seleccionar texto (1): el primer desplegable (2) convierte el párrafo en título; siguen alineación, sangría, negrita, cursiva, subrayado, tachado, subíndice, superíndice, código y enlace.](07-editor-barra.png)

![Menú de comandos que aparece al escribir "/" en una línea vacía: títulos, listas (con viñetas, numeradas, de comprobación), cita, enlaces y subida de imagen.](08-editor-slash.png)

Acciones más comunes:

| Quiero... | Cómo |
|---|---|
| Poner negrita o cursiva | Seleccionar el texto y pulsar **B** o **I** en la barra flotante |
| Poner un subtítulo dentro del texto | Escribir "/" y elegir **Título 2** (o seleccionar el texto y usar el primer desplegable de la barra flotante) |
| Hacer una lista | Escribir "/" y elegir **Lista con viñetas** o **Lista numerada** |
| Poner un enlace a otra página web | Seleccionar el texto y pulsar el icono de enlace (el último de la barra); pegar la dirección web completa, con `https://` |
| Insertar una imagen dentro del texto | Escribir "/" y elegir la opción de subir/insertar imagen; subir o elegir una existente |
| Deshacer | Ctrl + Z (Cmd + Z en Mac) |

> 💡 Consejo: si pega texto desde Word, el editor conserva párrafos, negritas y listas, pero no colores ni tipografías (a propósito: el sitio aplica su propio diseño).

<<<salto>>>

# Tareas frecuentes, paso a paso

## Publicar una noticia

Las noticias aparecen en la sección **Noticias** del sitio y las más recientes se muestran también en la portada.

1. En el menú lateral, haga clic en **Noticias** (grupo Contenido).
2. Pulse **Crear nuevo** (arriba a la derecha de la lista). Se abre el formulario vacío, que ya está en estado Borrador y se guarda solo.
3. Complete los campos (vea la figura del formulario en el capítulo anterior):

| Campo | Qué escribir | Obligatorio |
|---|---|---|
| **Título de la noticia** | El titular que verán los visitantes. Máximo 120 caracteres. Ejemplo: "Seminario regional de hidrógeno verde reúne a más de 120 asistentes en Temuco". | Sí |
| **Resumen breve** | Una o dos oraciones que aparecen en el listado de noticias. Máximo 300 caracteres. | Sí |
| **Contenido completo** | El texto completo. Use el editor: párrafos, subtítulos, negritas, listas, enlaces e imágenes. | Sí |
| **Imagen de portada** | Una imagen JPG o PNG (recomendado 1200 x 630 píxeles). Aparece en el listado y arriba de la noticia. | Sí |
| **URL amigable** (barra lateral) | El identificador que aparece en la dirección web de la noticia. Solo letras minúsculas, números y guiones, sin espacios ni tildes. Ejemplo: `seminario-regional-h2v-temuco-2026`. Debe ser único. | Sí |
| **Fecha de publicación** (barra lateral) | La fecha que se mostrará en la noticia. Elíjala en el calendario. | Sí |
| **Categoría** (barra lateral) | Seminario, Taller, Gobernanza, Acuerdo, Proyecto o General. Sirve para filtrar. | No |

4. Pulse **Publicar cambios**.

> ✅ Resultado: la barra de estado cambia a "Publicado". Abra el sitio público, entre a Noticias y recargue: la noticia aparece primera. En la portada aparece entre las últimas noticias.

![Así se ve la sección Noticias del sitio público.](43-web-noticias.png)

![Así se ve una noticia abierta: imagen de portada, fecha, categoría y contenido.](44-web-noticia-detalle.png)

> ⚠️ Atención: si la noticia no aparece en el sitio, casi siempre es porque quedó en **Borrador**: ábrala y pulse **Publicar cambios**. Si el panel marca en rojo la URL amigable con un mensaje de valor duplicado, cambie el texto (ya existe otra noticia con esa URL).

## Editar, despublicar o eliminar una noticia

- **Editar**: en la lista de Noticias haga clic en el título, modifique lo que necesite y pulse **Publicar cambios**. Hasta que lo pulse, el sitio sigue mostrando la versión anterior.
- **Despublicar** (que deje de verse sin borrarla): abra la noticia, pulse el botón de tres puntos junto a "Publicar cambios" y elija la opción de **despublicar** (o restaure una versión en borrador). La noticia queda en el panel como borrador.
- **Eliminar** (solo Administradores): abra la noticia, botón de tres puntos, **Eliminar**, y confirme. Es permanente.
- **Duplicar**: el mismo menú tiene **Duplicar**, útil para crear una noticia parecida a otra.

## Crear un evento

Los eventos aparecen en **Recursos → Eventos** del sitio. Funcionan igual que las noticias (borrador automático y botón Publicar cambios).

1. Menú lateral → **Eventos** → **Crear nuevo**.
2. Complete:

| Campo | Qué escribir | Obligatorio |
|---|---|---|
| **Nombre del evento** | Ejemplo: "Taller de capacitación: H2V para el sector forestal". Máximo 120 caracteres. | Sí |
| **Descripción** | Programa, expositores, objetivos, público. Use el editor de texto. | Sí |
| **Fecha de inicio** (barra lateral) | Día en que comienza. | Sí |
| **Fecha de término** (barra lateral) | Solo si dura más de un día. | No |
| **Lugar** | Dirección física u "Online vía Zoom". Máximo 100 caracteres. | Sí |
| **Tipo de evento** (barra lateral) | Seminario, Taller, Feria, Reunión, Capacitación u Otro. | No |
| **Imagen o afiche** | Imagen promocional. | No |
| **Enlace de inscripción** | Dirección web del formulario de inscripción (Google Forms, Eventbrite...). | No |

3. Pulse **Publicar cambios**.

![Formulario de un evento nuevo: nombre (1), descripción (2), fechas (3 y 4), lugar (5) y Publicar cambios (6).](15-evento-crear.png)

![Así se ve la sección Eventos del sitio público.](48-web-eventos.png)

## Subir un documento

Los documentos aparecen en **Recursos → Documentos** del sitio, con filtros por tipo y año. Los visitantes registrados pueden descargarlos y cada descarga queda contada.

1. Menú lateral → **Documentos** → **Crear nuevo**.
2. Complete:

| Campo | Qué escribir | Obligatorio |
|---|---|---|
| **Título del documento** | Nombre descriptivo. Máximo 120 caracteres. | Sí |
| **Descripción** | Dos o tres oraciones sobre el contenido. Máximo 400 caracteres (se muestra completa en la tarjeta del sitio). | Sí |
| **Archivo para descargar** | El PDF o Word que los visitantes descargarán. | Sí |
| **Imagen de portada** | Miniatura del documento (por ejemplo, la portada del PDF como imagen). Si no sube una, se muestra un icono genérico. | No |
| **Tipo de documento** (barra lateral) | Técnico, Difusión, Regulatorio o Capacitación. | Sí |
| **Año** (barra lateral) | Año del documento. | Sí |
| **Descargas** (barra lateral) | Contador automático. **No lo modifique.** | Automático |

3. Pulse **Guardar**. El documento queda visible de inmediato.

![Formulario de un documento nuevo: título (1), descripción (2), archivo (3), portada (4), tipo (5), año (6) y Guardar (7).](12-documento-crear.png)

![Lista de documentos en el panel: Crear nuevo (1) y filas existentes (2).](12b-documentos-lista.png)

![Así se ve la sección Recursos y Documentación del sitio público.](45-web-documentos.png)

## Agregar un proyecto al mapa

El **Mapa de Proyectos** del sitio muestra un punto por cada proyecto de hidrógeno verde, con un globo de información al hacer clic.

1. Menú lateral → **Proyectos** → **Crear nuevo**.
2. Complete:

| Campo | Qué escribir | Obligatorio |
|---|---|---|
| **Nombre del proyecto** | Ejemplo: "Planta piloto H2V Temuco". Máximo 100 caracteres. | Sí |
| **Descripción** | Dos a cuatro oraciones; aparece en el globo del mapa. Máximo 400 caracteres. | Sí |
| **Empresa o entidad** | Responsable del proyecto. Máximo 80 caracteres. | Sí |
| **Coordenadas geográficas: Latitud y Longitud** | La ubicación del punto (vea cómo obtenerlas más abajo). | Sí |
| **Etapa actual** (barra lateral) | Planificación, Pilotaje, Desarrollo u Operación (cambia el color del punto). | Sí |
| **Ubicación** (barra lateral) | Araucanía o Nacional (otra región). | Sí |
| **Capacidad (MW)** y **Producción (ton/año)** (barra lateral) | Si se conocen. | No |
| **Imagen del proyecto** | Foto o render; aparece en el globo del mapa. | No |
| **Enlace externo** | Dirección web del proyecto o empresa (con `https://`); aparece como "Ver sitio del proyecto". | No |

3. Pulse **Guardar**.

![Formulario de un proyecto nuevo: nombre (1), descripción (2), empresa (3), coordenadas (4), etapa (5), ubicación (6), imagen (7), enlace (8) y Guardar (9).](13-proyecto-crear.png)

**Cómo obtener las coordenadas con Google Maps:**

1. Abra `maps.google.com` y busque el lugar del proyecto.
2. Haga **clic derecho** sobre el punto exacto del mapa.
3. El primer renglón del menú muestra dos números, por ejemplo `-38.7359, -72.5904`. Haga clic sobre ellos para copiarlos.
4. El primer número es la **Latitud** y el segundo la **Longitud**. Péguelos en los campos correspondientes.

> ⚠️ Atención: en Chile la latitud y la longitud son siempre números **negativos** (latitud entre -17 y -56; longitud entre -66 y -76). Si el punto aparece en el mar o en otro país, lo más probable es que haya invertido latitud y longitud.

![Así se ve el Mapa de Proyectos del sitio público.](46-web-proyectos.png)

## Dibujar la forma de un proyecto en el mapa (con un archivo KMZ)

Además del punto, un proyecto puede mostrar en el mapa su **forma real**: el polígono del predio, el trazado de una línea, etc. La forma se dibuja subiendo un archivo **KMZ o KML** hecho en Google Earth (el mismo tipo de archivo que usa, por ejemplo, el mapa de proyectos del Servicio de Evaluación Ambiental). Es **totalmente opcional**: si no sube nada, el proyecto se ve igual que siempre, con su marcador de punto.

> ℹ️ Nota: estas funciones vienen **apagadas de fábrica** y el sitio funciona igual que siempre sin ellas. Para encenderlas (o volver a apagarlas) hay que pedirle al equipo informático que active un interruptor en el servidor; el cambio es inmediato y no requiere tocar el sitio (vea el Anexo D). Con el interruptor apagado, las capas no se dibujan y los botones de descarga no aparecen, aunque ya haya capas subidas: no se pierde nada.

**Paso 1. Dibujar la forma en Google Earth** (gratis, en `earth.google.com`, o con el programa Google Earth Pro):

1. Ubique el lugar del proyecto.
2. Use la herramienta de **polígono** (o de ruta, si es un trazado) y dibuje el contorno.
3. Clic derecho sobre lo dibujado → **Guardar lugar como...** → elija el formato **KMZ** (o KML).

**Paso 2. Subir la capa al sitio:**

1. Menú lateral → **Contenido** → **Capas geográficas (KMZ)** → **Crear nuevo**.
2. Complete:

| Campo | Qué escribir | Obligatorio |
|---|---|---|
| **Título de la capa** | Un nombre claro. Ejemplo: "Predio planta Temuco". | Sí |
| **Tipo de capa** | "Geometría de un proyecto" (el caso normal; para el otro tipo, vea el consejo más abajo). | Sí |
| **Color** (barra lateral) | Solo si quiere un color distinto; si lo deja vacío, la forma usa el color de la etapa del proyecto. | No |
| **Archivo** | El .kmz o .kml que guardó desde Google Earth. | Sí |

3. Pulse **Guardar**.

![La capa ya guardada: título (1), tipo (2), el archivo KMZ subido (3), el resultado del procesamiento que completa el sistema (4) y Guardar (5).](13b-capa-kmz.png)

> ✅ Resultado: al guardar, el sistema valida y simplifica el archivo automáticamente. El campo **"Resultado del procesamiento"** dice "Sin observaciones." (o le avisa qué encontró), y se completan solos el número de geometrías, los vértices y el **centroide** (útil para copiarlo como coordenadas del proyecto si aún no las tiene).

> ⚠️ Atención: el archivo puede pesar **hasta 4 MB** (el KMZ de un predio pesa unos pocos KB) y el sitio acepta **hasta 50 capas** en total. Si el archivo viene con algún problema (sin geometrías, mal formado, demasiado grande), el panel se lo explica con un mensaje en español; corrija en Google Earth y vuelva a subirlo.

**Paso 3. Asociar la capa al proyecto:**

1. Menú lateral → **Contenido** → **Proyectos** → abra el proyecto (o créelo como se explicó antes).
2. Al final del formulario, en **"Capa geográfica (KMZ, opcional)"**, elija la capa que subió.
3. Pulse **Guardar**. La forma queda dibujada en el mapa público, con el color de la etapa del proyecto.

En la barra lateral del proyecto, la casilla **"Mostrar también el marcador de punto"** (marcada de fábrica) controla si el punto se muestra encima de la forma; desmárquela solo si prefiere que se vea únicamente el polígono.

![El campo "Capa geográfica (KMZ, opcional)" al final del formulario del proyecto (1).](13c-proyecto-capa.png)

**Qué ve el visitante cuando las funciones están encendidas:** la forma dibujada sobre el mapa y, arriba, los botones **"Descargar todos (KMZ)"** y **"Abrir en Google Earth"** (1), que le permiten llevarse los proyectos y explorarlos en 3D. En el control de capas (2) puede cambiar el mapa base (calles o satélite) y prender las capas de referencia. Todo eso es automático: usted no tiene que hacer nada más.

![El mapa público con la forma del proyecto dibujada, los botones de descarga (1) y el control de capas (2).](46b-web-proyectos-kmz.png)

> 💡 Consejo: si en vez de la forma de UN proyecto quiere una capa de contexto para toda la región (por ejemplo, todos los proyectos del SEIA en La Araucanía exportados como KMZ), súbala con **Tipo de capa = "Capa de referencia (contexto)"** y no la asocie a ningún proyecto. Aparecerá **apagada** en el control de capas del mapa, y cada visitante decide si la prende.

<<<salto>>>

## Actualizar la gobernanza (personas)

Las personas de la gobernanza se administran en **Miembros de Gobernanza** y aparecen automáticamente en las páginas **Quiénes Somos** y **Gobernanza** del sitio, agrupadas en tres instancias:

- **Consejo de Dirección (nivel estratégico)**: es el **Comité Estratégico del Bien Público** (presidido por la SEREMI de Energía, con vicepresidencia de CORFO). Se muestra como tabla con institución, cargo, titular y aporte.
- **Comité Consultivo Técnico Científico**.
- **Unidad de Coordinación y Gestión (nivel operativo)**: el equipo del proyecto. Mientras un cargo no tenga titular, se deja con el nombre "Por definir".

Para agregar una persona:

1. Menú lateral → **Miembros de Gobernanza** → **Crear nuevo**.
2. Complete:

| Campo | Qué escribir | Obligatorio |
|---|---|---|
| **Nombre completo** | Nombre y apellido (o "Por definir" si el cargo está vacante). | Sí |
| **Cargo** | Ejemplo: "Presidente", "Vicepresidenta", "Miembro Titular", "Secretaría Técnica", "Director del proyecto". Máximo 60 caracteres. | Sí |
| **Institución** | La organización que representa. Ejemplo: "Ministerio de Energía — Seremi Araucanía", "CORFO", "CODESSER", "Universidad de Talca". | Sí |
| **Instancia de gobernanza** (barra lateral) | A cuál de las tres instancias pertenece. | Sí |
| **Foto** | Foto de perfil cuadrada (mínimo 200 x 200). | No |
| **Aporte al programa** | Una frase: cómo contribuye. | No |
| **Nombre del suplente** | Si tiene suplente. | No |
| **Orden de aparición** (barra lateral) | Número para ordenar: 1 aparece primero, 2 después, etc. | No |

3. Pulse **Guardar**.

![Formulario de un miembro de gobernanza: nombre (1), cargo (2), institución (3), instancia (4), foto (5), aporte (6), suplente (7), orden (8) y Guardar (9).](14-miembro-crear.png)

Para **cambiar a una persona por otra** (por ejemplo, un nuevo titular en el Comité), no cree una fila nueva: abra la fila de ese cargo, cambie el nombre (y el suplente o la foto si corresponde) y guarde. Así se mantiene el orden de la tabla.

![Así se ve la página Quiénes Somos del sitio, con las instituciones y la tabla del Comité Estratégico.](41-web-quienes-somos.png)

![Así se ve la página Gobernanza del sitio, con los niveles, el equipo del proyecto y el diagrama.](42-web-gobernanza.png)

## Subir fotos de actividades (galería de Gobernanza)

La página Gobernanza tiene una galería "Evidencia de Actividades" (fotos de sesiones del Comité, talleres, visitas).

1. Menú lateral → grupo **Páginas** → **Gobernanza**.
2. Baje hasta **Evidencia de Actividades (galería de fotos)** y pulse **Añadir fila**.
3. Suba la **Foto** (ideal horizontal) y escriba una **Descripción breve** (ejemplo: "Sesión del Comité Estratégico, junio 2026").
4. Repita para cada foto. Puede reordenarlas arrastrando el tirador de puntos de cada fila.
5. Pulse **Guardar**.

## Archivos multimedia

En **Sistema → Archivos multimedia** están todos los archivos subidos al sitio (imágenes, PDF, logos), con su descripción. Desde aquí puede buscar un archivo, ver dónde está, subir archivos nuevos para usarlos después, o reemplazar una imagen.

![Lista de archivos multimedia: Crear nuevo (1), buscador (2) y los archivos (3).](16-media-lista.png)

![Subir un archivo desde Archivos multimedia: zona de subida (1), descripción obligatoria (2) y Guardar (3).](17-media-subir.png)

> ⚠️ Atención: eliminar un archivo que está en uso (por ejemplo, la portada de una noticia) deja esa noticia sin imagen. Por eso solo los Administradores pueden eliminar archivos; antes de hacerlo, compruebe que no se usa.

<<<salto>>>

# Editar los textos de cada página

## Cómo funcionan las Páginas

En el grupo **Páginas** del menú hay un formulario por cada página del sitio. Cada formulario está dividido en secciones con el mismo nombre que las partes de la página pública (Encabezado, Sección Hero, Banda de indicadores...). Tres reglas:

- Lo que usted escribe **reemplaza** el texto estándar del sitio. Lo que deja **vacío** muestra el texto estándar (así nunca queda un hueco).
- Las secciones con varios elementos (cifras, tarjetas, hitos, logos, fotos) son **listas**: tienen un botón **Añadir ...** al final, y cada fila tiene un menú de tres puntos (mover, duplicar, eliminar) y un tirador de puntos para arrastrar y reordenar. Los botones **Contraer Todo / Mostrar Todo** ayudan cuando la lista es larga.
- Al pulsar **Guardar**, el cambio se ve en el sitio de inmediato (estas páginas no tienen borrador).

> 💡 Consejo: abra el sitio público en otra pestaña del navegador. Edite, guarde, recargue la pestaña del sitio y compruebe cómo quedó. Si no le gusta, vuelva a editar y guardar.

## Página de Inicio (la portada)

Menú lateral → **Páginas → Página de Inicio**. Secciones del formulario y a qué corresponden en la portada:

| Sección del formulario | Qué controla en la portada |
|---|---|
| **Sección Hero (banner principal)** | Línea superior (eyebrow) en mayúsculas pequeñas, Título grande, Subtítulo, y los textos de los dos botones (Cta Primario, Cta Secundario). |
| **Banda de indicadores (KPIs)** | Las cifras destacadas bajo el banner (por ejemplo "9 Instituciones", "88.745 t/año Demanda H2V al 2045", "32 Comunas", "2024–2050 Hoja de ruta"). Cada indicador tiene Cifra, Unidad (opcional) y Etiqueta. Se pueden agregar, quitar y reordenar. |
| **Sección "Explora el Programa"** | El kicker (palabra pequeña sobre el título), el título y las **Tarjetas de acceso rápido** (título, descripción y enlace de cada tarjeta). |
| **Sección "Últimas Noticias"** | Kicker, título y texto del enlace "ver todas". (Las noticias en sí vienen de Contenido → Noticias.) |
| **Sección de logos institucionales** | Los títulos "Proyecto apoyado por" e "Instituciones participantes". (Los logos de las instituciones se cambian en Configuración General.) |

![Formulario completo de la Página de Inicio. Al final de cada lista está el botón Añadir (1); el botón Guardar (2) está arriba a la derecha.](20-pagina-inicio.png)

> ⚠️ Atención: los indicadores (KPIs) son cifras oficiales del programa. Antes de cambiarlos, confirme el dato con la Unidad de Coordinación.

## Quiénes Somos

Menú lateral → **Páginas → Quiénes Somos**.

| Sección | Qué controla |
|---|---|
| **Encabezado** | Título y subtítulo del banner azul. |
| **El Bien Público** | Título y texto libre (editor de texto) que describe el proyecto. |
| **Instituciones participantes** | Lista de instituciones con nombre, rol según las bases (por ejemplo CORFO: financiamiento; CODESSER: Beneficiario; Universidad de Talca: Coejecutor; Seremi de Energía: Mandante) y logo opcional. Si no sube logo, el sitio usa el logo oficial que ya tiene guardado para CORFO, CODESSER, UTalca y Seremi. |
| **Título y Descripción del Consejo** | Título y texto de presentación de la tabla del Comité Estratégico. |
| **Título y Descripción del Comité** | Lo mismo para el Comité Consultivo Técnico Científico. |

Las personas de las tablas se editan en Contenido → Miembros de Gobernanza (capítulo anterior).

![Formulario de Quiénes Somos.](21-quienes-somos.png)

## Gobernanza

Menú lateral → **Páginas → Gobernanza**.

| Sección | Qué controla |
|---|---|
| **Encabezado** y **Descripción general** | Banner y párrafo introductorio. |
| **Nivel Estratégico** | Título, descripción, lista de **Funciones** (hasta 8) y periodicidad de reuniones del Consejo. |
| **Nivel Operativo** | Lo mismo para la Unidad de Coordinación y Gestión. |
| **Diagrama "Estructura del Modelo"** | Los textos de las cajas del diagrama (consejo, comité, unidad) y los **Equipos** (cajas inferiores). |
| **Evidencia de Actividades (galería de fotos)** | Las fotos con su descripción breve. |

![Formulario de Gobernanza (vista completa).](22-gobernanza.png)

## Contacto

Menú lateral → **Configuración → Contacto** (solo Administradores). Tiene tres pestañas:

- **Página**: título y bajada del encabezado, títulos de las columnas, etiquetas de los datos (correo, ubicación, teléfono, programa, ejecutores, mandante).
- **Formulario**: etiquetas y textos de ayuda de cada campo del formulario, las **Opciones de asunto** (lista editable), el texto del botón, y los mensajes de éxito y de error.
- **Datos institucionales**: **Email de contacto** (el que se muestra al público; también se actualiza solo en el pie de página, Privacidad y Accesibilidad), **Ubicación**, **Teléfono**, **Beneficiario (entidad ejecutora)**, **Coejecutor**, **Mandante** y **Código Bien Público**.

![Contacto, pestaña Página: las tres pestañas (1) y el botón Guardar (2).](23-contacto-pagina.png)

![Contacto, pestaña Datos institucionales: Email de contacto (1) y Ubicación (2).](23b-contacto-datos.png)

![Así se ve la página Contacto del sitio público.](47-web-contacto.png)

> ⚠️ Atención: el **Email de contacto** de esta pestaña es el que se **muestra** a los visitantes. La dirección a la que **llegan** los mensajes enviados por el formulario se configura en el servidor (variable `CONTACT_EMAIL`); si cambia el correo institucional, pida al soporte técnico que actualice también esa variable (Anexo D).

## Configuración General

Menú lateral → **Configuración → Configuración General** (solo Administradores).

| Campo o sección | Qué controla |
|---|---|
| **Nombre del sitio** | El nombre en la pestaña del navegador y en los resultados de Google. |
| **Descripción SEO** | La frase que Google muestra bajo el nombre del sitio. Máximo 200 caracteres. |
| **Texto del footer** y **Línea del programa (footer)** | Los textos de la primera columna del pie de página. |
| **Título de la columna de navegación / de contacto (footer)**, **Leyenda de apoyo (footer)** | Los títulos pequeños en mayúsculas del pie de página. |
| **Texto de derechos** | La línea "© ... Todos los derechos reservados". |
| **Título, Texto, Botón principal y Botón secundario de la página 404** | La página que ve un visitante cuando escribe una dirección que no existe. |
| **Logos institucionales** | La lista de instituciones participantes (nombre y logo) que se muestra en la portada y en el pie de página. |

![Formulario de Configuración General.](24-sitio-general.png)

## Las demás páginas

Todas se editan igual (Páginas → nombre de la página → Guardar). Resumen de lo que contiene cada una:

| Página | Qué se puede editar |
|---|---|
| **Hidrógeno Verde** | Encabezado; "¿Qué es el H2V?" (texto libre); Proceso de Electrólisis (pasos); Tipos de Electrolizadores (nombre, madurez, costo); Cadena de Valor (ítems con emoji e ícono); Derivados del H2V (aplicación principal); Sección "Explora más" (tarjetas con página de destino). |
| **Sectores Productivos** | Encabezado; lista de Sectores, cada uno con emoji, descripción y sus Oportunidades. |
| **Hoja de Ruta** | Encabezado; Hitos del timeline (Año/Período, título, descripción); Nota al pie. |
| **Capital Humano** | Encabezado; texto introductorio; Perfiles laborales emergentes; Programas de formación del BP; Nota de oportunidad regional. |
| **Marco Regulatorio** | Encabezado; Documentos normativos (nombre, descripción, relevancia para La Araucanía, enlace). |
| **Comunidad** | Encabezado; texto introductorio; Participación en gobernanza; Compromiso con el territorio; Glosario Mapudungún (término y significado). |
| **Transparencia** | Encabezado; texto introductorio; Secciones de transparencia (título y descripción de cada bloque). |
| **Mediateca** | Encabezado; Recursos multimedia (tipo: video, infografía, presentación o documento; título; enlace); mensaje cuando no hay recursos. |
| **Mapa de Proyectos** | Título y subtítulo del encabezado de la página del mapa (los puntos vienen de Contenido → Proyectos). |
| **Política de Privacidad** | Encabezado, fecha de última actualización y texto completo (opcional; si se deja vacío se usa el texto estándar). |
| **Accesibilidad** | Encabezado y texto completo de la declaración (opcional). |

![Formulario de Hidrógeno Verde (vista completa).](26-hidrogeno-verde.png)

![Así se ve la página Hidrógeno Verde del sitio público.](49-web-hidrogeno-verde.png)

![Formulario de Hoja de Ruta, con la lista de hitos.](25-hoja-ruta.png)

![Formulario de Mapa de Proyectos: solo el encabezado de la página del mapa.](28-mapa-proyectos.png)

## La Guía de uso dentro del panel

En **Ayuda → Guía de uso** hay un resumen de este manual, siempre disponible dentro del panel (no se edita; es solo lectura).

![La Guía de uso dentro del panel.](27-guia-admin.png)

<<<salto>>>

# Usuarios, roles y seguridad

## Los tres roles

| Rol | Qué puede hacer | Para quién |
|---|---|---|
| **Administrador (acceso total)** | Todo: crear y editar contenido, editar las Páginas, la Configuración, crear y eliminar usuarios, eliminar contenido y archivos. | La persona responsable del sitio en la SEREMI (y su respaldo). |
| **Editor (puede publicar contenido)** | Crear y editar noticias, documentos, eventos, proyectos, miembros y las Páginas. **No** puede eliminar, **no** ve Usuarios ni Configuración. | Quien publica contenido con frecuencia (comunicaciones). Es el rol recomendado para delegar. |
| **Registrado (puede descargar documentos)** | Solo descargar documentos desde el sitio público. **No entra al panel.** | Visitantes que se registran en el sitio para descargar. |

> 🔒 Seguridad: mantenga **al menos dos** cuentas de Administrador (titular y respaldo) y no más de las necesarias. Dé rol Editor a quien solo publica contenido.

## Crear un usuario

Solo un Administrador puede crear usuarios.

1. Menú lateral → **Usuarios** (grupo Cuentas y acceso) → **Crear nuevo**.
2. Complete **Correo electrónico** (1), **Nueva Contraseña** (2) y **Confirmar Contraseña** (3), **Nombre completo** (4) y, en la barra lateral, el **Rol** (5). **Institución** es opcional.
3. Pulse **Guardar** (6).
4. Comunique a la persona su correo y contraseña por un canal seguro (nunca en el mismo mensaje por correo electrónico sin cifrar) y pídale que la cambie al entrar por primera vez (Mi cuenta → Cambiar contraseña).

![Lista de usuarios: Crear nuevo (1) y las cuentas existentes (2).](30-usuarios-lista.png)

![Formulario de usuario nuevo: correo (1), contraseña (2 y 3), nombre (4), rol (5) y Guardar (6).](31-usuario-crear.png)

**Cambiar el rol, desbloquear o eliminar un usuario**: en la lista de Usuarios haga clic en el correo de la persona; cambie el **Rol** en la barra lateral y guarde; el botón **Forzar Desbloqueo** levanta el bloqueo por intentos fallidos; el menú de tres puntos permite **Eliminar** la cuenta (permanente).

## Contraseñas y bloqueo

- Use contraseñas de **12 caracteres o más**, que mezclen letras, números y símbolos, y que no se usen en otros servicios.
- Tras **5 intentos fallidos** la cuenta se bloquea **10 minutos** (o hasta que un Administrador la desbloquee).
- Si una persona deja la institución, **elimine o cambie el rol de su cuenta el mismo día**.

## Lista de verificación para el traspaso a la SEREMI

Esta lista resume lo que debe hacerse el día en que la SEREMI toma el control del sitio:

1. Un Administrador actual crea las cuentas **Administrador** del titular y del respaldo de la SEREMI (correos institucionales) y un **Editor** para comunicaciones, si corresponde.
2. Cada nueva persona entra, comprueba que ve el Panel de Control completo y **cambia su contraseña**.
3. La SEREMI revisa **Configuración → Contacto → Datos institucionales** (correo, ubicación, teléfono) y pide al soporte técnico actualizar la variable `CONTACT_EMAIL` si el correo cambia.
4. La SEREMI revisa **Configuración → Configuración General** (nombre del sitio, textos del pie de página, logos).
5. Se eliminan o degradan las cuentas de las personas que dejan de administrar el sitio.
6. Se guarda este manual, junto con la ficha técnica (Anexo D), en la carpeta institucional de la SEREMI.
7. Se anota la fecha del traspaso en el control de cambios de este manual (Anexo E).

<<<salto>>>

# Problemas frecuentes

| Problema | Causa probable | Solución |
|---|---|---|
| Publiqué una noticia y no aparece en el sitio | Quedó en **Borrador** | Ábrala y pulse **Publicar cambios**. Luego recargue la página del sitio. |
| Cambié un texto de una Página y no lo veo | No pulsó Guardar, o el navegador muestra una copia antigua | Compruebe que pulsó **Guardar**; recargue el sitio con Ctrl + F5 (Cmd + Shift + R en Mac). |
| Al guardar sale un mensaje rojo "El siguiente campo es inválido" | Falta un campo obligatorio o supera el largo máximo | Busque el campo marcado en rojo (el mensaje lo nombra), corríjalo y vuelva a guardar. |
| "Valor duplicado" en la URL amigable | Ya existe otra noticia con esa URL | Cambie el texto de la URL amigable (por ejemplo, agregue el año). |
| Subí una imagen y no se ve | Formato no aceptado o archivo dañado | Use JPG, PNG o WebP; vuelva a exportar la imagen y súbala de nuevo. |
| El archivo no se sube o tarda mucho | Es muy pesado | Reduzca el tamaño (imágenes: menos de 5 MB; PDF: comprímalo). |
| El punto del proyecto aparece en el mar o en otro país | Latitud y longitud invertidas o sin signo negativo | Revise las coordenadas: en Chile ambas son negativas; la latitud va primero. |
| No puedo entrar: "demasiados intentos" | Bloqueo por 5 intentos fallidos | Espere 10 minutos o pida a un Administrador que use **Forzar Desbloqueo**. |
| No me llega el correo de recuperación de contraseña | Llegó a correo no deseado, o el correo no es el de la cuenta | Revise la carpeta de no deseado; confirme el correo con un Administrador. |
| No veo Usuarios ni Configuración en el menú | Su rol es Editor | Es lo esperado. Pida a un Administrador el cambio. |
| Me equivoqué al editar una noticia o evento | — | Pestaña **Versiones** → elija la versión anterior → **Restaurar**. |
| Borré algo por error | Eliminar es permanente | No se puede deshacer desde el panel. Contacte al soporte técnico: puede recuperarse desde el respaldo de la base de datos. |
| La página del panel se ve en blanco o con un error | Falla temporal o cambio técnico | Recargue la página. Si persiste, anote la dirección y la hora y avise al soporte técnico. |
| Los mensajes del formulario de contacto no llegan | La dirección de destino está en el servidor (`CONTACT_EMAIL`) o el servicio de correo no está activo | Pida al soporte técnico que revise la variable y el servicio de correo (Anexo D). |

<<<salto>>>

# Anexos

## Anexo A. Quiero cambiar... ¿a dónde voy?

| Quiero... | Voy a... |
|---|---|
| Publicar una noticia | Contenido → Noticias → Crear nuevo → Publicar cambios |
| Corregir una noticia publicada | Contenido → Noticias → (la noticia) → editar → Publicar cambios |
| Que una noticia deje de verse | Contenido → Noticias → (la noticia) → menú de tres puntos → despublicar |
| Crear un evento | Contenido → Eventos → Crear nuevo → Publicar cambios |
| Subir un documento para descarga | Contenido → Documentos → Crear nuevo → Guardar |
| Agregar un proyecto al mapa | Contenido → Proyectos → Crear nuevo → Guardar |
| Dibujar la forma (polígono) de un proyecto en el mapa | Contenido → Capas geográficas (KMZ) → Crear nuevo; luego Contenido → Proyectos → (el proyecto) → Capa geográfica |
| Encender o apagar las funciones KMZ del mapa | No se hace desde el panel: lo activa el equipo informático (Anexo D) |
| Cambiar una persona del Comité Estratégico | Contenido → Miembros de Gobernanza → (la fila del cargo) → cambiar nombre → Guardar |
| Poner nombre a un cargo "Por definir" de la Unidad de Coordinación | Contenido → Miembros de Gobernanza → (la fila) → cambiar nombre e institución → Guardar |
| Subir fotos de una sesión o taller | Páginas → Gobernanza → Evidencia de Actividades → Añadir fila |
| Cambiar el título o subtítulo de la portada | Páginas → Página de Inicio → Sección Hero |
| Cambiar una cifra de la portada (KPI) | Páginas → Página de Inicio → Banda de indicadores |
| Cambiar el texto "El Bien Público" | Páginas → Quiénes Somos → El Bien Público |
| Agregar una institución participante (con logo) | Configuración → Configuración General → Logos institucionales (portada y pie de página) y Páginas → Quiénes Somos → Instituciones participantes (página Quiénes Somos) |
| Cambiar el correo o la ubicación de contacto | Configuración → Contacto → Datos institucionales |
| Cambiar las opciones de asunto del formulario | Configuración → Contacto → Formulario → Opciones de asunto |
| Cambiar textos del pie de página | Configuración → Configuración General |
| Cambiar el nombre del sitio (pestaña del navegador) | Configuración → Configuración General → Nombre del sitio |
| Editar la Hoja de Ruta | Páginas → Hoja de Ruta → Hitos del timeline |
| Editar el contenido educativo de H2V | Páginas → Hidrógeno Verde |
| Crear una cuenta para un colega | Cuentas y acceso → Usuarios → Crear nuevo |
| Cambiar mi contraseña | Mi cuenta (círculo superior derecho) → Cambiar contraseña |
| Ver cuántas veces se descargó un documento | Contenido → Documentos → (el documento) → campo Descargas; o Sistema → Registro de Descargas |
| Leer la guía rápida dentro del panel | Ayuda → Guía de uso |

## Anexo B. Formatos y tamaños recomendados

| Elemento | Formato | Tamaño recomendado |
|---|---|---|
| Imagen de portada de noticia | JPG o PNG | 1200 x 630 píxeles, menos de 1 MB |
| Imagen de evento (afiche) | JPG o PNG | Vertical u horizontal, menos de 2 MB |
| Foto de persona (gobernanza) | JPG o PNG | Cuadrada, mínimo 200 x 200 |
| Foto de galería (Gobernanza) | JPG | Horizontal, 1600 píxeles de ancho aprox. |
| Logo de institución | PNG con fondo transparente (o SVG) | Al menos 400 píxeles de ancho |
| Portada de documento | JPG o PNG | 800 x 600 aprox. |
| Documento para descarga | PDF (también Word, PowerPoint, Excel) | Lo más liviano posible; comprima los PDF grandes |
| Capa geográfica de un proyecto | KMZ o KML (guardado desde Google Earth) | Menos de 4 MB; el predio de un proyecto pesa unos pocos KB |
| Imagen dentro del texto de una noticia | JPG o PNG | 1200 píxeles de ancho máximo |

Límites de texto más importantes: título de noticia 120 caracteres; resumen 300; descripción de documento 400; descripción de proyecto 400; URL amigable solo minúsculas, números y guiones.

## Anexo C. Glosario

| Término | Significado |
|---|---|
| **Panel** (o admin) | El área privada del sitio, en `/admin`, desde donde se edita todo. |
| **Sitio público** | Lo que ve cualquier visitante. |
| **Colección** | Una lista de elementos del mismo tipo (noticias, documentos, usuarios...). |
| **Global** (Página) | Un formulario único con los textos de una página del sitio. |
| **Borrador** | Contenido guardado en el panel que no se ve en el sitio. |
| **Publicar** | Hacer visible en el sitio un borrador. |
| **Versión** | Copia guardada de un contenido cada vez que se publica; permite volver atrás. |
| **URL amigable** (slug) | El identificador en la dirección web de una noticia (`/noticias/mi-noticia`). |
| **Campo** | Cada casilla de un formulario. |
| **Barra lateral** | La columna derecha de un formulario, con los datos de clasificación. |
| **Archivo multimedia** (Media) | Cualquier imagen o documento subido al sitio. |
| **Descripción del archivo** (alt) | Texto corto que describe un archivo subido; obligatorio. |
| **Rol** | Nivel de permisos de una cuenta: Administrador, Editor o Registrado. |
| **KPI** | Cifra destacada de la portada (indicador). |
| **Kicker / eyebrow** | Palabra o línea pequeña que va encima de un título. |

## Anexo D. Ficha técnica de la plataforma (para el equipo informático)

Esta ficha resume la información que el equipo informático de la SEREMI necesita conocer. El detalle completo está en el repositorio del proyecto, en el documento `docs/INTERFAZ_ADMIN_TECNICA.md`, y en el estándar `docs/EDITABILIDAD_TOTAL.md`.

| Componente | Qué es | Dónde está |
|---|---|---|
| Sitio web y panel | Aplicación Next.js 16 con el gestor de contenidos Payload CMS 3 (panel en `/admin`). Idioma del panel: español. | Código en el repositorio Git del proyecto (carpeta `h2v-araucania`). |
| Alojamiento (hosting) | Vercel. Cada cambio en la rama principal del repositorio se despliega solo. | Proyecto `h2v-araucania` en Vercel; dirección actual `https://h2v-araucania.vercel.app` (a reemplazar por el dominio institucional cuando se contrate). |
| Base de datos | PostgreSQL administrado (Neon). Contiene todo el contenido editable. | Conexión configurada en Vercel (variable `DATABASE_URI`). |
| Archivos subidos | Vercel Blob (almacenamiento de imágenes y PDF subidos desde el panel). | Conectado al proyecto en Vercel (`BLOB_READ_WRITE_TOKEN`). |
| Correo saliente | Resend: envía la recuperación de contraseña y los mensajes del formulario de contacto. | Variable `RESEND_API_KEY` en Vercel. Pendiente: verificar el dominio institucional en Resend para que el remitente sea del dominio propio. |
| Destino del formulario de contacto | Variable `CONTACT_EMAIL` en Vercel (si no existe, se usa un correo por defecto). **No se edita desde el panel.** | Vercel → Settings → Environment Variables. |
| Actualizaciones del esquema | Migraciones disciplinadas que corren en cada despliegue (`payload migrate` en el comando de build de Vercel). No se hacen cambios manuales en la base de datos. | `src/migrations/` en el repositorio. |
| Pruebas automáticas | Suite e2e (Playwright) que verifica que el panel abre, que los contenidos reales se editan y que los cambios se reflejan en el sitio. | `tests/e2e/` en el repositorio. |
| Respaldo | La base de datos Neon mantiene respaldos y historial; además, un respaldo diario automatizado (`pg_dump`) se guarda fuera de Neon como artefacto de GitHub Actions, con 90 días de retención (cómo restaurar: `scripts/restore-db.md` del repositorio). El contenido también queda versionado en el panel (noticias y eventos). | Consola de Neon y pestaña Actions del repositorio en GitHub. |
| Funciones KMZ del mapa (opcional) | El dibujo de capas KMZ y las descargas para Google Earth vienen **apagados**. Se encienden creando la variable `NEXT_PUBLIC_FEAT_MAPA_PLUS` con valor `true` (efecto en minutos, sin recompilar); se apagan borrándola. Apagadas, el mapa muestra solo los marcadores, como siempre. | Vercel → Settings → Environment Variables. |
| Accesos a las cuentas de servicio | Vercel, Neon, Resend, GitHub y el registrador del dominio. | Deben traspasarse formalmente a la SEREMI (o a quien esta designe) en el acta de traspaso, con cambio de contraseñas. |

Qué no es editable desde el panel (requiere a un desarrollador): el diseño y la estructura de las páginas, el menú de navegación, el crédito obligatorio a CORFO, las variables de entorno (correo de destino, claves de servicios) y el dominio.

## Anexo E. Control de cambios de este manual

| Versión | Fecha | Cambios | Autor |
|---|---|---|---|
| 1.0 | 21 de agosto de 2026 | Primera versión completa, con capturas del panel en producción (versión del sitio de agosto de 2026). | Equipo del Bien Público H2V Araucanía (Universidad de Talca) |
| 1.1 | 28 de agosto de 2026 | Nueva sección "Dibujar la forma de un proyecto en el mapa (con un archivo KMZ)"; anexos A, B y D actualizados (capas KMZ, interruptor de las funciones y respaldo diario automatizado). | Equipo del Bien Público H2V Araucanía (Universidad de Talca) |
