
import React from 'react';
import { GuessResult, GameStatus } from '../types';
import { GuessRow } from './GuessRow';

interface GameBoardProps {
  guesses: GuessResult[];
  currentGuess: string;
  isRevealing: boolean;
  shakeCurrentRow: boolean;
  gameStatus: GameStatus;
}

export const GameBoard: React.FC<GameBoardProps> = ({ guesses, currentGuess, isRevealing, shakeCurrentRow, gameStatus }) => {
  const isCurrentRowShaking = shakeCurrentRow;
  
  return (
    <div className="flex items-center justify-center">
      <div className="grid gap-2 p-2">
        {guesses.map((guess, i) => (
          <GuessRow key={i} guess={guess} isRevealing={isRevealing && guesses.length -1 === i}/>
        ))}
        {gameStatus === GameStatus.Playing && (
          <GuessRow currentGuess={currentGuess} shake={isCurrentRowShaking}/>
        )}
      </div>
    </div>
  );
};