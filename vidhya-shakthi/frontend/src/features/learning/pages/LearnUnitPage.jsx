import React, { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Lightbulb } from 'lucide-react';
import { LMS_SUBJECTS } from '../catalog/lmsCatalog.js';
import { displayUnitTitle, getTheme } from '../theme.js';
import {
  displayExerciseName,
  filterQuestions,
  getUnitExercises,
  getUnitNotes,
  getUnitQuestions,
  QUICK_FILTERS,
  usesExerciseFlow,
} from '../utils/unitQuestions.js';
import { isViewed } from '../utils/learnAnalyticsStore.js';
import { canAccessSubject } from '../utils/schoolOsStore.js';
import { useAuth } from '../../../context/AuthContext.jsx';
import { OpenBookBanner } from '../components/StudyIllustrations.jsx';
import CustomHtmlLesson from '../../../components/CustomHtmlLesson.jsx';
import ConceptTutorial from '../../../components/ConceptTutorial.jsx';
import { fetchApprovedLessons, lessonsForSlot } from '../../../lib/learnContentApi.js';

export default function LearnUnitPage() {
  const { subjectId, chapterId } = useParams();
  const { user } = useAuth();
  const [tab, setTab] = useState('questions');
  const [filter, setFilter] = useState('all');
  const [customLessons, setCustomLessons] = useState([]);

  const subject = LMS_SUBJECTS.find((s) => s.id === subjectId);
  const chapter = subject?.chapters.find((c) => c.id === chapterId);

  useEffect(() => {
    if (!subject || !chapter) return undefined;
    let cancelled = false;
    fetchApprovedLessons({ subjectId: subject.id, chapterId: chapter.id }).then((rows) => {
      if (!cancelled) setCustomLessons(rows);
    });
    return () => {
      cancelled = true;
    };
  }, [subject, chapter]);

  const questions = useMemo(() => getUnitQuestions(subject, chapter), [subject, chapter]);
  const exercises = useMemo(() => getUnitExercises(chapter), [chapter]);
  const exerciseFlow = usesExerciseFlow(subject, chapter);
  const visible = useMemo(() => filterQuestions(questions, filter), [questions, filter]);
  const notes = useMemo(() => getUnitNotes(chapter), [chapter]);

  if (!subject) return <Navigate to="/learn" replace />;
  if (!canAccessSubject(user, subject.id)) return <Navigate to="/learn" replace />;
  if (!chapter) return <Navigate to={`/learn/${subjectId}`} replace />;

  const theme = getTheme(subject.id);
  const unitNo = chapter.unit ?? 1;

  return (
    <div className={`min-h-full ${theme.unitTint}`}>
      <header className="px-4 pt-4">
        <Link
          to={`/learn/${subject.id}`}
          className="inline-flex items-center gap-1 text-sm font-semibold text-[#1e3a5f]"
        >
          <ArrowLeft className="w-4 h-4" />
          Unit {unitNo}
        </Link>
        <h1 className="mt-1 text-[20px] font-extrabold text-[#1e3a5f] leading-snug">
          {displayUnitTitle(chapter, subject.id)}
        </h1>
      </header>

      <div className="px-4 mt-3">
        <div className="h-[132px] rounded-[22px] overflow-hidden shadow-sm">
          <OpenBookBanner />
        </div>
      </div>

      <div className="px-4 mt-4">
        <div className="flex bg-white rounded-full p-1 shadow-sm">
          <button
            type="button"
            onClick={() => setTab('questions')}
            className={`flex-1 text-sm font-bold py-2 rounded-full transition ${
              tab === 'questions' ? `${theme.badge} text-white` : 'text-slate-500'
            }`}
          >
            {exerciseFlow ? 'Exercises' : 'Questions'}
          </button>
          <button
            type="button"
            onClick={() => setTab('points')}
            className={`flex-1 text-sm font-bold py-2 rounded-full transition ${
              tab === 'points' ? `${theme.badge} text-white` : 'text-slate-500'
            }`}
          >
            Important Points
          </button>
        </div>
      </div>

      {tab === 'questions' ? (
        <section className="px-4 pt-4 pb-8">
          {exerciseFlow ? (
            <>
              <p className="text-[13px] font-bold text-[#1e3a5f] mb-3">
                Exercises : {exercises.length}
              </p>
              <ul className="space-y-2.5">
                {exercises.map((ex) => {
                  const name = displayExerciseName(ex);
                  const count = (ex.questions || []).length;
                  return (
                    <li key={ex.id}>
                      <Link
                        to={`/learn/${subject.id}/${chapter.id}/ex/${ex.id}`}
                        className="flex items-center gap-3 bg-white rounded-2xl px-3 py-3 shadow-sm border border-white/80"
                      >
                        <span
                          className={`w-12 h-12 rounded-2xl ${theme.badge} text-white text-[12px] font-extrabold flex items-center justify-center shrink-0`}
                        >
                          {name.code}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-[14px] font-extrabold text-[#1e3a5f] leading-snug">{name.ta}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {name.en} · {count} question{count === 1 ? '' : 's'}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </>
          ) : (
            <>
              <ul className="space-y-2">
                {visible.map((q) => (
                  <li key={q.id}>
                    <Link
                      to={`/learn/${subject.id}/${chapter.id}/q/${q.id}`}
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
                {visible.length === 0 && (
                  <p className="text-sm text-slate-500 text-center py-8">No questions in this filter.</p>
                )}
              </ul>

              <div className="mt-6">
                <p className="text-[13px] font-extrabold text-[#1e3a5f] mb-2">Quick Access</p>
                <div className="grid grid-cols-2 gap-2">
                  {QUICK_FILTERS.filter((f) => f.id !== 'all').map((chip) => {
                    const on = filter === chip.id;
                    return (
                      <button
                        key={chip.id}
                        type="button"
                        onClick={() => setFilter(on ? 'all' : chip.id)}
                        className={`text-left text-[12px] font-semibold rounded-2xl px-3 py-3 border ${
                          on ? `${theme.chip} ring-2 ${theme.ring}` : 'bg-white border-slate-100 text-slate-600'
                        }`}
                      >
                        {chip.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </section>
      ) : (
        <section className="px-4 pt-4 pb-8 space-y-4">
          {notes.keyPoints.length > 0 && (
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <p className="flex items-center gap-2 text-sm font-extrabold text-[#1e3a5f] mb-2">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                Key Points
              </p>
              <ul className="space-y-2">
                {notes.keyPoints.map((point) => (
                  <li key={point} className="text-[13px] text-slate-700 leading-relaxed flex gap-2">
                    <span className={`${theme.accent} font-black`}>•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {chapter.concepts?.map((concept) => (
            <ConceptTutorial
              key={concept.id}
              concept={concept}
              medium={subject.id === 'tamil' ? 'ta' : 'en'}
              colors={{
                bg: theme.badge,
                light: 'bg-slate-50',
                text: theme.accent,
                border: 'border-slate-100',
              }}
            />
          ))}

          {notes.textbookLessons.length > 0 && (
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <p className="text-sm font-extrabold text-[#1e3a5f] mb-2">Textbook lessons</p>
              <ul className="space-y-1.5 text-[13px] text-slate-700">
                {notes.textbookLessons.map((lesson) => (
                  <li key={lesson}>• {lesson}</li>
                ))}
              </ul>
            </div>
          )}

          {lessonsForSlot(customLessons, 'top_of_unit').concat(
            lessonsForSlot(customLessons, 'before_concepts'),
            lessonsForSlot(customLessons, 'after_concepts'),
            lessonsForSlot(customLessons, 'append_unit'),
          ).map((lesson) => (
            <CustomHtmlLesson key={lesson.id} lesson={lesson} colors={{ light: 'bg-white', border: 'border-slate-100', text: theme.accent, bg: theme.badge }} />
          ))}
        </section>
      )}
    </div>
  );
}
