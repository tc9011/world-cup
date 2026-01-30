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

// ============================================================================
// Types
// ============================================================================

interface Match {
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

interface FotMobTeamMapping {
  fotmobId: number;
  name: string;
}

interface FotMobMappingFile {
  leagueId: number;
  leagueName: string;
  teamIdMapping: Record<string, FotMobTeamMapping>;
}

interface FotMobMatch {
  id: number;
  leagueId: number;
  time: string;
  home: {
    id: number;
    score?: number;
    name: string;
    longName: string;
  };
  away: {
    id: number;
    score?: number;
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

const FOTMOB_BASE_URL = 'https://www.fotmob.com/api';
const WORLD_CUP_LEAGUE_ID = 77; // FIFA World Cup

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

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

function parseDate(dateStr: string): Date {
  // Format: YYYYMMDD
  const year = parseInt(dateStr.slice(0, 4), 10);
  const month = parseInt(dateStr.slice(4, 6), 10) - 1;
  const day = parseInt(dateStr.slice(6, 8), 10);
  return new Date(year, month, day);
}

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
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

    // Find World Cup league
    const wcLeague = data.leagues?.find(l => l.id === WORLD_CUP_LEAGUE_ID);
    if (!wcLeague) {
      log(`No World Cup matches found for ${dateStr}`, 'info');
      return [];
    }

    log(`Found ${wcLeague.matches?.length || 0} World Cup matches for ${dateStr}`, 'success');
    return wcLeague.matches || [];
  } catch (error) {
    log(`Failed to fetch matches for ${dateStr}: ${error}`, 'error');
    return [];
  }
}

async function fetchMatchDetails(matchId: number): Promise<FotMobMatchDetail | null> {
  const url = `${FOTMOB_BASE_URL}/matchDetails?matchId=${matchId}`;
  
  try {
    await sleep(RATE_LIMIT_DELAY_MS);
    const response = await fetchWithRetry(url);
    return await response.json();
  } catch (error) {
    log(`Failed to fetch match details for ${matchId}: ${error}`, 'error');
    return null;
  }
}

// ============================================================================
// Match Mapping & Processing
// ============================================================================

function createReverseFotMobMapping(mapping: FotMobMappingFile): Map<number, string> {
  const reverse = new Map<number, string>();
  for (const [ourId, fotmobData] of Object.entries(mapping.teamIdMapping)) {
    reverse.set(fotmobData.fotmobId, ourId);
  }
  return reverse;
}

function findMatchingLocalMatch(
  fotmobMatch: FotMobMatch,
  localMatches: Match[],
  reverseMapping: Map<number, string>
): Match | undefined {
  const fotmobDate = new Date(fotmobMatch.status.utcTime);
  const homeTeamId = reverseMapping.get(fotmobMatch.home.id);
  const awayTeamId = reverseMapping.get(fotmobMatch.away.id);

  if (!homeTeamId || !awayTeamId) {
    log(`Unknown team ID: home=${fotmobMatch.home.id} (${fotmobMatch.home.name}), away=${fotmobMatch.away.id} (${fotmobMatch.away.name})`, 'warn');
    return undefined;
  }

  // First try exact match by stored fotmobMatchId
  const exactMatch = localMatches.find(m => m.fotmobMatchId === fotmobMatch.id);
  if (exactMatch) return exactMatch;

  // Then try by date and teams
  return localMatches.find(m => {
    const matchDate = new Date(m.date);
    const sameDay = isSameDay(matchDate, fotmobDate);
    const teamsMatch = 
      (m.homeTeamId === homeTeamId && m.awayTeamId === awayTeamId) ||
      (m.homeTeamId === awayTeamId && m.awayTeamId === homeTeamId); // Handle swapped home/away
    
    return sameDay && teamsMatch;
  });
}

interface PenaltyScores {
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

interface SyncResult {
  updated: number;
  skipped: number;
  errors: number;
  matches: string[];
}

async function syncMatchesForDate(
  dateStr: string,
  localMatches: Match[],
  reverseMapping: Map<number, string>,
  dryRun: boolean
): Promise<SyncResult> {
  const result: SyncResult = { updated: 0, skipped: 0, errors: 0, matches: [] };
  
  const fotmobMatches = await fetchMatchesByDate(dateStr);
  
  for (const fm of fotmobMatches) {
    // Only process finished matches
    if (!fm.status.finished) {
      log(`Match ${fm.id} not finished yet (${fm.home.name} vs ${fm.away.name})`, 'info');
      result.skipped++;
      continue;
    }

    const localMatch = findMatchingLocalMatch(fm, localMatches, reverseMapping);
    if (!localMatch) {
      log(`No matching local match for FotMob ${fm.id}: ${fm.home.name} vs ${fm.away.name}`, 'warn');
      result.errors++;
      continue;
    }

    // Check if already synced with same scores
    if (
      localMatch.status === 'finished' &&
      localMatch.homeScore === (fm.home.score ?? null) &&
      localMatch.awayScore === (fm.away.score ?? null)
    ) {
      log(`Match ${localMatch.id} already synced`, 'info');
      result.skipped++;
      continue;
    }

    // Determine if we need penalty scores (knockout stage with draw)
    const isKnockout = localMatch.stage !== 'Group Stage';
    const isDraw = fm.home.score === fm.away.score;
    let penaltyScores: PenaltyScores | null = null;

    if (isKnockout && isDraw && fm.status.finished) {
      log(`Fetching penalty details for ${localMatch.id}...`);
      penaltyScores = await extractPenaltyScores(fm.id);
      
      if (penaltyScores) {
        log(`Penalties: ${penaltyScores.home} - ${penaltyScores.away}`, 'info');
      } else {
        // Draw in knockout without penalties might mean extra time decided it
        // Check scoreStr for AET indicator
        const scoreStr = fm.status.scoreStr || '';
        if (!scoreStr.includes('AET') && !scoreStr.includes('Pen')) {
          log(`Draw in knockout but no penalty/AET info for ${localMatch.id}`, 'warn');
        }
      }
    }

    // Prepare update
    const update = {
      homeScore: fm.home.score ?? null,
      awayScore: fm.away.score ?? null,
      homePenaltyScore: penaltyScores?.home ?? null,
      awayPenaltyScore: penaltyScores?.away ?? null,
      status: 'finished' as const,
      fotmobMatchId: fm.id,
    };

    const matchDesc = `${localMatch.id}: ${localMatch.homeTeamId} ${update.homeScore}-${update.awayScore} ${localMatch.awayTeamId}`;
    
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

async function main(): Promise<void> {
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
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

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
    const result = await syncMatchesForDate(dateStr, matches, reverseMapping, dryRun);
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

main().catch(error => {
  log(`Fatal error: ${error}`, 'error');
  process.exit(1);
});
