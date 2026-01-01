
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
  isWinModalOpen: boolean;
  handleCloseWinModal: () => void;
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
  isWinModalOpen,
  handleCloseWinModal,
}) => {

  return (
    <div className="w-full h-full max-w-md mx-auto flex flex-col">
      <ToastContainer toast={toast} />
      <div className="flex-grow flex flex-col justify-center">
        {guesses.length === 0 && currentGuess.length === 0 && (
          <div className="text-center p-4 text-slate-400 mb-4">
            <p>Guess the Mystery Word.</p>
            <p>Enter any word as a guess. You'll know if your word is long/short.</p>
            <p>It's straightforward from there.</p>
          </div>
        )}
        <GameBoard
          guesses={guesses}
          currentGuess={currentGuess}
          isRevealing={isRevealing}
          shakeCurrentRow={shakeCurrentRow}
          gameStatus={gameStatus}
        />
      </div>
      <Keyboard onKeyPress={handleKeyPress} keyboardStatus={keyboardStatus} />
      {isWinModalOpen && (
        <WinModal
          guesses={guesses}
          gameDate={gameDate}
          onPlayPastGames={onPlayPastGames}
          onClose={handleCloseWinModal}
        />
      )}
    </div>
  );
};