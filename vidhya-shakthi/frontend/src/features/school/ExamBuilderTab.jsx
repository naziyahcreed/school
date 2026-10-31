import React, { useMemo, useState } from 'react';
import { ImagePlus, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  SUBJECT_OPTIONS,
  canAccessSubject,
  fileToDataUrl,
  getAccessibleSubjectIds,
  listExams,
  saveExam,
} from '../learning/utils/schoolOsStore.js';

export default function ExamBuilderTab() {
  const { user } = useAuth();
  const allowed = getAccessibleSubjectIds(user);
  const [tick, setTick] = useState(0);
  const exams = useMemo(
    () => listExams({ teacherId: user?.role === 'ADMIN' ? undefined : user?.username, admin: user?.role === 'ADMIN' }),
    [user, tick],
  );

  const [title, setTitle] = useState('');
  const [subjectId, setSubjectId] = useState(allowed[0] || 'mathematics');
  const [questions, setQuestions] = useState([]);
  const [custom, setCustom] = useState({ question: '', answer: '', marks: 2 });
  const [picker, setPicker] = useState(null);
  const [error, setError] = useState('');

  const addCustom = async (file) => {
    try {
      const imageDataUrl = file ? await fileToDataUrl(file) : null;
      setQuestions((prev) => [
        ...prev,
        {
          id: `cq-${Date.now()}`,
          source: 'custom',
          question: custom.question,
          answer: custom.answer,
          marks: Number(custom.marks) || 2,
          imageDataUrl,
        },
      ]);
      setCustom({ question: '', answer: '', marks: 2 });
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const openPicker = async () => {
    const mod = await import('../learning/catalog/lmsCatalog.js');
    const subject = mod.LMS_SUBJECTS.find((s) => s.id === subjectId);
    setPicker({ subject, unitId: subject?.chapters?.[0]?.id || '', selected: {} });
  };

  const addPicked = () => {
    if (!picker?.subject) return;
    const chapter = picker.subject.chapters.find((c) => c.id === picker.unitId);
    const picked = (chapter?.questions || []).filter((q) => picker.selected[q.id]);
    setQuestions((prev) => [
      ...prev,
      ...picked.map((q) => ({
        id: `lms-${q.id}-${Date.now()}`,
        source: 'lms',
        subjectId,
        chapterId: chapter.id,
        questionId: q.id,
        question: q.question,
        answer: q.answer,
        questionLatex: q.questionLatex,
        answerLatex: q.answerLatex,
        marks: q.marks || 2,
        options: q.options,
        correctIndex: q.correctIndex,
      })),
    ]);
    setPicker(null);
  };

  const publish = () => {
    if (!title.trim() || !questions.length) {
      setError('Add a title and at least one question.');
      return;
    }
    if (!canAccessSubject(user, subjectId)) {
      setError('You do not have this subject.');
      return;
    }
    saveExam({
      id: `exam-${Date.now()}`,
      title: title.trim(),
      subjectId,
      teacherId: user.username,
      teacherName: user.full_name,
      questions,
      published: true,
    });
    setTitle('');
    setQuestions([]);
    setTick((n) => n + 1);
    setError('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Create exam</h2>
        <p className="text-sm text-gray-500">Pick Learn Hub questions or write new ones and upload an image.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Exam title — e.g. Unit 1 slip test"
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
        />
        <select
          value={subjectId}
          onChange={(e) => setSubjectId(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm"
        >
          {SUBJECT_OPTIONS.filter((s) => allowed.includes(s.id)).map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>

        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={openPicker} className="px-3 py-2 rounded-xl bg-indigo-600 text-white text-sm font-bold flex items-center gap-1">
            <Plus className="w-4 h-4" /> From Learn Hub
          </button>
        </div>

        {picker && (
          <div className="border border-indigo-100 rounded-xl p-3 space-y-2 bg-indigo-50/40">
            <select
              value={picker.unitId}
              onChange={(e) => setPicker({ ...picker, unitId: e.target.value, selected: {} })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
            >
              {(picker.subject?.chapters || []).map((ch) => (
                <option key={ch.id} value={ch.id}>Unit {ch.unit} — {ch.title}</option>
              ))}
            </select>
            <ul className="max-h-48 overflow-y-auto space-y-1">
              {(picker.subject?.chapters.find((c) => c.id === picker.unitId)?.questions || []).slice(0, 40).map((q) => (
                <li key={q.id}>
                  <label className="flex items-start gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={Boolean(picker.selected[q.id])}
                      onChange={(e) => setPicker({ ...picker, selected: { ...picker.selected, [q.id]: e.target.checked } })}
                    />
                    <span>{q.question}</span>
                  </label>
                </li>
              ))}
            </ul>
            <div className="flex gap-2">
              <button type="button" onClick={addPicked} className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold">Add selected</button>
              <button type="button" onClick={() => setPicker(null)} className="px-3 py-1.5 rounded-lg bg-white border text-xs font-bold">Cancel</button>
            </div>
          </div>
        )}

        <div className="border border-dashed border-gray-200 rounded-xl p-3 space-y-2">
          <p className="text-xs font-bold uppercase text-gray-500">Write a new question</p>
          <textarea value={custom.question} onChange={(e) => setCustom({ ...custom, question: e.target.value })} rows={2} className="w-full border rounded-xl px-3 py-2 text-sm" placeholder="Question" />
          <textarea value={custom.answer} onChange={(e) => setCustom({ ...custom, answer: e.target.value })} rows={2} className="w-full border rounded-xl px-3 py-2 text-sm" placeholder="Answer key" />
          <div className="flex flex-wrap items-center gap-2">
            <input type="number" min="1" value={custom.marks} onChange={(e) => setCustom({ ...custom, marks: e.target.value })} className="w-20 border rounded-xl px-2 py-1.5 text-sm" />
            <label className="text-xs font-semibold text-indigo-700 flex items-center gap-1 cursor-pointer">
              <ImagePlus className="w-4 h-4" /> Image
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => addCustom(e.target.files?.[0])}
              />
            </label>
            <button type="button" onClick={() => addCustom(null)} className="px-3 py-1.5 rounded-lg bg-slate-800 text-white text-xs font-bold">Add question</button>
          </div>
        </div>

        {error && <p className="text-sm text-rose-600">{error}</p>}

        <ul className="space-y-2">
          {questions.map((q, i) => (
            <li key={q.id} className="flex gap-2 items-start bg-slate-50 rounded-xl p-3">
              <span className="text-xs font-black text-indigo-700 mt-0.5">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">{q.question}</p>
                {q.imageDataUrl && <img src={q.imageDataUrl} alt="" className="mt-2 max-h-28 rounded-lg" />}
              </div>
              <button type="button" onClick={() => setQuestions((prev) => prev.filter((x) => x.id !== q.id))} className="text-rose-500">
                <Trash2 className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>

        <button type="button" onClick={publish} className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-bold">
          Publish exam to students
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h3 className="font-bold text-gray-800">Published papers</h3>
        <ul className="mt-3 space-y-2 text-sm">
          {exams.map((exam) => (
            <li key={exam.id} className="flex justify-between gap-3 border-b border-gray-50 pb-2">
              <span className="font-semibold">{exam.title}</span>
              <span className="text-gray-500">{exam.questions?.length || 0} Q · {SUBJECT_OPTIONS.find((s) => s.id === exam.subjectId)?.name}</span>
            </li>
          ))}
          {!exams.length && <p className="text-gray-500">No exams yet.</p>}
        </ul>
      </div>
    </div>
  );
}
