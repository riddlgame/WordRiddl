
import React from 'react';
import { KeyboardStatus, LetterState } from '../types';

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  keyboardStatus: KeyboardStatus;
}

const keys = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['Enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'Backspace'],
];

const Key: React.FC<{
  value: string;
  onKeyPress: (key: string) => void;
  status?: LetterState;
}> = ({ value, onKeyPress, status }) => {
  const baseClasses = "h-12 flex items-center justify-center rounded-md font-bold uppercase cursor-pointer transition-all duration-200";
  const stateClasses = {
    [LetterState.Correct]: 'bg-emerald-600 text-white',
    [LetterState.Present]: 'bg-sky-500 text-white',
    [LetterState.Absent]: 'bg-rose-500 text-white',
  };
  const widthClass = value.length > 1 ? 'px-3 text-xs flex-grow' : 'w-8 sm:w-10';
  const colorClass = status !== undefined ? stateClasses[status] : 'bg-slate-600 hover:bg-slate-500 active:bg-slate-700';
  
  return (
    <button onClick={() => onKeyPress(value)} className={`${baseClasses} ${widthClass} ${colorClass}`}>
      {value === 'Backspace' ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 002.828 0L19 12M3 12l6.414-6.414a2 2 0 012.828 0L19 12" />
        </svg>
      ) : value}
    </button>
  );
};

export const Keyboard: React.FC<KeyboardProps> = ({ onKeyPress, keyboardStatus }) => {
  return (
    <div className="flex flex-col gap-2 w-full max-w-lg mx-auto p-2">
      {keys.map((row, i) => (
        <div key={i} className={`flex justify-center gap-1.5 ${i === 1 ? 'px-4 sm:px-6' : ''}`}>
          {row.map((key) => (
            <Key
              key={key}
              value={key}
              onKeyPress={onKeyPress}
              status={keyboardStatus[key]}
            />
          ))}
        </div>
      ))}
    </div>
  );
};