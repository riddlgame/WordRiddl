
import React, { useState, useEffect, useMemo, FormEvent } from 'react';
import { getAllWords, deleteWordForDate, saveAllWords } from '../services/wordService';
import { dictionaryService } from '../dictionary';
import { ToastContainer } from '../components/Toast';
import { ToastMessage } from '../types';
import { getFormattedDate, parseDMY, convertToInputFormat, convertFromInputFormat } from '../utils/dateUtils';

interface AdminPageProps {
  onLogout: () => void;
}

const AdminHeader: React.FC<{ onLogout: () => void }> = ({ onLogout }) => (
  <header className="flex items-center justify-between p-4 border-b border-slate-700">
    <h1 className="text-2xl font-bold">Admin Panel</h1>
    <button
      onClick={onLogout}
      className="px-4 py-2 bg-red-600 rounded-md hover:bg-red-700 transition-colors"
    >
      Logout
    </button>
  </header>
);

export const AdminPage: React.FC<AdminPageProps> = ({ onLogout }) => {
  const [words, setWords] = useState<{ [date: string]: string }>({});
  const [editingWords, setEditingWords] = useState<{ [date: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [dictSuggestingFor, setDictSuggestingFor] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [newDate, setNewDate] = useState(getFormattedDate(new Date()));
  const [newWord, setNewWord] = useState('');

  const isDirty = useMemo(() => {
    return JSON.stringify(words) !== JSON.stringify(editingWords);
  }, [words, editingWords]);

  const refreshWords = () => {
    const allWords = getAllWords();
    setWords(allWords);
    setEditingWords(allWords);
  }

  useEffect(() => {
    refreshWords();
    setLoading(false);
  }, []);
  
  const showToast = (message: string, type: 'error' | 'info' = 'info', duration = 3000) => {
      setToast({ message, type });
      setTimeout(() => setToast(null), duration);
  };

  const handleInputChange = (date: string, value: string) => {
    setEditingWords(prev => ({ ...prev, [date]: value }));
  };
  
  const isWordDuplicate = (word: string, originalDate?: string): boolean => {
    const wordLower = word.toLowerCase();
    for(const date in editingWords) {
        if (originalDate && date === originalDate) continue;
        if (editingWords[date].toLowerCase() === wordLower) {
            return true;
        }
    }
    return false;
  }

  const handleSaveAll = () => {
    for (const date in editingWords) {
      if (!editingWords[date] || !editingWords[date].trim()) {
        showToast(`Word for ${date} cannot be empty.`, 'error');
        return;
      }
    }

    const wordValues = Object.values(editingWords).map(w => (w as string).trim().toLowerCase());
    const uniqueWordValues = new Set(wordValues);
    if (wordValues.length !== uniqueWordValues.size) {
      const counts = wordValues.reduce((acc: { [key: string]: number }, word) => {
          acc[word] = (acc[word] || 0) + 1;
          return acc;
      }, {});
      const duplicates = Object.entries(counts).filter(([_, count]) => (count as number) > 1).map(([word, _]) => word);
      showToast(`Duplicate words found: ${duplicates.join(', ')}. Please use unique words.`, 'error', 5000);
      return;
    }

    const wordsToSave: { [date: string]: string } = {};
    for (const date in editingWords) {
      wordsToSave[date] = editingWords[date].trim().toLowerCase();
    }
    
    saveAllWords(wordsToSave);
    refreshWords(); 
    showToast('All changes have been saved!', 'info');
  };

  const handleDiscard = () => {
    setEditingWords(words);
    showToast('Changes discarded.', 'info');
  };

  const handleDelete = (dateToDelete: string) => {
    if (window.confirm(`Are you sure you want to delete the word for ${dateToDelete}?`)) {
      deleteWordForDate(dateToDelete);
      refreshWords(); 
      showToast(`Word for ${dateToDelete} deleted.`, 'info');
    }
  };

  const handleAddNewWord = (e: FormEvent) => {
      e.preventDefault();
      if (!newDate || !newWord.trim()) {
          showToast('Both date and word are required.', 'error');
          return;
      }
       if (editingWords[newDate]) {
          showToast(`A word for ${newDate} already exists.`, 'error');
          return;
      }
      if (isWordDuplicate(newWord)) {
          showToast(`Word "${newWord}" is already in use.`, 'error');
          return;
      }
      
      const newEditingWords = {...editingWords, [newDate]: newWord.trim().toLowerCase()};
      setEditingWords(newEditingWords);

      showToast(`Staged new word for ${newDate}.`, 'info');
      setNewWord(''); 
  }

  const handleDictSuggest = async (date: string) => {
      setDictSuggestingFor(date);
      try {
          const suggested = await dictionaryService.getRandomWord();
          if (suggested) {
              if (isWordDuplicate(suggested, date)) {
                  showToast(`Dictionary suggested "${suggested}", but it's already in use. Try again!`, 'info');
              } else {
                  if (date === 'new') setNewWord(suggested);
                  else handleInputChange(date, suggested);
              }
          } else {
              showToast('Could not suggest a word from dictionary.', 'error');
          }
      } catch (error: any) {
          console.error(error);
          showToast('Failed to get suggestion from dictionary.', 'error');
      } finally {
          setDictSuggestingFor(null);
      }
  };

  const sortedDates = Object.keys(editingWords).sort((a, b) => parseDMY(b).getTime() - parseDMY(a).getTime());

  return (
    <div className="flex flex-col h-screen">
      <ToastContainer toast={toast} />
      <AdminHeader onLogout={onLogout} />
      <main className="flex-1 p-4 overflow-y-auto">
        <div className="max-w-3xl mx-auto pb-20">
          <div className="bg-slate-800 p-4 rounded-lg mb-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-3">Add New Word</h3>
              <form onSubmit={handleAddNewWord} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                   <input
                    type="date"
                    value={convertToInputFormat(newDate)}
                    onChange={(e) => setNewDate(convertFromInputFormat(e.target.value))}
                    className="bg-slate-700 border border-slate-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    style={{ colorScheme: 'dark' }}
                  />
                  <div className="flex-grow flex gap-2">
                    <input
                      type="text"
                      placeholder="New mystery word"
                      value={newWord}
                      onChange={(e) => setNewWord(e.target.value)}
                      className="flex-grow bg-slate-700 border border-slate-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button 
                        type="button"
                        onClick={() => handleDictSuggest('new')}
                        disabled={dictSuggestingFor === 'new'}
                        className="px-3 py-2 bg-slate-600 rounded-md hover:bg-slate-500 transition-colors text-xs font-bold whitespace-nowrap"
                        title="Suggest from Dictionary"
                    >
                        {dictSuggestingFor === 'new' ? '...' : 'Suggest'}
                    </button>
                  </div>
                  <button type="submit" className="px-6 py-2 bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors font-bold whitespace-nowrap">
                      Add Word
                  </button>
              </form>
          </div>

          <h2 className="text-xl font-bold mb-4 px-1">Manage Existing Words</h2>
          {loading ? (
            <p className="p-4">Loading words...</p>
          ) : (
            <div className="space-y-4">
              {sortedDates.map(date => (
                <div key={date} className="bg-slate-800 p-4 rounded-lg flex items-center gap-4 flex-wrap shadow-md border border-slate-700">
                  <span className="font-mono font-bold w-24">{date}</span>
                  <input
                    type="text"
                    value={editingWords[date] || ''}
                    onChange={(e) => handleInputChange(date, e.target.value)}
                    className="flex-grow min-w-[150px] bg-slate-700 border border-slate-60