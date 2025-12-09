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
  const { language } = useStore();
  if (matches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
        <p className="text-lg font-medium">{language === 'zh' ? '没有找到比赛' : 'No matches found'}</p>
        <p className="text-sm mt-2">{language === 'zh' ? '请尝试调整筛选条件' : 'Try adjusting your filters'}</p>
      </div>
    );
  }

  // Get unique months from matches
  const months = Array.from(new Set(matches.map(m => {
    const date = new Date(m.date);
    return new Date(date.getFullYear(), date.getMonth(), 1).getTime();
  })))
  .sort((a, b) => a - b)
  .map(time => new Date(time));

  return (
    <div className="space-y-8">
      {months.map(monthStart => (
        <MonthGrid key={monthStart.toISOString()} monthStart={monthStart} matches={matches} />
      ))}
    </div>
  );
};

const MonthGrid: React.FC<{ monthStart: Date; matches: Match[] }> = ({ monthStart, matches }) => {
  const { language, timezoneMode } = useStore();
  const dateLocale = language === 'zh' ? zhCN : enUS;

  // Helper to get display date based on timezone mode
  const getDisplayDate = (date: Date, venueId: string) => {
    if (timezoneMode === 'local') return date;
    const venue = venues.find(v => v.id === venueId);
    if (!venue?.timezone) return date;

    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: venue.timezone,
      year: 'numeric', month: 'numeric', day: 'numeric',
      hour: 'numeric', minute: 'numeric', second: 'numeric',
      hour12: false
    }).formatToParts(date);

    const part = (type: string) => parseInt(parts.find(p => p.type === type)?.value || '0');
    return new Date(part('year'), part('month') - 1, part('day'), part('hour'), part('minute'), part('second'));
  };

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
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col h-full">
      <div className="p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky left-0">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">
          {format(monthStart, language === 'zh' ? 'yyyy年 MMMM' : 'MMMM yyyy', { locale: dateLocale })}
        </h3>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[1000px]">
          <div className="grid grid-cols-7 text-center border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            {weekDays.map(day => (
              <div key={day} className="py-3 text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 bg-gray-200 dark:bg-gray-700 gap-px border-b border-gray-200 dark:border-gray-700">
            {emptySlots.map((_, i) => (
              <div key={`empty-${i}`} className="min-h-[180px] bg-gray-50/50 dark:bg-gray-900/50" />
            ))}

            {days.map(day => {
              const dayMatches = matches.filter(m => {
                const displayDate = getDisplayDate(new Date(m.date), m.venueId);
                return isSameDay(displayDate, day);
              });
              const isToday = isSameDay(day, new Date());

              return (
                <div key={day.toISOString()} className={`min-h-[180px] bg-white dark:bg-gray-800 p-2 relative group hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-colors flex flex-col ${isToday ? 'ring-2 ring-inset ring-primary' : ''}`}>
                  <div className={`text-sm font-bold mb-2 flex justify-between items-center ${dayMatches.length > 0 ? 'text-primary dark:text-primary' : 'text-gray-400'}`}>
                    <span className={isToday ? 'bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center' : ''}>
                      {format(day, 'd')}
                    </span>
                    {dayMatches.length > 0 && (
                      <span className="text-xs font-normal bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary px-1.5 py-0.5 rounded-full">
                        {dayMatches.length} {language === 'zh' ? '场' : 'matches'}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 flex-1 overflow-y-auto custom-scrollbar">
                    {dayMatches.map(match => {
                      const home = teams.find(t => t.id === match.homeTeamId);
                      const away = teams.find(t => t.id === match.awayTeamId);

                      const homeName = language === 'zh' ? (home ? (teamNames[home.code] || home.code) : '待定') : (home?.code || 'TBD');
                      const awayName = language === 'zh' ? (away ? (teamNames[away.code] || away.code) : '待定') : (away?.code || 'TBD');

                      const homeFlag = home?.flag || '🏳️';
                      const awayFlag = away?.flag || '🏳️';

                      const venue = venues.find(v => v.id === match.venueId);
                      const venueName = language === 'zh' ? (venue ? (cityNames[venue.city] || venue.city) : '') : (venue?.city || '');

                      const displayDate = getDisplayDate(new Date(match.date), match.venueId);

                      return (
                        <div key={match.id} className="bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600 p-2 hover:shadow-md hover:border-primary/50 dark:hover:border-primary transition-all cursor-pointer group/card">
                          {/* Header: Time & Group */}
                          <div className="flex justify-between items-center text-[10px] text-gray-500 dark:text-gray-400 mb-1.5 border-b border-gray-100 dark:border-gray-600/50 pb-1">
                            <span className="font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-600 px-1 rounded">
                              {format(displayDate, 'HH:mm')}
                            </span>
                            <span>{match.group ? `${language === 'zh' ? '组' : 'Grp'} ${match.group}` : (language === 'zh' ? '淘汰赛' : 'KO')}</span>
                          </div>

                          {/* Teams */}
                          <div className="flex flex-col gap-1 mb-1.5">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5 overflow-hidden flex-1">
                                <span className="text-base">{homeFlag}</span>
                                <span className="text-xs font-bold text-gray-900 dark:text-gray-100 truncate">{homeName}</span>
                              </div>
                              <span className={`text-xs font-mono font-bold ${match.status === 'scheduled' ? 'text-gray-300 dark:text-gray-600' : 'text-gray-900 dark:text-white'}`}>
                                {match.status === 'scheduled' ? '-' : (match.homeScore ?? 0)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5 overflow-hidden flex-1">
                                <span className="text-base">{awayFlag}</span>
                                <span className="text-xs font-bold text-gray-900 dark:text-gray-100 truncate">{awayName}</span>
                              </div>
                              <span className={`text-xs font-mono font-bold ${match.status === 'scheduled' ? 'text-gray-300 dark:text-gray-600' : 'text-gray-900 dark:text-white'}`}>
                                {match.status === 'scheduled' ? '-' : (match.awayScore ?? 0)}
                              </span>
                            </div>
                          </div>

                          {/* Footer: Venue */}
                          <div className="flex items-center text-[9px] text-gray-400 dark:text-gray-500 truncate pt-1 border-t border-gray-50 dark:border-gray-600/30">
                            <span className="mr-1">📍</span>
                            <span className="truncate">{venueName}</span>
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
      </div>
    </div>
  );
};
