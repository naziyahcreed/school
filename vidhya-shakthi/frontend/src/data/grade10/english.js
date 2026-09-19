/** Unit 1 & 2 only — current 10th English textbook */
import { englishUnit1Concepts, englishUnit2Concepts } from './concepts/englishUnit1';

export const englishChapters = [
  {
    id: 'unit-1-his-first-flight',
    unit: 1,
    title: 'Unit 1 — His First Flight · Life · The Tempest',
    titleTa: 'அலகு 1',
    term: 1,
    duration: 'Full unit study',
    concepts: englishUnit1Concepts,
    textbookLessons: [
      'Prose: His First Flight (Liam O\' Flaherty)',
      'Poem*: Life (Henry Van Dyke) — memoriter',
      'Supplementary: The Tempest (William Shakespeare extract)',
      'Grammar & vocabulary in unit',
      'Listening / speaking / writing tasks in textbook',
    ],
    overview:
      'Full Unit 1: separate deep tutorial for Prose, Poem (memoriter), Supplementary, and Grammar — 4 concepts. Do not skip any; exam asks from all three readings + grammar.',
    sections: [
      {
        heading: 'Prose — His First Flight (Summary & Theme)',
        body:
          'A young seagull is afraid to fly while siblings already fly. Parents withhold food to motivate. He almost falls but spreads wings and learns to fly — theme: overcoming fear, self-confidence, parental push at right time. Characters: young seagull, parents, siblings. SSLC: character sketch, theme paragraph, reference to context from passage.',
      },
      {
        heading: 'Poem — Life (Memoriter)',
        body:
          'Henry Van Dyke urges active, earnest living — not counting years but making years count. Tone inspirational. Exam: fill blanks from poem lines, explain stanza, title justification. Practice writing 4–6 lines from memory daily (memoriter requirement marked * in book).',
      },
      {
        heading: 'Supplementary — The Tempest',
        body:
          'Shakespeare: magic, shipwreck, island, Prospero, Miranda, Ariel, Caliban themes. Focus on textbook extract: unfamiliar words, character roles, moral of forgiveness and power. Answer book-back comprehension and vocabulary.',
      },
      {
        heading: 'Unit 1 Grammar (Textbook integrated)',
        body:
          'Complete grammar exercises given at end of Unit 1 in SCERT book — typically tense consistency, sentence transformation, reported speech fragments. Rule: read instruction line in textbook before each grammar block; exam mirrors same pattern.',
      },
      {
        heading: 'Writing & Study Skills',
        body:
          'Paragraph on "Overcoming fear" or "Learning a new skill". Use intro + 2 development paragraphs + conclusion. Include one example from His First Flight. 80–100 words for short answer; 150+ for essay-type unit test.',
      },
    ],
    examples: [
      {
        title: 'Reference to context',
        problem: 'Why did the young seagull not fly with his brothers and sisters?',
        solution: 'He was afraid his wings would not support him; he had not yet tried flying though wings were same size as siblings.',
      },
      {
        title: 'Theme line',
        problem: 'One sentence theme of His First Flight',
        solution: 'Courage and necessity help us overcome fear and achieve independence.',
      },
    ],
    keyPoints: [
      'Memoriter poem Life — write daily once.',
      'Quote line + explain for prose 2-mark questions.',
      'Unit 1 supplementary Tempest: learn character list from book.',
    ],
    quiz: [
      { q: 'His First Flight is about —', options: ['A pilot', 'A young seagull', 'A ship', 'A king'], answer: 1 },
      { q: 'Life poem author —', options: ['Shakespeare', 'Henry Van Dyke', 'Tagore', 'Wordsworth'], answer: 1 },
    ],
  },
  {
    id: 'unit-2-ghost-got-in',
    unit: 2,
    title: 'Unit 2 — The Night the Ghost Got in · The Grumble Family · Zigzag',
    titleTa: 'அலகு 2',
    term: 1,
    duration: 'Full unit study',
    concepts: englishUnit2Concepts,
    textbookLessons: [
      'Prose: The Night the Ghost Got in (James Thurber)',
      'Poem: The Grumble Family',
      'Supplementary: Zigzag (Asha Nehemiah)',
      'Unit 2 grammar & ICT corner',
    ],
    overview:
      'Full Unit 2: Prose + Poem + Zigzag + Grammar — four complete tutorials below, aligned to textbook order.',
    sections: [
      {
        heading: 'Prose — The Night the Ghost Got in',
        body:
          'Narrator hears thumping downstairs at night; family wakes; grandfather thinks burglars/Civil War; police arrive; comic confusion. Humour from exaggeration and miscommunication. Learn narrator tone, grandfather character, and sequence of events for 3-mark questions.',
      },
      {
        heading: 'Poem — The Grumble Family',
        body:
          'Family members constantly complain about everything. Poet satirises negative attitude. Message: gratitude and positive outlook. Literary devices: rhyme, repetition. Practice paraphrase and central idea.',
      },
      {
        heading: 'Supplementary — Zigzag',
        body:
          'Pet bird Zigzag causes trouble in Dr. Krishnan\'s home — funny incidents, responsibility of pets, patience. Character: Zigzag, Dr. Krishnan, children. Moral: pets need care; chaos can teach patience. Book-back: MCQ, short answer on plot.',
      },
      {
        heading: 'Vocabulary & Comprehension',
        body:
          'Maintain unit-wise vocabulary notebook: 10 new words per prose/supplementary with Tamil meaning optional. Comprehension: read question word (who/why/how) before scanning passage.',
      },
      {
        heading: 'Unit 2 Writing',
        body:
          'Informal letter to friend describing a funny incident at home (model from textbook format). Dialogue writing between two family members — practice punctuation for direct speech.',
      },
    ],
    examples: [
      {
        title: 'Humour source',
        problem: 'Why is the prose considered humorous?',
        solution: 'Misunderstanding of sounds as ghost, exaggerated grandfather stories, and police visit without real danger.',
      },
    ],
    keyPoints: [
      'Unit 2 often tested in half-yearly: know plot order.',
      'Contrast Unit 1 courage theme vs Unit 2 humour theme in essays.',
      'Complete ICT corner activities in book for oral practice.',
    ],
    quiz: [
      { q: 'The Night the Ghost Got in genre tone —', options: ['Tragic', 'Humorous', 'Historical only', 'Scientific'], answer: 1 },
      { q: 'Zigzag is a —', options: ['Cat', 'Pet bird', 'Car', 'Robot'], answer: 1 },
    ],
  },
];
