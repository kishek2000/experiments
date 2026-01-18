import type { Letter } from './types';

export const vowels: Letter[] = [
  {
    id: 'v-01',
    devanagari: 'अ',
    transliteration: 'a',
    pronunciationGuide: 'Like "u" in "but"',
    type: 'vowel',
    phaseId: 1,
    lessonId: 1,
    matraForm: '',
    strokeOrder: [
      { step: 1, description: 'Draw the vertical line from top to bottom' },
      { step: 2, description: 'Add the curved hook at the top right' },
      { step: 3, description: 'Draw the horizontal headline (shirorekha)' }
    ],
    exampleWords: [
      { devanagari: 'अब', transliteration: 'ab', meaning: 'now' },
      { devanagari: 'अगर', transliteration: 'agar', meaning: 'if' }
    ]
  },
  {
    id: 'v-02',
    devanagari: 'आ',
    transliteration: 'aa',
    pronunciationGuide: 'Like "a" in "father"',
    type: 'vowel',
    phaseId: 1,
    lessonId: 1,
    matraForm: 'ा',
    strokeOrder: [
      { step: 1, description: 'Draw अ first' },
      { step: 2, description: 'Add vertical line to the right' },
      { step: 3, description: 'Extend the headline over both parts' }
    ],
    exampleWords: [
      { devanagari: 'आम', transliteration: 'aam', meaning: 'mango' },
      { devanagari: 'आज', transliteration: 'aaj', meaning: 'today' }
    ]
  },
  {
    id: 'v-03',
    devanagari: 'इ',
    transliteration: 'i',
    pronunciationGuide: 'Like "i" in "bit"',
    type: 'vowel',
    phaseId: 1,
    lessonId: 1,
    matraForm: 'ि',
    strokeOrder: [
      { step: 1, description: 'Draw the curved body from top' },
      { step: 2, description: 'Add the dot on the right' },
      { step: 3, description: 'Draw the headline' }
    ],
    exampleWords: [
      { devanagari: 'इधर', transliteration: 'idhar', meaning: 'here' },
      { devanagari: 'इमली', transliteration: 'imli', meaning: 'tamarind' }
    ]
  },
  {
    id: 'v-04',
    devanagari: 'ई',
    transliteration: 'ii',
    pronunciationGuide: 'Like "ee" in "feet"',
    type: 'vowel',
    phaseId: 1,
    lessonId: 1,
    matraForm: 'ी',
    strokeOrder: [
      { step: 1, description: 'Draw the main curved body' },
      { step: 2, description: 'Add the extended tail at bottom' },
      { step: 3, description: 'Draw the headline' }
    ],
    exampleWords: [
      { devanagari: 'ईख', transliteration: 'iikh', meaning: 'sugarcane' },
      { devanagari: 'ईंट', transliteration: 'iint', meaning: 'brick' }
    ]
  },
  {
    id: 'v-05',
    devanagari: 'उ',
    transliteration: 'u',
    pronunciationGuide: 'Like "u" in "put"',
    type: 'vowel',
    phaseId: 1,
    lessonId: 2,
    matraForm: 'ु',
    strokeOrder: [
      { step: 1, description: 'Draw the curved top portion' },
      { step: 2, description: 'Add the loop at bottom' },
      { step: 3, description: 'Draw the headline' }
    ],
    exampleWords: [
      { devanagari: 'उधर', transliteration: 'udhar', meaning: 'there' },
      { devanagari: 'उम्र', transliteration: 'umra', meaning: 'age' }
    ]
  },
  {
    id: 'v-06',
    devanagari: 'ऊ',
    transliteration: 'uu',
    pronunciationGuide: 'Like "oo" in "food"',
    type: 'vowel',
    phaseId: 1,
    lessonId: 2,
    matraForm: 'ू',
    strokeOrder: [
      { step: 1, description: 'Draw the curved top portion' },
      { step: 2, description: 'Add the extended loop at bottom' },
      { step: 3, description: 'Draw the headline' }
    ],
    exampleWords: [
      { devanagari: 'ऊन', transliteration: 'oon', meaning: 'wool' },
      { devanagari: 'ऊपर', transliteration: 'oopar', meaning: 'above' }
    ]
  },
  {
    id: 'v-07',
    devanagari: 'ए',
    transliteration: 'e',
    pronunciationGuide: 'Like "a" in "bake"',
    type: 'vowel',
    phaseId: 1,
    lessonId: 3,
    matraForm: 'े',
    strokeOrder: [
      { step: 1, description: 'Draw the triangular top' },
      { step: 2, description: 'Add the vertical stem' },
      { step: 3, description: 'Draw the headline' }
    ],
    exampleWords: [
      { devanagari: 'एक', transliteration: 'ek', meaning: 'one' },
      { devanagari: 'एड़ी', transliteration: 'edi', meaning: 'heel' }
    ]
  },
  {
    id: 'v-08',
    devanagari: 'ऐ',
    transliteration: 'ai',
    pronunciationGuide: 'Like "ai" in "fair"',
    type: 'vowel',
    phaseId: 1,
    lessonId: 3,
    matraForm: 'ै',
    strokeOrder: [
      { step: 1, description: 'Draw ए first' },
      { step: 2, description: 'Add the extra stroke above' },
      { step: 3, description: 'Draw the headline' }
    ],
    exampleWords: [
      { devanagari: 'ऐनक', transliteration: 'ainak', meaning: 'spectacles' },
      { devanagari: 'ऐसा', transliteration: 'aisa', meaning: 'like this' }
    ]
  },
  {
    id: 'v-09',
    devanagari: 'ओ',
    transliteration: 'o',
    pronunciationGuide: 'Like "o" in "go"',
    type: 'vowel',
    phaseId: 1,
    lessonId: 3,
    matraForm: 'ो',
    strokeOrder: [
      { step: 1, description: 'Draw अ first' },
      { step: 2, description: 'Add the curved mark above' },
      { step: 3, description: 'Draw the headline' }
    ],
    exampleWords: [
      { devanagari: 'ओस', transliteration: 'os', meaning: 'dew' },
      { devanagari: 'ओर', transliteration: 'or', meaning: 'side/direction' }
    ]
  },
  {
    id: 'v-10',
    devanagari: 'औ',
    transliteration: 'au',
    pronunciationGuide: 'Like "ou" in "out"',
    type: 'vowel',
    phaseId: 1,
    lessonId: 3,
    matraForm: 'ौ',
    strokeOrder: [
      { step: 1, description: 'Draw ओ first' },
      { step: 2, description: 'Add the extra mark above the curved part' },
      { step: 3, description: 'Draw the headline' }
    ],
    exampleWords: [
      { devanagari: 'औरत', transliteration: 'aurat', meaning: 'woman' },
      { devanagari: 'और', transliteration: 'aur', meaning: 'and' }
    ]
  },
  {
    id: 'v-11',
    devanagari: 'ऋ',
    transliteration: 'ri',
    pronunciationGuide: 'Like "ri" in "rift"',
    type: 'vowel',
    phaseId: 1,
    lessonId: 4,
    matraForm: 'ृ',
    strokeOrder: [
      { step: 1, description: 'Draw the curved top' },
      { step: 2, description: 'Add the stem and loop' },
      { step: 3, description: 'Draw the headline' }
    ],
    exampleWords: [
      { devanagari: 'ऋषि', transliteration: 'rishi', meaning: 'sage' },
      { devanagari: 'ऋतु', transliteration: 'ritu', meaning: 'season' }
    ]
  },
  {
    id: 'v-12',
    devanagari: 'अं',
    transliteration: 'an',
    pronunciationGuide: 'Nasal sound, like "un" in "sung"',
    type: 'vowel',
    phaseId: 1,
    lessonId: 4,
    matraForm: 'ं',
    strokeOrder: [
      { step: 1, description: 'Draw अ first' },
      { step: 2, description: 'Add the dot (bindu) above' }
    ],
    exampleWords: [
      { devanagari: 'अंगूर', transliteration: 'angoor', meaning: 'grapes' },
      { devanagari: 'अंदर', transliteration: 'andar', meaning: 'inside' }
    ]
  },
  {
    id: 'v-13',
    devanagari: 'अः',
    transliteration: 'ah',
    pronunciationGuide: 'Breath sound at the end',
    type: 'vowel',
    phaseId: 1,
    lessonId: 4,
    matraForm: 'ः',
    strokeOrder: [
      { step: 1, description: 'Draw अ first' },
      { step: 2, description: 'Add the two dots (visarga) to the right' }
    ],
    exampleWords: [
      { devanagari: 'दुःख', transliteration: 'dukh', meaning: 'sorrow' },
      { devanagari: 'प्रातः', transliteration: 'praatah', meaning: 'morning' }
    ]
  }
];
