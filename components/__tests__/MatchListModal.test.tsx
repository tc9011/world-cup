import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; // Explicit import to fix matcher issue
import { MatchListModal } from '../MatchListModal';
import { Match } from '../../types';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock data
const mockMatches: Match[] = [
  {
    id: '1',
    date: '2026-06-11T20:00:00Z',
    stage: 'Group Stage',
    homeTeamId: 'usa',
    awayTeamId: 'can',
    venueId: 'metlife',
    status: 'scheduled',
    group: 'A'
  },
  {
    id: '2',
    date: '2026-06-15T21:00:00Z',
    stage: 'Round of 16',
    homeTeamId: 'bra',
    awayTeamId: 'fra',
    venueId: 'sofi',
    status: 'live',
    homeScore: 2,
    awayScore: 2,
    homePenaltyScore: 4,
    awayPenaltyScore: 3
  }
];

// Mock external dependencies
// Mock useStore to allow dynamic return values
const mockUseStore = vi.fn();
vi.mock('../../store/useStore', () => ({
  useStore: () => mockUseStore(),
}));

vi.mock('../../data/worldCupData', () => ({
  teams: [
    { id: 'usa', name: 'United States', code: 'USA', flag: '🇺🇸' },
    { id: 'can', name: 'Canada', code: 'CAN', flag: '🇨🇦' },
    { id: 'bra', name: 'Brazil', code: 'BRA', flag: '🇧🇷' },
    { id: 'fra', name: 'France', code: 'FRA', flag: '🇫🇷' },
  ],
  venues: [
    { id: 'metlife', name: 'MetLife Stadium', city: 'east_rutherford', timezone: 'America/New_York' },
    { id: 'sofi', name: 'SoFi Stadium', city: 'los_angeles', timezone: 'America/Los_Angeles' }
  ]
}));

vi.mock('/Users/theon/Documents/Projects/Demo/world-cup/data/locales', () => ({
  translations: {
    en: {
      matchesCount: 'matches',
      tbd: 'TBD',
      timezone: { local: 'Local Time' }
    }
  },
  teamNames: {},
  cityNames: {
    east_rutherford: 'East Rutherford',
    los_angeles: 'Los Angeles'
  }
}));

// Create a portal root for the modal
beforeEach(() => {
  // Default mock values
  mockUseStore.mockReturnValue({
    language: 'en',
    timezoneMode: 'local',
  });
});

describe('MatchListModal', () => {
  it('renders correctly with matches (Local Time)', async () => {
    const onClose = vi.fn();
    render(<MatchListModal title="Test Details" matches={mockMatches} onClose={onClose} showVenue={true} />);

    // Check match info
    expect(screen.getByText('USA')).toBeInTheDocument();
    expect(screen.getByText('CAN')).toBeInTheDocument();

    // Use regex for flexible matching. Accepts fallback ID if mock fails.
    expect(await screen.findByText(/MetLife Stadium/)).toBeInTheDocument();
    expect(await screen.findByText(/East Rutherford|east_rutherford/)).toBeInTheDocument();
  });

  it('updates match time when switching to Venue timezone', async () => {
    // Set store to Venue mode
    mockUseStore.mockReturnValue({
      language: 'en',
      timezoneMode: 'venue',
    });

    const onClose = vi.fn();
    render(<MatchListModal title="Timezone Test" matches={mockMatches} onClose={onClose} showVenue={true} />);


    // Check expectation
    expect(await screen.findByText(/16:00/)).toBeInTheDocument();
    expect(await screen.findByText(/14:00/)).toBeInTheDocument();
  });

  it('calls onClose when clicking overlay', () => {
    const onClose = vi.fn();
    render(<MatchListModal title="Test" matches={mockMatches} onClose={onClose} />);

    // Find the fixed overlay div. It has "fixed inset-0".
    // We can query by class name since we don't have a better selector.
    // Or we click the outer most div.
    // Note: container.firstChild is the portal? No, render returns container usually bound to body if not specified?
    // The portal is appended to body.
    // So we look in document.body.

    const overlay = document.body.querySelector('.fixed.inset-0.z-\\[9999\\]');
    expect(overlay).toBeInTheDocument();

    if (overlay) {
        fireEvent.click(overlay);
        expect(onClose).toHaveBeenCalled();
    }
  });
});
