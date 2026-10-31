import React, { useState } from 'react';
import { Clock3 } from 'lucide-react';
import {
  createAccessRequest,
  getDailyQuotaSeconds,
  getPendingRequest,
} from '../utils/schoolOsStore.js';
import { formatDuration } from '../utils/learnAnalyticsStore.js';

export default function TimeLockScreen({ user }) {
  const pending = getPendingRequest(user?.username);
  const quota = getDailyQuotaSeconds(user?.username);
  const [sent, setSent] = useState(Boolean(pending));

  return (
    <div className="px-5 pt-16 pb-10 text-center">
      <div className="mx-auto w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
        <Clock3 className="w-7 h-7" />
      </div>
      <h1 className="mt-4 text-xl font-extrabold text-[#1e3a5f]">Today’s 1 hour is over</h1>
      <p className="text-sm text-slate-500 mt-2 leading-relaxed">
        Extra mobile time needs teacher or admin approval — quota used {formatDuration(quota)}.
      </p>
      {sent || pending ? (
        <p className="mt-5 text-sm font-semibold text-amber-800 bg-amber-50 rounded-2xl px-4 py-3">
          Request sent. Wait for teacher / admin approval, then you can continue.
        </p>
      ) : (
        <div className="mt-5 space-y-2">
          <button
            type="button"
            onClick={() => {
              createAccessRequest({
                username: user.username,
                full_name: user.full_name,
                kind: 'extra-today',
                minutes: 60,
                reason: 'Need 1 extra hour today to finish assigned work',
              });
              setSent(true);
            }}
            className="w-full py-3 rounded-2xl bg-[#1e3a5f] text-white font-bold"
          >
            Request +1 hour today
          </button>
          <button
            type="button"
            onClick={() => {
              createAccessRequest({
                username: user.username,
                full_name: user.full_name,
                kind: 'raise-daily',
                minutes: 120,
                reason: 'Need 2 hours every day',
              });
              setSent(true);
            }}
            className="w-full py-3 rounded-2xl bg-white font-bold text-[#1e3a5f] shadow-sm"
          >
            Request 2 hours daily
          </button>
        </div>
      )}
    </div>
  );
}
