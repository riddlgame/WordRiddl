
export enum LetterState {
  Correct, // Green
  Present, // Yellow
  Absent,  // Grey
  TBD,     // Not yet guessed
}

export enum GameStatus {
  Playing,
  Won,
}

export enum LengthComparison {
    Longer = 'longer',
    Shorter = 'shorter',
    Equal = 'equal'
}

export interface GuessResult {
  word: string;
  letters: { char: string; state: LetterState }[];
  lengthComparison: LengthComparison;
  isWin?: boolean;
}

export type KeyboardStatus = { [key: string]: LetterState };

export type ToastMessage = { 
  message: string; 
  type: 'error' | 'info' 
};