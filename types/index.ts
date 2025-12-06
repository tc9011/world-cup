export interface Team {
  id: string;
  name: string;
  code: string; // e.g., USA, BRA
  flag: string; // emoji or url
  group: string;
}

export interface Venue {
  id: string;
  name: string;
  city: string;
  timezone: string; // e.g., "America/New_York"
  region: 'Western' | 'Central' | 'Eastern';
}

export interface Match {
  id: string;
  date: string; // ISO string
  group?: string; // "A", "B", etc. or undefined for knockout
  stage: 'Group Stage' | 'Round of 32' | 'Round of 16' | 'Quarter-finals' | 'Semi-finals' | 'Third place' | 'Final';
  homeTeamId: string;
  awayTeamId: string;
  venueId: string;
  score?: {
    home: number;
    away: number;
  };
  status: 'scheduled' | 'live' | 'finished';
}

export type ViewMode = 'list' | 'calendar' | 'bracket';
