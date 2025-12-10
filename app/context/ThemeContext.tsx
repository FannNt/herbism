"use client"

import { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from "react"

type TherapyMode = "default" | "calm" | "energy" | "balance" | "healing"

interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  gradient: string
  hover: string
}

interface ThemeContextType {
  currentMode: TherapyMode
  setCurrentMode: (mode: TherapyMode) => void
  getThemeColors: () => ThemeColors
  themeColors: ThemeColors // Direct access to current theme colors
}

const themeColorsMap: Record<TherapyMode, ThemeColors> = {
  default: {
    primary: "#10b981", // emerald-600
    secondary: "#14b8a6", // teal-600
    accent: "#059669", // emerald-700
    gradient: "from-emerald-600 to-teal-600",
    hover: "hover:from-emerald-700 hover:to-teal-700",
  },
  calm: {
    primary: "#3b82f6", // blue-600
    secondary: "#6366f1", // indigo-600
    accent: "#2563eb", // blue-700
    gradient: "from-blue-600 to-indigo-600",
    hover: "hover:from-blue-700 hover:to-indigo-700",
  },
  energy: {
    primary: "#f97316", // orange-600
    secondary: "#ef4444", // red-600
    accent: "#ea580c", // orange-700
    gradient: "from-orange-600 to-red-600",
    hover: "hover:from-orange-700 hover:to-red-700",
  },
  balance: {
    primary: "#a855f7", // purple-600
    secondary: "#ec4899", // pink-600
    accent: "#9333ea", // purple-700
    gradient: "from-purple-600 to-pink-600",
    hover: "hover:from-purple-700 hover:to-pink-700",
  },
  healing: {
    primary: "#14b8a6", // teal-600
    secondary: "#06b6d4", // cyan-600
    accent: "#0d9488", // teal-700
    gradient: "from-teal-600 to-cyan-600",
    hover: "hover:from-teal-700 hover:to-cyan-700",
  },
}

const THEME_STORAGE_KEY = "herbism-theme-mode"

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [currentMode, setCurrentModeState] = useState<TherapyMode>("default")
  const [isInitialized, setIsInitialized] = useState(false)

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as TherapyMode | null
    if (savedTheme && themeColorsMap[savedTheme]) {
      setCurrentModeState(savedTheme)
    }
    setIsInitialized(true)
  }, [])

  // Listen for storage changes from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === THEME_STORAGE_KEY && e.newValue) {
        const newTheme = e.newValue as TherapyMode
        if (themeColorsMap[newTheme]) {
          setCurrentModeState(newTheme)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // Save theme to localStorage and update state
  const setCurrentMode = useCallback((mode: TherapyMode) => {
    setCurrentModeState(mode)
    localStorage.setItem(THEME_STORAGE_KEY, mode)
    // Dispatch storage event for same-tab updates
    window.dispatchEvent(new StorageEvent('storage', {
      key: THEME_STORAGE_KEY,
      newValue: mode,
    }))
  }, [])

  // Memoize theme colors based on current mode
  const themeColors = useMemo(() => themeColorsMap[currentMode], [currentMode])

  const getThemeColors = useCallback(() => themeColorsMap[currentMode], [currentMode])

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    currentMode,
    setCurrentMode,
    getThemeColors,
    themeColors,
  }), [currentMode, setCurrentMode, getThemeColors, themeColors])

  if (!isInitialized) {
    return null
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
