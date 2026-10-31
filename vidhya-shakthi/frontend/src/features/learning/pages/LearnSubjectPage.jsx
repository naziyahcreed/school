import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronRight, FlaskConical, Globe2 } from 'lucide-react';
import { LMS_SUBJECTS } from '../catalog/lmsCatalog.js';
import { displayUnitTitle, getTheme } from '../theme.js';
import { getUnitExercises, getUnitQuestions, usesExerciseFlow } from '../utils/unitQuestions.js';
import { MiniBooks } from '../components/StudyIllustrations.jsx';
import { useAuth } from '../../../context/AuthContext.jsx';
import { canAccessSubject } from '../utils/schoolOsStore.js';

export default function LearnSubjectPage() {
  const { subjectId } = useParams();
  const { user } = useAuth();
  const subject = LMS_SUBJECTS.find((s) => s.id === subjectId);
  if (!subject) return <Navigate to="/learn" replace />;
  if (!canAccessSubject(user, subject.id)) return <Navigate to="/learn" replace />;

  const theme = getTheme(subject.id);
  const units = subject.chapters || [];

  return (
    <div className={`min-h-full ${theme.unitTint}`}>
      <header className={`${theme.headerBg} px-4 pt-4 pb-5`}>
        <Link to="/learn" className="inline-flex items-center gap-1 text-sm font-semibold text-[#1e3a5f]">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="mt-2 flex items-start justify-between gap-3">
          <div>
            <h1 className="text-[26px] font-extrabold text-[#1e3a5f] leading-tight">
              {subject.nameTa}
            </h1>
            <p className="text-sm text-slate-500 font-medium">{subject.name}</p>
            {theme.quote && (
              <p className="mt-3 text-[12px] italic text-slate-500 max-w-[210px]">{theme.quote}</p>
            )}
            {!theme.quote && (
              <p className="mt-3 text-[12px] text-slate-500">{theme.tagline}</p>
            )}
          </div>
          <div className="shrink-0 pt-1">
            {subject.id === 'mathematics' ? (
              <div className={`w-14 h-14 rounded-2xl ${theme.cardIconBg} flex items-center justify-center text-3xl font-black`}>
                ∑
              </div>
            ) : subject.id === 'science' ? (
              <div className={`w-14 h-14 rounded-2xl ${theme.cardIconBg} flex items-center justify-center`}>
                <FlaskConical className="w-7 h-7" />
              </div>
            ) : subject.id === 'social-science' ? (
              <div className={`w-14 h-14 rounded-2xl ${theme.cardIconBg} flex items-center justify-center`}>
                <Globe2 className="w-7 h-7" />
              </div>
            ) : (
              <MiniBooks className="w-[72px] h-[72px]" />
            )}
          </div>
        </div>
      </header>

      <section className="px-4 pt-4 pb-8">
        <p className="text-[13px] font-bold text-[#1e3a5f] mb-3">
          Total Units : {units.length}
        </p>
        <ul className="space-y-2.5">
          {units.map((chapter, i) => {
            const exerciseFlow = usesExerciseFlow(subject, chapter);
            const exercises = getUnitExercises(chapter);
            const count = exerciseFlow ? exercises.length : getUnitQuestions(subject, chapter).length;
            return (
              <li key={chapter.id}>
                <Link
                  to={`/learn/${subject.id}/${chapter.id}`}
                  className="flex items-center gap-3 bg-white rounded-2xl px-3 py-3 shadow-sm border border-white/80 active:scale-[0.99] transition"
                >
                  <span
                    className={`w-9 h-9 rounded-full ${theme.badge} text-white text-sm font-extrabold flex items-center justify-center shrink-0`}
                  >
                    {chapter.unit ?? i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-bold text-[#1e3a5f] leading-snug">
                      Unit {chapter.unit ?? i + 1}
                      {displayUnitTitle(chapter, subject.id) ? `  ${displayUnitTitle(chapter, subject.id)}` : ''}
                    </p>
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium shrink-0">
                    {exerciseFlow
                      ? `${count} Exercise${count === 1 ? '' : 's'}`
                      : `${count} Question${count === 1 ? '' : 's'}`}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
