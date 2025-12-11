import React, { useState } from 'react';
import { Match } from '../types';
import { teams, venues } from '../data/worldCupData';
import { useStore } from '../store/useStore';
import { translations, teamNames, cityNames } from '../data/locales';
import { format } from 'date-fns';
import { enUS, zhCN } from 'date-fns/locale';
import clsx from 'clsx';
import { MatchDetailModal } from './MatchDetailModal';

interface BracketViewProps {
  matches: Match[];
}

export const BracketView: React.FC<BracketViewProps> = ({ matches }) => {
  const { language } = useStore();
  const t = translations[language];
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [modalPosition, setModalPosition] = useState<{ x: number; y: number } | null>(null);

  const handleMatchClick = (match: Match, e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setModalPosition({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    });
    setSelectedMatch(match);
  };

  // Filter matches by stage
  const r32 = matches.filter(m => m.stage === 'Round of 32');
  const r16 = matches.filter(m => m.stage === 'Round of 16');
  const qf = matches.filter(m => m.stage === 'Quarter-finals');
  const sf = matches.filter(m => m.stage === 'Semi-finals');
  const final = matches.find(m => m.stage === 'Final');
  const thirdPlace = matches.find(m => m.stage === 'Third place');

  // Split into Left/Right brackets
  const leftR32 = r32.slice(0, 8);
  const rightR32 = r32.slice(8, 16);

  const leftR16 = r16.slice(0, 4);
  const rightR16 = r16.slice(4, 8);

  const leftQF = qf.slice(0, 2);
  const rightQF = qf.slice(2, 4);

  const leftSF = sf[0];
  const rightSF = sf[1];

  return (
    <div className="overflow-x-auto pb-8 relative">
      <div className="min-w-[2050px] flex justify-center p-4">
        <div className="flex gap-4">
          {/* Left Bracket */}
          <div className="flex gap-4">
            <Column matches={leftR32} title={t.stages['Round of 32']} onMatchClick={handleMatchClick} />
            <Column matches={leftR16} title={t.stages['Round of 16']} spacer onMatchClick={handleMatchClick} />
            <Column matches={leftQF} title={t.stages['Quarter-finals']} spacer onMatchClick={handleMatchClick} />
            <Column matches={leftSF ? [leftSF] : []} title={t.stages['Semi-finals']} spacer onMatchClick={handleMatchClick} />
          </div>

          {/* Center (Finals) */}
          <div className="flex flex-col justify-center items-center gap-8 w-64 pt-20">
            <div className="flex flex-col items-center gap-2 w-full">
              <h3 className="text-sm font-bold text-yellow-600 dark:text-yellow-500 uppercase tracking-wider">{t.stages['Final']}</h3>
              {final && <MatchCard match={final} isFinal onMatchClick={handleMatchClick} />}
            </div>

            <div className="w-px h-16 bg-gray-300 dark:bg-gray-700"></div>

            <div className="flex flex-col items-center gap-2 w-full">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t.stages['Third place']}</h3>
              {thirdPlace && <MatchCard match={thirdPlace} onMatchClick={handleMatchClick} />}
            </div>
          </div>

          {/* Right Bracket */}
          <div className="flex gap-4 flex-row-reverse">
            <Column matches={rightR32} title={t.stages['Round of 32']} onMatchClick={handleMatchClick} />
            <Column matches={rightR16} title={t.stages['Round of 16']} spacer onMatchClick={handleMatchClick} />
            <Column matches={rightQF} title={t.stages['Quarter-finals']} spacer onMatchClick={handleMatchClick} />
            <Column matches={rightSF ? [rightSF] : []} title={t.stages['Semi-finals']} spacer onMatchClick={handleMatchClick} />
          </div>
        </div>
      </div>

      {selectedMatch && (
        <MatchDetailModal
          match={selectedMatch}
          homeTeam={teams.find(t => t.id === selectedMatch.homeTeamId)}
          awayTeam={teams.find(t => t.id === selectedMatch.awayTeamId)}
          venue={venues.find(v => v.id === selectedMatch.venueId)}
          position={modalPosition}
          onClose={() => setSelectedMatch(null)}
        />
      )}
    </div>
  );
};

const Column: React.FC<{ 
  matches: Match[]; 
  title: string; 
  spacer?: boolean;
  onMatchClick: (match: Match, e: React.MouseEvent) => void;
}> = ({ matches, title, spacer, onMatchClick }) => {
  return (
    <div className="flex flex-col w-48">
      <h3 className="text-xs font-bold text-gray-500 uppercase text-center mb-4 h-6">{title}</h3>
      <div className={clsx("flex flex-col justify-around flex-1", spacer && "py-8")}>
        {matches.map(match => (
          <MatchCard key={match.id} match={match} onMatchClick={onMatchClick} />
        ))}
      </div>
    </div>
  );
};

const MatchCard: React.FC<{ 
  match: Match; 
  isFinal?: boolean;
  onMatchClick: (match: Match, e: React.MouseEvent) => void;
}> = ({ match, isFinal, onMatchClick }) => {
  const { language, timezoneMode } = useStore();
  const dateLocale = language === 'zh' ? zhCN : enUS;

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

  const displayDate = getDisplayDate(new Date(match.date), match.venueId);

  const home = teams.find(t => t.id === match.homeTeamId);
  const away = teams.find(t => t.id === match.awayTeamId);

  const homeName = language === 'zh' ? (home ? (teamNames[home.code] || home.name) : '待定') : (home?.name || 'TBD');
  const awayName = language === 'zh' ? (away ? (teamNames[away.code] || away.name) : '待定') : (away?.name || 'TBD');

  const venue = venues.find(v => v.id === match.venueId);
  const venueName = language === 'zh' ? (venue ? (cityNames[venue.city] || venue.city) : '') : (venue?.city || '');

  const showScore = match.status === 'finished' || match.status === 'live';
  const showPenalties = showScore && match.homePenaltyScore !== null && match.homePenaltyScore !== undefined && match.awayPenaltyScore !== null && match.awayPenaltyScore !== undefined;

  return (
    <div 
      onClick={(e) => onMatchClick(match, e)}
      className={clsx(
        "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-700/50 p-2 shadow-sm relative my-2 transition-all hover:scale-105 hover:shadow-md hover:bg-white dark:hover:bg-gray-800 cursor-pointer",
        isFinal ? "border-yellow-400 dark:border-yellow-600 shadow-lg scale-110 ring-2 ring-yellow-400/20" : ""
      )}
    >
      <div className="text-[10px] text-gray-400 mb-1 flex justify-between">
        <span>{match.id.toUpperCase()}</span>
        <span>{format(displayDate, 'MMM d', { locale: dateLocale })}</span>
      </div>
      <div className="flex flex-col gap-1 mb-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="text-sm">{home?.flag || '🏳️'}</span>
            <span className="text-xs font-medium truncate text-gray-900 dark:text-gray-100">{homeName}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs font-bold bg-gray-100/50 dark:bg-gray-700/50 px-1.5 rounded text-gray-600 dark:text-gray-300">
              {showScore && match.homeScore !== null && match.homeScore !== undefined ? match.homeScore : '-'}
            </span>
            {showPenalties && <span className="text-[10px] text-gray-500">({match.homePenaltyScore})</span>}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="text-sm">{away?.flag || '🏳️'}</span>
            <span className="text-xs font-medium truncate text-gray-900 dark:text-gray-100">{awayName}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs font-bold bg-gray-100/50 dark:bg-gray-700/50 px-1.5 rounded text-gray-600 dark:text-gray-300">
              {showScore && match.awayScore !== null && match.awayScore !== undefined ? match.awayScore : '-'}
            </span>
            {showPenalties && <span className="text-[10px] text-gray-500">({match.awayPenaltyScore})</span>}
          </div>
        </div>
      </div>
      
      <div className="text-[9px] text-gray-400 flex items-center pt-1 border-t border-gray-100 dark:border-gray-700/50">
        <span className="mr-1">📍</span>
        <span className="truncate">{venueName}</span>
      </div>

      {/* Connector lines would go here ideally, but simplified for now */}
    </div>
  );
};
