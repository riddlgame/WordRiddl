import React, { useMemo } from 'react';
import { gameHistoryService } from '../../services/gameHistoryService';
import { parseDMY } from '../../utils/dateUtils';

interface ArchiveModalProps {
  onClose: () => void;
  onSelectDate: (date: string) => void;
  availableDates: string[];
  today: string;
}

export const ArchiveModal: React.FC<ArchiveModalProps> = ({ onClose, onSelectDate, availableDates, today }) => {
  const history = gameHistoryService.getHistory();

  const groupedDates = useMemo(() => {
    const groups: { [monthYear: string]: string[] } = {};
    
    availableDates.forEach(dateStr => {
        const dateObj = parseDMY(dateStr);
        // Use a stable key format like YYYY-MM for sorting
        const groupKey = `${dateObj.getFullYear()}-${String(dateObj.getMonth()).padStart(2, '0')}`;
        const monthYear = dateObj.toLocaleString('default', { month: 'long', year: 'numeric' });
        
        if (!groups[monthYear]) {
            groups[monthYear] = [];
        }
        groups[monthYear].push(dateStr);
    });
    
    return groups;
  }, [availableDates]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-slate-800 rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-100">Archive</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-6">
          {Object.entries(groupedDates).map(([monthYear, dates]) => (
            <div key={monthYear}>
              <h3 className="text-xl font-bold text-slate-300 mb-3">{monthYear}</h3>
              <div className="grid grid-cols-5 sm:grid-cols-7 gap-2">
                {/* FIX: Cast `dates` to string[] to resolve `map` does not exist on type `unknown`. */}
                {(dates as string[]).map(date => {
                  const game = history[date];
                  let colorClass = 'bg-slate-700 hover:bg-slate-600'; // Not played
                  if (game?.status === 'won') {
                    colorClass = 'bg-emerald-600 hover:bg-emerald-700';
                  } else if (game?.status === 'lost') {
                    colorClass = 'bg-red-600 hover:bg-red-700';
                  }
                  
                  const day = parseDMY(date).getDate();

                  return (
                    <button
                      key={date}
                      onClick={() => onSelectDate(date)}
                      className={`aspect-square rounded-lg flex items-center justify-center transition-colors font-bold ${colorClass} ${date === today ? 'ring-2 ring-indigo-400' : ''}`}
                    >
                      <span className="text-xl">{day}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
