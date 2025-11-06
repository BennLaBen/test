'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'

export type Theme = 'industrial' | 'onyx'

const THEME_CONFIG: Record<Theme, { className: string; baseMode: 'light' | 'dark' }> = {
  industrial: {
    className: 'theme-industrial',
    baseMode: 'light',
  },
  onyx: {
    className: 'theme-onyx',
    baseMode: 'dark',
  },
}

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: 'industrial',
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = 'industrial',
  storageKey = 'theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)

  const themeKeys = useMemo(() => Object.keys(THEME_CONFIG) as Theme[], [])

  const sanitizeTheme = (value: string | null): Theme => {
    if (!value) return defaultTheme
    if (themeKeys.includes(value as Theme)) {
      return value as Theme
    }
    // Legacy mappings from previous versions
    if (value === 'dark') return 'onyx'
    return 'industrial'
  }

  // Initialize from localStorage if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      const resolved = sanitizeTheme(saved)
      if (resolved !== theme) {
        setTheme(resolved)
      }
    } catch (_) {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const root = window.document.documentElement

    const allClasses = ['light', 'dark', ...themeKeys.map((key) => THEME_CONFIG[key].className)]
    root.classList.remove(...allClasses)

    const config = THEME_CONFIG[theme]
    root.classList.add(config.baseMode)
    root.classList.add(config.className)
  }, [theme, themeKeys])

  const value = {
    theme,
    setTheme: (nextTheme: Theme) => {
      try {
        localStorage.setItem(storageKey, nextTheme)
      } catch (_) {}
      setTheme(nextTheme)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider')

  return context
}
