
import React from 'react';

const KeyItem: React.FC<{ colorClass: string; label: string }> = ({ colorClass, label }) => (
  <div className="flex items-center gap-2">
    <div className={`w-4 h-4 rounded border-2 border-slate-600 ${colorClass}`}></div>
    <span className="text-sm text-slate-300">{label}</span>
  </div>
);

export const ColorKey: React.FC = () => {
  return (
    <div className="flex justify-center items-center gap-4 sm:gap-6 py-2">
      <KeyItem colorClass="bg-violet-500" label="Correct" />
      <KeyItem colorClass="bg-sky-500" label="Present" />
      <KeyItem colorClass="bg-slate-500" label="Absent" />
    </div>
  );
};
