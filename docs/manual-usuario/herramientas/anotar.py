#!/usr/bin/env python3
"""Convierte capturas/*.png + marcas.json en figuras/*.png con globos numerados (para el manual).
Uso: python3 docs/manual-usuario/herramientas/anotar.py
"""
import json, pathlib
from PIL import Image, ImageDraw, ImageFont

AQUI = pathlib.Path(__file__).resolve().parent
CAP = AQUI.parent / 'capturas'
FIG = AQUI.parent / 'figuras'
FIG.mkdir(exist_ok=True)
DPR = 2  # las capturas se tomaron con deviceScaleFactor 2
ROJO = (198, 40, 40, 255)
ROJO_SUAVE = (198, 40, 40, 90)
BLANCO = (255, 255, 255, 255)
RECORTAR = {  # id → (margen izq/der, margen arriba, margen abajo) en px CSS alrededor de la caja que une las marcas
    '01-login': (140, 230, 90), '02-olvide-clave': (140, 230, 90), '33-salir': None, '11b-version-restaurar': None,
}
BORDE = (200, 205, 210)
MAX_W = 1800  # ancho máximo de la figura final (px): nítido al imprimir a 16 cm (~285 dpi) sin engordar el DOCX/PDF

def fuente(tam):
    for f in ['/System/Library/Fonts/Helvetica.ttc', '/System/Library/Fonts/SFNS.ttf', '/Library/Fonts/Arial.ttf']:
        try:
            return ImageFont.truetype(f, tam)
        except Exception:
            continue
    return ImageFont.load_default()

def anotar(id_, info):
    src = CAP / f'{id_}.png'
    if not src.exists():
        return False
    img = Image.open(src).convert('RGBA')
    capa = Image.new('RGBA', img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(capa)
    r = 26 * DPR // 2 + 6  # radio del globo
    f = fuente(30)
    for m in info.get('marks', []):
        x, y, w, h = m['x'] * DPR, m['y'] * DPR, m['w'] * DPR, m['h'] * DPR
        # recuadro suave sobre el elemento
        pad = 6
        d.rounded_rectangle([x - pad, y - pad, x + w + pad, y + h + pad], radius=10, outline=ROJO, width=4)
        # globo numerado en la esquina superior izquierda del elemento
        cx, cy = max(r + 2, x - r - 4), max(r + 2, y - 4)
        d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=ROJO, outline=BLANCO, width=4)
        txt = str(m['n'])
        bb = d.textbbox((0, 0), txt, font=f)
        d.text((cx - (bb[2] - bb[0]) / 2 - bb[0], cy - (bb[3] - bb[1]) / 2 - bb[1]), txt, font=f, fill=BLANCO)
    out = Image.alpha_composite(img, capa).convert('RGB')
    marks = info.get('marks', [])
    if id_ in RECORTAR and marks and RECORTAR[id_]:
        mx, mt, mb = RECORTAR[id_]
        x0 = min(m['x'] for m in marks) * DPR - mx * DPR; x1 = max(m['x'] + m['w'] for m in marks) * DPR + mx * DPR
        y0 = min(m['y'] for m in marks) * DPR - mt * DPR; y1 = max(m['y'] + m['h'] for m in marks) * DPR + mb * DPR
        out = out.crop((int(max(0, x0)), int(max(0, y0)), int(min(out.width, x1)), int(min(out.height, y1))))
    elif id_ == '33-salir':
        # recorte del contenido no blanco (mensaje centrado) con margen generoso
        from PIL import ImageChops
        bb = ImageChops.difference(out, Image.new('RGB', out.size, (255, 255, 255))).getbbox()
        if bb:
            m = 120 * DPR
            out = out.crop((max(0, bb[0]-m), max(0, bb[1]-m), min(out.width, bb[2]+m), min(out.height, bb[3]+m)))
    # borde fino para separar la captura del fondo blanco de la página
    from PIL import ImageOps
    out = ImageOps.expand(out, border=3, fill=BORDE)
    if out.width > MAX_W:
        out = out.resize((MAX_W, int(out.height * MAX_W / out.width)), Image.LANCZOS)
    out.save(FIG / f'{id_}.png', optimize=True)
    return True

def main():
    marcas = json.loads((CAP / 'marcas.json').read_text())
    n = 0
    for id_, info in marcas.items():
        if anotar(id_, info):
            n += 1
    # capturas sin marcas (p. ej. sitio público) se copian tal cual, redimensionadas
    for p in sorted(CAP.glob('*.png')):
        if p.stem not in marcas:
            anotar(p.stem, {'marks': []}); n += 1
    print(f'{n} figuras en {FIG}')

if __name__ == '__main__':
    main()
