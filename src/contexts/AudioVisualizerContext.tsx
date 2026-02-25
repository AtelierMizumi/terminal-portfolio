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
    const isInitialized = useRef(false);

    const initAudioContext = (audioElement: HTMLAudioElement) => {
        if (isInitialized.current) return;

        try {
            // Create AudioContext only after user interaction
            const AudioContextCtor = window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioContextCtor) return;

            const ctx = new AudioContextCtor();
            const source = ctx.createMediaElementSource(audioElement);
            const analyserNode = ctx.createAnalyser();

            // Configure analyser
            analyserNode.fftSize = 256;
            analyserNode.smoothingTimeConstant = 0.8;

            source.connect(analyserNode);
            analyserNode.connect(ctx.destination);

            setAnalyser(analyserNode);
            isInitialized.current = true;
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
