
import { getWordForDate } from './wordService';
import { evaluateGuess, EvaluationResult } from '../utils/wordUtils';
import { KeyboardStatus } from '../types';

// This service simulates a backend API. In a real app, these would be fetch calls to a server.
// This is a critical security step: the frontend never knows the mystery word.

const submitGuess = (date: string, guess: string): Promise<EvaluationResult> => {
    return new Promise((resolve) => {
        const solution = getWordForDate(date);
        if (!solution) {
            // This should ideally not happen if the UI checks for word existence
            throw new Error("No word for this date!");
        }
        const result = evaluateGuess(guess, solution);
        // Simulate network latency
        setTimeout(() => resolve(result), 200);
    });
};

const getHint = (date: string, keyboardStatus: KeyboardStatus): Promise<string | null> => {
    return new Promise((resolve) => {
        const solution = getWordForDate(date);
        if (!solution) {
            resolve(null);
            return;
        }

        const mysteryChars = [...new Set(solution.toLowerCase().split(''))];
        const undiscoveredChars = mysteryChars.filter(char => keyboardStatus[char] === undefined);

        if (undiscoveredChars.length === 0) {
            resolve(null);
            return;
        }
        
        const hintChar = undiscoveredChars[Math.floor(Math.random() * undiscoveredChars.length)];
        setTimeout(() => resolve(hintChar), 100);
    });
}

export const apiService = {
  submitGuess,
  getHint,
  getWordForDate: (date: string): Promise<string | undefined> => Promise.resolve(getWordForDate(date)),
};
