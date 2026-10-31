import React, { useMemo, useState } from 'react';
import { CheckCircle2, Clock, Users, XCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  SCHOOL_STUDENTS,
  SCHOOL_TEACHERS,
  SUBJECT_OPTIONS,
  decideRequest,
  getStudentTeacherIds,
  getStudentsForTeacher,
  getTeacherSubjects,
  listRequests,
  setStudentTeachers,
  setTeacherSubjects,
} from '../learning/utils/schoolOsStore.js';

export default function ClassAssignTab() {
  const { user } = useAuth();
  const [tick, setTick] = useState(0);
  const refresh = () => setTick((n) => n + 1);
  const isAdmin = user?.role === 'ADMIN';
  void tick;

  const requests = useMemo(
    () => listRequests({ teacherId: user?.username, admin: isAdmin }),
    [user?.username, isAdmin, tick],
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Class, subjects & extra time</h2>
        <p className="text-sm text-gray-500">Teachers only get assigned subjects. Students sit under those teachers.</p>
      </div>

      {isAdmin && (
        <>
          <section className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <Users className="w-4 h-4" /> Teacher subject access
            </h3>
            {SCHOOL_TEACHERS.map((t) => {
              const selected = getTeacherSubjects(t.username);
              return (
                <div key={t.username} className="border border-gray-100 rounded-xl p-3">
                  <p className="font-semibold text-gray-800">{t.full_name}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {SUBJECT_OPTIONS.map((s) => {
                      const on = selected.includes(s.id);
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => {
                            const next = on ? selected.filter((id) => id !== s.id) : [...selected, s.id];
                            setTeacherSubjects(t.username, next);
                            refresh();
                          }}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold border ${
                            on ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-200'
                          }`}
                        >
                          {s.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </section>

          <section className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
            <h3 className="font-bold text-gray-800">Student → teacher mapping</h3>
            {SCHOOL_STUDENTS.map((st) => {
              const selected = getStudentTeacherIds(st.username);
              return (
                <div key={st.username} className="border border-gray-100 rounded-xl p-3">
                  <p className="font-semibold text-gray-800">{st.full_name}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {SCHOOL_TEACHERS.map((t) => {
                      const on = selected.includes(t.username);
                      return (
                        <button
                          key={t.username}
                          type="button"
                          onClick={() => {
                            const next = on ? selected.filter((id) => id !== t.username) : [...selected, t.username];
                            setStudentTeachers(st.username, next);
                            refresh();
                          }}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold border ${
                            on ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-600 border-gray-200'
                          }`}
                        >
                          {t.full_name.split('(')[0].trim()}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </section>
        </>
      )}

      {!isAdmin && (
        <section className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="font-bold text-gray-800">Your assigned subjects</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {getTeacherSubjects(user?.username).map((id) => {
              const s = SUBJECT_OPTIONS.find((x) => x.id === id);
              return (
                <span key={id} className="px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold">
                  {s?.name || id}
                </span>
              );
            })}
            {!getTeacherSubjects(user?.username).length && (
              <p className="text-sm text-gray-500">Admin has not assigned subjects yet.</p>
            )}
          </div>
          <h3 className="font-bold text-gray-800 mt-5">Your students</h3>
          <ul className="mt-2 text-sm text-gray-700 space-y-1">
            {getStudentsForTeacher(user?.username).map((name) => {
              const st = SCHOOL_STUDENTS.find((s) => s.username === name);
              return <li key={name}>• {st?.full_name || name}</li>;
            })}
          </ul>
        </section>
      )}

      <section className="bg-white rounded-2xl border border-gray-100 p-5">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <Clock className="w-4 h-4" /> Extra-time requests
        </h3>
        <p className="text-xs text-gray-500 mt-1">Default access is 1 hour/day. Extra needs your approval.</p>
        <ul className="mt-4 space-y-3">
          {requests.filter((r) => r.status === 'pending').map((row) => (
            <li key={row.id} className="border border-amber-100 bg-amber-50 rounded-xl p-3">
              <p className="font-semibold text-gray-800">{row.full_name}</p>
              <p className="text-xs text-gray-600 mt-1">
                {row.kind === 'raise-daily' ? `Daily limit ${row.minutes} min` : `+${row.minutes} min today`}
                {row.reason ? ` · ${row.reason}` : ''}
              </p>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    decideRequest(row.id, 'approved', user?.username);
                    refresh();
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold"
                >
                  <CheckCircle2 className="w-3 h-3" /> Approve
                </button>
                <button
                  type="button"
                  onClick={() => {
                    decideRequest(row.id, 'denied', user?.username);
                    refresh();
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-100 text-rose-700 text-xs font-bold"
                >
                  <XCircle className="w-3 h-3" /> Deny
                </button>
              </div>
            </li>
          ))}
          {!requests.filter((r) => r.status === 'pending').length && (
            <p className="text-sm text-gray-500">No pending requests.</p>
          )}
        </ul>
      </section>
    </div>
  );
}

export function studentRequestExtra(user, minutes, kind, reason) {
  return createAccessRequest({
    username: user.username,
    full_name: user.full_name,
    kind,
    minutes,
    reason,
  });
}
