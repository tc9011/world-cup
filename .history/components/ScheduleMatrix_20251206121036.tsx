import React from 'react';
import { Match, Venue } from '../types';
import { format, eachDayOfInterval, isSameDay, addDays } from 'date-fns';
import { venues, teams } from '../data/worldCupData';
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
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="sticky left-0 z-20 bg-gray-100 dark:bg-gray-800 p-2 border-b border-r border-gray-200 dark:border-gray-700 min-w-[200px] text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Venue / Date
              </th>
              {days.map(day => (
                <th key={day.toISOString()} className="p-1 border-b border-gray-200 dark:border-gray-700 min-w-[40px] text-center bg-gray-50 dark:bg-gray-900">
                  <div className="text-[10px] text-gray-400 font-medium writing-vertical-rl transform rotate-180 h-24 flex items-center justify-center">
                    {format(day, 'EEE d MMM')}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {regions.map(region => (
              <React.Fragment key={region}>
                {/* Region Header */}
                <tr>
                  <td className="sticky left-0 z-10 bg-gray-200 dark:bg-gray-800 p-2 border-b border-r border-gray-300 dark:border-gray-600 font-bold text-xs text-gray-700 dark:text-gray-300 uppercase writing-mode-vertical">
                    <div className="flex items-center h-full">
                      <span className="transform -rotate-90 origin-left translate-y-full w-full block whitespace-nowrap pl-4">
                        {region} Region
                      </span>
                    </div>
                  </td>
                  <td colSpan={days.length} className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-2"></td>
                </tr>
                
                {venuesByRegion[region].map(venue => (
                  <tr key={venue.id} className="group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="sticky left-0 z-10 bg-white dark:bg-gray-900 p-2 border-b border-r border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-600 dark:text-gray-300 group-hover:bg-gray-50 dark:group-hover:bg-gray-800">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-800 dark:text-white uppercase">{venue.city}</span>
                        <span className="text-[10px] text-gray-400 truncate max-w-[180px]">{venue.name}</span>
                      </div>
                    </td>
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

                            return (
                              <div 
                                key={match.id}
                                className={clsx(
                                  "w-full h-full rounded shadow-sm flex flex-col items-center justify-center text-[10px] text-white font-bold p-0.5 cursor-pointer hover:scale-110 transition-transform z-0 hover:z-10",
                                  colorClass
                                )}
                                title={`${match.stage} - ${home?.name || 'TBD'} vs ${away?.name || 'TBD'}`}
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
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
