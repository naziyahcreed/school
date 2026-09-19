import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  BookOpen, ChevronRight, ChevronDown, Search, GraduationCap,
  CheckCircle2, Lightbulb, FlaskConical, Languages, Globe2, Calculator,
  Menu, X, Home, ListChecks, LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { GRADE10_SUBJECTS, GRADE10_LEARN_META } from '../features/learning/catalog/grade10Catalog.js';
import ConceptTutorial, { ConceptJumpNav } from '../components/ConceptTutorial';
import CustomHtmlLesson from '../components/CustomHtmlLesson';
import TamilExamGuideEmbed from '../components/TamilExamGuideEmbed';
import { fetchApprovedLessons, lessonsForSlot } from '../lib/learnContentApi';

const SUBJECT_ICONS = {
  mathematics: Calculator,
  science: FlaskConical,
  english: Languages,
  'social-science': Globe2,
  tamil: BookOpen,
};

const COLOR_MAP = {
  indigo: {
    bg: 'bg-indigo-600',
    light: 'bg-indigo-50',
    text: 'text-indigo-700',
    border: 'border-indigo-200',
    ring: 'ring-indigo-500',
  },
  emerald: {
    bg: 'bg-emerald-600',
    light: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    ring: 'ring-emerald-500',
  },
  blue: {
    bg: 'bg-blue-600',
    light: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    ring: 'ring-blue-500',
  },
  amber: {
    bg: 'bg-amber-600',
    light: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    ring: 'ring-amber-500',
  },
  rose: {
    bg: 'bg-rose-600',
    light: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
    ring: 'ring-rose-500',
  },
};

function pickText(chapter, medium, field) {
  if (field === 'overview') {
    if (medium === 'en') return chapter.overview || chapter.overviewEn || chapter.overviewTa || '';
    if (medium === 'ta') return chapter.overviewTa || chapter.overview || chapter.overviewEn || '';
    const en = chapter.overview || chapter.overviewEn || '';
    const ta = chapter.overviewTa || '';
    if (en && ta && en !== ta) return `${ta}\n\n— English —\n${en}`;
    return ta || en;
  }
  if (medium === 'ta' && chapter[`${field}Ta`]) return chapter[`${field}Ta`];
  return chapter[field] || chapter[`${field}En`] || '';
}

function pickSectionBody(section, medium) {
  const en = section.bodyEn || (section.body && !section.bodyEn ? section.body : '');
  const ta = section.body || '';
  if (medium === 'en') return en || ta;
  if (medium === 'ta') return ta || en;
  if (en && ta && en !== ta) return `${ta}\n\n— English —\n${en}`;
  return ta || en;
}

function LessonSlot({ lessons, colors }) {
  if (!lessons?.length) return null;
  return (
    <div className="space-y-6">
      {lessons.map((l) => (
        <CustomHtmlLesson key={l.id} lesson={l} colors={colors} />
      ))}
    </div>
  );
}

function ChapterContent({ chapter, subject, medium, colors }) {
  const [quizAnswers, setQuizAnswers] = useState({});
  const [showQuizResult, setShowQuizResult] = useState(false);
  const [customLessons, setCustomLessons] = useState([]);

  useEffect(() => {
    let cancelled = false;
    fetchApprovedLessons({ subjectId: subject.id, chapterId: chapter.id }).then((rows) => {
      if (!cancelled) setCustomLessons(rows);
    });
    return () => {
      cancelled = true;
    };
  }, [subject.id, chapter.id]);

  const inlineAfterConcept = (conceptId) =>
    customLessons.filter(
      (l) => l.slot === 'inline_concept' && l.concept_id === conceptId,
    );

  const overview = pickText(chapter, medium, 'overview') || chapter.overview;

  const scoreQuiz = () => {
    if (!chapter.quiz?.length) return 0;
    let correct = 0;
    chapter.quiz.forEach((item, idx) => {
      if (quizAnswers[idx] === item.answer) correct += 1;
    });
    return correct;
  };

  const showTamilExamGuide = subject.id === 'tamil' && (chapter.unit === 1 || chapter.unit === 2);

  return (
    <>
      {showTamilExamGuide && (
        <div className="w-full max-w-[1600px] mx-auto mb-10 px-0 md:px-0">
          <TamilExamGuideEmbed unit={chapter.unit} />
        </div>
      )}
    <article className={`${showTamilExamGuide ? 'max-w-4xl mx-auto' : 'max-w-4xl'}`}>
      <nav className="text-sm text-gray-500 mb-4 flex flex-wrap items-center gap-1">
        <span>Grade {GRADE10_LEARN_META.grade}</span>
        <ChevronRight className="w-4 h-4" />
        <span className={colors.text}>{subject.name}</span>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-800 font-medium">{chapter.title}</span>
      </nav>

      <header className={`rounded-2xl p-6 md:p-8 ${colors.light} border ${colors.border} mb-8`}>
        <div className="flex flex-wrap gap-2 mb-3">
          {chapter.term && (
            <span className="text-xs font-bold uppercase tracking-wide bg-white/80 px-2 py-1 rounded-lg text-gray-600">
              Term {chapter.term}
            </span>
          )}
          {chapter.unit != null && (
            <span className={`text-xs font-bold uppercase tracking-wide ${colors.bg} text-white px-2 py-1 rounded-lg`}>
              Unit {chapter.unit}
            </span>
          )}
          {chapter.unitLabel && (
            <span className="text-xs font-bold uppercase tracking-wide bg-white/80 px-2 py-1 rounded-lg text-gray-600">
              {chapter.unitLabel}
            </span>
          )}
          {chapter.duration && (
            <span className="text-xs font-medium text-gray-500 bg-white/80 px-2 py-1 rounded-lg">
              {chapter.duration}
            </span>
          )}
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3">{chapter.title}</h1>
        {medium === 'both' && chapter.titleTa && chapter.title !== chapter.titleTa && (
          <p className="text-lg text-gray-600 mb-3 font-medium">{chapter.titleTa}</p>
        )}
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">{overview}</p>
        {chapter.textbookLessons?.length > 0 && (
          <div className="mt-5 pt-5 border-t border-white/60">
            <p className="text-xs font-bold text-gray-500 uppercase mb-2">School textbook lessons in this unit</p>
            <ul className="grid sm:grid-cols-2 gap-1.5 text-sm text-gray-700">
              {chapter.textbookLessons.map((lesson) => (
                <li key={lesson} className="flex gap-2">
                  <span className={`${colors.text} font-bold`}>•</span>
                  {lesson}
                </li>
              ))}
            </ul>
          </div>
        )}
      </header>

      <LessonSlot lessons={lessonsForSlot(customLessons, 'top_of_unit')} colors={colors} />

      {chapter.concepts?.length > 0 && (
        <>
          <ConceptJumpNav concepts={chapter.concepts} colors={colors} />
          <div className="mb-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-900">
            <strong>Slow-learner path:</strong> Read concepts in order (1 → {chapter.concepts.length}). Each card has
            simple idea, steps, full explanation, example, and mistakes to avoid. Finish all before your school unit test.
          </div>
        </>
      )}

      <LessonSlot lessons={lessonsForSlot(customLessons, 'before_concepts')} colors={colors} />

      <div className="space-y-10">
        {chapter.concepts?.length > 0 ? (
          <section id="learn">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <BookOpen className={`w-5 h-5 ${colors.text}`} />
              Complete unit tutorials ({chapter.concepts.length} concepts)
            </h2>
            <div className="space-y-8">
              {chapter.concepts.map((concept) => (
                <React.Fragment key={concept.id}>
                  <ConceptTutorial concept={concept} colors={colors} medium={medium} />
                  <LessonSlot lessons={inlineAfterConcept(concept.id)} colors={colors} />
                </React.Fragment>
              ))}
            </div>
          </section>
        ) : (
          <section id="learn">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <BookOpen className={`w-5 h-5 ${colors.text}`} />
              Learn
            </h2>
            <div className="space-y-6">
              {chapter.sections?.map((sec, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-2">{sec.heading}</h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{pickSectionBody(sec, medium)}</p>
                  {sec.formula && (
                    <div className={`mt-4 p-4 rounded-xl font-mono text-sm ${colors.light} ${colors.text} border ${colors.border}`}>
                      {sec.formula}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        <LessonSlot lessons={lessonsForSlot(customLessons, 'after_concepts')} colors={colors} />

        {chapter.examples?.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Lightbulb className={`w-5 h-5 ${colors.text}`} />
              Worked Examples
            </h2>
            <div className="space-y-4">
              {chapter.examples.map((ex, i) => (
                <div key={i} className="bg-slate-900 text-slate-100 rounded-xl p-5 overflow-x-auto">
                  <p className="text-amber-300 font-semibold text-sm mb-2">{ex.title}</p>
                  <p className="text-slate-300 text-sm mb-3">
                    <span className="text-emerald-400 font-medium">Problem: </span>
                    {ex.problem}
                  </p>
                  <pre className="text-sm whitespace-pre-wrap font-mono text-slate-100 bg-slate-800/50 p-4 rounded-lg">
                    {ex.solution}
                  </pre>
                </div>
              ))}
            </div>
          </section>
        )}

        {chapter.keyPoints?.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <ListChecks className={`w-5 h-5 ${colors.text}`} />
              Key Points (Exam Focus)
            </h2>
            <ul className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
              {chapter.keyPoints.map((point, i) => (
                <li key={i} className="flex gap-3 text-gray-700">
                  <CheckCircle2 className={`w-5 h-5 shrink-0 ${colors.text}`} />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <LessonSlot lessons={lessonsForSlot(customLessons, 'append_unit')} colors={colors} />

        {chapter.quiz?.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Practice (MCQ)</h2>
            <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-6">
              {chapter.quiz.map((item, qIdx) => (
                <div key={qIdx}>
                  <p className="font-medium text-gray-800 mb-3">
                    {qIdx + 1}. {item.q}
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {item.options.map((opt, oIdx) => {
                      const selected = quizAnswers[qIdx] === oIdx;
                      const show = showQuizResult;
                      const correct = item.answer === oIdx;
                      let cls = 'border-gray-200 hover:border-gray-300';
                      if (selected) cls = `border-2 ${colors.border} ${colors.light}`;
                      if (show && correct) cls = 'border-2 border-emerald-500 bg-emerald-50';
                      if (show && selected && !correct) cls = 'border-2 border-rose-400 bg-rose-50';
                      return (
                        <button
                          key={oIdx}
                          type="button"
                          onClick={() => setQuizAnswers((prev) => ({ ...prev, [qIdx]: oIdx }))}
                          className={`text-left px-4 py-3 rounded-xl border text-sm transition-colors ${cls}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setShowQuizResult(true)}
                className={`${colors.bg} text-white px-6 py-2.5 rounded-xl font-semibold text-sm`}
              >
                Check Answers
              </button>
              {showQuizResult && (
                <p className="text-sm font-medium text-gray-700">
                  Score: {scoreQuiz()} / {chapter.quiz.length}
                </p>
              )}
            </div>
          </section>
        )}
      </div>
    </article>
    </>
  );
}

export default function StudentLearning() {
  const { user, logout } = useAuth();
  const [searchParams] = useSearchParams();
  const [subjectId, setSubjectId] = useState(GRADE10_SUBJECTS[0].id);
  const [chapterId, setChapterId] = useState(GRADE10_SUBJECTS[0].chapters[0].id);
  const [medium, setMedium] = useState('en');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [expandedSubjects, setExpandedSubjects] = useState({ [GRADE10_SUBJECTS[0].id]: true });

  useEffect(() => {
    const sub = searchParams.get('subject');
    const unit = searchParams.get('unit');
    if (!sub) return;
    const subjectMatch = GRADE10_SUBJECTS.find((s) => s.id === sub);
    if (!subjectMatch) return;
    setSubjectId(sub);
    setExpandedSubjects((prev) => ({ ...prev, [sub]: true }));
    if (unit && subjectMatch.chapters.some((c) => c.id === unit)) {
      setChapterId(unit);
    } else {
      setChapterId(subjectMatch.chapters[0].id);
    }
  }, [searchParams]);

  const subject = useMemo(
    () => GRADE10_SUBJECTS.find((s) => s.id === subjectId) ?? GRADE10_SUBJECTS[0],
    [subjectId],
  );

  const chapter = useMemo(
    () => subject.chapters.find((c) => c.id === chapterId) ?? subject.chapters[0],
    [subject, chapterId],
  );

  const colors = COLOR_MAP[subject.color] || COLOR_MAP.indigo;
  const SubjectIcon = SUBJECT_ICONS[subject.id] || BookOpen;

  const filteredSubjects = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return GRADE10_SUBJECTS;
    return GRADE10_SUBJECTS.map((s) => ({
      ...s,
      chapters: s.chapters.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          (c.titleTa && c.titleTa.includes(q)) ||
          (c.overview && c.overview.toLowerCase().includes(q)),
      ),
    })).filter((s) => s.chapters.length > 0 || s.name.toLowerCase().includes(q));
  }, [search]);

  const selectChapter = (sId, cId) => {
    setSubjectId(sId);
    setChapterId(cId);
    setExpandedSubjects((prev) => ({ ...prev, [sId]: true }));
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleSubject = (sId) => {
    setExpandedSubjects((prev) => ({ ...prev, [sId]: !prev[sId] }));
  };

  const sidebar = (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Samacheer Kalvi</p>
        <p className="font-bold text-gray-900">Grade {GRADE10_LEARN_META.grade} Syllabus</p>
        <p className="text-xs text-gray-500 mt-1">Unit 1 & 2 · {subject.name}</p>
        <p className="text-[10px] text-gray-400 mt-1 leading-snug">{GRADE10_LEARN_META.coverageNote}</p>
      </div>
      <div className="p-3 border-b border-gray-100">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="Search topics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        {filteredSubjects.map((s) => {
          const Icon = SUBJECT_ICONS[s.id] || BookOpen;
          const open = expandedSubjects[s.id];
          const c = COLOR_MAP[s.color];
          return (
            <div key={s.id}>
              <button
                type="button"
                onClick={() => toggleSubject(s.id)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 text-left"
              >
                {open ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
                <Icon className={`w-4 h-4 ${c.text}`} />
                <span className="font-semibold text-sm text-gray-800 flex-1">{s.name}</span>
                <span className="text-xs text-gray-400">{s.chapters.length}</span>
              </button>
              {open && (
                <ul className="ml-4 pl-2 border-l border-gray-200 mb-2 space-y-0.5">
                  {s.chapters.map((ch) => (
                    <li key={ch.id}>
                      <button
                        type="button"
                        onClick={() => selectChapter(s.id, ch.id)}
                        className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                          subjectId === s.id && chapterId === ch.id
                            ? `${c.light} ${c.text} font-semibold`
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {ch.title}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <GraduationCap className={`w-7 h-7 hidden sm:block ${colors.text}`} />
            <div>
              <Link to="/" className="font-extrabold text-gray-900 hover:text-indigo-600">
                Vidhya Shakthi <span className="text-indigo-600">Learn</span>
              </Link>
              <p className="text-xs text-gray-500 hidden sm:block">
                {GRADE10_LEARN_META.academicYear} · {GRADE10_LEARN_META.board} · Units 1–2 only
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex rounded-xl border border-gray-200 p-0.5 bg-gray-50">
              {[
                { id: 'en', label: 'English' },
                { id: 'ta', label: 'Tamil' },
                { id: 'both', label: 'Both' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMedium(m.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    medium === m.id ? 'bg-white shadow text-indigo-700' : 'text-gray-500'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
            {(user?.role === 'ADMIN' || user?.role === 'TEACHER') && (
              <Link
                to="/dashboard"
                className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-lg hover:bg-gray-50"
              >
                <Home className="w-4 h-4" />
                <span className="hidden md:inline">Dashboard</span>
              </Link>
            )}
            <span className="hidden md:inline text-xs text-gray-500">{user?.full_name}</span>
            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-1 text-sm font-medium text-rose-600 hover:bg-rose-50 px-3 py-2 rounded-lg"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex max-w-[1600px] mx-auto w-full">
        <aside className="hidden lg:block w-72 shrink-0 border-r border-gray-200 bg-white sticky top-14 h-[calc(100vh-3.5rem)] overflow-hidden">
          {sidebar}
        </aside>

        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button type="button" className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} aria-label="Close" />
            <div className="absolute left-0 top-0 bottom-0 w-[min(100%,20rem)] bg-white shadow-xl">
              <div className="flex justify-end p-2">
                <button type="button" onClick={() => setSidebarOpen(false)} className="p-2 rounded-lg hover:bg-gray-100">
                  <X className="w-5 h-5" />
                </button>
              </div>
              {sidebar}
            </div>
          </div>
        )}

        <main className="flex-1 min-w-0 p-4 md:p-8 lg:p-10">
          <div className="mb-6 p-4 rounded-xl bg-indigo-50 border border-indigo-100 text-sm text-indigo-900">
            <strong>Current school syllabus:</strong> {GRADE10_LEARN_META.textbookEdition}. Each subject has{' '}
            <strong>Unit 1</strong> and <strong>Unit 2</strong> tutorials matching your classroom textbook order.
          </div>
          <div className="mb-6 lg:hidden flex rounded-xl border border-gray-200 p-0.5 bg-white">
            {['en', 'ta', 'both'].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMedium(m)}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg capitalize ${
                  medium === m ? 'bg-indigo-600 text-white' : 'text-gray-500'
                }`}
              >
                {m === 'both' ? 'Both' : m === 'en' ? 'English' : 'Tamil'}
              </button>
            ))}
          </div>

          {!search && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-8">
              {GRADE10_SUBJECTS.map((s) => {
                const Icon = SUBJECT_ICONS[s.id] || BookOpen;
                const c = COLOR_MAP[s.color];
                const active = s.id === subjectId;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setSubjectId(s.id);
                      setChapterId(s.chapters[0].id);
                      setExpandedSubjects((prev) => ({ ...prev, [s.id]: true }));
                    }}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      active ? `ring-2 ${c.ring} ${c.light} ${c.border}` : 'bg-white border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <Icon className={`w-6 h-6 mb-2 ${c.text}`} />
                    <p className="font-bold text-sm text-gray-900">{s.name}</p>
                    <p className="text-xs text-gray-500 mt-1">2 units</p>
                  </button>
                );
              })}
            </div>
          )}

          {chapter && (
            <ChapterContent chapter={chapter} subject={subject} medium={medium} colors={colors} />
          )}

          <footer className="mt-16 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
            <p>
              Content aligned to Samacheer Kalvi SSLC Grade {GRADE10_LEARN_META.grade} · Study notes for revision — refer official textbook for complete syllabus.
            </p>
            <p className="mt-2 flex items-center justify-center gap-2">
              <SubjectIcon className="w-4 h-4" />
              Now reading: <strong className="text-gray-700">{chapter?.title}</strong>
            </p>
          </footer>
        </main>

        <aside className="hidden xl:block w-56 shrink-0 p-6 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto">
          <p className="text-xs font-bold text-gray-400 uppercase mb-3">On this page</p>
          <ul className="text-sm space-y-2 text-gray-600">
            <li><a href="#learn" className="hover:text-indigo-600">Learn</a></li>
            <li>Worked Examples</li>
            <li>Key Points</li>
            <li>Quick Practice</li>
          </ul>
          <div className={`mt-8 p-4 rounded-xl ${colors.light} border ${colors.border}`}>
            <p className="text-xs font-bold text-gray-500 uppercase mb-2">Tip</p>
            <p className="text-sm text-gray-700">
              Read each section, try examples without looking, then take the MCQ quiz — same flow as GeeksforGeeks tutorials.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
