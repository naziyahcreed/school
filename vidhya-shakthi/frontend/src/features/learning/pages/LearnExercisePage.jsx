import React, { useMemo } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { LMS_SUBJECTS } from '../catalog/lmsCatalog.js';
import { getTheme } from '../theme.js';
import { displayExerciseName, getExerciseQuestions, getUnitExercises } from '../utils/unitQuestions.js';
import { isViewed } from '../utils/learnAnalyticsStore.js';
import { useAuth } from '../../../context/AuthContext.jsx';
import { canAccessSubject } from '../utils/schoolOsStore.js';

export default function LearnExercisePage() {
  const { subjectId, chapterId, exerciseId } = useParams();
  const { user } = useAuth();

  const subject = LMS_SUBJECTS.find((s) => s.id === subjectId);
  const chapter = subject?.chapters.find((c) => c.id === chapterId);
  const exercise = getUnitExercises(chapter).find((ex) => ex.id === exerciseId);
  const questions = useMemo(
    () => getExerciseQuestions(subject, chapter, exerciseId),
    [subject, chapter, exerciseId],
  );

  if (!subject) return <Navigate to="/learn" replace />;
  if (!canAccessSubject(user, subject.id)) return <Navigate to="/learn" replace />;
  if (!chapter) return <Navigate to={`/learn/${subjectId}`} replace />;
  if (!exercise) return <Navigate to={`/learn/${subjectId}/${chapterId}`} replace />;

  const theme = getTheme(subject.id);
  const name = displayExerciseName(exercise);
  const unitNo = chapter.unit ?? '';

  return (
    <div className={`min-h-full ${theme.unitTint}`}>
      <header className="px-4 pt-4 pb-3">
        <Link
          to={`/learn/${subject.id}/${chapter.id}`}
          className="inline-flex items-center gap-1 text-sm font-semibold text-[#1e3a5f]"
        >
          <ArrowLeft className="w-4 h-4" />
          Unit {unitNo}
        </Link>
        <p className="mt-2 text-[11px] font-bold uppercase tracking-wide text-emerald-700">{name.en}</p>
        <h1 className="text-[22px] font-extrabold text-[#1e3a5f] leading-snug">{name.ta}</h1>
        <p className="text-xs text-slate-500 mt-1">{questions.length} questions · tap to see the answer</p>
      </header>

      {exercise.intro ? (
        <p className="mx-4 mb-3 text-[13px] text-slate-600 leading-relaxed bg-white/80 rounded-2xl px-4 py-3">
          {exercise.intro}
        </p>
      ) : null}

      <section className="px-4 pb-8">
        <ul className="space-y-2">
          {questions.map((q) => (
            <li key={q.id}>
              <Link
                to={`/learn/${subject.id}/${chapter.id}/ex/${exercise.id}/q/${q.id}`}
                className="flex items-start gap-3 bg-white rounded-2xl px-3 py-3 shadow-sm border border-white/80"
              >
                <span className="w-7 h-7 rounded-full bg-slate-100 text-[#1e3a5f] text-sm font-extrabold flex items-center justify-center shrink-0 mt-0.5">
                  {q.number}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold text-[#1e3a5f] leading-snug line-clamp-2">
                    {q.question}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">{q.marksLabel}</p>
                </div>
                {isViewed(user?.username, subject.id, chapter.id, q.id) && (
                  <span className="text-[10px] font-bold text-emerald-600 mt-1">Seen</span>
                )}
                <ChevronRight className="w-4 h-4 text-slate-300 shrink-0 mt-1" />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
