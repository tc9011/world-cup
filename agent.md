# 2026 World Cup Guide - Project Documentation

## 1. Project Overview
A comprehensive, interactive guide for the 2026 FIFA World Cup (United States, Mexico, Canada). The application provides multiple views to explore the match schedule, team standings, and knockout brackets, featuring a modern, responsive design with deep personalization options including team-based theming and timezone management.

## 2. Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Core**: React 19
- **Styling**: Tailwind CSS v4 (with custom "Glassmorphism" theme)
- **State Management**: Zustand (with local storage persistence)
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Analytics**: Vercel Analytics
- **Language**: TypeScript

## 3. Architecture & Project Structure

### 3.1. Directory Structure
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
│   ├── views/              # (Conceptual grouping)
│   │   ├── BracketView.tsx     # Knockout stage visualization
│   │   ├── CalendarView.tsx    # Monthly calendar grid view
│   │   ├── ScheduleMatrix.tsx  # List view (Venue x Date)
│   │   └── StandingsView.tsx   # Group stage tables
│   ├── controls/           # (Conceptual grouping)
│   │   ├── FilterBar.tsx       # Group selection
│   │   ├── TeamSelector.tsx    # Team filtering
│   │   ├── ViewSwitcher.tsx    # Navigation between views
│   │   ├── LanguageSwitcher.tsx # EN/ZH toggle
│   │   ├── ThemeSelector.tsx   # Light/Dark & Team Theme picker
│   │   └── TimezoneSwitcher.tsx # Local/Venue time toggle
│   ├── MatchCard.tsx       # Reusable match display component
│   ├── MatchDetailModal.tsx # Detailed match info modal
│   └── ThemeProvider.tsx   # Handles dynamic CSS variable injection
├── data/                   # Static Data
│   ├── worldCupData.ts     # Core data (Teams, Venues, Matches)
│   ├── teamColors.ts       # Primary/Secondary colors for team themes
│   └── locales.ts          # Translation strings (en, zh)
├── store/                  # State Management
│   └── useStore.ts         # Global store (viewMode, filters, theme, timezone)
└── types/                  # TypeScript Definitions
    └── index.ts            # Domain models
```

### 3.2. State Management (Zustand)
The application uses a centralized store (`useStore.ts`) persisted to `localStorage`.
- **View State**: Current view mode (List, Calendar, Bracket, Standings).
- **Filters**: Selected Group, Selected Team, Favorites.
- **Preferences**: Language (en/zh), Timezone Mode (local/venue), Theme Mode (light/dark/system), Theme Team ID.

## 4. Key Features

### 4.1. Multi-View Visualization
- **List View (Schedule Matrix)**: Matrix format (Venues x Dates), grouped by Region (Western, Central, Eastern).
- **Calendar View**: Monthly calendar (June/July 2026) showing matches per day.
- **Bracket View**: Interactive tree visualization of the knockout stage (Round of 32 to Final).
- **Standings View**: Live-calculated group tables (Points, GF, GA, GD).

### 4.2. Advanced Personalization
- **Team-Based Theming**: Users can select a national team to apply its primary and secondary colors to the entire application UI.
- **Timezone Switching**: Toggle match times between:
  - **Local Time**: User's browser timezone.
  - **Venue Time**: Local time at the stadium location.
- **Appearance Modes**: Light, Dark, and System sync.
- **Internationalization**: Full English and Chinese (Simplified) support.

### 4.3. Interactive Elements
- **Match Details Modal**: Click on any match to view detailed info (Teams, Venue, Time, Status) in a responsive modal.
- **Smart Filtering**: Filter schedule and standings by specific Groups or Teams.
- **Favorites**: Mark teams as favorites (supported in data model/store).

### 4.4. SEO & Performance
- **Metadata**: Rich OpenGraph and Twitter Card tags.
- **Structured Data**: JSON-LD for `SportsEvent` schema.
- **PWA Ready**: Web manifest and icons.
- **Font Optimization**: Uses `next/font` with Geist Sans/Mono.

## 5. Data Model
- **Teams**: 48 teams with metadata (ID, Name, Code, Flag, Group).
- **Venues**: 16 Host Cities with Timezone and Region data.
- **Matches**: 104 matches with support for:
  - Stages: Group, R32, R16, QF, SF, 3rd, Final.
  - Status: Scheduled, Live, Finished.
  - Placeholders: "Winner of Match X", "1st Group A", etc.

## 6. UI/UX Design System
- **Theme**: "World Cup Atmosphere" with Glassmorphism.
- **Visuals**:
  - Radial gradient backgrounds.
  - Backdrop blur effects.
  - Smooth transitions and animations (fade-in, zoom-in).
- **Responsiveness**:
  - Mobile-first approach.
  - Horizontal scrolling for complex tables.
  - Adaptive modals and controls.
