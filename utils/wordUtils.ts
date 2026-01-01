
import { GuessResult, LetterState, LengthComparison } from '../types';

export interface EvaluationResult extends GuessResult {
  isWin: boolean;
}

export const evaluateGuess = (guess: string, solution: string): EvaluationResult => {
  const guessLower = guess.toLowerCase();
  const solutionLower = solution.toLowerCase();
  
  const resultLetters: { char: string; state: LetterState }[] = Array.from(guessLower).map(char => ({
    char,
    state: LetterState.Absent,
  }));

  const solutionLetterCounts: { [key: string]: number } = {};
  for (const char of solutionLower) {
    solutionLetterCounts[char] = (solutionLetterCounts[char] || 0) + 1;
  }

  // First pass for correct letters (green)
  for (let i = 0; i < guessLower.length; i++) {
    if (i < solutionLower.length && guessLower[i] === solutionLower[i]) {
      resultLetters[i].state = LetterState.Correct;
      solutionLetterCounts[guessLower[i]]--;
    }
  }

  // Second pass for present letters (yellow)
  for (let i = 0; i < guessLower.length; i++) {
    if (resultLetters[i].state !== LetterState.Correct) {
      if (solutionLetterCounts[guessLower[i]] > 0) {
        resultLetters[i].state = LetterState.Present;
        solutionLetterCounts[guessLower[i]]--;
      }
    }
  }
  
  let lengthComparison: LengthComparison;
  if (guess.length > solution.length) {
      lengthComparison = LengthComparison.Shorter; // "mystery word is shorter"
  } else if (guess.length < solution.length) {
      lengthComparison = LengthComparison.Longer; // "mystery word is longer"
  } else {
      lengthComparison = LengthComparison.Equal;
  }

  const isWin = guessLower === solutionLower;

  return {
    word: guess,
    letters: resultLetters,
    lengthComparison,
    isWin,
  };
};
