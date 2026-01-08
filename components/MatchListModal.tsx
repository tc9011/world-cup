'use client';

import React from 'react';
import { createPortal } from 'react-dom';
import { Match } from '../types';
import { useStore } from '../store/useStore';
import { format } from 'date-fns';
import { X, Calendar } from 'lucide-react';
import { translations, teamNames, cityNames } from '../data/locales';
import { teams, venues } from '../data/worldCupData';

interface MatchListModalProps {
  title: string;
  subtitle?: React.ReactNode;
  matches: Match[];
  timezone?: string;
  onClose: () => void;
  showVenue?: boolean;
}

export const MatchListModal: React.FC<MatchListModalProps> = ({ 
  title, 
  subtitle, 
  matches, 
  timezone, 
  onClose,
  showVenue = false
}) => {
  const { language, timezoneMode } = useStore();
  const t = translations[language];

  // Helper to get display date based on timezone mode
  const getDisplayDate = (date: Date, tz: string | undefined) => {
    if (timezoneMode === 'local' || !tz) return date;

    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      year: 'numeric', month: 'numeric', day: 'numeric',
      hour: 'numeric', minute: 'numeric', second: 'numeric',
      hour12: false
    }).formatToParts(date);

    const part = (type: string) => parseInt(parts.find(p => p.type === type)?.value || '0');
    return new Date(part('year'), part('month') - 1, part('day'), part('hour'), part('minute'), part('second'));
  };

  const getTeam = (id: string) => teams.find(t => t.id === id);

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div
        className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/5 animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-linear-to-r from-blue-600 to-blue-800 p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
          <h3 className="font-bold text-2xl pr-8 leading-tight mb-1">
            {title}
          </h3>
          {subtitle && (
            <div className="flex items-center gap-1.5 text-blue-200 text-sm font-medium mb-2">
              {subtitle}
            </div>
          )}
          <div className="flex items-center gap-4 text-blue-100 text-sm">
            <div className="flex items-center gap-1.5">
              <Calendar size={16} />
              <span>
                {matches.length} {t.matchesCount}
              </span>
            </div>
          </div>
        </div>

        {/* Matches List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-800/50 custom-scrollbar">
          {matches.map((match: Match) => {
            const homeTeam = getTeam(match.homeTeamId);
            const awayTeam = getTeam(match.awayTeamId);
            // Use venue timezone if available, otherwise passed timezone or local
            const venue = venues.find(v => v.id === match.venueId);
            const matchTimezone = showVenue ? venue?.timezone : timezone;
            const date = getDisplayDate(new Date(match.date), matchTimezone);

            const venueName = venue ? venue.name : '';
            const cityName = language === 'zh' ? (venue ? cityNames[venue.city] || venue.city : '') : (venue?.city || '');
            
            const homeName = language === 'zh' ? (homeTeam ? (teamNames[homeTeam.code] || homeTeam.code) : t.tbd) : (homeTeam?.code || t.tbd);
            const awayName = language === 'zh' ? (awayTeam ? (teamNames[awayTeam.code] || awayTeam.code) : t.tbd) : (awayTeam?.code || t.tbd);

            const showPenalties = match.homePenaltyScore != null && match.awayPenaltyScore != null;

            return (
              <div key={match.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all group">
                {/* Date & Stage */}
                <div className="flex justify-between items-center mb-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    <span>{format(date, 'MMM d, HH:mm')}</span>
                  </div>
                  <span className="px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full font-medium text-xs uppercase tracking-wide">
                    {match.stage}
                  </span>
                </div>

                {/* Teams */}
                <div className="flex items-center justify-between gap-4 mb-3">
                  {/* Home */}
                  <div className="flex flex-col items-center flex-1 gap-2">
                    <span className="text-4xl drop-shadow-sm transform group-hover:scale-110 transition-transform duration-300">{homeTeam?.flag || '🏳️'}</span>
                    <span className="font-bold text-base text-gray-900 dark:text-gray-100 text-center leading-tight">
                      {homeName}
                    </span>
                  </div>

                  {/* VS / Score */}
                  <div className="flex flex-col items-center justify-center w-16">
                     <div className={`font-mono font-bold text-lg ${match.status === 'scheduled' ? 'text-gray-300 dark:text-gray-600' : 'text-gray-900 dark:text-white'}`}>
                        {match.status === 'scheduled' ? 'VS' : `${match.homeScore} - ${match.awayScore}`}
                     </div>
                     {showPenalties && (
                       <div className="text-xs font-mono text-gray-500 dark:text-gray-400 mt-1">
                         ({match.homePenaltyScore} - {match.awayPenaltyScore})
                       </div>
                     )}
                     {showPenalties && (
                        <span className="text-[9px] text-gray-400 uppercase mt-0.5">PEN</span>
                     )}
                     {!showPenalties && match.status !== 'scheduled' && (
                        <span className="text-[10px] text-gray-500 uppercase">{match.status}</span>
                     )}
                  </div>

                  {/* Away */}
                  <div className="flex flex-col items-center flex-1 gap-2">
                    <span className="text-4xl drop-shadow-sm transform group-hover:scale-110 transition-transform duration-300">{awayTeam?.flag || '🏳️'}</span>
                    <span className="font-bold text-base text-gray-900 dark:text-gray-100 text-center leading-tight">
                      {awayName}
                    </span>
                  </div>
                </div>

                {/* Venue Info */}
                <div className="pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-center text-xs text-gray-500 dark:text-gray-400">
                    <span className="mr-1">📍</span>
                    <span>{venueName}, {cityName}</span>
                </div>
              </div>
            );
          })}

          {matches.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-500">
              <Calendar size={48} className="mb-3 opacity-50" />
              <p className="text-base italic">
                {t.noMatches}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
