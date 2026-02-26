"use client";

import {
  Code,
  Cpu,
  ExternalLink,
  Github,
  Globe,
  Keyboard,
  Mail,
} from "lucide-react";
import type React from "react";

interface AboutWindowProps {
  className?: string;
}

const AboutWindow: React.FC<AboutWindowProps> = ({ className = "" }) => {
  return (
    <div
      className={`h-full overflow-y-auto bg-[#0d0d0d] text-gray-200 ${className}`}
    >
      {/* Hero section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-transparent to-cyan-900/20" />
        <div className="relative p-8 text-center">
          {/* Avatar */}
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 p-0.5">
            <div className="w-full h-full rounded-full bg-[#0d0d0d] flex items-center justify-center">
              <span className="text-4xl">🎨</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            thuanc177
          </h1>
          <p className="text-gray-400 text-sm mt-1">AtelierMizumi</p>
          <p className="text-gray-500 text-xs mt-2 max-w-xs mx-auto">
            CS student at VKU • Linux enthusiast • Keyboard builder • MiSide fan
          </p>

          {/* Social links */}
          <div className="flex justify-center gap-3 mt-4">
            <a
              href="https://github.com/AtelierMizumi"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
            >
              <Github className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
            </a>
            <a
              href="https://ateliermizumi.github.io"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
            >
              <Globe className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
            </a>
            <a
              href="mailto:contact@thuanc177.me"
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
            >
              <Mail className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
            </a>
          </div>
        </div>
      </div>

      {/* About */}
      <div className="px-6 py-4 border-t border-gray-800/50">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
          About
        </h2>
        <p className="text-sm text-gray-300 leading-relaxed">
          A Computer Science student passionate about{" "}
          <span className="text-purple-400">Linux ricing</span>, building{" "}
          <span className="text-cyan-400">custom keyboards</span> with ZMK
          firmware, and crafting beautiful{" "}
          <span className="text-green-400">web experiences</span>. I run CachyOS
          with KDE Plasma and enjoy tinkering with NixOS configurations.
        </p>
      </div>

      {/* Interests */}
      <div className="px-6 py-4 border-t border-gray-800/50">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Interests
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {[
            {
              icon: <Code className="w-4 h-4" />,
              label: "Web Development",
              color: "text-green-400",
            },
            {
              icon: <Keyboard className="w-4 h-4" />,
              label: "Custom Keyboards",
              color: "text-cyan-400",
            },
            {
              icon: <Cpu className="w-4 h-4" />,
              label: "Embedded Systems",
              color: "text-yellow-400",
            },
            { icon: "🏔️", label: "Linux / NixOS", color: "text-blue-400" },
            { icon: "🎮", label: "MiSide / Genshin", color: "text-purple-400" },
            { icon: "🎵", label: "Lofi & Ambient", color: "text-pink-400" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] transition-colors"
            >
              <span className={item.color}>
                {typeof item.icon === "string" ? item.icon : item.icon}
              </span>
              <span className="text-xs text-gray-300">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack */}
      <div className="px-6 py-4 border-t border-gray-800/50">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Tech Stack
        </h2>
        <div className="flex flex-wrap gap-1.5">
          {[
            "TypeScript",
            "React",
            "Next.js",
            "TailwindCSS",
            "Python",
            "C/C++",
            "Rust",
            "Nix",
            "Node.js",
            "Git",
            "Docker",
            "Linux",
            "ZMK",
            "KDE Plasma",
          ].map((tech) => (
            <span
              key={tech}
              className="px-2.5 py-1 text-xs rounded-full bg-white/[0.05] text-gray-300 border border-white/[0.08] hover:bg-white/[0.08] transition-colors"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Projects */}
      <div className="px-6 py-4 border-t border-gray-800/50">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Projects
        </h2>
        <div className="space-y-2">
          {[
            {
              name: "Terminal Portfolio",
              desc: "This! Virtual desktop with Linux rice aesthetics",
              url: "https://github.com/AtelierMizumi/terminal-portfolio",
              tag: "Active",
            },
            {
              name: "Personal Blog",
              desc: "Jekyll + Chirpy theme on GitHub Pages",
              url: "https://ateliermizumi.github.io",
              tag: "",
            },
            {
              name: "ZMK Firmware",
              desc: "Custom firmware for split keyboards with OLED",
              url: "https://github.com/AtelierMizumi/zmk-firmware",
              tag: "",
            },
            {
              name: "NixOS Config",
              desc: "Personal NixOS + KDE Plasma configuration",
              url: "https://github.com/AtelierMizumi/nixos-kde-config",
              tag: "",
            },
          ].map((project) => (
            <a
              key={project.name}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.05] transition-colors group"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors">
                    {project.name}
                  </span>
                  {project.tag && (
                    <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                      {project.tag}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 truncate mt-0.5">
                  {project.desc}
                </p>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-gray-600 group-hover:text-gray-400 flex-shrink-0 ml-2 transition-colors" />
            </a>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-800/50 text-center">
        <p className="text-xs text-gray-600">
          Built with Next.js • TypeScript • TailwindCSS • xterm.js
        </p>
        <p className="text-xs text-gray-700 mt-1">
          Inspired by Linux ricing & MiSide desktop
        </p>
      </div>
    </div>
  );
};

export default AboutWindow;
