# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A comprehensive, interactive guide for the 2026 FIFA World Cup (United States, Mexico, Canada). The application provides multiple views to explore the match schedule, team standings, and knockout brackets, featuring a modern, responsive design with deep personalization options including team-based theming and timezone management.

## Development Commands

```bash
pnpm install          # Install dependencies (pnpm preferred)
pnpm dev              # Start dev server at localhost:3000
pnpm build            # Production build
pnpm lint             # Run ESLint
```

**Environment**: Requires `NEXT_PUBLIC_MAPBOX_TOKEN` in `.env.local` for MapView.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Core**: React 19
- **Styling**: Tailwind CSS v4 (with custom "Glassmorphism" theme)
- **State Management**: Zustand (with localStorage persistence)
- **Maps**: Mapbox GL JS, React Map GL
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Export**: html-to-image, qrcode
- **Analytics**: Vercel Analytics
- **Language**: TypeScript

## Architecture & Project Structure

```
/
├── app/                    # Next.js App Router
│   ├── globals.css         # Global styles, Tailwind theme, CSS variables
│   ├── layout.tsx          # Root layout, Font setup (Geist), Metadata, ThemeProvider
│   ├── page.tsx            # Main application entry, layout composition
│   ├── icon.tsx            # Dynamic Favicon generation
│   ├── manifest.ts         # PWA Manifest
│   ├── robots.ts           # SEO Robots configuration
│   └── sitemap.ts          # SEO Sitemap generation
├── components/             # UI Components
│   ├── BracketView.tsx     # Knockout stage visualization
│   ├── CalendarView.tsx    # Monthly calendar grid view
│   ├── ExportButton.tsx    # Export view to image functionality
│   ├── FilterBar.tsx       # Group selection
│   ├── DateFilter.tsx      # Date range picker with calendar popover
│   ├── GroupView.tsx       # Group display component
│   ├── LanguageSwitcher.tsx # EN/ZH toggle
│   ├── MapView.tsx         # Interactive map view with venue details
│   ├── MatchCard.tsx       # Reusable match display component
│   ├── MatchDetailModal.tsx # Detailed match info modal
│   ├── ScheduleMatrix.tsx  # List view (Venue x Date)
│   ├── StandingsView.tsx   # Group stage tables
│   ├── TeamSelector.tsx    # Team filtering
│   ├── ThemeProvider.tsx   # Handles dynamic CSS variable injection
│   ├── ThemeSelector.tsx   # Light/Dark & Team Theme picker
│   ├── TimezoneSwitcher.tsx # Local/Venue time toggle
│   └── ViewSwitcher.tsx    # Navigation between views
├── data/                   # Static Data
│   ├── worldCupData.ts     # Core data loader (Teams, Venues, Matches)
│   ├── matches.json        # Match schedule data
│   ├── teams.json          # Team data
│   ├── venues.json         # Venue data
│   ├── teamColors.ts       # Primary/Secondary colors for team themes
│   └── locales.ts          # Translation strings (en, zh)
├── store/                  # State Management
│   └── useStore.ts         # Global store (viewMode, filters, theme, timezone)
├── types/                  # TypeScript Definitions
│   └── index.ts            # Core interfaces (Team, Match, Venue, ViewMode)
```

## Key Features

- **Multiple Views**: List, Calendar, Map, Bracket, and Standings views
- **Personalization**:
    - **Theming**: Light/Dark mode and Team-specific themes (changes primary colors based on selected team)
    - **Timezone**: Toggle between Local time and Venue time
    - **Language**: English and Chinese (Simplified) support
- **Filtering**:
    - Filter matches by Group or specific Team
    - **Date Range**: Filter matches by a specific date range using an interactive calendar picker (available in List, Calendar, and Map views)
- **Export**: Ability to export the current view as an image
- **Responsive Design**: Optimized for both desktop and mobile devices with a glassmorphism aesthetic

## State Management Pattern

The Zustand store (`store/useStore.ts`) has two persistence behaviors:
- **Persisted** (localStorage): `language`, `timezoneMode`, `themeTeamId`, `themeMode`
- **Session-only**: `viewMode`, `selectedGroup`, `selectedTeam`, `dateRange`, `favorites`

## Data Flow

Match times are stored in UTC in `matches.json`. Components convert times client-side based on:
- `timezoneMode: 'local'` - user's browser timezone
- `timezoneMode: 'venue'` - stadium timezone from `venues.json`

## Theming System

- CSS variables defined in `app/globals.css` with light/dark variants
- Team theming via `ThemeProvider.tsx` injects team-specific colors from `data/teamColors.ts`
- Glass-panel styling uses `.glass-panel` utility class

## Internationalization

Two languages (en/zh) defined in `data/locales.ts`. Access via the store's `language` state and `translations[language]` pattern.

## Component Patterns

- **ViewSwitcher**: Controls which of the 5 views is displayed
- **MatchCard**: Reusable match display used across views
- **MatchDetailModal**: Modal for detailed match info (scores, penalties)
- **ThemeProvider**: Must wrap app to enable dynamic CSS variable injection
