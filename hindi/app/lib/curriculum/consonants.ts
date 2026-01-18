import type { Letter } from './types';

export const consonants: Letter[] = [
  // Velars (कवर्ग) - Phase 2, Lesson 1
  {
    id: 'c-01',
    devanagari: 'क',
    transliteration: 'ka',
    pronunciationGuide: 'Like "k" in "kite"',
    type: 'consonant',
    phaseId: 2,
    lessonId: 1,
    strokeOrder: [
      { step: 1, description: 'Draw the vertical line' },
      { step: 2, description: 'Add the curved part on top left' },
      { step: 3, description: 'Draw the headline' }
    ],
    exampleWords: [
      { devanagari: 'कमल', transliteration: 'kamal', meaning: 'lotus' },
      { devanagari: 'कलम', transliteration: 'kalam', meaning: 'pen' }
    ]
  },
  {
    id: 'c-02',
    devanagari: 'ख',
    transliteration: 'kha',
    pronunciationGuide: 'Aspirated "k", like "k" + breath',
    type: 'consonant',
    phaseId: 2,
    lessonId: 1,
    strokeOrder: [
      { step: 1, description: 'Draw the vertical stem' },
      { step: 2, description: 'Add the curved loop on left' },
      { step: 3, description: 'Draw the headline' }
    ],
    exampleWords: [
      { devanagari: 'खरगोश', transliteration: 'khargosh', meaning: 'rabbit' },
      { devanagari: 'खाना', transliteration: 'khaana', meaning: 'food' }
    ]
  },
  {
    id: 'c-03',
    devanagari: 'ग',
    transliteration: 'ga',
    pronunciationGuide: 'Like "g" in "go"',
    type: 'consonant',
    phaseId: 2,
    lessonId: 1,
    strokeOrder: [
      { step: 1, description: 'Draw the curved top' },
      { step: 2, description: 'Add the vertical stem' },
      { step: 3, description: 'Draw the headline' }
    ],
    exampleWords: [
      { devanagari: 'गाय', transliteration: 'gaay', meaning: 'cow' },
      { devanagari: 'गरम', transliteration: 'garam', meaning: 'hot' }
    ]
  },
  {
    id: 'c-04',
    devanagari: 'घ',
    transliteration: 'gha',
    pronunciationGuide: 'Aspirated "g", like "g" + breath',
    type: 'consonant',
    phaseId: 2,
    lessonId: 1,
    strokeOrder: [
      { step: 1, description: 'Draw the main curved body' },
      { step: 2, description: 'Add the loop at bottom' },
      { step: 3, description: 'Draw the headline' }
    ],
    exampleWords: [
      { devanagari: 'घर', transliteration: 'ghar', meaning: 'house' },
      { devanagari: 'घड़ी', transliteration: 'ghadi', meaning: 'clock/watch' }
    ]
  },
  {
    id: 'c-05',
    devanagari: 'ङ',
    transliteration: 'nga',
    pronunciationGuide: 'Like "ng" in "sing"',
    type: 'consonant',
    phaseId: 2,
    lessonId: 1,
    strokeOrder: [
      { step: 1, description: 'Draw the curved body' },
      { step: 2, description: 'Add the dot' },
      { step: 3, description: 'Draw the headline' }
    ],
    exampleWords: [
      { devanagari: 'रंग', transliteration: 'rang', meaning: 'color' },
      { devanagari: 'अंग', transliteration: 'ang', meaning: 'body part' }
    ]
  },

  // Palatals (चवर्ग) - Phase 2, Lesson 2
  {
    id: 'c-06',
    devanagari: 'च',
    transliteration: 'cha',
    pronunciationGuide: 'Like "ch" in "church"',
    type: 'consonant',
    phaseId: 2,
    lessonId: 2,
    strokeOrder: [
      { step: 1, description: 'Draw the curved top loop' },
      { step: 2, description: 'Add the vertical stem' },
      { step: 3, description: 'Draw the headline' }
    ],
    exampleWords: [
      { devanagari: 'चम्मच', transliteration: 'chammach', meaning: 'spoon' },
      { devanagari: 'चाय', transliteration: 'chaay', meaning: 'tea' }
    ]
  },
  {
    id: 'c-07',
    devanagari: 'छ',
    transliteration: 'chha',
    pronunciationGuide: 'Aspirated "ch"',
    type: 'consonant',
    phaseId: 2,
    lessonId: 2,
    strokeOrder: [
      { step: 1, description: 'Draw the main body' },
      { step: 2, description: 'Add the curved extension' },
      { step: 3, description: 'Draw the headline' }
    ],
    exampleWords: [
      { devanagari: 'छाता', transliteration: 'chhaata', meaning: 'umbrella' },
      { devanagari: 'छत', transliteration: 'chhat', meaning: 'roof' }
    ]
  },
  {
    id: 'c-08',
    devanagari: 'ज',
    transliteration: 'ja',
    pronunciationGuide: 'Like "j" in "jump"',
    type: 'consonant',
    phaseId: 2,
    lessonId: 2,
    strokeOrder: [
      { step: 1, description: 'Draw the curved left part' },
      { step: 2, description: 'Add the right portion' },
      { step: 3, description: 'Draw the headline' }
    ],
    exampleWords: [
      { devanagari: 'जल', transliteration: 'jal', meaning: 'water' },
      { devanagari: 'जंगल', transliteration: 'jangal', meaning: 'forest' }
    ]
  },
  {
    id: 'c-09',
    devanagari: 'झ',
    transliteration: 'jha',
    pronunciationGuide: 'Aspirated "j"',
    type: 'consonant',
    phaseId: 2,
    lessonId: 2,
    strokeOrder: [
      { step: 1, description: 'Draw the main body' },
      { step: 2, description: 'Add the extended loop' },
      { step: 3, description: 'Draw the headline' }
    ],
    exampleWords: [
      { devanagari: 'झंडा', transliteration: 'jhanda', meaning: 'flag' },
      { devanagari: 'झील', transliteration: 'jheel', meaning: 'lake' }
    ]
  },
  {
    id: 'c-10',
    devanagari: 'ञ',
    transliteration: 'nya',
    pronunciationGuide: 'Like "ny" in "canyon"',
    type: 'consonant',
    phaseId: 2,
    lessonId: 2,
    strokeOrder: [
      { step: 1, description: 'Draw the top curved portion' },
      { step: 2, description: 'Add the lower body' },
      { step: 3, description: 'Draw the headline' }
    ],
    exampleWords: [
      { devanagari: 'ज्ञान', transliteration: 'gyaan', meaning: 'knowledge' },
      { devanagari: 'यज्ञ', transliteration: 'yagya', meaning: 'ritual' }
    ]
  },

  // Retroflexes (टवर्ग) - Phase 3, Lesson 1
  {
    id: 'c-11',
    devanagari: 'ट',
    transliteration: 'ta',
    pronunciationGuide: 'Retroflex "t" - tongue curls back',
    type: 'consonant',
    phaseId: 3,
    lessonId: 1,
    strokeOrder: [
      { step: 1, description: 'Draw the curved hook' },
      { step: 2, description: 'Add the stem' },
      { step: 3, description: 'Draw the headline' }
    ],
    exampleWords: [
      { devanagari: 'टमाटर', transliteration: 'tamaatar', meaning: 'tomato' },
      { devanagari: 'टोपी', transliteration: 'topi', meaning: 'cap' }
    ]
  },
  {
    id: 'c-12',
    devanagari: 'ठ',
    transliteration: 'tha',
    pronunciationGuide: 'Aspirated retroflex "t"',
    type: 'consonant',
    phaseId: 3,
    lessonId: 1,
    strokeOrder: [
      { step: 1, description: 'Draw the main body' },
      { step: 2, description: 'Add the curved hook' },
      { step: 3, description: 'Draw the headline' }
    ],
    exampleWords: [
      { devanagari: 'ठंडा', transliteration: 'thanda', meaning: 'cold' },
      { devanagari: 'पाठ', transliteration: 'paath', meaning: 'lesson' }
    ]
  },
  {
    id: 'c-13',
    devanagari: 'ड',
    transliteration: 'da',
    pronunciationGuide: 'Retroflex "d" - tongue curls back',
    type: 'consonant',
    phaseId: 3,
    lessonId: 1,
    strokeOrder: [
      { step: 1, description: 'Draw the curved body' },
      { step: 2, description: 'Add the hook' },
      { step: 3, description: 'Draw the headline' }
    ],
    exampleWords: [
      { devanagari: 'डर', transliteration: 'dar', meaning: 'fear' },
      { devanagari: 'डाक', transliteration: 'daak', meaning: 'mail' }
    ]
  },
  {
    id: 'c-14',
    devanagari: 'ढ',
    transliteration: 'dha',
    pronunciationGuide: 'Aspirated retroflex "d"',
    type: 'consonant',
    phaseId: 3,
    lessonId: 1,
    strokeOrder: [
      { step: 1, description: 'Draw the main body' },
      { step: 2, description: 'Add the extended part' },
      { step: 3, description: 'Draw the headline' }
    ],
    exampleWords: [
      { devanagari: 'ढक्कन', transliteration: 'dhakkan', meaning: 'lid' },
      { devanagari: 'ढोल', transliteration: 'dhol', meaning: 'drum' }
    ]
  },
  {
    id: 'c-15',
    devanagari: 'ण',
    transliteration: 'na',
    pronunciationGuide: 'Retroflex "n" - tongue curls back',
    type: 'consonant',
    phaseId: 3,
    lessonId: 1,
    strokeOrder: [
      { step: 1, description: 'Draw the top loop' },
      { step: 2, description: 'Add the lower portion' },
      { step: 3, description: 'Draw the headline' }
    ],
    exampleWords: [
      { devanagari: 'बाण', transliteration: 'baan', meaning: 'arrow' },
      { devanagari: 'गुण', transliteration: 'gun', meaning: 'quality' }
    ]
  },

  // Dentals (तवर्ग) - Phase 3, Lesson 2
  {
    id: 'c-16',
    devanagari: 'त',
    transliteration: 'ta',
    pronunciationGuide: 'Dental "t" - tongue touches teeth',
    type: 'consonant',
    phaseId: 3,
    lessonId: 2,
    strokeOrder: [
      { step: 1, description: 'Draw the curved top' },
      { step: 2, description: 'Add the stem' },
      { step: 3, description: 'Draw the headline' }
    ],
    exampleWords: [
      { devanagari: 'तारा', transliteration: 'taara', meaning: 'star' },
      { devanagari: 'ताला', transliteration: 'taala', meaning: 'lock' }
    ]
  },
  {
    id: 'c-17',
    devanagari: 'थ',
    transliteration: 'tha',
    pronunciationGuide: 'Aspirated dental "t"',
    type: 'consonant',
    phaseId: 3,
    lessonId: 2,
    strokeOrder: [
      { step: 1, description: 'Draw the round body' },
      { step: 2, description: 'Add the stem' },
      { step: 3, description: 'Draw the headline' }
    ],
    exampleWords: [
      { devanagari: 'थाली', transliteration: 'thaali', meaning: 'plate' },
      { devanagari: 'हाथ', transliteration: 'haath', meaning: 'hand' }
    ]
  },
  {
    id: 'c-18',
    devanagari: 'द',
    transliteration: 'da',
    pronunciationGuide: 'Dental "d" - tongue touches teeth',
    type: 'consonant',
    phaseId: 3,
    lessonId: 2,
    strokeOrder: [
      { step: 1, description: 'Draw the curved body' },
      { step: 2, description: 'Add the tail' },
      { step: 3, description: 'Draw the headline' }
    ],
    exampleWords: [
      { devanagari: 'दूध', transliteration: 'doodh', meaning: 'milk' },
      { devanagari: 'दरवाज़ा', transliteration: 'darwaaza', meaning: 'door' }
    ]
  },
  {
    id: 'c-19',
    devanagari: 'ध',
    transliteration: 'dha',
    pronunciationGuide: 'Aspirated dental "d"',
    type: 'consonant',
    phaseId: 3,
    lessonId: 2,
    strokeOrder: [
      { step: 1, description: 'Draw the main curved body' },
      { step: 2, description: 'Add the hook at top' },
      { step: 3, description: 'Draw the headline' }
    ],
    exampleWords: [
      { devanagari: 'धन', transliteration: 'dhan', meaning: 'wealth' },
      { devanagari: 'धूप', transliteration: 'dhoop', meaning: 'sunshine' }
    ]
  },
  {
    id: 'c-20',
    devanagari: 'न',
    transliteration: 'na',
    pronunciationGuide: 'Like "n" in "name"',
    type: 'consonant',
    phaseId: 3,
    lessonId: 2,
    strokeOrder: [
      { step: 1, description: 'Draw the top loop' },
      { step: 2, description: 'Add the stem' },
      { step: 3, description: 'Draw the headline' }
    ],
    exampleWords: [
      { devanagari: 'नमक', transliteration: 'namak', meaning: 'salt' },
      { devanagari: 'नाक', transliteration: 'naak', meaning: 'nose' }
    ]
  },

  // Labials (पवर्ग) - Phase 4, Lesson 1
  {
    id: 'c-21',
    devanagari: 'प',
    transliteration: 'pa',
    pronunciationGuide: 'Like "p" in "pen"',
    type: 'consonant',
    phaseId: 4,
    lessonId: 1,
    strokeOrder: [
      { step: 1, description: 'Draw the vertical stem' },
      { step: 2, description: 'Add the curved loop on left' },
      { step: 3, description: 'Draw the headline' }
    ],
    exampleWords: [
      { devanagari: 'पानी', transliteration: 'paani', meaning: 'water' },
      { devanagari: 'पंखा', transliteration: 'pankha', meaning: 'fan' }
    ]
  },
  {
    id: 'c-22',
    devanagari: 'फ',
    transliteration: 'pha',
    pronunciationGuide: 'Aspirated "p", like "p" + breath',
    type: 'consonant',
    phaseId: 4,
    lessonId: 1,
    strokeOrder: [
      { step: 1, description: 'Draw the main body' },
      { step: 2, description: 'Add the loop' },
      { step: 3, description: 'Draw the headline' }
    ],
    exampleWords: [
      { devanagari: 'फल', transliteration: 'phal', meaning: 'fruit' },
      { devanagari: 'फूल', transliteration: 'phool', meaning: 'flower' }
    ]
  },
  {
    id: 'c-23',
    devanagari: 'ब',
    transliteration: 'ba',
    pronunciationGuide: 'Like "b" in "boy"',
    type: 'consonant',
    phaseId: 4,
    lessonId: 1,
    strokeOrder: [
      { step: 1, description: 'Draw the curved body' },
      { step: 2, description: 'Add the stem' },
      { step: 3, description: 'Draw the headline' }
    ],
    exampleWords: [
      { devanagari: 'बस', transliteration: 'bas', meaning: 'bus' },
      { devanagari: 'बच्चा', transliteration: 'bachcha', meaning: 'child' }
    ]
  },
  {
    id: 'c-24',
    devanagari: 'भ',
    transliteration: 'bha',
    pronunciationGuide: 'Aspirated "b"',
    type: 'consonant',
    phaseId: 4,
    lessonId: 1,
    strokeOrder: [
      { step: 1, description: 'Draw the curved body' },
      { step: 2, description: 'Add the extended part' },
      { step: 3, description: 'Draw the headline' }
    ],
    exampleWords: [
      { devanagari: 'भालू', transliteration: 'bhaaloo', meaning: 'bear' },
      { devanagari: 'भाई', transliteration: 'bhaai', meaning: 'brother' }
    ]
  },
  {
    id: 'c-25',
    devanagari: 'म',
    transliteration: 'ma',
    pronunciationGuide: 'Like "m" in "mother"',
    type: 'consonant',
    phaseId: 4,
    lessonId: 1,
    strokeOrder: [
      { step: 1, description: 'Draw the curved top' },
      { step: 2, description: 'Add the stem' },
      { step: 3, description: 'Draw the headline' }
    ],
    exampleWords: [
      { devanagari: 'माता', transliteration: 'maata', meaning: 'mother' },
      { devanagari: 'मकान', transliteration: 'makaan', meaning: 'house' }
    ]
  },

  // Semi-vowels - Phase 4, Lesson 2
  {
    id: 'c-26',
    devanagari: 'य',
    transliteration: 'ya',
    pronunciationGuide: 'Like "y" in "yes"',
    type: 'consonant',
    phaseId: 4,
    lessonId: 2,
    strokeOrder: [
      { step: 1, description: 'Draw the curved top portion' },
      { step: 2, description: 'Add the stem and loop' },
      { step: 3, description: 'Draw the headline' }
    ],
    exampleWords: [
      { devanagari: 'याद', transliteration: 'yaad', meaning: 'memory' },
      { devanagari: 'यात्रा', transliteration: 'yaatra', meaning: 'journey' }
    ]
  },
  {
    id: 'c-27',
    devanagari: 'र',
    transliteration: 'ra',
    pronunciationGuide: 'Like "r" in "run" (rolled)',
    type: 'consonant',
    phaseId: 4,
    lessonId: 2,
    strokeOrder: [
      { step: 1, description: 'Draw the curved hook' },
      { step: 2, description: 'Draw the headline' }
    ],
    exampleWords: [
      { devanagari: 'राजा', transliteration: 'raaja', meaning: 'king' },
      { devanagari: 'रात', transliteration: 'raat', meaning: 'night' }
    ]
  },
  {
    id: 'c-28',
    devanagari: 'ल',
    transliteration: 'la',
    pronunciationGuide: 'Like "l" in "love"',
    type: 'consonant',
    phaseId: 4,
    lessonId: 2,
    strokeOrder: [
      { step: 1, description: 'Draw the curved body' },
      { step: 2, description: 'Add the stem' },
      { step: 3, description: 'Draw the headline' }
    ],
    exampleWords: [
      { devanagari: 'लाल', transliteration: 'laal', meaning: 'red' },
      { devanagari: 'लड़का', transliteration: 'ladka', meaning: 'boy' }
    ]
  },
  {
    id: 'c-29',
    devanagari: 'व',
    transliteration: 'va',
    pronunciationGuide: 'Like "v" in "very" or "w" in "water"',
    type: 'consonant',
    phaseId: 4,
    lessonId: 2,
    strokeOrder: [
      { step: 1, description: 'Draw the curved body' },
      { step: 2, description: 'Add the small hook' },
      { step: 3, description: 'Draw the headline' }
    ],
    exampleWords: [
      { devanagari: 'वन', transliteration: 'van', meaning: 'forest' },
      { devanagari: 'वर्षा', transliteration: 'varsha', meaning: 'rain' }
    ]
  },

  // Sibilants - Phase 4, Lesson 3
  {
    id: 'c-30',
    devanagari: 'श',
    transliteration: 'sha',
    pronunciationGuide: 'Like "sh" in "ship"',
    type: 'consonant',
    phaseId: 4,
    lessonId: 3,
    strokeOrder: [
      { step: 1, description: 'Draw the curved top' },
      { step: 2, description: 'Add the vertical lines' },
      { step: 3, description: 'Draw the headline' }
    ],
    exampleWords: [
      { devanagari: 'शेर', transliteration: 'sher', meaning: 'lion' },
      { devanagari: 'शाम', transliteration: 'shaam', meaning: 'evening' }
    ]
  },
  {
    id: 'c-31',
    devanagari: 'ष',
    transliteration: 'sha',
    pronunciationGuide: 'Retroflex "sh" (tongue curls back)',
    type: 'consonant',
    phaseId: 4,
    lessonId: 3,
    strokeOrder: [
      { step: 1, description: 'Draw the main body' },
      { step: 2, description: 'Add the curved parts' },
      { step: 3, description: 'Draw the headline' }
    ],
    exampleWords: [
      { devanagari: 'षट्कोण', transliteration: 'shatkon', meaning: 'hexagon' },
      { devanagari: 'विषय', transliteration: 'vishay', meaning: 'subject' }
    ]
  },
  {
    id: 'c-32',
    devanagari: 'स',
    transliteration: 'sa',
    pronunciationGuide: 'Like "s" in "sun"',
    type: 'consonant',
    phaseId: 4,
    lessonId: 3,
    strokeOrder: [
      { step: 1, description: 'Draw the curved top loop' },
      { step: 2, description: 'Add the stem' },
      { step: 3, description: 'Draw the headline' }
    ],
    exampleWords: [
      { devanagari: 'सेब', transliteration: 'seb', meaning: 'apple' },
      { devanagari: 'समय', transliteration: 'samay', meaning: 'time' }
    ]
  },
  {
    id: 'c-33',
    devanagari: 'ह',
    transliteration: 'ha',
    pronunciationGuide: 'Like "h" in "house"',
    type: 'consonant',
    phaseId: 4,
    lessonId: 3,
    strokeOrder: [
      { step: 1, description: 'Draw the curved top' },
      { step: 2, description: 'Add the lower loop' },
      { step: 3, description: 'Draw the headline' }
    ],
    exampleWords: [
      { devanagari: 'हाथी', transliteration: 'haathi', meaning: 'elephant' },
      { devanagari: 'हवा', transliteration: 'hawa', meaning: 'air/wind' }
    ]
  },

  // Nuqta consonants (borrowed sounds)
  {
    id: 'c-34',
    devanagari: 'क़',
    transliteration: 'qa',
    pronunciationGuide: 'Like "q" in Arabic (deeper "k")',
    type: 'consonant',
    phaseId: 4,
    lessonId: 3,
    strokeOrder: [
      { step: 1, description: 'Draw क first' },
      { step: 2, description: 'Add the dot (nuqta) below' }
    ],
    exampleWords: [
      { devanagari: 'क़लम', transliteration: 'qalam', meaning: 'pen' },
      { devanagari: 'क़िला', transliteration: 'qila', meaning: 'fort' }
    ]
  },
  {
    id: 'c-35',
    devanagari: 'ख़',
    transliteration: 'kha',
    pronunciationGuide: 'Like "ch" in Scottish "loch"',
    type: 'consonant',
    phaseId: 4,
    lessonId: 3,
    strokeOrder: [
      { step: 1, description: 'Draw ख first' },
      { step: 2, description: 'Add the dot (nuqta) below' }
    ],
    exampleWords: [
      { devanagari: 'ख़बर', transliteration: 'khabar', meaning: 'news' },
      { devanagari: 'ख़ास', transliteration: 'khaas', meaning: 'special' }
    ]
  },
  {
    id: 'c-36',
    devanagari: 'ग़',
    transliteration: 'gha',
    pronunciationGuide: 'Like French "r" (voiced uvular)',
    type: 'consonant',
    phaseId: 4,
    lessonId: 3,
    strokeOrder: [
      { step: 1, description: 'Draw ग first' },
      { step: 2, description: 'Add the dot (nuqta) below' }
    ],
    exampleWords: [
      { devanagari: 'ग़लत', transliteration: 'ghalat', meaning: 'wrong' },
      { devanagari: 'ग़ज़ल', transliteration: 'ghazal', meaning: 'ghazal (poetry)' }
    ]
  },
  {
    id: 'c-37',
    devanagari: 'ज़',
    transliteration: 'za',
    pronunciationGuide: 'Like "z" in "zebra"',
    type: 'consonant',
    phaseId: 4,
    lessonId: 3,
    strokeOrder: [
      { step: 1, description: 'Draw ज first' },
      { step: 2, description: 'Add the dot (nuqta) below' }
    ],
    exampleWords: [
      { devanagari: 'ज़रूर', transliteration: 'zaroor', meaning: 'definitely' },
      { devanagari: 'ज़िंदगी', transliteration: 'zindagi', meaning: 'life' }
    ]
  },
  {
    id: 'c-38',
    devanagari: 'फ़',
    transliteration: 'fa',
    pronunciationGuide: 'Like "f" in "fun"',
    type: 'consonant',
    phaseId: 4,
    lessonId: 3,
    strokeOrder: [
      { step: 1, description: 'Draw फ first' },
      { step: 2, description: 'Add the dot (nuqta) below' }
    ],
    exampleWords: [
      { devanagari: 'फ़िल्म', transliteration: 'film', meaning: 'movie' },
      { devanagari: 'फ़ोन', transliteration: 'fon', meaning: 'phone' }
    ]
  },
  {
    id: 'c-39',
    devanagari: 'ड़',
    transliteration: 'da',
    pronunciationGuide: 'Flapped retroflex "d"',
    type: 'consonant',
    phaseId: 4,
    lessonId: 3,
    strokeOrder: [
      { step: 1, description: 'Draw ड first' },
      { step: 2, description: 'Add the dot (nuqta) below' }
    ],
    exampleWords: [
      { devanagari: 'सड़क', transliteration: 'sadak', meaning: 'road' },
      { devanagari: 'लड़की', transliteration: 'ladki', meaning: 'girl' }
    ]
  },
  {
    id: 'c-40',
    devanagari: 'ढ़',
    transliteration: 'dha',
    pronunciationGuide: 'Flapped aspirated retroflex',
    type: 'consonant',
    phaseId: 4,
    lessonId: 3,
    strokeOrder: [
      { step: 1, description: 'Draw ढ first' },
      { step: 2, description: 'Add the dot (nuqta) below' }
    ],
    exampleWords: [
      { devanagari: 'पढ़ना', transliteration: 'padhna', meaning: 'to read' },
      { devanagari: 'बढ़ना', transliteration: 'badhna', meaning: 'to grow' }
    ]
  }
];
