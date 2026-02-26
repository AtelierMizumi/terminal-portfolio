"use client";

import { useTimeAmbiance } from "@/hooks/useTimeAmbiance";
import { AnimatePresence, motion } from "framer-motion";
import type React from "react";
import { useEffect, useState } from "react";
import useSound from "use-sound";

interface BootScreenProps {
  onComplete: () => void;
}

const BootScreen: React.FC<BootScreenProps> = ({ onComplete }) => {
  const [lines, setLines] = useState<string[]>([]);
  const [isGlitching, setIsGlitching] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const { timeOfDay } = useTimeAmbiance();
  const [playChirp] = useSound("/sounds/bird-chirp.wav", { volume: 0.25 });

  // Boot sequence messages
  const bootMessages = [
    "BIOS Date 02/25/26 14:22:10 Ver 08.00.15",
    "CPU: AMD Ryzen 9 5900X 12-Core Processor",
    "Speed: 3.70 GHz",
    "Press DEL to run Setup",
    "Checking NVRAM...",
    "Update OK!",
    "24576MB OK",
    "",
    "Auto-Detecting Pri Master..IDE Hard Disk",
    "Auto-Detecting Pri Slave...Not Detected",
    "Auto-Detecting Sec Master..ATAPI CD-ROM",
    "Auto-Detecting Sec Slave...Not Detected",
    "",
    "Pri Master: 3.M.2.1 500GB SSD",
    "Sec Master: 1.00 CD-ROM",
    "",
    "Booting from Hard Disk...",
    "Loading Atelier OS kernel...",
    "[ OK ] Mounted Root File System.",
    "[ OK ] Started BootSplash Screens.",
    "[ OK ] Reached target Graphical Interface.",
    "Starting User Session...",
  ];

  // biome-ignore lint/correctness/useExhaustiveDependencies: Only run on mount or specific conditions
  useEffect(() => {
    // Check if we've already booted this session
    if (
      typeof window !== "undefined" &&
      typeof sessionStorage !== "undefined" &&
      sessionStorage.getItem("hasBooted")
    ) {
      onComplete();
      return;
    }

    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < bootMessages.length) {
        setLines((prev) => [...prev, bootMessages[currentLine]]);
        currentLine++;
      } else {
        clearInterval(interval);

        // Trigger glitch effect after text is done
        setTimeout(() => {
          setIsGlitching(true);

          // Finish and transition out
          setTimeout(() => {
            if (timeOfDay === "morning") {
              playChirp();
            }

            if (
              typeof window !== "undefined" &&
              typeof sessionStorage !== "undefined"
            ) {
              sessionStorage.setItem("hasBooted", "true");
            }
            setIsDone(true);
            setTimeout(onComplete, 500); // Wait for fade out
          }, 800);
        }, 1000);
      }
    }, 150); // Speed of text appearance

    return () => clearInterval(interval);
  }, [onComplete]);

  if (isDone) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="fixed inset-0 z-[9999] bg-[#020202] text-green-500 font-mono text-sm md:text-base p-6 overflow-hidden flex flex-col pointer-events-none"
      >
        {/* CRT Scanline overlay */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-50 opacity-20" />

        {/* Text lines container */}
        <div className={`relative z-10 ${isGlitching ? "animate-pulse" : ""}`}>
          {lines.map((line) => (
            <div
              key={line}
              className="leading-relaxed drop-shadow-[0_0_2px_rgba(0,255,0,0.8)]"
            >
              {line || " "}
            </div>
          ))}
          {/* Blinking cursor */}
          {!isGlitching && (
            <span className="inline-block w-2.5 h-5 bg-green-500 animate-pulse mt-1 ml-1" />
          )}
        </div>

        {/* Glitch overlay */}
        {isGlitching && (
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <div className="w-full h-1/3 bg-white/10 mix-blend-overlay animate-[ping_0.2s_ease-in-out_infinite]" />
            <div className="absolute left-0 w-full h-2 bg-green-400/50 mix-blend-screen animate-[bounce_0.1s_infinite]" />
            <div className="absolute right-0 w-full h-4 bg-purple-500/30 mix-blend-color-dodge animate-[pulse_0.15s_infinite]" />
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default BootScreen;
