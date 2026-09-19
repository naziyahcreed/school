import React, { useCallback, useRef, useState } from 'react';
import { FileCode, FileText, Upload, X } from 'lucide-react';

async function readTextFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

/** Pull embedded <style> blocks out of a standalone HTML file */
export function splitEmbeddedStyles(htmlText) {
  const styles = [];
  const html = htmlText.replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, (_, css) => {
    styles.push(css.trim());
    return '';
  });
  return { html: html.trim(), css: styles.join('\n\n') };
}

export default function LearnFileUploadZone({ onHtmlChange, onCssChange, disabled }) {
  const htmlInputRef = useRef(null);
  const cssInputRef = useRef(null);
  const comboInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [lastFiles, setLastFiles] = useState([]);

  const applyFiles = useCallback(
    async (fileList) => {
      const files = Array.from(fileList || []);
      if (!files.length) return;
      const names = [];
      let htmlPatch = null;
      let cssPatch = null;

      for (const file of files) {
        const name = file.name.toLowerCase();
        const text = await readTextFile(file);
        names.push(file.name);
        if (name.endsWith('.css')) {
          cssPatch = cssPatch ? `${cssPatch}\n\n${text}` : text;
        } else if (name.endsWith('.html') || name.endsWith('.htm')) {
          const { html, css } = splitEmbeddedStyles(text);
          htmlPatch = htmlPatch ? `${htmlPatch}\n\n${html}` : html;
          if (css) cssPatch = cssPatch ? `${cssPatch}\n\n${css}` : css;
        }
      }

      if (htmlPatch) onHtmlChange(htmlPatch);
      if (cssPatch) onCssChange(cssPatch);
      setLastFiles(names);
    },
    [onHtmlChange, onCssChange],
  );

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (!disabled) applyFiles(e.dataTransfer.files);
  };

  const clearHint = () => setLastFiles([]);

  return (
    <div className="rounded-2xl border-2 border-dashed border-indigo-200 bg-gradient-to-br from-indigo-50 to-white p-6 space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-indigo-900 flex items-center gap-2">
            <Upload className="w-5 h-5" />
            கோப்பு upload — HTML / CSS
          </h3>
          <p className="text-sm text-indigo-800/80 mt-1 max-w-xl">
            Drag & drop lesson files here, or use the buttons. Single <strong>.html</strong> with{' '}
            <code className="text-xs bg-white/80 px-1 rounded">&lt;style&gt;</code> is supported — CSS fills automatically.
          </p>
        </div>
        {lastFiles.length > 0 && (
          <button
            type="button"
            onClick={clearHint}
            className="text-xs text-indigo-600 flex items-center gap-1 font-semibold"
          >
            <X className="w-3 h-3" /> Loaded: {lastFiles.join(', ')}
          </button>
        )}
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
          dragOver ? 'border-indigo-500 bg-indigo-100/50' : 'border-indigo-100 bg-white/60'
        } ${disabled ? 'opacity-60 pointer-events-none' : ''}`}
      >
        <p className="text-sm font-semibold text-gray-700 mb-4">Drop .html and/or .css files here</p>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => comboInputRef.current?.click()}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl text-sm font-bold shadow-md"
          >
            <FileCode className="w-4 h-4" />
            Upload HTML lesson
          </button>
          <button
            type="button"
            onClick={() => cssInputRef.current?.click()}
            className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-indigo-700 px-5 py-3 rounded-xl text-sm font-bold border-2 border-indigo-200"
          >
            <FileText className="w-4 h-4" />
            Upload CSS only
          </button>
          <button
            type="button"
            onClick={() => {
              htmlInputRef.current?.click();
            }}
            className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-4 py-3 rounded-xl text-sm font-semibold border border-gray-200"
          >
            HTML + CSS (two files)
          </button>
        </div>
        <input
          ref={comboInputRef}
          type="file"
          accept=".html,.htm,text/html"
          className="hidden"
          onChange={(e) => { applyFiles(e.target.files); e.target.value = ''; }}
        />
        <input
          ref={htmlInputRef}
          type="file"
          accept=".html,.htm,text/html"
          multiple
          className="hidden"
          onChange={(e) => { applyFiles(e.target.files); e.target.value = ''; }}
        />
        <input
          ref={cssInputRef}
          type="file"
          accept=".css,text/css"
          className="hidden"
          onChange={(e) => { applyFiles(e.target.files); e.target.value = ''; }}
        />
      </div>
    </div>
  );
}
