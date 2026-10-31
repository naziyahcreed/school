import React from 'react';

export function BookPlantHero() {
  return (
    <svg viewBox="0 0 220 160" className="w-full h-full" aria-hidden="true">
      <ellipse cx="160" cy="148" rx="46" ry="8" fill="#c7b48a" opacity="0.35" />
      <rect x="132" y="118" width="56" height="28" rx="4" fill="#d4a574" />
      <rect x="138" y="112" width="44" height="8" rx="2" fill="#c4956a" />
      <path d="M160 112 C160 88 148 70 160 52 C172 70 160 88 160 112Z" fill="#3d8b6e" />
      <path d="M160 100 C148 90 140 72 152 60" stroke="#2f6f57" strokeWidth="3" fill="none" />
      <path d="M160 96 C172 84 180 70 168 58" stroke="#2f6f57" strokeWidth="3" fill="none" />
      <rect x="28" y="78" width="54" height="70" rx="3" fill="#3b6fd4" transform="rotate(-8 55 113)" />
      <rect x="48" y="70" width="52" height="76" rx="3" fill="#f3c14b" transform="rotate(-2 74 108)" />
      <rect x="70" y="76" width="50" height="72" rx="3" fill="#e36b4a" transform="rotate(6 95 112)" />
      <rect x="58" y="62" width="44" height="8" rx="2" fill="#f7e7c1" />
      <circle cx="118" cy="58" r="7" fill="#e8c36a" />
    </svg>
  );
}

export function OpenBookBanner({ className = '' }) {
  return (
    <svg viewBox="0 0 360 140" className={`w-full h-full ${className}`} aria-hidden="true">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7eb6d9" />
          <stop offset="55%" stopColor="#f3d7a0" />
          <stop offset="100%" stopColor="#8fbf7a" />
        </linearGradient>
      </defs>
      <rect width="360" height="140" rx="24" fill="url(#sky)" />
      <circle cx="292" cy="38" r="18" fill="#ffe9a8" opacity="0.9" />
      <ellipse cx="180" cy="118" rx="120" ry="14" fill="#1e3a2f" opacity="0.18" />
      <path d="M70 108 Q180 42 290 108 L270 112 Q180 62 90 112 Z" fill="#f7e7c6" />
      <path d="M180 50 L180 112" stroke="#c4a574" strokeWidth="2" />
      <path d="M96 100 Q180 70 174 100" fill="none" stroke="#d7c09a" strokeWidth="1.5" />
      <path d="M186 100 Q180 70 264 100" fill="none" stroke="#d7c09a" strokeWidth="1.5" />
    </svg>
  );
}

export function MiniBooks({ className = 'w-16 h-16' }) {
  return (
    <svg viewBox="0 0 80 80" className={className} aria-hidden="true">
      <rect x="10" y="28" width="22" height="36" rx="2" fill="#3b6fd4" transform="rotate(-12 21 46)" />
      <rect x="28" y="22" width="22" height="40" rx="2" fill="#f3c14b" />
      <rect x="48" y="26" width="22" height="38" rx="2" fill="#e36b4a" transform="rotate(10 59 45)" />
    </svg>
  );
}
