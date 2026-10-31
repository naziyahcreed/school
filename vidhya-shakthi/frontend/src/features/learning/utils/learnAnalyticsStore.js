const KEY = 'vs_class_analytics_v1';

const SEED_STUDENTS = [
  {
    username: 'priya',
    full_name: 'Priya Sharma (Std 10-A)',
    secondsTotal: 14820,
    lastActive: Date.now() - 1000 * 60 * 40,
    subjectSeconds: { tamil: 4200, english: 2100, mathematics: 5100, science: 2400, 'social-science': 1020 },
    viewedCount: 38,
  },
  {
    username: 'karthik',
    full_name: 'Karthik Prakash (Std 10-A)',
    secondsTotal: 5400,
    lastActive: Date.now() - 1000 * 60 * 60 * 26,
    subjectSeconds: { tamil: 900, english: 600, mathematics: 2100, science: 1200, 'social-science': 600 },
    viewedCount: 11,
  },
];

export function todayKey(ts = Date.now()) {
  return new Date(ts).toISOString().slice(0, 10);
}

export function emptyStudent(username, full_name) {
  return {
    username,
    full_name: full_name || username,
    secondsTotal: 0,
    secondsByDay: {},
    subjectSeconds: {},
    viewed: {},
    lastActive: null,
    seeded: false,
  };
}

export function read() {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : { students: {} };
    if (!parsed.students || typeof parsed.students !== 'object') parsed.students = {};
    return parsed;
  } catch {
    return { students: {} };
  }
}

export function write(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function ensureStudent(state, username, full_name) {
  if (!state.students[username]) {
    state.students[username] = emptyStudent(username, full_name);
  } else if (full_name) {
    state.students[username].full_name = full_name;
  }
  return state.students[username];
}

export function applySeeds(state) {
  SEED_STUDENTS.forEach((seed) => {
    if (state.students[seed.username] && !state.students[seed.username].seeded) return;
    if (state.students[seed.username] && Object.keys(state.students[seed.username].viewed || {}).length) return;
    state.students[seed.username] = {
      ...emptyStudent(seed.username, seed.full_name),
      secondsTotal: seed.secondsTotal,
      lastActive: seed.lastActive,
      subjectSeconds: { ...seed.subjectSeconds },
      viewedCount: seed.viewedCount,
      seeded: true,
    };
  });
}

export const DEMO_CLASSMATES = SEED_STUDENTS.map((s) => s.username);

export function questionKey(subjectId, chapterId, questionId) {
  return `${subjectId}/${chapterId}/${questionId}`;
}

export function markViewed(username, subjectId, chapterId, questionId, full_name) {
  if (!username) return;
  const state = read();
  const row = ensureStudent(state, username, full_name);
  row.seeded = false;
  row.viewed = row.viewed || {};
  row.viewed[questionKey(subjectId, chapterId, questionId)] = Date.now();
  row.lastActive = Date.now();
  write(state);
}

export function isViewed(username, subjectId, chapterId, questionId) {
  if (!username) return false;
  const row = read().students[username];
  return Boolean(row?.viewed?.[questionKey(subjectId, chapterId, questionId)]);
}

export function addStudySeconds(username, seconds, { subjectId, full_name } = {}) {
  if (!username || !seconds || seconds < 1) return;
  const state = read();
  const row = ensureStudent(state, username, full_name);
  row.seeded = false;
  row.secondsTotal = (row.secondsTotal || 0) + seconds;
  row.secondsByDay = row.secondsByDay || {};
  const day = todayKey();
  row.secondsByDay[day] = (row.secondsByDay[day] || 0) + seconds;
  if (subjectId) {
    row.subjectSeconds = row.subjectSeconds || {};
    row.subjectSeconds[subjectId] = (row.subjectSeconds[subjectId] || 0) + seconds;
  }
  row.lastActive = Date.now();
  write(state);
}

export function formatDuration(totalSeconds) {
  const s = Math.max(0, Math.round(totalSeconds || 0));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (h && m) return `${h}h ${m}m`;
  if (h) return `${h}h`;
  if (m) return `${m}m`;
  return `${s}s`;
}

export function formatLastActive(ts) {
  if (!ts) return 'Not yet';
  const diff = Date.now() - ts;
  if (diff < 60 * 1000) return 'Just now';
  if (diff < 60 * 60 * 1000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 24 * 60 * 60 * 1000) return `${Math.floor(diff / 3600000)}h ago`;
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return new Date(ts).toLocaleDateString();
}

export function weekSeconds(secondsByDay = {}) {
  let n = 0;
  for (let i = 0; i < 7; i += 1) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    n += secondsByDay[todayKey(d.getTime())] || 0;
  }
  return n;
}

export function getTimeSnapshot(username, full_name) {
  const state = read();
  applySeeds(state);
  const row = state.students[username] || emptyStudent(username, full_name);
  return {
    username,
    full_name: row.full_name || full_name || username,
    secondsTotal: row.secondsTotal || 0,
    secondsToday: row.secondsByDay?.[todayKey()] || 0,
    secondsWeek: weekSeconds(row.secondsByDay),
    lastActive: row.lastActive,
  };
}

export function getStudentRecord(username) {
  const state = read();
  applySeeds(state);
  return state.students[username] || emptyStudent(username);
}

export function categorize(pct) {
  if (pct >= 70) return 'TOPPER';
  if (pct >= 35) return 'AVERAGE';
  return 'SLOW_LEARNER';
}
