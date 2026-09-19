import React, { useMemo, useState } from 'react';
import { tamilExamGuideByUnit } from '../data/grade10/tamilExamGuideContent';

const SECTIONS = [
  { key: 'kuruvina', marks: 2, label: 'குறுவினா', color: 'amber' },
  { key: 'siruvina', marks: 4, label: 'சிறுவினா', color: 'blue' },
  { key: 'neduvina', marks: 8, label: 'நெடுவினா', color: 'emerald' },
  { key: 'grammar', marks: 5, label: 'இலக்கணம்', color: 'purple' },
];

const BAR = {
  amber: 'bg-amber-500',
  blue: 'bg-blue-600',
  emerald: 'bg-emerald-600',
  purple: 'bg-purple-600',
};

const BADGE = {
  amber: 'bg-amber-100 text-amber-800',
  blue: 'bg-blue-100 text-blue-800',
  emerald: 'bg-emerald-100 text-emerald-800',
  purple: 'bg-purple-100 text-purple-800',
};

const BORDER = {
  amber: 'border-amber-500',
  blue: 'border-blue-600',
  emerald: 'border-emerald-600',
  purple: 'border-purple-600',
};

function AnswerBlock({ text, borderClass }) {
  return (
    <div className={`bg-slate-50 border-l-4 ${borderClass} p-5 md:p-6 rounded-r-lg`}>
      <p className="font-bold text-slate-900 mb-2 text-sm uppercase tracking-wide">முழு மதிப்பெண் model விடை</p>
      <div className="text-slate-800 leading-loose whitespace-pre-line text-[15px] md:text-base">{text}</div>
    </div>
  );
}

function QuestionCard({ item, index, section }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 md:p-6 shadow-sm space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className={`text-xs font-bold px-2.5 py-1 rounded ${BADGE[section.color]}`}>
          வினா {index + 1} · {section.marks} மதிப்பெண்
        </span>
        <span className="text-xs text-slate-500 font-medium">பாடம் {item.lesson}</span>
      </div>
      <h3 className="text-base md:text-lg font-semibold text-slate-900 leading-snug">{item.q}</h3>
      <AnswerBlock text={item.a} borderClass={BORDER[section.color]} />
      {item.full && (
        <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">
          8 மதிப்பெண்: முன்னுரை + 3–4 பகுதிகள் + முடிவு — answer key / Suraa guide length.
        </p>
      )}
    </div>
  );
}

export default function TamilExamGuidePanel({ unit = 1 }) {
  const data = tamilExamGuideByUnit[unit];
  const [active, setActive] = useState('kuruvina');

  const sectionMeta = useMemo(
    () =>
      SECTIONS.map((s) => ({
        ...s,
        count: data?.[s.key]?.length ?? 0,
        id: `u${unit}-${s.key}`,
      })),
    [data, unit],
  );

  if (!data) return null;

  const current = SECTIONS.find((s) => s.key === active);

  return (
    <div className="flex flex-col lg:flex-row gap-0 lg:gap-4 bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden shadow-lg min-h-[640px]">
      <aside className="w-full lg:w-72 bg-slate-900 text-white flex-shrink-0">
        <div className="p-5 bg-slate-950 border-b border-slate-800">
          <p className="text-xs text-amber-400 font-bold uppercase">Unit {unit} only</p>
          <h2 className="text-lg font-bold text-white mt-1">{data.unitTitle}</h2>
          <p className="text-[11px] text-slate-400 mt-2 leading-snug">{data.unitSubtitle}</p>
        </div>
        <nav className="p-3 space-y-1 max-h-[280px] lg:max-h-none overflow-y-auto">
          {sectionMeta.map((sec) => (
            <button
              key={sec.key}
              type="button"
              onClick={() => setActive(sec.key)}
              className={`w-full text-left px-3 py-2.5 text-sm rounded-lg transition ${
                active === sec.key
                  ? 'bg-amber-400 text-slate-900 font-bold'
                  : 'text-slate-200 hover:bg-slate-800 hover:text-amber-300'
              }`}
            >
              <span className="font-black">{sec.marks}</span> · {sec.label}
              <span className="float-right text-xs opacity-80">{sec.count} வினா</span>
            </button>
          ))}
        </nav>
        <div className="p-4 text-[11px] text-slate-500 border-t border-slate-800 hidden lg:block">
          தunaippadu / book-back · Suraa-style · offline
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 bg-slate-50">
        <header className="h-14 bg-white border-b border-slate-200 px-4 md:px-6 flex items-center justify-between sticky top-0 z-10">
          <p className="text-sm text-slate-600 truncate">
            <span className="font-bold text-slate-900">{current.label}</span>
            <span className="text-slate-400 mx-1">·</span>
            {current.marks} மதிப்பெண் × {data[active].length}
          </p>
          <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-900 px-2 py-1 rounded-full shrink-0">
            இயல் {unit}
          </span>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-7 rounded-full ${BAR[current.color]}`} />
            <h2 className="text-lg font-bold text-slate-800">
              {current.label} ({current.marks} மதிப்பெண்கள்) — {data[active].length} வினாக்கள்
            </h2>
          </div>
          {data[active].map((item, i) => (
            <QuestionCard key={`${active}-${i}`} item={item} index={i} section={current} />
          ))}
        </div>
      </main>
    </div>
  );
}
