import type { Letter } from './types';

export const matras: Letter[] = [
  {
    id: 'm-01',
    devanagari: 'ा',
    transliteration: 'aa',
    pronunciationGuide: 'Long "a" sound - extends the vowel',
    type: 'matra',
    phaseId: 5,
    lessonId: 1,
    strokeOrder: [
      { step: 1, description: 'Draw a vertical line to the right of the consonant' }
    ],
    exampleWords: [
      { devanagari: 'काम', transliteration: 'kaam', meaning: 'work' },
      { devanagari: 'नाम', transliteration: 'naam', meaning: 'name' }
    ]
  },
  {
    id: 'm-02',
    devanagari: 'ि',
    transliteration: 'i',
    pronunciationGuide: 'Short "i" sound - placed before consonant',
    type: 'matra',
    phaseId: 5,
    lessonId: 1,
    strokeOrder: [
      { step: 1, description: 'Draw the curved stroke to the left of the consonant' }
    ],
    exampleWords: [
      { devanagari: 'दिन', transliteration: 'din', meaning: 'day' },
      { devanagari: 'किताब', transliteration: 'kitaab', meaning: 'book' }
    ]
  },
  {
    id: 'm-03',
    devanagari: 'ी',
    transliteration: 'ii',
    pronunciationGuide: 'Long "ee" sound',
    type: 'matra',
    phaseId: 5,
    lessonId: 1,
    strokeOrder: [
      { step: 1, description: 'Draw the curved stroke to the right with extended tail' }
    ],
    exampleWords: [
      { devanagari: 'नदी', transliteration: 'nadi', meaning: 'river' },
      { devanagari: 'मीठा', transliteration: 'meetha', meaning: 'sweet' }
    ]
  },
  {
    id: 'm-04',
    devanagari: 'ु',
    transliteration: 'u',
    pronunciationGuide: 'Short "u" sound - placed below',
    type: 'matra',
    phaseId: 5,
    lessonId: 1,
    strokeOrder: [
      { step: 1, description: 'Draw the small curved mark below the consonant' }
    ],
    exampleWords: [
      { devanagari: 'कुत्ता', transliteration: 'kutta', meaning: 'dog' },
      { devanagari: 'गुलाब', transliteration: 'gulaab', meaning: 'rose' }
    ]
  },
  {
    id: 'm-05',
    devanagari: 'ू',
    transliteration: 'uu',
    pronunciationGuide: 'Long "oo" sound - placed below',
    type: 'matra',
    phaseId: 5,
    lessonId: 1,
    strokeOrder: [
      { step: 1, description: 'Draw the extended curved mark below the consonant' }
    ],
    exampleWords: [
      { devanagari: 'फूल', transliteration: 'phool', meaning: 'flower' },
      { devanagari: 'दूध', transliteration: 'doodh', meaning: 'milk' }
    ]
  },
  {
    id: 'm-06',
    devanagari: 'े',
    transliteration: 'e',
    pronunciationGuide: 'Long "e" sound - placed above',
    type: 'matra',
    phaseId: 5,
    lessonId: 2,
    strokeOrder: [
      { step: 1, description: 'Draw the slanted mark above the headline' }
    ],
    exampleWords: [
      { devanagari: 'पेड़', transliteration: 'ped', meaning: 'tree' },
      { devanagari: 'देश', transliteration: 'desh', meaning: 'country' }
    ]
  },
  {
    id: 'm-07',
    devanagari: 'ै',
    transliteration: 'ai',
    pronunciationGuide: '"Ai" diphthong sound - placed above',
    type: 'matra',
    phaseId: 5,
    lessonId: 2,
    strokeOrder: [
      { step: 1, description: 'Draw two slanted marks above the headline' }
    ],
    exampleWords: [
      { devanagari: 'पैसा', transliteration: 'paisa', meaning: 'money' },
      { devanagari: 'मैं', transliteration: 'main', meaning: 'I' }
    ]
  },
  {
    id: 'm-08',
    devanagari: 'ो',
    transliteration: 'o',
    pronunciationGuide: 'Long "o" sound - combines above and right',
    type: 'matra',
    phaseId: 5,
    lessonId: 2,
    strokeOrder: [
      { step: 1, description: 'Draw े above and ा to the right' }
    ],
    exampleWords: [
      { devanagari: 'बोल', transliteration: 'bol', meaning: 'speak' },
      { devanagari: 'रोटी', transliteration: 'roti', meaning: 'bread' }
    ]
  },
  {
    id: 'm-09',
    devanagari: 'ौ',
    transliteration: 'au',
    pronunciationGuide: '"Au" diphthong - combines above and right',
    type: 'matra',
    phaseId: 5,
    lessonId: 2,
    strokeOrder: [
      { step: 1, description: 'Draw ै above and ा to the right' }
    ],
    exampleWords: [
      { devanagari: 'मौसम', transliteration: 'mausam', meaning: 'weather' },
      { devanagari: 'कौन', transliteration: 'kaun', meaning: 'who' }
    ]
  },
  {
    id: 'm-10',
    devanagari: 'ृ',
    transliteration: 'ri',
    pronunciationGuide: 'Short "ri" sound - placed below',
    type: 'matra',
    phaseId: 5,
    lessonId: 3,
    strokeOrder: [
      { step: 1, description: 'Draw the curved hook below the consonant' }
    ],
    exampleWords: [
      { devanagari: 'कृपा', transliteration: 'kripa', meaning: 'grace/kindness' },
      { devanagari: 'मृत', transliteration: 'mrit', meaning: 'dead' }
    ]
  },
  {
    id: 'm-11',
    devanagari: 'ं',
    transliteration: 'n',
    pronunciationGuide: 'Nasal sound (anusvara) - dot above',
    type: 'matra',
    phaseId: 5,
    lessonId: 3,
    strokeOrder: [
      { step: 1, description: 'Draw a dot above the headline' }
    ],
    exampleWords: [
      { devanagari: 'हिंदी', transliteration: 'hindi', meaning: 'Hindi language' },
      { devanagari: 'मंदिर', transliteration: 'mandir', meaning: 'temple' }
    ]
  },
  {
    id: 'm-12',
    devanagari: 'ः',
    transliteration: 'h',
    pronunciationGuide: 'Breath sound (visarga) - two dots',
    type: 'matra',
    phaseId: 5,
    lessonId: 3,
    strokeOrder: [
      { step: 1, description: 'Draw two vertical dots after the consonant' }
    ],
    exampleWords: [
      { devanagari: 'दुःख', transliteration: 'dukh', meaning: 'sorrow' },
      { devanagari: 'अतः', transliteration: 'atah', meaning: 'therefore' }
    ]
  },
  {
    id: 'm-13',
    devanagari: 'ँ',
    transliteration: 'n',
    pronunciationGuide: 'Nasalization (chandrabindu) - crescent with dot',
    type: 'matra',
    phaseId: 5,
    lessonId: 3,
    strokeOrder: [
      { step: 1, description: 'Draw a crescent moon with dot above the headline' }
    ],
    exampleWords: [
      { devanagari: 'माँ', transliteration: 'maan', meaning: 'mother' },
      { devanagari: 'आँख', transliteration: 'aankh', meaning: 'eye' }
    ]
  },
  {
    id: 'm-14',
    devanagari: '्',
    transliteration: '',
    pronunciationGuide: 'Halant - removes inherent vowel',
    type: 'matra',
    phaseId: 5,
    lessonId: 3,
    strokeOrder: [
      { step: 1, description: 'Draw a small diagonal stroke below the consonant' }
    ],
    exampleWords: [
      { devanagari: 'नम्र', transliteration: 'namra', meaning: 'humble' },
      { devanagari: 'धर्म', transliteration: 'dharma', meaning: 'religion/duty' }
    ]
  }
];
