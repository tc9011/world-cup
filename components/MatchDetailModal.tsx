import React from 'react';
import { Match, Team, Venue } from '../types';
import { useStore } from '../store/useStore';
import { translations, teamNames, cityNames } from '../data/locales';
import { format } from 'date-fns';
import { enUS, zhCN } from 'date-fns/locale';
import { X, MapPin, Calendar, Clock } from 'lucide-react';

interface MatchDetailModalProps {
  match: Match;
  homeTeam?: Team;
  awayTeam?: Team;
  venue?: Venue;
  onClose: () => void;
}

export const MatchDetailModal: React.FC<MatchDetailModalProps> = ({ match, homeTeam, awayTeam, venue, onClose }) => {
  const { language } = useStore();
  const t = translations[language];
  const dateLocale = language === 'zh' ? zhCN : enUS;

  // Helper for team names
  const getTeamName = (team?: Team, placeholderId?: string) => {
    if (team) {
      return language === 'zh' ? (teamNames[team.code] || team.name) : team.name;
    }
    // Handle placeholders like W49, 1A, etc.
    const id = placeholderId || '';
    if (id.match(/^(W|L|[123][A-L])/)) {
      return id;
    }
    return language === 'zh' ? '待定' : 'TBD';
  };

  const homeName = getTeamName(homeTeam, match.homeTeamId);
  const awayName = getTeamName(awayTeam, match.awayTeamId);
  
  const matchDate = new Date(match.date);
  
  // Format dates
  const formatDate = (date: Date, timeZone?: string) => {
    if (!timeZone) return format(date, 'PPP p', { locale: dateLocale });
    
    return new Intl.DateTimeFormat(language === 'zh' ? 'zh-CN' : 'en-US', {
      timeZone,
      dateStyle: 'full',
      timeStyle: 'short',
    }).format(date);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div 
        className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-white/20 dark:border-gray-800 animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header Background with Gradient */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-linear-to-br from-primary/20 to-accent/20 dark:from-primary/10 dark:to-accent/10" />
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white/50 dark:bg-black/50 hover:bg-white dark:hover:bg-black rounded-full backdrop-blur-md transition-colors z-10"
        >
          <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>

        <div className="relative pt-8 px-6 pb-8">
          {/* Match Info Badge */}
          <div className="flex justify-center mb-6">
            <span className="px-4 py-1.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-full text-sm font-bold text-primary shadow-sm border border-primary/10">
              Match {match.id.replace(/^m/, '')} • {match.group ? `${t.group} ${match.group}` : t.stages[match.stage] || match.stage}
            </span>
          </div>

          {/* Teams Scoreboard */}
          <div className="flex items-center justify-between mb-8">
            {/* Home Team */}
            <div className="flex flex-col items-center w-1/3 text-center space-y-3">
              <div className="text-6xl shadow-sm transform transition-transform hover:scale-110 duration-300">
                {homeTeam?.flag || '⚽'}
              </div>
              <h3 className="font-bold text-lg md:text-xl text-gray-900 dark:text-white leading-tight">
                {homeName}
              </h3>
            </div>

            {/* VS / Score */}
            <div className="flex flex-col items-center justify-center w-1/3 relative z-10">
              {match.status === 'scheduled' ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="text-3xl font-black text-gray-300 dark:text-gray-600">VS</div>
                  <div className="flex items-center gap-3 px-4 py-1 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50">
                    <span className="w-6 text-center text-xl font-mono text-gray-400">-</span>
                    <span className="text-gray-300">:</span>
                    <span className="w-6 text-center text-xl font-mono text-gray-400">-</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center animate-in zoom-in-50 duration-300">
                  <div className="flex items-center gap-3 text-5xl font-black text-gray-900 dark:text-white tabular-nums">
                    <span>{match.homeScore ?? 0}</span>
                    <span className="text-gray-300 dark:text-gray-600 text-3xl">:</span>
                    <span>{match.awayScore ?? 0}</span>
                  </div>
                  <span className="mt-2 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest bg-primary/10 text-primary rounded-full">
                    {match.status === 'live' ? 'Live' : 'Full Time'}
                  </span>
                </div>
              )}
            </div>

            {/* Away Team */}
            <div className="flex flex-col items-center w-1/3 text-center space-y-3">
              <div className="text-6xl shadow-sm transform transition-transform hover:scale-110 duration-300">
                {awayTeam?.flag || '⚽'}
              </div>
              <h3 className="font-bold text-lg md:text-xl text-gray-900 dark:text-white leading-tight">
                {awayName}
              </h3>
            </div>
          </div>

          {/* Details Grid */}
          <div className="space-y-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-5 border border-gray-100 dark:border-gray-700/50">
            {/* Venue */}
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.venueDate.split('/')[0].trim()}</p>
                <p className="text-base font-semibold text-gray-900 dark:text-white">
                  {venue ? (language === 'zh' ? (cityNames[venue.city] || venue.city) : venue.city) : 'TBD'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{venue?.name}</p>
              </div>
            </div>

            <div className="h-px bg-gray-200 dark:bg-gray-700" />

            {/* Time - Local */}
            <div className="flex items-start space-x-3">
              <Clock className="w-5 h-5 text-accent mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.timezone.local}</p>
                <p className="text-base font-semibold text-gray-900 dark:text-white">
                  {formatDate(matchDate)}
                </p>
              </div>
            </div>

            {/* Time - Venue */}
            {venue && (
              <div className="flex items-start space-x-3">
                <Calendar className="w-5 h-5 text-purple-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.timezone.venue}</p>
                  <p className="text-base font-semibold text-gray-900 dark:text-white">
                    {formatDate(matchDate, venue.timezone)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
