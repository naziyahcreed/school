import React, { useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext.jsx';
import { getAttempt, getExam, saveAttempt } from '../utils/schoolOsStore.js';
import LatexText from '../components/LatexText.jsx';

export default function LearnExamPage() {
  const { examId } = useParams();
  const { user } = useAuth();
  const exam = getExam(examId);
  const existing = getAttempt(examId, user?.username);
  const [answers, setAnswers] = useState(existing?.answers || {});
  const [done, setDone] = useState(Boolean(existing));

  const score = useMemo(() => {
    if (!done || !exam) return null;
    let marks = 0;
    let total = 0;
    exam.questions.forEach((q) => {
      total += q.marks || 1;
      if (q.options && typeof q.correctIndex === 'number') {
        if (Number(answers[q.id]) === q.correctIndex) marks += q.marks || 1;
      }
    });
    return { marks, total };
  }, [done, exam, answers]);

  if (!exam) return <Navigate to="/student" replace />;

  return (
    <div className="px-4 pt-4 pb-10">
      <Link to="/student" className="inline-flex items-center gap-1 text-sm font-semibold text-[#1e3a5f]">
        <ArrowLeft className="w-4 h-4" /> Dashboard
      </Link>
      <h1 className="mt-2 text-xl font-extrabold text-[#1e3a5f]">{exam.title}</h1>
      <p className="text-xs text-slate-500 mt-1">{exam.questions.length} questions · {exam.teacherName}</p>

      <ol className="mt-4 space-y-4">
        {exam.questions.map((q, i) => (
          <li key={q.id} className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-sm font-extrabold text-[#1e3a5f]">Q{i + 1}. {q.question}</p>
            {q.questionLatex && (
              <div className="mt-2"><LatexText text={q.questionLatex} /></div>
            )}
            {q.imageDataUrl && <img src={q.imageDataUrl} alt="" className="mt-2 max-h-40 rounded-xl" />}
            {q.options?.length ? (
              <ul className="mt-3 space-y-2">
                {q.options.map((opt, idx) => (
                  <li key={opt}>
                    <label className="flex gap-2 text-sm">
                      <input
                        type="radio"
                        name={q.id}
                        disabled={done}
                        checked={Number(answers[q.id]) === idx}
                        onChange={() => setAnswers((prev) => ({ ...prev, [q.id]: idx }))}
                      />
                      {opt}
                    </label>
                  </li>
                ))}
              </ul>
            ) : (
              <textarea
                disabled={done}
                value={answers[q.id] || ''}
                onChange={(e) => setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                rows={3}
                className="mt-3 w-full border rounded-xl px-3 py-2 text-sm"
                placeholder="Your answer"
              />
            )}
            {done && (
              <div className="mt-3 rounded-xl bg-emerald-50 p-3 text-sm">
                <p className="font-bold text-emerald-800">Answer key</p>
                {q.answerLatex ? <LatexText text={q.answerLatex} forceMath /> : <p>{q.answer}</p>}
              </div>
            )}
          </li>
        ))}
      </ol>

      {!done ? (
        <button
          type="button"
          onClick={() => {
            saveAttempt(exam.id, user.username, { answers });
            setDone(true);
          }}
          className="mt-4 w-full py-3 rounded-2xl bg-[#1e3a5f] text-white font-bold"
        >
          Submit exam
        </button>
      ) : (
        <p className="mt-4 text-center font-bold text-[#1e3a5f]">
          Submitted{score && score.total ? ` · MCQ score ${score.marks}/${score.total}` : ''}
        </p>
      )}
    </div>
  );
}
