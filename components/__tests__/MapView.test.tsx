import { render, screen, act } from '@testing-library/react';
import { MapView } from '../MapView';
import React from 'react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock dependencies
vi.mock('react-map-gl/mapbox', () => {
  const MockMapGL = vi.fn(({ children, ...props }) => (
    <div data-testid="map-gl" data-props={JSON.stringify(props)}>
      {children}
    </div>
  ));
  return {
    __esModule: true,
    default: MockMapGL,
    Marker: vi.fn(() => <div />),
    NavigationControl: vi.fn(() => <div />),
  };
});

vi.mock('../store/useStore', () => ({
  useStore: () => ({
    language: 'en',
    timezoneMode: 'local',
    themeMode: 'system',
  }),
}));

const mockMatches: any[] = []; // eslint-disable-line @typescript-eslint/no-explicit-any

describe('MapView', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('passes preserveDrawingBuffer=true to MapGL', async () => {
    render(<MapView matches={mockMatches} />);

    // Fast-forward useEffect
    act(() => {
      vi.runAllTimers();
    });

    // Use getByTestId because we expect it to be rendered now
    const map = screen.getByTestId('map-gl');
    const props = JSON.parse(map.getAttribute('data-props') || '{}');

    // This assertion should fail initially
    expect(props.preserveDrawingBuffer).toBe(true);
  });
});
