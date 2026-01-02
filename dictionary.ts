
/**
 * Dictionary Service
 * Fetches and caches the English word list from the dwyl/english-words repository.
 */

const DICTIONARY_URL = 'https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt';

let wordSet: Set<string> | null = null;
let wordList: string[] | null = null;
let loadingPromise: Promise<{ set: Set<string>; list: string[] }> | null = null;

/**
 * Loads the dictionary into memory.
 * Uses words_alpha.txt as it is optimized for word games (letters only).
 */
const loadDictionary = async (): Promise<{ set: Set<string>; list: string[] }> => {
  if (wordSet && wordList) return { set: wordSet, list: wordList };
  if (loadingPromise) return loadingPromise;

  loadingPromise = fetch(DICTIONARY_URL)
    .then((res) => {
      if (!res.ok) throw new Error('Could not fetch dictionary');
      return res.text();
    })
    .then((text) => {
      const words = text.split(/\r?\n/).map((w) => w.toLowerCase().trim()).filter((w) => w.length > 0);
      wordSet = new Set(words);
      wordList = words;
      console.log(`Dictionary loaded: ${wordSet.size} words.`);
      return { set: wordSet, list: wordList };
    })
    .catch((err) => {
      console.error('Dictionary load failed:', err);
      return { set: new Set<string>(), list: [] };
    });

  return loadingPromise;
};

export const dictionaryService = {
  isValid: async (word: string): Promise<boolean> => {
    const { set } = await loadDictionary();
    if (set.size === 0) return true; 
    return set.has(word.toLowerCase().trim());
  },
  getRandomWord: async (minLength: number = 4, maxLength: number = 15): Promise<string | null> => {
    const { list } = await loadDictionary();
    if (list.length === 0) return null;
    
    const candidates = list.filter(w => w.length >= minLength && w.length <= maxLength);
    if (candidates.length === 0) return null;
    
    return candidates[Math.floor(Math.random() * candidates.length)];
  },
  preload: () => {
    loadDictionary();
  }
};
