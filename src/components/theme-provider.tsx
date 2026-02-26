"use client";

import { animate } from "animejs";
import type React from "react";
import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type ThemeType = "catppuccin" | "bozo" | "mountains" | "sequoia";

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  changeTheme: (theme?: ThemeType) => void;
  cycleTheme: () => void;
  accentColor: string;
  accentName: string;
  changeAccentColor: (color: string, name: string) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "catppuccin",
  setTheme: () => null,
  changeTheme: () => null,
  cycleTheme: () => null,
  accentColor: "hsl(277, 59%, 76%)",
  accentName: "Mauve",
  changeAccentColor: () => null,
});

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
}

// Safe localStorage helper
function safeGetItem(key: string): string | null {
  try {
    if (
      typeof window !== "undefined" &&
      window.localStorage &&
      typeof window.localStorage.getItem === "function"
    ) {
      return window.localStorage.getItem(key);
    }
  } catch {
    /* no-op */
  }
  return null;
}

function safeSetItem(key: string, value: string): void {
  try {
    if (
      typeof window !== "undefined" &&
      window.localStorage &&
      typeof window.localStorage.setItem === "function"
    ) {
      window.localStorage.setItem(key, value);
    }
  } catch {
    /* no-op */
  }
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeType>("catppuccin");
  const [mounted, setMounted] = useState(false);
  const [accentColor, setAccentColor] = useState<string>("hsl(277, 59%, 76%)");
  const [accentName, setAccentName] = useState<string>("Mauve");

  const themes: ThemeType[] = ["catppuccin", "bozo", "mountains", "sequoia"];

  useEffect(() => {
    setMounted(true);

    const savedTheme = safeGetItem("terminal-portfolio-theme");
    if (savedTheme && themes.includes(savedTheme as ThemeType)) {
      setTheme(savedTheme as ThemeType);
    }

    const savedAccentColor = safeGetItem("terminal-portfolio-accent-color");
    const savedAccentName = safeGetItem("terminal-portfolio-accent-name");

    if (savedAccentColor) {
      setAccentColor(savedAccentColor);
      document.documentElement.style.setProperty("--primary", savedAccentColor);
      document.documentElement.style.setProperty("--ring", savedAccentColor);
    }

    if (savedAccentName) {
      setAccentName(savedAccentName);
    }
  }, []);

  const changeTheme = (newTheme?: ThemeType) => {
    if (newTheme && themes.includes(newTheme)) {
      setTheme(newTheme);
      safeSetItem("terminal-portfolio-theme", newTheme);

      document.dispatchEvent(
        new CustomEvent("change-background", { detail: newTheme }),
      );

      const themeButton = document.querySelector(".theme-button");
      if (themeButton) {
        animate(themeButton, {
          scale: [1, 1.2, 1],
          duration: 300,
          easing: "easeInOutQuad",
        });
      }
    }
  };

  const cycleTheme = () => {
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    changeTheme(themes[nextIndex]);
  };

  const changeAccentColor = (color: string, name: string) => {
    setAccentColor(color);
    setAccentName(name);

    document.documentElement.style.setProperty("--primary", color);
    document.documentElement.style.setProperty("--ring", color);

    safeSetItem("terminal-portfolio-accent-color", color);
    safeSetItem("terminal-portfolio-accent-name", name);

    const colorSwatch = document.querySelector(".color-palette-button");
    if (colorSwatch) {
      animate(colorSwatch, {
        scale: [1, 1.2, 1],
        duration: 300,
        easing: "easeInOutQuad",
      });
    }
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        changeTheme,
        cycleTheme,
        accentColor,
        accentName,
        changeAccentColor,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
