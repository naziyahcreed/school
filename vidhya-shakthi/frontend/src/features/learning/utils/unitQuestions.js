/**
 * Normalize latex-LMS problems into the Learn Hub question shape.
 * Does not mutate source Q&A.
 */
import { mergeQuestionOverride } from './schoolOsStore.js';

export function inferMarks(problem) {
  const blob = `${problem.number || ''} ${problem.title || ''} ${problem.description || ''} ${problem.statementLatex || ''} ${problem.category || ''} ${problem.rubric_mark || ''}`;
  const numbered = blob.match(/(\d+)\s*(?:Marks?|மதிப்பெண்)/i);
  if (numbered) return Number(numbered[1]);
  if (/பலவுள்|MCQ|Objective|Synonym|Antonym/i.test(blob)) return 1;
  if (/இலக்கணம்|grammar|modals/i.test(blob)) return 5;
  if (problem.difficulty === 'Foundational') return 1;
  if (problem.difficulty === 'Intermediate') return 2;
  if (problem.marks) return Number(problem.marks);
  return 5;
}

export function inferFilterKey(marks, blob = '') {
  if (/இலக்கணம்|grammar|modals|keywords/i.test(blob)) return 'grammar';
  if (marks <= 1) return '1';
  if (marks === 2) return '2';
  return '5';
}

function firstOptions(problem) {
  const step = (problem.guidedSteps || []).find((s) => s.options?.length);
  if (!step) return { options: null, correctIndex: null };
  return { options: step.options, correctIndex: step.correctOptionIndex ?? null };
}

export function problemToQuestion(problem, section, index) {
  const marks = inferMarks(problem);
  const blob = `${problem.number || ''} ${problem.title || ''} ${section?.title || ''}`;
  const { options, correctIndex } = firstOptions(problem);
  const keyPoints = (problem.guidedSteps || [])
    .map((s) => s.expectedInsight || s.hint)
    .filter(Boolean)
    .slice(0, 4);
  return {
    id: problem.id || `q-${index + 1}`,
    number: index + 1,
    question: problem.title || problem.number,
    questionLatex: problem.statementLatex || null,
    answer: problem.fullSolutionWalkthrough || problem.answer_text || '',
    answerLatex: problem.finalSolutionLatex || null,
    answerSteps: (problem.guidedSteps || []).map((step) => ({
      prompt: step.prompt,
      latex: step.latexIntermediate,
      hint: step.hint,
    })),
    marks,
    marksLabel: marks === 1 ? '1 Mark' : `${marks} Marks`,
    filterKey: inferFilterKey(marks, blob),
    lesson: section?.sectionNumber || problem.number || null,
    exerciseId: section?.id || null,
    exerciseNumber: section?.sectionNumber || null,
    exerciseTitle: section?.title || null,
    keyPoints,
    options,
    correctIndex,
    isLatex: Boolean(problem.statementLatex || problem.finalSolutionLatex),
  };
}

export function socialToQuestion(item, index) {
  const marks = Number(item.marks) || inferMarks(item);
  const steps = (item.steps || []).map((step, i) => ({
    prompt: step.step || `Step ${i + 1}`,
    latex: null,
    hint: step.content,
  }));
  const answerParts = [item.answer_text, ...steps.map((s) => s.hint)].filter(Boolean);
  return {
    id: item.question_id || `soc-${index + 1}`,
    number: index + 1,
    question: item.question_text,
    questionLatex: null,
    answer: answerParts.join('\n\n'),
    answerLatex: null,
    answerSteps: steps.length ? steps : null,
    marks,
    marksLabel: marks === 1 ? '1 Mark' : `${marks} Marks`,
    filterKey: inferFilterKey(marks, item.category || ''),
    lesson: item.category || null,
    keyPoints: [],
    options: null,
    correctIndex: null,
    isLatex: false,
  };
}

export function getUnitQuestions(subject, chapter) {
  if (!chapter) return [];
  if (Array.isArray(chapter.questions) && chapter.questions.length) {
    return chapter.questions.map((q, index) =>
      mergeQuestionOverride(subject?.id, chapter.id, { ...q, number: q.number || index + 1 }),
    );
  }
  return [];
}

export function getUnitExercises(chapter) {
  if (!chapter?.exercises?.length) return [];
  return chapter.exercises.filter((ex) => (ex.questions || []).length > 0);
}

export function getExerciseQuestions(subject, chapter, exerciseId) {
  const exercise = getUnitExercises(chapter).find((ex) => ex.id === exerciseId);
  if (!exercise) return [];
  return (exercise.questions || []).map((q, index) =>
    mergeQuestionOverride(subject?.id, chapter.id, { ...q, number: q.number || index + 1 }),
  );
}

export function displayExerciseName(exercise) {
  const num = String(exercise?.number || '').trim();
  if (/^\d+\.\d+$/.test(num)) {
    return { code: num, ta: `பயிற்சி ${num}`, en: `Exercise ${num}` };
  }
  if (/அலகு/.test(num) || /அலகு/.test(exercise?.title || '')) {
    return { code: 'UE', ta: num || 'அலகுப் பயிற்சி', en: 'Unit Exercise' };
  }
  return {
    code: num || 'Ex',
    ta: exercise?.title || num || 'பயிற்சி',
    en: exercise?.title || num || 'Exercise',
  };
}

export function usesExerciseFlow(subject, chapter) {
  return subject?.id === 'mathematics' && getUnitExercises(chapter).length > 0;
}

export function getUnitNotes(chapter) {
  if (chapter?.notes) return chapter.notes;
  return {
    keyPoints: chapter?.keyPoints || [],
    overview: chapter?.overview || '',
    overviewTa: chapter?.overviewTa || '',
    textbookLessons: chapter?.textbookLessons || [],
    concepts: chapter?.concepts || [],
    sections: chapter?.sections || [],
  };
}

export const QUICK_FILTERS = [
  { id: 'all', label: 'All' },
  { id: '5', label: '5 Mark Answers' },
  { id: '2', label: '2 Mark Answers' },
  { id: '1', label: '1 Mark important' },
  { id: 'grammar', label: 'Grammar / Keywords' },
];

export function filterQuestions(questions, filterId) {
  if (!filterId || filterId === 'all') return questions;
  return questions.filter((q) => q.filterKey === filterId);
}
