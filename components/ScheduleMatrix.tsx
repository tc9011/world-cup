import React from 'react';
import { Match, Venue } from '../types';
import { format, eachDayOfInterval, isSameDay } from 'date-fns';
import { enUS, zhCN } from 'date-fns/locale';
import { venues, teams } from '../data/worldCupData';
import { useStore } from '../store/useStore';
import { translations, cityNames, teamNames } from '../data/locales';
import clsx from 'clsx';
import { MatchDetailModal } from './MatchDetailModal';

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
  const { language, timezoneMode } = useStore();
  const [selectedMatch, setSelectedMatch] = React.useState<Match | null>(null);
  const [modalPosition, setModalPosition] = React.useState<{ x: number; y: number } | null>(null);
  const t = translations[language];
  const dateLocale = language === 'zh' ? zhCN : enUS;
  const dateFormat = language === 'zh' ? 'MMMdo EEE' : 'EEE d MMM';

  // Helper to get display date based on timezone mode
  const getDisplayDate = (date: Date, timezone: string | undefined) => {
    if (timezoneMode === 'local' || !timezone) return date;

    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric', month: 'numeric', day: 'numeric',
      hour: 'numeric', minute: 'numeric', second: 'numeric',
      hour12: false
    }).formatToParts(date);

    const part = (type: string) => parseInt(parts.find(p => p.type === type)?.value || '0');
    return new Date(part('year'), part('month') - 1, part('day'), part('hour'), part('minute'), part('second'));
  };

  // Calculate date range based on displayed dates to ensure all matches are visible in the current timezone mode
  const displayDates = matches.map(m => {
    const venue = venues.find(v => v.id === m.venueId);
    return getDisplayDate(new Date(m.date), venue?.timezone);
  });

  const startDate = new Date(Math.min(...displayDates.map(d => d.getTime())));
  const endDate = new Date(Math.max(...displayDates.map(d => d.getTime())));
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  // Group venues by region
  const regions = ['Western', 'Central', 'Eastern'] as const;
  const venuesByRegion = regions.reduce((acc, region) => {
    acc[region] = venues.filter(v => v.region === region);
    return acc;
  }, {} as Record<typeof regions[number], Venue[]>);

  return (
    <div className="overflow-auto pb-4 rounded-xl max-h-[75vh]">
      <div className="min-w-[2000px]"> {/* Ensure horizontal scroll */}
        <table className="w-full border-collapse border-spacing-0">
          <thead>
            <tr>
              {/* Region Column Header */}
              <th
                className="sticky left-0 top-0 z-50 bg-white/95 dark:bg-black/95 backdrop-blur-md p-2 border-b border-r border-gray-200/50 dark:border-primary/20 rounded-tl-xl shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] w-[30px] min-w-[30px] max-w-[30px] md:w-10 md:min-w-10 md:max-w-10"
              >
              </th>
              {/* Venue Column Header */}
              <th
                className="sticky left-[30px] md:left-10 top-0 z-50 bg-white/95 dark:bg-black/95 backdrop-blur-md p-2 border-b border-r border-gray-200/50 dark:border-primary/20 text-left text-xs font-bold text-gray-500 dark:text-primary/80 uppercase tracking-wider shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] w-[90px] min-w-[90px] max-w-[90px] md:w-40 md:min-w-40 md:max-w-40"
              >
                {t.venueDate}
              </th>
              {days.map(day => (
                <th key={day.toISOString()} className="sticky top-0 z-40 p-1 border-b border-r border-gray-300 dark:border-primary/20 min-w-10 text-center bg-white/95 dark:bg-black/95 backdrop-blur-md align-bottom pb-2 h-24 md:h-32">
                  <div className="flex items-center justify-center h-full w-full">
                    <span className="text-[10px] text-gray-500 dark:text-primary/60 font-medium whitespace-nowrap -rotate-90">
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
                        "sticky left-0 z-20 backdrop-blur-md border-b border-r border-gray-300 dark:border-primary/20 text-center align-middle p-0 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] w-[30px] min-w-[30px] max-w-[30px] md:w-10 md:min-w-10 md:max-w-10",
                        REGION_COLORS[region]
                      )}
                    >
                      <div className="h-full w-full flex items-center justify-center">
                        <span className="text-xs font-bold uppercase tracking-widest whitespace-nowrap -rotate-90 text-gray-600 dark:text-gray-800">
                          {t[`${region.toLowerCase()}Region` as keyof typeof t] as string}
                        </span>
                      </div>
                    </td>
                  )}

                  {/* Venue Name */}
                  <td
                    className={clsx(
                      "sticky left-[30px] md:left-10 z-10 backdrop-blur-md p-2 border-b border-r border-gray-300 dark:border-primary/20 text-xs font-medium shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] w-[90px] min-w-[90px] max-w-[90px] md:w-40 md:min-w-40 md:max-w-40",
                      REGION_COLORS[region],
                      "group-hover:brightness-95 transition-all"
                    )}
                  >
                    <div className="flex flex-col text-white">
                      <span className="font-bold uppercase opacity-90 text-gray-600 dark:text-gray-800">
                        {language === 'zh' ? (cityNames[venue.city] || venue.city) : venue.city}
                      </span>
                      <span className="text-[10px] opacity-75 max-w-20 md:max-w-[140px] text-gray-600 dark:text-gray-800">{venue.name}</span>
                    </div>
                  </td>

                  {/* Matches Grid */}
                  {days.map(day => {
                    const dayMatches = matches.filter(m => {
                      if (m.venueId !== venue.id) return false;
                      const displayDate = getDisplayDate(new Date(m.date), venue.timezone);
                      return isSameDay(displayDate, day);
                    });

                    return (
                      <td key={day.toISOString()} className="border-b border-r border-gray-300 dark:border-primary/20 p-1 h-20 md:h-24 relative">
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

                          const displayDate = getDisplayDate(new Date(match.date), venue.timezone);
                          const matchTime = format(displayDate, 'HH:mm');
                          const matchIdDisplay = match.id.replace(/^m/, '');

                          return (
                            <div
                              key={match.id}
                              onClick={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                setModalPosition({
                                  x: rect.left + rect.width / 2,
                                  y: rect.top + rect.height / 2
                                });
                                setSelectedMatch(match);
                              }}
                              className={clsx(
                                "w-full h-full rounded shadow-sm relative text-white font-bold p-1 cursor-pointer hover:scale-110 transition-transform z-0 hover:z-10 overflow-hidden flex flex-col",
                                colorClass
                              )}
                              title={`${stageName} - ${homeName} vs ${awayName} (${matchTime})`}
                            >
                              {/* Top Row: ID and Time */}
                              <div className="flex justify-between items-center w-full text-[10px] leading-none font-mono mb-0.5">
                                <span>{matchIdDisplay}</span>
                                <span>{matchTime}</span>
                              </div>

                              {/* Center: Teams */}
                              <div className="flex-1 flex flex-col items-center justify-center min-h-0">
                                <span className="text-[12px] leading-none tracking-wider uppercase">{homeCode}</span>
                                <span className="text-[8px] leading-none opacity-75 my-0.5">vs</span>
                                <span className="text-[12px] leading-none tracking-wider uppercase">{awayCode}</span>
                              </div>

                              {/* Bottom: Group */}
                              {match.group && (
                                <div className="text-center mt-0.5">
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

      {selectedMatch && (
        <MatchDetailModal
          match={selectedMatch}
          homeTeam={teams.find(t => t.id === selectedMatch.homeTeamId)}
          awayTeam={teams.find(t => t.id === selectedMatch.awayTeamId)}
          venue={venues.find(v => v.id === selectedMatch.venueId)}
          position={modalPosition}
          onClose={() => {
            setSelectedMatch(null);
            setModalPosition(null);
          }}
        />
      )}
    </div>
  );
};
