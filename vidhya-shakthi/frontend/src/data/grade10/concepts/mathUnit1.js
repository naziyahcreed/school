/** Samacheer 10th Maths — Unit 1 every textbook section as full tutorial */
export const mathUnit1Concepts = [
  {
    id: 'math-u1-c11',
    code: '1.1',
    title: 'Introduction — Relations & Functions',
    titleTa: 'அறிமுகம்',
    simple: 'Think of a function like a school attendance register: each roll number (input) has exactly one name row (output). Relations are broader — they can link one input to many outputs.',
    steps: [
      'Know that maths here connects two sets (like Set A = students, Set B = houses).',
      'A relation is any valid pairing list between A and B.',
      'A function is a special relation: no student appears twice with different outputs.',
      'You will use this idea until Unit 8 — so build clarity now, not speed.',
    ],
    explanation:
      'The unit opens by moving from arithmetic to structure: how elements from one set link to another. In SSLC, this unit appears in Exercise 1.1 (basic pairs) through 1.6 (graphs). Board questions mix definitions, finding domain/range, identifying function type, and choosing graphs. Slow learners should master ordered pairs first — everything else is built on that.',
    check: 'Can you explain in one sentence how a function is stricter than a relation?',
  },
  {
    id: 'math-u1-c12',
    code: '1.2',
    title: 'Ordered Pair',
    titleTa: 'வரிசைப்படுத்தப்பட்ட ஜோடி',
    simple: '(3, 5) is not the same as (5, 3). First number is x (or first set), second is y (or second set). Order is fixed.',
    steps: [
      'Write pair in brackets with comma: (first, second).',
      'Compare pairs: equal only if BOTH components equal in same order.',
      'If question asks number of ordered pairs from {a,b} × {1,2}, list them all: (a,1),(a,2),(b,1),(b,2).',
      'Count = multiply sizes of sets.',
    ],
    explanation:
      'Ordered pairs are the atoms of relations. Textbook Exercise 1.1 often asks listing pairs or counting without listing. Rule: |A × B| = |A| × |B|. Special case: A × ∅ = ∅ (no pairs possible).',
    example: {
      problem: 'A = {1, 2}, B = {m, n}. List A × B.',
      think: 'Each of 2 elements pairs with each of 2 → 4 pairs.',
      solution: '(1,m), (1,n), (2,m), (2,n)',
    },
    commonMistakes: [
      'Writing {3,5} when question asks ordered pair — use (3,5).',
      'Treating (2,3) and (3,2) as same — they are different.',
    ],
    check: 'How many ordered pairs if |A|=5, |B|=4?',
  },
  {
    id: 'math-u1-c13',
    code: '1.3',
    title: 'Cartesian Product',
    titleTa: 'கார்டீசியன் 곱 (Cartesian Product)',
    simple: 'Cartesian product A × B means “all possible ordered pairs taking first from A and second from B”.',
    steps: [
      'Identify set A (first components) and set B (second components).',
      'Multiply counts: total pairs = |A| × |B|.',
      'If asked to list, use systematic order (fix first element, run through second set).',
      'For A × A, include pairs like (1,2) and (2,1) — both allowed.',
    ],
    explanation:
      'Exercise 1.2 focuses on product with finite sets and sometimes inequality constraints (e.g. x < y). Filter pairs after listing or while listing. R × R represents entire coordinate plane — used in graph section later.',
    formula: 'A × B = {(a,b) | a ∈ A, b ∈ B} ,  |A × B| = |A| · |B|',
    example: {
      problem: '|A|=3, |B|=2. |A × B|?',
      solution: '3 × 2 = 6',
    },
    commonMistakes: ['Adding 3+2=5 instead of multiplying.', 'Forgetting A×B and B×A are usually different.'],
    check: 'Is (2,5) in {1,2} × {3,4,5}?',
  },
  {
    id: 'math-u1-c14',
    code: '1.4',
    title: 'Relations',
    titleTa: 'உறவுகள்',
    simple: 'Pick any subset of the full pairing list — that subset is a relation. Not every input needs an output.',
    steps: [
      'Find A × B (all possible pairs).',
      'Relation R = some of those pairs (given or defined by rule).',
      'Domain of R = all first components appearing in R.',
      'Range of R = all second components appearing in R.',
    ],
    explanation:
      'Example rule: R = {(x,y) | x + y = 5} on A={1,2,3,4}, B={1,2,3,4} → list pairs satisfying sum. Relation can be shown as set, table, arrow diagram, or graph. Exercise 1.3 trains domain/range from diagrams — trace arrows from left to right.',
    example: {
      problem: 'R = {(1,4), (2,5), (2,6)}. Find domain and range.',
      solution: 'Domain = {1, 2}\nRange = {4, 5, 6}',
    },
    commonMistakes: [
      'Domain = whole set A always — WRONG; only used first elements count.',
      'Missing duplicate first element 2 appears once in domain.',
    ],
    check: 'Can one element in domain map to two different range values in a relation?',
  },
  {
    id: 'math-u1-c15',
    code: '1.5',
    title: 'Functions',
    titleTa: 'சார்புகள்',
    simple: 'Function rule: every input from domain must have exactly ONE output. No “roll number with two names”.',
    steps: [
      'Check relation: for each first component, count how many pairs share it.',
      'If any first component has 2+ different second components → NOT a function.',
      'If every first component has exactly 1 second → IS a function.',
      'Write f: A → B and f(a) = b when (a,b) belongs to function.',
    ],
    explanation:
      'Vertical line test (for graphs): any vertical line cuts graph at most once. Function notation f(x) = 2x + 1 means input x, output 2x+1. Codomain is target set B; range is actual outputs hit.',
    example: {
      problem: 'Is R={(1,2),(1,3),(4,5)} a function?',
      solution: 'No — input 1 has two outputs 2 and 3.',
    },
    commonMistakes: ['Confusing codomain with range.', 'Saying relation with one pair is not function — single pair is fine if unique.'],
    check: 'Why is every function a relation but not every relation a function?',
  },
  {
    id: 'math-u1-c16',
    code: '1.6',
    title: 'Representation of Functions',
    titleTa: 'சார்பின் பிரதிநிதித்துவம்',
    simple: 'Same function can be shown four ways: formula, table, arrow diagram, graph. Learn to switch between them.',
    steps: [
      'Formula: y = f(x) — substitute x values.',
      'Table: columns x | f(x) for chosen x.',
      'Arrow diagram: arrows from domain to codomain.',
      'Graph: plot points (x, f(x)) on coordinate plane.',
    ],
    explanation:
      'Textbook Exercise 1.4 gives one representation and asks another. Practice: f(x)=x+2 for x∈{0,1,2} → table → plot points (0,2),(1,3),(2,4). Discrete domain = isolated points; continuous domain = line/curve.',
    example: {
      problem: 'f(x)=3x, x=0,1,2. Write table.',
      solution: 'x: 0,1,2\nf(x): 0,3,6',
    },
    commonMistakes: ['Plotting (y,x) instead of (x,y).', 'Joining dots when domain is not continuous interval without instruction.'],
    check: 'Draw arrow diagram for f={(1,a),(2,b)}.',
  },
  {
    id: 'math-u1-c17',
    code: '1.7',
    title: 'Types of Functions',
    titleTa: 'சார்பு வகைகள்',
    simple: 'One-one: different inputs → different outputs. Onto: every codomain element gets hit. Bijection: both.',
    steps: [
      'One-one test: if f(a)=f(b) then must imply a=b (or compare all outputs for duplicates).',
      'Onto test: every element in codomain B appears as f(a) for some a.',
      'Into: function inside B but may miss some elements.',
      'Many-one: two inputs same output — fails one-one.',
    ],
    explanation:
      'Exercise 1.5 classification. Bijection has inverse function f⁻¹. Constant function is many-one (unless domain one element). Identity f(x)=x is bijection on R→R.',
    example: {
      problem: 'f: N→N, f(n)=2n. One-one?',
      solution: 'Yes — if 2a=2b then a=b. Not onto N if odd numbers not in range.',
    },
    commonMistakes: ['Calling onto same as into.', 'Checking one-one by graph only without understanding definition.'],
    check: 'Is f(x)=x² one-one on all real numbers?',
  },
  {
    id: 'math-u1-c18',
    code: '1.8',
    title: 'Special Cases of Functions',
    titleTa: 'சிறப்பு சார்புகள்',
    simple: 'Constant, identity, modulus, greatest integer — each has fixed pattern; recognise from formula or graph.',
    steps: [
      'Constant f(x)=c → horizontal line, many-one, into unless c hits all.',
      'Identity f(x)=x → diagonal line through origin.',
      'Modulus f(x)=|x| → V-shape at origin.',
      'Greatest integer f(x)=[x] → step graph (jump at integers).',
    ],
    explanation:
      'Textbook lists special cases with graphs. For [x], domain R, value is largest integer ≤ x. Example [2.7]=2, [-1.2]=-2. Piecewise functions defined differently on different intervals — evaluate by checking which interval x falls in.',
    example: {
      problem: 'f(x)=[x], find f(3.4) and f(-0.5).',
      solution: 'f(3.4)=3, f(-0.5)=-1',
    },
    commonMistakes: ['Rounding [x] to nearest instead of floor.', 'Wrong branch in piecewise at boundary point — read textbook rule for ≤ or <.'],
    check: 'Sketch y=[x] between x=0 and x=3 mentally — how many steps?',
  },
  {
    id: 'math-u1-c19',
    code: '1.9',
    title: 'Composition of Functions',
    titleTa: 'சார்புகளின் கலவை',
    simple: '(g ∘ f)(x) means: first do f on x, then do g on that result. Order matters like dressing: socks then shoes, not reverse.',
    steps: [
      'Write f(x) and g(x).',
      'Compute f(x) first → get intermediate value.',
      'Substitute that into g → (g∘f)(x)=g(f(x)).',
      'For number: plug given x into f, then g.',
    ],
    explanation:
      'Domain of g∘f: all x in domain of f such that f(x) is in domain of g. Exercise 1.6 compositions with linear functions common in exams.',
    formula: '(g ∘ f)(x) = g(f(x))',
    example: {
      problem: 'f(x)=x², g(x)=x+1. Find (g∘f)(2) and (f∘g)(2).',
      think: 'g∘f: g(f(2))=g(4)=5. f∘g: f(g(2))=f(3)=9.',
      solution: '(g∘f)(2)=5\n(f∘g)(2)=9',
    },
    commonMistakes: ['Writing (g∘f) as g(x)·f(x) — wrong operation.', 'Same order for both compositions — f∘g and g∘f usually differ.'],
    check: 'If f(x)=2x, g(x)=x-3, what is (g∘f)(5)?',
  },
  {
    id: 'math-u1-c110',
    code: '1.10',
    title: 'Graphs — Linear, Quadratic, Cubic, Reciprocal',
    titleTa: 'வரைபடங்கள்',
    simple: 'Shape memory: line, U parabola, S cubic, two curves for hyperbola y=k/x.',
    steps: [
      'Linear y=mx+c: straight line, slope m, y-intercept c.',
      'Quadratic y=ax²+bx+c: parabola; if a>0 opens up, a<0 opens down.',
      'Cubic: one inflection, S-like; reciprocal y=k/x: never crosses axes, two branches.',
      'Match equation to graph in MCQ by key points (0,c), vertex, asymptotes.',
    ],
    explanation:
      'Unit Exercise 1 often includes graph identification without plotting — know coefficient signs. Reciprocal asymptotes: x=0, y=0. Quadratic vertex at x=-b/(2a). Practice textbook tables of graphs.',
    example: {
      problem: 'Which graph is y=-x²+2?',
      think: 'a negative → opens downward, vertex on y-axis at (0,2).',
      solution: 'Downward parabola with maximum at (0,2)',
    },
    commonMistakes: ['Confusing cubic and quadratic shape.', 'Thinking y=1/x touches axes — it approaches but never reaches.'],
    check: 'Sign of m in y=mx+3 if line rises left to right?',
  },
];
