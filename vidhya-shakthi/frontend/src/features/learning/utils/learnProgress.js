const KEY = 'vs_learn_progress_v1';

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { viewed: {} };
    const parsed = JSON.parse(raw);
    return { viewed: parsed?.viewed && typeof parsed.viewed === 'object' ? parsed.viewed : {} };
  } catch {
    return { viewed: {} };
  }
}

function write(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function questionKey(subjectId, chapterId, questionId) {
  return `${subjectId}/${chapterId}/${questionId}`;
}

export function markViewed(subjectId, chapterId, questionId) {
  const state = read();
  state.viewed[questionKey(subjectId, chapterId, questionId)] = Date.now();
  write(state);
}

export function isViewed(subjectId, chapterId, questionId) {
  return Boolean(read().viewed[questionKey(subjectId, chapterId, questionId)]);
}

export function viewedCountForChapter(subjectId, chapterId, questionIds) {
  const state = read();
  return questionIds.filter((id) => state.viewed[questionKey(subjectId, chapterId, id)]).length;
}

export function viewedCountForSubject(subjectId, items) {
  const state = read();
  return items.filter((item) => state.viewed[questionKey(subjectId, item.chapterId, item.id)]).length;
}
