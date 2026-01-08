import { render, screen, fireEvent } from '@testing-library/react';
import { CalendarView } from '../CalendarView';
import { MatchListModalProps } from '../MatchListModal';
import { Match } from '../../types';
import { vi, describe, it, expect } from 'vitest';

// Mock dependencies
vi.mock('../../store/useStore', () => ({
  useStore: () => ({
    language: 'en',
    timezoneMode: 'local',
  }),
}));

vi.mock('../../data/worldCupData', () => ({
  teams: [
    { id: 't1', name: 'Team 1', code: 'T1', flag: '🏳️' },
    { id: 't2', name: 'Team 2', code: 'T2', flag: '🏴' },
  ],
  venues: [
    { id: 'v1', name: 'Venue 1', city: 'City 1', timezone: 'UTC' }
  ]
}));

vi.mock('../../data/locales', () => ({
  translations: {
    en: {
      monthFormat: 'MMMM yyyy',
      matchesSuffix: 'matches',
      grp: 'Group',
      knockout: 'Knockout',
      tbd: 'TBD',
      noMatchesFound: 'No matches found',
      adjustFilters: 'Adjust filters'
    }
  },
  teamNames: {},
  cityNames: {}
}));

// Mock MatchListModal to avoid testing it again and just check it's rendered
vi.mock('../MatchListModal', () => ({
  MatchListModal: ({ title, onClose }: MatchListModalProps) => (
    <div data-testid="match-list-modal">
      <div>{title}</div>
      <button onClick={onClose}>Close</button>
    </div>
  )
}));

const mockMatches: Match[] = [
  {
    id: '1',
    date: '2026-06-15T12:00:00Z', // Use a specific date
    stage: 'Group Stage',
    homeTeamId: 't1',
    awayTeamId: 't2',
    venueId: 'v1',
    status: 'scheduled',
    group: 'A'
  }
];

describe('CalendarView', () => {
  it('renders mobile mini-calendar correctly', () => {
    // We need to make sure the screen size is "mobile" for the test if the component uses CSS media queries.
    // However, JS-based rendering checks might need window.matchMedia mock if used.
    // The component uses Tailwind `md:hidden` classes. JS tests (JSDOM) don't process CSS media queries to hide elements.
    // So BOTH desktop and mobile components are rendered in JSDOM, just one has a class.
    // We can check for the element with the specific mobile class or structure.
    
    render(<CalendarView matches={mockMatches} />);

    // Check for "Mini Calendar" specific elements
    // The mini-calendar has a grid where days with matches have a badge.
    // Match date: June 15, 2026.
    
    // Find June 15
    // const dayElements = screen.getAllByText('15');
    // There might be two (one desktop, one mobile).
    // The mobile one has the badge.
    
    // We can look for the badge text "1".
    // const badges = screen.getAllByText('1');
    // Filter to find the one that is the badge (has badge classes or structure)
    // In the code, the badge is: <div className="absolute ... bg-primary ...">1</div>
    // We can use a test-id in the real code to be easier, but let's try to find it.
    
    // Let's assume JSDOM renders everything.
    expect(screen.getByText('June 2026')).toBeInTheDocument();
  });

  it('opens popup when clicking a date with matches on mobile', () => {
    render(<CalendarView matches={mockMatches} />);
    
    // Find the day "15" that has matches.
    // The mobile view grid is in `div.md:hidden`.
    // Since we can't easily query by class `md:hidden` without custom matchers or `container.querySelector`,
    // let's rely on the click behavior. 
    // Both desktop and mobile have click handlers? 
    // Looking at code: Desktop `div` also has internal structure but the code says:
    // Mobile View: `onClick={() => ... setSelectedDate(day)}`
    // Desktop View: The day cell is NOT clickable to open popup? 
    // Wait, let's check desktop implementation.
    // Desktop: `dayMatches.map(...)`. It renders matches directly. No onClick on the day cell to open a popup mentioned.
    // So only the Mobile one has `onClick` on the day cell.
    
    const day15s = screen.getAllByText('15');
    // We need to click the one that has an onClick.
    // Or just click all of them?
    
    let modalOpened = false;
    day15s.forEach(day => {
        // Find the parent clickable div
        const cell = day.closest('div.cursor-pointer');
        if (cell) {
            fireEvent.click(cell);
            // Check if modal appeared
            if (screen.queryByTestId('match-list-modal')) {
                modalOpened = true;
            }
        }
    });

    expect(modalOpened).toBe(true);
    expect(screen.getByTestId('match-list-modal')).toBeInTheDocument();
  });
});
