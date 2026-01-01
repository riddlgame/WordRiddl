
import React from 'react';
import { GuessResult } from '../types';
import { MAX_GUESSES } from '../constants';
import { GuessRow } from './GuessRow';

interface GameBoardProps {
  guesses: GuessResult[];
  currentGuess: string;
  isRevealing: boolean;
  shakeCurrentRow: boolean;
}

export const GameBoard: React.FC<GameBoardProps> = ({ guesses, currentGuess, isRevealing, shakeCurrentRow }) => {
  const emptyRows = Array.from(Array(Math.max(0, MAX_GUESSES - guesses.length - 1)));
  const isCurrentRowShaking = shakeCurrentRow && guesses.length < MAX_GUESSES;
  
  return (
    <div className="flex-grow flex items-center justify-center">
      <div className="grid gap-2 p-2">
        {guesses.map((guess, i) => (
          <GuessRow key={i} guess={guess} isRevealing={isRevealing && guesses.length -1 === i}/>
        ))}
        {guesses.length < MAX_GUESSES && (
          <GuessRow currentGuess={currentGuess} shake={isCurrentRowShaking}/>
        )}
        {emptyRows.map((_, i) => (
          <GuessRow key={i} />
        ))}
      </div>
    </div>
  );
};
