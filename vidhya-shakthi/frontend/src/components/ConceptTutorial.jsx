import React from 'react';
import { Lightbulb, AlertCircle, CheckCircle2, HelpCircle } from 'lucide-react';

/**
 * One textbook concept — full slow-learner tutorial block.
 */
export default function ConceptTutorial({ concept, colors, medium = 'en' }) {
  const body =
    medium === 'ta' && concept.explanationTa
      ? concept.explanationTa
      : concept.explanation || concept.explanationTa;

  const simple =
    medium === 'ta' && concept.simpleTa
      ? concept.simpleTa
      : concept.simple || concept.simpleTa;

  return (
    <article
      id={concept.id}
      className="scroll-mt-24 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
    >
      <div className={`px-5 py-4 ${colors.light} border-b ${colors.border}`}>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">{concept.code || concept.id}</p>
        <h3 className="text-lg md:text-xl font-bold text-gray-900 mt-1">{concept.title}</h3>
        {concept.titleTa && medium !== 'en' && (
          <p className="text-sm text-gray-600 mt-1">{concept.titleTa}</p>
        )}
      </div>

      <div className="p-5 md:p-6 space-y-5">
        {simple && (
          <div className="flex gap-3 p-4 rounded-xl bg-amber-50 border border-amber-100">
            <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-amber-800 uppercase mb-1">Simple idea (start here)</p>
              <p className="text-gray-800 leading-relaxed">{simple}</p>
            </div>
          </div>
        )}

        {concept.steps?.length > 0 && (
          <div>
            <p className="text-sm font-bold text-gray-900 mb-3">Step-by-step</p>
            <ol className="space-y-2">
              {concept.steps.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm text-gray-700 leading-relaxed">
                  <span className={`shrink-0 w-7 h-7 rounded-full ${colors.bg} text-white flex items-center justify-center text-xs font-bold`}>
                    {i + 1}
                  </span>
                  <span className="pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {body && (
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{body}</p>
          </div>
        )}

        {concept.formula && (
          <div className={`p-4 rounded-xl font-mono text-sm ${colors.light} ${colors.text} border ${colors.border}`}>
            {concept.formula}
          </div>
        )}

        {concept.example && (
          <div className="rounded-xl bg-slate-900 text-slate-100 p-5">
            <p className="text-emerald-400 text-xs font-bold uppercase mb-2">Worked example</p>
            <p className="text-slate-300 text-sm mb-2">
              <span className="text-amber-300">Q:</span> {concept.example.problem}
            </p>
            {concept.example.think && (
              <p className="text-slate-400 text-xs italic mb-3">Think: {concept.example.think}</p>
            )}
            <pre className="text-sm whitespace-pre-wrap font-mono bg-slate-800/60 p-4 rounded-lg">
              {concept.example.solution}
            </pre>
          </div>
        )}

        {concept.commonMistakes?.length > 0 && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-100">
            <p className="flex items-center gap-2 text-xs font-bold text-rose-800 uppercase mb-2">
              <AlertCircle className="w-4 h-4" /> Common mistakes — avoid these
            </p>
            <ul className="space-y-1.5 text-sm text-rose-900">
              {concept.commonMistakes.map((m) => (
                <li key={m}>• {m}</li>
              ))}
            </ul>
          </div>
        )}

        {concept.check && (
          <div className="flex gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-100">
            <HelpCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="text-xs font-bold text-emerald-800 uppercase mb-1">Check yourself</p>
              <p className="text-sm text-gray-800">{concept.check}</p>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

export function ConceptJumpNav({ concepts, colors }) {
  if (!concepts?.length) return null;
  return (
    <nav className="sticky top-16 z-30 -mx-4 px-4 py-3 bg-gray-50/95 backdrop-blur border-y border-gray-200 mb-6 overflow-x-auto">
      <p className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-1">
        <CheckCircle2 className={`w-3 h-3 ${colors.text}`} />
        All concepts in this unit ({concepts.length}) — tap to jump
      </p>
      <div className="flex gap-2 pb-1 min-w-max">
        {concepts.map((c) => (
          <a
            key={c.id}
            href={`#${c.id}`}
            className={`text-xs font-medium px-3 py-1.5 rounded-lg border ${colors.border} bg-white hover:bg-gray-100 ${colors.text} whitespace-nowrap`}
          >
            {c.code || c.title}
          </a>
        ))}
      </div>
    </nav>
  );
}
