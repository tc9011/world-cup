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
  'A': 'bg-[#90C966] !text-black',
  'B': 'bg-[#ED334C]',
  'C': 'bg-[#FBF17D] !text-black',
  'D': 'bg-[#0077C0]',
  'E': 'bg-[#F68F2E]',
  'F': 'bg-[#008368]',
  'G': 'bg-[#B0A9C3] !text-black',
  'H': 'bg-[#71CED4]',
  'I': 'bg-[#473988]',
  'J': 'bg-[#F7A894] !text-black',
  'K': 'bg-[#E93778]',
  'L': 'bg-[#8B1639]',
};

const REGION_COLORS: Record<string, string> = {
  'Western': 'bg-[#8FD6D6] !text-black dark:bg-[#8FD6D6] dark:!text-black',
  'Central': 'bg-[#9BCA65] !text-black dark:bg-[#9BCA65] dark:!text-black',
  'Eastern': 'bg-[#F59683] !text-black dark:bg-[#F59683] dark:!text-black',
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
  const startDate = new Date(matches[0].date); // June 11
  const endDate = new Date(matches[matches.length - 1].date);   // July 19
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  // Group venues by region
  const regions = ['Western', 'Central', 'Eastern'] as const;
  const venuesByRegion = regions.reduce((acc, region) => {
    acc[region] = venues.filter(v => v.region === region);
    return acc;
  }, {} as Record<typeof regions[number], Venue[]>);

  return (
    <div className="overflow-x-auto pb-4 rounded-xl">
      <div className="min-w-[2000px]"> {/* Ensure horizontal scroll */}
        <table className="w-full border-collapse border-spacing-0">
          <thead>
            <tr>
              {/* Region Column Header */}
              <th
                className="sticky left-0 z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md p-2 border-b border-r border-gray-200/50 dark:border-gray-700/50 rounded-tl-xl shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]"
                style={{ width: '40px', minWidth: '40px', maxWidth: '40px' }}
              >
              </th>
              {/* Venue Column Header */}
              <th
                className="sticky left-10 z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md p-2 border-b border-r border-gray-200/50 dark:border-gray-700/50 text-left text-xs font-bold text-gray-500 uppercase tracking-wider shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]"
                style={{ minWidth: '200px' }}
              >
                {t.venueDate}
              </th>
              {days.map(day => (
                <th key={day.toISOString()} className="p-1 border-b border-r border-gray-300 dark:border-gray-600 min-w-10 text-center bg-white/50 dark:bg-gray-900/50 align-bottom pb-2 h-32">
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
                <tr key={venue.id} className="group hover:bg-white/30 dark:hover:bg-gray-800/30 transition-colors">
                  {/* Region Label (RowSpan) */}
                  {index === 0 && (
                    <td
                      rowSpan={regionVenues.length}
                      className={clsx(
                        "sticky left-0 z-20 backdrop-blur-md border-b border-r border-gray-300 dark:border-gray-600 text-center align-middle p-0 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]",
                        REGION_COLORS[region]
                      )}
                      style={{ width: '40px', minWidth: '40px', maxWidth: '40px' }}
                    >
                      <div className="h-full w-full flex items-center justify-center">
                        <span className="text-xs font-bold uppercase tracking-widest whitespace-nowrap -rotate-90">
                          {t[`${region.toLowerCase()}Region` as keyof typeof t] as string}
                        </span>
                      </div>
                    </td>
                  )}

                  {/* Venue Name */}
                  <td
                    className={clsx(
                      "sticky left-10 z-10 backdrop-blur-md p-2 border-b border-r border-gray-300 dark:border-gray-600 text-xs font-medium shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]",
                      REGION_COLORS[region],
                      "group-hover:brightness-95 transition-all"
                    )}
                    style={{ minWidth: '200px' }}
                  >
                    <div className="flex flex-col">
                      <span className="font-bold uppercase opacity-90">
                        {language === 'zh' ? (cityNames[venue.city] || venue.city) : venue.city}
                      </span>
                      <span className="text-[10px] opacity-75 truncate max-w-[180px]">{venue.name}</span>
                    </div>
                  </td>

                  {/* Matches Grid */}
                  {days.map(day => {
                    const dayMatches = matches.filter(m =>
                      m.venueId === venue.id && isSameDay(new Date(m.date), day)
                    );

                    return (
                      <td key={day.toISOString()} className="border-b border-r border-gray-300 dark:border-gray-600 p-1 h-24 relative">
                        {dayMatches.map(match => {
                          const colorClass = match.group
                            ? GROUP_COLORS[match.group]
                            : STAGE_COLORS[match.stage] || 'bg-gray-500';

                          const home = teams.find(t => t.id === match.homeTeamId);
                          const away = teams.find(t => t.id === match.awayTeamId);

                          const homeName = language === 'zh'
                            ? (home ? (teamNames[home.code] || home.name) : (match.homeTeamId.match(/^(W|L|[123][A-L])/) ? match.homeTeamId : '待定'))
                            : (home?.name || (match.homeTeamId.match(/^(W|L|[123][A-L])/) ? match.homeTeamId : 'TBD'));
                          const awayName = language === 'zh'
                            ? (away ? (teamNames[away.code] || away.name) : (match.awayTeamId.match(/^(W|L|[123][A-L])/) ? match.awayTeamId : '待定'))
                            : (away?.name || (match.awayTeamId.match(/^(W|L|[123][A-L])/) ? match.awayTeamId : 'TBD'));
                          const stageName = match.group ? `${t.group} ${match.group}` : match.stage;

                          const homeCode = home?.code || (match.homeTeamId.match(/^(W|L|[123][A-L])/) ? match.homeTeamId : (language === 'zh' ? '?' : 'TBD'));
                          const awayCode = away?.code || (match.awayTeamId.match(/^(W|L|[123][A-L])/) ? match.awayTeamId : (language === 'zh' ? '?' : 'TBD'));
                          const matchTime = format(new Date(match.date), 'HH:mm');
                          const matchIdDisplay = match.id.replace(/^m/, '');

                          return (
                            <div
                              key={match.id}
                              className={clsx(
                                "w-full h-full rounded shadow-sm relative text-white font-bold p-1 cursor-pointer hover:scale-110 transition-transform z-0 hover:z-10 overflow-hidden",
                                colorClass
                              )}
                              title={`${stageName} - ${homeName} vs ${awayName} (${matchTime})`}
                            >
                              {/* Top Row: ID and Time */}
                              <div className="absolute top-1 left-1 text-[10px] leading-none font-mono">{matchIdDisplay}</div>
                              <div className="absolute top-1 right-1 text-[10px] leading-none font-mono">{matchTime}</div>

                              {/* Center: Teams */}
                              <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
                                <span className="text-[12px] leading-none tracking-wider uppercase">{homeCode}</span>
                                <span className="text-[8px] leading-none opacity-75 my-0.5">vs</span>
                                <span className="text-[12px] leading-none tracking-wider uppercase">{awayCode}</span>
                              </div>

                              {/* Bottom: Group */}
                              {match.group && (
                                <div className="absolute bottom-1 left-0 right-0 text-center">
                                  <span className="text-[10px] leading-none opacity-90 font-mono">{match.group}</span>
                                </div>
                              )}
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
