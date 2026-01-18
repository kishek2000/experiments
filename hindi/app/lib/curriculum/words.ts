export interface Word {
  devanagari: string;
  transliteration: string;
  meaning: string;
  category?: string;
}

export const words: Word[] = [
  // Greetings and Common Phrases
  { devanagari: 'नमस्ते', transliteration: 'namaste', meaning: 'hello/greetings', category: 'greetings' },
  { devanagari: 'धन्यवाद', transliteration: 'dhanyavaad', meaning: 'thank you', category: 'greetings' },
  { devanagari: 'कृपया', transliteration: 'kripaya', meaning: 'please', category: 'greetings' },
  { devanagari: 'माफ़ कीजिए', transliteration: 'maaf kijiye', meaning: 'excuse me/sorry', category: 'greetings' },
  { devanagari: 'अलविदा', transliteration: 'alvida', meaning: 'goodbye', category: 'greetings' },

  // Family
  { devanagari: 'माँ', transliteration: 'maan', meaning: 'mother', category: 'family' },
  { devanagari: 'पिता', transliteration: 'pita', meaning: 'father', category: 'family' },
  { devanagari: 'भाई', transliteration: 'bhaai', meaning: 'brother', category: 'family' },
  { devanagari: 'बहन', transliteration: 'bahan', meaning: 'sister', category: 'family' },
  { devanagari: 'दादा', transliteration: 'daada', meaning: 'grandfather (paternal)', category: 'family' },
  { devanagari: 'दादी', transliteration: 'daadi', meaning: 'grandmother (paternal)', category: 'family' },
  { devanagari: 'बेटा', transliteration: 'beta', meaning: 'son', category: 'family' },
  { devanagari: 'बेटी', transliteration: 'beti', meaning: 'daughter', category: 'family' },

  // Numbers
  { devanagari: 'एक', transliteration: 'ek', meaning: 'one', category: 'numbers' },
  { devanagari: 'दो', transliteration: 'do', meaning: 'two', category: 'numbers' },
  { devanagari: 'तीन', transliteration: 'teen', meaning: 'three', category: 'numbers' },
  { devanagari: 'चार', transliteration: 'chaar', meaning: 'four', category: 'numbers' },
  { devanagari: 'पाँच', transliteration: 'paanch', meaning: 'five', category: 'numbers' },
  { devanagari: 'छह', transliteration: 'chhah', meaning: 'six', category: 'numbers' },
  { devanagari: 'सात', transliteration: 'saat', meaning: 'seven', category: 'numbers' },
  { devanagari: 'आठ', transliteration: 'aath', meaning: 'eight', category: 'numbers' },
  { devanagari: 'नौ', transliteration: 'nau', meaning: 'nine', category: 'numbers' },
  { devanagari: 'दस', transliteration: 'das', meaning: 'ten', category: 'numbers' },

  // Colors
  { devanagari: 'लाल', transliteration: 'laal', meaning: 'red', category: 'colors' },
  { devanagari: 'नीला', transliteration: 'neela', meaning: 'blue', category: 'colors' },
  { devanagari: 'हरा', transliteration: 'hara', meaning: 'green', category: 'colors' },
  { devanagari: 'पीला', transliteration: 'peela', meaning: 'yellow', category: 'colors' },
  { devanagari: 'सफ़ेद', transliteration: 'safed', meaning: 'white', category: 'colors' },
  { devanagari: 'काला', transliteration: 'kaala', meaning: 'black', category: 'colors' },

  // Food
  { devanagari: 'पानी', transliteration: 'paani', meaning: 'water', category: 'food' },
  { devanagari: 'रोटी', transliteration: 'roti', meaning: 'bread', category: 'food' },
  { devanagari: 'चावल', transliteration: 'chaaval', meaning: 'rice', category: 'food' },
  { devanagari: 'दाल', transliteration: 'daal', meaning: 'lentils', category: 'food' },
  { devanagari: 'सब्ज़ी', transliteration: 'sabzi', meaning: 'vegetable', category: 'food' },
  { devanagari: 'फल', transliteration: 'phal', meaning: 'fruit', category: 'food' },
  { devanagari: 'दूध', transliteration: 'doodh', meaning: 'milk', category: 'food' },
  { devanagari: 'चाय', transliteration: 'chaay', meaning: 'tea', category: 'food' },

  // Time
  { devanagari: 'आज', transliteration: 'aaj', meaning: 'today', category: 'time' },
  { devanagari: 'कल', transliteration: 'kal', meaning: 'yesterday/tomorrow', category: 'time' },
  { devanagari: 'अभी', transliteration: 'abhi', meaning: 'now', category: 'time' },
  { devanagari: 'सुबह', transliteration: 'subah', meaning: 'morning', category: 'time' },
  { devanagari: 'दोपहर', transliteration: 'dopahar', meaning: 'afternoon', category: 'time' },
  { devanagari: 'शाम', transliteration: 'shaam', meaning: 'evening', category: 'time' },
  { devanagari: 'रात', transliteration: 'raat', meaning: 'night', category: 'time' },

  // Places
  { devanagari: 'घर', transliteration: 'ghar', meaning: 'house/home', category: 'places' },
  { devanagari: 'स्कूल', transliteration: 'school', meaning: 'school', category: 'places' },
  { devanagari: 'बाज़ार', transliteration: 'bazaar', meaning: 'market', category: 'places' },
  { devanagari: 'मंदिर', transliteration: 'mandir', meaning: 'temple', category: 'places' },
  { devanagari: 'दुकान', transliteration: 'dukaan', meaning: 'shop', category: 'places' },

  // Body Parts
  { devanagari: 'सिर', transliteration: 'sir', meaning: 'head', category: 'body' },
  { devanagari: 'आँख', transliteration: 'aankh', meaning: 'eye', category: 'body' },
  { devanagari: 'कान', transliteration: 'kaan', meaning: 'ear', category: 'body' },
  { devanagari: 'नाक', transliteration: 'naak', meaning: 'nose', category: 'body' },
  { devanagari: 'मुँह', transliteration: 'munh', meaning: 'mouth', category: 'body' },
  { devanagari: 'हाथ', transliteration: 'haath', meaning: 'hand', category: 'body' },
  { devanagari: 'पैर', transliteration: 'pair', meaning: 'foot/leg', category: 'body' },

  // Animals
  { devanagari: 'कुत्ता', transliteration: 'kutta', meaning: 'dog', category: 'animals' },
  { devanagari: 'बिल्ली', transliteration: 'billi', meaning: 'cat', category: 'animals' },
  { devanagari: 'गाय', transliteration: 'gaay', meaning: 'cow', category: 'animals' },
  { devanagari: 'हाथी', transliteration: 'haathi', meaning: 'elephant', category: 'animals' },
  { devanagari: 'शेर', transliteration: 'sher', meaning: 'lion', category: 'animals' },
  { devanagari: 'चिड़िया', transliteration: 'chidiya', meaning: 'bird', category: 'animals' },

  // Question Words
  { devanagari: 'क्या', transliteration: 'kya', meaning: 'what', category: 'questions' },
  { devanagari: 'कौन', transliteration: 'kaun', meaning: 'who', category: 'questions' },
  { devanagari: 'कहाँ', transliteration: 'kahaan', meaning: 'where', category: 'questions' },
  { devanagari: 'कब', transliteration: 'kab', meaning: 'when', category: 'questions' },
  { devanagari: 'क्यों', transliteration: 'kyon', meaning: 'why', category: 'questions' },
  { devanagari: 'कैसे', transliteration: 'kaise', meaning: 'how', category: 'questions' },
  { devanagari: 'कितना', transliteration: 'kitna', meaning: 'how much', category: 'questions' },

  // Common Verbs (infinitive form)
  { devanagari: 'करना', transliteration: 'karna', meaning: 'to do', category: 'verbs' },
  { devanagari: 'जाना', transliteration: 'jaana', meaning: 'to go', category: 'verbs' },
  { devanagari: 'आना', transliteration: 'aana', meaning: 'to come', category: 'verbs' },
  { devanagari: 'खाना', transliteration: 'khaana', meaning: 'to eat', category: 'verbs' },
  { devanagari: 'पीना', transliteration: 'peena', meaning: 'to drink', category: 'verbs' },
  { devanagari: 'देखना', transliteration: 'dekhna', meaning: 'to see', category: 'verbs' },
  { devanagari: 'सुनना', transliteration: 'sunna', meaning: 'to hear', category: 'verbs' },
  { devanagari: 'बोलना', transliteration: 'bolna', meaning: 'to speak', category: 'verbs' },
  { devanagari: 'पढ़ना', transliteration: 'padhna', meaning: 'to read', category: 'verbs' },
  { devanagari: 'लिखना', transliteration: 'likhna', meaning: 'to write', category: 'verbs' },

  // Common Adjectives
  { devanagari: 'अच्छा', transliteration: 'acchha', meaning: 'good', category: 'adjectives' },
  { devanagari: 'बुरा', transliteration: 'bura', meaning: 'bad', category: 'adjectives' },
  { devanagari: 'बड़ा', transliteration: 'bada', meaning: 'big', category: 'adjectives' },
  { devanagari: 'छोटा', transliteration: 'chhota', meaning: 'small', category: 'adjectives' },
  { devanagari: 'नया', transliteration: 'naya', meaning: 'new', category: 'adjectives' },
  { devanagari: 'पुराना', transliteration: 'puraana', meaning: 'old', category: 'adjectives' },
  { devanagari: 'गरम', transliteration: 'garam', meaning: 'hot', category: 'adjectives' },
  { devanagari: 'ठंडा', transliteration: 'thanda', meaning: 'cold', category: 'adjectives' },

  // Pronouns
  { devanagari: 'मैं', transliteration: 'main', meaning: 'I', category: 'pronouns' },
  { devanagari: 'तुम', transliteration: 'tum', meaning: 'you (informal)', category: 'pronouns' },
  { devanagari: 'आप', transliteration: 'aap', meaning: 'you (formal)', category: 'pronouns' },
  { devanagari: 'वह', transliteration: 'vah', meaning: 'he/she/that', category: 'pronouns' },
  { devanagari: 'हम', transliteration: 'ham', meaning: 'we', category: 'pronouns' },
  { devanagari: 'वे', transliteration: 've', meaning: 'they', category: 'pronouns' },
  { devanagari: 'यह', transliteration: 'yah', meaning: 'this', category: 'pronouns' },

  // Common Objects
  { devanagari: 'किताब', transliteration: 'kitaab', meaning: 'book', category: 'objects' },
  { devanagari: 'कलम', transliteration: 'kalam', meaning: 'pen', category: 'objects' },
  { devanagari: 'मेज़', transliteration: 'mez', meaning: 'table', category: 'objects' },
  { devanagari: 'कुर्सी', transliteration: 'kursi', meaning: 'chair', category: 'objects' },
  { devanagari: 'फ़ोन', transliteration: 'fon', meaning: 'phone', category: 'objects' },
  { devanagari: 'घड़ी', transliteration: 'ghadi', meaning: 'clock/watch', category: 'objects' }
];
