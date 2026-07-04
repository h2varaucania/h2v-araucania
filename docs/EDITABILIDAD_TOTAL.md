# Editabilidad total: el estándar de administración a mínimo costo

> **Para quién es este documento.** Para la sesión de Claude (o el desarrollador) que
> mantiene h2v-araucania. Es autocontenido: no necesitas ninguna otra conversación.
> **De dónde viene.** Es la doctrina destilada del sitio cvillalobos.org (motor WebPro,
> 2026-07-04), donde este estándar se implementó completo, se rompió en producción de
> todas las maneras posibles el mismo día, y se reparó. Aquí están las reglas, los
> patrones probados y las trampas ya pagadas, calibrados contra el código actual de
> h2v-araucania (diagnóstico del 2026-07-04 más abajo).
> **Mandato de Carlos**: "el administrador debe poder administrar a mínimo costo el
> sitio con todas las opciones flexibles".

---

## 1. La doctrina en cinco reglas

1. **TODO texto visible nace editable; el código solo lleva diseño y estructura.**
   Títulos, bajadas, párrafos, columnas/tarjetas con sus resúmenes, cifras, etiquetas,
   leyendas de figuras, página 404, SEO, textos de formularios. Si el dueño ve una
   palabra en la web, la debe poder cambiar desde el panel. **Un texto cableado en JSX
   es un DEFECTO, no una optimización** — el dueño lo va a querer cambiar justo ese, y
   cada uno que quede es un ticket de soporte perpetuo.
2. **El sitio es cascarón + contenido.** El código define el diseño (layout, colores,
   tipografía, animaciones); el CMS contiene el 100% del contenido. La frontera se
   declara por escrito (ver §7, "perímetro honesto").
3. **Guardar = la web se actualiza sola.** El dueño edita, aprieta Save, y en segundos
   lo ve en la web. Sin pasos intermedios, sin "avísame para republicar".
4. **El panel es "para dummies".** Pestañas con nombres humanos, cada campo con su
   ayuda en español llano, listas reordenables arrastrando, y ninguna opción que el
   dueño no deba tocar. El panel ES el producto, tanto como la web.
5. **"Edición" ≠ "mejora".** Edición = cualquier cambio de contenido (lo hace el dueño
   solo, gratis, para siempre). Mejora = cambio de diseño o estructura (lo hace el
   mantenedor). Esta distinción protege al dueño Y al mantenedor.

**La prueba del dueño (criterio de "hecho"):** elige al azar 10 textos visibles en 10
páginas distintas. El dueño (no técnico) debe poder cambiar los 10 desde el panel sin
ayuda y verlos en la web. Si uno falla, no está hecho.

---

## 2. Diagnóstico de h2v-araucania (2026-07-04)

**Lo que ya está BIEN (consérvenlo, es la base correcta):**
- ✅ 17 globals por página (`PaginaInicio`, `PaginaH2V`, … `SitioGeneral`, `Contacto`,
  `GuiaAdmin`): la arquitectura global-por-página es válida y equivale al patrón
  probado. No hay que rehacerla, hay que **completarla**.
- ✅ `defaultValue` en 16 globals.
- ✅ `@payloadcms/storage-vercel-blob` y `resend` ya en `package.json` (los dos
  servicios que a todo sitio le faltan: imágenes que persisten y reset de clave).
- ✅ Hay migración inicial y `BlockquoteFeature` aparece al menos una vez.

**Lo que falta consolidar (la brecha con el estándar):**
1. ❌ **Texto cableado conviviendo con los globals.** Muestra real: en
   `app/(frontend)/contacto/page.tsx` hay literales como "Escríbenos para consultas,
   colaboraciones o más información.", "Información de contacto", "Envíanos un
   mensaje" — pese a que EXISTE el global `Contacto`. Solo en 2 rutas muestreadas hay
   18+ literales. Ese es el enemigo #1.
2. ❌ **Cero pestañas (`tabs`) en los globals**: el dueño ve listas planas largas.
3. ❌ **`tests/e2e/` está VACÍO**: nada garantiza que el panel abre y funciona
   (ver trampa Lexical #17 en §6 — nos pasó con un documento real en producción).
4. ❌ **SQL a mano contra producción** (`docs/fix_esquema_prod_*.sql`,
   `fix_video_views_prod_*.sql`): señal de que la disciplina de migraciones se rompió.
   Prohibido de aquí en adelante (ver §5.6).
5. ⚠️ **`force-dynamic` en todo el frontend**: funcionalmente cumple la regla 3 (toda
   edición se ve al tiro porque cada visita consulta la base), pero al costo de tocar
   la base de datos EN CADA VISITA: TTFB alto, sin CDN, y factura que crece con el
   tráfico. "Mínimo costo" incluye el costo de operación: la optimización recomendada
   es estático + revalidación al guardar (§5.4). No es urgente; es la mejora de fondo.
6. ⚠️ Sin `vercel.json` con migraciones en el build (relacionado con el punto 4).

---

## 3. Arquitectura de contenido (el patrón probado)

### 3.1 Dónde vive cada cosa
- **Colección** = lista repetible que crece (Noticias, Eventos, Proyectos, Miembros,
  Documentos). Ya las tienen. Campo `order` numérico cuando el orden es editorial.
- **Global por página** = todos los textos de esa página (títulos, bajadas, párrafos,
  tarjetas/columnas como ARRAYS, textos de botones). Ya los tienen; hay que MUDAR ahí
  todo lo que quedó cableado.
- **Global general** (`SitioGeneral`) = marca, menú, pie de página, redes, SEO por
  defecto, textos del 404 y de errores.
- **Las "columnas"/tarjetas** (ej. 3 beneficios con ícono+título+resumen) = campo
  `array` dentro del global de su página, con sus subcampos. El dueño agrega, quita y
  reordena arrastrando. JAMÁS tres pares de campos "col1/col2/col3".
- **Las redes sociales** = array ABIERTO `{label, sigla, href}` en `SitioGeneral`:
  el dueño agrega cualquier red futura sin tocar código.

### 3.2 Única fuente de verdad del contenido inicial
Un módulo por página (o uno central) con el contenido real actual:

```ts
// src/content/defaults/contacto.ts
export const contactoDefaults = {
  titulo: 'Envíanos un mensaje',
  bajada: 'Escríbenos para consultas, colaboraciones o más información.',
  infoTitulo: 'Información de contacto',
  // ...todo el texto hoy cableado en la página
}
```

Ese módulo alimenta TRES cosas (por eso es "única fuente"):
1. `defaultValue` de cada campo del global (el panel nace lleno, nunca vacío);
2. **fallbacks** en los componentes (si un campo viene null, se ve el default, no un
   hueco);
3. el **seed/migración de datos** que rellena el global existente en producción.

### 3.3 Fallbacks en componentes (dos helpers, cero literales)

```ts
const t = (v: string | null | undefined, fb: string) => (v && v.trim() ? v : fb)
const list = <T,>(v: T[] | null | undefined, fb: T[]) => (v && v.length ? v : fb)

// uso: <h1>{t(global?.titulo, d.titulo)}</h1>
// columnas: list(global?.tarjetas, d.tarjetas).map(...)
```

Regla de revisión: **`grep` de literales JSX en `src/app` y `src/components` debe dar
cero** (fuera de símbolos como flechas o siglas técnicas). Comando de auditoría:

```bash
grep -rnoE '>[A-ZÁÉÍÓÚÑa-z][^<>{}]{8,}<' "src/app/(frontend)" src/components \
  | grep -v node_modules   # cada hit es texto cableado que debe mudarse a un global
```

---

## 4. El panel "para dummies" (UX del admin)

- **`tabs` en cada global grande**: agrupar campos por bloque visible de la página
  ("Encabezado", "Beneficios", "Preguntas frecuentes"…), no por tipo de dato. En
  Payload: un campo `{ type: 'tabs', tabs: [{ label, fields }] }` con tabs SIN `name`
  no cambia el schema (solo presentación): se puede aplicar sin migración.
- **`admin.description` en CADA campo y colección**, en español llano y con ejemplo
  ("Se muestra entre paréntesis, ej. 2015–2017"). El manual de usuario nace de aquí.
- Arrays con `labels` singular/plural en español y filas colapsables.
- Lo que el dueño no debe tocar, no se muestra (`admin.hidden`) o vive en un grupo
  "(avanzado)" al final.
- El dashboard de bienvenida (`beforeDashboard`) dice en 5 líneas qué se edita dónde.

---

## 5. Las cinco piezas técnicas que hacen cierto "guardar = web actualizada"

### 5.1 Estático + revalidación al guardar (la optimización de fondo)
El estándar probado: páginas `force-static` + hooks que las regeneran al guardar.
El dueño ve su cambio en segundos y las visitas salen del CDN (rápidas y baratas).

```ts
// src/hooks/revalidatePage.ts
import { revalidatePath } from 'next/cache'
export const revalidateInicio = ({ context }) => {
  if (!context?.disableRevalidate) revalidatePath('/')   // guard para el seed
}
// en el global: hooks: { afterChange: [revalidateInicio] }
```

Cada global/colección revalida SUS rutas (la noticia revalida `/noticias` y su slug).
El guard `disableRevalidate` evita cientos de revalidaciones durante un seed; tras un
seed masivo, un redeploy regenera todo. Migrar página por página (empezar por las de
más tráfico); mientras una ruta siga `force-dynamic`, funciona igual (solo más cara).

### 5.2 Editor richText: features ⊇ contenido
Todo node type que el contenido pueda contener DEBE estar registrado en las features
del campo (`BlockquoteFeature`, `HeadingFeature`, etc.). Si un documento trae un tipo
no registrado, **el panel no puede ni abrirlo** (error Lexical #17: nos pasó en
producción con un ensayo que traía una cita). Tras tocar features o colecciones:
`payload generate:types` **y** `payload generate:importmap` — sin el importMap, el
feature queda declarado pero el panel no carga su componente y el error persiste.

### 5.3 Tests que protegen al dueño (hoy: carpeta vacía)
Mínimo obligatorio, e2e Playwright:
1. **El admin abre documentos REALES con contenido** (no solo pantallas de "create"
   vacías): abrir el primer doc de cada colección con richText y exigir editor visible
   y cero "Something went wrong". Este test es el que caza el Lexical #17.
2. La edición se refleja: cambiar un campo por API local → la ruta pública lo muestra.
3. Las rutas clave responden 200 con contenido real.

```ts
test('un doc real abre en el editor sin reventar', async () => {
  await page.goto('/admin/collections/noticias')
  const rows = page.locator('tbody tr a')
  test.skip((await rows.count()) === 0, 'sin docs seedeados')
  await rows.first().click()
  await expect(page.locator('[data-lexical-editor="true"]').first()).toBeVisible()
  await expect(page.locator('text=Something went wrong')).toHaveCount(0)
})
```

### 5.4 Migraciones disciplinadas (adiós SQL a mano)
Los `fix_*_prod.sql` en `docs/` son la señal de alarma: cada arreglo manual en
producción es un estado no reproducible. Régimen estricto:
- Cambio de schema → `payload migrate:create <nombre>` + **validar aplicándolo a una
  base temporal VACÍA** antes de commitear.
- `vercel.json` para que el build de producción las aplique solo:
  ```json
  { "buildCommand": "DATABASE_URL=\"${DATABASE_URL_UNPOOLED:-$DATABASE_URL}\" npm run payload -- migrate && npm run build" }
  ```
- **Trampa de las migraciones de DATOS**: una migración que usa el local API
  (`payload.updateGlobal(...)`) consulta el schema COMPLETO de la config ACTUAL; si el
  código ya declara campos que una migración posterior recién crea, revienta en una
  base fresca. Regla: cada relleno de datos va INMEDIATAMENTE después de su cambio de
  schema, y el relleno inicial de una instalación nueva lo hace el SEED. Jamás editar
  una migración ya aplicada (si quedó mala, se neutraliza con una no-op).
- Bonus verificado: `updateGlobal` es merge parcial → una migración de datos NO pisa
  lo que el dueño ya editó (solo toca los campos que incluye).

### 5.5 Los dos servicios del dueño autónomo
Ya están en `package.json`; verificar que estén CONFIGURADOS y probados:
- **Resend (email adapter)**: sin él, "olvidé mi clave" no manda correo y el ticket
  más frecuente del mundo cae en el mantenedor. Probar el flujo completo una vez.
- **Vercel Blob (storage)**: sin él, lo que el dueño sube desde el panel se pierde
  (filesystem efímero). Probar: subir imagen → redeploy → la imagen sigue.

---

## 6. Errores ya pagados (que H2V no debe repetir)

| Error (ocurrió de verdad, 2026-07-04) | Vacuna |
|---|---|
| El dueño quiso cambiar su correo de contacto y NO existía el campo (texto cableado) | Regla 1 + auditoría grep de literales + mudanza a globals |
| Tarjetas/"columnas" con texto fijo | Arrays en el global de la página, reordenables |
| Enlace de perfil (ResearchGate) cableado que apuntaba a OTRA persona homónima | Un enlace/dato del dueño se verifica con él o se marca `FALTA:`; JAMÁS se inventa; y queda editable |
| Un ensayo con cita no abría en el panel (Lexical #17) | Features ⊇ node types + `generate:importmap` + test 5.3.1 |
| El test suite del admin nunca lo detectó (solo abría "create" vacíos) | e2e sobre documentos reales |
| Migración de datos reventaba en base fresca (local API + schema posterior) | Regla de emparejamiento de §5.4 |
| Códigos 2FA (`recovery-codes.txt`) sueltos dentro del repo | `.gitignore` con `.env*` y `*recovery-codes*`; higiene pre-push |
| "Guardé y no veo el cambio" (confusión del dueño) | Revalidación al guardar + manual: "guarda, espera segundos, recarga" |
| El dueño buscaba sus textos en Vercel (confundió hosting con panel) | Manual: "Vercel es el motor, NUNCA entras ahí; tu panel es tudominio.cl/admin" |

---

## 7. El perímetro honesto (qué SÍ puede quedar en código)

Declararlo por escrito en el manual de usuario, sin vergüenza:
- El **diseño**: colores, tipografías, disposición, animaciones.
- **Geometría de ilustraciones** (mapas con coordenadas, SVGs): sus TEXTOS y leyendas
  sí van al panel; mover puntos es una "mejora".
- **Símbolos de interfaz** (flechas, iconos, siglas técnicas como "DOI").
- Archivos especiales solo si aún no está activo el storage (en H2V, Blob ya está:
  el perímetro de archivos debería ser vacío).
Todo lo demás es contenido y va al panel. En caso de duda: al panel.

---

## 8. Runbook del retrofit (el orden que funcionó, paso a paso)

1. **Inventario**: correr el grep de §3.3 sobre TODAS las rutas; listar cada literal y
   asignarle destino (qué global, qué campo/array). Los que ya tengan campo en un
   global, son solo cableado del componente: caso fácil.
2. **Defaults**: escribir `src/content/defaults/*.ts` con el contenido real actual
   (copiado VERBATIM de las páginas: cero pérdida, cero invención).
3. **Globals**: agregar los campos/arrays que falten + `tabs` + descripciones en
   español. `generate:types` + `generate:importmap`.
4. **Componentes**: reemplazar cada literal por `t(global?.campo, d.campo)` /
   `list(...)`. El diseño no cambia ni un pixel (mismas clases).
5. **Migración**: schema (`migrate:create`) → validar en DB vacía → migración de datos
   pareada que rellena con los defaults (o seed si es instalación nueva).
6. **Revalidación**: hooks `afterChange` por global/colección (aunque sigan en
   force-dynamic, dejarlos listos habilita el paso a estático después).
7. **Tests**: los 3 e2e de §5.3.
8. **Deploy**: push → build aplica migraciones → verificar DESDE FUERA (curl, no el
   browser local) que las rutas muestran el contenido y el panel abre docs reales.
9. **La prueba del dueño** (§1): 10 textos al azar editados por un no-técnico. Ese es
   el "hecho". Idealmente, que la primera edición real la haga el dueño mismo (en
   cvillalobos.org fue el propio dueño cambiando su correo: validación y momento "es
   mío" en uno).
10. **Manual**: actualizar `docs/manual-usuario.md` con el mapa "qué se edita dónde" y
    el perímetro honesto de §7.

Trabajar **página por página** (Contacto es el piloto perfecto: global ya existe,
literales identificados), commit por página, con la suite verde en cada paso.

---

## 9. Checklist final (imprimir y tachar)

- [ ] Grep de literales JSX = 0 en `src/app` y `src/components` (fuera del perímetro §7)
- [ ] Todos los globals con `tabs` y descripciones en español llano
- [ ] Columnas/tarjetas/listas = arrays reordenables; redes = array abierto
- [ ] Defaults centralizados + fallbacks `t()/list()` en todos los componentes
- [ ] Hooks de revalidación en todos los globals y colecciones (con guard de seed)
- [ ] Features del editor ⊇ node types; `generate:types` + `generate:importmap` al día
- [ ] e2e: admin abre docs reales / edición se refleja / rutas clave 200
- [ ] `vercel.json` con migrate en build; CERO SQL manual contra producción
- [ ] Resend probado (reset de clave llega) y Blob probado (imagen sobrevive redeploy)
- [ ] `.gitignore`: `.env*`, `*recovery-codes*`
- [ ] Manual de usuario actualizado (mapa de edición + perímetro honesto)
- [ ] **La prueba del dueño: 10/10 textos editados sin ayuda**

---

*Origen: motor WebPro, retrofit del cliente 0 (cvillalobos.org), 2026-07-04. Si algo de
este documento contradice la realidad del código de H2V, gana la realidad: audita,
ajusta el plan, y anota la diferencia aquí mismo.*
