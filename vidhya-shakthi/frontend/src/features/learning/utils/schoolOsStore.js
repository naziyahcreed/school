import { getTimeSnapshot, todayKey } from './learnAnalyticsStore.js';

const KEY = 'vs_school_os_v1';
export const DEFAULT_DAILY_SECONDS = 60 * 60;

export const SUBJECT_OPTIONS = [
  { id: 'tamil', name: 'Tamil', nameTa: 'தமிழ்' },
  { id: 'english', name: 'English', nameTa: 'ஆங்கிலம்' },
  { id: 'mathematics', name: 'Mathematics', nameTa: 'கணிதம்' },
  { id: 'science', name: 'Science', nameTa: 'அறிவியல்' },
  { id: 'social-science', name: 'Social Science', nameTa: 'சமூக அறிவியல்' },
];

export const SCHOOL_TEACHERS = [
  { username: 'teacher', full_name: 'Ravi Kumar (Teacher)' },
  { username: 'meena', full_name: 'Meena Rani (Teacher)' },
];

export const SCHOOL_STUDENTS = [
  { username: 'student', full_name: 'Suresh Kumar (Std 10-A)' },
  { username: 'priya', full_name: 'Priya Sharma (Std 10-A)' },
  { username: 'karthik', full_name: 'Karthik Prakash (Std 10-A)' },
];

function emptyState() {
  return {
    teachers: {
      teacher: { subjectIds: ['mathematics', 'science'] },
      meena: { subjectIds: ['tamil', 'english'] },
    },
    roster: {
      student: { teacherIds: ['teacher', 'meena'] },
      priya: { teacherIds: ['teacher', 'meena'] },
      karthik: { teacherIds: ['teacher'] },
    },
    quotas: {},
    extraToday: {},
    requests: [],
    questionOverrides: {},
    exams: [],
    attempts: {},
  };
}

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : emptyState();
    return { ...emptyState(), ...parsed, teachers: { ...emptyState().teachers, ...(parsed.teachers || {}) } };
  } catch {
    return emptyState();
  }
}

function write(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function questionOverrideKey(subjectId, chapterId, questionId) {
  return `${subjectId}/${chapterId}/${questionId}`;
}

export function getTeacherSubjects(username) {
  if (!username) return [];
  return read().teachers[username]?.subjectIds || [];
}

export function getStudentTeacherIds(username) {
  return read().roster[username]?.teacherIds || [];
}

export function getAccessibleSubjectIds(user) {
  if (!user?.role) return [];
  if (user.role === 'ADMIN') return SUBJECT_OPTIONS.map((s) => s.id);
  if (user.role === 'TEACHER') return getTeacherSubjects(user.username);
  if (user.role === 'STUDENT') {
    const ids = new Set();
    getStudentTeacherIds(user.username).forEach((tid) => {
      getTeacherSubjects(tid).forEach((sid) => ids.add(sid));
    });
    return [...ids];
  }
  return [];
}

export function canAccessSubject(user, subjectId) {
  if (!subjectId) return false;
  return getAccessibleSubjectIds(user).includes(subjectId);
}

export function getStudentsForTeacher(teacherId) {
  const state = read();
  return SCHOOL_STUDENTS.filter((s) => (state.roster[s.username]?.teacherIds || []).includes(teacherId)).map(
    (s) => s.username,
  );
}

export function getTeachersForStudent(username) {
  return getStudentTeacherIds(username)
    .map((id) => SCHOOL_TEACHERS.find((t) => t.username === id))
    .filter(Boolean);
}

export function setTeacherSubjects(teacherId, subjectIds) {
  const state = read();
  state.teachers[teacherId] = { subjectIds: [...new Set(subjectIds)] };
  write(state);
}

export function setStudentTeachers(studentId, teacherIds) {
  const state = read();
  state.roster[studentId] = { teacherIds: [...new Set(teacherIds)] };
  write(state);
}

export function getDailyQuotaSeconds(username) {
  const state = read();
  const daily = state.quotas[username]?.dailySeconds ?? DEFAULT_DAILY_SECONDS;
  const extra = state.extraToday[username]?.[todayKey()] || 0;
  return daily + extra;
}

export function getRemainingSeconds(username) {
  if (!username) return DEFAULT_DAILY_SECONDS;
  const used = getTimeSnapshot(username).secondsToday || 0;
  return Math.max(0, getDailyQuotaSeconds(username) - used);
}

export function getPendingRequest(username) {
  return read().requests.find((r) => r.username === username && r.status === 'pending') || null;
}

export function listRequests({ teacherId, admin } = {}) {
  const rows = read().requests.slice().sort((a, b) => b.createdAt - a.createdAt);
  if (admin) return rows;
  const mine = new Set(getStudentsForTeacher(teacherId));
  return rows.filter((r) => mine.has(r.username));
}

export function createAccessRequest({ username, full_name, kind, minutes, reason }) {
  if (getPendingRequest(username)) return getPendingRequest(username);
  const state = read();
  const row = {
    id: `req-${Date.now()}`,
    username,
    full_name: full_name || username,
    kind: kind || 'extra-today',
    minutes: Number(minutes) || 60,
    reason: reason || '',
    status: 'pending',
    createdAt: Date.now(),
    decidedBy: null,
  };
  state.requests.unshift(row);
  write(state);
  return row;
}

export function decideRequest(id, status, decidedBy) {
  const state = read();
  const row = state.requests.find((r) => r.id === id);
  if (!row || row.status !== 'pending') return null;
  row.status = status;
  row.decidedBy = decidedBy;
  row.decidedAt = Date.now();
  if (status === 'approved') {
    if (row.kind === 'raise-daily') {
      state.quotas[row.username] = { dailySeconds: Math.max(DEFAULT_DAILY_SECONDS, row.minutes * 60) };
    } else {
      const day = todayKey();
      state.extraToday[row.username] = state.extraToday[row.username] || {};
      state.extraToday[row.username][day] = (state.extraToday[row.username][day] || 0) + row.minutes * 60;
    }
  }
  write(state);
  return row;
}

export function mergeQuestionOverride(subjectId, chapterId, question) {
  if (!question) return question;
  const row = read().questionOverrides[questionOverrideKey(subjectId, chapterId, question.id)];
  if (!row) return question;
  return {
    ...question,
    question: row.question ?? question.question,
    questionLatex: row.questionLatex ?? question.questionLatex,
    answer: row.answer ?? question.answer,
    answerLatex: row.answerLatex ?? question.answerLatex,
    imageDataUrl: row.imageDataUrl || question.imageDataUrl || null,
    updatedBy: row.updatedBy,
    updatedAt: row.updatedAt,
  };
}

export function saveQuestionOverride(subjectId, chapterId, questionId, patch, updatedBy) {
  const state = read();
  const key = questionOverrideKey(subjectId, chapterId, questionId);
  state.questionOverrides[key] = {
    ...(state.questionOverrides[key] || {}),
    ...patch,
    updatedBy,
    updatedAt: Date.now(),
  };
  write(state);
}

export function listExams({ teacherId, studentId, admin } = {}) {
  const rows = read().exams.slice().sort((a, b) => b.createdAt - a.createdAt);
  if (admin) return rows;
  if (teacherId) return rows.filter((e) => e.teacherId === teacherId);
  if (studentId) {
    const subjects = new Set();
    getStudentTeacherIds(studentId).forEach((tid) => getTeacherSubjects(tid).forEach((s) => subjects.add(s)));
    const teachers = new Set(getStudentTeacherIds(studentId));
    return rows.filter((e) => e.published && (teachers.has(e.teacherId) || subjects.has(e.subjectId)));
  }
  return [];
}

export function getExam(id) {
  return read().exams.find((e) => e.id === id) || null;
}

export function saveExam(exam) {
  const state = read();
  const existing = state.exams.findIndex((e) => e.id === exam.id);
  const row = { ...exam, updatedAt: Date.now() };
  if (existing >= 0) state.exams[existing] = row;
  else state.exams.unshift({ ...row, createdAt: Date.now() });
  write(state);
  return row;
}

export function getAttempt(examId, username) {
  return read().attempts[`${examId}:${username}`] || null;
}

export function saveAttempt(examId, username, payload) {
  const state = read();
  state.attempts[`${examId}:${username}`] = { ...payload, examId, username, submittedAt: Date.now() };
  write(state);
}

export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve(null);
      return;
    }
    if (file.size > 1.6 * 1024 * 1024) {
      reject(new Error('Image must be under 1.5 MB'));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Could not read image'));
    reader.readAsDataURL(file);
  });
}
