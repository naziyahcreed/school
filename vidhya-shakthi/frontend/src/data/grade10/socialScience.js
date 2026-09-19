/** Unit 1 & 2 — History (Vol 1) as in current SSLC Social book */
import { socialUnit1Concepts, socialUnit2Concepts } from './concepts/socialUnit1';

export const socialScienceChapters = [
  {
    id: 'unit-1-ww1-aftermath',
    unit: 1,
    title: 'Unit 1 — Outbreak of World War I and Its Aftermath',
    titleTa: 'அலகு 1 — முதல் உலகப்போர் & பின்னணி',
    term: 1,
    unitLabel: 'History',
    duration: 'Full unit study',
    concepts: socialUnit1Concepts,
    textbookLessons: [
      'Chapter 1 (History) — full book-back sections I–VI',
      'Causes of WWI: militarism, alliances, imperialism, nationalism',
      'Course of war & entry of USA',
      'Treaty of Versailles',
      'League of Nations — aims & failure',
    ],
    overview:
      'History Unit 1 split into 4 full concepts: causes, war course, Versailles, League — covers entire chapter book-back preparation.',
    sections: [
      {
        heading: 'Causes of World War I',
        body:
          'MAIN causes: Militarism (arms race Germany-Britain), Alliances (Triple Alliance vs Triple Entente), Imperialism (colonial rivalry), Nationalism (Balkans, Slavic pride). Immediate trigger: assassination of Archduke Franz Ferdinand of Austria-Hungary at Sarajevo (1914).',
      },
      {
        heading: 'Nature of the War',
        body:
          'Trench warfare on Western Front; stalemate for years. New weapons: machine guns, poison gas, tanks, aircraft. USA entered 1917; war ended 1918. Central Powers defeated. Huge human and economic cost.',
      },
      {
        heading: 'Treaty of Versailles (1919)',
        body:
          'Peace with Germany. War guilt clause, reparations, loss of territory, military limits on Germany. Humiliation fed later resentment. Other treaties with Austria, Hungary, Turkey, Bulgaria. Redrew Europe map.',
      },
      {
        heading: 'League of Nations',
        body:
          'Founded 1920 to maintain peace, collective security, solve disputes by negotiation. USA did not join. Successes limited; failed to stop aggression (Manchuria, Ethiopia). Weak without armed force. Replaced by UN after WWII.',
      },
    ],
    examples: [
      {
        title: 'Map skill',
        problem: 'Name two alliance groups before WWI',
        solution: 'Triple Alliance (Germany, Austria-Hungary, Italy) and Triple Entente (Britain, France, Russia) — Italy later shifted.',
      },
      {
        title: 'Short answer',
        problem: 'One reason for League failure',
        solution: 'No standing army; major powers unwilling to act; USA absence reduced authority.',
      },
    ],
    keyPoints: [
      'Book-back: match the following (leaders, treaties) — memorise pairs.',
      '6-mark: causes of WWI with 4 points expanded.',
      'Link Versailles harsh terms → rise of extremism in Germany (intro to Unit 2).',
    ],
    quiz: [
      { q: 'WWI began in —', options: ['1912', '1914', '1918', '1939'], answer: 1 },
      { q: 'League of Nations formed after —', options: ['WWII', 'WWI', 'Cold War', 'French Revolution'], answer: 1 },
    ],
  },
  {
    id: 'unit-2-between-wars',
    unit: 2,
    title: 'Unit 2 — The World Between Two World Wars',
    titleTa: 'அலகு 2 — இரண்டு உலகப்போர்களுக்கிடையே',
    term: 1,
    unitLabel: 'History',
    duration: 'Full unit study',
    concepts: socialUnit2Concepts,
    textbookLessons: [
      'Chapter 2 (History) — book-back I–VI',
      'Rise of Fascism in Italy (Mussolini)',
      'Nazism in Germany (Hitler)',
      'Great Depression impact',
      'Decolonization beginnings',
      'Policy of appeasement',
    ],
    overview:
      'History Unit 2 — 5 concepts (Depression, Fascism, Nazism, Appeasement, Decolonization intro). Complete all before unit test.',
    sections: [
      {
        heading: 'Post-WWI Europe',
        body:
          'Economic hardship, unemployment, inflation in Germany (Weimar Republic). Political instability. Fear of communism. People attracted to strong leaders promising order and national pride.',
      },
      {
        heading: 'Fascism — Italy',
        body:
          'Mussolini: nationalist, anti-communist, one-party rule, suppression of opposition, cult of leader. Aims: restore Roman glory, corporate state. Foreign expansion (Ethiopia). Model for authoritarian rule in 1930s.',
      },
      {
        heading: 'Nazism — Germany',
        body:
          'Hitler and NSDAP: racism, anti-Semitism, Lebensraum, rejection of Versailles. Propaganda (Goebbels), SS/ Gestapo terror, Führer principle. Rearmament, Nuremberg laws, Kristallnacht — textbook timeline for exams.',
      },
      {
        heading: 'Great Depression (1929)',
        body:
          'Wall Street crash → global unemployment, bank failures. Germany hit hard → Nazi vote share rose. Depression weakened democracies, strengthened extremism.',
      },
      {
        heading: 'Decolonization & Appeasement',
        body:
          'After WWI, colonies hoped for freedom; process slow until post-1945. Appeasement: Britain/France allowed Hitler’s early annexations (e.g. Sudetenland) to avoid war — failed when Germany invaded Poland 1939.',
      },
    ],
    examples: [
      {
        title: 'Hitler rise',
        problem: 'Two factors that helped Hitler come to power',
        solution: 'Economic crisis & unemployment; anger at Treaty of Versailles; fear of communism; effective propaganda.',
      },
    ],
    keyPoints: [
      'Detail question: trace Hitler’s rise — use textbook subheadings.',
      'Distinguish fascism vs nazism similarities/differences table.',
      'Unit 2 connects directly to Chapter 3 World War II (later unit).',
    ],
    quiz: [
      { q: 'Great Depression started with crash in —', options: ['1929', '1914', '1945', '1905'], answer: 0 },
      { q: 'Leader of Nazi Germany —', options: ['Mussolini', 'Hitler', 'Stalin', 'Churchill'], answer: 1 },
    ],
  },
];
