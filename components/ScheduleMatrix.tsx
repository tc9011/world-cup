import React from 'react';
import { Match, Venue } from '../types';
import { format, eachDayOfInterval, isSameDay } from 'date-fns';
import { enUS, zhCN } from 'date-fns/locale';
import { venues, teams } from '../data/worldCupData';
import { useStore } from '../store/useStore';
import { translations, cityNames, teamNames } from '../data/locales';
import clsx from 'clsx';

interface ScheduleMatrixProps {
  matches: Match[];
}

const GROUP_COLORS: Record<string, string> = {
  'A': 'bg-green-500',
  'B': 'bg-red-500',
  'C': 'bg-blue-500',
  'D': 'bg-yellow-500',
  'E': 'bg-purple-500',
  'F': 'bg-cyan-500',
  'G': 'bg-pink-500',
  'H': 'bg-teal-500',
  'I': 'bg-indigo-500',
  'J': 'bg-lime-500',
  'K': 'bg-orange-500',
  'L': 'bg-amber-700',
};

const STAGE_COLORS: Record<string, string> = {
  'Round of 32': 'bg-gray-400',
  'Round of 16': 'bg-gray-500',
  'Quarter-finals': 'bg-gray-600',
  'Semi-finals': 'bg-gray-700',
  'Third place': 'bg-yellow-600',
  'Final': 'bg-yellow-500',
};

export const ScheduleMatrix: React.FC<ScheduleMatrixProps> = ({ matches }) => {
  const { language } = useStore();
  const t = translations[language];
  const dateLocale = language === 'zh' ? zhCN : enUS;
  const dateFormat = language === 'zh' ? 'MMMdo EEE' : 'EEE d MMM';

  // Define date range: June 11 to July 19, 2026
  const startDate = new Date(2026, 5, 11); // June 11
  const endDate = new Date(2026, 6, 19);   // July 19
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  // Group venues by region
  const regions = ['Western', 'Central', 'Eastern'] as const;
  const venuesByRegion = regions.reduce((acc, region) => {
    acc[region] = venues.filter(v => v.region === region);
    return acc;
  }, {} as Record<typeof regions[number], Venue[]>);

  return (
    <div className="overflow-x-auto pb-4 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
      <div className="min-w-[2000px]"> {/* Ensure horizontal scroll */}
        <table className="w-full border-collapse border-spacing-0">
          <thead>
            <tr>
              {/* Region Column Header */}
              <th className="sticky left-0 z-30 bg-gray-100 dark:bg-gray-800 p-2 border-b border-r border-gray-200 dark:border-gray-700 w-10 min-w-10">
              </th>
              {/* Venue Column Header */}
              <th className="sticky left-10 z-30 bg-gray-100 dark:bg-gray-800 p-2 border-b border-r border-gray-200 dark:border-gray-700 min-w-[200px] text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                {t.venueDate}
              </th>
              {days.map(day => (
                <th key={day.toISOString()} className="p-1 border-b border-gray-200 dark:border-gray-700 min-w-10 text-center bg-gray-50 dark:bg-gray-900 align-bottom pb-2 h-32">
                  <div className="flex items-center justify-center h-full w-full">
                    <span className="text-[10px] text-gray-500 font-medium whitespace-nowrap -rotate-90">
                      {format(day, dateFormat, { locale: dateLocale })}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {regions.map(region => {
              const regionVenues = venuesByRegion[region];
              return regionVenues.map((venue, index) => (
                <tr key={venue.id} className="group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  {/* Region Label (RowSpan) */}
                  {index === 0 && (
                    <td 
                      rowSpan={regionVenues.length} 
                      className="sticky left-0 z-20 bg-gray-200 dark:bg-gray-800 border-b border-r border-gray-300 dark:border-gray-600 text-center align-middle p-0"
                    >
                      <div className="h-full w-full flex items-center justify-center">
                        <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest whitespace-nowrap -rotate-90">
                          {t[`${region.toLowerCase()}Region` as keyof typeof t] as string}
                        </span>
                      </div>
                    </td>
                  )}
                  
                  {/* Venue Name */}
                  <td className="sticky left-10 z-10 bg-white dark:bg-gray-900 p-2 border-b border-r border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-600 dark:text-gray-300 group-hover:bg-gray-50 dark:group-hover:bg-gray-800">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-800 dark:text-white uppercase">
                        {language === 'zh' ? (cityNames[venue.city] || venue.city) : venue.city}
                      </span>
                      <span className="text-[10px] text-gray-400 truncate max-w-[180px]">{venue.name}</span>
                    </div>
                  </td>

                  {/* Matches Grid */}
                  {days.map(day => {
                    const dayMatches = matches.filter(m => 
                      m.venueId === venue.id && isSameDay(new Date(m.date), day)
                    );
                    
                    return (
                      <td key={day.toISOString()} className="border-b border-r border-gray-100 dark:border-gray-800 p-1 h-16 relative">
                        {dayMatches.map(match => {
                          const colorClass = match.group 
                            ? GROUP_COLORS[match.group] 
                            : STAGE_COLORS[match.stage] || 'bg-gray-500';
                          
                          const home = teams.find(t => t.id === match.homeTeamId);
                          const away = teams.find(t => t.id === match.awayTeamId);
                          
                          const homeName = language === 'zh' ? (home ? (teamNames[home.code] || home.name) : '待定') : (home?.name || 'TBD');
                          const awayName = language === 'zh' ? (away ? (teamNames[away.code] || away.name) : '待定') : (away?.name || 'TBD');
                          const stageName = match.group ? `${t.group} ${match.group}` : match.stage;

                          return (
                            <div 
                              key={match.id}
                              className={clsx(
                                "w-full h-full rounded shadow-sm flex flex-col items-center justify-center text-[10px] text-white font-bold p-0.5 cursor-pointer hover:scale-110 transition-transform z-0 hover:z-10",
                                colorClass
                              )}
                              title={`${stageName} - ${homeName} vs ${awayName}`}
                            >
                              <span>{match.id.toUpperCase()}</span>
                              {match.group && <span className="text-[8px] opacity-90">{match.group}</span>}
                            </div>
                          );
                        })}
                      </td>
                    );
                  })}
                </tr>
              ));
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
