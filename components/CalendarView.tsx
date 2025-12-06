import React from 'react';
import { Match } from '../types';
import { format, endOfMonth, eachDayOfInterval, isSameDay, getDay, startOfWeek, addDays } from 'date-fns';
import { enUS, zhCN } from 'date-fns/locale';
import { teams, venues } from '../data/worldCupData';
import { useStore } from '../store/useStore';
import { teamNames, cityNames } from '../data/locales';

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
  const { language } = useStore();
  const dateLocale = language === 'zh' ? zhCN : enUS;
  
  const monthEnd = endOfMonth(monthStart);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDay = getDay(monthStart); // 0 = Sunday

  // Create empty slots for days before the 1st of the month
  const emptySlots = Array(startDay).fill(null);

  // Generate weekdays based on locale
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 0 });
  const weekDays = Array.from({ length: 7 }).map((_, i) => 
    format(addDays(weekStart, i), 'EEE', { locale: dateLocale })
  );

  return (
    <div className="bg-black/80 backdrop-blur-sm rounded-xl shadow-lg border border-yellow-500/30 overflow-hidden">
      <div className="p-4 bg-black/70 border-b border-yellow-500/30">
        <h3 className="text-xl font-bold text-yellow-400">
          {format(monthStart, language === 'zh' ? 'yyyy年 MMMM' : 'MMMM yyyy', { locale: dateLocale })}
        </h3>
      </div>
      
      <div className="grid grid-cols-7 text-center border-b border-yellow-500/30 bg-black/50">
        {weekDays.map(day => (
          <div key={day} className="py-2 text-sm font-medium text-yellow-500/70">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {emptySlots.map((_, i) => (
          <div key={`empty-${i}`} className="h-32 border-b border-r border-yellow-500/30 bg-black/30" />
        ))}
        
        {days.map(day => {
          const dayMatches = matches.filter(m => isSameDay(new Date(m.date), day));
          return (
            <div key={day.toISOString()} className="h-32 border-b border-r border-yellow-500/30 p-1 relative group hover:bg-yellow-500/10 transition-colors bg-black/30">
              <div className={`text-sm font-medium mb-1 ${dayMatches.length > 0 ? 'text-yellow-400' : 'text-yellow-500/50'}`}>
                {format(day, 'd')}
              </div>
              
              <div className="space-y-1 overflow-y-auto max-h-[calc(100%-1.5rem)] no-scrollbar">
                {dayMatches.map(match => {
                  const home = teams.find(t => t.id === match.homeTeamId);
                  const away = teams.find(t => t.id === match.awayTeamId);
                  
                  const homeName = language === 'zh' ? (home ? (teamNames[home.code] || home.code) : '待定') : (home?.code || 'TBD');
                  const awayName = language === 'zh' ? (away ? (teamNames[away.code] || away.code) : '待定') : (away?.code || 'TBD');
                  
                  const venue = venues.find(v => v.id === match.venueId);
                  const venueName = language === 'zh' ? (venue ? (cityNames[venue.city] || venue.city) : '') : (venue?.city || '');

                  return (
                    <div key={match.id} className="text-[10px] bg-black/60 backdrop-blur-sm p-1 rounded shadow-md border border-yellow-500/30 flex flex-col gap-0.5 group/match hover:bg-yellow-500/10 hover:border-yellow-500/50 transition-colors cursor-pointer">
                      <div className="truncate flex items-center">
                        <span className="font-bold text-yellow-400 mr-1">{format(new Date(match.date), 'HH:mm')}</span>
                        <span className="text-yellow-500/50 mr-1">|</span>
                        <span title={`${home?.name || 'TBD'} vs ${away?.name || 'TBD'}`} className="font-medium text-yellow-400">
                          {homeName} vs {awayName}
                        </span>
                      </div>
                      <div className="text-[9px] text-yellow-500/70 truncate flex items-center">
                        <span className="mr-1">📍</span>
                        {venueName}
                      </div>
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
