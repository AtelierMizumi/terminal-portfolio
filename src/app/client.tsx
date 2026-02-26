"use client";

import { AudioVisualizerProvider } from "@/contexts/AudioVisualizerContext";
import { animate, createScope } from "animejs";
import { motion } from "framer-motion";
import {
  Coffee,
  FileText,
  FolderOpen,
  Gamepad2,
  Music,
  Terminal as TerminalIcon,
  User,
} from "lucide-react";
import dynamic from "next/dynamic";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { AmbianceOverlay } from "../components/AmbianceOverlay";
import { ArchMenu } from "../components/ArchMenu";
import BackgroundSelector from "../components/BackgroundSelector";
import { DesktopIcon } from "../components/DesktopIcon";
import { GamesExplorer } from "../components/GamesExplorer";
import MusicPlayer from "../components/MusicPlayer";
import { TopBar } from "../components/TopBar";
import { Window, WindowManager } from "../components/WindowManager";
import { ThemeProvider } from "../components/theme-provider";
import { WobbleProvider } from "../components/window-wobble-provider";

const SnakeGame = dynamic(() => import("../components/games/SnakeGame"), {
  ssr: false,
});
const TetrisGame = dynamic(() => import("../components/games/TetrisGame"), {
  ssr: false,
});
const AboutWindow = dynamic(() => import("../components/AboutWindow"), {
  ssr: false,
});
const ResumeViewer = dynamic(() => import("../components/ResumeViewer"), {
  ssr: false,
});
const BootScreen = dynamic(() => import("../components/BootScreen"), {
  ssr: false,
});
const FileManager = dynamic(() => import("../components/FileManager"), {
  ssr: false,
});

// Dynamically import Terminal to prevent SSR issues
const Terminal = dynamic(() => import("../components/Terminal"), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center bg-gray-800">
      <p className="text-gray-300">Terminal loading...</p>
    </div>
  ),
});

// Type for windows
interface WindowData {
  id: string;
  type:
    | "terminal"
    | "game"
    | "explorer"
    | "music"
    | "backgroundSelector"
    | "about"
    | "resume"
    | "files";
  zIndex: number;
  initialX: number;
  initialY: number;
  title: string;
  gameId?: string;
  songId?: string;
}

// Window manager with state
export const Client: React.FC = () => {
  const [windows, setWindows] = useState<WindowData[]>([
    {
      id: "terminal-1",
      type: "terminal",
      zIndex: 1,
      initialX: 100,
      initialY: 100,
      title: "Terminal",
    },
  ]);
  const [archMenuOpen, setArchMenuOpen] = useState(false);
  const [activeWindowId, setActiveWindowId] = useState<string>("terminal-1");
  const [maxZIndex, setMaxZIndex] = useState(1);
  const [gamesExplorerOpen, setGamesExplorerOpen] = useState(false);
  const [currentBackground, setCurrentBackground] = useState(
    "/background/cyan-mountains.jpg",
  );
  const [backgroundIndex, setBackgroundIndex] = useState(0);
  const [isVideoBackground, setIsVideoBackground] = useState(false);
  const [isBooting, setIsBooting] = useState(true);

  // Easter Eggs
  const [coffees, setCoffees] = useState<
    { id: string; x: number; y: number }[]
  >([]);
  const [isRaining, setIsRaining] = useState(false);
  const [mounted, setMounted] = useState(false);

  const clientRef = useRef<HTMLDivElement>(null);
  const animationScope = useRef<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);

  // Available backgrounds
  const backgrounds = React.useMemo(
    () => [
      "/background/cyan-mountains.jpg",
      "/background/islands.jpg",
      "/background/blue_green.png",
      "/background/blocks.png",
      "/background/unicat.png",
      "/background/blue_green.png",
      "/background/cyan-gradient.png",
      "/background/nilou.mp4",
    ],
    [],
  );

  // Function to set background
  const setBackground = useCallback((backgroundPath: string) => {
    setCurrentBackground(backgroundPath);
    setIsVideoBackground(
      backgroundPath.endsWith(".mp4") || backgroundPath.endsWith(".webm"),
    );
  }, []);

  // Function to cycle backgrounds
  const cycleBackground = useCallback(() => {
    const nextIndex = (backgroundIndex + 1) % backgrounds.length;
    setBackgroundIndex(nextIndex);
    const nextBackground = backgrounds[nextIndex];
    setBackground(nextBackground);
  }, [backgroundIndex, backgrounds, setBackground]);

  // Function to open background selector
  const openBackgroundSelector = useCallback(() => {
    const newZIndex = maxZIndex + 1;
    const newId = `background-selector-${Date.now()}`;

    setWindows((prev) => [
      ...prev,
      {
        id: newId,
        type: "backgroundSelector",
        zIndex: newZIndex,
        initialX: 150,
        initialY: 100,
        title: "Background Selector",
      },
    ]);

    setMaxZIndex(newZIndex);
    setActiveWindowId(newId);
  }, [maxZIndex]);

  // Function to bring a window to front
  const bringToFront = useCallback(
    (id: string) => {
      setWindows((prev) => {
        const newWindows = [...prev];
        const newMaxZIndex = maxZIndex + 1;
        const windowIndex = newWindows.findIndex((w) => w.id === id);

        if (windowIndex !== -1) {
          newWindows[windowIndex] = {
            ...newWindows[windowIndex],
            zIndex: newMaxZIndex,
          };
        }

        setMaxZIndex(newMaxZIndex);
        return newWindows;
      });

      setActiveWindowId(id);
    },
    [maxZIndex],
  );

  // Create a new terminal window
  const createTerminal = useCallback(() => {
    const newZIndex = maxZIndex + 1;
    const offsetX = Math.floor(Math.random() * 100);
    const offsetY = Math.floor(Math.random() * 100);
    const newId = `terminal-${Date.now()}`;

    setWindows((prev) => [
      ...prev,
      {
        id: newId,
        type: "terminal",
        zIndex: newZIndex,
        initialX: 120 + offsetX,
        initialY: 120 + offsetY,
        title: "Terminal",
      },
    ]);

    setMaxZIndex(newZIndex);
    setActiveWindowId(newId);
  }, [maxZIndex]);

  // Create a music player window
  const openMusicPlayer = useCallback(() => {
    const existing = windows.find((w) => w.type === "music");
    if (existing) {
      bringToFront(existing.id);
      return;
    }

    const newZIndex = maxZIndex + 1;
    const newId = `music-${Date.now()}`;

    setWindows((prev) => [
      ...prev,
      {
        id: newId,
        type: "music",
        zIndex: newZIndex,
        initialX: 150,
        initialY: 100,
        title: "Music Player",
      },
    ]);

    setMaxZIndex(newZIndex);
    setActiveWindowId(newId);
  }, [windows, maxZIndex, bringToFront]);

  // Close a window
  const closeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  }, []);

  // Open About window
  const openAboutWindow = useCallback(() => {
    const existing = windows.find((w) => w.type === "about");
    if (existing) {
      bringToFront(existing.id);
      return;
    }

    const newZIndex = maxZIndex + 1;
    const newId = `about-${Date.now()}`;
    setWindows((prev) => [
      ...prev,
      {
        id: newId,
        type: "about",
        zIndex: newZIndex,
        initialX: 200,
        initialY: 80,
        title: "About Me",
      },
    ]);
    setMaxZIndex(newZIndex);
    setActiveWindowId(newId);
  }, [windows, maxZIndex, bringToFront]);

  // Open Resume window
  const openResumeWindow = useCallback(() => {
    const existing = windows.find((w) => w.type === "resume");
    if (existing) {
      bringToFront(existing.id);
      return;
    }

    const newZIndex = maxZIndex + 1;
    const newId = `resume-${Date.now()}`;
    setWindows((prev) => [
      ...prev,
      {
        id: newId,
        type: "resume",
        zIndex: newZIndex,
        initialX: 250,
        initialY: 60,
        title: "Resume",
      },
    ]);
    setMaxZIndex(newZIndex);
    setActiveWindowId(newId);
  }, [windows, maxZIndex, bringToFront]);

  // Open File Manager
  const openFileManager = useCallback(() => {
    const existing = windows.find((w) => w.type === "files");
    if (existing) {
      bringToFront(existing.id);
      return;
    }

    const newZIndex = maxZIndex + 1;
    const newId = `files-${Date.now()}`;
    setWindows((prev) => [
      ...prev,
      {
        id: newId,
        type: "files",
        zIndex: newZIndex,
        initialX: 180,
        initialY: 100,
        title: "File Manager",
      },
    ]);
    setMaxZIndex(newZIndex);
    setActiveWindowId(newId);
  }, [windows, maxZIndex, bringToFront]);

  // Handle game launch
  const handleGameLaunch = useCallback(
    (game: any) => {
      const newZIndex = maxZIndex + 1;
      const newId = `game-${Date.now()}`;

      setWindows((prev) => [
        ...prev,
        {
          id: newId,
          type: "game",
          gameId: game.id,
          zIndex: newZIndex,
          initialX: 150,
          initialY: 100,
          title: game.name,
        },
      ]);

      setMaxZIndex(newZIndex);
      setActiveWindowId(newId);
      setGamesExplorerOpen(false);
    },
    [maxZIndex],
  );

  // Set up animations with createScope
  useEffect(() => {
    if (!clientRef.current) return;

    animationScope.current = createScope({ root: clientRef }).add((self) => {
      // Register methods that can be called from outside useEffect
      self?.add("archButtonAnimation", () => {
        animate(".arch-button", {
          scale: [1, 1.2, 1],
          duration: 300,
          easing: "inOutQuad",
        });
      });
    });

    return () => {
      if (animationScope.current) {
        animationScope.current.revert();
      }
    };
  }, []);

  // Listen for terminal's "open" command events and easter eggs
  useEffect(() => {
    const handleOpenApp = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      switch (detail?.app) {
        case "music":
          openMusicPlayer();
          break;
        case "games":
          setGamesExplorerOpen(true);
          break;
        case "about":
          openAboutWindow();
          break;
        case "resume":
          openResumeWindow();
          break;
        case "files":
          openFileManager();
          break;
      }
    };

    const handleEasterEgg = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.type === "coffee") {
        const newX = Math.random() * (window.innerWidth - 100);
        const newY = Math.random() * (window.innerHeight - 100);
        setCoffees((prev) => [
          ...prev,
          { id: Date.now().toString(), x: newX, y: newY },
        ]);
      } else if (detail?.type === "rain") {
        setIsRaining((prev) => !prev);
      }
    };

    window.addEventListener("terminal-open-app", handleOpenApp);
    window.addEventListener("terminal-easter-egg", handleEasterEgg);

    return () => {
      window.removeEventListener("terminal-open-app", handleOpenApp);
      window.removeEventListener("terminal-easter-egg", handleEasterEgg);
    };
  }, [openMusicPlayer, openAboutWindow, openResumeWindow, openFileManager]);

  // Desktop Parallax Effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!backgroundRef.current) return;
      const x = (window.innerWidth / 2 - e.clientX) / 50;
      const y = (window.innerHeight / 2 - e.clientY) / 50;
      backgroundRef.current.style.transform = `scale(1.05) translate(${x}px, ${y}px)`;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <AudioVisualizerProvider>
      <ThemeProvider>
        <WobbleProvider>
          <WindowManager>
            {isBooting && <BootScreen onComplete={() => setIsBooting(false)} />}

            <div
              ref={clientRef}
              className="relative w-screen h-screen overflow-hidden bg-background"
            >
              {/* Background */}
              <div
                ref={backgroundRef}
                className="absolute inset-0 transition-transform duration-75 ease-out will-change-transform scale-105"
              >
                {isVideoBackground ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover transition-all duration-500"
                    style={{ filter: "brightness(0.8)" }}
                  >
                    <source src={currentBackground} type="video/mp4" />
                  </video>
                ) : (
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-all duration-500"
                    style={{
                      backgroundImage: `url('${currentBackground}')`,
                    }}
                  />
                )}
              </div>

              {/* Rain Overlay */}
              {isRaining && (
                <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                  <div
                    className="w-full h-full opacity-40 mix-blend-screen"
                    style={{
                      backgroundImage:
                        "url('https://media.giphy.com/media/Il9f7ZhytEiI0/giphy.gif')",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}
                  />
                  <div className="absolute inset-0 bg-[#1e1e2e]/20 mix-blend-multiply" />
                </div>
              )}

              {/* Easter Egg: Draggable Coffees */}
              {coffees.map((coffee) => (
                <motion.div
                  key={coffee.id}
                  drag
                  dragMomentum={false}
                  initial={{ opacity: 0, scale: 0.5, x: coffee.x, y: coffee.y }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  whileDrag={{ scale: 1.2, cursor: "grabbing" }}
                  className="absolute z-50 cursor-grab drop-shadow-lg"
                >
                  <div className="bg-[#1e1e2e]/80 backdrop-blur-md p-3 rounded-2xl border border-white/10 shadow-xl flex flex-col items-center gap-1 group">
                    <Coffee className="w-8 h-8 text-[#f5c2e7] group-hover:text-[#f38ba8] transition-colors" />
                    <span className="text-[10px] text-gray-400 font-mono">
                      Lofi Fuel
                    </span>
                  </div>
                </motion.div>
              ))}

              {/* Desktop Icons */}
              <div className="absolute inset-x-8 inset-y-16 pointer-events-none">
                <div className="pointer-events-auto h-full flex flex-col gap-8 flex-wrap content-start">
                  <DesktopIcon
                    icon={<TerminalIcon size={24} />}
                    label="Terminal"
                    onClick={() => bringToFront("terminal-1")}
                    x={0}
                    y={0}
                  />
                  <DesktopIcon
                    icon={<Music size={24} />}
                    label="Music"
                    onClick={openMusicPlayer}
                    x={0}
                    y={100}
                  />
                  <DesktopIcon
                    icon={<Gamepad2 size={24} />}
                    label="Games"
                    onClick={() => setGamesExplorerOpen(true)}
                    x={0}
                    y={200}
                  />
                  <DesktopIcon
                    icon={<User size={24} />}
                    label="About"
                    onClick={openAboutWindow}
                    x={0}
                    y={300}
                  />
                  <DesktopIcon
                    icon={<FileText size={24} />}
                    label="Resume"
                    onClick={openResumeWindow}
                    x={0}
                    y={400}
                  />
                  <DesktopIcon
                    icon={<FolderOpen size={24} />}
                    label="Files"
                    onClick={openFileManager}
                    x={0}
                    y={500}
                  />
                </div>
              </div>

              {/* Windows */}
              {windows.map((window) => {
                if (window.type === "terminal") {
                  return (
                    <Window
                      key={window.id}
                      id={window.id}
                      title={window.title}
                      zIndex={window.zIndex}
                      initialX={window.initialX}
                      initialY={window.initialY}
                      initialWidth={600}
                      initialHeight={400}
                      onClose={() => closeWindow(window.id)}
                      onFocus={() => bringToFront(window.id)}
                      showDate={true}
                    >
                      <Terminal className="h-full" />
                    </Window>
                  );
                }
                if (window.type === "music") {
                  return (
                    <Window
                      key={window.id}
                      id={window.id}
                      title={window.title}
                      zIndex={window.zIndex}
                      initialX={window.initialX}
                      initialY={window.initialY}
                      initialWidth={400}
                      initialHeight={550}
                      onClose={() => closeWindow(window.id)}
                      onFocus={() => bringToFront(window.id)}
                      showDate={false}
                    >
                      <MusicPlayer className="h-full" />
                    </Window>
                  );
                }
                if (window.type === "game") {
                  const GameComponent =
                    window.gameId === "tetris"
                      ? TetrisGame
                      : window.gameId === "snake"
                        ? SnakeGame
                        : null;

                  return (
                    <Window
                      key={window.id}
                      id={window.id}
                      title={window.title}
                      zIndex={window.zIndex}
                      initialX={window.initialX}
                      initialY={window.initialY}
                      initialWidth={window.gameId === "tetris" ? 450 : 500}
                      initialHeight={window.gameId === "tetris" ? 620 : 500}
                      onClose={() => closeWindow(window.id)}
                      onFocus={() => bringToFront(window.id)}
                      showDate={false}
                    >
                      {GameComponent ? (
                        <GameComponent className="h-full" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-800">
                          <div className="text-center">
                            <div className="text-4xl mb-4">
                              {window.gameId === "flappy-bird" && "🐦"}
                              {window.gameId === "mario" && "🍄"}
                              {window.gameId === "chess" && "♟️"}
                            </div>
                            <h2 className="text-2xl font-bold text-text mb-3">
                              {window.title}
                            </h2>
                            <p className="text-text/70 mb-4">Coming soon!</p>
                          </div>
                        </div>
                      )}
                    </Window>
                  );
                }
                if (window.type === "backgroundSelector") {
                  return (
                    <Window
                      key={window.id}
                      id={window.id}
                      title={window.title}
                      zIndex={window.zIndex}
                      initialX={window.initialX}
                      initialY={window.initialY}
                      initialWidth={500}
                      initialHeight={400}
                      onClose={() => closeWindow(window.id)}
                      onFocus={() => bringToFront(window.id)}
                      showDate={false}
                    >
                      <BackgroundSelector
                        backgrounds={backgrounds}
                        currentBackground={currentBackground}
                        onSelect={setBackground}
                      />
                    </Window>
                  );
                }
                return null;
              })}

              {/* About window type rendering */}
              {windows
                .filter((w) => w.type === "about")
                .map((window) => (
                  <Window
                    key={window.id}
                    id={window.id}
                    title={window.title}
                    zIndex={window.zIndex}
                    initialX={window.initialX}
                    initialY={window.initialY}
                    initialWidth={480}
                    initialHeight={600}
                    onClose={() => closeWindow(window.id)}
                    onFocus={() => bringToFront(window.id)}
                    showDate={false}
                  >
                    <AboutWindow className="h-full" />
                  </Window>
                ))}

              {/* Resume window type rendering */}
              {windows
                .filter((w) => w.type === "resume")
                .map((window) => (
                  <Window
                    key={window.id}
                    id={window.id}
                    title={window.title}
                    zIndex={window.zIndex}
                    initialX={window.initialX}
                    initialY={window.initialY}
                    initialWidth={520}
                    initialHeight={650}
                    onClose={() => closeWindow(window.id)}
                    onFocus={() => bringToFront(window.id)}
                    showDate={false}
                  >
                    <ResumeViewer className="h-full" />
                  </Window>
                ))}

              {/* File Manager window type rendering */}
              {windows
                .filter((w) => w.type === "files")
                .map((window) => (
                  <Window
                    key={window.id}
                    id={window.id}
                    title={window.title}
                    zIndex={window.zIndex}
                    initialX={window.initialX}
                    initialY={window.initialY}
                    initialWidth={800}
                    initialHeight={550}
                    onClose={() => closeWindow(window.id)}
                    onFocus={() => bringToFront(window.id)}
                    showDate={false}
                  >
                    <FileManager className="h-full" />
                  </Window>
                ))}

              {/* Games Explorer Window */}
              <GamesExplorer
                isOpen={gamesExplorerOpen}
                zIndex={maxZIndex + 1}
                onClose={() => setGamesExplorerOpen(false)}
                onGameLaunch={handleGameLaunch}
              />

              {/* Desktop UI Components */}
              <TopBar
                onArchClick={() => {
                  setArchMenuOpen(!archMenuOpen);
                  if (animationScope.current?.methods?.archButtonAnimation) {
                    animationScope.current.methods.archButtonAnimation();
                  }
                }}
                onMusicOpen={openMusicPlayer}
                onBackgroundChange={cycleBackground}
                onBackgroundSelectorOpen={openBackgroundSelector}
              />

              <ArchMenu
                isOpen={archMenuOpen}
                onClose={() => setArchMenuOpen(false)}
                onTerminalOpen={createTerminal}
                onMusicOpen={openMusicPlayer}
                onGameMenuOpen={() => {
                  setGamesExplorerOpen(true);
                  setArchMenuOpen(false);
                }}
                onAboutOpen={openAboutWindow}
                onResumeOpen={openResumeWindow}
                onFilesOpen={openFileManager}
              />

              <AmbianceOverlay />

              <style jsx global>{`
              .loading-bar {
                width: 30%;
                animation: loading 2s infinite ease-in-out;
              }
              
              @keyframes loading {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(400%); }
              }
            `}</style>
            </div>
          </WindowManager>
        </WobbleProvider>
      </ThemeProvider>
    </AudioVisualizerProvider>
  );
};

export default Client;
