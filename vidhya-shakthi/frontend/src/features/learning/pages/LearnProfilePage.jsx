import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut, GraduationCap } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext.jsx';
import { GRADE10_LEARN_META } from '../catalog/grade10Catalog.js';

export default function LearnProfilePage() {
  const { user, logout } = useAuth();

  return (
    <div className="px-5 pt-8 pb-8">
      <h1 className="text-2xl font-extrabold text-[#1e3a5f]">Profile</h1>
      <div className="mt-5 bg-white rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#1e3a5f] text-white flex items-center justify-center">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <p className="font-extrabold text-[#1e3a5f]">{user?.full_name || 'Student'}</p>
            <p className="text-xs text-slate-500 uppercase tracking-wide">{user?.role}</p>
          </div>
        </div>
        <dl className="mt-5 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-slate-500">Grade</dt>
            <dd className="font-semibold">{GRADE10_LEARN_META.grade}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">Board</dt>
            <dd className="font-semibold">{GRADE10_LEARN_META.board}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Year</dt>
            <dd className="font-semibold text-right">{GRADE10_LEARN_META.academicYear}</dd>
          </div>
        </dl>
      </div>

      {user?.role === 'STUDENT' && (
        <Link
          to="/student"
          className="mt-4 block text-center py-3 rounded-2xl bg-white font-bold text-[#1e3a5f] shadow-sm"
        >
          Open dashboard
        </Link>
      )}
      {(user?.role === 'ADMIN' || user?.role === 'TEACHER') && (
        <Link
          to="/dashboard"
          className="mt-4 block text-center py-3 rounded-2xl bg-white font-bold text-[#1e3a5f] shadow-sm"
        >
          Open teacher dashboard
        </Link>
      )}

      <button
        type="button"
        onClick={logout}
        className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-rose-50 text-rose-700 font-bold"
      >
        <LogOut className="w-4 h-4" />
        Logout
      </button>
    </div>
  );
}
