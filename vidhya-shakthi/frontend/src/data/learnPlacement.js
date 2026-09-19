import { GRADE10_SUBJECTS, GRADE10_LEARN_META } from '../features/learning/catalog/grade10Catalog.js';

/** Where approved HTML lessons appear on SSLC Learn Hub */
export const LESSON_SLOTS = [
  { id: 'top_of_unit', label: 'Unit top (below overview)', labelTa: 'அலகு தலைப்புக்கு கீழ்' },
  { id: 'before_concepts', label: 'Before concept cards', labelTa: 'Concept cards-க்கு முன்' },
  { id: 'after_concepts', label: 'After all concepts', labelTa: 'எல்லா concepts-க்கும் பிறகு' },
  { id: 'append_unit', label: 'End of unit (before quiz)', labelTa: 'Unit முடிவில் (quiz-க்கு முன்)' },
  { id: 'inline_concept', label: 'Inside unit (as extra concept block)', labelTa: 'Extra concept block ஆக' },
];

export function buildPlacementTree() {
  return {
    grade: GRADE10_LEARN_META.grade,
    academicYear: GRADE10_LEARN_META.academicYear,
    subjects: GRADE10_SUBJECTS.map((s) => ({
      id: s.id,
      name: s.name,
      nameTa: s.nameTa,
      chapters: s.chapters.map((c) => ({
        id: c.id,
        unit: c.unit,
        title: c.title,
        titleTa: c.titleTa,
        conceptIds: (c.concepts || []).map((x) => ({
          id: x.id,
          code: x.code,
          title: x.title,
        })),
      })),
    })),
  };
}

export function placementLabel(subjectId, chapterId, slot) {
  const tree = buildPlacementTree();
  const sub = tree.subjects.find((s) => s.id === subjectId);
  const ch = sub?.chapters.find((c) => c.id === chapterId);
  const slotObj = LESSON_SLOTS.find((s) => s.id === slot);
  if (!sub || !ch) return 'Unknown placement';
  return `${sub.name} · Unit ${ch.unit ?? '—'} · ${slotObj?.label ?? slot}`;
}
