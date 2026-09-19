const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const STORAGE_KEY = 'vidhya_auth';

/** Must match backend auth_service.DEMO_USERS */
const OFFLINE_USERS = {
  admin: { password: 'admin123', role: 'ADMIN', full_name: 'School Admin', full_name_ta: 'நிர்வாகி' },
  teacher: { password: 'teacher123', role: 'TEACHER', full_name: 'Ravi Kumar (Teacher)', full_name_ta: 'ஆசிரியர் ரவி' },
  student: { password: 'student123', role: 'STUDENT', full_name: 'Suresh Kumar (Std 10-A)', full_name_ta: 'மாணவர் சுரேஷ்' },
  parent: { password: 'parent123', role: 'PARENT', full_name: 'Kavya (Parent)', full_name_ta: 'பெற்றோர் திவ்யா' },
};

export const DEMO_CREDENTIALS = [
  { username: 'admin', password: 'admin123', role: 'ADMIN', labelEn: 'Admin', labelTa: 'நிர்வாகி' },
  { username: 'teacher', password: 'teacher123', role: 'TEACHER', labelEn: 'Teacher', labelTa: 'ஆசிரியர்' },
  { username: 'student', password: 'student123', role: 'STUDENT', labelEn: 'Student', labelTa: 'மாணவர்' },
  { username: 'parent', password: 'parent123', role: 'PARENT', labelEn: 'Parent', labelTa: 'பெற்றோர்' },
];

const VALID_ROLES = new Set(['ADMIN', 'TEACHER', 'STUDENT', 'PARENT']);

export function normalizeRole(role) {
  if (role == null || role === '') return null;
  const r = String(role).trim().toUpperCase();
  return VALID_ROLES.has(r) ? r : null;
}

/** Accept current + legacy/localStorage/API shapes */
export function normalizeSession(data) {
  if (!data || typeof data !== 'object') return null;

  const token = data.token || data.access_token;
  let user = data.user;

  if (!user && data.role != null) {
    user = {
      username: data.username || 'user',
      role: data.role,
      full_name: data.full_name || data.name || String(data.role),
      full_name_ta: data.full_name_ta,
    };
  }

  const role = normalizeRole(user?.role);
  if (!token || !role) return null;

  return {
    token,
    user: {
      username: user.username || 'user',
      role,
      full_name: user.full_name || user.fullName || user.username || role,
      full_name_ta: user.full_name_ta ?? user.fullNameTa ?? null,
    },
  };
}

export function getHomePathForRole(role) {
  const r = normalizeRole(role);
  if (!r) return '/login';
  switch (r) {
    case 'STUDENT':
      return '/learn';
    case 'PARENT':
      return '/parent';
    case 'TEACHER':
      return '/dashboard/learn-cms';
    case 'ADMIN':
    default:
      return '/dashboard';
  }
}

export function readStoredAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const session = normalizeSession(JSON.parse(raw));
    if (!session) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return session;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function saveAuth(session) {
  const normalized = normalizeSession(session);
  if (!normalized) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
}

export function clearAuth() {
  localStorage.removeItem(STORAGE_KEY);
}

function offlineLogin(username, password) {
  const key = username.trim().toLowerCase();
  const row = OFFLINE_USERS[key];
  if (!row || row.password !== password) return null;
  const user = { username: key, role: row.role, full_name: row.full_name, full_name_ta: row.full_name_ta };
  return { access_token: `offline.${key}.${Date.now()}`, user };
}

export async function login(username, password) {
  try {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      const offline = offlineLogin(username, password);
      if (offline) return offline;
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Login failed');
    }
    const data = await res.json();
    const session = normalizeSession({
      access_token: data.access_token || data.token,
      user: data.user,
      role: data.role,
      username,
    });
    if (!session) {
      throw new Error('Invalid login response from server');
    }
    return { access_token: session.token, user: session.user };
  } catch (err) {
    if (err?.message?.includes('Invalid login')) throw err;
    const offline = offlineLogin(username, password);
    if (offline) return offline;
    throw new Error('Cannot reach server. Use demo passwords on this device.');
  }
}

export function authHeaders() {
  const session = readStoredAuth();
  if (!session?.token) return {};
  return { Authorization: `Bearer ${session.token}` };
}
