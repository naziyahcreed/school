import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getTheme, SUBJECT_ORDER, SUBJECT_THEMES } from '../theme.js';
import { formatDuration } from '../utils/learnAnalyticsStore.js';
import { useAuth } from '../../../context/AuthContext.jsx';

export default function LearnProgressPage() {
  const { user } = useAuth();
  const [rows, setRows] = useState(
    SUBJECT_ORDER.map((id) => ({
      subject: { id, name: SUBJECT_THEMES[id].taglineEn },
      done: 0,
      total: 0,
      pct: 0,
      seconds: 0,
    })),
  );
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let live = true;
    import('../utils/learnAnalytics.js').then((mod) => {
      if (!live) return;
      setRows(mod.getStudentStats(user?.username, user?.full_name).bySubject);
      setReady(true);
    });
    return () => {
      live = false;
    };
  }, [user?.username, user?.full_name]);

  return (
    <div className="px-5 pt-8 pb-8">
      <h1 className="text-2xl font-extrabold text-[#1e3a5f]">Progress</h1>
      <p className="text-sm text-slate-500 mt-1">Questions opened and time spent, subject-wise.</p>
      <ul className="mt-6 space-y-3">
        {rows.map(({ subject, done, total, pct, seconds }) => {
          const theme = getTheme(subject.id);
          return (
            <li key={subject.id}>
              <Link to={`/learn/${subject.id}`} className="block bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex justify-between items-baseline">
                  <p className="font-bold text-[#1e3a5f]">{subject.name}</p>
                  <p className="text-xs text-slate-500">
                    {ready ? `${done}/${total} · ${formatDuration(seconds)}` : 'Loading…'}
                  </p>
                </div>
                <div className="mt-2 h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className={`h-full ${theme.badge}`} style={{ width: `${pct}%` }} />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">{pct}% viewed</p>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
