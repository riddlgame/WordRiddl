
import React from 'react';
import { GameBoard } from './GameBoard';
import { Keyboard } from './Keyboard';
import { WinModal } from './modals/WinModal';
import { ToastContainer } from './Toast';
import { GameStatus, GuessResult, KeyboardStatus, ToastMessage } from '../types';

interface GameProps {
  gameDate: string;
  gameStatus: GameStatus;
  guesses: GuessResult[];
  currentGuess: string;
  keyboardStatus: KeyboardStatus;
  handleKeyPress: (key: string) => void;
  isRevealing: boolean;
  toast: ToastMessage | null;
  shakeCurrentRow: boolean;
  onPlayPastGames: () => void;
}

export const Game: React.FC<GameProps> = ({ 
  gameDate,
  gameStatus,
  guesses,
  currentGuess,
  keyboardStatus,
  handleKeyPress,
  isRevealing,
  toast,
  shakeCurrentRow,
  onPlayPastGames,
}) => {

  return (
    <div className="w-full h-full max-w-md mx-auto flex flex-col justify-between">
      <ToastContainer toast={toast} />
      <GameBoard
        guesses={guesses}
        currentGuess={currentGuess}
        isRevealing={isRevealing}
        shakeCurrentRow={shakeCurrentRow}
      />
      <Keyboard onKeyPress={handleKeyPress} keyboardStatus={keyboardStatus} />
      {gameStatus === GameStatus.Won && (
        <WinModal
          guesses={guesses}
          gameDate={gameDate}
          onPlayPastGames={onPlayPastGames}
        />
      )}
    </div>
  );
};
