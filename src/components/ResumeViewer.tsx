"use client";

import {
  Code,
  Cpu,
  Download,
  Github,
  Globe,
  GraduationCap,
  Keyboard,
  Mail,
  MapPin,
} from "lucide-react";
import type React from "react";

interface ResumeViewerProps {
  className?: string;
}

const ResumeViewer: React.FC<ResumeViewerProps> = ({ className = "" }) => {
  return (
    <div
      className={`h-full overflow-y-auto bg-[#0d0d0d] text-gray-200 ${className}`}
    >
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-purple-900/20 to-cyan-900/20 border-b border-gray-800/50">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Thuan C.</h1>
            <p className="text-gray-400 mt-1">Computer Science Student</p>
            <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> Vietnam
              </span>
              <a
                href="mailto:contact@thuanc177.me"
                className="flex items-center gap-1 hover:text-gray-300 transition-colors"
              >
                <Mail className="w-3.5 h-3.5" /> contact@thuanc177.me
              </a>
            </div>
            <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
              <a
                href="https://github.com/AtelierMizumi"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-gray-300 transition-colors"
              >
                <Github className="w-3.5 h-3.5" /> AtelierMizumi
              </a>
              <a
                href="https://ateliermizumi.github.io"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-gray-300 transition-colors"
              >
                <Globe className="w-3.5 h-3.5" /> Blog
              </a>
            </div>
          </div>
          <a
            href="/resume.pdf"
            download="ThuanC_Resume.pdf"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm text-white transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            PDF
          </a>
        </div>
      </div>

      {/* Summary */}
      <div className="px-6 py-4 border-b border-gray-800/50">
        <h2 className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-2">
          Summary
        </h2>
        <p className="text-sm text-gray-300 leading-relaxed">
          Computer Science student with hands-on experience in web development
          (React, Next.js, TypeScript), embedded systems (ZMK firmware for
          custom keyboards), and Linux system administration. Passionate about
          open-source contribution, Linux ricing, and building developer tools.
        </p>
      </div>

      {/* Education */}
      <div className="px-6 py-4 border-b border-gray-800/50">
        <h2 className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-3">
          Education
        </h2>
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-purple-500/10 mt-0.5">
            <GraduationCap className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-white">
              Vietnam - Korea University of Information & Communication
              Technology
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Bachelor of Computer Science
            </p>
            <p className="text-xs text-gray-600 mt-0.5">
              VKU, Da Nang, Vietnam
            </p>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="px-6 py-4 border-b border-gray-800/50">
        <h2 className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-3">
          Skills
        </h2>
        <div className="space-y-3">
          {[
            {
              icon: <Code className="w-4 h-4 text-green-400" />,
              category: "Languages & Frameworks",
              skills:
                "TypeScript, JavaScript, Python, C/C++, Rust, Nix, React, Next.js, TailwindCSS, Node.js",
            },
            {
              icon: <Cpu className="w-4 h-4 text-yellow-400" />,
              category: "Systems & Tools",
              skills:
                "Linux (CachyOS/NixOS), Git, Docker, KDE Plasma, Wayland, GitHub Actions",
            },
            {
              icon: <Keyboard className="w-4 h-4 text-cyan-400" />,
              category: "Embedded & Hardware",
              skills:
                "ZMK Firmware, Custom Keyboard PCBs, OLED Displays, I2C/SPI",
            },
          ].map((group) => (
            <div key={group.category} className="flex items-start gap-3">
              <div className="p-1.5 rounded bg-white/[0.03] mt-0.5">
                {group.icon}
              </div>
              <div>
                <h3 className="text-xs font-medium text-gray-300">
                  {group.category}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">{group.skills}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Projects */}
      <div className="px-6 py-4 border-b border-gray-800/50">
        <h2 className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-3">
          Projects
        </h2>
        <div className="space-y-4">
          {[
            {
              name: "Terminal Portfolio",
              stack: "Next.js • TypeScript • TailwindCSS • xterm.js",
              details: [
                "Built a virtual desktop portfolio simulating a Linux environment with window management",
                "Implemented playable games (Snake, Tetris), music player with MiSide OST",
                "Custom terminal with fastfetch, file commands, and app launcher integration",
              ],
            },
            {
              name: "ZMK Firmware for CKB",
              stack: "C • ZMK • Zephyr RTOS",
              details: [
                "Developed custom firmware for a split keyboard with OLED displays",
                "Implemented status widgets including Hammerbeam pixel art on nice!oled",
                "Configured BLE connectivity for peripheral communication",
              ],
            },
            {
              name: "NixOS Configuration",
              stack: "Nix • NixOS • KDE Plasma",
              details: [
                "Managed declarative system configuration with Nix flakes",
                "Set up KDE Plasma 6 with Wayland on custom kernel (CachyOS)",
              ],
            },
          ].map((project) => (
            <div key={project.name}>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium text-white">
                  {project.name}
                </h3>
                <span className="text-[10px] text-gray-600">
                  {project.stack}
                </span>
              </div>
              <ul className="mt-1 space-y-0.5">
                {project.details.map((detail) => (
                  <li
                    key={detail}
                    className="text-xs text-gray-400 flex items-start gap-1.5"
                  >
                    <span className="text-gray-600 mt-1">•</span>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 text-center">
        <p className="text-xs text-gray-600">
          This resume is rendered within the Terminal Portfolio • Updated Feb
          2026
        </p>
      </div>
    </div>
  );
};

export default ResumeViewer;
