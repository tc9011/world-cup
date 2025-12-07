'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import MapGL, { Marker, NavigationControl } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { venues, teams } from '../data/worldCupData';
import { Venue, Match } from '../types';
import { useStore } from '../store/useStore';
import { format } from 'date-fns';
import { X, MapPin, Calendar } from 'lucide-react';
import { cityNames } from '../data/locales';

// Note: In a real application, this should be in an environment variable
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN; 

interface MapViewProps {
  matches: Match[];
}

export const MapView: React.FC<MapViewProps> = ({ matches: filteredMatches }) => {
  const { language, timezoneMode } = useStore();
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

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
        initialViewState={{
          longitude: -95,
          latitude: 37,
          zoom: 3
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        <NavigationControl position="top-right" />

        {venues.map((venue) => (
          venue.coordinates && (
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
                  {venue.name}
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
              {/* Header */}
              <div className="relative bg-linear-to-r from-blue-600 to-blue-800 p-6 text-white">
                <button 
                  onClick={() => setSelectedVenue(null)}
                  className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
                <h3 className="font-bold text-2xl pr-8 leading-tight">{selectedVenue.name}</h3>
                <div className="flex items-center gap-4 text-blue-100 text-sm mt-2">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={16} />
                    <span>{language === 'zh' ? cityNames[selectedVenue.city] || selectedVenue.city : selectedVenue.city}</span>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-blue-300/50" />
                  <div className="flex items-center gap-1.5">
                    <Calendar size={16} />
                    <span>
                      {venueMatches.get(selectedVenue.id)?.length || 0} {language === 'zh' ? '场比赛' : 'Matches'}
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
                      {language === 'zh' ? '暂无符合条件的比赛' : 'No matches scheduled'}
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
