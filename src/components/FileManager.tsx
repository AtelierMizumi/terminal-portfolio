"use client";

import {
  ChevronRight,
  Code,
  ExternalLink,
  FileHeart,
  FileText,
  Folder,
  HardDrive,
  Home,
  Image as ImageIcon,
} from "lucide-react";
import React, { useState } from "react";

interface FileManagerProps {
  className?: string;
}

// Mock Data Structure
// biome-ignore lint/suspicious/noExplicitAny: Required for mock data flexibility
const FILE_SYSTEM: Record<string, any> = {
  "~": {
    name: "Home",
    type: "folder",
    children: [
      {
        id: "~/Documents",
        name: "Documents",
        type: "folder",
        icon: <Folder className="w-10 h-10 text-blue-400" />,
      },
      {
        id: "~/Pictures",
        name: "Pictures",
        type: "folder",
        icon: <Folder className="w-10 h-10 text-purple-400" />,
      },
      {
        id: "~/Projects",
        name: "Projects",
        type: "folder",
        icon: <Folder className="w-10 h-10 text-green-400" />,
      },
    ],
  },
  "~/Documents": {
    name: "Documents",
    type: "folder",
    children: [
      {
        id: "~/Documents/.thoughts",
        name: ".thoughts",
        type: "folder",
        icon: <Folder className="w-10 h-10 text-gray-400" />,
      },
      {
        id: "resume.pdf",
        name: "resume.pdf",
        type: "file",
        icon: <FileText className="w-10 h-10 text-red-400" />,
        action: () => window.open("/resume.pdf", "_blank"),
      },
    ],
  },
  "~/Documents/.thoughts": {
    name: ".thoughts",
    type: "folder",
    view: "list",
    children: [
      {
        id: "blog-1",
        name: "The Philosophy of Ricing",
        type: "link",
        url: "https://ateliermizumi.github.io",
        icon: <FileHeart className="w-5 h-5 text-pink-400" />,
      },
      {
        id: "blog-2",
        name: "Why ZMK is the Future",
        type: "link",
        url: "https://ateliermizumi.github.io",
        icon: <FileText className="w-5 h-5 text-gray-300" />,
      },
      {
        id: "blog-3",
        name: "Building Terminal Portfolio",
        type: "link",
        url: "https://ateliermizumi.github.io",
        icon: <Code className="w-5 h-5 text-green-400" />,
      },
    ],
  },
  "~/Pictures": {
    name: "Pictures",
    type: "folder",
    children: [
      {
        id: "~/Pictures/.memories",
        name: ".memories",
        type: "folder",
        icon: <Folder className="w-10 h-10 text-pink-400" />,
      },
      {
        id: "arch-linux.png",
        name: "arch-linux.png",
        type: "file",
        icon: <ImageIcon className="w-10 h-10 text-purple-300" />,
        action: () => window.open("/arch-linux.png", "_blank"),
      },
    ],
  },
  "~/Pictures/.memories": {
    name: ".memories",
    type: "folder",
    view: "gallery",
    children: [
      {
        id: "mem-1",
        name: "Desk Setup 2024",
        type: "image",
        url: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500&q=80",
      },
      {
        id: "mem-2",
        name: "Custom Keyboard",
        type: "image",
        url: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&q=80",
      },
      {
        id: "mem-3",
        name: "Late Night Coding",
        type: "image",
        url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&q=80",
      },
      {
        id: "mem-4",
        name: "Coffee",
        type: "image",
        url: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=500&q=80",
      },
    ],
  },
  "~/Projects": {
    name: "Projects",
    type: "folder",
    children: [
      {
        id: "p-github-profile",
        name: "@AtelierMizumi",
        type: "link",
        url: "https://github.com/AtelierMizumi",
        icon: <ExternalLink className="w-10 h-10 text-purple-400" />,
      },
      {
        id: "p-terminal-portfolio",
        name: "terminal-portfolio",
        type: "link",
        url: "https://github.com/AtelierMizumi/terminal-portfolio",
        icon: <Folder className="w-10 h-10 text-cyan-400" />,
      },
      {
        id: "p-nixos-kde-config",
        name: "nixos-kde-config",
        type: "link",
        url: "https://github.com/AtelierMizumi/nixos-kde-config",
        icon: <Folder className="w-10 h-10 text-cyan-400" />,
      },
      {
        id: "p-anime-cli",
        name: "anime-cli",
        type: "link",
        url: "https://github.com/AtelierMizumi/anime-cli",
        icon: <Folder className="w-10 h-10 text-cyan-400" />,
      },
      {
        id: "p-ai-labs",
        name: "AI-Labs",
        type: "link",
        url: "https://github.com/AtelierMizumi/AI-Labs",
        icon: <Folder className="w-10 h-10 text-cyan-400" />,
      },
      {
        id: "p-nix-lms-answer-checker",
        name: "nix-lms-answer-checker",
        type: "link",
        url: "https://github.com/AtelierMizumi/nix-lms-answer-checker",
        icon: <Folder className="w-10 h-10 text-cyan-400" />,
      },
      {
        id: "p-ateliermc",
        name: "AtelierMC",
        type: "link",
        url: "https://github.com/AtelierMizumi/AtelierMC",
        icon: <Folder className="w-10 h-10 text-cyan-400" />,
      },
      {
        id: "p-c-exercise",
        name: "C---Exercise",
        type: "link",
        url: "https://github.com/AtelierMizumi/C---Exercise",
        icon: <Folder className="w-10 h-10 text-cyan-400" />,
      },
      {
        id: "p-java",
        name: "JavaExerciseProductManager",
        type: "link",
        url: "https://github.com/AtelierMizumi/JavaExerciseProductManager",
        icon: <Folder className="w-10 h-10 text-cyan-400" />,
      },
      {
        id: "p-cs2",
        name: "cs2-movement-config",
        type: "link",
        url: "https://github.com/AtelierMizumi/cs2-movement-config",
        icon: <Folder className="w-10 h-10 text-cyan-400" />,
      },
    ],
  },
};

const FileManager: React.FC<FileManagerProps> = ({ className = "" }) => {
  const [currentPath, setCurrentPath] = useState<string>("~");
  const [history, setHistory] = useState<string[]>(["~"]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  const navigateTo = (path: string) => {
    if (!FILE_SYSTEM[path]) return;
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(path);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setCurrentPath(path);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCurrentPath(history[historyIndex - 1]);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCurrentPath(history[historyIndex + 1]);
    }
  };

  const currentFolder = FILE_SYSTEM[currentPath];

  // biome-ignore lint/suspicious/noExplicitAny: Required for generic item handling
  const handleItemClick = (item: any) => {
    if (item.type === "folder") {
      navigateTo(item.id);
    } else if (item.type === "link") {
      window.open(item.url, "_blank");
    } else if (item.action) {
      item.action();
    } else if (item.type === "image") {
      window.open(item.url, "_blank");
    }
  };

  return (
    <div className={`flex h-full bg-black/40 text-gray-200 ${className}`}>
      {/* Sidebar */}
      <div className="w-48 flex-shrink-0 bg-white/[0.02] border-r border-gray-800/50 flex flex-col">
        <div className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Places
        </div>
        <nav className="flex-1 px-2 space-y-1">
          {[
            { id: "~", label: "Home", icon: <Home className="w-4 h-4" /> },
            {
              id: "~/Documents",
              label: "Documents",
              icon: <FileText className="w-4 h-4" />,
            },
            {
              id: "~/Pictures",
              label: "Pictures",
              icon: <ImageIcon className="w-4 h-4" />,
            },
            {
              id: "~/Projects",
              label: "Projects",
              icon: <Code className="w-4 h-4" />,
            },
          ].map((place) => (
            <button
              key={place.id}
              onClick={() => navigateTo(place.id)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                (currentPath.startsWith(place.id) && place.id !== "~") ||
                (place.id === "~" && currentPath === "~")
                  ? "bg-purple-500/20 text-purple-300"
                  : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
              }`}
            >
              {place.icon}
              {place.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-800/50">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <HardDrive className="w-4 h-4" />
            <span>256 GB Free</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar / Address Bar */}
        <div className="flex items-center gap-2 p-3 border-b border-gray-800/50 bg-white/[0.01]">
          <div className="flex items-center gap-1">
            <button
              onClick={goBack}
              disabled={historyIndex === 0}
              className={`p-1.5 rounded-md transition-colors ${historyIndex === 0 ? "text-gray-600 cursor-not-allowed" : "text-gray-400 hover:bg-white/10 hover:text-white"}`}
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
            </button>
            <button
              onClick={goForward}
              disabled={historyIndex === history.length - 1}
              className={`p-1.5 rounded-md transition-colors ${historyIndex === history.length - 1 ? "text-gray-600 cursor-not-allowed" : "text-gray-400 hover:bg-white/10 hover:text-white"}`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Path Breadcrumbs */}
          <div className="flex-1 flex items-center px-3 py-1.5 bg-black/40 border border-gray-800/60 rounded-lg overflow-x-auto no-scrollbar">
            {currentPath.split("/").map((part, i, arr) => {
              const pathSoFar = arr.slice(0, i + 1).join("/");
              return (
                <React.Fragment key={pathSoFar}>
                  {i > 0 && <span className="text-gray-600 mx-1">/</span>}
                  <button
                    onClick={() => navigateTo(pathSoFar)}
                    className="text-sm text-gray-300 hover:text-white transition-colors whitespace-nowrap"
                  >
                    {part}
                  </button>
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4">
          {currentFolder?.view === "gallery" ? (
            <div className="grid grid-cols-2 gap-4">
              {/* biome-ignore lint/suspicious/noExplicitAny: Generic item */}
              {currentFolder.children.map((item: any) => (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className="group relative aspect-video rounded-lg overflow-hidden border border-gray-800 hover:border-purple-500/50 transition-colors"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.url}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <span className="text-xs font-medium text-white">
                      {item.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          ) : currentFolder?.view === "list" ? (
            <div className="space-y-1">
              {/* biome-ignore lint/suspicious/noExplicitAny: Generic item */}
              {currentFolder.children.map((item: any) => (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors group text-left"
                >
                  {item.icon}
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors flex-1">
                    {item.name}
                  </span>
                  {item.type === "link" && (
                    <ExternalLink className="w-4 h-4 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-4">
              {/* biome-ignore lint/suspicious/noExplicitAny: Generic item */}
              {currentFolder?.children?.map((item: any) => (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-white/5 transition-colors group"
                >
                  <div className="group-hover:-translate-y-1 transition-transform duration-200">
                    {item.icon}
                  </div>
                  <span className="text-xs text-gray-400 group-hover:text-gray-200 text-center truncate w-full">
                    {item.name}
                  </span>
                </button>
              ))}
              {(!currentFolder?.children ||
                currentFolder.children.length === 0) && (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
                  <Folder className="w-12 h-12 mb-3 opacity-20" />
                  <p className="text-sm">This folder is empty</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileManager;
