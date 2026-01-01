
import React, { useState } from 'react';
import { GuessResult } from '../../types';
import { generateShareText } from '../../utils/shareUtils';

interface WinModalProps {
  guesses: GuessResult[];
  gameDate: string;
  onPlayPastGames: () => void;
}

export const WinModal: React.FC<WinModalProps> = ({ guesses, gameDate, onPlayPastGames }) => {
  const [copied, setCopied] = useState(false);
  const shareText = generateShareText(guesses, gameDate);

  const handleShare = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg p-8 max-w-sm w-full mx-4 text-center shadow-2xl">
        <h2 className="text-3xl font-bold text-emerald-400 mb-2">You Won!</h2>
        <p className="text-slate-300 mb-4">You guessed the word in {guesses.length} tries.</p>
        
        <div className="bg-slate-900 p-4 rounded-md text-left mb-6 whitespace-pre-wrap font-mono text-sm">
          {shareText}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={onPlayPastGames}
              className="w-full bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Play Past Games
            </button>
            <button 
              onClick={handleShare}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
            >
              {copied ? 'Copied!' : 'Share Results'}
            </button>
        </div>

      </div>
    </div>
  );
};