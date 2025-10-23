"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { ThemeColor, themeColors, defaultTheme } from "@/lib/theme-colors";

interface ThemeContextType {
  theme: ThemeColor;
  setTheme: (theme: ThemeColor) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeColor>(defaultTheme);
  const [mounted, setMounted] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme-color") as ThemeColor;
    if (savedTheme && themeColors[savedTheme]) {
      setThemeState(savedTheme);
      applyTheme(savedTheme);
    } else {
      applyTheme(defaultTheme);
    }
  }, []);

  const applyTheme = (newTheme: ThemeColor) => {
    const colors = themeColors[newTheme];
    const root = document.documentElement;

    // Set CSS variables
    root.style.setProperty("--theme-primary", colors.primary);
    root.style.setProperty("--theme-primary-hover", colors.primaryHover);
    root.style.setProperty("--theme-primary-light", colors.primaryLight);
    root.style.setProperty("--theme-primary-dark", colors.primaryDark);
    
    // Also update --primary for Tailwind compatibility
    root.style.setProperty("--primary", colors.primary);
    
    // Extract RGB values for opacity variants
    const hex = colors.primary.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    root.style.setProperty("--theme-primary-rgb", `${r}, ${g}, ${b}`);
    
    // Set data attribute for CSS selectors
    root.setAttribute("data-theme-color", newTheme);
  };

  const setTheme = (newTheme: ThemeColor) => {
    setThemeState(newTheme);
    localStorage.setItem("theme-color", newTheme);
    applyTheme(newTheme);
  };

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
