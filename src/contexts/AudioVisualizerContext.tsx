"use client";

import React, { createContext, useContext, useState, useRef, ReactNode } from 'react';

interface AudioContextType {
    analyser: AnalyserNode | null;
    initAudioContext: (audioElement: HTMLAudioElement) => void;
}

const GlobalAudioContext = createContext<AudioContextType>({
    analyser: null,
    initAudioContext: () => { },
});

export const useAudioVisualizer = () => useContext(GlobalAudioContext);

export const AudioVisualizerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const connectedElementRef = useRef<HTMLAudioElement | null>(null);

    const initAudioContext = (audioElement: HTMLAudioElement) => {
        try {
            const AudioContextCtor = window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioContextCtor) return;

            let ctx = audioContextRef.current;
            if (!ctx) {
                ctx = new AudioContextCtor();
                audioContextRef.current = ctx;
            }

            if (ctx.state === 'suspended') {
                ctx.resume();
            }

            // Return early if we already connected this specific audio element
            if (connectedElementRef.current === audioElement) {
                return;
            }

            let analyserNode = analyser;
            if (!analyserNode) {
                analyserNode = ctx.createAnalyser();
                analyserNode.fftSize = 256;
                analyserNode.smoothingTimeConstant = 0.8;
                setAnalyser(analyserNode);
            }

            const source = ctx.createMediaElementSource(audioElement);
            source.connect(analyserNode);
            analyserNode.connect(ctx.destination);

            connectedElementRef.current = audioElement;
        } catch (e) {
            console.warn("Could not initialize AudioContext", e);
        }
    };

    return (
        <GlobalAudioContext.Provider value={{ analyser, initAudioContext }}>
            {children}
        </GlobalAudioContext.Provider>
    );
};
