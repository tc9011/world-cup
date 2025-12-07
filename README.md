# 🏆 2026 World Cup Guide

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.0-blue?style=flat-square&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=flat-square&logo=tailwindcss)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

A comprehensive, interactive guide for the **2026 FIFA World Cup** (United States, Mexico, Canada). This application provides a modern, responsive interface to explore match schedules, standings, and knockout brackets with deep personalization options.

## ✨ Features

- **📅 Multi-View Schedule**
  - **List View**: Comprehensive matrix of matches by venue and date.
  - **Calendar View**: Monthly calendar grid for quick date-based navigation.
  - **Bracket View**: Interactive visualization of the knockout stages.
  - **Standings View**: Real-time group stage tables.

- **🎨 Deep Personalization**
  - **Team Themes**: Select your favorite team to theme the entire UI with their colors.
  - **Dark/Light Mode**: Fully supported with system preference sync.
  - **Glassmorphism Design**: Modern, sleek UI with blur effects.

- **🌍 Global Accessibility**
  - **Timezone Management**: Toggle between **Local Time** (your browser) and **Venue Time** (stadium location).
  - **Internationalization**: Full support for **English** and **Chinese (Simplified)**.

- **📤 Sharing**
  - Export current views as high-quality images.
  - QR code generation for easy sharing.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) (with persistence)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Utilities**: `date-fns`, `html-to-image`, `qrcode`

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm/yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/tc9011/world-cup.git
   cd world-cup
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Run the development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000).

## 📂 Project Structure

```
/
├── app/                # Next.js App Router pages & layouts
├── components/         # Reusable UI components
├── data/               # Static JSON data (matches, teams, venues)
├── store/              # Zustand state management
└── types/              # TypeScript definitions
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## ☕ Support

If you find this project helpful, consider buying me a coffee!

<a href="https://buymeacoffee.com/tc9011" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>
