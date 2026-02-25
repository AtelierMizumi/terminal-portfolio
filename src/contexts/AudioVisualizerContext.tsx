"use client";

import React, { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';

export interface Song {
    id: string;
    name: string;
    artist: string;
    path: string;
    cover?: string;
}

export const DEMO_SONGS: Song[] = [
    { id: "1", name: "Chill Lofi Track 1", artist: "Unknown Artist", path: "/music/makencat-ambient-mila.mp3", cover: "/music/covers/makencat-ambient-mila.png" },
    { id: "2", name: "Ambient Vibes", artist: "Unknown Artist", path: "/music/makencat-ambient-firstday.mp3", cover: "/music/covers/default-cover.jpg" },
    { id: "3", name: "Electronic Beat", artist: "Unknown Artist", path: "/music/makencat-dancecap-1.mp3", cover: "/music/covers/cappie.jpg" },
    { id: "4", name: "Dance Groove", artist: "Unknown Artist", path: "/music/makencat-dancecap-2.mp3", cover: "/music/covers/cappie.jpg" },
    { id: "5", name: "Relaxing Melody", artist: "Unknown Artist", path: "/music/makencat-ambient-reallife.mp3", cover: "/music/covers/default-cover.jpg" }
];

interface AudioContextType {
    analyser: AnalyserNode | null;
    initAudioContext: () => void;

    isPlaying: boolean;
    currentSong: Song | null;
    volume: number;
    isMuted: boolean;
    progress: number;
    duration: number;
    isLooping: boolean;
    isShuffle: boolean;

    togglePlay: () => void;
    playSong: (song: Song) => void;
    nextSong: () => void;
    prevSong: () => void;
    changeVolume: (val: number) => void;
    toggleMute: () => void;
    seekTrack: (val: number) => void;
    toggleLoop: () => void;
    toggleShuffle: () => void;
}

const GlobalAudioContext = createContext<AudioContextType>({} as AudioContextType);

export const useAudioVisualizer = () => useContext(GlobalAudioContext);

export const AudioVisualizerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);

    // Music Player State
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentSong, setCurrentSong] = useState<Song | null>(null);
    const [volume, setVolume] = useState(70);
    const [isMuted, setIsMuted] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isLooping, setIsLooping] = useState(true);
    const [isShuffle, setIsShuffle] = useState(false);

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Initialize single audio element
        const audio = new Audio();
        audio.crossOrigin = "anonymous";
        audio.volume = volume / 100;
        audio.loop = isLooping;
        audioRef.current = audio;

        // Set up event listeners
        audio.addEventListener("loadedmetadata", () => {
            setDuration(audio.duration);
        });

        audio.addEventListener("ended", () => {
            if (!audio.loop) {
                // We'll handle sequential logic below
                nextSong();
            }
        });

        // Load first song by default
        if (DEMO_SONGS.length > 0) {
            setCurrentSong(DEMO_SONGS[0]);
            audio.src = DEMO_SONGS[0].path;
            audio.load();
        }

        return () => {
            if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
            audio.pause();
            audio.src = "";
        };
        // Disable exhaustive deps because we only want to run this once on mount
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Sync specific state to audio element directly
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.loop = isLooping;
            audioRef.current.volume = volume / 100;
        }
    }, [isLooping, volume]);

    const initAudioContext = () => {
        try {
            if (!audioRef.current) return;
            const AudioContextCtor = window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioContextCtor) return;

            let ctx = audioContextRef.current;
            if (!ctx) {
                ctx = new AudioContextCtor();
                audioContextRef.current = ctx;

                let analyserNode = ctx.createAnalyser();
                analyserNode.fftSize = 256;
                analyserNode.smoothingTimeConstant = 0.8;
                setAnalyser(analyserNode);

                const source = ctx.createMediaElementSource(audioRef.current);
                source.connect(analyserNode);
                analyserNode.connect(ctx.destination);
            }

            if (ctx.state === 'suspended') {
                ctx.resume();
            }
        } catch (e) {
            console.warn("Could not initialize AudioContext", e);
        }
    };

    const updateProgress = () => {
        if (audioRef.current) {
            setProgress(audioRef.current.currentTime);
        }
    };

    const togglePlay = async () => {
        if (!audioRef.current || !currentSong) return;

        if (!isPlaying) {
            initAudioContext();
            try {
                await audioRef.current.play();
                setIsPlaying(true);
                if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
                progressIntervalRef.current = setInterval(updateProgress, 1000);
            } catch (err) {
                console.error("Audio playback error:", err);
            }
        } else {
            audioRef.current.pause();
            setIsPlaying(false);
            if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current);
            }
        }
    };

    const nextSong = () => {
        if (!currentSong || !audioRef.current) return;

        const currentIndex = DEMO_SONGS.findIndex(s => s.id === currentSong.id);
        let nextIndex: number;

        if (isShuffle) {
            do {
                nextIndex = Math.floor(Math.random() * DEMO_SONGS.length);
            } while (nextIndex === currentIndex && DEMO_SONGS.length > 1);
        } else {
            nextIndex = (currentIndex + 1) % DEMO_SONGS.length;
        }

        setCurrentSong(DEMO_SONGS[nextIndex]);
        audioRef.current.src = DEMO_SONGS[nextIndex].path;
        audioRef.current.load();
        setProgress(0);

        if (isPlaying) {
            audioRef.current.play().catch(e => console.error("Audio play error:", e));
        }
    };

    const prevSong = () => {
        if (!currentSong || !audioRef.current) return;

        const currentIndex = DEMO_SONGS.findIndex(s => s.id === currentSong.id);
        const prevIndex = (currentIndex - 1 + DEMO_SONGS.length) % DEMO_SONGS.length;

        setCurrentSong(DEMO_SONGS[prevIndex]);
        audioRef.current.src = DEMO_SONGS[prevIndex].path;
        audioRef.current.load();
        setProgress(0);

        if (isPlaying) {
            audioRef.current.play().catch(e => console.error("Audio play error:", e));
        }
    };

    const playSong = async (song: Song) => {
        if (!audioRef.current) return;

        setCurrentSong(song);
        audioRef.current.src = song.path;
        audioRef.current.load();
        setProgress(0);

        initAudioContext();
        try {
            await audioRef.current.play();
            setIsPlaying(true);
            if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = setInterval(updateProgress, 1000);
        } catch (e) {
            console.error("Audio play error:", e);
        }
    };

    const changeVolume = (val: number) => {
        if (!audioRef.current) return;
        setVolume(val);
        audioRef.current.volume = val / 100;

        if (val === 0) {
            setIsMuted(true);
            audioRef.current.muted = true;
        } else if (isMuted) {
            setIsMuted(false);
            audioRef.current.muted = false;
        }
    };

    const toggleMute = () => {
        if (!audioRef.current) return;
        audioRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
    };

    const seekTrack = (val: number) => {
        if (!audioRef.current) return;
        audioRef.current.currentTime = val;
        setProgress(val);
    };

    const toggleLoop = () => setIsLooping(!isLooping);
    const toggleShuffle = () => setIsShuffle(!isShuffle);

    const value = {
        analyser,
        initAudioContext,
        isPlaying,
        currentSong,
        volume,
        isMuted,
        progress,
        duration,
        isLooping,
        isShuffle,
        togglePlay,
        playSong,
        nextSong,
        prevSong,
        changeVolume,
        toggleMute,
        seekTrack,
        toggleLoop,
        toggleShuffle
    };

    return (
        <GlobalAudioContext.Provider value={value}>
            {children}
        </GlobalAudioContext.Provider>
    );
};
