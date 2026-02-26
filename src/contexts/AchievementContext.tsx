"use client";

import confetti from "canvas-confetti";
import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import useSound from "use-sound";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export const ACHIEVEMENTS: Record<string, Achievement> = {
  explorer: {
    id: "explorer",
    title: "The Explorer",
    description: "Executed 10+ terminal commands.",
    icon: "🧭",
  },
  night_owl: {
    id: "night_owl",
    title: "Night Owl",
    description: "Switched to the dark/night ambiance.",
    icon: "🦉",
  },
  audiophile: {
    id: "audiophile",
    title: "Audiophile",
    description: "Listened to a song via the Music Player.",
    icon: "🎧",
  },
  gamer: {
    id: "gamer",
    title: "Gamer",
    description: "Scored points in a playable game.",
    icon: "🎮",
  },
};

interface AchievementContextProps {
  unlocked: string[];
  unlockAchievement: (id: string) => void;
}

const AchievementContext = createContext<AchievementContextProps | undefined>(
  undefined,
);

export const AchievementProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [unlocked, setUnlocked] = useState<string[]>([]);
  const [playAchievementSound] = useSound("/sounds/achievement.wav", {
    volume: 0.5,
  });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const stored = localStorage.getItem("atelier_achievements");
      if (stored) {
        setUnlocked(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load achievements", e);
    }
  }, []);

  const unlockAchievement = (id: string) => {
    if (!isMounted || !ACHIEVEMENTS[id] || unlocked.includes(id)) return;

    setUnlocked((prev) => {
      const newUnlocked = [...prev, id];
      try {
        localStorage.setItem(
          "atelier_achievements",
          JSON.stringify(newUnlocked),
        );
      } catch (e) {
        // Ignore limit errors
      }
      return newUnlocked;
    });

    const achievement = ACHIEVEMENTS[id];

    // Trigger visual and audio effects
    playAchievementSound();

    // Confetti effect from bottom right
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { x: 0.9, y: 0.9 },
      colors: ["#a6e3a1", "#f9e2af", "#f38ba8", "#cba6f7", "#89b4fa"],
      zIndex: 9999, // Ensure it's on top of everything
    });

    // Toast notification
    toast.success(`Achievement Unlocked: ${achievement.title}`, {
      description: achievement.description,
      icon: achievement.icon,
      duration: 5000,
      position: "bottom-right",
      className:
        "bg-base border-surface1 text-text shadow-lg !backdrop-blur-md !bg-base/80",
    });
  };

  return (
    <AchievementContext.Provider value={{ unlocked, unlockAchievement }}>
      {children}
    </AchievementContext.Provider>
  );
};

export const useAchievements = () => {
  const context = useContext(AchievementContext);
  if (context === undefined) {
    throw new Error(
      "useAchievements must be used within an AchievementProvider",
    );
  }
  return context;
};
