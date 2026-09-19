import React from 'react';
import { BookMarked } from 'lucide-react';
import { tamilExamGuideByUnit } from '../data/grade10/tamilExamGuideContent';
import TamilExamGuidePanel from './TamilExamGuidePanel';

export default function TamilExamGuideEmbed({ unit = 1 }) {
  const data = tamilExamGuideByUnit[unit];
  if (!data) return null;

  const counts = {
    k2: data.kuruvina.length,
    k4: data.siruvina.length,
    k8: data.neduvina.length,
    k5: data.grammar.length,
  };

  return (
    <section className="mb-10 w-full">
      <div className="bg-gradient-to-r from-rose-900 to-slate-900 text-white rounded-2xl p-5 md:p-6 shadow-lg border border-rose-800/50 mb-4">
        <p className="text-xs font-bold uppercase text-rose-200/90 flex items-center gap-2">
          <BookMarked className="w-4 h-4" />
          Thunaippadu · Book-back · Unit {unit} மட்டும்
        </p>
        <h2 className="text-xl md:text-2xl font-bold mt-1">{data.unitTitle}</h2>
        <p className="text-sm text-rose-100/90 mt-1">{data.unitSubtitle}</p>
        <p className="text-xs text-amber-200 mt-3 font-medium">
          2 marks: {counts.k2} · 4 marks: {counts.k4} · 8 marks: {counts.k8} · Grammar 5: {counts.k5}
          — ஒவ்வொரு unit test / 50-mark paper section-க்கும் போதுமான வினாக்கள்
        </p>
      </div>

      <TamilExamGuidePanel unit={unit} />
    </section>
  );
}
