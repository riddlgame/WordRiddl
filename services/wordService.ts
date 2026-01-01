
/**
 * This file acts as a mock database and data access layer.
 * This version is stateless, reading from and writing to localStorage on every operation
 * to ensure it is the single source of truth.
 */
import { getFormattedDate, parseDMY } from '../utils/dateUtils';

const STORAGE_KEY = 'wordish_database';

const initialDatabase: { [date: string]: string } = {
  "31/12/2025": "future",
  "30/12/2025": "comet",
  "29/12/2025": "galaxy",
  "28/12/2025": "orbit",
  "27/12/2025": "planet",
  "26/12/2025": "rocket",
  "25/12/2025": "star",
  "24/12/2025": "lunar",
  "23/12/2025": "solar",
  "22/12/2025": "space",
};

const persistDatabase = (db: { [date: string]: string }) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    } catch (error) {
        console.error("Failed to save words to localStorage", error);
    }
};

const loadDatabase = (): { [date: string]: string } => {
    try {
        const storedData = localStorage.getItem(STORAGE_KEY);
        if (storedData) {
            return JSON.parse(storedData);
        }
    } catch (error) {
        console.error("Failed to load words from localStorage", error);
    }
    
    // If nothing in storage, initialize it with the default data.
    const dbToInit = { ...initialDatabase };
    const todayStr = getFormattedDate(new Date());
    if (!dbToInit[todayStr]) {
        dbToInit[todayStr] = 'puzzle';
    }
    persistDatabase(dbToInit);
    return dbToInit;
};

// On first module load, ensure the database is initialized in localStorage if it isn't already.
if (!localStorage.getItem(STORAGE_KEY)) {
    loadDatabase(); 
}

export const getWordForDate = (date: string): string | undefined => {
  const db = loadDatabase();
  return db[date];
};

export const setWordForDate = (date: string, word: string): { [date: string]: string } => {
  const db = loadDatabase();
  if (word && word.trim().length > 0) {
    db[date] = word.trim().toLowerCase();
    persistDatabase(db);
  }
  return db;
};

export const deleteWordForDate = (date: string): { [date: string]: string } => {
  const db = loadDatabase();
  delete db[date];
  persistDatabase(db);
  return db;
};

export const getDatesWithWords = (): string[] => {
    const db = loadDatabase();
    return Object.keys(db).sort((a, b) => parseDMY(b).getTime() - parseDMY(a).getTime());
};

export const getAllWords = (): { [date: string]: string } => {
    return loadDatabase();
}

export const saveAllWords = (words: { [date: string]: string }): void => {
    persistDatabase(words);
};
