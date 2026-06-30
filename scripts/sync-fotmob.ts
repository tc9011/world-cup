/**
 * FotMob Match Score Synchronization Script
 * 
 * Fetches match results from FotMob API and updates matches.json
 * Handles regular time, extra time, and penalty shootouts
 * 
 * Usage: pnpm sync-fotmob [--date YYYYMMDD] [--dry-run]
 */

import fs from 'fs';
import path from 'path';
import { format, parse, isSameDay as dateFnsIsSameDay, subDays } from 'date-fns';

// ============================================================================
// Types (exported for testing)
// ============================================================================

export interface Match {
  id: string;
  date: string;
  group?: string;
  stage: string;
  homeTeamId: string;
  awayTeamId: string;
  venueId: string;
  status: 'scheduled' | 'live' | 'finished';
  homeScore: number | null;
  awayScore: number | null;
  homePenaltyScore: number | null;
  awayPenaltyScore: number | null;
  fotmobMatchId?: number;
}

export interface FotMobTeamMapping {
  fotmobId: number;
  name: string;
}

export interface FotMobMappingFile {
  leagueId: number;
  leagueName: string;
  teamIdMapping: Record<string, FotMobTeamMapping>;
}

export interface FotMobMatch {
  id: number;
  leagueId: number;
  time: string;
  tournamentStage?: string;
  home: {
    id: number;
    score?: number;
    penScore?: number;
    name: string;
    longName: string;
  };
  away: {
    id: number;
    score?: number;
    penScore?: number;
    name: string;
    longName: string;
  };
  status: {
    utcTime: string;
    finished: boolean;
    started: boolean;
    cancelled: boolean;
    scoreStr?: string;
    reason?: {
      short: string;
      shortKey: string;
      long: string;
      longKey: string;
    };
  };
  timeTS: number;
}

interface FotMobLeague {
  id: number;
  name: string;
  matches: FotMobMatch[];
}

interface FotMobMatchesResponse {
  leagues: FotMobLeague[];
  date: string;
}

interface FotMobMatchDetail {
  general: {
    matchId: string;
    homeTeam: { id: number; name: string };
    awayTeam: { id: number; name: string };
    matchTimeUTCDate: string;
  };
  header: {
    status: {
      finished: boolean;
      started: boolean;
      cancelled: boolean;
      scoreStr?: string;
      reason?: { long: string };
    };
    teams: Array<{
      id: number;
      name: string;
      score?: number;
      imageUrl: string;
    }>;
  };
  content?: {
    matchFacts?: {
      infoBox?: {
        Stadium?: { name?: string; city?: string; lat?: number; long?: number };
      };
      events?: {
        events?: Array<{
          type: string;
          time?: { minutes?: number; addedTime?: number };
          // For penalty events
          penaltyScore?: { home: number; away: number };
        }>;
      };
    };
  };
}

// ============================================================================
// Constants
// ============================================================================

const DATA_DIR = path.join(process.cwd(), 'data');
const MATCHES_FILE = path.join(DATA_DIR, 'matches.json');
const BACKUP_FILE = path.join(DATA_DIR, 'matches.sync-backup.json');
const MAPPING_FILE = path.join(DATA_DIR, 'fotmob-mapping.json');
const VENUES_FILE = path.join(DATA_DIR, 'venues.json');

const FOTMOB_BASE_URL = 'https://www.fotmob.com/api';
export const WORLD_CUP_LEAGUE_ID = 77; // Legacy single-league ID (no longer used by FotMob)
export const WORLD_CUP_LEAGUE_NAME_PREFIX = 'World Cup';

// World Cup 2026 date range
const WC_START_DATE = new Date('2026-06-11');
const WC_END_DATE = new Date('2026-07-19');

// Rate limiting
const RATE_LIMIT_DELAY_MS = 200; // 5 requests per second max

// ============================================================================
// Utilities
// ============================================================================

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function formatDate(date: Date): string {
  return format(date, 'yyyyMMdd');
}

export function parseDate(dateStr: string): Date {
  return parse(dateStr, 'yyyyMMdd', new Date());
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return dateFnsIsSameDay(date1, date2);
}

function log(message: string, type: 'info' | 'warn' | 'error' | 'success' = 'info'): void {
  const prefix = {
    info: '📋',
    warn: '⚠️',
    error: '❌',
    success: '✅'
  }[type];
  console.log(`${prefix} ${message}`);
}

// ============================================================================
// FotMob API Functions
// ============================================================================

async function fetchWithRetry(url: string, retries = 3): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; WorldCupSync/1.0)',
          'Accept': 'application/json',
        },
      });

      if (response.status === 429) {
        log(`Rate limited, waiting ${(i + 1) * 5} seconds...`, 'warn');
        await sleep((i + 1) * 5000);
        continue;
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response;
    } catch (error) {
      if (i === retries - 1) throw error;
      log(`Retry ${i + 1}/${retries} after error: ${error}`, 'warn');
      await sleep(1000 * (i + 1));
    }
  }
  throw new Error('Max retries exceeded');
}

async function fetchMatchesByDate(dateStr: string): Promise<FotMobMatch[]> {
  const url = `${FOTMOB_BASE_URL}/data/matches?date=${dateStr}`;
  log(`Fetching matches for ${dateStr}...`);

  try {
    const response = await fetchWithRetry(url);
    const data: FotMobMatchesResponse = await response.json();

    const wcLeagues = data.leagues?.filter(l => l.name.startsWith(WORLD_CUP_LEAGUE_NAME_PREFIX)) || [];
    if (wcLeagues.length === 0) {
      log(`No World Cup matches found for ${dateStr}`, 'info');
      return [];
    }

    const allMatches = wcLeagues.flatMap(l => l.matches || []);
    log(`Found ${allMatches.length} World Cup matches across ${wcLeagues.length} groups for ${dateStr}`, 'success');
    return allMatches;
  } catch (error) {
    log(`Failed to fetch matches for ${dateStr}: ${error}`, 'error');
    return [];
  }
}

async function fetchMatchDetails(matchId: number): Promise<FotMobMatchDetail | null> {
  const url = `${FOTMOB_BASE_URL}/data/matchDetails?matchId=${matchId}`;
  
  try {
    await sleep(RATE_LIMIT_DELAY_MS);
    const response = await fetchWithRetry(url);
    return await response.json();
  } catch (error) {
    log(`Failed to fetch match details for ${matchId}: ${error}`, 'error');
    return null;
  }
}

export interface VenueCoord {
  id: string;
  lat: number;
  lng: number;
}

export function loadVenueCoords(): VenueCoord[] {
  if (!fs.existsSync(VENUES_FILE)) return [];
  const raw = JSON.parse(fs.readFileSync(VENUES_FILE, 'utf-8'));
  const arr = Array.isArray(raw) ? raw : (raw.venues ?? []);
  return arr
    .filter((v: { coordinates?: { lat?: number; lng?: number } }) => v.coordinates?.lat != null && v.coordinates?.lng != null)
    .map((v: { id: string; coordinates: { lat: number; lng: number } }) => ({ id: v.id, lat: v.coordinates.lat, lng: v.coordinates.lng }));
}

export function nearestVenueId(lat: number, lng: number, venues: VenueCoord[]): string | undefined {
  let bestId: string | undefined;
  let bestDist = Infinity;
  for (const v of venues) {
    const dLat = v.lat - lat;
    const dLng = v.lng - lng;
    const dist = dLat * dLat + dLng * dLng;
    if (dist < bestDist) { bestDist = dist; bestId = v.id; }
  }
  return bestId;
}

async function fetchVenueId(matchId: number, venues: VenueCoord[]): Promise<string | undefined> {
  if (venues.length === 0) return undefined;
  const details = await fetchMatchDetails(matchId);
  const stadium = details?.content?.matchFacts?.infoBox?.Stadium;
  if (stadium?.lat == null || stadium?.long == null) return undefined;
  return nearestVenueId(stadium.lat, stadium.long, venues);
}

// ============================================================================
// Match Mapping & Processing
// ============================================================================

export function createReverseFotMobMapping(mapping: FotMobMappingFile): Map<number, string> {
  const reverse = new Map<number, string>();
  for (const [ourId, fotmobData] of Object.entries(mapping.teamIdMapping)) {
    reverse.set(fotmobData.fotmobId, ourId);
  }
  return reverse;
}

// Seeded knockout kickoff times are approximate and can fall on a different
// calendar day than the real fixture (e.g. a 01:00Z slot vs a 17:00Z kickoff
// the day before), so exact same-day matching is too strict.
const TEAM_MATCH_WINDOW_DAYS = 2;
const DAY_MS = 24 * 60 * 60 * 1000;

const FOTMOB_KNOCKOUT_STAGE: Record<string, string> = {
  '1/16': 'Round of 32',
  '1/8': 'Round of 16',
  '1/4': 'Quarter-finals',
  '1/2': 'Semi-finals',
  'Final': 'Final',
};

export function fotmobKnockoutStage(fotmobMatch: FotMobMatch): string | undefined {
  return fotmobMatch.tournamentStage ? FOTMOB_KNOCKOUT_STAGE[fotmobMatch.tournamentStage] : undefined;
}

export function findMatchingLocalMatch(
  fotmobMatch: FotMobMatch,
  localMatches: Match[],
  reverseMapping: Map<number, string>
): Match | undefined {
  const fotmobDate = new Date(fotmobMatch.status.utcTime);
  const homeTeamId = reverseMapping.get(fotmobMatch.home.id);
  const awayTeamId = reverseMapping.get(fotmobMatch.away.id);
  if (!homeTeamId || !awayTeamId) return undefined;

  // First try exact match by stored fotmobMatchId
  const exactMatch = localMatches.find(m => m.fotmobMatchId === fotmobMatch.id);
  if (exactMatch) return exactMatch;

  const teamsMatch = (m: Match) =>
    (m.homeTeamId === homeTeamId && m.awayTeamId === awayTeamId) ||
    (m.homeTeamId === awayTeamId && m.awayTeamId === homeTeamId);

  // For knockout, the round (stage) makes a team pairing unique, so match by
  // stage + teams regardless of date — the seeded slot time may be days off.
  const koStage = fotmobKnockoutStage(fotmobMatch);
  if (koStage) {
    return localMatches.find(m => m.stage === koStage && teamsMatch(m));
  }

  // Group stage: a pairing is unique within a short window; the window only
  // guards against a hypothetical knockout rematch of the same teams.
  const teamCandidates = localMatches.filter(m =>
    teamsMatch(m) && Math.abs(new Date(m.date).getTime() - fotmobDate.getTime()) <= TEAM_MATCH_WINDOW_DAYS * DAY_MS
  );
  if (teamCandidates.length <= 1) return teamCandidates[0];
  return teamCandidates.reduce((closest, m) => {
    const gap = Math.abs(new Date(m.date).getTime() - fotmobDate.getTime());
    const closestGap = Math.abs(new Date(closest.date).getTime() - fotmobDate.getTime());
    return gap < closestGap ? m : closest;
  });
}

export function findKnockoutSlotBySingleTeam(
  fotmobMatch: FotMobMatch,
  localMatches: Match[],
  reverseMapping: Map<number, string>
): Match | undefined {
  const homeTeamId = reverseMapping.get(fotmobMatch.home.id);
  const awayTeamId = reverseMapping.get(fotmobMatch.away.id);
  const knownTeams = [homeTeamId, awayTeamId].filter((t): t is string => Boolean(t));
  if (knownTeams.length === 0) return undefined;

  const fotmobDate = new Date(fotmobMatch.status.utcTime);
  const koStage = fotmobKnockoutStage(fotmobMatch);

  const candidates = localMatches.filter(m => {
    if (m.stage === 'Group Stage') return false;
    if (!(knownTeams.includes(m.homeTeamId) || knownTeams.includes(m.awayTeamId))) return false;
    // The stage uniquely identifies the slot when known; otherwise fall back to a
    // date window so a team that advanced isn't matched to the wrong round.
    if (koStage) return m.stage === koStage;
    return Math.abs(new Date(m.date).getTime() - fotmobDate.getTime()) <= TEAM_MATCH_WINDOW_DAYS * DAY_MS;
  });

  if (candidates.length <= 1) return candidates[0];
  return candidates.reduce((closest, m) => {
    const gap = Math.abs(new Date(m.date).getTime() - fotmobDate.getTime());
    const closestGap = Math.abs(new Date(closest.date).getTime() - fotmobDate.getTime());
    return gap < closestGap ? m : closest;
  });
}

export function toLocalDate(utcTime: string): string {
  return new Date(utcTime).toISOString().replace('.000Z', 'Z');
}

export interface PenaltyScores {
  home: number;
  away: number;
}

async function extractPenaltyScores(matchId: number): Promise<PenaltyScores | null> {
  const details = await fetchMatchDetails(matchId);
  if (!details) return null;

  // Look for penalty shootout in match events
  const events = details.content?.matchFacts?.events?.events || [];
  
  // Find the last penalty score event
  const penaltyEvents = events.filter(e => e.type === 'PenaltyShootout' && e.penaltyScore);
  
  if (penaltyEvents.length > 0) {
    const lastPenalty = penaltyEvents[penaltyEvents.length - 1];
    if (lastPenalty.penaltyScore) {
      return {
        home: lastPenalty.penaltyScore.home,
        away: lastPenalty.penaltyScore.away
      };
    }
  }

  return null;
}

// ============================================================================
// Main Sync Logic
// ============================================================================

export interface SyncResult {
  updated: number;
  skipped: number;
  errors: number;
  matches: string[];
}

async function syncMatchesForDate(
  dateStr: string,
  localMatches: Match[],
  reverseMapping: Map<number, string>,
  venues: VenueCoord[],
  dryRun: boolean
): Promise<SyncResult> {
  const result: SyncResult = { updated: 0, skipped: 0, errors: 0, matches: [] };
  
  const fotmobMatches = await fetchMatchesByDate(dateStr);
  
  for (const fm of fotmobMatches) {
    let localMatch = findMatchingLocalMatch(fm, localMatches, reverseMapping);

    // Knockout fallback: a slot may carry a wrong predicted opponent or a still
    // unresolved TBD side, so both-team matching fails. Identify the slot via a
    // known team and let FotMob correct teams/time below.
    const matchedByFallback = !localMatch;
    if (!localMatch) {
      localMatch = findKnockoutSlotBySingleTeam(fm, localMatches, reverseMapping);
    }
    if (!localMatch) {
      if (fm.status.finished) {
        log(`No matching local match for FotMob ${fm.id}: ${fm.home.name} vs ${fm.away.name}`, 'warn');
        result.errors++;
      } else {
        result.skipped++;
      }
      continue;
    }

    const isKnockout = localMatch.stage !== 'Group Stage';
    const fotmobHomeTeamId = reverseMapping.get(fm.home.id);
    const fotmobAwayTeamId = reverseMapping.get(fm.away.id);
    const bothTeamsReal = !!fotmobHomeTeamId && !!fotmobAwayTeamId;

    const update: Partial<Match> = {};

    // FotMob is the source of truth for kickoff time.
    const newDate = toLocalDate(fm.status.utcTime);
    if (localMatch.date !== newDate) update.date = newDate;

    // For knockout, take the matchup from FotMob once both sides are real teams,
    // correcting a wrong predicted opponent. Group slots keep their fixed teams.
    if (isKnockout && bothTeamsReal) {
      if (localMatch.homeTeamId !== fotmobHomeTeamId) update.homeTeamId = fotmobHomeTeamId;
      if (localMatch.awayTeamId !== fotmobAwayTeamId) update.awayTeamId = fotmobAwayTeamId;
    }

    if (localMatch.fotmobMatchId !== fm.id) update.fotmobMatchId = fm.id;

    if (fm.status.finished) {
      const isDraw = fm.home.score === fm.away.score;
      let penaltyScores: PenaltyScores | null = null;
      if (isKnockout && isDraw) {
        if (fm.home.penScore != null && fm.away.penScore != null) {
          penaltyScores = { home: fm.home.penScore, away: fm.away.penScore };
        } else {
          log(`Fetching penalty details for ${localMatch.id}...`);
          penaltyScores = await extractPenaltyScores(fm.id);
        }
        if (penaltyScores) {
          log(`Penalties: ${penaltyScores.home} - ${penaltyScores.away}`, 'info');
        } else {
          const scoreStr = fm.status.scoreStr || '';
          if (!scoreStr.includes('AET') && !scoreStr.includes('Pen')) {
            log(`Draw in knockout but no penalty/AET info for ${localMatch.id}`, 'warn');
          }
        }
      }

      // Map FotMob's home/away scores onto the slot's orientation. Knockout slots
      // are normalised to FotMob orientation above; a group slot may store the
      // teams swapped, so align by which side equals FotMob's home team.
      const slotHomeIsFotmobHome = (isKnockout && bothTeamsReal) || localMatch.homeTeamId === fotmobHomeTeamId;
      const homeScore = (slotHomeIsFotmobHome ? fm.home.score : fm.away.score) ?? null;
      const awayScore = (slotHomeIsFotmobHome ? fm.away.score : fm.home.score) ?? null;
      const homePen = (slotHomeIsFotmobHome ? penaltyScores?.home : penaltyScores?.away) ?? null;
      const awayPen = (slotHomeIsFotmobHome ? penaltyScores?.away : penaltyScores?.home) ?? null;

      if (localMatch.homeScore !== homeScore) update.homeScore = homeScore;
      if (localMatch.awayScore !== awayScore) update.awayScore = awayScore;
      if (localMatch.homePenaltyScore !== homePen) update.homePenaltyScore = homePen;
      if (localMatch.awayPenaltyScore !== awayPen) update.awayPenaltyScore = awayPen;
      if (localMatch.status !== 'finished') update.status = 'finished';
    }

    // Knockout venues are tied to the bracket slot, so a mis-seeded slot can
    // point at the wrong stadium. Resolve the real venue from FotMob.
    if (isKnockout) {
      const venueId = await fetchVenueId(fm.id, venues);
      if (venueId && localMatch.venueId !== venueId) update.venueId = venueId;
    }

    if (Object.keys(update).length === 0) {
      result.skipped++;
      continue;
    }

    const homeLabel = update.homeTeamId ?? localMatch.homeTeamId;
    const awayLabel = update.awayTeamId ?? localMatch.awayTeamId;
    const scoreLabel = fm.status.finished ? `${fm.home.score ?? '?'}-${fm.away.score ?? '?'}` : 'scheduled';
    const notes: string[] = [];
    if (matchedByFallback && (update.homeTeamId || update.awayTeamId)) {
      notes.push(`teams was ${localMatch.homeTeamId} vs ${localMatch.awayTeamId}`);
    }
    if (update.date) notes.push(`time ${localMatch.date} -> ${update.date}`);
    if (update.venueId) notes.push(`venue ${localMatch.venueId} -> ${update.venueId}`);
    const noteStr = notes.length ? ` [${notes.join('; ')}]` : '';
    const matchDesc = `${localMatch.id}: ${homeLabel} ${scoreLabel} ${awayLabel}${noteStr}`;

    if (dryRun) {
      log(`[DRY RUN] Would update ${matchDesc}`, 'info');
    } else {
      Object.assign(localMatch, update);
      log(`Updated ${matchDesc}`, 'success');
    }

    result.updated++;
    result.matches.push(matchDesc);
  }

  return result;
}

export async function main(): Promise<void> {
  // Parse CLI arguments
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const dateIndex = args.indexOf('--date');
  const specificDate = dateIndex !== -1 ? args[dateIndex + 1] : null;

  log('='.repeat(60));
  log('FotMob World Cup Sync Script');
  log('='.repeat(60));

  if (dryRun) {
    log('Running in DRY RUN mode - no changes will be saved', 'warn');
  }

  // Load mapping file
  if (!fs.existsSync(MAPPING_FILE)) {
    log(`Mapping file not found: ${MAPPING_FILE}`, 'error');
    process.exit(1);
  }
  
  const mapping: FotMobMappingFile = JSON.parse(fs.readFileSync(MAPPING_FILE, 'utf-8'));
  const reverseMapping = createReverseFotMobMapping(mapping);
  log(`Loaded ${reverseMapping.size} team mappings`);

  const venues = loadVenueCoords();
  log(`Loaded ${venues.length} venue coordinates`);

  // Load matches
  const matchesRaw = fs.readFileSync(MATCHES_FILE, 'utf-8');
  const matches: Match[] = JSON.parse(matchesRaw);
  log(`Loaded ${matches.length} matches from matches.json`);

  // Create backup
  if (!dryRun) {
    fs.writeFileSync(BACKUP_FILE, matchesRaw);
    log(`Backup created: ${BACKUP_FILE}`, 'success');
  }

  // Determine dates to sync
  let datesToSync: string[] = [];

  if (specificDate) {
    datesToSync = [specificDate];
  } else {
    // Sync today and yesterday (to catch late-finishing matches)
    const today = new Date();
    const yesterday = subDays(today, 1);

    // Only sync if within World Cup date range
    if (today >= WC_START_DATE && today <= WC_END_DATE) {
      datesToSync.push(formatDate(today));
    }
    if (yesterday >= WC_START_DATE && yesterday <= WC_END_DATE) {
      datesToSync.push(formatDate(yesterday));
    }

    if (datesToSync.length === 0) {
      log('Current date is outside World Cup period (2026-06-11 to 2026-07-19)', 'warn');
      log('Use --date YYYYMMDD to sync a specific date');
      return;
    }
  }

  // Sync each date
  const totalResult: SyncResult = { updated: 0, skipped: 0, errors: 0, matches: [] };

  for (const dateStr of datesToSync) {
    log(`\nSyncing date: ${dateStr}`);
    const result = await syncMatchesForDate(dateStr, matches, reverseMapping, venues, dryRun);
    totalResult.updated += result.updated;
    totalResult.skipped += result.skipped;
    totalResult.errors += result.errors;
    totalResult.matches.push(...result.matches);
  }

  // Save updated matches
  if (!dryRun && totalResult.updated > 0) {
    fs.writeFileSync(MATCHES_FILE, JSON.stringify(matches, null, 2));
    log(`\nSaved ${totalResult.updated} updates to matches.json`, 'success');
  }

  // Summary
  log('\n' + '='.repeat(60));
  log('Sync Summary');
  log('='.repeat(60));
  log(`Updated: ${totalResult.updated}`);
  log(`Skipped: ${totalResult.skipped}`);
  log(`Errors: ${totalResult.errors}`);

  if (totalResult.matches.length > 0) {
    log('\nUpdated matches:');
    totalResult.matches.forEach(m => log(`  • ${m}`));
  }

  // Run bracket update after sync if there were updates
  if (!dryRun && totalResult.updated > 0) {
    log('\nRunning bracket update to propagate results...');
    const { execSync } = await import('child_process');
    try {
      execSync('pnpm update-bracket', { stdio: 'inherit', cwd: process.cwd() });
    } catch {
      log('Bracket update failed - run manually: pnpm update-bracket', 'error');
    }
  }
}

if (process.argv[1]?.includes('sync-fotmob')) {
  main().catch(error => {
    log(`Fatal error: ${error}`, 'error');
    process.exit(1);
  });
}
