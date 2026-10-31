import { LMS_SUBJECTS } from '../catalog/lmsCatalog.js';
import {
  applySeeds,
  DEMO_CLASSMATES,
  emptyStudent,
  ensureStudent,
  getStudentRecord,
  questionKey,
  read,
  todayKey,
  weekSeconds,
  write,
} from './learnAnalyticsStore.js';

export {
  addStudySeconds,
  categorize,
  formatDuration,
  formatLastActive,
  isViewed,
  markViewed,
  questionKey,
} from './learnAnalyticsStore.js';

function coveragePct(done, total) {
  if (!total) return 0;
  if (!done) return 0;
  return Math.max(1, Math.round((done / total) * 100));
}

export function subjectQuestionTotals() {
  const totals = {};
  LMS_SUBJECTS.forEach((s) => {
    totals[s.id] = s.chapters.reduce((n, c) => n + (c.questions?.length || 0), 0);
  });
  return totals;
}

export function getStudentStats(username, full_name) {
  const state = read();
  applySeeds(state);
  const row = state.students[username] || emptyStudent(username, full_name);
  const totals = subjectQuestionTotals();
  const viewed = row.viewed || {};
  const totalAll = Object.values(totals).reduce((a, b) => a + b, 0);
  const bySubject = LMS_SUBJECTS.map((subject) => {
    const total = totals[subject.id] || 0;
    const liveDone = subject.chapters.reduce(
      (n, ch) => n + (ch.questions || []).filter((q) => viewed[questionKey(subject.id, ch.id, q.id)]).length,
      0,
    );
    const seededDone = totalAll ? Math.round((row.viewedCount || 0) * (total / totalAll)) : 0;
    const covered = row.seeded && !Object.keys(viewed).length ? Math.min(total, seededDone) : liveDone;
    return {
      subject,
      done: covered,
      total,
      remaining: Math.max(0, total - covered),
      pct: coveragePct(covered, total),
      seconds: row.subjectSeconds?.[subject.id] || 0,
    };
  });
  const doneAll = bySubject.reduce((n, r) => n + r.done, 0);
  const secondsToday = row.secondsByDay?.[todayKey()] || 0;
  const weak = bySubject.filter((s) => s.total && s.pct < 40).map((s) => s.subject.name);
  return {
    username,
    full_name: row.full_name || full_name || username,
    secondsTotal: row.secondsTotal || 0,
    secondsToday,
    secondsWeek: weekSeconds(row.secondsByDay),
    lastActive: row.lastActive,
    done: doneAll,
    total: totalAll,
    remaining: Math.max(0, totalAll - doneAll),
    pct: coveragePct(doneAll, totalAll),
    bySubject,
    weak,
  };
}

export function getClassAnalytics() {
  const state = read();
  ensureStudent(state, 'student', 'Suresh Kumar (Std 10-A)');
  applySeeds(state);
  write(state);
  const names = new Set(['student', ...DEMO_CLASSMATES, ...Object.keys(state.students)]);
  return [...names]
    .filter((name) => state.students[name])
    .map((name) => getStudentStats(name, state.students[name]?.full_name))
    .sort((a, b) => b.pct - a.pct);
}

export function viewedCountForSubject(username, subjectId, items) {
  const row = getStudentRecord(username);
  if (row.seeded) return 0;
  return items.filter((item) => row.viewed?.[questionKey(subjectId, item.chapterId, item.id)]).length;
}
