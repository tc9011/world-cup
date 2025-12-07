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
- **Export**: html-to-image, qrcode
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
│   ├── BracketView.tsx     # Knockout stage visualization
│   ├── CalendarView.tsx    # Monthly calendar grid view
│   ├── ExportButton.tsx    # Export view to image functionality
│   ├── FilterBar.tsx       # Group selection
│   ├── GroupView.tsx       # Group display component
│   ├── LanguageSwitcher.tsx # EN/ZH toggle
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

## 4. Key Features
- **Multiple Views**: List, Calendar, Bracket, and Standings views.
- **Personalization**:
    - **Theming**: Light/Dark mode and Team-specific themes (changes primary colors based on selected team).
    - **Timezone**: Toggle between Local time and Venue time.
    - **Language**: English and Chinese (Simplified) support.
- **Filtering**: Filter matches by Group or specific Team.
- **Export**: Ability to export the current view as an image.
- **Responsive Design**: Optimized for both desktop and mobile devices with a glassmorphism aesthetic.
