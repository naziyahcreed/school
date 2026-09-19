import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { GraduationCap, Loader2, LogIn, User, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DEMO_CREDENTIALS, getHomePathForRole } from '../lib/auth';

export default function Login() {
  const { isAuthenticated, user, login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated && user?.role) {
    return <Navigate to={getHomePathForRole(user.role)} replace />;
  }

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (row) => {
    setUsername(row.username);
    setPassword(row.password);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center">
        <div className="text-white space-y-4 px-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight">Vidhya Shakthi</h1>
              <p className="text-indigo-200 text-sm">Samacheer Kalvi · School OS</p>
            </div>
          </div>
          <p className="text-indigo-100 text-lg leading-relaxed">
            Login pannitu unga role-ku etha page-ku automatic-aa pogum — Admin dashboard, Teacher tools, Student Learn Hub, Parent view.
          </p>
          <p className="text-sm text-indigo-300/90">
            பதிவு / Login — நிர்வாகி · ஆசிரியர் · மாணவர் · பெற்றோர்
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-white/10">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Sign in</h2>
          <p className="text-sm text-gray-500 mb-6">Username & password</p>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Username</label>
              <div className="relative mt-1">
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="admin / teacher / student / parent"
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Password</label>
              <div className="relative mt-1">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-3 py-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-60"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5" />}
              Login
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-xs font-bold text-gray-500 uppercase mb-3">Demo accounts (click to fill)</p>
            <div className="space-y-2">
              {DEMO_CREDENTIALS.map((row) => (
                <button
                  key={row.username}
                  type="button"
                  onClick={() => fillDemo(row)}
                  className="w-full text-left px-3 py-2.5 rounded-xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-colors"
                >
                  <span className="font-semibold text-gray-900 text-sm">{row.labelEn}</span>
                  <span className="text-gray-400 text-xs mx-2">·</span>
                  <span className="text-xs text-gray-600 font-mono">{row.username}</span>
                  <span className="text-gray-400 text-xs mx-1">/</span>
                  <span className="text-xs text-indigo-600 font-mono">{row.password}</span>
                  <span className="block text-xs text-gray-400 mt-0.5">{row.labelTa}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
