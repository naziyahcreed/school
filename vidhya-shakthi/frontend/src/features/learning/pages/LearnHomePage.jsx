import React, { useEffect } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { BookOpen, Languages, Calculator, FlaskConical, Globe2, Menu } from 'lucide-react';
import { LMS_SUBJECTS } from '../catalog/lmsCatalog.js';
import { getTheme, orderedSubjects } from '../theme.js';
import { BookPlantHero } from '../components/StudyIllustrations.jsx';
import { useAuth } from '../../../context/AuthContext.jsx';
import { getAccessibleSubjectIds } from '../utils/schoolOsStore.js';

const ICONS = {
  tamil: BookOpen,
  english: Languages,
  mathematics: Calculator,
  science: FlaskConical,
  'social-science': Globe2,
};

export default function LearnHomePage() {
  const { user } = useAuth();
  const [params] = useSearchParams();
  const subject = params.get('subject');
  const unit = params.get('unit');
  const allowed = new Set(getAccessibleSubjectIds(user));
  const subjects = orderedSubjects(LMS_SUBJECTS).filter((s) => allowed.has(s.id));

  useEffect(() => {
    if (window.location.hash === '#subjects') {
      document.getElementById('subjects')?.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  if (subject && unit) return <Navigate to={`/learn/${subject}/${unit}`} replace />;
  if (subject) return <Navigate to={`/learn/${subject}`} replace />;

  return (
    <div className="min-h-full">
      <header className="relative overflow-hidden rounded-b-[28px] bg-gradient-to-br from-[#16324f] via-[#1c4a6e] to-[#2a6f8f] text-white px-5 pt-5 pb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center border border-white/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-extrabold leading-tight">10th Study Hub</p>
              <p className="text-[10px] text-sky-100/80">Learn · Practice · Score High</p>
            </div>
          </div>
          <Link to="/learn/profile" className="p-2 rounded-lg bg-white/10" aria-label="Menu">
            <Menu className="w-5 h-5" />
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-[1.1fr_0.9fr] gap-2 items-end">
          <div>
            <h1 className="text-[28px] leading-[1.15] font-extrabold tracking-tight">
              Your 10th Grade
              <br />
              Success Journey
            </h1>
            <p className="mt-2 text-xs text-sky-100/90">Study Smart · Learn Better · Achieve More</p>
          </div>
          <div className="h-28">
            <BookPlantHero />
          </div>
        </div>
      </header>

      <section id="subjects" className="px-5 pt-6 pb-8 scroll-mt-4">
        <h2 className="text-[17px] font-extrabold text-[#1e3a5f]">Choose Your Subject</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          {user?.role === 'STUDENT' ? 'Only subjects from your teachers' : 'Only subjects assigned to you'}
        </p>
        {!subjects.length && (
          <p className="mt-4 text-sm text-amber-800 bg-amber-50 rounded-2xl p-4">No subject assigned yet. Ask admin.</p>
        )}

        <div className="mt-4 grid grid-cols-3 gap-2.5">
          {subjects.slice(0, 3).map((subject) => (
            <SubjectCard key={subject.id} subject={subject} />
          ))}
        </div>
        <div className="mt-2.5 grid grid-cols-2 gap-2.5 px-6">
          {subjects.slice(3).map((subject) => (
            <SubjectCard key={subject.id} subject={subject} />
          ))}
        </div>

        <p className="mt-8 text-center text-[13px] italic text-slate-500">
          “Small steps every day
          <br />
          lead to big results.”
        </p>
      </section>
    </div>
  );
}

function SubjectCard({ subject }) {
  const theme = getTheme(subject.id);
  const Icon = ICONS[subject.id] || BookOpen;

  return (
    <Link
      to={`/learn/${subject.id}`}
      className={`rounded-2xl ${theme.cardBg} px-3 py-4 text-center shadow-sm border border-white/70 active:scale-[0.98] transition`}
    >
      <div className={`mx-auto w-10 h-10 rounded-xl ${theme.cardIconBg} flex items-center justify-center mb-2`}>
        {subject.id === 'mathematics' ? (
          <span className="text-lg font-black leading-none">∑</span>
        ) : (
          <Icon className="w-5 h-5" />
        )}
      </div>
      <p className="text-[12px] font-extrabold text-[#1e3a5f] leading-tight">{subject.name}</p>
      <p className="text-[10px] text-slate-500 mt-0.5">{subject.nameTa}</p>
    </Link>
  );
}
