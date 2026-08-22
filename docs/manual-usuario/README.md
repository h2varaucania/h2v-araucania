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

- `docs/INTERFAZ_ADMIN_TECNICA.md`: descripción técnica de la interfaz (para informáticos).
- `docs/EDITABILIDAD_TOTAL.md`: estándar de editabilidad que cumple el sitio.
- `docs/Guia_Administracion_H2V_Araucania.pdf`: guía breve anterior (julio 2026); este manual la reemplaza y amplía.
