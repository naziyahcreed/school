const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const LOCAL_KEY = 'vidhya_learn_custom_lessons';

function readLocal() {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeLocal(rows) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(rows));
}

function normalize(row) {
  return {
    id: row.id,
    title: row.title,
    title_ta: row.title_ta ?? row.titleTa,
    grade: row.grade ?? 10,
    subject_id: row.subject_id ?? row.subjectId,
    chapter_id: row.chapter_id ?? row.chapterId,
    slot: row.slot,
    concept_id: row.concept_id ?? row.conceptId,
    sort_order: row.sort_order ?? row.sortOrder ?? 0,
    html_content: row.html_content ?? row.htmlContent ?? '',
    css_content: row.css_content ?? row.cssContent ?? '',
    status: row.status,
    author_name: row.author_name ?? row.authorName,
    author_role: row.author_role ?? row.authorRole,
    reviewer_note: row.reviewer_note ?? row.reviewerNote,
    created_at: row.created_at ?? row.createdAt,
    updated_at: row.updated_at ?? row.updatedAt,
    approved_at: row.approved_at ?? row.approvedAt,
  };
}

async function api(path, options = {}) {
  const res = await fetch(`${API_BASE}/api/v1/learn-content${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const err = new Error(await res.text());
    err.status = res.status;
    throw err;
  }
  if (res.status === 204) return null;
  return res.json();
}

export async function fetchApprovedLessons({ subjectId, chapterId, grade = 10 }) {
  const params = new URLSearchParams({ grade: String(grade) });
  if (subjectId) params.set('subject_id', subjectId);
  if (chapterId) params.set('chapter_id', chapterId);
  try {
    const rows = await api(`/lessons?${params}`);
    return rows.map(normalize);
  } catch {
    return readLocal()
      .map(normalize)
      .filter(
        (r) =>
          r.status === 'APPROVED' &&
          r.grade === grade &&
          (!subjectId || r.subject_id === subjectId) &&
          (!chapterId || r.chapter_id === chapterId),
      );
  }
}

export async function fetchAllLessonsForAdmin() {
  try {
    const rows = await api('/lessons?all_statuses=true');
    return rows.map(normalize);
  } catch {
    return readLocal().map(normalize);
  }
}

export async function createLesson(payload) {
  const body = {
    title: payload.title,
    title_ta: payload.titleTa || null,
    grade: payload.grade ?? 10,
    subject_id: payload.subjectId,
    chapter_id: payload.chapterId,
    slot: payload.slot,
    concept_id: payload.conceptId || null,
    sort_order: payload.sortOrder ?? 0,
    html_content: payload.htmlContent ?? '',
    css_content: payload.cssContent ?? '',
    author_name: payload.authorName ?? 'Staff',
    author_role: payload.authorRole ?? 'TEACHER',
    publish_now: !!payload.publishNow,
  };
  try {
    const row = await api('/lessons', { method: 'POST', body: JSON.stringify(body) });
    return normalize(row);
  } catch {
    const now = new Date().toISOString();
    const status =
      payload.authorRole === 'ADMIN' || payload.publishNow ? 'APPROVED' : 'PENDING_REVIEW';
    const row = normalize({
      id: crypto.randomUUID(),
      ...body,
      status,
      created_at: now,
      updated_at: now,
      approved_at: status === 'APPROVED' ? now : null,
    });
    writeLocal([...readLocal(), row]);
    return row;
  }
}

export async function approveLesson(id, note) {
  try {
    const q = note ? `?note=${encodeURIComponent(note)}` : '';
    return normalize(await api(`/lessons/${id}/approve${q}`, { method: 'POST' }));
  } catch {
    const rows = readLocal().map((r) => {
      if (r.id !== id) return r;
      const now = new Date().toISOString();
      return { ...r, status: 'APPROVED', approved_at: now, updated_at: now, reviewer_note: note };
    });
    writeLocal(rows);
    return rows.find((r) => r.id === id);
  }
}

export async function rejectLesson(id, note) {
  try {
    const q = note ? `?note=${encodeURIComponent(note)}` : '';
    return normalize(await api(`/lessons/${id}/reject${q}`, { method: 'POST' }));
  } catch {
    const rows = readLocal().map((r) => {
      if (r.id !== id) return r;
      return {
        ...r,
        status: 'REJECTED',
        updated_at: new Date().toISOString(),
        reviewer_note: note || 'Needs revision',
      };
    });
    writeLocal(rows);
    return rows.find((r) => r.id === id);
  }
}

export async function deleteLesson(id) {
  try {
    await api(`/lessons/${id}`, { method: 'DELETE' });
  } catch {
    writeLocal(readLocal().filter((r) => r.id !== id));
  }
}

export function lessonsForSlot(lessons, slot) {
  return lessons
    .filter((l) => l.slot === slot)
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
}
