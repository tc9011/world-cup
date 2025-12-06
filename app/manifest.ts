import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '2026 FIFA World Cup Guide',
    short_name: 'FIFA WC 2026',
    description: 'Comprehensive guide for the 2026 FIFA World Cup in USA, Mexico, and Canada.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#ffd700',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
