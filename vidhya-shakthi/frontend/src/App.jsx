import React from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import UnifiedDashboard from './UnifiedDashboard';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import ParentDashboard from './pages/ParentDashboard';
import StudentLearning from './pages/StudentLearning';
import Login from './pages/Login';
import RequireAuth from './components/RequireAuth';
import GuideHome from './pages/guides/GuideHome';
import MathsUnits from './pages/guides/maths/MathsUnits';
import Unit1Exercises from './pages/guides/maths/unit-1/Unit1Exercises';
import Exercise1_1 from './pages/guides/maths/unit-1/Exercise1_1';
import { AuthProvider } from './context/AuthContext';
import { getHomePathForRole, readStoredAuth } from './lib/auth';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('Vidhya Shakthi UI error:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-rose-50 flex items-center justify-center p-8 font-sans">
          <div className="max-w-lg bg-white rounded-2xl border border-rose-200 p-6 shadow-sm">
            <h1 className="text-lg font-bold text-rose-800 mb-2">Something went wrong</h1>
            <p className="text-sm text-rose-700 mb-4">{String(this.state.error?.message || this.state.error)}</p>
            <button
              type="button"
              className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold"
              onClick={() => window.location.reload()}
            >
              Reload page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function RootRedirect() {
  const session = readStoredAuth();
  if (!session?.token || !session?.user?.role) {
    return <Navigate to="/login" replace />;
  }
  return <Navigate to={getHomePathForRole(session.user.role)} replace />;
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<RootRedirect />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <RequireAuth roles={['ADMIN', 'TEACHER']}>
                  <UnifiedDashboard />
                </RequireAuth>
              }
            />
            <Route
              path="/dashboard/learn-cms"
              element={
                <RequireAuth roles={['ADMIN', 'TEACHER']}>
                  <UnifiedDashboard initialTab="learn-cms" />
                </RequireAuth>
              }
            />
            <Route
              path="/learn"
              element={
                <RequireAuth roles={['ADMIN', 'TEACHER', 'STUDENT']}>
                  <StudentLearning />
                </RequireAuth>
              }
            />
            <Route
              path="/parent"
              element={
                <RequireAuth roles={['PARENT', 'ADMIN']}>
                  <ParentDashboard />
                </RequireAuth>
              }
            />
            <Route
              path="/legacy/admin"
              element={
                <RequireAuth roles={['ADMIN']}>
                  <AdminDashboard />
                </RequireAuth>
              }
            />
            <Route
              path="/legacy/teacher"
              element={
                <RequireAuth roles={['TEACHER', 'ADMIN']}>
                  <TeacherDashboard />
                </RequireAuth>
              }
            />
            <Route
              path="/legacy/student"
              element={
                <RequireAuth roles={['STUDENT', 'ADMIN', 'TEACHER']}>
                  <StudentDashboard />
                </RequireAuth>
              }
            />
            <Route
              path="/portals"
              element={
                <RequireAuth roles={['ADMIN', 'TEACHER', 'STUDENT', 'PARENT']}>
                  <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
                    <nav className="bg-white border-b border-gray-200 px-8 py-4 shadow-sm">
                      <div className="max-w-7xl mx-auto flex justify-between items-center">
                        <Link
                          to="/dashboard"
                          className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 tracking-tight"
                        >
                          Vidhya Shakthi
                        </Link>
                      </div>
                    </nav>
                    <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 text-center mt-32">
                      <h2 className="text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">Legacy Portals</h2>
                      <div className="flex justify-center gap-4 flex-wrap">
                        <Link to="/legacy/student" className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg">
                          Student
                        </Link>
                        <Link to="/legacy/teacher" className="bg-white border border-gray-200 text-gray-700 px-8 py-4 rounded-2xl font-bold shadow-sm">
                          Teacher
                        </Link>
                        <Link to="/legacy/parent" className="bg-white border border-gray-200 text-gray-700 px-8 py-4 rounded-2xl font-bold shadow-sm">
                          Parent
                        </Link>
                      </div>
                    </main>
                  </div>
                </RequireAuth>
              }
            />
            <Route path="/guides" element={<GuideHome />} />
            <Route path="/guides/maths" element={<MathsUnits />} />
            <Route path="/guides/maths/unit-1" element={<Unit1Exercises />} />
            <Route path="/guides/maths/unit-1/exercise-1-1" element={<Exercise1_1 />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
