
export type GameHistoryEntry = {
    status: 'won';
    guesses: number;
};

export type GameHistory = {
    [date: string]: GameHistoryEntry;
};

const HISTORY_STORAGE_KEY = 'wordish_game_history';

const loadHistory = (): GameHistory => {
    try {
        const storedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
        return storedHistory ? JSON.parse(storedHistory) : {};
    } catch (error) {
        console.error("Failed to load game history from localStorage", error);
        return {};
    }
};

const saveHistory = (history: GameHistory) => {
    try {
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
        console.error("Failed to save game history to localStorage", error);
    }
};

const recordWin = (date: string, guessCount: number) => {
    const history = loadHistory();
    history[date] = {
        status: 'won',
        guesses: guessCount,
    };
    saveHistory(history);
};

const getHistory = (): GameHistory => {
    return loadHistory();
};

export const gameHistoryService = {
    getHistory,
    recordWin,
};