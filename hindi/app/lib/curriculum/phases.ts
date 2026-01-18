import type { Phase } from './types';

export const phases: Phase[] = [
  {
    id: 1,
    title: 'स्वर (Vowels)',
    description: 'Learn the 13 vowels of Hindi - the foundation of Devanagari script',
    lessons: [
      {
        id: 1,
        phaseId: 1,
        title: 'Basic Vowels',
        description: 'अ आ इ ई - The first four vowels',
        letterIds: ['v-01', 'v-02', 'v-03', 'v-04']
      },
      {
        id: 2,
        phaseId: 1,
        title: 'U Vowels',
        description: 'उ ऊ - Short and long U sounds',
        letterIds: ['v-05', 'v-06']
      },
      {
        id: 3,
        phaseId: 1,
        title: 'E and O Vowels',
        description: 'ए ऐ ओ औ - E and O sounds',
        letterIds: ['v-07', 'v-08', 'v-09', 'v-10']
      },
      {
        id: 4,
        phaseId: 1,
        title: 'Special Vowels',
        description: 'ऋ अं अः - Ri and nasalized sounds',
        letterIds: ['v-11', 'v-12', 'v-13']
      }
    ]
  },
  {
    id: 2,
    title: 'व्यंजन भाग १ (Consonants Part 1)',
    description: 'Learn the first set of consonants - Velars and Palatals',
    lessons: [
      {
        id: 1,
        phaseId: 2,
        title: 'Velars (कवर्ग)',
        description: 'क ख ग घ ङ - Throat sounds',
        letterIds: ['c-01', 'c-02', 'c-03', 'c-04', 'c-05']
      },
      {
        id: 2,
        phaseId: 2,
        title: 'Palatals (चवर्ग)',
        description: 'च छ ज झ ञ - Palate sounds',
        letterIds: ['c-06', 'c-07', 'c-08', 'c-09', 'c-10']
      }
    ]
  },
  {
    id: 3,
    title: 'व्यंजन भाग २ (Consonants Part 2)',
    description: 'Learn Retroflexes and Dentals',
    lessons: [
      {
        id: 1,
        phaseId: 3,
        title: 'Retroflexes (टवर्ग)',
        description: 'ट ठ ड ढ ण - Retroflex sounds',
        letterIds: ['c-11', 'c-12', 'c-13', 'c-14', 'c-15']
      },
      {
        id: 2,
        phaseId: 3,
        title: 'Dentals (तवर्ग)',
        description: 'त थ द ध न - Dental sounds',
        letterIds: ['c-16', 'c-17', 'c-18', 'c-19', 'c-20']
      }
    ]
  },
  {
    id: 4,
    title: 'व्यंजन भाग ३ (Consonants Part 3)',
    description: 'Learn Labials, Semi-vowels, and Sibilants',
    lessons: [
      {
        id: 1,
        phaseId: 4,
        title: 'Labials (पवर्ग)',
        description: 'प फ ब भ म - Lip sounds',
        letterIds: ['c-21', 'c-22', 'c-23', 'c-24', 'c-25']
      },
      {
        id: 2,
        phaseId: 4,
        title: 'Semi-vowels',
        description: 'य र ल व - Semi-vowel sounds',
        letterIds: ['c-26', 'c-27', 'c-28', 'c-29']
      },
      {
        id: 3,
        phaseId: 4,
        title: 'Sibilants',
        description: 'श ष स ह - Sibilant sounds',
        letterIds: ['c-30', 'c-31', 'c-32', 'c-33']
      }
    ]
  },
  {
    id: 5,
    title: 'मात्राएँ (Matras)',
    description: 'Learn the dependent vowel signs that attach to consonants',
    lessons: [
      {
        id: 1,
        phaseId: 5,
        title: 'Basic Matras',
        description: 'ा ि ी ु ू - Common matras',
        letterIds: ['m-01', 'm-02', 'm-03', 'm-04', 'm-05']
      },
      {
        id: 2,
        phaseId: 5,
        title: 'E/O Matras',
        description: 'े ै ो ौ - E and O matras',
        letterIds: ['m-06', 'm-07', 'm-08', 'm-09']
      },
      {
        id: 3,
        phaseId: 5,
        title: 'Special Matras',
        description: 'ृ ं ः ँ ् - Special signs',
        letterIds: ['m-10', 'm-11', 'm-12', 'm-13', 'm-14']
      }
    ]
  },
  {
    id: 6,
    title: 'संयुक्त अक्षर (Conjuncts)',
    description: 'Learn common consonant combinations',
    lessons: [
      {
        id: 1,
        phaseId: 6,
        title: 'Common Conjuncts',
        description: 'क्ष त्र ज्ञ श्र - Frequently used conjuncts',
        letterIds: ['j-01', 'j-02', 'j-03', 'j-04']
      },
      {
        id: 2,
        phaseId: 6,
        title: 'R-Conjuncts',
        description: 'क्र प्र ग्र - Conjuncts with र',
        letterIds: ['j-05', 'j-06', 'j-07']
      },
      {
        id: 3,
        phaseId: 6,
        title: 'Other Conjuncts',
        description: 'स्त क्य द्य न्द ल्ल - More combinations',
        letterIds: ['j-08', 'j-09', 'j-10', 'j-11', 'j-12']
      }
    ]
  }
];
