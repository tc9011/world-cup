'use client';

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import MapGL, { Marker, NavigationControl, MapRef } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { venues, teams } from '../data/worldCupData';
import { Venue, Match } from '../types';
import { useStore } from '../store/useStore';
import { format } from 'date-fns';
import { X, Calendar, MapPin } from 'lucide-react';
import { cityNames, translations } from '../data/locales';

// Note: In a real application, this should be in an environment variable
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN; 

interface MapViewProps {
  matches: Match[];
}

export const MapView: React.FC<MapViewProps> = ({ matches: filteredMatches }) => {
  const { language, timezoneMode, themeMode } = useStore();
  const t = translations[language];
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [mounted, setMounted] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const mapRef = useRef<MapRef>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const updateMapLanguage = useCallback(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    const style = map.getStyle();
    if (!style || !style.layers) return;

    const labelField = language === 'zh' ? 'name_zh-Hans' : 'name_en';

    style.layers.forEach((layer) => {
      if (layer.type === 'symbol' && layer.layout && layer.layout['text-field']) {
        // Only update layers that use the composite source (standard Mapbox layers)
        // and have a text-field property
        if (layer.source === 'composite') {
          try {
            map.setLayoutProperty(layer.id, 'text-field', [
              'coalesce',
              ['get', labelField],
              ['get', 'name']
            ]);
          } catch (e) {
            // Ignore errors for layers that might not support this property
            console.debug('Failed to update layer language:', layer.id, e);
          }
        }
      }
    });
  }, [language]);

  // Update language when map loads or language changes
  useEffect(() => {
    if (!mapReady) return;
    
    const map = mapRef.current?.getMap();
    if (!map) return;

    if (map.isStyleLoaded()) {
      updateMapLanguage();
    }

    const handleStyleLoad = () => {
      updateMapLanguage();
    };

    map.on('style.load', handleStyleLoad);
    return () => {
      map.off('style.load', handleStyleLoad);
    };
  }, [mapReady, updateMapLanguage, isDark]); // Re-run when style changes (isDark)

  useEffect(() => {
    const checkDark = () => {
      if (themeMode === 'system') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      return themeMode === 'dark';
    };

    // Use setTimeout to avoid synchronous state update warning
    const timer = setTimeout(() => {
      setIsDark(checkDark());
    }, 0);

    if (themeMode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
      mediaQuery.addEventListener('change', handler);
      return () => {
        mediaQuery.removeEventListener('change', handler);
        clearTimeout(timer);
      };
    }
    
    return () => clearTimeout(timer);
  }, [themeMode]);

  // Helper to get display date based on timezone mode
  const getDisplayDate = (date: Date, timezone: string | undefined) => {
    if (timezoneMode === 'local' || !timezone) return date;

    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric', month: 'numeric', day: 'numeric',
      hour: 'numeric', minute: 'numeric', second: 'numeric',
      hour12: false
    }).formatToParts(date);

    const part = (type: string) => parseInt(parts.find(p => p.type === type)?.value || '0');
    return new Date(part('year'), part('month') - 1, part('day'), part('hour'), part('minute'), part('second'));
  };

  const venueMatches = useMemo(() => {
    const map = new Map<string, Match[]>();
    filteredMatches.forEach(match => {
      if (!map.has(match.venueId)) {
        map.set(match.venueId, []);
      }
      map.get(match.venueId)?.push(match);
    });
    
    // Sort matches by date
    map.forEach((matches: Match[]) => {
      matches.sort((a: Match, b: Match) => new Date(a.date).getTime() - new Date(b.date).getTime());
    });
    
    return map;
  }, [filteredMatches]);

  const getTeam = (id: string) => teams.find(t => t.id === id);

  if (!mounted) {
    return <div className="w-full h-[600px] rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />;
  }

  return (
    <div className="w-full h-[600px] rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 relative bg-gray-100 dark:bg-gray-800">
      <MapGL
        ref={mapRef}
        onLoad={() => setMapReady(true)}
        initialViewState={{
          longitude: -95,
          latitude: 37,
          zoom: 3
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle={isDark 
          ? "mapbox://styles/mapbox/dark-v11"
          : "mapbox://styles/mapbox/streets-v12"
        }
        mapboxAccessToken={MAPBOX_TOKEN}
        preserveDrawingBuffer={true}
      >
        <NavigationControl position="top-right" />

        {venues.map((venue) => (
          venue.coordinates && venueMatches.has(venue.id) && (
            <Marker
              key={venue.id}
              longitude={venue.coordinates.lng}
              latitude={venue.coordinates.lat}
              anchor="bottom"
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onClick={(e: any) => {
                e.originalEvent.stopPropagation();
                setSelectedVenue(venue);
              }}
            >
              <div className="cursor-pointer transform hover:scale-110 transition-transform group">
                <div className="text-2xl drop-shadow-md">🏟️</div>
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 text-xs px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                  {language === 'zh' ? cityNames[venue.city] || venue.city : venue.city}
                </div>
              </div>
            </Marker>
          )
        ))}

        {selectedVenue && mounted && createPortal(
          <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setSelectedVenue(null)}>
            <div 
              className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/5 animate-in zoom-in-95 duration-200"
              onClick={e => e.stopPropagation()}
            >
              {/* Header Content */}
              <div className="relative p-6">
                {/* Header Background with Gradient */}
                <div className="absolute top-0 left-0 right-0 h-32 bg-linear-to-br from-primary/20 to-accent/20 dark:from-primary/10 dark:to-accent/10" />

                <button 
                  onClick={() => setSelectedVenue(null)}
                  className="absolute top-4 right-4 p-2 bg-white/50 dark:bg-black/50 hover:bg-white dark:hover:bg-black rounded-full backdrop-blur-md transition-colors z-10"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
                <h3 className="font-bold text-2xl pr-8 leading-tight mb-1 text-gray-900 dark:text-white">
                  {language === 'zh' ? cityNames[selectedVenue.city] || selectedVenue.city : selectedVenue.city}
                </h3>
                <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 text-sm font-medium mb-2">
                  <MapPin size={14} />
                  <span>{selectedVenue.name}</span>
                </div>
                <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300 text-sm">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={16} />
                    <span>
                      {venueMatches.get(selectedVenue.id)?.length || 0} {t.matchesCount}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Matches List */}
              <div className="max-h-[60vh] overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-800/50">
                {venueMatches.get(selectedVenue.id)?.map((match: Match) => {
                  const homeTeam = getTeam(match.homeTeamId);
                  const awayTeam = getTeam(match.awayTeamId);
                  const date = getDisplayDate(new Date(match.date), selectedVenue.timezone);
                  
                  return (
                    <div key={match.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all group">
                      {/* Date & Stage */}
                      <div className="flex justify-between items-center mb-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={14} />
                          <span>{format(date, 'MMM d, HH:mm')}</span>
                        </div>
                        <span className="px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full font-medium text-xs uppercase tracking-wide">
                          {match.stage}
                        </span>
                      </div>
                      
                      {/* Teams */}
                      <div className="flex items-center justify-between gap-4">
                        {/* Home */}
                        <div className="flex flex-col items-center flex-1 gap-2">
                          <span className="text-4xl drop-shadow-sm transform group-hover:scale-110 transition-transform duration-300">{homeTeam?.flag || '🏳️'}</span>
                          <span className="font-bold text-base text-gray-900 dark:text-gray-100 text-center leading-tight">
                            {homeTeam?.code || match.homeTeamId}
                          </span>
                        </div>
                        
                        {/* VS */}
                        <div className="flex flex-col items-center justify-center w-10">
                          <span className="text-sm font-bold text-gray-300 dark:text-gray-600">VS</span>
                        </div>

                        {/* Away */}
                        <div className="flex flex-col items-center flex-1 gap-2">
                          <span className="text-4xl drop-shadow-sm transform group-hover:scale-110 transition-transform duration-300">{awayTeam?.flag || '🏳️'}</span>
                          <span className="font-bold text-base text-gray-900 dark:text-gray-100 text-center leading-tight">
                            {awayTeam?.code || match.awayTeamId}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {(!venueMatches.get(selectedVenue.id) || venueMatches.get(selectedVenue.id)?.length === 0) && (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-500">
                    <Calendar size={48} className="mb-3 opacity-50" />
                    <p className="text-base italic">
                      {t.noMatches}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
      </MapGL>
    </div>
  );
};
