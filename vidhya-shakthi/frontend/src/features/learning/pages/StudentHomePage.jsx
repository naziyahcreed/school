import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock3, CheckCircle2, ChevronRight, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext.jsx';
import { getTheme, SUBJECT_ORDER, SUBJECT_THEMES } from '../theme.js';
import { formatDuration, formatLastActive, getTimeSnapshot } from '../utils/learnAnalyticsStore.js';
import {
  createAccessRequest,
  getAccessibleSubjectIds,
  getDailyQuotaSeconds,
  getPendingRequest,
  getRemainingSeconds,
  getTeachersForStudent,
  listExams,
} from '../utils/schoolOsStore.js';

const FALLBACK_SUBJECTS = SUBJECT_ORDER.map((id) => ({
  id,
  name: SUBJECT_THEMES[id].taglineEn,
}));

export default function StudentHomePage() {
  const { user } = useAuth();
  const time = getTimeSnapshot(user?.username, user?.full_name);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    let live = true;
    import('../utils/learnAnalytics.js').then((mod) => {
      if (live) setStats(mod.getStudentStats(user?.username, user?.full_name));
    });
    return () => {
      live = false;
    };
  }, [user?.username, user?.full_name]);

  const allowed = new Set(getAccessibleSubjectIds(user));
  const remaining = getRemainingSeconds(user?.username);
  const quota = getDailyQuotaSeconds(user?.username);
  const pending = getPendingRequest(user?.username);
  const [asked, setAsked] = useState(false);
  const teachers = getTeachersForStudent(user?.username);
  const exams = listExams({ studentId: user?.username });
  const rows = (stats?.bySubject || FALLBACK_SUBJECTS.map((subject) => ({
    subject, done: 0, total: 0, pct: 0, seconds: 0,
  }))).filter((row) => allowed.has(row.subject.id));
  const continueSubject = rows.find((s) => s.done > 0 && s.pct < 100) || rows[0];

  return (
    <div className="px-5 pt-8 pb-8">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Student dashboard</p>
      <h1 className="text-[26px] font-extrabold text-[#1e3a5f] leading-tight mt-1">
        Hi, {user?.full_name?.split('(')[0].trim() || 'Student'}
      </h1>
      <p className="text-sm text-slate-500 mt-1">Std 10 · Samacheer Kalvi · login-based study</p>
      <p className="text-[11px] text-slate-400 mt-1">
        Teachers: {teachers.map((t) => t.full_name.split('(')[0].trim()).join(', ') || 'Not assigned'}
      </p>
      <p className="text-[11px] text-slate-400">Last study {formatLastActive(stats?.lastActive || time.lastActive)}</p>

      <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm">
        <p className="text-[11px] font-bold uppercase text-slate-400">Today’s access</p>
        <p className="text-xl font-extrabold text-[#1e3a5f] mt-1">
          {formatDuration(remaining)} left of {formatDuration(quota)}
        </p>
        {remaining <= 0 && !pending && !asked && (
          <button
            type="button"
            onClick={() => {
              createAccessRequest({
                username: user.username,
                full_name: user.full_name,
                kind: 'extra-today',
                minutes: 60,
                reason: 'Need extra hour today',
              });
              setAsked(true);
            }}
            className="mt-3 w-full py-2 rounded-xl bg-[#1e3a5f] text-white text-sm font-bold"
          >
            Request extra 1 hour
          </button>
        )}
        {(pending || asked) && <p className="text-xs text-amber-700 mt-2 font-semibold">Extra-time request waiting for teacher/admin.</p>}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <Clock3 className="w-4 h-4 text-sky-600 mb-2" />
          <p className="text-[11px] font-bold uppercase text-slate-400">Time today</p>
          <p className="text-xl font-extrabold text-[#1e3a5f]">{formatDuration(stats?.secondsToday ?? time.secondsToday)}</p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <Clock3 className="w-4 h-4 text-violet-600 mb-2" />
          <p className="text-[11px] font-bold uppercase text-slate-400">This week</p>
          <p className="text-xl font-extrabold text-[#1e3a5f]">{formatDuration(stats?.secondsWeek ?? time.secondsWeek)}</p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm col-span-2">
          <p className="text-[11px] font-bold uppercase text-slate-400">Total time spent</p>
          <p className="text-xl font-extrabold text-[#1e3a5f]">{formatDuration(stats?.secondsTotal ?? time.secondsTotal)}</p>
        </div>
        <div className="col-span-2 rounded-2xl bg-[#1e3a5f] text-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase text-sky-200">Syllabus covered</p>
              <p className="text-3xl font-extrabold mt-1">{stats ? `${stats.pct}%` : '…'}</p>
              <p className="text-xs text-sky-100 mt-1">
                {stats
                  ? `${stats.done} / ${stats.total} questions opened · ${stats.remaining} left`
                  : 'Loading coverage from your units…'}
              </p>
            </div>
            <CheckCircle2 className="w-10 h-10 text-emerald-300" />
          </div>
          <div className="mt-3 h-2 rounded-full bg-white/15 overflow-hidden">
            <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${stats?.pct || 0}%` }} />
          </div>
        </div>
      </div>

      {stats?.weak?.filter((name) => rows.some((r) => r.subject.name === name)).length > 0 && (
        <div className="mt-4 rounded-2xl bg-amber-50 border border-amber-100 p-4 flex gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <p className="text-sm font-extrabold text-amber-950">Needs more practice</p>
            <p className="text-xs text-amber-800 mt-0.5">
              {stats.weak.filter((name) => rows.some((r) => r.subject.name === name)).join(', ')}
            </p>
          </div>
        </div>
      )}

      <Link
        to={continueSubject ? `/learn/${continueSubject.subject.id}` : '/learn'}
        className="mt-5 flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-extrabold text-[#1e3a5f]">Continue learning</p>
            <p className="text-xs text-slate-500">
              {continueSubject ? continueSubject.subject.name : 'Open 10th Study Hub'}
            </p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400" />
      </Link>

      {exams.length > 0 && (
        <>
          <h2 className="mt-7 text-sm font-extrabold text-[#1e3a5f]">Exams from your teacher</h2>
          <ul className="mt-3 space-y-2">
            {exams.map((exam) => (
              <li key={exam.id}>
                <Link to={`/learn/exam/${exam.id}`} className="flex justify-between bg-white rounded-2xl px-4 py-3 shadow-sm">
                  <span className="font-bold text-[#1e3a5f]">{exam.title}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}

      <h2 className="mt-7 text-sm font-extrabold text-[#1e3a5f]">Subject coverage</h2>
      <ul className="mt-3 space-y-2.5">
        {rows.map(({ subject, done, total, pct, seconds }) => {
          const theme = getTheme(subject.id);
          return (
            <li key={subject.id}>
              <Link to={`/learn/${subject.id}`} className="block bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex justify-between items-baseline gap-3">
                  <p className="font-bold text-[#1e3a5f]">{subject.name}</p>
                  <p className="text-[11px] text-slate-400">
                    {stats ? `${done}/${total} · ${formatDuration(seconds)}` : '…'}
                  </p>
                </div>
                <div className="mt-2 h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className={`h-full ${theme.badge}`} style={{ width: `${pct}%` }} />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">{pct}% covered</p>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function subjectCountLabel() {
  return FALLBACK_SUBJECTS.length;
}
