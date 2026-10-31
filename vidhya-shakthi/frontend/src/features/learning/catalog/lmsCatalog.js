/**
 * Learn Hub catalog backed by site-learning-lms-latex Q&A (all units).
 * Source files are not modified.
 */
import { TAMIL_SUBJECT_UNITS } from '@lms/data/tamilSubject/index.ts';
import { ENGLISH_SUBJECT_UNITS } from '@lms/data/englishSubject/index.ts';
import { SCIENCE_SUBJECT_UNITS } from '@lms/data/scienceSubject/index.ts';
import { TAMIL_MEDIUM_UNITS } from '@lms/data/tamilMedium/index.ts';
import socialGuide from '@lms-root/data/json_guides/10th_Social_Science_Sura_Guide.json';
import { problemToQuestion, socialToQuestion } from '../utils/unitQuestions.js';

function fromBookChapters(units) {
  return (units || []).map((chapter) => {
    const exercises = (chapter.sections || []).map((section) => {
      const questions = (section.problems || []).map((problem, index) =>
        problemToQuestion(problem, section, index),
      );
      return {
        id: section.id,
        number: section.sectionNumber,
        title: section.title,
        intro: section.introText || '',
        questions,
      };
    });
    const questions = exercises.flatMap((ex) => ex.questions);
    const notes = {
      keyPoints: (chapter.prerequisites || []).map((p) => `Prerequisite: ${p}`),
      overview: chapter.synopsis || '',
      overviewTa: '',
      textbookLessons: (chapter.sections || []).map((s) => `${s.sectionNumber} ${s.title}`),
      concepts: (chapter.sections || []).flatMap((section) =>
        (section.items || []).map((item) => ({
          id: item.id,
          code: item.number,
          title: item.title,
          simple: item.statementText || '',
          formula: item.statementLatex || null,
        })),
      ),
      sections: chapter.sections || [],
    };
    return {
      id: chapter.id,
      unit: chapter.chapterNumber,
      title: chapter.title,
      titleTa: chapter.title,
      overview: chapter.synopsis,
      notes,
      exercises,
      questions,
      concepts: notes.concepts,
      keyPoints: notes.keyPoints,
      lms: true,
    };
  });
}

function fromSocialGuide(guide) {
  return (guide.chapters || []).map((ch, i) => {
    const questions = (ch.questions || []).map((q, index) => socialToQuestion(q, index));
    return {
      id: ch.unit_id || `social-unit-${i + 1}`,
      unit: i + 1,
      title: ch.title,
      titleTa: ch.title,
      overview: '',
      notes: {
        keyPoints: [],
        overview: '',
        overviewTa: '',
        textbookLessons: [ch.title],
        concepts: [],
        sections: [],
      },
      questions,
      lms: true,
    };
  });
}

export const LMS_SUBJECTS = [
  {
    id: 'tamil',
    name: 'Tamil',
    nameTa: 'தமிழ்',
    color: 'rose',
    chapters: fromBookChapters(TAMIL_SUBJECT_UNITS),
  },
  {
    id: 'english',
    name: 'English',
    nameTa: 'ஆங்கிலம்',
    color: 'blue',
    chapters: fromBookChapters(ENGLISH_SUBJECT_UNITS),
  },
  {
    id: 'mathematics',
    name: 'Mathematics',
    nameTa: 'கணிதம்',
    color: 'indigo',
    chapters: fromBookChapters(TAMIL_MEDIUM_UNITS),
  },
  {
    id: 'science',
    name: 'Science',
    nameTa: 'அறிவியல்',
    color: 'emerald',
    chapters: fromBookChapters(SCIENCE_SUBJECT_UNITS),
  },
  {
    id: 'social-science',
    name: 'Social Science',
    nameTa: 'சமூக அறிவியல்',
    color: 'amber',
    chapters: fromSocialGuide(socialGuide),
  },
];

export function getLearnSubject(subjectId) {
  return LMS_SUBJECTS.find((s) => s.id === subjectId) ?? null;
}

export function getLearnChapter(subjectId, chapterId) {
  const subject = getLearnSubject(subjectId);
  return subject?.chapters.find((c) => c.id === chapterId) ?? null;
}

export function getLearnExercise(subjectId, chapterId, exerciseId) {
  const chapter = getLearnChapter(subjectId, chapterId);
  return chapter?.exercises?.find((ex) => ex.id === exerciseId) ?? null;
}

export function allLearnQuestions() {
  return LMS_SUBJECTS.flatMap((subject) =>
    subject.chapters.flatMap((chapter) =>
      (chapter.questions || []).map((q) => ({
        ...q,
        subjectId: subject.id,
        chapterId: chapter.id,
      })),
    ),
  );
}

export function countLearnQuestions() {
  return LMS_SUBJECTS.reduce(
    (n, s) => n + s.chapters.reduce((m, c) => m + (c.questions?.length || 0), 0),
    0,
  );
}
