import React, { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Lightbulb } from 'lucide-react';
import { LMS_SUBJECTS } from '../catalog/lmsCatalog.js';
import { getTheme } from '../theme.js';
import { displayExerciseName, getExerciseQuestions, getUnitExercises, getUnitQuestions } from '../utils/unitQuestions.js';
import { markViewed } from '../utils/learnAnalyticsStore.js';
import { canAccessSubject, fileToDataUrl, saveQuestionOverride } from '../utils/schoolOsStore.js';
import { useAuth } from '../../../context/AuthContext.jsx';
import LatexText from '../components/LatexText.jsx';

export default function LearnQuestionPage() {
  const { subjectId, chapterId, exerciseId, questionId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const subject = LMS_SUBJECTS.find((s) => s.id === subjectId);
  const chapter = subject?.chapters.find((c) => c.id === chapterId);
  const [rev, setRev] = useState(0);
  const exercise = exerciseId ? getUnitExercises(chapter).find((ex) => ex.id === exerciseId) : null;
  const questions = useMemo(() => {
    void rev;
    return exerciseId ? getExerciseQuestions(subject, chapter, exerciseId) : getUnitQuestions(subject, chapter);
  }, [subject, chapter, exerciseId, rev]);
  const index = questions.findIndex((q) => q.id === questionId);
  const question = index >= 0 ? questions[index] : null;

  useEffect(() => {
    if (subject && chapter && question && user?.username) {
      markViewed(user.username, subject.id, chapter.id, question.id, user.full_name);
    }
  }, [subject, chapter, question, user]);

  if (!subject) return <Navigate to="/learn" replace />;
  if (!canAccessSubject(user, subject.id)) return <Navigate to="/learn" replace />;
  if (!chapter) return <Navigate to={`/learn/${subjectId}`} replace />;
  if (!question) {
    return (
      <Navigate
        to={exerciseId ? `/learn/${subjectId}/${chapterId}/ex/${exerciseId}` : `/learn/${subjectId}/${chapterId}`}
        replace
      />
    );
  }

  const theme = getTheme(subject.id);
  const prev = index > 0 ? questions[index - 1] : null;
  const next = index < questions.length - 1 ? questions[index + 1] : null;
  const isMathsLatex = subject.id === 'mathematics' || question.isLatex;
  const exerciseName = exercise ? displayExerciseName(exercise) : null;
  const questionPath = (q) =>
    exercise
      ? `/learn/${subject.id}/${chapter.id}/ex/${exercise.id}/q/${q.id}`
      : `/learn/${subject.id}/${chapter.id}/q/${q.id}`;
  const backPath = exercise
    ? `/learn/${subject.id}/${chapter.id}/ex/${exercise.id}`
    : `/learn/${subject.id}/${chapter.id}`;

  const go = (q) => {
    if (q) navigate(questionPath(q));
  };

  return (
    <div className={`min-h-full ${theme.unitTint}`}>
      <header className="px-4 pt-4 pb-2">
        <Link
          to={backPath}
          className="inline-flex items-center gap-1 text-sm font-semibold text-[#1e3a5f]"
        >
          <ArrowLeft className="w-4 h-4" />
          {exerciseName
            ? `${exerciseName.ta} – வினா ${question.number}`
            : `Unit ${chapter.unit ?? ''} – Question ${question.number}`}
        </Link>
        <p className="text-xs font-bold text-slate-500 mt-1">{question.marksLabel}</p>
      </header>

      <article className="px-4 pb-24 space-y-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <span className={`shrink-0 w-9 h-9 rounded-xl ${theme.badge} text-white text-sm font-black flex items-center justify-center`}>
              Q{question.number}
            </span>
            <div className="min-w-0 flex-1">
              {question.lesson && (
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-1">
                  {question.lesson}
                </p>
              )}
              <p className="text-[15px] font-bold text-[#1e3a5f] leading-snug">{question.question}</p>
              {question.updatedBy && (
                <p className="text-[10px] font-bold text-emerald-700 mt-1">Updated by {question.updatedBy}</p>
              )}
              {question.imageDataUrl && (
                <img src={question.imageDataUrl} alt="" className="mt-3 max-h-48 rounded-xl" />
              )}
              {question.questionLatex && (
                <div className="mt-3 rounded-xl bg-sky-50 border border-sky-100 p-3 overflow-x-auto">
                  <LatexText text={question.questionLatex} />
                </div>
              )}
              {question.options?.length > 0 && (
                <ul className="mt-3 space-y-2">
                  {question.options.map((opt, i) => (
                    <li
                      key={opt}
                      className={`text-[13px] rounded-xl px-3 py-2 border ${
                        i === question.correctIndex
                          ? 'border-emerald-300 bg-emerald-50 text-emerald-900 font-medium'
                          : 'border-slate-100 text-slate-600'
                      }`}
                    >
                      {opt}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-xs font-extrabold uppercase tracking-wide text-amber-700 mb-2">Answer</p>
          {question.answerSteps?.length > 0 && (
            <ol className="space-y-3 mb-3">
              {question.answerSteps.map((step, i) => (
                <li key={i}>
                  {step.prompt && (
                    <p className="text-[13px] font-semibold text-slate-700 mb-1">{step.prompt}</p>
                  )}
                  {step.latex && (
                    <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 overflow-x-auto">
                      <LatexText text={step.latex} forceMath={isMathsLatex} />
                    </div>
                  )}
                </li>
              ))}
            </ol>
          )}
          {question.answerLatex && (
            <div className="mb-3 rounded-xl bg-slate-50 border border-slate-100 p-3 overflow-x-auto">
              <LatexText text={question.answerLatex} forceMath={isMathsLatex} />
            </div>
          )}
          {question.answer && (
            <LatexText text={question.answer} className="text-[14px] text-slate-800" />
          )}
        </div>

        {question.keyPoints?.length > 0 && (
          <div className="rounded-2xl bg-amber-50 border border-amber-100 p-4">
            <p className="flex items-center gap-2 text-sm font-extrabold text-amber-900 mb-2">
              <Lightbulb className="w-4 h-4" />
              Key Points
            </p>
            <ul className="space-y-1.5">
              {question.keyPoints.map((point) => (
                <li key={point} className="text-[13px] text-amber-950 flex gap-2">
                  <span>•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {chapter.keyPoints?.length > 0 && !question.keyPoints?.length && (
          <div className="rounded-2xl bg-amber-50 border border-amber-100 p-4">
            <p className="flex items-center gap-2 text-sm font-extrabold text-amber-900 mb-2">
              <Lightbulb className="w-4 h-4" />
              Key Points
            </p>
            <ul className="space-y-1.5">
              {chapter.keyPoints.slice(0, 4).map((point) => (
                <li key={point} className="text-[13px] text-amber-950 flex gap-2">
                  <span>•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {(user?.role === 'TEACHER' || user?.role === 'ADMIN') && (
          <TeacherEditPanel
            subject={subject}
            chapter={chapter}
            question={question}
            editor={user.username}
            onSaved={() => setRev((n) => n + 1)}
          />
        )}

        <div className="sticky bottom-[4.5rem] z-30 flex gap-3 pt-2 pb-1 bg-gradient-to-t from-[#f4f7fb] via-[#f4f7fb] to-transparent">
          <button
            type="button"
            disabled={!prev}
            onClick={() => go(prev)}
            className="flex-1 py-3 rounded-full border border-slate-200 bg-white text-sm font-bold text-[#1e3a5f] disabled:opacity-40 shadow-sm"
          >
            ‹ Previous
          </button>
          <button
            type="button"
            disabled={!next}
            onClick={() => go(next)}
            className={`flex-1 py-3 rounded-full text-sm font-bold text-white disabled:opacity-40 shadow-sm ${theme.btn}`}
          >
            Next ›
          </button>
        </div>
      </article>
    </div>
  );
}

function TeacherEditPanel({ subject, chapter, question, editor, onSaved }) {
  const [open, setOpen] = useState(false);
  const [questionText, setQuestionText] = useState(question.question || '');
  const [answerText, setAnswerText] = useState(question.answer || '');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setQuestionText(question.question || '');
    setAnswerText(question.answer || '');
    setSaved(false);
  }, [question.id, question.question, question.answer]);

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm border border-indigo-100">
      <button type="button" onClick={() => setOpen((v) => !v)} className="text-sm font-extrabold text-indigo-700">
        {open ? 'Close editor' : 'Edit this Q&A'}
      </button>
      {open && (
        <div className="mt-3 space-y-2">
          <textarea value={questionText} onChange={(e) => setQuestionText(e.target.value)} rows={3} className="w-full border rounded-xl px-3 py-2 text-sm" />
          <textarea value={answerText} onChange={(e) => setAnswerText(e.target.value)} rows={4} className="w-full border rounded-xl px-3 py-2 text-sm" />
          <label className="text-xs font-bold text-indigo-700">
            Replace image
            <input
              type="file"
              accept="image/*"
              className="mt-1 block w-full text-xs"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const imageDataUrl = await fileToDataUrl(file);
                saveQuestionOverride(subject.id, chapter.id, question.id, { imageDataUrl }, editor);
                setSaved(true);
                onSaved?.();
              }}
            />
          </label>
          <button
            type="button"
            onClick={() => {
              saveQuestionOverride(
                subject.id,
                chapter.id,
                question.id,
                { question: questionText, answer: answerText },
                editor,
              );
              setSaved(true);
              onSaved?.();
            }}
            className="w-full py-2 rounded-xl bg-indigo-600 text-white text-sm font-bold"
          >
            Save update
          </button>
          {saved && <p className="text-xs font-semibold text-emerald-700">Updated — students will see this immediately.</p>}
        </div>
      )}
    </div>
  );
}
