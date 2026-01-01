
import { useState, useEffect, useCallback } from 'react';
import { GameStatus, GuessResult, KeyboardStatus, LetterState, ToastMessage } from '../types';
import { MAX_HINTS } from '../constants';
import { apiService } from '../services/apiService';
import { isWordValid } from '../services/geminiService';
import { gameHistoryService } from '../services/gameHistoryService';

export const useGameLogic = (gameDate: string) => {
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.Playing);
  const [guesses, setGuesses] = useState<GuessResult[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [keyboardStatus, setKeyboardStatus] = useState<KeyboardStatus>({});
  const [isRevealing, setIsRevealing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [shakeCurrentRow, setShakeCurrentRow] = useState(false);
  const [hintsRemaining, setHintsRemaining] = useState(MAX_HINTS);

  useEffect(() => {
    // Reset state when gameDate changes (for new games)
    setGameStatus(GameStatus.Playing);
    setGuesses([]);
    setCurrentGuess('');
    setKeyboardStatus({});
    setIsRevealing(false);
    setIsProcessing(false);
    setHintsRemaining(MAX_HINTS);
  }, [gameDate]);

  const showToast = (message: string, type: 'error' | 'info' = 'error', duration = 2000) => {
      setToast({ message, type });
      if(type === 'error' && (message.toLowerCase().includes("invalid") || message.toLowerCase().includes("not in word list"))) {
        setShakeCurrentRow(true);
        setTimeout(() => setShakeCurrentRow(false), 500);
      }
      setTimeout(() => setToast(null), duration);
  };

  const submitGuess = useCallback(async () => {
    if (currentGuess.length === 0 || isRevealing || isProcessing) {
      return;
    }

    setIsProcessing(true);

    const isValid = await isWordValid(currentGuess);
    if (!isValid) {
        showToast("Not in word list.", 'error');
        setIsProcessing(false);
        return;
    }

    setIsRevealing(true);
    const result = await apiService.submitGuess(gameDate, currentGuess);

    setTimeout(() => {
        const newGuesses = [...guesses, result];
        setGuesses(newGuesses);
        
        const newKeyboardStatus = { ...keyboardStatus };
        result.letters.forEach(({ char, state }) => {
            const existingState = newKeyboardStatus[char.toLowerCase()];
            if (existingState === undefined || state < existingState) { // Correct < Present < Absent
                newKeyboardStatus[char.toLowerCase()] = state;
            }
        });
        setKeyboardStatus(newKeyboardStatus);

        setCurrentGuess('');
        setIsRevealing(false);
        setIsProcessing(false);

        if (result.isWin) {
            setGameStatus(GameStatus.Won);
            gameHistoryService.recordWin(gameDate, newGuesses.length);
        }
    }, currentGuess.length * 100);

  }, [currentGuess, gameDate, guesses, keyboardStatus, isRevealing, isProcessing]);
  
  const requestHint = useCallback(async () => {
    if (hintsRemaining <= 0) {
        showToast("No hints remaining.", 'error');
        return;
    }
    if (gameStatus !== GameStatus.Playing) return;

    const hintChar = await apiService.getHint(gameDate, keyboardStatus);

    if (!hintChar) {
        showToast("You've already discovered all the letters!", 'info');
        return;
    }
    
    setKeyboardStatus(prev => ({ ...prev, [hintChar]: LetterState.Present }));
    setHintsRemaining(prev => prev - 1);
    showToast(`Hint: The letter '${hintChar.toUpperCase()}' is in the word.`, 'info', 3000);

  }, [hintsRemaining, gameStatus, gameDate, keyboardStatus]);


  const handleKeyPress = useCallback((key: string) => {
    if (gameStatus !== GameStatus.Playing || isRevealing || isProcessing) return;

    if (key === 'Enter') {
      submitGuess();
    } else if (key === 'Backspace') {
      setCurrentGuess((prev) => prev.slice(0, -1));
    } else if (/^[a-zA-Z]$/.test(key)) {
      setCurrentGuess((prev) => (prev + key.toLowerCase()).slice(0, 15)); // Limit max guess length
    }
  }, [gameStatus, isRevealing, isProcessing, submitGuess]);

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      handleKeyPress(e.key);
    };
    window.addEventListener('keydown', listener);
    return () => {
      window.removeEventListener('keydown', listener);
    };
  }, [handleKeyPress]);

  return {
    gameStatus,
    guesses,
    currentGuess,
    keyboardStatus,
    handleKeyPress,
    isRevealing,
    toast,
    shakeCurrentRow,
    hintsRemaining,
    requestHint,
  };
};