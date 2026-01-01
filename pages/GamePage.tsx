
import React, { useState, useCallback, useMemo } from 'react';
import { Game } from '../components/Game';
import { Header } from '../components/Header';
import { ArchiveModal } from '../components/modals/ArchiveModal';
import { getDatesWithWords } from '../services/wordService';
import { getFormattedDate } from '../utils/dateUtils';
import { useGameLogic } from '../hooks/useGameLogic';
import { GameStatus } from '../types';
import { apiService } from '../services/apiService';

interface GamePageProps {
  onNavigateToAdmin: () => void;
}

export const GamePage: React.FC<GamePageProps> = ({ onNavigateToAdmin }) => {
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const today = useMemo(() => getFormattedDate(new Date()), []);
  const [gameDate, setGameDate] = useState(today);
  const [wordExists, setWordExists] = useState(true);

  // Check if word exists for the date, to show error message if not
  useMemo(async () => {
    const word = await apiService.getWordForDate(gameDate);
    setWordExists(!!word);
  }, [gameDate]);

  const gameLogic = useGameLogic(gameDate);

  const handleSelectDate = useCallback((date: string) => {
    setGameDate(date);
    setIsArchiveOpen(false);
  }, []);

  const handlePlayPastGames = useCallback(() => {
    // This will close the WinModal implicitly as it gets unmounted
    // and open the ArchiveModal
    gameLogic.handleCloseWinModal();
    setIsArchiveOpen(true);
  }, [gameLogic]);

  if (!wordExists) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-900 text-white p-4">
        <h1 className="text-4xl font-bold mb-4">RiddlWord</h1>
        <p className="text-xl text-slate-400">Sorry, no word available for this date.</p>
        <button
          onClick={() => setGameDate(today)}
          className="mt-6 px-4 py-2 bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
        >
          Play Today's Game
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen max-h-[100dvh] w-screen max-w-full">
      <Header
        onArchiveClick={() => setIsArchiveOpen(true)}
        onHintClick={gameLogic.requestHint}
        onNavigateToAdmin={onNavigateToAdmin}
        gameDate={gameDate}
        isToday={gameDate === today}
        hintsRemaining={gameLogic.hintsRemaining}
        isGameActive={gameLogic.gameStatus === GameStatus.Playing}
      />
      <main className="flex-grow flex flex-col items-center justify-center w-full px-2 pb-2">
        <Game 
          key={gameDate} 
          gameDate={gameDate} 
          onPlayPastGames={handlePlayPastGames}
          {...gameLogic}
        />
      </main>
      {isArchiveOpen && (
        <ArchiveModal
          onClose={() => setIsArchiveOpen(false)}
          onSelectDate={handleSelectDate}
          availableDates={getDatesWithWords()}
          today={today}
        />
      )}
    </div>
  );
};