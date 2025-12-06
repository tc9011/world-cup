import React from 'react';
import { Match } from '../types';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, getDay } from 'date-fns';
import { teams } from '../data/worldCupData';

interface CalendarViewProps {
  matches: Match[];
}

export const CalendarView: React.FC<CalendarViewProps> = ({ matches }) => {
  const months = [new Date(2026, 5, 1), new Date(2026, 6, 1)]; // June and July 2026

  return (
    <div className="space-y-8">
      {months.map(monthStart => (
        <MonthGrid key={monthStart.toISOString()} monthStart={monthStart} matches={matches} />
      ))}
    </div>
  );
};

const MonthGrid: React.FC<{ monthStart: Date; matches: Match[] }> = ({ monthStart, matches }) => {
  const monthEnd = endOfMonth(monthStart);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDay = getDay(monthStart); // 0 = Sunday

  // Create empty slots for days before the 1st of the month
  const emptySlots = Array(startDay).fill(null);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">{format(monthStart, 'MMMM yyyy')}</h3>
      </div>
      
      <div className="grid grid-cols-7 text-center border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="py-2 text-sm font-medium text-gray-500 dark:text-gray-400">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {emptySlots.map((_, i) => (
          <div key={`empty-${i}`} className="h-32 border-b border-r border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50" />
        ))}
        
        {days.map(day => {
          const dayMatches = matches.filter(m => isSameDay(new Date(m.date), day));
          return (
            <div key={day.toISOString()} className="h-32 border-b border-r border-gray-100 dark:border-gray-700 p-1 relative group hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
              <div className={`text-sm font-medium mb-1 ${dayMatches.length > 0 ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`}>
                {format(day, 'd')}
              </div>
              
              <div className="space-y-1 overflow-y-auto max-h-[calc(100%-1.5rem)] no-scrollbar">
                {dayMatches.map(match => {
                  const home = teams.find(t => t.id === match.homeTeamId);
                  const away = teams.find(t => t.id === match.awayTeamId);
                  return (
                    <div key={match.id} className="text-[10px] bg-white dark:bg-gray-700 p-1 rounded shadow-sm border border-gray-100 dark:border-gray-600 truncate">
                      <span className="font-bold text-gray-700 dark:text-gray-200">{format(new Date(match.date), 'HH:mm')}</span>
                      <span className="mx-1 text-gray-400">|</span>
                      <span>{home?.code || 'TBD'} vs {away?.code || 'TBD'}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
