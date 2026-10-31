/** Visual theme for the 10th Study Hub — UI only. */

export const SUBJECT_ORDER = ['tamil', 'english', 'mathematics', 'science', 'social-science'];

export const SUBJECT_THEMES = {
  tamil: {
    id: 'tamil',
    tagline: 'கல்வி என்பது வாழ்க்கைக்கான ஒளி',
    taglineEn: 'Tamil',
    cardBg: 'bg-[#fde8ef]',
    cardIconBg: 'bg-white/80 text-rose-500',
    headerBg: 'bg-gradient-to-br from-[#fff1f5] via-[#ffe4ec] to-[#fff7ed]',
    badge: 'bg-rose-500',
    badgeSoft: 'bg-rose-100 text-rose-700',
    ring: 'ring-rose-400',
    accent: 'text-rose-600',
    btn: 'bg-[#1e3a5f] hover:bg-[#16314f]',
    chip: 'border-rose-200 text-rose-700 bg-rose-50',
    unitTint: 'bg-[#fff7f9]',
    quote: '“கல்வி என்பது வாழ்க்கைக்கான ஒளி”',
  },
  english: {
    id: 'english',
    tagline: 'Learn, Read, Grow',
    taglineEn: 'English',
    cardBg: 'bg-[#e7f1ff]',
    cardIconBg: 'bg-white/80 text-sky-600',
    headerBg: 'bg-gradient-to-br from-[#eef5ff] via-[#e4efff] to-[#f8fbff]',
    badge: 'bg-sky-500',
    badgeSoft: 'bg-sky-100 text-sky-700',
    ring: 'ring-sky-400',
    accent: 'text-sky-600',
    btn: 'bg-[#1e3a5f] hover:bg-[#16314f]',
    chip: 'border-sky-200 text-sky-700 bg-sky-50',
    unitTint: 'bg-[#f4f8ff]',
    quote: null,
  },
  mathematics: {
    id: 'mathematics',
    tagline: 'Think · Solve · Excel',
    taglineEn: 'Mathematics',
    cardBg: 'bg-[#e7f8ee]',
    cardIconBg: 'bg-white/80 text-emerald-600',
    headerBg: 'bg-gradient-to-br from-[#ecfdf5] via-[#e6f7ee] to-[#f7fffb]',
    badge: 'bg-emerald-500',
    badgeSoft: 'bg-emerald-100 text-emerald-700',
    ring: 'ring-emerald-400',
    accent: 'text-emerald-600',
    btn: 'bg-[#1e3a5f] hover:bg-[#16314f]',
    chip: 'border-emerald-200 text-emerald-700 bg-emerald-50',
    unitTint: 'bg-[#f3fbf6]',
    quote: null,
  },
  science: {
    id: 'science',
    tagline: 'Explore · Observe · Understand',
    taglineEn: 'Science',
    cardBg: 'bg-[#fff1e3]',
    cardIconBg: 'bg-white/80 text-orange-500',
    headerBg: 'bg-gradient-to-br from-[#fff7ed] via-[#ffedd5] to-[#fffaf5]',
    badge: 'bg-orange-500',
    badgeSoft: 'bg-orange-100 text-orange-700',
    ring: 'ring-orange-400',
    accent: 'text-orange-600',
    btn: 'bg-[#1e3a5f] hover:bg-[#16314f]',
    chip: 'border-orange-200 text-orange-700 bg-orange-50',
    unitTint: 'bg-[#fff8f1]',
    quote: null,
  },
  'social-science': {
    id: 'social-science',
    tagline: 'Know Your World',
    taglineEn: 'Social Science',
    cardBg: 'bg-[#f1e9ff]',
    cardIconBg: 'bg-white/80 text-violet-600',
    headerBg: 'bg-gradient-to-br from-[#f5f0ff] via-[#ede4ff] to-[#faf8ff]',
    badge: 'bg-violet-500',
    badgeSoft: 'bg-violet-100 text-violet-700',
    ring: 'ring-violet-400',
    accent: 'text-violet-600',
    btn: 'bg-[#1e3a5f] hover:bg-[#16314f]',
    chip: 'border-violet-200 text-violet-700 bg-violet-50',
    unitTint: 'bg-[#f7f3ff]',
    quote: null,
  },
};

export function getTheme(subjectId) {
  return SUBJECT_THEMES[subjectId] || SUBJECT_THEMES.english;
}

export function orderedSubjects(subjects) {
  return [...subjects].sort(
    (a, b) => SUBJECT_ORDER.indexOf(a.id) - SUBJECT_ORDER.indexOf(b.id),
  );
}

export function displayUnitTitle(chapter, subjectId) {
  const strip = (value) =>
    String(value || '')
      .replace(/^அலகு\s+\d+\s*[—–-]\s*/i, '')
      .replace(/^Unit\s+\d+\s*[—–-]\s*/i, '')
      .replace(/^இயல்\s+\d+\s*[—:–-]\s*/i, '')
      .replace(/^(அலகு|Unit)\s+\d+\s*$/i, '')
      .trim();

  const preferred = subjectId === 'tamil' ? chapter.titleTa || chapter.title : chapter.title;
  return strip(preferred) || strip(chapter.title) || preferred || '';
}
