export const unit1Perfect = {
  id: 'tm_unit_1_perfect',
  chapterNumber: 1,
  romanNumeral: 'I',
  title: 'உறவுகளும் சார்புகளும்',
  subtitle: 'பயிற்சி 1.1 (சரியான வடிவம்)',
  synopsis: 'PDF-லிருந்து அச்சுஅசலாக மாற்றப்பட்ட சரியான கணக்குகள்.',
  sections: [
    {
      id: 'ex_1_1',
      sectionNumber: '1.1',
      title: 'பயிற்சி 1.1',
      introText: 'வரிசைச் சோடி மற்றும் கார்டீசியன் பெருக்கல்',
      problems: [
        {
          id: 'prob_1_1_1_i',
          number: '1(i)',
          title: 'A × B, A × A மற்றும் B × A காண்க.',
          difficulty: 'Easy',
          statementLatex: '$$A = \\{ 2, -2, 3 \\}$$\n\n$$B = \\{ 1, -4 \\}$$',
          description: 'கார்டீசியன் பெருக்கல்',
          guidedSteps: [
            {
              stepIndex: 1,
              prompt: 'A × B காண்க:',
              latexIntermediate: 'A \\times B = \\{ 2, -2, 3 \\} \\times \\{ 1, -4 \\}\n\nA \\times B = \\{ (2, 1), (2, -4), (-2, 1), (-2, -4), (3, 1), (3, -4) \\}'
            },
            {
              stepIndex: 2,
              prompt: 'A × A காண்க:',
              latexIntermediate: 'A \\times A = \\{ 2, -2, 3 \\} \\times \\{ 2, -2, 3 \\}\n\nA \\times A = \\{ (2, 2), (2, -2), (2, 3), (-2, 2), (-2, -2), (-2, 3), (3, 2), (3, -2), (3, 3) \\}'
            },
            {
              stepIndex: 3,
              prompt: 'B × A காண்க:',
              latexIntermediate: 'B \\times A = \\{ 1, -4 \\} \\times \\{ 2, -2, 3 \\}\n\nB \\times A = \\{ (1, 2), (1, -2), (1, 3), (-4, 2), (-4, -2), (-4, 3) \\}'
            }
          ],
          fullSolutionWalkthrough: 'கார்டீசியன் பெருக்கல் முறைப்படி A மற்றும் B கணங்களின் உறுப்புகளை ஜோடி சேர்க்க வேண்டும்.'
        },
        {
          id: 'prob_1_1_1_ii',
          number: '1(ii)',
          title: 'A × B, A × A மற்றும் B × A காண்க.',
          difficulty: 'Easy',
          statementLatex: '$$A = B = \\{ p, q \\}$$',
          description: '',
          guidedSteps: [
            {
              stepIndex: 1,
              prompt: 'A × B காண்க:',
              latexIntermediate: 'A \\times B = \\{ p, q \\} \\times \\{ p, q \\}\n\nA \\times B = \\{ (p, p), (p, q), (q, p), (q, q) \\}'
            },
            {
              stepIndex: 2,
              prompt: 'A × A காண்க:',
              latexIntermediate: 'A \\times A = \\{ p, q \\} \\times \\{ p, q \\}\n\nA \\times A = \\{ (p, p), (p, q), (q, p), (q, q) \\}'
            },
            {
              stepIndex: 3,
              prompt: 'B × A காண்க:',
              latexIntermediate: 'B \\times A = \\{ p, q \\} \\times \\{ p, q \\}\n\nB \\times A = \\{ (p, p), (p, q), (q, p), (q, q) \\}'
            }
          ],
          fullSolutionWalkthrough: 'A மற்றும் B ஆகிய இரு கணங்களும் சமம் என்பதால் விடை ஒன்றே.'
        },
        {
          id: 'prob_1_1_1_iii',
          number: '1(iii)',
          title: 'A × B, A × A மற்றும் B × A காண்க.',
          difficulty: 'Easy',
          statementLatex: '$$A = \\{ m, n \\}$$\n\n$$B = \\emptyset$$ (வெற்றுக்கணம்)',
          description: '',
          guidedSteps: [
            {
              stepIndex: 1,
              prompt: 'A × B காண்க:',
              latexIntermediate: 'A \\times B = \\{ m, n \\} \\times \\{ \\}\n\nA \\times B = \\{ \\} \\text{ (அல்லது } \\emptyset \\text{)}'
            },
            {
              stepIndex: 2,
              prompt: 'A × A காண்க:',
              latexIntermediate: 'A \\times A = \\{ m, n \\} \\times \\{ m, n \\}\n\nA \\times A = \\{ (m, m), (m, n), (n, m), (n, n) \\}'
            },
            {
              stepIndex: 3,
              prompt: 'B × A காண்க:',
              latexIntermediate: 'B \\times A = \\{ \\} \\times \\{ m, n \\}\n\nB \\times A = \\{ \\} \\text{ (அல்லது } \\emptyset \\text{)}'
            }
          ],
          fullSolutionWalkthrough: 'வெற்றுக்கணத்துடன் பெருக்கப்படும் கார்டீசியன் பெருக்கல் வெற்றுக்கணமாகவே அமையும்.'
        }
      ]
    }
  ]
};
