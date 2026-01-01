
import React from 'react';

interface HeaderProps {
  onArchiveClick: () => void;
  onHintClick: () => void;
  onNavigateToAdmin?: () => void;
  gameDate: string;
  isToday: boolean;
  hintsRemaining: number;
  isGameActive: boolean;
}

const CalendarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const HintIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
);

const AdminIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);


export const Header: React.FC<HeaderProps> = ({ onArchiveClick, onHintClick, onNavigateToAdmin, gameDate, isToday, hintsRemaining, isGameActive }) => {
  return (
    <header className="flex items-center justify-between p-4 border-b border-slate-700">
      <div className="flex-1 text-left">
        {onNavigateToAdmin && (
             <button
                onClick={onNavigateToAdmin}
                className="p-2 rounded-lg hover:bg-slate-700 transition-colors"
                aria-label="Admin Panel"
            >
                <AdminIcon />
            </button>
        )}
      </div>
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-wider uppercase">Wordish</h1>
        <p className="text-sm text-slate-400">{isToday ? "Today's Puzzle" : gameDate}</p>
      </div>
      <div className="flex-1 text-right flex justify-end items-center gap-2">
         <button
            onClick={onHintClick}
            disabled={!isGameActive || hintsRemaining === 0}
            className="flex items-center gap-1 p-2 rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Get a hint"
        >
            <HintIcon />
            <span className="font-bold text-lg hidden sm:inline">{hintsRemaining}</span>
        </button>
        <button onClick={onArchiveClick} className="p-2 rounded-full hover:bg-slate-700 transition-colors" aria-label="Open archive">
            <CalendarIcon />
        </button>
      </div>
    </header>
  );
};
