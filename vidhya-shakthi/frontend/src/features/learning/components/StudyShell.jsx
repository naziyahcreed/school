import React, { useEffect, useRef, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Home, BookOpen, BarChart3, User } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext.jsx';
import { addStudySeconds } from '../utils/learnAnalyticsStore.js';
import { getRemainingSeconds } from '../utils/schoolOsStore.js';
import TimeLockScreen from './TimeLockScreen.jsx';

const TABS = [
  { to: '/student', label: 'Home', icon: Home },
  { to: '/learn', label: 'Subjects', icon: BookOpen },
  { to: '/learn/progress', label: 'Progress', icon: BarChart3 },
  { to: '/learn/profile', label: 'Profile', icon: User },
];

const SUBJECT_IDS = new Set(['tamil', 'english', 'mathematics', 'science', 'social-science']);

function isTabActive(tab, pathname) {
  if (tab.label === 'Progress') return pathname.startsWith('/learn/progress');
  if (tab.label === 'Profile') return pathname.startsWith('/learn/profile');
  if (tab.label === 'Subjects') return pathname.startsWith('/learn');
  return pathname === '/student' || pathname === '/';
}

function subjectFromPath(pathname) {
  const part = pathname.split('/')[2];
  return SUBJECT_IDS.has(part) ? part : undefined;
}

function isLockedPath(pathname) {
  if (pathname === '/student' || pathname === '/learn/profile') return false;
  return pathname.startsWith('/learn');
}

export default function StudyShell() {
  const location = useLocation();
  const { user } = useAuth();
  const lastRef = useRef(Date.now());
  const leftoverRef = useRef(0);
  const [remaining, setRemaining] = useState(() => getRemainingSeconds(user?.username));

  useEffect(() => {
    if (user?.role !== 'STUDENT') return undefined;
    lastRef.current = Date.now();
    const subjectId = subjectFromPath(location.pathname);
    const flush = () => {
      const now = Date.now();
      leftoverRef.current += (now - lastRef.current) / 1000;
      lastRef.current = now;
      const secs = Math.floor(leftoverRef.current);
      leftoverRef.current -= secs;
      const left = getRemainingSeconds(user.username);
      const add = Math.min(secs, left);
      if (add > 0) {
        addStudySeconds(user.username, add, { subjectId, full_name: user.full_name });
      }
      setRemaining(getRemainingSeconds(user.username));
    };
    const timer = setInterval(flush, 10000);
    setRemaining(getRemainingSeconds(user.username));
    return () => {
      clearInterval(timer);
      flush();
    };
  }, [location.pathname, user]);

  const locked = user?.role === 'STUDENT' && remaining <= 0 && isLockedPath(location.pathname);

  return (
    <div className="min-h-screen bg-[#c9d9ea] font-[inherit]">
      <div className="mx-auto min-h-screen max-w-[430px] bg-[#f4f7fb] shadow-[0_0_40px_rgba(15,40,70,0.18)] relative flex flex-col">
        <div className="flex-1 pb-28">
          {locked ? <TimeLockScreen user={user} /> : <Outlet />}
        </div>
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white/95 backdrop-blur border-t border-slate-200 px-2 py-2 z-40">
          <ul className="grid grid-cols-4">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const active = isTabActive(tab, location.pathname);
              return (
                <li key={tab.label}>
                  <Link
                    to={tab.to}
                    className={`flex flex-col items-center gap-0.5 py-1.5 text-[11px] font-semibold ${
                      active ? 'text-[#1e3a5f]' : 'text-slate-400'
                    }`}
                  >
                    <Icon className="w-[18px] h-[18px]" strokeWidth={active ? 2.4 : 1.8} />
                    {tab.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}
