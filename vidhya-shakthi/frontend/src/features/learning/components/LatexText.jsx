import React, { useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

const LATEX_HINT = /\\[a-zA-Z]+|\$\$|\\\(|\\\[|\\{|\\}|\\times|\\frac|\\in|\\emptyset|\\text|\\cdot|\\circ|\\mathbb/;

function renderKatex(latex, displayMode) {
  try {
    return katex.renderToString(latex, {
      displayMode,
      throwOnError: false,
      strict: false,
      trust: false,
    });
  } catch {
    return null;
  }
}

function splitMixed(text) {
  const parts = [];
  const re = /(\$\$[\s\S]+?\$\$|\$[^$\n]+?\$|\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\))/g;
  let last = 0;
  let match;
  while ((match = re.exec(text)) !== null) {
    if (match.index > last) {
      parts.push({ type: 'text', value: text.slice(last, match.index) });
    }
    const raw = match[1];
    if (raw.startsWith('$$')) {
      parts.push({ type: 'display', value: raw.slice(2, -2) });
    } else if (raw.startsWith('\\[')) {
      parts.push({ type: 'display', value: raw.slice(2, -2) });
    } else if (raw.startsWith('\\(')) {
      parts.push({ type: 'inline', value: raw.slice(2, -2) });
    } else {
      parts.push({ type: 'inline', value: raw.slice(1, -1) });
    }
    last = match.index + raw.length;
  }
  if (last < text.length) {
    parts.push({ type: 'text', value: text.slice(last) });
  }
  return parts;
}

function Html({ html, className }) {
  return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

function renderMarkdown(text) {
  const parts = String(text).split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

/**
 * Renders existing Q&A text. Maths extra: KaTeX for LaTeX fields.
 * Plain Tamil/English answers stay as text.
 */
export default function LatexText({ text, forceMath = false, display = false, className = '' }) {
  const blocks = useMemo(() => {
    if (text == null || text === '') return null;
    const source = String(text);

    if (forceMath || (display && LATEX_HINT.test(source) && !source.includes('$$') && !/\$[^$]/.test(source))) {
      const lines = source
        .replace(/^\s*\$\$?\s*|\s*\$\$?\s*$/g, '')
        .split(/\n+/)
        .map((line) => line.trim())
        .filter(Boolean);
      return lines.map((line) => {
        const html = renderKatex(line, true);
        return html
          ? { type: 'html', html, display: true }
          : { type: 'text', value: line };
      });
    }

    if (/\$\$|\$[^$\n]+\$|\\\(|\\\[/.test(source)) {
      return splitMixed(source).map((part) => {
        if (part.type === 'text') return part;
        const html = renderKatex(part.value, part.type === 'display');
        return html
          ? { type: 'html', html, display: part.type === 'display' }
          : { type: 'text', value: part.value };
      });
    }

    if (LATEX_HINT.test(source)) {
      const lines = source.split(/\n{2,}/);
      return lines.map((line) => {
        const html = renderKatex(line.trim(), true);
        return html
          ? { type: 'html', html, display: true }
          : { type: 'text', value: line };
      });
    }

    return [{ type: 'text', value: source }];
  }, [text, forceMath, display]);

  if (!blocks) return null;

  return (
    <div className={`leading-relaxed ${className}`}>
      {blocks.map((block, i) => {
        if (block.type === 'html') {
          return (
            <Html
              key={i}
              html={block.html}
              className={`katex-host ${block.display ? 'block my-2 overflow-x-auto' : 'inline'}`}
            />
          );
        }
        return (
          <span key={i} className="whitespace-pre-line">
            {renderMarkdown(block.value)}
          </span>
        );
      })}
    </div>
  );
}
