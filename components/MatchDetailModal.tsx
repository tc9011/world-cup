import React from 'react';
import { createPortal } from 'react-dom';
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
  position?: { x: number; y: number } | null;
  onClose: () => void;
}

export const MatchDetailModal: React.FC<MatchDetailModalProps> = ({ match, homeTeam, awayTeam, venue, position, onClose }) => {
  const [mounted, setMounted] = React.useState(false);
  const { language } = useStore();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const t = translations[language];
  const dateLocale = language === 'zh' ? zhCN : enUS;
  const modalRef = React.useRef<HTMLDivElement>(null);
  const [style, setStyle] = React.useState<React.CSSProperties>({});

  React.useLayoutEffect(() => {
    if (position && modalRef.current) {
      const { x, y } = position;
      const { offsetWidth: width, offsetHeight: height } = modalRef.current;
      const padding = 20;

      let top = y - height / 2;
      let left = x - width / 2;

      // Clamp to viewport
      if (left < padding) left = padding;
      if (left + width > window.innerWidth - padding) left = window.innerWidth - width - padding;
      if (top < padding) top = padding;
      if (top + height > window.innerHeight - padding) top = window.innerHeight - height - padding;

      setStyle({
        position: 'absolute',
        top: top,
        left: left,
        margin: 0,
        transform: 'none'
      });

      // Scroll into view if needed (for the modal itself)
      // Since we clamped it, it should be in view.
      // But if the user wants the *background* to scroll to the modal...
      // Let's try to scroll the modal element into view smoothly just in case clamping wasn't enough (e.g. mobile browser bars)
      // modalRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    }
  }, [position]);

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
    return t.tbd;
  };

  const homeName = getTeamName(homeTeam, match.homeTeamId);
  const awayName = getTeamName(awayTeam, match.awayTeamId);

  const matchDate = new Date(match.date);

  // Format dates
  const formatDate = (date: Date, timeZone?: string) => {
    if (!timeZone) return format(date, 'PPPP HH:mm', { locale: dateLocale });

    return new Intl.DateTimeFormat(language === 'zh' ? 'zh-CN' : 'en-US', {
      timeZone,
      dateStyle: 'full',
      timeStyle: 'short',
      hourCycle: 'h23'
    }).format(date);
  };

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div
        ref={modalRef}
        style={window.innerWidth >= 768 && position ? style : {}}
        className="relative w-full max-w-lg bg-white dark:bg-black rounded-3xl shadow-2xl overflow-hidden border border-white/20 dark:border-primary/30 animate-in zoom-in-95 duration-200"
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
                  {match.homePenaltyScore !== null && match.homePenaltyScore !== undefined && match.awayPenaltyScore !== null && match.awayPenaltyScore !== undefined && (
                    <div className="text-sm text-gray-500 font-medium mt-1">
                      ({match.homePenaltyScore} - {match.awayPenaltyScore})
                    </div>
                  )}
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
                  {venue ? (language === 'zh' ? (cityNames[venue.city] || venue.city) : venue.city) : t.tbd}
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
                  {format(new Date(match.date), 'EEEE, MMMM d, yyyy')}             </p>
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
    </div>,
    document.body
  );
};
