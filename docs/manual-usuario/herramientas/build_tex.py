#!/usr/bin/env python3
"""Genera Manual_Usuario_H2V_Araucania.tex (XeLaTeX) desde fuente/manual.md.
Uso: python3 docs/manual-usuario/herramientas/build_tex.py  y luego
     latexmk -xelatex -output-directory=salida Manual_Usuario_H2V_Araucania.tex  (desde docs/manual-usuario)
"""
import pathlib, re
from PIL import Image
from manual_parser import parse, parse_inline, ADMON_LABEL

AQUI = pathlib.Path(__file__).resolve().parent
BASE = AQUI.parent
FIG = BASE / 'figuras'
SALIDA = BASE / 'Manual_Usuario_H2V_Araucania.tex'

def esc(s):
    s = s.replace('\\', '\\textbackslash{}')
    for a, b in (('&', '\\&'), ('%', '\\%'), ('$', '\\$'), ('#', '\\#'), ('_', '\\_'), ('{', '\\{'), ('}', '\\}'),
                 ('~', '\\textasciitilde{}'), ('^', '\\textasciicircum{}')):
        s = s.replace(a, b)
    s = s.replace('→', '$\\rightarrow$').replace('×', '$\\times$')
    s = s.replace('"', "''")  # comillas rectas → tipográficas de cierre (simple y seguro)
    return s

def inline(text):
    out = []
    for kind, t in parse_inline(text):
        if kind == 'bold': out.append('\\textbf{' + esc(t) + '}')
        elif kind == 'italic': out.append('\\emph{' + esc(t) + '}')
        elif kind == 'code':
            if t.startswith('http') or t.startswith('/') or t.startswith('maps.'):
                out.append('\\url{' + t.replace('%', '\\%') + '}')
            else:
                out.append('\\texttt{' + esc(t).replace('\\_', '\\_\\allowbreak{}') + '}')
        else: out.append(esc(t))
    return ''.join(out)

PREAMBULO = r"""\documentclass[11pt,letterpaper]{report}
\usepackage{fontspec}
\usepackage[default]{sourcesanspro}
\usepackage{sourcecodepro}
\usepackage{polyglossia}\setdefaultlanguage{spanish}
\usepackage[top=2.3cm,bottom=2.3cm,left=2.5cm,right=2.5cm]{geometry}
\usepackage{graphicx}\graphicspath{{figuras/}}
\usepackage{float}
\usepackage[font=small,labelfont={bf,color=h2vazul},textfont={color=h2vgris}]{caption}
\usepackage{booktabs,longtable,array}
\usepackage{enumitem}\setlist{nosep,leftmargin=*}
\usepackage{xcolor}
\definecolor{h2vazul}{HTML}{1B3A5C}
\definecolor{h2vverde}{HTML}{0D7377}
\definecolor{h2vgris}{HTML}{555F6B}
\definecolor{filaalt}{HTML}{F3F5F7}
\definecolor{cConsejo}{HTML}{E3F3F0}\definecolor{bConsejo}{HTML}{0D7377}
\definecolor{cAtencion}{HTML}{FFF1DB}\definecolor{bAtencion}{HTML}{D98A00}
\definecolor{cResultado}{HTML}{E8F5E9}\definecolor{bResultado}{HTML}{2E7D32}
\definecolor{cNota}{HTML}{E8F0FB}\definecolor{bNota}{HTML}{1B3A5C}
\definecolor{cSeguridad}{HTML}{FDE8E8}\definecolor{bSeguridad}{HTML}{C62828}
\usepackage[most]{tcolorbox}
\newtcolorbox{recuadro}[2]{enhanced,colback=#1,colframe=#1,borderline west={3pt}{0pt}{#2},
  boxrule=0pt,arc=2pt,left=8pt,right=8pt,top=5pt,bottom=5pt,before skip=8pt,after skip=10pt}
\usepackage{colortbl}
\usepackage{fancyhdr}\usepackage{lastpage}
\pagestyle{fancy}\fancyhf{}
\renewcommand{\headrulewidth}{0.3pt}\renewcommand{\footrulewidth}{0pt}
\fancyhead[L]{\small\color{h2vgris}\nouppercase{\leftmark}}
\fancyhead[R]{\small\color{h2vgris}Manual de Usuario · Sitio Web H2V Araucanía}
\fancyfoot[C]{\small\color{h2vgris}Página \thepage\ de \pageref{LastPage}}
\fancypagestyle{plain}{\fancyhf{}\fancyfoot[C]{\small\color{h2vgris}Página \thepage\ de \pageref{LastPage}}\renewcommand{\headrulewidth}{0pt}}
\usepackage{titlesec}
\titleformat{\chapter}[display]{\normalfont\huge\bfseries\color{h2vazul}}{\color{h2vverde}\normalsize\bfseries Capítulo \thechapter}{6pt}{\Huge}
\titlespacing*{\chapter}{0pt}{10pt}{24pt}
\titleformat{\section}{\normalfont\Large\bfseries\color{h2vverde}}{\thesection}{0.8em}{}
\titleformat{\subsection}{\normalfont\large\bfseries\color{h2vgris}}{\thesubsection}{0.8em}{}
\usepackage{microtype}
\usepackage[colorlinks=true,linkcolor=h2vazul,urlcolor=h2vverde,pdfusetitle]{hyperref}
\setlength{\parskip}{5pt}\setlength{\parindent}{0pt}
\renewcommand{\arraystretch}{1.25}
\setcounter{secnumdepth}{2}\setcounter{tocdepth}{2}
"""

def portada(meta):
    return r"""
\begin{titlepage}
\begin{minipage}[c]{0.45\textwidth}\includegraphics[height=2.6cm]{logo-bien-publico.png}\end{minipage}\hfill
\begin{minipage}[c]{0.5\textwidth}\raggedleft\includegraphics[height=2cm]{logo-corfo.png}\hspace{0.6cm}\includegraphics[height=2cm]{logo-dps.png}\end{minipage}
\vspace{4cm}

{\color{h2vverde}\bfseries MANUAL DE USUARIO}\par\vspace{6pt}
{\color{h2vazul}\fontsize{30}{34}\selectfont\bfseries """ + esc(meta.get('titulo', '')) + r"""\par}\vspace{10pt}
{\color{h2vgris}\Large """ + esc(meta.get('subtitulo', '')) + r"""\par}\vspace{8pt}
{\color{h2vverde}\rule{\textwidth}{1.2pt}}\vspace{1.6cm}

\begin{tabular}{@{}p{3.6cm}p{11.5cm}@{}}
\textbf{\color{h2vazul}Versión} & """ + esc(meta.get('version', '')) + r""" \\[3pt]
\textbf{\color{h2vazul}Fecha} & """ + esc(meta.get('fecha', '')) + r""" \\[3pt]
\textbf{\color{h2vazul}Destinatario} & """ + esc(meta.get('destinatario', '')) + r""" \\[3pt]
\textbf{\color{h2vazul}Elaborado por} & """ + esc(meta.get('elaborado', '')) + r""" \\[3pt]
\textbf{\color{h2vazul}Sitio web} & \url{""" + meta.get('sitio', '') + r"""} \\
\end{tabular}
\vfill
{\small\color{h2vgris}Proyecto apoyado por CORFO · Programa Desarrollo Productivo Sostenible}
\end{titlepage}
"""

def anchos(b):
    """p-anchos proporcionales al largo medio de cada columna (acotado)."""
    ncol = len(b['header'])
    import statistics
    pesos, minimos = [], []
    for j in range(ncol):
        celdas = [b['header'][j]] + [r[j] for r in b['rows']]
        largos = [len(c) for c in celdas]
        palabra = max((len(w) for c in celdas for w in re.split(r'[\s/]+', re.sub(r'[*`]', '', c))), default=4)
        pesos.append(max(10, min(70, statistics.mean(largos))))
        minimos.append(min(0.45, palabra * 0.0118 + 0.025))  # una palabra larga no debe desbordar la columna
    tot = sum(pesos)
    ws = [0.93 * p / tot for p in pesos]
    # aplicar mínimos y reescalar el resto
    for _ in range(3):
        fijos = [j for j in range(ncol) if ws[j] < minimos[j]]
        if not fijos: break
        for j in fijos: ws[j] = minimos[j]
        resto = 0.93 - sum(ws[j] for j in fijos)
        libres = [j for j in range(ncol) if j not in fijos]
        tot_l = sum(pesos[j] for j in libres) or 1
        for j in libres: ws[j] = max(minimos[j], resto * pesos[j] / tot_l)
    return ws

def tabla(b):
    ws = anchos(b)
    spec = ''.join('>{\\raggedright\\arraybackslash}p{%.3f\\textwidth}' % w for w in ws)
    out = ['\\begin{longtable}{' + spec + '}']
    head = ' & '.join('\\textbf{\\color{white}' + inline(h) + '}' for h in b['header']) + ' \\\\'
    out.append('\\rowcolor{h2vazul}' + head)
    out.append('\\endfirsthead')
    out.append('\\rowcolor{h2vazul}' + head)
    out.append('\\endhead')
    for i, r in enumerate(b['rows']):
        pref = '\\rowcolor{filaalt}' if i % 2 == 1 else ''
        out.append(pref + ' & '.join(inline(c) for c in r) + ' \\\\ \\midrule')
    # quitar la última midrule y cerrar con bottomrule
    if out[-1].endswith('\\midrule'):
        out[-1] = out[-1][: -len(' \\midrule')] + ' \\bottomrule'
    out.append('\\end{longtable}')
    return '\n'.join(out)

def figura(b, n):
    path = FIG / b['file']
    if not path.exists():
        print('  ⚠ figura ausente:', b['file']); return ''
    w, h = Image.open(path).size
    alto = 'height=0.74\\textheight,' if h / w > 1.25 else ''
    return ('\\begin{figure}[H]\\centering\n\\includegraphics[width=\\linewidth,' + alto + 'keepaspectratio]{' + b['file'] + '}\n'
            '\\caption{' + inline(b['caption']) + '}\n\\end{figure}')

def main():
    meta, blocks = parse(BASE / 'fuente' / 'manual.md')
    out = [PREAMBULO, '\\begin{document}', portada(meta), '\\tableofcontents', '\\clearpage']
    nfig = 0
    for b in blocks:
        t = b['type']
        if t == 'heading':
            cmd = {1: 'chapter', 2: 'section', 3: 'subsection'}[b['level']]
            out.append(f'\\{cmd}{{{inline(b["text"])}}}')
        elif t == 'para':
            out.append(inline(b['text']) + '\n')
        elif t == 'list':
            env = 'enumerate' if b['ordered'] else 'itemize'
            out.append('\\begin{' + env + '}'); out += ['  \\item ' + inline(it) for it in b['items']]; out.append('\\end{' + env + '}')
        elif t == 'table':
            out.append(tabla(b))
        elif t == 'figure':
            nfig += 1; out.append(figura(b, nfig))
        elif t == 'admon':
            k = b['kind']; cap = {'consejo': 'Consejo', 'atencion': 'Atencion', 'resultado': 'Resultado', 'nota': 'Nota', 'seguridad': 'Seguridad'}[k]
            out.append('\\begin{recuadro}{c' + cap + '}{b' + cap + '}\\textbf{\\color{b' + cap + '}' + ADMON_LABEL[k] + ':} ' + inline(b['text']) + '\\end{recuadro}')
        elif t == 'pagebreak':
            pass
    out.append('\\end{document}')
    SALIDA.write_text('\n'.join(out), encoding='utf-8')
    print(f'✓ TeX: {SALIDA} ({nfig} figuras)')

if __name__ == '__main__':
    main()
