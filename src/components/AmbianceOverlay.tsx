"use client";

import React from 'react';
import { useTimeAmbiance } from '@/hooks/useTimeAmbiance';

export const AmbianceOverlay: React.FC = () => {
    const { timeOfDay, isClient } = useTimeAmbiance();

    if (!isClient) return null;

    return (
        <div className="pointer-events-none fixed inset-0 z-[100] mix-blend-overlay overflow-hidden">
            {/* Morning: Brightness/Warmth */}
            <div
                className={`absolute inset-0 bg-yellow-100/10 transition-opacity duration-1000 ${timeOfDay === 'morning' ? 'opacity-100' : 'opacity-0'
                    }`}
            />

            {/* Evening/Night: Darkness and Subtle Vignette */}
            <div
                className={`absolute inset-0 bg-black/20 transition-opacity duration-1000 ${(timeOfDay === 'evening' || timeOfDay === 'night') ? 'opacity-100' : 'opacity-0'
                    }`}
            />

            {/* Noise overlay for evening/night to give a lofi vibe */}
            <div
                className={`absolute inset-0 opacity-[0.03] transition-opacity duration-1000 ${(timeOfDay === 'evening' || timeOfDay === 'night') ? 'opacity-100' : 'opacity-0'
                    }`}
                style={{
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")'
                }}
            />
        </div>
    );
};
