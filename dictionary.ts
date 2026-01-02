
/**
 * Dictionary Service
 * Fetches and caches the English word list from the dwyl/english-words repository.
 */

const DICTIONARY_URL = 'https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt';

let wordSet: Set<string> | null = null;
let loadingPromise: Promise<Set<string>> | null = null;

/**
 * Loads the dictionary into memory.
 * Uses words_alpha.txt as it is optimized for word games (letters only).
 */
const loadDictionary = async (): Promise<Set<string>> => {
  if (wordSet) return wordSet;
  if (loadingPromise) return loadingPromise;

  loadingPromise = fetch(DICTIONARY_URL)
    .then((res) => {
      if (!res.ok) throw new Error('Could not fetch dictionary');
      return res.text();
    })
    .then((text) => {
      // Split by line breaks and trim
      const words = text.split(/\r?\n/).map((w) => w.toLowerCase().trim()).filter((w) => w.length > 0);
      wordSet = new Set(words);
      console.log(`Dictionary loaded: ${wordSet.size} words.`);
      return wordSet;
    })
    .catch((err) => {
      console.error('Dictionary load failed:', err);
      // Fallback to empty set or a minimal set to prevent total failure
      return new Set<string>();
    });

  return loadingPromise;
};

export const dictionaryService = {
  isValid: async (word: string): Promise<boolean> => {
    const set = await loadDictionary();
    // If dictionary failed to load, we allow the guess to proceed (fail-open) 
    // to not break the game, or you could change this to return false.
    if (set.size === 0) return true; 
    return set.has(word.toLowerCase().trim());
  },
  preload: () => {
    loadDictionary();
  }
};
