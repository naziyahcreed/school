import mathematics from '../subjects/mathematics/index.js';
import science from '../subjects/science/index.js';
import english from '../subjects/english/index.js';
import socialScience from '../subjects/social-science/index.js';
import tamil from '../subjects/tamil/index.js';
import { GRADE10_LEARN_META } from './grade10Meta.js';

export const GRADE10_SUBJECTS = [
  { ...mathematics.subjectConfig, chapters: mathematics.chapters },
  { ...science.subjectConfig, chapters: science.chapters },
  { ...english.subjectConfig, chapters: english.chapters },
  { ...socialScience.subjectConfig, chapters: socialScience.chapters },
  { ...tamil.subjectConfig, chapters: tamil.chapters },
];

export function getChapter(subjectId, chapterId) {
  const subject = GRADE10_SUBJECTS.find((s) => s.id === subjectId);
  if (!subject) return null;
  return subject.chapters.find((c) => c.id === chapterId) ?? null;
}

export function getUnit(subjectId, unitNumber) {
  const subject = GRADE10_SUBJECTS.find((s) => s.id === subjectId);
  return subject?.chapters.find((c) => c.unit === unitNumber) ?? null;
}

export { GRADE10_LEARN_META };

export const SUBJECT_MODULES = {
  mathematics,
  science,
  english,
  'social-science': socialScience,
  tamil,
};
