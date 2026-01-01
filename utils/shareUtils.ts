
import { GuessResult, LengthComparison } from '../types';

export const generateShareText = (guesses: GuessResult[], gameDate: string): string => {
  const title = `Wordish ${gameDate}`;
  const summary = `${guesses.length} Guesses`;

  const grid = guesses.map((guess, index) => {
    let lengthEmoji = '';
    const isLastGuess = index === guesses.length - 1;

    switch (guess.lengthComparison) {
      case LengthComparison.Longer:
        lengthEmoji = '🔼'; // Mystery word is longer
        break;
      case LengthComparison.Shorter:
        lengthEmoji = '🔽'; // Mystery word is shorter
        break;
      case LengthComparison.Equal:
        // The final guess will be equal and correct
        lengthEmoji = isLastGuess ? '🟰✅' : '🟰';
        break;
    }
    
    return lengthEmoji;
  }).join('\n');

  return `${title}\n${summary}\n\n${grid}`;
};