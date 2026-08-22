#!/usr/bin/env python3
"""Parser de la fuente única del manual (fuente/manual.md) a bloques simples.
Convenciones: front matter entre '---'; '# ' capítulo, '## ' sección, '### ' subsección;
'- ' viñetas; '1. ' pasos; tablas con '|'; '![pie](archivo.png)' figuras; '> 💡/⚠️/✅/ℹ️/🔒 texto'
recuadros; '<<<salto>>>' salto de página. Inline: **negrita**, *cursiva*, `código`.
"""
import re, pathlib

ADMON = {'💡': 'consejo', '⚠': 'atencion', '✅': 'resultado', 'ℹ': 'nota', '🔒': 'seguridad'}
ADMON_LABEL = {'consejo': 'Consejo', 'atencion': 'Atención', 'resultado': 'Resultado', 'nota': 'Nota', 'seguridad': 'Seguridad'}
INLINE_RE = re.compile(r'(\*\*.+?\*\*|\*[^*]+?\*|`[^`]+?`)')

def parse_inline(text):
    """Devuelve lista de (estilo, texto): estilo in text|bold|italic|code."""
    out = []
    for tok in INLINE_RE.split(text):
        if not tok:
            continue
        if tok.startswith('**') and tok.endswith('**') and len(tok) > 4:
            out.append(('bold', tok[2:-2]))
        elif tok.startswith('`') and tok.endswith('`'):
            out.append(('code', tok[1:-1]))
        elif tok.startswith('*') and tok.endswith('*') and len(tok) > 2:
            out.append(('italic', tok[1:-1]))
        else:
            out.append(('text', tok))
    return out

def _strip_label(kind, text):
    lab = ADMON_LABEL[kind]
    for pref in (lab + ':', lab + ' :'):
        if text.startswith(pref):
            return text[len(pref):].strip()
    return text

def parse(path):
    lines = pathlib.Path(path).read_text(encoding='utf-8').split('\n')
    meta, blocks = {}, []
    i = 0
    # front matter
    if lines and lines[0].strip() == '---':
        i = 1
        while i < len(lines) and lines[i].strip() != '---':
            if ':' in lines[i]:
                k, v = lines[i].split(':', 1)
                meta[k.strip()] = v.strip()
            i += 1
        i += 1
    para = []

    def flush():
        nonlocal para
        if para:
            blocks.append({'type': 'para', 'text': ' '.join(s.strip() for s in para)})
            para = []

    while i < len(lines):
        ln = lines[i]
        s = ln.strip()
        if not s:
            flush(); i += 1; continue
        if s == '<<<salto>>>':
            flush(); blocks.append({'type': 'pagebreak'}); i += 1; continue
        m = re.match(r'^(#{1,3})\s+(.*)$', s)
        if m:
            flush(); blocks.append({'type': 'heading', 'level': len(m.group(1)), 'text': m.group(2).strip()}); i += 1; continue
        m = re.match(r'^!\[(.*)\]\((.*)\)$', s)
        if m:
            flush(); blocks.append({'type': 'figure', 'caption': m.group(1).strip(), 'file': m.group(2).strip()}); i += 1; continue
        if s.startswith('>'):
            flush()
            body = s[1:].strip()
            kind = 'nota'
            if body and body[0] in ADMON:
                kind = ADMON[body[0]]
                body = body[1:].lstrip('️').strip()
            # líneas siguientes que empiecen con '>' continúan el recuadro
            j = i + 1
            while j < len(lines) and lines[j].strip().startswith('>'):
                body += ' ' + lines[j].strip()[1:].strip(); j += 1
            blocks.append({'type': 'admon', 'kind': kind, 'text': _strip_label(kind, body)})
            i = j; continue
        if s.startswith('|'):
            flush()
            rows = []
            while i < len(lines) and lines[i].strip().startswith('|'):
                cells = [c.strip() for c in lines[i].strip().strip('|').split('|')]
                rows.append(cells); i += 1
            header = rows[0]
            body_rows = [r for r in rows[1:] if not all(re.fullmatch(r':?-{2,}:?', c or '--') for c in r)]
            ncol = len(header)
            body_rows = [r + [''] * (ncol - len(r)) if len(r) < ncol else r[:ncol] for r in body_rows]
            blocks.append({'type': 'table', 'header': header, 'rows': body_rows}); continue
        m = re.match(r'^(-|\d+\.)\s+(.*)$', s)
        if m:
            flush()
            ordered = m.group(1) != '-'
            items = []
            while i < len(lines):
                mm = re.match(r'^(-|\d+\.)\s+(.*)$', lines[i].strip())
                if not mm or ((mm.group(1) != '-') != ordered):
                    break
                items.append(mm.group(2).strip()); i += 1
            blocks.append({'type': 'list', 'ordered': ordered, 'items': items}); continue
        para.append(ln); i += 1
    flush()
    return meta, blocks

if __name__ == '__main__':
    import sys, collections
    meta, blocks = parse(sys.argv[1] if len(sys.argv) > 1 else pathlib.Path(__file__).parent.parent / 'fuente' / 'manual.md')
    print(meta)
    print(collections.Counter(b['type'] for b in blocks))
