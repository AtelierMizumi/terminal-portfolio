"use client";

import { useAchievements } from "@/contexts/AchievementContext";
import { useAudioVisualizer } from "@/contexts/AudioVisualizerContext";
import {
  Info,
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Music,
} from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";

interface MusicPlayerProps {
  className?: string;
}

interface Song {
  id: string;
  name: string;
  artist: string;
  path: string;
  cover?: string;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ className }) => {
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const {
    isPlaying,
    currentSong,
    volume,
    isMuted,
    progress,
    duration,
    isLooping,
    isShuffle,
    togglePlay,
    nextSong,
    prevSong,
    changeVolume,
    toggleMute,
    seekTrack,
    toggleLoop,
    toggleShuffle,
  } = useAudioVisualizer();

  const { unlockAchievement } = useAchievements();

  // Achievement logic: Listen to near the end of the song
  useEffect(() => {
    if (isPlaying && duration > 0 && progress >= duration - 2) {
      unlockAchievement("audiophile");
    }
  }, [progress, duration, isPlaying, unlockAchievement]);

  // Format time (seconds to MM:SS)
  const formatTime = (seconds: number): string => {
    if (!seconds || Number.isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className={`h-full bg-[#1a1b26] text-gray-300 p-4 flex flex-col ${className} relative`}
    >
      {/* Info button */}
      <button
        onClick={() => setShowInfo(!showInfo)}
        className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors z-10"
        title="Song information"
      >
        <Info className="w-5 h-5" />
      </button>

      {/* Info modal */}
      {showInfo && (
        <div className="absolute inset-0 bg-black bg-opacity-80 z-20 flex items-center justify-center p-4">
          <div className="bg-[#1e1e2e] rounded-lg p-4 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">
                Music Information
              </h3>
              <button
                onClick={() => setShowInfo(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="text-sm text-gray-300 mb-4">
              <p className="mb-2">
                Currently playing:{" "}
                <span className="text-white">
                  {currentSong?.name || "None"}
                </span>
              </p>
              <p className="mb-2">
                Artist:{" "}
                <span className="text-white">
                  {currentSong?.artist || "Unknown"}
                </span>
              </p>
              <p className="mb-4">
                Music by{" "}
                <a
                  href="https://soundcloud.com/makencat"
                  className="text-blue-400 hover:underline"
                >
                  MakenCat
                </a>
              </p>
              <div className="bg-gray-800 bg-opacity-50 p-2 rounded-md text-xs">
                <p className="mb-1">
                  All music used with permission from the artist.
                </p>
                <p className="mb-1">
                  If you believe your copyrighted work has been used without
                  permission, please contact us with the required information.
                </p>
                <p>Send DMCA notices to: [contact email]</p>
              </div>
            </div>
            <button
              onClick={() => setShowInfo(false)}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Album cover and song info */}
      <div className="flex-grow flex flex-col items-center justify-center mb-6">
        <div className="w-48 h-48 bg-[#252525] rounded-lg overflow-hidden shadow-lg mb-4 relative">
          {currentSong?.cover ? (
            <img
              src={currentSong.cover}
              alt={currentSong.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-700">
              <div className="w-12 h-12 flex items-center justify-center bg-white text-black rounded-full hover:scale-105 active:scale-95 transition-all shadow-lg shadow-white/20">
                <Music className="w-16 h-16 text-white opacity-40" />
              </div>
            </div>
          )}

          <div
            className={`absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center transition-opacity ${isPlaying ? "opacity-0" : "opacity-100"}`}
          >
            <div className="w-16 h-16 bg-white bg-opacity-30 rounded-full flex items-center justify-center backdrop-blur-sm">
              {isPlaying ? (
                <Pause className="w-8 h-8" />
              ) : (
                <Play className="w-8 h-8 ml-1" />
              )}
            </div>
          </div>
        </div>

        <div className="text-center">
          <h3 className="text-xl font-semibold text-white mb-1">
            {currentSong?.name || "No song selected"}
          </h3>
          <p className="text-gray-400">
            {currentSong?.artist || "Unknown artist"}
          </p>
        </div>
      </div>

      {/* Credits and DMCA notice */}
      <div className="text-xs text-gray-500 mb-4 text-center">
        <p className="mb-1">
          Music by{" "}
          <a
            href="https://soundcloud.com/makencat"
            className="text-blue-400 hover:underline"
          >
            MakenCat
          </a>
        </p>
        <details className="text-left cursor-pointer">
          <summary className="text-gray-500 hover:text-gray-400 transition">
            DMCA/Copyright Info
          </summary>
          <div className="p-2 text-[10px] bg-gray-800 bg-opacity-50 mt-2 rounded-md">
            <p className="mb-1">
              All music used with permission from the artist.
            </p>
            <p className="mb-1">
              If you believe your copyrighted work has been used without
              permission, please contact us with:
            </p>
            <ul className="list-disc list-inside ml-2 mb-1">
              <li>Identification of the copyrighted work</li>
              <li>Location of the material on our site</li>
              <li>Your contact information</li>
              <li>Statement of good faith belief</li>
              <li>Statement of accuracy under penalty of perjury</li>
            </ul>
            <p>Send DMCA notices to: [contact email]</p>
          </div>
        </details>
      </div>

      {/* Playback controls */}
      <div>
        {/* Progress bar */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs">{formatTime(progress)}</span>
          <div className="flex-grow h-3 flex items-center group">
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={progress}
              onChange={(e) => seekTrack(Number.parseFloat(e.target.value))}
              className="w-full h-1.5 appearance-none bg-gray-700 rounded-lg overflow-hidden cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:cursor-pointer
                [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:shadow-blue-900/30
                [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:rounded-full 
                [&::-moz-range-thumb]:bg-blue-500 [&::-moz-range-thumb]:border-none
                hover:h-2 transition-all duration-150
                relative before:absolute before:content-[''] before:h-full before:left-0 before:top-0
                before:bg-gradient-to-r before:from-blue-500 before:to-blue-600 before:rounded-l-lg"
              style={
                {
                  backgroundImage: `linear-gradient(to right, #3b82f6 ${(progress / (duration || 1)) * 100}%, transparent ${(progress / (duration || 1)) * 100}%)`,
                } as React.CSSProperties
              }
            />
          </div>
          <span className="text-xs">{formatTime(duration)}</span>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6 mb-4">
          <button
            onClick={prevSong}
            className="text-gray-400 hover:text-white active:scale-90 transition-all p-2 rounded-full hover:bg-white/10"
          >
            <SkipBack className="w-5 h-5" />
          </button>

          <button
            onClick={togglePlay}
            className="bg-blue-600 hover:bg-blue-700 rounded-full p-3 text-white"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6 ml-0.5" />
            )}
          </button>

          <button
            onClick={nextSong}
            className="text-gray-400 hover:text-white active:scale-90 transition-all p-2 rounded-full hover:bg-white/10"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        {/* Additional controls and Volume */}
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={toggleLoop}
            className={`p-2 rounded-full transition-all active:scale-90 hover:bg-white/10 ${isLooping ? "text-blue-400" : "text-gray-400 hover:text-white"
              }`}
            title="Loop track"
          >
            {isLooping && (
              <span className="absolute inset-0 bg-blue-500 bg-opacity-25 rounded-full" />
            )}
            <Repeat className="w-4 h-4 relative z-10" />
          </button>

          <button
            onClick={toggleShuffle}
            className={`p-2 rounded-full transition-all active:scale-90 hover:bg-white/10 ${isShuffle ? "text-blue-400" : "text-gray-400 hover:text-white"
              }`}
            title="Shuffle tracks"
          >
            {isShuffle && (
              <span className="absolute inset-0 bg-blue-500 bg-opacity-25 rounded-full" />
            )}
            <Shuffle className="w-4 h-4 relative z-10" />
          </button>

          <div
            className="flex-grow flex items-center gap-2"
            onMouseEnter={() => setShowVolumeSlider(true)}
            onMouseLeave={() => setShowVolumeSlider(false)}
          >
            <button
              onClick={toggleMute}
              className="text-gray-400 hover:text-white transition-colors"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>

            <div
              className={`flex-grow h-5 flex items-center transition-all duration-200 ${showVolumeSlider ? "opacity-100 w-full" : "opacity-50 w-8 md:w-16"}`}
            >
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) =>
                  changeVolume(Number.parseInt(e.target.value, 10))
                }
                className="w-full h-1.5 appearance-none bg-gray-700 rounded-lg cursor-pointer 
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:cursor-pointer
                  [&::-webkit-slider-thumb]:border-none [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:shadow-blue-900/30
                  [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:rounded-full 
                  [&::-moz-range-thumb]:bg-blue-500 [&::-moz-range-thumb]:border-none
                  relative before:absolute before:content-[''] before:h-1.5 before:left-0 before:top-0
                  before:bg-gradient-to-r before:from-blue-500 before:to-blue-600 before:rounded-l-lg before:max-w-full"
                style={
                  {
                    backgroundImage: `linear-gradient(to right, #3b82f6 ${volume}%, transparent ${volume}%)`,
                  } as React.CSSProperties
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
