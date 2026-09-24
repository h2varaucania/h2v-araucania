# Manual de Usuario del Sitio Web H2V Araucanía

Manual "para dummies", con capturas de pantalla, de cómo editar completamente el sitio desde el
panel de administración (`/admin`). Preparado para el traspaso del sitio a la SEREMI de Energía
de La Araucanía. Se entrega en **Word (.docx)** para uso diario y en **LaTeX (.tex + .pdf)** para la
entrega formal. Ambos salen de UNA fuente única (`fuente/manual.md`).

## Entregables (en esta carpeta)

| Archivo | Qué es |
|---|---|
| `Manual_Usuario_H2V_Araucania.docx` | Manual en Word (índice generado por Word, figuras incrustadas). |
| `Manual_Usuario_H2V_Araucania.tex` | Fuente LaTeX (XeLaTeX) del manual; usa `figuras/`. |
| `Manual_Usuario_H2V_Araucania.pdf` | PDF compilado desde el .tex. |
| `figuras/` | Las 43 capturas anotadas (globos numerados) + logos oficiales. |
| `fuente/manual.md` | **Fuente única** del texto (Markdown con convenciones propias). Edite aquí y regenere. |
| `herramientas/` | Scripts de captura (Playwright), anotación (PIL) y generación (DOCX/TeX). |
| `capturas/` | Capturas crudas a 2x + `marcas.json` (regenerables; las PNG no se versionan). |
| `salida/` | Archivos auxiliares de la compilación LaTeX (no se versionan). |

## Cómo regenerar el manual

Requisitos: Node + dependencias del repo (Playwright ya instalado), Python 3 con `python-docx`, `Pillow`
y `pypdfium2`, y TeX Live (XeLaTeX, latexmk).

1. **Capturas** (opcional; solo si cambió la interfaz). Con el sitio corriendo en local
   (`node .next/standalone/server.js`, base local con el admin e2e) ejecutar desde la raíz del repo:
   `node docs/manual-usuario/herramientas/capturar.mjs`, luego `capturar_extra.mjs` y `capturar_extra2.mjs`
   (esta última crea contenido de muestra en la base LOCAL y toma las páginas públicas desde producción).
   Figuras de la sección KMZ (13b, 13c, 46b): `capturar_kmz.mjs` (requiere el servidor local con
   `NEXT_PUBLIC_FEAT_MAPA_PLUS=true`). Figuras de noticia y evento (06, 15): `capturar_ayuda_borradores.mjs`. Figuras de los mensajes de
   contacto (18, 19): `capturar_mensajes.mjs` (requiere algunos mensajes de ejemplo en la base local).
2. **Anotar**: `python3 docs/manual-usuario/herramientas/anotar.py` → `figuras/`.
3. **Texto**: editar `fuente/manual.md`.
4. **Generar**: `python3 docs/manual-usuario/herramientas/build_docx.py` y
   `python3 docs/manual-usuario/herramientas/build_tex.py`.
5. **Compilar el PDF** (desde `docs/manual-usuario/`):
   `latexmk -xelatex -interaction=nonstopmode -output-directory=salida Manual_Usuario_H2V_Araucania.tex`
   y copiar `salida/Manual_Usuario_H2V_Araucania.pdf` a esta carpeta.
6. **Índice del DOCX**: al abrir el .docx en Word, si el índice aparece vacío, clic derecho sobre él →
   "Actualizar campos" (o generar con `MANUAL_UPDATEFIELDS=1` para que Word lo pida al abrir).

## Convenciones de `fuente/manual.md`

`# ` capítulo · `## ` sección · `### ` subsección · `- ` viñetas · `1. ` pasos · tablas con `|` ·
`![pie de figura](archivo.png)` figura (archivo en `figuras/`) · `> 💡 / ⚠️ / ✅ / ℹ️ / 🔒 texto`
recuadros (Consejo / Atención / Resultado / Nota / Seguridad) · `<<<salto>>>` salto de página ·
inline `**negrita**`, `*cursiva*`, `` `código` ``.

## Relación con los otros documentos

- `docs/tecnico/Guia_Tecnica_H2V_Araucania.tex` (+ `.pdf`): la Guía técnica, para el responsable técnico (cuentas, variables, respaldos, dominio, actualizaciones). El Anexo D de este manual la resume.
- `docs/INTERFAZ_ADMIN_TECNICA.md`: descripción técnica detallada de cómo está construido el panel.
- `docs/EDITABILIDAD_TOTAL.md`: estándar de editabilidad que cumple el sitio.
- `docs/archivo/`: documentos anteriores (guía breve de julio de 2026, manuales de abril y julio), reemplazados por este manual y por la Guía técnica.

## Documento hermano: protocolo de entrega
El protocolo de traspaso a la SEREMI (dos fases, con constancia y acta para firmar) está en
`docs/traspaso/Protocolo_Entrega_H2V_SEREMI.tex` (+ `.pdf`). Usa los logos de `figuras/` y se compila
desde `docs/traspaso/` con `latexmk -xelatex -output-directory=salida Protocolo_Entrega_H2V_SEREMI.tex`.
Los pasos del traspaso viven **solo** en el protocolo; el capítulo 7 del manual da el panorama (las dos fases, quién hace qué después, qué hacer si alguien se va y dónde están los respaldos). Si cambian las fases, revisar ambos.
