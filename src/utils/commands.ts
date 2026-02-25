import { Terminal } from "@xterm/xterm";
import { runMatrixEffect } from "./terminal";

// Track active effects for cleanup
let activeMatrixEffect: (() => void) | null = null;

// Function to get system information
const getSystemInfo = () => {
  return {
    user: 'thuanc177@cachyos',
    os: 'CachyOS x86_64',
    host: 'Nitro AN515-58',
    kernel: 'Linux 6.14.4-2-cachyos',
    uptime: '3 hours, 8 mins',
    packages: '1979 (pacman)',
    shell: 'fish 4.0.2',
    displays: [
      '1920x1080 @ 100Hz [External]',
      '1920x1080 @ 144Hz [Built-in]'
    ],
    de: 'KDE Plasma 6.3.4',
    wm: 'KWin (Wayland)',
    cpu: 'i5-12500H (16) @ 4.50 GHz',
    gpu: 'NVIDIA RTX 3050 Mobile / Intel Iris Xe',
    memory: '13.79 GiB / 31.05 GiB (44%)',
    locale: 'en_US.UTF-8'
  };
};

// Define commands interface with xterm Terminal type
interface Commands {
  [key: string]: (terminal: Terminal, args?: string[]) => Promise<void>;
}

export const commands: Commands = {
  help: async (terminal: Terminal) => {
    terminal.writeln("\x1b[1;36m╔════════════════════════════════════════════╗\x1b[0m");
    terminal.writeln("\x1b[1;36m║\x1b[0m   \x1b[1;37mAvailable Commands\x1b[0m                       \x1b[1;36m║\x1b[0m");
    terminal.writeln("\x1b[1;36m╠════════════════════════════════════════════╣\x1b[0m");
    terminal.writeln("\x1b[1;36m║\x1b[0m  \x1b[1;33mhelp\x1b[0m       Show this help message          \x1b[1;36m║\x1b[0m");
    terminal.writeln("\x1b[1;36m║\x1b[0m  \x1b[1;33mclear\x1b[0m      Clear the terminal               \x1b[1;36m║\x1b[0m");
    terminal.writeln("\x1b[1;36m║\x1b[0m  \x1b[1;33mecho\x1b[0m       Print text to the terminal       \x1b[1;36m║\x1b[0m");
    terminal.writeln("\x1b[1;36m║\x1b[0m  \x1b[1;33mls\x1b[0m         List files and directories       \x1b[1;36m║\x1b[0m");
    terminal.writeln("\x1b[1;36m║\x1b[0m  \x1b[1;33mcat\x1b[0m        Show content of a file           \x1b[1;36m║\x1b[0m");
    terminal.writeln("\x1b[1;36m║\x1b[0m  \x1b[1;33mabout\x1b[0m      About me                        \x1b[1;36m║\x1b[0m");
    terminal.writeln("\x1b[1;36m║\x1b[0m  \x1b[1;33mprojects\x1b[0m   List my projects                \x1b[1;36m║\x1b[0m");
    terminal.writeln("\x1b[1;36m║\x1b[0m  \x1b[1;33mskills\x1b[0m     List my skills                  \x1b[1;36m║\x1b[0m");
    terminal.writeln("\x1b[1;36m║\x1b[0m  \x1b[1;33mcontact\x1b[0m    Show my contact information     \x1b[1;36m║\x1b[0m");
    terminal.writeln("\x1b[1;36m║\x1b[0m  \x1b[1;33mcmatrix\x1b[0m    Run matrix effect               \x1b[1;36m║\x1b[0m");
    terminal.writeln("\x1b[1;36m║\x1b[0m  \x1b[1;33mfastfetch\x1b[0m  Display system information      \x1b[1;36m║\x1b[0m");
    terminal.writeln("\x1b[1;36m║\x1b[0m  \x1b[1;33mneofetch\x1b[0m   Alias for fastfetch             \x1b[1;36m║\x1b[0m");
    terminal.writeln("\x1b[1;36m║\x1b[0m  \x1b[1;33mopen\x1b[0m       Open an app (music, games)      \x1b[1;36m║\x1b[0m");
    terminal.writeln("\x1b[1;36m║\x1b[0m  \x1b[1;33mhistory\x1b[0m    Show command history             \x1b[1;36m║\x1b[0m");
    terminal.writeln("\x1b[1;36m║\x1b[0m  \x1b[1;33mdate\x1b[0m       Show current date and time      \x1b[1;36m║\x1b[0m");
    terminal.writeln("\x1b[1;36m║\x1b[0m  \x1b[1;33mwhoami\x1b[0m     Show current user               \x1b[1;36m║\x1b[0m");
    terminal.writeln("\x1b[1;36m║\x1b[0m  \x1b[1;33muname\x1b[0m      System information              \x1b[1;36m║\x1b[0m");
    terminal.writeln("\x1b[1;36m║\x1b[0m                                             \x1b[1;36m║\x1b[0m");
    terminal.writeln("\x1b[1;36m║\x1b[0m  \x1b[1;35mEaster Eggs\x1b[0m                                \x1b[1;36m║\x1b[0m");
    terminal.writeln("\x1b[1;36m║\x1b[0m  \x1b[1;33mcoffee\x1b[0m     Spawn a cup of coffee           \x1b[1;36m║\x1b[0m");
    terminal.writeln("\x1b[1;36m║\x1b[0m  \x1b[1;33mrain\x1b[0m       Toggle rain effect              \x1b[1;36m║\x1b[0m");
    terminal.writeln("\x1b[1;36m╚════════════════════════════════════════════╝\x1b[0m");
  },

  clear: async (terminal: Terminal) => {
    terminal.clear();
  },

  echo: async (terminal: Terminal, args: string[] = []) => {
    terminal.writeln(args.join(" "));
  },

  ls: async (terminal: Terminal) => {
    terminal.writeln("\x1b[1;34mprojects\x1b[0m  \x1b[1;34mdocs\x1b[0m  \x1b[1;34mskills\x1b[0m  \x1b[1;34m.config\x1b[0m");
    terminal.writeln("\x1b[1;32mabout.txt\x1b[0m  \x1b[1;32mcontact.txt\x1b[0m  \x1b[1;32mresume.pdf\x1b[0m  \x1b[1;32mREADME.md\x1b[0m");
  },

  cat: async (terminal: Terminal, args: string[] = []) => {
    if (args.length === 0) {
      terminal.writeln("Usage: cat <filename>");
      return;
    }

    const filename = args[0].toLowerCase();
    switch (filename) {
      case "about.txt":
        terminal.writeln("");
        terminal.writeln("\x1b[1;36m  ┌──────────────────────────────────────┐\x1b[0m");
        terminal.writeln("\x1b[1;36m  │\x1b[0m  \x1b[1;37mHi! I'm thuanc177 (AtelierMizumi)\x1b[0m \x1b[1;36m│\x1b[0m");
        terminal.writeln("\x1b[1;36m  └──────────────────────────────────────┘\x1b[0m");
        terminal.writeln("");
        terminal.writeln("  A Computer Science student at VKU, Vietnam.");
        terminal.writeln("  Passionate about Linux ricing, custom keyboards,");
        terminal.writeln("  embedded systems (ZMK firmware), and web development.");
        terminal.writeln("");
        terminal.writeln("  \x1b[1;33m🏔️\x1b[0m  Arch Linux / CachyOS user");
        terminal.writeln("  \x1b[1;33m⌨️\x1b[0m  Custom keyboard enthusiast");
        terminal.writeln("  \x1b[1;33m🎮\x1b[0m  MiSide & Genshin Impact fan");
        terminal.writeln("  \x1b[1;33m🎵\x1b[0m  Lofi & ambient music lover");
        terminal.writeln("");
        break;
      case "contact.txt":
        terminal.writeln("");
        terminal.writeln("  \x1b[1;36mContact Information:\x1b[0m");
        terminal.writeln("  ─────────────────────────────");
        terminal.writeln("  \x1b[1;33mEmail:\x1b[0m    contact@thuanc177.me");
        terminal.writeln("  \x1b[1;33mGitHub:\x1b[0m   github.com/AtelierMizumi");
        terminal.writeln("  \x1b[1;33mBlog:\x1b[0m     ateliermizumi.github.io");
        terminal.writeln("");
        break;
      case "readme.md":
        terminal.writeln("");
        terminal.writeln("  \x1b[1;37m# Terminal Portfolio\x1b[0m");
        terminal.writeln("  A virtual desktop portfolio inspired by Linux ricing & MiSide.");
        terminal.writeln("  Built with Next.js, TypeScript, TailwindCSS, and xterm.js.");
        terminal.writeln("");
        terminal.writeln("  Type `help` to see all available commands.");
        terminal.writeln("");
        break;
      default:
        terminal.writeln(`File not found: ${args[0]}`);
        terminal.writeln("Available files: about.txt, contact.txt, readme.md");
    }
  },

  about: async (terminal: Terminal) => {
    await commands.cat(terminal, ["about.txt"]);
  },

  projects: async (terminal: Terminal) => {
    terminal.writeln("");
    terminal.writeln("\x1b[1;36m  My Projects\x1b[0m");
    terminal.writeln("  ═══════════════════════════════════════════════");
    terminal.writeln("");
    terminal.writeln("  \x1b[1;33m1. Terminal Portfolio\x1b[0m \x1b[32m[active]\x1b[0m");
    terminal.writeln("     Virtual desktop portfolio with Linux rice aesthetics");
    terminal.writeln("     \x1b[90mNext.js • TypeScript • TailwindCSS • xterm.js\x1b[0m");
    terminal.writeln("");
    terminal.writeln("  \x1b[1;33m2. Personal Blog\x1b[0m");
    terminal.writeln("     Technical blog powered by Jekyll + Chirpy theme");
    terminal.writeln("     \x1b[90mJekyll • Ruby • GitHub Pages\x1b[0m");
    terminal.writeln("     \x1b[34mhttps://ateliermizumi.github.io\x1b[0m");
    terminal.writeln("");
    terminal.writeln("  \x1b[1;33m3. NixOS KDE Config\x1b[0m");
    terminal.writeln("     Personal NixOS + KDE Plasma configuration");
    terminal.writeln("     \x1b[90mNix • NixOS • KDE Plasma\x1b[0m");
    terminal.writeln("");
    terminal.writeln("  \x1b[1;33m4. ZMK Firmware\x1b[0m");
    terminal.writeln("     Custom ZMK firmware for split keyboards with OLED");
    terminal.writeln("     \x1b[90mC • ZMK • Embedded Systems\x1b[0m");
    terminal.writeln("");
    terminal.writeln("  \x1b[1;33m5. GitHub Readme Stats\x1b[0m");
    terminal.writeln("     Self-hosted instance on Vercel for profile widgets");
    terminal.writeln("     \x1b[90mVercel • Node.js\x1b[0m");
    terminal.writeln("");
  },

  skills: async (terminal: Terminal) => {
    terminal.writeln("");
    terminal.writeln("\x1b[1;36m  Technical Skills\x1b[0m");
    terminal.writeln("  ═══════════════════════════════════════════════");
    terminal.writeln("");
    terminal.writeln("  \x1b[1;33mLanguages:\x1b[0m");
    terminal.writeln("    TypeScript • JavaScript • Python • C/C++ • Nix • Rust");
    terminal.writeln("");
    terminal.writeln("  \x1b[1;33mFrontend:\x1b[0m");
    terminal.writeln("    React • Next.js • TailwindCSS • HTML/CSS");
    terminal.writeln("");
    terminal.writeln("  \x1b[1;33mBackend & Tools:\x1b[0m");
    terminal.writeln("    Node.js • Git • Docker • Linux • NixOS");
    terminal.writeln("");
    terminal.writeln("  \x1b[1;33mEmbedded:\x1b[0m");
    terminal.writeln("    ZMK Firmware • Custom Keyboards • OLED Displays");
    terminal.writeln("");
    terminal.writeln("  \x1b[1;33mOS & Environment:\x1b[0m");
    terminal.writeln("    CachyOS (Arch) • NixOS • KDE Plasma • Wayland");
    terminal.writeln("");
  },

  contact: async (terminal: Terminal) => {
    await commands.cat(terminal, ["contact.txt"]);
  },

  cmatrix: async (terminal: Terminal) => {
    // Clear any existing matrix effect
    if (activeMatrixEffect) {
      activeMatrixEffect();
      activeMatrixEffect = null;
    }

    terminal.writeln("Starting Matrix effect... Press any key to exit.");

    // Start a new matrix effect
    activeMatrixEffect = runMatrixEffect(terminal);

    // Set up exit handler
    const exitHandler = terminal.onKey(() => {
      // Stop matrix effect on any keypress
      if (activeMatrixEffect) {
        activeMatrixEffect();
        activeMatrixEffect = null;
      }

      // Remove this handler
      exitHandler.dispose();

      // Clear terminal and restore prompt
      terminal.clear();
      terminal.write("Matrix effect terminated.\r\n");
    });
  },

  fastfetch: async (terminal: Terminal) => {
    const info = getSystemInfo();

    terminal.clear();

    terminal.writeln("");
    terminal.writeln("\x1b[36m           .-------------------------:\x1b[0m                    \x1b[1;32m" + info.user + "\x1b[0m");
    terminal.writeln("\x1b[36m          .+=========================.\x1b[0m                    \x1b[1;37m-----------------\x1b[0m");
    terminal.writeln("\x1b[36m         :++===++==================-\x1b[0m       \x1b[36m:++-\x1b[0m           \x1b[1;37mOS:\x1b[0m " + info.os);
    terminal.writeln("\x1b[36m        :*++====+++++=============-\x1b[0m        \x1b[36m.==:\x1b[0m           \x1b[1;37mHost:\x1b[0m " + info.host);
    terminal.writeln("\x1b[36m       -*+++=====+***++==========:\x1b[0m                        \x1b[1;37mKernel:\x1b[0m " + info.kernel);
    terminal.writeln("\x1b[36m      =*++++========------------:\x1b[0m                         \x1b[1;37mUptime:\x1b[0m " + info.uptime);
    terminal.writeln("\x1b[36m     =*+++++=====-\x1b[0m                     \x1b[36m...\x1b[0m                \x1b[1;37mPackages:\x1b[0m " + info.packages);
    terminal.writeln("\x1b[36m   .+*+++++=-===:\x1b[0m                    \x1b[36m.=+++=:\x1b[0m              \x1b[1;37mShell:\x1b[0m " + info.shell);
    terminal.writeln("\x1b[36m  :++++=====-==:\x1b[0m                     \x1b[36m-*****+\x1b[0m              \x1b[1;37mDisplay 1:\x1b[0m " + info.displays[0]);
    terminal.writeln("\x1b[36m :++========-=.\x1b[0m                      \x1b[36m.=+**+.\x1b[0m              \x1b[1;37mDisplay 2:\x1b[0m " + info.displays[1]);
    terminal.writeln("\x1b[36m.+===========-.x1b[0m                          \x1b[36m.\x1b[0m                 \x1b[1;37mDE:\x1b[0m " + info.de);
    terminal.writeln("\x1b[36m :+++++++====-\x1b[0m                                \x1b[36m.--==-.     \x1b[0m \x1b[1;37mWM:\x1b[0m " + info.wm);
    terminal.writeln("\x1b[36m  :++==========.\x1b[0m                             \x1b[36m:+++++++:\x1b[0m    \x1b[1;37mCPU:\x1b[0m " + info.cpu);
    terminal.writeln("\x1b[36m   .-===========.\x1b[0m                            \x1b[36m=*****+*+\x1b[0m    \x1b[1;37mGPU:\x1b[0m " + info.gpu);
    terminal.writeln("\x1b[36m    .-===========:\x1b[0m                           \x1b[36m.+*****+:\x1b[0m    \x1b[1;37mMemory:\x1b[0m " + info.memory);
    terminal.writeln("\x1b[36m      -=======++++:::::::::::::::::::::::::-:  .---:\x1b[0m      \x1b[1;37mLocale:\x1b[0m " + info.locale);
    terminal.writeln("");
    terminal.writeln("");
  },

  // Alias for fastfetch
  neofetch: async (terminal: Terminal) => {
    await commands.fastfetch(terminal);
  },

  // Open apps from terminal
  open: async (terminal: Terminal, args: string[] = []) => {
    if (args.length === 0) {
      terminal.writeln("Usage: open <app>");
      terminal.writeln("Available apps: music, games, about, resume");
      return;
    }

    const app = args[0].toLowerCase();
    switch (app) {
      case "music":
        terminal.writeln("Opening Music Player...");
        // Dispatch custom event to open music player
        window.dispatchEvent(new CustomEvent('terminal-open-app', { detail: { app: 'music' } }));
        break;
      case "games":
        terminal.writeln("Opening Games Explorer...");
        window.dispatchEvent(new CustomEvent('terminal-open-app', { detail: { app: 'games' } }));
        break;
      case "about":
        terminal.writeln("Opening About window...");
        window.dispatchEvent(new CustomEvent('terminal-open-app', { detail: { app: 'about' } }));
        break;
      case "resume":
        terminal.writeln("Opening Resume...");
        window.dispatchEvent(new CustomEvent('terminal-open-app', { detail: { app: 'resume' } }));
        break;
      default:
        terminal.writeln(`Unknown app: ${app}`);
        terminal.writeln("Available apps: music, games, about, resume");
    }
  },

  // Show current date/time
  date: async (terminal: Terminal) => {
    const now = new Date();
    terminal.writeln(now.toString());
  },

  // Show current user
  whoami: async (terminal: Terminal) => {
    terminal.writeln("thuanc177");
  },

  // System information
  uname: async (terminal: Terminal, args: string[] = []) => {
    if (args.includes("-a")) {
      terminal.writeln("Linux cachyos 6.14.4-2-cachyos x86_64 GNU/Linux");
    } else {
      terminal.writeln("Linux");
    }
  },

  // Command history (placeholder — actual history is managed by Terminal.tsx)
  history: async (terminal: Terminal) => {
    terminal.writeln("  Command history is managed by the terminal.");
    terminal.writeln("  Use ↑/↓ arrow keys to navigate through history.");
  },

  // Easter Eggs
  coffee: async (terminal: Terminal) => {
    terminal.writeln("\r\n  \x1b[1;33mEnjoy your coffee! ☕\x1b[0m");
    window.dispatchEvent(new CustomEvent('terminal-easter-egg', { detail: { type: 'coffee' } }));
  },

  rain: async (terminal: Terminal) => {
    terminal.writeln("\r\n  \x1b[1;34mIt's starting to rain... 🌧️\x1b[0m");
    window.dispatchEvent(new CustomEvent('terminal-easter-egg', { detail: { type: 'rain' } }));
  },
};