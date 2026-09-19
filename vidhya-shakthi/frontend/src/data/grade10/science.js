/** Unit 1 & 2 only — Laws of Motion | Optics */
import { scienceUnit1Concepts, scienceUnit2Concepts } from './concepts/scienceUnit1';

export const scienceChapters = [
  {
    id: 'unit-1-laws-of-motion',
    unit: 1,
    title: 'Unit 1 — Laws of Motion',
    titleTa: 'அலகு 1 — இயக்க விதிகள்',
    term: 1,
    unitLabel: 'Physics',
    duration: 'Full unit study',
    concepts: scienceUnit1Concepts,
    textbookLessons: [
      'Introduction & Aristotle vs Galileo ideas',
      'Linear motion & equations of motion',
      'Newton\'s three laws of motion',
      'Friction & types',
      'Uniform circular motion',
      'Centripetal force',
      'Gravitation & weight',
      'Book back: numericals on F = ma',
    ],
    overview:
      'Complete Unit 1 physics: every major idea from Laws of Motion chapter — 7 concept tutorials below (intro through gravitation). Read in order; do book-back after each block.',
    sections: [
      {
        heading: 'Newton\'s First Law (Inertia)',
        body:
          'A body remains at rest or in uniform straight-line motion unless acted upon by an external unbalanced force. Inertia: resistance to change in state of motion. Examples: passenger lurch when bus stops; dust from carpet when beaten. Seat belts increase safety by opposing inertia.',
      },
      {
        heading: 'Newton\'s Second Law',
        body:
          'Rate of change of momentum equals applied force: F = ma (for constant mass). Unit of force: newton (N). 1 N = 1 kg·m/s². Same force → smaller mass → greater acceleration. Board questions: given any two of F, m, a find the third.',
        formula: 'F = m a ,  p = m v',
      },
      {
        heading: 'Newton\'s Third Law',
        body:
          'For every action there is equal and opposite reaction. Action and reaction act on different bodies — they do not cancel. Examples: walking (foot pushes ground, ground pushes foot); rocket (gas down, rocket up).',
      },
      {
        heading: 'Friction',
        body:
          'Static friction: prevents motion up to a limit. Kinetic friction: opposes sliding motion. Methods to reduce: lubricants, ball bearings, polishing. Advantages: walking, writing; Disadvantages: wear, heat loss.',
      },
      {
        heading: 'Uniform Circular Motion & Centripetal Force',
        body:
          'Speed constant but velocity direction changes → acceleration toward centre (centripetal). F_c = mv²/r directed to centre. String, road friction, gravity can provide centripetal force. Direction of velocity is tangent to circle.',
        formula: 'F = m v² / r',
      },
      {
        heading: 'Gravitation',
        body:
          'Every mass attracts every other mass. Weight W = mg (g ≈ 9.8 m/s²). Mass scalar, weight vector. Free fall: all bodies same acceleration in vacuum. Textbook links gravitation to planetary motion overview.',
        formula: 'W = m g',
      },
    ],
    examples: [
      {
        title: 'Second law',
        problem: 'Mass 5 kg, acceleration 2 m/s². Find force.',
        solution: 'F = ma = 5 × 2 = 10 N',
      },
      {
        title: 'Weight',
        problem: 'Mass 10 kg on Earth (g = 9.8 m/s²). Weight?',
        solution: 'W = mg = 10 × 9.8 = 98 N',
      },
    ],
    keyPoints: [
      'Draw free-body diagrams for force problems.',
      'Action-reaction pairs never act on the same body.',
      'Unit 1 unit test often mixes laws + one numerical.',
    ],
    quiz: [
      { q: 'SI unit of force is —', options: ['Joule', 'Newton', 'Pascal', 'Watt'], answer: 1 },
      { q: 'Inertia is related to —', options: ['Volume', 'Mass', 'Colour', 'Temperature'], answer: 1 },
    ],
  },
  {
    id: 'unit-2-optics',
    unit: 2,
    title: 'Unit 2 — Optics',
    titleTa: 'அலகு 2 — ஒளியியல்',
    term: 1,
    unitLabel: 'Physics',
    duration: 'Full unit study',
    concepts: scienceUnit2Concepts,
    textbookLessons: [
      'Nature of light',
      'Laws of reflection',
      'Plane & spherical mirrors',
      'Mirror formula & magnification',
      'Refraction of light',
      'Refractive index',
      'Snell\'s law',
      'Lens formula & power',
      'Human eye & defects (intro)',
    ],
    overview:
      'Complete Unit 2 Optics — 6 concept cards covering reflection through eye/defects. All formulas with steps; match your SCERT lab diagrams.',
    sections: [
      {
        heading: 'Laws of Reflection',
        body:
          'Incident ray, reflected ray, and normal lie in same plane. Angle of incidence = angle of reflection. Plane mirror: virtual image, same size, laterally inverted, distance object = distance image behind mirror.',
      },
      {
        heading: 'Spherical Mirrors',
        body:
          'Concave: converging, can form real or virtual image. Convex: diverging, always virtual, erect, diminished. Learn ray diagrams for object at infinity, beyond C, at C, between C and F, at F — as in textbook tables.',
      },
      {
        heading: 'Mirror Formula',
        body:
          '1/f = 1/v + 1/u with cartesian sign convention (u negative for real object in front of mirror). Magnification m = −v/u = h\'/h. |m| > 1 enlarged; |m| < 1 diminished.',
        formula: '1/f = 1/v + 1/u ,  m = −v/u',
      },
      {
        heading: 'Refraction & Refractive Index',
        body:
          'Light bends when passing between media. n = c/v (speed in vacuum / speed in medium). n > 1. Denser medium → light bends toward normal on entering.',
        formula: 'n = sin i / sin r ,  n = c/v',
      },
      {
        heading: 'Lens Formula & Power',
        body:
          'Thin lens: 1/f = 1/v − 1/u. Convex lens converges; concave diverges. Power P = 1/f (f in metres), unit dioptre (D). Combination of lenses: P = P₁ + P₂ for thin lenses in contact.',
        formula: '1/f = 1/v − 1/u ,  P = 1/f',
      },
    ],
    examples: [
      {
        title: 'Mirror',
        problem: 'f = −15 cm (concave), u = −30 cm. Find v.',
        solution: '1/(−15) = 1/v + 1/(−30) → 1/v = −1/15 + 1/30 = −1/30 → v = −30 cm (real image)',
      },
      {
        title: 'Refractive index',
        problem: 'Light speed in medium 2×10⁸ m/s. n? (c = 3×10⁸)',
        solution: 'n = c/v = 3/2 = 1.5',
      },
    ],
    keyPoints: [
      'Ray diagrams compulsory for 5-mark questions.',
      'Real image: same side as object for mirror (sign rules).',
      'Power positive for converging lens, negative for diverging.',
    ],
    quiz: [
      { q: 'Plane mirror image is always —', options: ['Real', 'Virtual', 'Inverted', 'Magnified'], answer: 1 },
      { q: 'Unit of lens power —', options: ['Metre', 'Dioptre', 'Candela', 'Lumen'], answer: 1 },
    ],
  },
];
