import React from 'react';
import { Calendar } from 'lucide-react';

interface GameHistoryFilterProps {
  selectedDate: string;
  dates: string[];
  onDateChange: (date: string) => void;
}

function GameHistoryFilter({ selectedDate, dates, onDateChange }: GameHistoryFilterProps) {
  return (
    <div className="bg-white/10 p-4 rounded-lg">
      <div className="flex items-center gap-2">
        <Calendar size={20} />
        <select
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          className="bg-white/10 rounded px-3 py-1 flex-1"
        >
          <option value="">All Dates</option>
          {dates.map(date => (
            <option key={date} value={date}>{date}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default GameHistoryFilter;