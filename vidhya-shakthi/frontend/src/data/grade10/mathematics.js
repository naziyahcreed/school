/** Unit 1 & 2 only — Relations and Functions | Numbers and Sequences */
import { mathUnit1Concepts } from './concepts/mathUnit1';
import { mathUnit2Concepts } from './concepts/mathUnit2';

export const mathematicsChapters = [
  {
    id: 'unit-1-relations-functions',
    unit: 1,
    title: 'Unit 1 — Relations and Functions',
    titleTa: 'அலகு 1 — உறவுகளும் சார்புகளும்',
    term: 1,
    duration: 'Full unit study (~2 hours)',
    concepts: mathUnit1Concepts,
    textbookLessons: [
      '1.1 Introduction',
      '1.2 Ordered Pair',
      '1.3 Cartesian Product',
      '1.4 Relations',
      '1.5 Functions',
      '1.6 Representation of Functions',
      '1.7 Types of Functions',
      '1.8 Special Cases of Functions',
      '1.9 Composition of Functions',
      '1.10 Graphs of Linear, Quadratic, Cubic & Reciprocal Functions',
    ],
    overview:
      'This page covers ALL 10 sections (1.1–1.10) from your school textbook — not one topic only. Scroll each concept below: simple idea → steps → detail → example → common mistakes. Built for slow learners; complete the whole list before Unit Exercise 1.',
    sections: [
      {
        heading: '1.2 Ordered Pair & 1.3 Cartesian Product',
        body:
          'An ordered pair (a, b) has first element a and second b — order matters: (2, 3) ≠ (3, 2). For sets A and B, A × B = {(a, b) | a ∈ A, b ∈ B}. If |A| = m and |B| = n, then |A × B| = m × n. Example: A = {1, 2}, B = {x, y} → A × B has 4 pairs. Empty set: A × ∅ = ∅.',
      },
      {
        heading: '1.4 Relations',
        body:
          'A relation R from A to B is any subset of A × B. If (a, b) ∈ R we write a R b. Domain = set of first components; Range = set of second components. Example: A = {1,2,3}, B = {4,5}, R = {(1,4), (2,5)} — domain {1,2}, range {4,5}.',
      },
      {
        heading: '1.5 Functions',
        body:
          'A function f: A → B is a relation where every element of A is related to exactly one element of B. A is domain; f(a) is the image of a. Vertical line test on graphs: each x maps to one y.',
      },
      {
        heading: '1.7 Types of Functions',
        body:
          'One-one (injective): different inputs → different outputs. Onto (surjective): every element of codomain is an image. Into: not necessarily onto. Bijection: one-one and onto. Many-one: two inputs same output (allowed in relations, not in strict one-one).',
      },
      {
        heading: '1.9 Composition',
        body:
          'If f: A → B and g: B → C, then g ∘ f: A → C defined by (g ∘ f)(x) = g(f(x)). Order matters: f then g. Find domain where chain is defined.',
        formula: '(g ∘ f)(x) = g(f(x))',
      },
      {
        heading: '1.10 Graph Identification (SSLC focus)',
        body:
          'Linear: y = mx + c → straight line. Quadratic: y = ax² + bx + c → parabola. Cubic: S-shaped curve. Reciprocal: y = k/x → hyperbola branches. Textbook asks you to match equation ↔ graph — plot key points or use shape memory from exercises.',
      },
    ],
    examples: [
      {
        title: 'Cartesian product count',
        problem: '|A| = 3, |B| = 2. Find |A × B|.',
        solution: '3 × 2 = 6 ordered pairs',
      },
      {
        title: 'Composition',
        problem: 'f(x) = 2x, g(x) = x + 1. Find (g ∘ f)(3).',
        solution: 'f(3) = 6 → g(6) = 7',
      },
    ],
    keyPoints: [
      'Unit Exercise 1 combines relations, function type, and graphs — practice all exercise sets.',
      'Composition order: apply f first, then g in (g ∘ f).',
      'Bijection has inverse function.',
    ],
    quiz: [
      { q: 'Number of elements in A × B if |A|=4, |B|=3?', options: ['7', '12', '1', '64'], answer: 1 },
      { q: 'A function must have —', options: ['Two images per input', 'Exactly one image per input', 'No domain', 'Only constants'], answer: 1 },
    ],
  },
  {
    id: 'unit-2-numbers-sequences',
    unit: 2,
    title: 'Unit 2 — Numbers and Sequences',
    titleTa: 'அலகு 2 — எண்களும் தொடர்வரிசைகளும்',
    term: 1,
    duration: 'Full unit study (~2.5 hours)',
    concepts: mathUnit2Concepts,
    textbookLessons: [
      '2.1 Introduction',
      '2.2 Euclid\'s Division Lemma',
      '2.3 Euclid\'s Division Algorithm',
      '2.4 Fundamental Theorem of Arithmetic',
      '2.5 Modular Arithmetic',
      '2.6 Sequences',
      '2.7 Arithmetic Progression',
      '2.8 Series',
      '2.9 Geometric Progression',
      '2.10 Sum of n terms of GP',
      '2.11 Special Series',
    ],
    overview:
      'All 11 sections (2.1–2.11) explained one-by-one below — Euclid, primes, modular arithmetic, AP, GP, special series. Finish every concept card before doing Unit Exercise 2 in your book.',
    sections: [
      {
        heading: '2.2–2.3 Euclid\'s Division Lemma & Algorithm',
        body:
          'Lemma: a = bq + r, 0 ≤ r < b for positive integers. Algorithm finds HCF by repeated division until remainder 0. Last non-zero remainder is HCF. Example: HCF(48, 18): 48 = 18×2 + 12; 18 = 12×1 + 6; 12 = 6×2 + 0 → HCF = 6.',
        formula: 'a = bq + r ,  0 ≤ r < b',
      },
      {
        heading: '2.4 Fundamental Theorem of Arithmetic',
        body:
          'Every composite number = product of primes uniquely (order apart). Use for HCF (minimum powers of common primes) and LCM (maximum powers). HCF × LCM = product of two numbers (for two positive integers).',
      },
      {
        heading: '2.5 Modular Arithmetic',
        body:
          'Clock arithmetic: numbers wrap after modulus n. Congruence a ≡ b (mod n) means n divides (a − b). Used in remainder problems in textbook — e.g. what day of week after k days.',
      },
      {
        heading: '2.7 Arithmetic Progression (AP)',
        body:
          'Sequence with constant difference d. nth term aₙ = a + (n−1)d. Sum Sₙ = n/2 [2a + (n−1)d] = n/2 (a + l). Identify a, d from word problems before applying formula.',
        formula: 'aₙ = a + (n−1)d ,  Sₙ = n/2 [2a + (n−1)d]',
      },
      {
        heading: '2.9–2.10 Geometric Progression (GP)',
        body:
          'Constant ratio r: a, ar, ar², … nth term aₙ = arⁿ⁻¹. Sum of n terms: Sₙ = a(rⁿ − 1)/(r − 1) when r ≠ 1. Infinite GP |r| < 1: sum a/(1−r). Textbook Unit 2 includes both AP and GP mixed problems.',
        formula: 'Sₙ = a(rⁿ − 1)/(r − 1) ,  r ≠ 1',
      },
      {
        heading: '2.11 Special Series',
        body:
          'Sum of first n natural numbers: n(n+1)/2. Sum of squares: n(n+1)(2n+1)/6. Recognise pattern in textbook examples and derive or memorise standard results.',
      },
    ],
    examples: [
      {
        title: 'Euclid HCF',
        problem: 'Find HCF(255, 867).',
        solution: '867 = 255×3 + 102\n255 = 102×2 + 51\n102 = 51×2 + 0\nHCF = 51',
      },
      {
        title: 'AP sum',
        problem: 'First term 5, d = 3. Sum of first 10 terms?',
        solution: 'S₁₀ = 10/2 [10 + 9×3] = 5 × 37 = 185',
      },
    ],
    keyPoints: [
      'Show all steps in Euclid algorithm — SSLC marking.',
      'Distinguish sequence (terms) vs series (sum).',
      'GP ratio r = second term ÷ first term.',
    ],
    quiz: [
      { q: 'HCF × LCM of 12 and 18 equals —', options: ['216', '36', '6', '108'], answer: 0 },
      { q: 'In AP, common difference is —', options: ['Fixed ratio', 'Fixed difference between terms', 'Always 1', 'Last term'], answer: 1 },
    ],
  },
];
