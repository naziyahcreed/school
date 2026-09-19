import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import {
  LayoutDashboard, Users, ClipboardCheck, BookOpen, BarChart3,
  Bot, FileQuestion, Calendar, Bell, AlertTriangle, CheckCircle2,
  XCircle, Clock, Mic, Upload, Send, Sparkles, GraduationCap,
  MessageCircle, ChevronRight, Loader2, Phone, FileCode, LogOut,
} from 'lucide-react';
import LearnContentCMS from './components/LearnContentCMS';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, RadialBarChart, RadialBar,
} from 'recharts';

function ChartBox({ height, children }) {
  return (
    <div className="w-full" style={{ minHeight: height, height }}>
      {children}
    </div>
  );
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const TABS = [
  { id: 'admin', label: 'Admin Control', icon: LayoutDashboard, roles: ['ADMIN'] },
  { id: 'learn-cms', label: 'Upload Learn Tutorials', icon: Upload, roles: ['ADMIN', 'TEACHER'] },
  { id: 'attendance', label: 'Attendance & Alerts', icon: ClipboardCheck, roles: ['ADMIN', 'TEACHER'] },
  { id: 'homework', label: 'Smart Homework', icon: BookOpen, roles: ['ADMIN', 'TEACHER'] },
  { id: 'analytics', label: 'Student Analytics', icon: BarChart3, roles: ['ADMIN', 'TEACHER'] },
  { id: 'tutor', label: 'AI Tamil Tutor', icon: Bot, roles: ['ADMIN', 'TEACHER'] },
  { id: 'questions', label: 'Questions & Timetable', icon: FileQuestion, roles: ['ADMIN', 'TEACHER'] },
];

function tabsForRole(role) {
  const r = role || 'ADMIN';
  return TABS.filter((t) => t.roles.includes(r));
}

function defaultTabForRole(role, initialTab) {
  if (initialTab && TABS.some((t) => t.id === initialTab)) return initialTab;
  return role === 'TEACHER' ? 'learn-cms' : 'admin';
}

const CATEGORY_STYLES = {
  TOPPER: { bg: 'bg-emerald-100', text: 'text-emerald-800', label: 'Topper' },
  AVERAGE: { bg: 'bg-amber-100', text: 'text-amber-800', label: 'Average' },
  SLOW_LEARNER: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Slow Learner' },
};

const MOCK_STUDENTS = [
  { id: '1', name: 'Suresh Kumar', roll: '101', status: 'PRESENT', alertSent: false },
  { id: '2', name: 'Priya Sharma', roll: '102', status: 'PRESENT', alertSent: false },
  { id: '3', name: 'Karthik Prakash', roll: '103', status: 'ABSENT', alertSent: true },
  { id: '4', name: 'Meena Rani', roll: '104', status: 'ABSENT', alertSent: false },
  { id: '5', name: 'Karthik S', roll: '105', status: 'LEAVE', alertSent: true },
  { id: '6', name: 'Divya M', roll: '106', status: 'PRESENT', alertSent: false },
];

const ANALYTICS_DATA = [
  { name: 'Suresh K.', marks: 92, category: 'TOPPER', weakTopics: '—', action: 'Insert HOTS Problems' },
  { name: 'Priya D.', marks: 74, category: 'AVERAGE', weakTopics: 'Trigonometry', action: 'Practice Drills' },
  { name: 'Karthik P.', marks: 38, category: 'SLOW_LEARNER', weakTopics: 'Algebra, Fractions', action: 'Assign Foundational Video' },
  { name: 'Meena R.', marks: 41, category: 'SLOW_LEARNER', weakTopics: 'Geometry', action: 'Audio Flashcards (Tamil)' },
  { name: 'Karthik S.', marks: 88, category: 'TOPPER', weakTopics: '—', action: 'Advanced Reading' },
  { name: 'Divya M.', marks: 68, category: 'AVERAGE', weakTopics: 'Statistics', action: 'Revision Notes' },
];

const ACADEMIC_HEALTH = [
  { subject: 'Math', toppers: 12, average: 28, slow: 8 },
  { subject: 'Science', toppers: 15, average: 22, slow: 6 },
  { subject: 'Tamil', toppers: 10, average: 30, slow: 5 },
];

const ATTENDANCE_TREND = [
  { month: 'Jan', present: 94, absent: 6 },
  { month: 'Feb', present: 92, absent: 8 },
  { month: 'Mar', present: 95, absent: 5 },
  { month: 'Apr', present: 91, absent: 9 },
  { month: 'May', present: 93, absent: 7 },
  { month: 'Jun', present: 96, absent: 4 },
];

const WORKLOAD_GAUGE = [{ name: 'Load', value: 72, fill: '#6366f1' }];

const TIMETABLE_PREVIEW = [
  { day: 'MON', p1: 'Math', p2: 'Tamil', p3: 'Science', p4: 'English', p5: 'Math', p6: 'Lab' },
  { day: 'TUE', p1: 'Science', p2: 'Math', p3: 'Tamil', p4: 'Social', p5: 'English', p6: 'PE' },
  { day: 'WED', p1: 'Tamil', p2: 'Science', p3: 'Math', p4: 'Lab', p5: 'English', p6: 'Library' },
  { day: 'THU', p1: 'Math', p2: 'English', p3: 'Science', p4: 'Tamil', p5: 'Social', p6: 'Activity' },
  { day: 'FRI', p1: 'Science', p2: 'Math', p3: 'English', p4: 'Tamil', p5: 'Test Prep', p6: 'Club' },
  { day: 'SAT', p1: 'Revision', p2: 'Revision', p3: 'Sports', p4: '—', p5: '—', p6: '—' },
];

const SAMACHEER_BOOKS = [
  { title: 'கணிதம் — Grade 10', subject: 'Mathematics', term: 1 },
  { title: 'அறிவியல் — Grade 10', subject: 'Science', term: 1 },
  { title: 'தமிழ் — Grade 10', subject: 'Tamil', term: 1 },
  { title: 'English — Grade 10', subject: 'English', term: 1 },
  { title: 'சமூக அறிவியல் — Grade 10', subject: 'Social Science', term: 2 },
];

function StatusToggle({ status, onChange }) {
  const options = ['PRESENT', 'ABSENT', 'LEAVE'];
  const colors = {
    PRESENT: 'bg-emerald-500 text-white',
    ABSENT: 'bg-rose-500 text-white',
    LEAVE: 'bg-amber-500 text-white',
  };
  return (
    <div className="flex gap-1">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all ${
            status === opt ? colors[opt] : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          {opt === 'PRESENT' ? 'P' : opt === 'ABSENT' ? 'A' : 'L'}
        </button>
      ))}
    </div>
  );
}

function KpiCard({ label, value, sub, color, icon: Icon }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500 font-medium">{label}</p>
          <p className={`text-3xl font-extrabold mt-1 ${color}`}>{value}</p>
          {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
        </div>
        {Icon && (
          <div className={`p-2 rounded-xl ${color.replace('text-', 'bg-').replace('600', '100')}`}>
            <Icon className={`w-5 h-5 ${color}`} />
          </div>
        )}
      </div>
    </div>
  );
}

function AdminTab({ onOpenLearnCms }) {
  const alerts = [
    { text: 'Std 10-A: No attendance filled for Period 3', severity: 'critical' },
    { text: 'Teacher Ravi: 34 periods this week (burnout risk)', severity: 'warning' },
    { text: '12 homework submissions pending AI grading', severity: 'info' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Admin Master Control</h2>
          <p className="text-gray-500 text-sm">VIDHYA SHAKTHI — Admin Operating System</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700">
          <Sparkles className="w-4 h-4" /> Generate Report
        </button>
      </div>

      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-5 text-white flex flex-wrap items-center justify-between gap-4 shadow-md">
        <div>
          <p className="text-xs font-bold uppercase text-white/80">SSLC Learn Hub</p>
          <p className="font-bold text-lg">Add HTML/CSS tutorials — teachers submit, admin verifies</p>
          <p className="text-sm text-white/90 mt-1">Choose subject, unit, and exact slot on the student page.</p>
        </div>
        <button
          type="button"
          onClick={onOpenLearnCms}
          className="bg-white text-indigo-700 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-50"
        >
          Open Learn Tutorials CMS
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Total Students" value="1,245" sub="+12 this term" color="text-blue-600" icon={Users} />
        <KpiCard label="Total Teachers" value="84" sub="4 on leave today" color="text-indigo-600" icon={GraduationCap} />
        <KpiCard label="Avg Attendance" value="92.4%" sub="+1.2% vs last month" color="text-emerald-600" icon={CheckCircle2} />
        <KpiCard label="Critical Alerts" value="3" sub="Requires action" color="text-rose-600" icon={AlertTriangle} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">School Academic Health</h3>
          <ChartBox height={260}>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={ACADEMIC_HEALTH}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="subject" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="toppers" name="Toppers" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="average" name="Average" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="slow" name="Slow Learners" fill="#f97316" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          </ChartBox>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">Teacher Workload</h3>
          <ChartBox height={200}>
          <ResponsiveContainer width="100%" height={200}>
            <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={WORKLOAD_GAUGE} startAngle={180} endAngle={0}>
              <RadialBar dataKey="value" cornerRadius={8} fill="#6366f1" />
            </RadialBarChart>
          </ResponsiveContainer>
          </ChartBox>
          <p className="text-center text-sm text-gray-500 -mt-4">School avg: 72% capacity</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">Attendance Trend (Jan–Jun)</h3>
          <ChartBox height={220}>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={ATTENDANCE_TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="present" name="Present %" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="absent" name="Absent %" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          </ChartBox>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Bell className="w-4 h-4 text-rose-500" /> Critical Alerts
          </h3>
          <div className="space-y-3">
            {alerts.map((a, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-rose-50 border border-rose-100">
                <AlertTriangle className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
                <p className="text-sm text-rose-800">{a.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AttendanceTab() {
  const [students, setStudents] = useState(MOCK_STUDENTS);
  const [alertLoading, setAlertLoading] = useState(false);
  const [alertResult, setAlertResult] = useState(null);

  const updateStatus = (id, status) => {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, status, alertSent: false } : s)));
  };

  const triggerAlerts = async () => {
    setAlertLoading(true);
    setAlertResult(null);
    const absentees = students.filter((s) => s.status === 'ABSENT');
    try {
      const payload = {
        school_id: 'a0000000-0000-0000-0000-000000000001',
        grade_id: 'b0000000-0000-0000-0000-000000000001',
        marked_by: '00000000-0000-0000-0000-000000000099',
        entries: students.map((s) => ({
          student_id: s.id,
          status: s.status,
        })),
        trigger_alerts: true,
        alert_channel: 'WHATSAPP',
      };
      const res = await fetch(`${API_BASE}/api/v1/attendance/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        setAlertResult(`✓ ${data.alerts_queued} WhatsApp alerts queued (${data.absent_count} absent)`);
        setStudents((prev) =>
          prev.map((s) => (s.status === 'ABSENT' ? { ...s, alertSent: true } : s))
        );
      } else {
        setAlertResult(`Demo mode: ${absentees.length} absentee alert(s) would be sent via WhatsApp`);
        setStudents((prev) =>
          prev.map((s) => (s.status === 'ABSENT' ? { ...s, alertSent: true } : s))
        );
      }
    } catch {
      setAlertResult(`Demo mode: ${absentees.length} absentee alert(s) triggered (WhatsApp + SMS fallback)`);
      setStudents((prev) =>
        prev.map((s) => (s.status === 'ABSENT' ? { ...s, alertSent: true } : s))
      );
    } finally {
      setAlertLoading(false);
    }
  };

  const absentCount = students.filter((s) => s.status === 'ABSENT').length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Teacher Attendance & Alert</h2>
        <p className="text-gray-500 text-sm">Std 10-A · {new Date().toLocaleDateString('en-IN')}</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Student</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Roll No</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Alert Sent</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                      {s.name.charAt(0)}
                    </div>
                    <span className="font-medium text-gray-800">{s.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500">{s.roll}</td>
                <td className="px-4 py-3">
                  <StatusToggle status={s.status} onChange={(st) => updateStatus(s.id, st)} />
                </td>
                <td className="px-4 py-3">
                  {s.alertSent ? (
                    <span className="flex items-center gap-1 text-emerald-600 text-xs font-semibold">
                      <CheckCircle2 className="w-4 h-4" /> Sent
                    </span>
                  ) : s.status === 'ABSENT' ? (
                    <span className="flex items-center gap-1 text-rose-500 text-xs font-semibold">
                      <XCircle className="w-4 h-4" /> Pending
                    </span>
                  ) : (
                    <span className="text-gray-300 text-xs">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col items-center gap-3">
        <button
          onClick={triggerAlerts}
          disabled={alertLoading || absentCount === 0}
          className="flex items-center gap-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white px-8 py-4 rounded-2xl font-bold text-base shadow-lg transition-all"
        >
          {alertLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Phone className="w-5 h-5" />
          )}
          [ Trigger Parent WhatsApp Alerts for Absentees ({absentCount}) ]
        </button>
        {alertResult && (
          <p className="text-sm text-emerald-700 font-medium bg-emerald-50 px-4 py-2 rounded-xl">{alertResult}</p>
        )}
      </div>
    </div>
  );
}

function HomeworkTab() {
  const [form, setForm] = useState({ subject: 'Mathematics', dueDate: '', title: '', description: '' });
  const assignments = [
    { title: 'Quadratic Equations — Practice Set', subject: 'Math', due: '2025-09-22', progress: 78, priority: 'High' },
    { title: 'Photosynthesis Diagram', subject: 'Science', due: '2025-09-23', progress: 45, priority: 'Medium' },
    { title: 'Tamil Essay — Environment', subject: 'Tamil', due: '2025-09-25', progress: 12, priority: 'Low' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Smart Digital Homework Diary</h2>
        <p className="text-gray-500 text-sm">Create assignments with audio, PDF, and AI grading</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
          <h3 className="font-bold text-gray-800">Publish New Assignment</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">Subject</label>
              <select
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2 text-sm"
              >
                {['Mathematics', 'Science', 'Tamil', 'English'].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">Due Date</label>
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase">Topic Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Real Numbers — Exercise 1.3"
              className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase">Audio/Text Assignment Description</label>
            <div className="relative mt-1">
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={4}
                placeholder="Describe the assignment..."
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm pr-10"
              />
              <button className="absolute bottom-3 right-3 p-1.5 bg-indigo-100 rounded-lg hover:bg-indigo-200">
                <Mic className="w-4 h-4 text-indigo-600" />
              </button>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 border border-gray-200 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-50">
              <Upload className="w-4 h-4" /> Upload PDF/Image
            </button>
            <button className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700">
              Publish Assignment
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4">Student Priority View</h3>
            <div className="space-y-2">
              {['High', 'Medium', 'Low'].map((p) => (
                <div key={p} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                  <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                    p === 'High' ? 'bg-rose-100 text-rose-700' :
                    p === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                  }`}>{p}</span>
                  <span className="text-sm text-gray-600">
                    {p === 'High' ? 'Quadratic Equations — Due Tomorrow' :
                     p === 'Medium' ? 'Photosynthesis Diagram — Due in 2 days' :
                     'Tamil Essay — Due in 4 days'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4">Active Assignments — Completion</h3>
            {assignments.map((a, i) => (
              <div key={i} className="mb-4 last:mb-0">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">{a.title}</span>
                  <span className="text-gray-400">{a.progress}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${a.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AnalyticsTab() {
  const [grade, setGrade] = useState('10');
  const [subject, setSubject] = useState('Math');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Student Categorization Analytics</h2>
          <p className="text-gray-500 text-sm">AI-driven performance categories with remedial actions</p>
        </div>
        <div className="flex gap-3">
          <select value={grade} onChange={(e) => setGrade(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2 text-sm">
            {['8', '9', '10', '11', '12'].map((g) => <option key={g} value={g}>Grade {g}</option>)}
          </select>
          <select value={subject} onChange={(e) => setSubject(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2 text-sm">
            {['Math', 'Science', 'Tamil', 'English'].map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {Object.entries(CATEGORY_STYLES).map(([key, style]) => {
          const count = ANALYTICS_DATA.filter((d) => d.category === key).length;
          return (
            <div key={key} className={`rounded-2xl p-4 ${style.bg} border border-white/50`}>
              <p className={`text-2xl font-extrabold ${style.text}`}>{count}</p>
              <p className={`text-sm font-semibold ${style.text}`}>{style.label}s</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              {['Student', 'Quarterly Marks', 'Category', 'Weak Topics', 'AI Remedial Action'].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-semibold text-gray-600">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ANALYTICS_DATA.map((row, i) => {
              const cat = CATEGORY_STYLES[row.category];
              return (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3 font-medium text-gray-800">{row.name}</td>
                  <td className="px-4 py-3">
                    <span className={`font-bold ${row.marks >= 80 ? 'text-emerald-600' : row.marks < 45 ? 'text-orange-600' : 'text-amber-600'}`}>
                      {row.marks}%
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-lg text-xs font-bold ${cat.bg} ${cat.text}`}>{cat.label}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{row.weakTopics}</td>
                  <td className="px-4 py-3">
                    <button className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg font-semibold hover:bg-indigo-100">
                      [ {row.action} ]
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TutorTab() {
  const [messages, setMessages] = useState([
    {
      role: 'tutor',
      content: 'வணக்கம்! நான் உங்கள் AI Tamil Tutor. கணிதம், அறிவியல், தமிழ் — எந்த பாடத்திலும் கேளுங்கள். நான் நேரடி பதிலை கொடுக்காமல், கேள்விகள் மூலம் உங்களை வழிநடத்துவேன்!',
      contentEn: 'Hello! I am your AI Tamil Tutor. Ask me anything — I will guide you with questions, not direct answers!',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'student', content: userMsg }]);
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/ai/tutor-chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: '00000000-0000-0000-0000-000000000001',
          message: userMsg,
          language: 'ta',
          grade_number: 10,
        }),
      });
      const data = res.ok ? await res.json() : null;
      setMessages((prev) => [
        ...prev,
        {
          role: 'tutor',
          content: data?.reply_ta || data?.reply || 'நல்ல கேள்வி! முதலில், இந்த கருத்தை உனக்கு ஏற்கனவே தெரிந்ததா?',
          contentEn: data?.reply,
          followUp: data?.follow_up_questions,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'tutor',
          content: 'நல்ல கேள்வி! முதலில், இந்த topic-ஐ உன் சொந்த வார்த்தைகளில் define செய்ய முடியுமா?',
          contentEn: 'Good question! Can you define this topic in your own words first?',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">24/7 AI Tamil Tutor & Digital Books</h2>
        <p className="text-gray-500 text-sm">Socratic RAG tutor grounded in Samacheer Kalvi syllabus</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <p className="text-xs font-bold text-amber-700 uppercase">My Academic Status</p>
            <p className="text-lg font-extrabold text-amber-800 mt-1">FOCUS NEEDED</p>
            <p className="text-sm text-amber-700 mt-1">Algebra & Fractions need attention</p>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <p className="font-bold text-gray-800 text-sm mb-3">Recommended Remedial</p>
            {['Foundational Algebra Video', 'Practice Set 2.1', 'Audio Flashcards'].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <span className="text-sm text-gray-600">{item}</span>
                <button className="text-xs text-indigo-600 font-semibold flex items-center gap-1">
                  let's proceed <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <p className="font-bold text-gray-800 text-sm mb-3">Samacheer Digital Books</p>
            <div className="grid grid-cols-2 gap-2">
              {SAMACHEER_BOOKS.map((book, i) => (
                <div key={i} className="p-3 bg-indigo-50 rounded-xl cursor-pointer hover:bg-indigo-100 transition-colors">
                  <BookOpen className="w-5 h-5 text-indigo-600 mb-1" />
                  <p className="text-xs font-semibold text-indigo-800 leading-tight">{book.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col h-[520px]">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-indigo-600" />
            <span className="font-bold text-gray-800">AI Tamil Tutor (24/7)</span>
            <span className="ml-auto text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-lg font-semibold">Socratic Mode</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'student' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                  msg.role === 'student'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {msg.role === 'tutor' && msg.content && (
                    <p className="font-medium leading-relaxed">{msg.content}</p>
                  )}
                  {msg.role === 'tutor' && msg.contentEn && (
                    <p className="text-xs text-gray-500 mt-1 italic">{msg.contentEn}</p>
                  )}
                  {msg.role === 'student' && <p>{msg.content}</p>}
                  {msg.followUp && (
                    <div className="mt-2 space-y-1">
                      {msg.followUp.map((q, j) => (
                        <p key={j} className="text-xs text-indigo-600 font-medium">→ {q}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Loader2 className="w-4 h-4 animate-spin" /> Tutor is thinking...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-4 border-t border-gray-100 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type your question in Tamil or English..."
              className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="bg-indigo-600 text-white p-2.5 rounded-xl hover:bg-indigo-700 disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuestionsTab() {
  const [form, setForm] = useState({
    subject: 'Mathematics',
    grade: 10,
    chapters: 'Real Numbers, Polynomials',
    easy: 30,
    medium: 50,
    hard: 20,
    title: 'Quarterly Exam — Mathematics',
  });
  const [paper, setPaper] = useState(null);
  const [loading, setLoading] = useState(false);

  const generatePaper = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/ai/generate-question-paper`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacher_id: '00000000-0000-0000-0000-000000000099',
          school_id: 'a0000000-0000-0000-0000-000000000001',
          subject_id: 'c0000000-0000-0000-0000-000000000001',
          grade_number: form.grade,
          title: form.title,
          chapter_names: form.chapters.split(',').map((c) => c.trim()),
          difficulty_ratio: { EASY: form.easy, MEDIUM: form.medium, HARD: form.hard },
          include_hots: true,
          language: 'ta',
        }),
      });
      if (res.ok) {
        setPaper(await res.json());
      } else {
        throw new Error('API unavailable');
      }
    } catch {
      setPaper({
        title: form.title,
        total_marks: 100,
        duration_minutes: 180,
        questions: [
          { question_number: 1, question_type: 'MCQ', difficulty: 'EASY', marks: 1,
            question_text: 'What is √144?', question_text_ta: '√144 = ?', options: ['10', '11', '12', '14'], correct_answer: '12' },
          { question_number: 2, question_type: 'HOTS', difficulty: 'HARD', marks: 5,
            question_text: 'Prove that √2 is irrational.', question_text_ta: '√2 விகிதமுறா எண் என நிரூபிக்க.', correct_answer: 'Contradiction proof' },
        ],
        blueprint: [
          { section_name: 'Part A', question_type: 'MCQ', count: 10, marks_each: 1, total_marks: 10 },
          { section_name: 'Part B — HOTS', question_type: 'HOTS', count: 4, marks_each: 5, total_marks: 20 },
        ],
        answer_key: { '1': '12', '2': 'Contradiction proof' },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">AI Question Generator & Timetable Scheduler</h2>
        <p className="text-gray-500 text-sm">Generate Samacheer-aligned papers and preview master timetable</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-500" /> Question Paper Builder
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">Subject</label>
              <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2 text-sm">
                {['Mathematics', 'Science', 'Tamil', 'English'].map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">Grade</label>
              <input type="number" min={1} max={12} value={form.grade}
                onChange={(e) => setForm({ ...form, grade: +e.target.value })}
                className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2 text-sm" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase">Chapters (comma-separated)</label>
            <input value={form.chapters} onChange={(e) => setForm({ ...form, chapters: e.target.value })}
              className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase">Difficulty Ratio (%)</label>
            <div className="grid grid-cols-3 gap-2 mt-1">
              {[['easy', 'Easy', 'emerald'], ['medium', 'Medium', 'amber'], ['hard', 'Hard', 'rose']].map(([key, label, color]) => (
                <div key={key}>
                  <label className={`text-xs text-${color}-600 font-semibold`}>{label}</label>
                  <input type="number" min={0} max={100} value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: +e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-2 py-1.5 text-sm" />
                </div>
              ))}
            </div>
          </div>
          <button onClick={generatePaper} disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileQuestion className="w-4 h-4" />}
            Generate Question Paper
          </button>

          {paper && (
            <div className="mt-4 p-4 bg-indigo-50 rounded-xl space-y-3 max-h-64 overflow-y-auto">
              <p className="font-bold text-indigo-900">{paper.title}</p>
              {paper.blueprint?.map((b, i) => (
                <p key={i} className="text-xs text-indigo-700">
                  {b.section_name}: {b.count} × {b.marks_each} marks = {b.total_marks}
                </p>
              ))}
              {paper.questions?.map((q) => (
                <div key={q.question_number} className="text-sm border-t border-indigo-100 pt-2">
                  <span className="font-bold text-indigo-800">Q{q.question_number}.</span>{' '}
                  {q.question_text_ta || q.question_text}
                  <span className="ml-2 text-xs bg-white px-1.5 py-0.5 rounded text-indigo-600">{q.question_type} · {q.difficulty}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-500" /> Master Timetable — Std 10-A
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-2 py-2 text-left font-semibold text-gray-600">Day</th>
                  {['P1', 'P2', 'P3', 'P4', 'P5', 'P6'].map((p) => (
                    <th key={p} className="px-2 py-2 text-center font-semibold text-gray-600">{p}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TIMETABLE_PREVIEW.map((row) => (
                  <tr key={row.day} className="border-b border-gray-50">
                    <td className="px-2 py-2 font-bold text-indigo-700">{row.day}</td>
                    {[row.p1, row.p2, row.p3, row.p4, row.p5, row.p6].map((cell, i) => (
                      <td key={i} className="px-2 py-2 text-center">
                        <span className={`inline-block px-1.5 py-0.5 rounded text-xs font-medium ${
                          cell === 'Lab' || cell === 'PE' ? 'bg-purple-100 text-purple-700' :
                          cell === '—' ? 'text-gray-300' : 'bg-blue-50 text-blue-700'
                        }`}>{cell}</span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 p-3 bg-amber-50 rounded-xl">
            <p className="text-xs font-semibold text-amber-800">Optimizer Status: No teacher/room conflicts detected</p>
            <p className="text-xs text-amber-700 mt-1">Teacher burnout avg: 72% · Max load: Ravi (34 periods/week)</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UnifiedDashboard({ initialTab }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const visibleTabs = useMemo(() => tabsForRole(user?.role), [user?.role]);
  const [activeTab, setActiveTab] = useState(() => defaultTabForRole(user?.role, initialTab));

  useEffect(() => {
    if (location.pathname.endsWith('/learn-cms')) {
      setActiveTab('learn-cms');
    }
  }, [location.pathname]);

  useEffect(() => {
    if (!visibleTabs.some((t) => t.id === activeTab)) {
      setActiveTab(defaultTabForRole(user?.role, initialTab));
    }
  }, [visibleTabs, activeTab, user?.role, initialTab]);

  const selectTab = (id) => {
    setActiveTab(id);
    if (id === 'learn-cms') navigate('/dashboard/learn-cms', { replace: true });
    else if (location.pathname !== '/dashboard') navigate('/dashboard', { replace: true });
  };

  const renderTab = useCallback(() => {
    switch (activeTab) {
      case 'admin': return <AdminTab onOpenLearnCms={() => selectTab('learn-cms')} />;
      case 'learn-cms': return <LearnContentCMS />;
      case 'attendance': return <AttendanceTab />;
      case 'homework': return <HomeworkTab />;
      case 'analytics': return <AnalyticsTab />;
      case 'tutor': return <TutorTab />;
      case 'questions': return <QuestionsTab />;
      default: return <AdminTab />;
    }
  }, [activeTab, selectTab]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <header className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-blue-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight">VIDHYA SHAKTHI</h1>
              <p className="text-indigo-200 text-xs">Unified School Operating System · Samacheer Kalvi</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/learn"
              className="hidden sm:flex items-center gap-2 text-xs font-bold bg-white/15 hover:bg-white/25 text-white px-3 py-2 rounded-xl border border-white/20 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              SSLC Learn Hub
            </Link>
            <span className="hidden md:flex items-center gap-1 text-xs bg-emerald-500/20 text-emerald-300 px-3 py-1.5 rounded-full font-semibold">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" /> System Online
            </span>
            <div className="hidden sm:block text-right text-xs">
              <p className="font-bold text-white">{user?.full_name}</p>
              <p className="text-indigo-200">{user?.role}</p>
            </div>
            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-1 text-xs font-bold bg-white/10 hover:bg-white/20 px-3 py-2 rounded-xl border border-white/20"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <nav className="flex gap-1 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {visibleTabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => selectTab(id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                activeTab === id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </nav>

        <main>{renderTab()}</main>
      </div>
    </div>
  );
}
