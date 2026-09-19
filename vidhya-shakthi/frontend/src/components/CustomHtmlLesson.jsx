import React, { useMemo } from 'react';
import { School } from 'lucide-react';

/**
 * Renders teacher/admin HTML+CSS in a sandboxed iframe (no scripts).
 */
export default function CustomHtmlLesson({ lesson, colors }) {
  const srcDoc = useMemo(() => {
    const css = lesson.css_content || lesson.cssContent || '';
    const html = lesson.html_content || lesson.htmlContent || '';
    return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>
      body { font-family: system-ui, sans-serif; line-height: 1.55; margin: 1rem; color: #1e293b; }
      img { max-width: 100%; height: auto; }
      ${css}
    </style></head><body>${html}</body></html>`;
  }, [lesson.css_content, lesson.cssContent, lesson.html_content, lesson.htmlContent]);

  return (
    <article className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className={`px-5 py-3 flex items-center gap-2 ${colors?.light || 'bg-slate-50'} border-b border-gray-100`}>
        <School className={`w-4 h-4 ${colors?.text || 'text-indigo-600'}`} />
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase">School tutorial</p>
          <h3 className="font-bold text-gray-900">{lesson.title}</h3>
          {lesson.title_ta && <p className="text-sm text-gray-600">{lesson.title_ta}</p>}
        </div>
        {lesson.author_name && (
          <span className="ml-auto text-xs text-gray-400">By {lesson.author_name}</span>
        )}
      </div>
      <iframe
        title={lesson.title}
        srcDoc={srcDoc}
        className="w-full min-h-[320px] border-0 bg-white"
        sandbox=""
        loading="lazy"
      />
    </article>
  );
}
