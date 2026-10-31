import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen, CheckCircle2, XCircle, Eye, Loader2, MapPin,
  User, Shield, Clock, Trash2, ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { buildPlacementTree, LESSON_SLOTS, placementLabel } from '../catalog/placement.js';
import {
  approveLesson,
  createLesson,
  deleteLesson,
  fetchAllLessonsForAdmin,
  rejectLesson,
} from '../../../lib/learnContentApi';
import CustomHtmlLesson from '../../../components/CustomHtmlLesson';
import LearnFileUploadZone from './LearnFileUploadZone.jsx';

const COLOR = {
  light: 'bg-indigo-50',
  text: 'text-indigo-700',
  border: 'border-indigo-200',
  bg: 'bg-indigo-600',
};

const STATUS_BADGE = {
  APPROVED: 'bg-emerald-100 text-emerald-800',
  PENDING_REVIEW: 'bg-amber-100 text-amber-800',
  REJECTED: 'bg-rose-100 text-rose-800',
  DRAFT: 'bg-gray-100 text-gray-700',
};

export default function LearnContentCMSPage() {
  const { user } = useAuth();
  const isTeacherAccount = user?.role === 'TEACHER';
  const tree = useMemo(() => buildPlacementTree(), []);
  const [panelRole, setPanelRole] = useState(isTeacherAccount ? 'TEACHER' : 'ADMIN');
  const [authorName, setAuthorName] = useState(user?.full_name || 'Staff');
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [lessons, setLessons] = useState([]);
  const [message, setMessage] = useState(null);

  const [form, setForm] = useState({
    subjectId: 'mathematics',
    chapterId: tree.subjects[0]?.chapters[0]?.id ?? '',
    slot: 'append_unit',
    conceptId: '',
    sortOrder: 0,
    title: '',
    titleTa: '',
    htmlContent: '<section class="lesson">\n  <h2>Topic title</h2>\n  <p>Step 1: …</p>\n</section>',
    cssContent: '.lesson { padding: 0.5rem; }\n.lesson h2 { color: #4338ca; }',
    publishNow: !isTeacherAccount,
  });

  useEffect(() => {
    if (user?.full_name) setAuthorName(user.full_name);
    if (isTeacherAccount) {
      setPanelRole('TEACHER');
      setForm((f) => ({ ...f, publishNow: false }));
    }
  }, [user?.full_name, isTeacherAccount]);

  const chapters = useMemo(() => {
    const sub = tree.subjects.find((s) => s.id === form.subjectId);
    return sub?.chapters ?? [];
  }, [tree, form.subjectId]);

  const concepts = useMemo(() => {
    const ch = chapters.find((c) => c.id === form.chapterId);
    return ch?.conceptIds ?? [];
  }, [chapters, form.chapterId]);

  useEffect(() => {
    if (chapters.length && !chapters.some((c) => c.id === form.chapterId)) {
      setForm((f) => ({ ...f, chapterId: chapters[0].id, conceptId: '' }));
    }
  }, [chapters, form.chapterId]);

  const reload = useCallback(async () => {
    setListLoading(true);
    try {
      setLessons(await fetchAllLessonsForAdmin());
    } finally {
      setListLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const submit = async (asDraft = false) => {
    if (!form.title.trim()) {
      setMessage({ type: 'error', text: 'Title required' });
      return;
    }
    if (!form.htmlContent.trim()) {
      setMessage({ type: 'error', text: 'Upload HTML or paste lesson content' });
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const isAdmin = panelRole === 'ADMIN';
      await createLesson({
        ...form,
        grade: tree.grade,
        authorName,
        authorRole: isAdmin ? 'ADMIN' : 'TEACHER',
        publishNow: isAdmin ? form.publishNow && !asDraft : false,
      });
      setMessage({
        type: 'ok',
        text: isAdmin && form.publishNow
          ? 'Published to Learn Hub (approved).'
          : 'Submitted — waiting for admin verification.',
      });
      await reload();
    } catch (e) {
      setMessage({ type: 'error', text: String(e.message || e) });
    } finally {
      setLoading(false);
    }
  };

  const pending = lessons.filter((l) => l.status === 'PENDING_REVIEW');
  const previewLesson = {
    title: form.title || 'Preview',
    title_ta: form.titleTa,
    html_content: form.htmlContent,
    css_content: form.cssContent,
    author_name: authorName,
  };

  const learnPreviewUrl = `/learn/${form.subjectId}/${form.chapterId}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between gap-4 items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Learn Hub — Tutorial CMS</h2>
          <p className="text-gray-500 text-sm mt-1">
            Upload HTML/CSS · Choose subject & unit · Students see approved lessons on Learn Hub
          </p>
        </div>
        <Link
          to={learnPreviewUrl}
          className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-700 bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100 hover:bg-indigo-100"
        >
          <ExternalLink className="w-4 h-4" /> Preview on Learn Hub
        </Link>
      </div>

      <LearnFileUploadZone
        disabled={loading}
        onHtmlChange={(htmlContent) => setForm((f) => ({ ...f, htmlContent }))}
        onCssChange={(cssContent) => setForm((f) => ({ ...f, cssContent }))}
      />

      <div className="flex flex-wrap gap-3 items-center p-4 bg-white rounded-2xl border border-gray-100">
        <span className="text-xs font-bold text-gray-500 uppercase">You are</span>
        {isTeacherAccount ? (
          <span className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-indigo-600 text-white">
            <User className="w-4 h-4" /> Teacher (submissions need admin approval)
          </span>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setPanelRole('ADMIN')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold ${
                panelRole === 'ADMIN' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              <Shield className="w-4 h-4" /> Admin
            </button>
            <button
              type="button"
              onClick={() => { setPanelRole('TEACHER'); setForm((f) => ({ ...f, publishNow: false })); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold ${
                panelRole === 'TEACHER' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              <User className="w-4 h-4" /> Preview as teacher
            </button>
          </>
        )}
        <div className="ml-auto flex items-center gap-2">
          <label className="text-xs font-semibold text-gray-500">Display name</label>
          <input
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm w-44"
          />
        </div>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl text-sm font-medium ${
            message.type === 'ok' ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-indigo-600" />
            Placement (subject · unit · slot)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">Grade</label>
              <input
                readOnly
                value={`Grade ${tree.grade} · ${tree.academicYear}`}
                className="w-full mt-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">Subject</label>
              <select
                value={form.subjectId}
                onChange={(e) => setForm({ ...form, subjectId: e.target.value, conceptId: '' })}
                className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2 text-sm"
              >
                {tree.subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.nameTa})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">Unit / chapter</label>
              <select
                value={form.chapterId}
                onChange={(e) => setForm({ ...form, chapterId: e.target.value, conceptId: '' })}
                className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2 text-sm"
              >
                {chapters.map((c) => (
                  <option key={c.id} value={c.id}>
                    Unit {c.unit} — {c.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">Show at</label>
              <select
                value={form.slot}
                onChange={(e) => setForm({ ...form, slot: e.target.value })}
                className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2 text-sm"
              >
                {LESSON_SLOTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {form.slot === 'inline_concept' && concepts.length > 0 && (
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">After concept</label>
              <select
                value={form.conceptId}
                onChange={(e) => setForm({ ...form, conceptId: e.target.value })}
                className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2 text-sm"
              >
                <option value="">— Select concept —</option>
                {concepts.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code || c.id} — {c.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          <p className="text-xs text-indigo-700 bg-indigo-50 p-3 rounded-xl">
            {placementLabel(form.subjectId, form.chapterId, form.slot)}
          </p>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase">Lesson title (English)</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Unit 1 — Ordered pairs (slow notes)"
              className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase">Title (Tamil, optional)</label>
            <input
              value={form.titleTa}
              onChange={(e) => setForm({ ...form, titleTa: e.target.value })}
              className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">HTML (edit after upload)</label>
              <textarea
                value={form.htmlContent}
                onChange={(e) => setForm({ ...form, htmlContent: e.target.value })}
                rows={8}
                className="w-full mt-1 font-mono text-xs border border-gray-200 rounded-xl px-3 py-2"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">CSS (optional)</label>
              <textarea
                value={form.cssContent}
                onChange={(e) => setForm({ ...form, cssContent: e.target.value })}
                rows={5}
                className="w-full mt-1 font-mono text-xs border border-gray-200 rounded-xl px-3 py-2"
              />
            </div>
          </div>

          {panelRole === 'ADMIN' && (
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={form.publishNow}
                onChange={(e) => setForm({ ...form, publishNow: e.target.checked })}
              />
              Publish immediately (skip review queue)
            </label>
          )}

          <div className="flex flex-wrap gap-3 pt-2">
            {panelRole === 'TEACHER' ? (
              <button
                type="button"
                disabled={loading}
                onClick={() => submit(false)}
                className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-indigo-700 disabled:opacity-60"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Clock className="w-4 h-4" />}
                Submit for admin verification
              </button>
            ) : (
              <button
                type="button"
                disabled={loading}
                onClick={() => submit(false)}
                className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-indigo-700 disabled:opacity-60"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <BookOpen className="w-4 h-4" />}
                {form.publishNow ? 'Add & publish to Learn Hub' : 'Save as pending review'}
              </button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Eye className="w-5 h-5 text-indigo-600" /> Live preview
            </h3>
            <CustomHtmlLesson lesson={previewLesson} colors={COLOR} />
          </div>

          {panelRole === 'ADMIN' && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4">
                Pending verification ({pending.length})
              </h3>
              {listLoading ? (
                <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
              ) : pending.length === 0 ? (
                <p className="text-sm text-gray-500">No teacher submissions waiting.</p>
              ) : (
                <ul className="space-y-3">
                  {pending.map((l) => (
                    <li key={l.id} className="p-4 rounded-xl border border-amber-100 bg-amber-50/50">
                      <p className="font-semibold text-gray-900">{l.title}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {placementLabel(l.subject_id, l.chapter_id, l.slot)} · {l.author_name}
                      </p>
                      <div className="flex gap-2 mt-3">
                        <button
                          type="button"
                          onClick={async () => { await approveLesson(l.id); reload(); }}
                          className="flex items-center gap-1 text-xs font-bold bg-emerald-600 text-white px-3 py-1.5 rounded-lg"
                        >
                          <CheckCircle2 className="w-3 h-3" /> Approve
                        </button>
                        <button
                          type="button"
                          onClick={async () => { await rejectLesson(l.id, 'Revise content'); reload(); }}
                          className="flex items-center gap-1 text-xs font-bold bg-rose-600 text-white px-3 py-1.5 rounded-lg"
                        >
                          <XCircle className="w-3 h-3" /> Reject
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-4">All tutorials in CMS</h3>
        {listLoading ? (
          <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500 uppercase border-b">
                  <th className="pb-2 pr-4">Title</th>
                  <th className="pb-2 pr-4">Placement</th>
                  <th className="pb-2 pr-4">Status</th>
                  <th className="pb-2 pr-4">Author</th>
                  <th className="pb-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {lessons.map((l) => (
                  <tr key={l.id} className="border-b border-gray-50">
                    <td className="py-3 pr-4 font-medium">{l.title}</td>
                    <td className="py-3 pr-4 text-xs text-gray-600 max-w-xs">
                      {placementLabel(l.subject_id, l.chapter_id, l.slot)}
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`text-xs font-bold px-2 py-1 rounded-lg ${STATUS_BADGE[l.status] || STATUS_BADGE.DRAFT}`}>
                        {l.status}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-gray-600">{l.author_name}</td>
                    <td className="py-3">
                      {panelRole === 'ADMIN' && l.status === 'PENDING_REVIEW' && (
                        <button
                          type="button"
                          onClick={async () => { await approveLesson(l.id); reload(); }}
                          className="text-xs text-emerald-700 font-bold mr-2"
                        >
                          Approve
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={async () => { await deleteLesson(l.id); reload(); }}
                        className="text-xs text-rose-600 font-bold inline-flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {lessons.length === 0 && (
              <p className="text-sm text-gray-500 py-4">No custom lessons yet. Upload HTML above.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
