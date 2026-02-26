import { useAchievements } from "@/contexts/AchievementContext";
import { useEffect, useState } from "react";

export type TimeOfDay = "morning" | "afternoon" | "evening" | "night";

export function useTimeAmbiance() {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>("afternoon");
  const [isClient, setIsClient] = useState(false);

  // We optionally use the context. If used outside provider, catch error
  let unlockAchievement: ((id: string) => void) | null = null;
  try {
    const achievementsContext = useAchievements();
    unlockAchievement = achievementsContext.unlockAchievement;
  } catch (e) {}

  useEffect(() => {
    setIsClient(true);
    const updateTime = () => {
      const hour = new Date().getHours();
      if (hour >= 6 && hour < 12) setTimeOfDay("morning");
      else if (hour >= 12 && hour < 18) setTimeOfDay("afternoon");
      else if (hour >= 18 && hour < 22) setTimeOfDay("evening");
      else setTimeOfDay("night");
    };

    updateTime();
    // Update every minute to catch transitions
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (
      unlockAchievement &&
      (timeOfDay === "night" || timeOfDay === "evening")
    ) {
      unlockAchievement("night_owl");
    }
  }, [timeOfDay, unlockAchievement]);

  return { timeOfDay, isClient };
}
