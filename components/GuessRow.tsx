
import React from 'react';
import { GuessResult, LengthComparison } from '../types';

interface GuessRowProps {
  guess?: GuessResult;
  currentGuess?: string;
  isRevealing?: boolean;
  shake?: boolean;
}

const LengthIndicator: React.FC<{ comparison: LengthComparison }> = ({ comparison }) => {
  let symbol, color, title;
  switch (comparison) {
    case LengthComparison.Longer:
      symbol = '↑';
      color = 'text-sky-400';
      title = 'Mystery word is longer';
      break;
    case LengthComparison.Shorter:
      symbol = '↓';
      color = 'text-amber-400';
      title = 'Mystery word is shorter';
      break;
    case LengthComparison.Equal:
      symbol = '=';
      color = 'text-emerald-400';
      title = 'Mystery word has the same length';
      break;
    default:
      return null;
  }
  return <div title={title} className={`text-2xl font-bold w-8 flex items-center justify-center ${color}`}>{symbol}</div>;
};

const Tile: React.FC<{ char?: string; state?: any; isRevealing?: boolean; index?: number, hasCursor?: boolean, wordLength: number }> = ({ char, state, isRevealing, index = 0, hasCursor = false, wordLength }) => {
    const stateClasses = {
        '0': 'bg-emerald-600 border-emerald-600', // Correct
        '1': 'bg-sky-500 border-sky-500',   // Present
        '2': 'bg-rose-500 border-rose-500',   // Absent
        '3': 'bg-transparent', // TBD
    };

    let sizeClasses = 'w-10 h-10 sm:w-12 sm:h-12 text-2xl';
    if (wordLength > 8) {
        sizeClasses = 'w-9 h-9 text-xl';
    }
    if (wordLength > 10) {
        sizeClasses = 'w-8 h-8 text-lg';
    }
    if (wordLength > 12) {
        sizeClasses = 'w-7 h-7 text-base';
    }
    
    const animationDelay = `${index * 100}ms`;
    const animationClass = isRevealing ? 'animate-reveal' : (hasCursor ? 'animate-blink' : '');
    const borderClass = hasCursor ? 'border-slate-400' : 'border-slate-600';

    return (
        <div 
          className={`border-2 flex-shrink-0 flex items-center justify-center font-bold uppercase rounded-md transition-all duration-300 ${sizeClasses} ${stateClasses[state ?? 3]} ${animationClass} ${borderClass}`}
          style={{ animationDelay }}
        >
            {char}
        </div>
    );
}


export const GuessRow: React.FC<GuessRowProps> = ({ guess, currentGuess, isRevealing, shake }) => {
  const tiles = [];
  const wordLength = guess?.word.length ?? currentGuess?.length ?? 0;
  const shakeClass = shake ? 'animate-shake' : '';

  if (guess) {
    for (let i = 0; i < wordLength; i++) {
        const letter = guess.letters[i];
        tiles.push(<Tile key={i} char={letter.char} state={letter.state} isRevealing={isRevealing} index={i} wordLength={wordLength}/>);
    }
  } else if (currentGuess !== undefined) {
    for (let i = 0; i < currentGuess.length; i++) {
        tiles.push(<Tile key={i} char={currentGuess[i]} wordLength={wordLength} />);
    }
    // Add a blinking cursor tile if the word is not at max length
    if(currentGuess.length < 15) {
        tiles.push(<Tile key="cursor" hasCursor={true} wordLength={wordLength} />)
    }
  } else {
    // Empty row, render empty tiles for visual structure if needed
    // This implementation renders a blank row
    return <div className="h-10 sm:h-12"></div>
  }

  return (
    <div className={`flex items-center justify-center gap-2 ${shakeClass}`}>
        <div className="flex items-center justify-center gap-2">
          {tiles}
        </div>
        {guess && <LengthIndicator comparison={guess.lengthComparison} />}
    </div>
  );
};