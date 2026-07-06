import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Match, Team } from '../types';
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

type Language = keyof typeof translations;
type Translation = (typeof translations)[Language];
type ConnectorLayout = 'desktop' | 'mobile';

interface SlotDisplay {
  label: string;
  flag?: string;
  isPlaceholder: boolean;
}

interface ConnectorPath {
  id: string;
  d: string;
}

interface ConnectorLink {
  fromId: string;
  toId: string;
}

interface MatchCardProps {
  match: Match;
  isFinal?: boolean;
  compact?: boolean;
  onMatchClick: (match: Match, e: React.MouseEvent) => void;
  resolveSlot: (slotValue: string) => SlotDisplay;
  registerCard: (layout: ConnectorLayout, matchId: string) => (node: HTMLDivElement | null) => void;
  layout: ConnectorLayout;
}

interface MobileHalfFunnelRow {
  stage: Match['stage'];
  matches: Match[];
}

interface MobileHalfFunnel {
  rows: MobileHalfFunnelRow[];
  connectorLinks: ConnectorLink[];
}

const R16_FEEDERS: Record<string, readonly string[]> = {
  m89: ['m74', 'm77'],
  m90: ['m73', 'm75'],
  m91: ['m76', 'm78'],
  m92: ['m79', 'm88'],
  m93: ['m83', 'm84'],
  m94: ['m81', 'm82'],
  m95: ['m86', 'm80'],
  m96: ['m85', 'm87'],
};

const ROUND_ORDER: Match['stage'][] = [
  'Round of 32',
  'Round of 16',
  'Quarter-finals',
  'Semi-finals',
  'Third place',
  'Final',
];

const STAGE_ORDER = new Map<Match['stage'], number>(
  ROUND_ORDER.map((stage, index) => [stage, index]),
);

const PREVIOUS_STAGE: Partial<Record<Match['stage'], Match['stage']>> = {
  'Round of 16': 'Round of 32',
  'Quarter-finals': 'Round of 16',
  'Semi-finals': 'Quarter-finals',
  'Third place': 'Semi-finals',
  Final: 'Semi-finals',
};

const matchNumber = (matchId: string) => Number.parseInt(matchId.replace(/^m/, ''), 10);

const sortByMatchNumber = (a: Match, b: Match) => matchNumber(a.id) - matchNumber(b.id);

const parseFeederId = (slotValue: string): string | null => {
  const match = /^(?:W|L)(\d+)$/.exec(slotValue);
  return match ? `m${match[1]}` : null;
};

const getDisplayDate = (date: Date, venueId: string, timezoneMode: string) => {
  if (timezoneMode === 'local') return date;
  const venue = venues.find(v => v.id === venueId);
  if (!venue?.timezone) return date;

  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: venue.timezone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
  }).formatToParts(date);

  const part = (type: string) => parseInt(parts.find(p => p.type === type)?.value || '0');
  return new Date(part('year'), part('month') - 1, part('day'), part('hour'), part('minute'), part('second'));
};

const getLocalizedTeamName = (team: Team, language: Language) => (
  language === 'zh' ? (teamNames[team.code] || team.name) : team.name
);

const getWinnerTeamId = (match: Match): string | null => {
  if (match.status !== 'finished' || match.homeScore == null || match.awayScore == null) return null;

  if (match.homeScore > match.awayScore) return match.homeTeamId;
  if (match.awayScore > match.homeScore) return match.awayTeamId;

  if (match.homePenaltyScore != null && match.awayPenaltyScore != null) {
    if (match.homePenaltyScore > match.awayPenaltyScore) return match.homeTeamId;
    if (match.awayPenaltyScore > match.homePenaltyScore) return match.awayTeamId;
  }

  return null;
};

const getLoserTeamId = (match: Match): string | null => {
  const winnerId = getWinnerTeamId(match);
  if (!winnerId) return null;
  if (winnerId === match.homeTeamId) return match.awayTeamId;
  if (winnerId === match.awayTeamId) return match.homeTeamId;
  return null;
};

const formatTemplate = (template: string, values: Record<string, string>) => (
  template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? '')
);

const createSlotResolver = ({
  language,
  matchesById,
  matchesByStage,
  t,
}: {
  language: Language;
  matchesById: Map<string, Match>;
  matchesByStage: Map<Match['stage'], Match[]>;
  t: Translation;
}) => {
  function resolveSlot(slotValue: string): SlotDisplay {
    const directTeam = teams.find(team => team.id === slotValue);
    if (directTeam) {
      return {
        label: getLocalizedTeamName(directTeam, language),
        flag: directTeam.flag,
        isPlaceholder: false,
      };
    }

    const feederReference = /^(W|L)(\d+)$/.exec(slotValue);
    if (!feederReference) {
      return { label: t.tbd, isPlaceholder: true };
    }

    const [, resultType, sourceNumber] = feederReference;
    const sourceMatch = matchesById.get(`m${sourceNumber}`);
    if (!sourceMatch) {
      return { label: slotValue, isPlaceholder: true };
    }

    const resolvedTeamId = resultType === 'W' ? getWinnerTeamId(sourceMatch) : getLoserTeamId(sourceMatch);
    const resolvedTeam = resolvedTeamId ? teams.find(team => team.id === resolvedTeamId) : undefined;
    if (resolvedTeam) {
      return {
        label: getLocalizedTeamName(resolvedTeam, language),
        flag: resolvedTeam.flag,
        isPlaceholder: false,
      };
    }

    const homeSlot = resolveSlot(sourceMatch.homeTeamId);
    const awaySlot = resolveSlot(sourceMatch.awayTeamId);
    if (!homeSlot.isPlaceholder && !awaySlot.isPlaceholder) {
      return {
        label: `${homeSlot.label}/${awaySlot.label}`,
        isPlaceholder: true,
      };
    }

    const stageMatches = matchesByStage.get(sourceMatch.stage) ?? [];
    const roundMatchIndex = stageMatches.findIndex(match => match.id === sourceMatch.id);
    const template = resultType === 'W' ? t.bracket.winnerOf : t.bracket.loserOf;

    return {
      label: formatTemplate(template, {
        round: t.stages[sourceMatch.stage],
        matchNumber: String(roundMatchIndex + 1),
      }),
      isPlaceholder: true,
    };
  }

  return resolveSlot;
};

const buildFeederMap = (knockoutMatches: Match[]) => {
  const knockoutIds = new Set(knockoutMatches.map(match => match.id));
  const matchesByStage = new Map<Match['stage'], Match[]>();
  knockoutMatches.forEach(match => {
    matchesByStage.set(match.stage, [...(matchesByStage.get(match.stage) ?? []), match]);
  });
  const feeders = new Map<string, string[]>();

  Object.entries(R16_FEEDERS).forEach(([matchId, feederIds]) => {
    feeders.set(matchId, feederIds.filter(feederId => knockoutIds.has(feederId)));
  });

  knockoutMatches.forEach(match => {
    const previousStage = PREVIOUS_STAGE[match.stage];
    const existingFeeders = feeders.get(match.id) ?? [];
    const inferredFeeders = [match.homeTeamId, match.awayTeamId].flatMap(slotValue => {
      const parsedFeeder = parseFeederId(slotValue);
      if (parsedFeeder && knockoutIds.has(parsedFeeder)) return [parsedFeeder];

      if (!previousStage) return [];
      const directTeam = teams.find(team => team.id === slotValue);
      if (!directTeam) return [];

      const sourceMatch = (matchesByStage.get(previousStage) ?? []).find(candidate => {
        if (existingFeeders.includes(candidate.id)) return false;
        if (getWinnerTeamId(candidate) === directTeam.id) return true;

        const loserFeedsThisMatch = match.stage === 'Third place';
        return loserFeedsThisMatch && getLoserTeamId(candidate) === directTeam.id;
      });

      return sourceMatch ? [sourceMatch.id] : [];
    });

    if (inferredFeeders.length > 0) {
      feeders.set(match.id, Array.from(new Set([...existingFeeders, ...inferredFeeders])));
    }
  });

  return feeders;
};

const buildMobileHalfFunnel = (rootId: string, matchesById: Map<string, Match>, feeders: Map<string, string[]>): MobileHalfFunnel | null => {
  const rootMatch = matchesById.get(rootId);
  const qfIds = feeders.get(rootId) ?? [];
  if (!rootMatch || qfIds.length !== 2) return null;

  const qfMatches = qfIds
    .map(matchId => matchesById.get(matchId))
    .filter((match): match is Match => Boolean(match));
  const r16Ids = qfIds.flatMap(matchId => feeders.get(matchId) ?? []);
  const r16Matches = r16Ids
    .map(matchId => matchesById.get(matchId))
    .filter((match): match is Match => Boolean(match));
  const r32Pairs = r16Ids.map(matchId => feeders.get(matchId) ?? []);
  const r32TopMatches = r32Pairs
    .map(pair => matchesById.get(pair[0] ?? ''))
    .filter((match): match is Match => Boolean(match));
  const r32BottomMatches = r32Pairs
    .map(pair => matchesById.get(pair[1] ?? ''))
    .filter((match): match is Match => Boolean(match));

  if (qfMatches.length !== 2 || r16Matches.length !== 4 || r32TopMatches.length !== 4 || r32BottomMatches.length !== 4) return null;

  const connectorLinks: ConnectorLink[] = [
    ...qfIds.map(fromId => ({ fromId, toId: rootId })),
    ...qfIds.flatMap(qfId => (feeders.get(qfId) ?? []).map(fromId => ({ fromId, toId: qfId }))),
    ...r16Ids.flatMap(r16Id => (feeders.get(r16Id) ?? []).map(fromId => ({ fromId, toId: r16Id }))),
  ];

  return {
    rows: [
      { stage: 'Round of 32', matches: r32TopMatches },
      { stage: 'Round of 32', matches: r32BottomMatches },
      { stage: 'Round of 16', matches: r16Matches },
      { stage: 'Quarter-finals', matches: qfMatches },
      { stage: 'Semi-finals', matches: [rootMatch] },
    ],
    connectorLinks,
  };
};

const makeConnectorPath = (from: DOMRect, to: DOMRect, container: DOMRect) => {
  const fromCenterX = from.left - container.left + from.width / 2;
  const fromCenterY = from.top - container.top + from.height / 2;
  const toCenterX = to.left - container.left + to.width / 2;
  const toCenterY = to.top - container.top + to.height / 2;
  const isHorizontal = Math.abs(toCenterX - fromCenterX) >= Math.abs(toCenterY - fromCenterY);

  if (isHorizontal) {
    const startX = toCenterX >= fromCenterX ? from.right - container.left : from.left - container.left;
    const startY = fromCenterY;
    const endX = toCenterX >= fromCenterX ? to.left - container.left : to.right - container.left;
    const endY = toCenterY;
    const midX = startX + (endX - startX) / 2;

    return `M ${startX.toFixed(1)} ${startY.toFixed(1)} H ${midX.toFixed(1)} V ${endY.toFixed(1)} H ${endX.toFixed(1)}`;
  }

  const startX = fromCenterX;
  const startY = toCenterY >= fromCenterY ? from.bottom - container.top : from.top - container.top;
  const endX = toCenterX;
  const endY = toCenterY >= fromCenterY ? to.top - container.top : to.bottom - container.top;
  const midY = startY + (endY - startY) / 2;

  return `M ${startX.toFixed(1)} ${startY.toFixed(1)} V ${midY.toFixed(1)} H ${endX.toFixed(1)} V ${endY.toFixed(1)}`;
};

export const BracketView: React.FC<BracketViewProps> = ({ matches }) => {
  const { language } = useStore();
  const t = translations[language];
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [modalPosition, setModalPosition] = useState<{ x: number; y: number } | null>(null);
  const [desktopPaths, setDesktopPaths] = useState<ConnectorPath[]>([]);
  const [mobilePaths, setMobilePaths] = useState<ConnectorPath[]>([]);

  const desktopContainerRef = useRef<HTMLDivElement>(null);
  const mobileContainerRef = useRef<HTMLDivElement>(null);
  const desktopCardRefs = useRef(new Map<string, HTMLDivElement>());
  const mobileCardRefs = useRef(new Map<string, HTMLDivElement>());

  const knockoutMatches = useMemo(
    () => matches
      .filter(match => match.stage !== 'Group Stage')
      .sort((a, b) => (STAGE_ORDER.get(a.stage) ?? 0) - (STAGE_ORDER.get(b.stage) ?? 0) || matchNumber(a.id) - matchNumber(b.id)),
    [matches],
  );

  const matchesById = useMemo(
    () => new Map(knockoutMatches.map(match => [match.id, match])),
    [knockoutMatches],
  );

  const matchesByStage = useMemo(() => {
    const grouped = new Map<Match['stage'], Match[]>();
    knockoutMatches.forEach(match => {
      grouped.set(match.stage, [...(grouped.get(match.stage) ?? []), match]);
    });
    grouped.forEach(stageMatches => stageMatches.sort(sortByMatchNumber));
    return grouped;
  }, [knockoutMatches]);

  const feederMap = useMemo(() => buildFeederMap(knockoutMatches), [knockoutMatches]);

  const desktopConnectorLinks = useMemo<ConnectorLink[]>(() => {
    const links: ConnectorLink[] = [];
    feederMap.forEach((feederIds, targetId) => {
      feederIds.forEach(feederId => links.push({ fromId: feederId, toId: targetId }));
    });
    return links;
  }, [feederMap]);

  const final = matchesById.get('m104') ?? matchesByStage.get('Final')?.[0];
  const thirdPlace = matchesById.get('m103') ?? matchesByStage.get('Third place')?.[0];

  const mobileTopHalf = useMemo(
    () => buildMobileHalfFunnel('m101', matchesById, feederMap),
    [feederMap, matchesById],
  );
  const mobileBottomHalf = useMemo(
    () => buildMobileHalfFunnel('m102', matchesById, feederMap),
    [feederMap, matchesById],
  );
  const mobileConnectorLinks = useMemo(
    () => [
      ...(mobileTopHalf?.connectorLinks ?? []),
      ...(mobileBottomHalf?.connectorLinks.map(link => ({ fromId: link.toId, toId: link.fromId })) ?? []),
    ],
    [mobileTopHalf, mobileBottomHalf],
  );

  const handleMatchClick = (match: Match, e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setModalPosition({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });
    setSelectedMatch(match);
  };

  const registerCard = useCallback((layout: ConnectorLayout, matchId: string) => (node: HTMLDivElement | null) => {
    const refMap = layout === 'desktop' ? desktopCardRefs.current : mobileCardRefs.current;

    if (node) {
      refMap.set(matchId, node);
    } else {
      refMap.delete(matchId);
    }
  }, []);

  const resolveSlot = useMemo(
    () => createSlotResolver({ language, matchesById, matchesByStage, t }),
    [language, matchesById, matchesByStage, t],
  );

  const updateConnectorPaths = useCallback((layout: ConnectorLayout) => {
    const container = layout === 'desktop' ? desktopContainerRef.current : mobileContainerRef.current;
    const refMap = layout === 'desktop' ? desktopCardRefs.current : mobileCardRefs.current;
    const setPaths = layout === 'desktop' ? setDesktopPaths : setMobilePaths;

    if (!container) {
      setPaths([]);
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const links = layout === 'desktop' ? desktopConnectorLinks : mobileConnectorLinks;
    const paths = links.flatMap(link => {
      const fromNode = refMap.get(link.fromId);
      const toNode = refMap.get(link.toId);
      if (!fromNode || !toNode) return [];

      return [{
        id: `${layout}-${link.fromId}-${link.toId}`,
        d: makeConnectorPath(fromNode.getBoundingClientRect(), toNode.getBoundingClientRect(), containerRect),
      }];
    });

    setPaths(paths);
  }, [desktopConnectorLinks, mobileConnectorLinks]);

  useEffect(() => {
    let frameId = 0;

    const scheduleUpdate = () => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(() => {
        updateConnectorPaths('desktop');
        updateConnectorPaths('mobile');
      });
    };

    scheduleUpdate();

    const resizeObserver = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(scheduleUpdate);
    if (desktopContainerRef.current) resizeObserver?.observe(desktopContainerRef.current);
    if (mobileContainerRef.current) resizeObserver?.observe(mobileContainerRef.current);

    window.addEventListener('resize', scheduleUpdate);
    window.addEventListener('orientationchange', scheduleUpdate);
    return () => {
      window.cancelAnimationFrame(frameId);
      resizeObserver?.disconnect();
      window.removeEventListener('resize', scheduleUpdate);
      window.removeEventListener('orientationchange', scheduleUpdate);
    };
  }, [updateConnectorPaths, language]);

  return (
    <div className="relative pb-8">
      <div className="hidden md:block overflow-x-auto pb-4">
        <div ref={desktopContainerRef} className="relative min-w-[2050px] p-4">
          <ConnectorSvg paths={desktopPaths} />
          <div className="relative z-10 flex justify-center">
            <div className="flex items-center gap-10">
              <DesktopHalfTree rootId="m101" side="left" matchesById={matchesById} feederMap={feederMap} onMatchClick={handleMatchClick} resolveSlot={resolveSlot} registerCard={registerCard} />

              <div className="grid w-64 self-stretch grid-rows-[1fr_auto_1fr] justify-items-center">
                <div className="row-start-2 flex w-full flex-col items-center gap-3">
                  <div className="text-3xl leading-none" aria-hidden="true">🏆</div>
                  <h3 className="text-sm font-bold text-yellow-600 dark:text-yellow-500 uppercase tracking-wider">{t.stages.Final}</h3>
                  {final && <BracketMatchCard match={final} isFinal onMatchClick={handleMatchClick} resolveSlot={resolveSlot} registerCard={registerCard} layout="desktop" />}
                </div>

                <div className="row-start-3 mt-8 flex w-full flex-col items-center gap-2">
                  <div className="h-12 w-px bg-gray-300 dark:bg-gray-700" />
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t.stages['Third place']}</h3>
                  {thirdPlace && <BracketMatchCard match={thirdPlace} onMatchClick={handleMatchClick} resolveSlot={resolveSlot} registerCard={registerCard} layout="desktop" />}
                </div>
              </div>

              <DesktopHalfTree rootId="m102" side="right" matchesById={matchesById} feederMap={feederMap} onMatchClick={handleMatchClick} resolveSlot={resolveSlot} registerCard={registerCard} />
            </div>
          </div>
        </div>
      </div>

      <div className="md:hidden overflow-x-auto pb-6">
        <div ref={mobileContainerRef} className="relative w-max min-w-full px-4 pb-6">
          <ConnectorSvg paths={mobilePaths} />
          <div className="relative z-10 mx-auto flex max-w-[390px] flex-col items-center gap-8 py-2">
            {mobileTopHalf && <MobileHalfFunnelView testId="mobile-top-half-funnel" half={mobileTopHalf} onMatchClick={handleMatchClick} resolveSlot={resolveSlot} registerCard={registerCard} />}
            <MobileFinalSection final={final} thirdPlace={thirdPlace} onMatchClick={handleMatchClick} resolveSlot={resolveSlot} registerCard={registerCard} />
            {mobileBottomHalf && <MobileHalfFunnelView testId="mobile-bottom-half-funnel" half={mobileBottomHalf} inverted onMatchClick={handleMatchClick} resolveSlot={resolveSlot} registerCard={registerCard} />}
          </div>
        </div>
      </div>

      {selectedMatch && (
        <MatchDetailModal
          match={selectedMatch}
          homeTeam={teams.find(team => team.id === selectedMatch.homeTeamId)}
          awayTeam={teams.find(team => team.id === selectedMatch.awayTeamId)}
          venue={venues.find(venue => venue.id === selectedMatch.venueId)}
          position={modalPosition}
          onClose={() => setSelectedMatch(null)}
        />
      )}
    </div>
  );
};

const ConnectorSvg: React.FC<{ paths: ConnectorPath[] }> = ({ paths }) => (
  <svg data-testid="bracket-connectors" className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-visible" aria-hidden="true" shapeRendering="crispEdges">
    {paths.map(path => (
      <path
        key={path.id}
        data-connector-path="true"
        d={path.d}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="square"
        strokeLinejoin="miter"
        className="text-gray-300 dark:text-gray-700"
      />
    ))}
  </svg>
);

const DesktopHalfTree: React.FC<{
  rootId: string;
  side: 'left' | 'right';
  matchesById: Map<string, Match>;
  feederMap: Map<string, string[]>;
  onMatchClick: (match: Match, e: React.MouseEvent) => void;
  resolveSlot: (slotValue: string) => SlotDisplay;
  registerCard: (layout: ConnectorLayout, matchId: string) => (node: HTMLDivElement | null) => void;
}> = ({ rootId, side, matchesById, feederMap, onMatchClick, resolveSlot, registerCard }) => {
  const { language } = useStore();
  const t = translations[language];
  const stages: Match['stage'][] = ['Round of 32', 'Round of 16', 'Quarter-finals', 'Semi-finals'];

  return (
    <div data-testid={`desktop-${side}-bracket`} className="flex flex-col">
      <div className={clsx('mb-4 flex gap-4', side === 'right' && 'flex-row-reverse')}>
        {stages.map(stage => (
          <h3 key={stage} className="h-6 w-48 text-center text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            {t.stages[stage]}
          </h3>
        ))}
      </div>
      <DesktopTreeNode rootId={rootId} side={side} matchesById={matchesById} feederMap={feederMap} onMatchClick={onMatchClick} resolveSlot={resolveSlot} registerCard={registerCard} />
    </div>
  );
};

const DesktopTreeNode: React.FC<{
  rootId: string;
  side: 'left' | 'right';
  matchesById: Map<string, Match>;
  feederMap: Map<string, string[]>;
  onMatchClick: (match: Match, e: React.MouseEvent) => void;
  resolveSlot: (slotValue: string) => SlotDisplay;
  registerCard: (layout: ConnectorLayout, matchId: string) => (node: HTMLDivElement | null) => void;
}> = ({ rootId, side, matchesById, feederMap, onMatchClick, resolveSlot, registerCard }) => {
  const match = matchesById.get(rootId);
  if (!match) return null;

  const feederIds = feederMap.get(rootId) ?? [];
  if (feederIds.length === 0) {
    return (
      <div className="w-48">
        <BracketMatchCard match={match} onMatchClick={onMatchClick} resolveSlot={resolveSlot} registerCard={registerCard} layout="desktop" />
      </div>
    );
  }

  return (
    <div className={clsx('flex items-stretch gap-4', side === 'right' && 'flex-row-reverse')}>
      <div className="flex flex-col justify-center gap-6">
        {feederIds.map(feederId => (
          <DesktopTreeNode key={feederId} rootId={feederId} side={side} matchesById={matchesById} feederMap={feederMap} onMatchClick={onMatchClick} resolveSlot={resolveSlot} registerCard={registerCard} />
        ))}
      </div>
      <div className="flex w-48 flex-col justify-center">
        <BracketMatchCard match={match} onMatchClick={onMatchClick} resolveSlot={resolveSlot} registerCard={registerCard} layout="desktop" />
      </div>
    </div>
  );
};

const MobileHalfFunnelView: React.FC<{
  testId: string;
  half: MobileHalfFunnel;
  inverted?: boolean;
  onMatchClick: (match: Match, e: React.MouseEvent) => void;
  resolveSlot: (slotValue: string) => SlotDisplay;
  registerCard: (layout: ConnectorLayout, matchId: string) => (node: HTMLDivElement | null) => void;
}> = ({ testId, half, inverted, onMatchClick, resolveSlot, registerCard }) => {
  const { language } = useStore();
  const t = translations[language];
  const rows = inverted
    ? [half.rows[4], half.rows[3], half.rows[2], half.rows[0], half.rows[1]]
    : half.rows;

  return (
    <div data-testid={testId} className="flex w-full flex-col items-center gap-4 py-2">
      {rows.map((row, index) => {
        const isSemiFinalRow = row.stage === 'Semi-finals';
        const showLabel = index === 0 || rows[index - 1]?.stage !== row.stage;

        return (
          <section key={`${row.stage}-${index}`} className="flex w-full flex-col items-center gap-2">
            {showLabel && (
              <h3 className={clsx(
                'text-center text-[10px] font-black uppercase tracking-[0.2em]',
                isSemiFinalRow ? 'text-yellow-600 dark:text-yellow-500' : 'text-gray-500 dark:text-gray-400',
              )}>
                {t.stages[row.stage]}
              </h3>
            )}
            <div data-mobile-half-row={row.stage} className={clsx(
              'grid w-full justify-items-center gap-x-1.5 gap-y-2',
              row.matches.length === 4 && 'grid-cols-4',
              row.matches.length === 2 && 'w-1/2 grid-cols-2',
              row.matches.length === 1 && 'w-1/4 min-w-[92px] grid-cols-1',
            )}>
              {row.matches.map(match => (
                <BracketMatchCard key={match.id} match={match} compact onMatchClick={onMatchClick} resolveSlot={resolveSlot} registerCard={registerCard} layout="mobile" />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};

const MobileFinalSection: React.FC<{
  final?: Match;
  thirdPlace?: Match;
  onMatchClick: (match: Match, e: React.MouseEvent) => void;
  resolveSlot: (slotValue: string) => SlotDisplay;
  registerCard: (layout: ConnectorLayout, matchId: string) => (node: HTMLDivElement | null) => void;
}> = ({ final, thirdPlace, onMatchClick, resolveSlot, registerCard }) => {
  const { language } = useStore();
  const t = translations[language];

  return (
    <div className="flex w-full flex-col items-center gap-3 py-2">
      <div className="text-3xl leading-none" aria-hidden="true">🏆</div>
      <h3 className="text-center text-[10px] font-black uppercase tracking-[0.24em] text-yellow-600 dark:text-yellow-500">{t.stages.Final}</h3>
      {final && (
        <div className="w-[138px]">
          <BracketMatchCard match={final} isFinal compact onMatchClick={onMatchClick} resolveSlot={resolveSlot} registerCard={registerCard} layout="mobile" />
        </div>
      )}
      {thirdPlace && (
        <section className="flex w-[138px] flex-col items-center gap-1 pt-2">
          <h3 className="text-center text-[10px] font-bold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">{t.stages['Third place']}</h3>
          <BracketMatchCard match={thirdPlace} compact onMatchClick={onMatchClick} resolveSlot={resolveSlot} registerCard={registerCard} layout="mobile" />
        </section>
      )}
    </div>
  );
};

const BracketMatchCard: React.FC<MatchCardProps> = ({ match, isFinal, compact, onMatchClick, resolveSlot, registerCard, layout }) => {
  const { language, timezoneMode } = useStore();
  const dateLocale = language === 'zh' ? zhCN : enUS;
  const displayDate = getDisplayDate(new Date(match.date), match.venueId, timezoneMode);
  const homeSlot = resolveSlot(match.homeTeamId);
  const awaySlot = resolveSlot(match.awayTeamId);
  const venue = venues.find(v => v.id === match.venueId);
  const venueName = language === 'zh' ? (venue ? (cityNames[venue.city] || venue.city) : '') : (venue?.city || '');
  const showScore = match.status === 'finished' || match.status === 'live';
  const showPenalties = showScore && match.homePenaltyScore != null && match.awayPenaltyScore != null;

  return (
    <div
      ref={registerCard(layout, match.id)}
      data-match-id={match.id}
      onClick={(e) => onMatchClick(match, e)}
      className={clsx(
        'relative my-2 cursor-pointer rounded-lg border border-gray-200/50 bg-white/80 shadow-sm backdrop-blur-sm transition-all hover:scale-105 hover:bg-white hover:shadow-md dark:border-gray-700/50 dark:bg-gray-800/80 dark:hover:bg-gray-800',
        compact ? 'w-[92px] p-1.5' : 'p-2',
        isFinal && 'border-yellow-400 shadow-lg ring-2 ring-yellow-400/20 dark:border-yellow-600',
      )}
    >
      <div className={clsx('mb-1 flex justify-between text-gray-400', compact ? 'text-[8px]' : 'text-[10px]')}>
        <span>{match.id.toUpperCase()}</span>
        <span>{format(displayDate, 'MMM d', { locale: dateLocale })}</span>
      </div>
      <div className="mb-1 flex flex-col gap-1">
        <TeamSlotRow slot={homeSlot} score={showScore ? match.homeScore : null} penaltyScore={showPenalties ? match.homePenaltyScore : null} compact={compact} />
        <TeamSlotRow slot={awaySlot} score={showScore ? match.awayScore : null} penaltyScore={showPenalties ? match.awayPenaltyScore : null} compact={compact} />
      </div>

      <div className={clsx('flex items-center border-t border-gray-100 pt-1 text-gray-400 dark:border-gray-700/50', compact ? 'text-[7px]' : 'text-[9px]')}>
        <span className="mr-1" aria-hidden="true">📍</span>
        <span className="truncate">{venueName}</span>
      </div>
    </div>
  );
};

const TeamSlotRow: React.FC<{
  slot: SlotDisplay;
  score?: number | null;
  penaltyScore?: number | null;
  compact?: boolean;
}> = ({ slot, score, penaltyScore, compact }) => (
  <div className="flex items-center justify-between gap-2">
    <div className={clsx('flex min-w-0 items-center overflow-hidden', compact ? 'gap-1' : 'gap-2')}>
      {slot.flag ? <span className={compact ? 'text-[10px]' : 'text-sm'}>{slot.flag}</span> : <span className={clsx('shrink-0 rounded-full bg-gray-300 dark:bg-gray-600', compact ? 'h-2 w-2' : 'h-3 w-3')} />}
      <span className={clsx(
        'truncate font-medium',
        compact ? 'text-[9px] leading-tight' : 'text-xs',
        slot.isPlaceholder ? 'italic text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-gray-100',
      )}>
        {slot.label}
      </span>
    </div>
    <div className="flex shrink-0 items-center gap-1">
      <span className={clsx('rounded bg-gray-100/50 font-bold text-gray-600 dark:bg-gray-700/50 dark:text-gray-300', compact ? 'px-1 text-[9px]' : 'px-1.5 text-xs')}>
        {score ?? '-'}
      </span>
      {penaltyScore != null && <span className={clsx('text-gray-500', compact ? 'text-[8px]' : 'text-[10px]')}>({penaltyScore})</span>}
    </div>
  </div>
);
