import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '2026 FIFA World Cup Guide',
    short_name: 'FIFA WC 2026',
    description: 'Comprehensive guide for the 2026 FIFA World Cup in USA, Mexico, and Canada.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#2563eb',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
