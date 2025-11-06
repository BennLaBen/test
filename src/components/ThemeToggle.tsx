'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [mounted, setMounted] = useState(false)

  // Éviter le flash lors du chargement
  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark'
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light')
    setTheme(initialTheme)
    
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    
    localStorage.setItem('theme', newTheme)
  }

  // Ne pas afficher pendant le montage côté serveur
  if (!mounted) {
    return (
      <div className="flex h-10 w-20 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
        <div className="h-5 w-5 animate-pulse rounded-full bg-gray-400" />
      </div>
    )
  }

  return (
    <button
      onClick={toggleTheme}
      className="group relative flex h-10 w-20 items-center rounded-full bg-gradient-to-r from-primary-100 to-primary-200 p-1 transition-all hover:shadow-lg dark:from-gray-700 dark:to-gray-600"
      aria-label={`Passer en mode ${theme === 'light' ? 'sombre' : 'clair'}`}
      title={`Thème : ${theme === 'light' ? 'Industrial Blue' : 'Midnight Pro'}`}
    >
      {/* Track avec dégradé */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-500/20 to-secondary-500/20 dark:from-primary-800/30 dark:to-secondary-900/30" />
      
      {/* Slider */}
      <motion.div
        className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-lg dark:bg-gray-800"
        animate={{
          x: theme === 'light' ? 0 : 40,
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 30,
        }}
      >
        {/* Icônes animées */}
        <div className="relative h-5 w-5">
          {/* Icône Soleil (Mode Clair) */}
          <motion.svg
            className="absolute inset-0 text-primary-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            animate={{
              scale: theme === 'light' ? 1 : 0,
              rotate: theme === 'light' ? 0 : 180,
              opacity: theme === 'light' ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </motion.svg>

          {/* Icône Lune (Mode Sombre) */}
          <motion.svg
            className="absolute inset-0 text-secondary-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            animate={{
              scale: theme === 'dark' ? 1 : 0,
              rotate: theme === 'dark' ? 0 : -180,
              opacity: theme === 'dark' ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </motion.svg>
        </div>
      </motion.div>

      {/* Labels optionnels (cachés sur petit écran) */}
      <div className="absolute inset-0 flex items-center justify-between px-2 text-xs font-bold">
        <span className={`ml-1 transition-opacity ${theme === 'light' ? 'opacity-0' : 'opacity-60 text-gray-300'}`}>
          
        </span>
        <span className={`mr-1 transition-opacity ${theme === 'dark' ? 'opacity-0' : 'opacity-60 text-primary-700'}`}>
          
        </span>
      </div>

      {/* Effet de brillance au hover */}
      <div className="absolute inset-0 rounded-full opacity-0 transition-opacity group-hover:opacity-100">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
      </div>
    </button>
  )
}

// Composant avec tooltip descriptif (version alternative plus détaillée)
export function ThemeToggleWithTooltip() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [mounted, setMounted] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark'
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light')
    setTheme(initialTheme)
    
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    
    localStorage.setItem('theme', newTheme)
  }

  if (!mounted) {
    return (
      <div className="flex h-10 w-20 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
        <div className="h-5 w-5 animate-pulse rounded-full bg-gray-400" />
      </div>
    )
  }

  const themeName = theme === 'light' ? 'Industrial Blue' : 'Midnight Pro'

  return (
    <div className="relative">
      <button
        onClick={toggleTheme}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="group relative flex h-10 w-20 items-center rounded-full bg-gradient-to-r from-primary-100 to-primary-200 p-1 transition-all hover:shadow-xl hover:scale-105 dark:from-gray-700 dark:to-gray-600"
        aria-label={`Passer en mode ${theme === 'light' ? 'sombre' : 'clair'}`}
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-500/20 to-secondary-500/20 dark:from-primary-800/30 dark:to-secondary-900/30" />
        
        <motion.div
          className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-lg dark:bg-gray-800"
          animate={{ x: theme === 'light' ? 0 : 40 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
          <div className="relative h-5 w-5">
            <motion.svg
              className="absolute inset-0 text-primary-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={{
                scale: theme === 'light' ? 1 : 0,
                rotate: theme === 'light' ? 0 : 180,
                opacity: theme === 'light' ? 1 : 0,
              }}
              transition={{ duration: 0.3 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </motion.svg>

            <motion.svg
              className="absolute inset-0 text-secondary-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={{
                scale: theme === 'dark' ? 1 : 0,
                rotate: theme === 'dark' ? 0 : -180,
                opacity: theme === 'dark' ? 1 : 0,
              }}
              transition={{ duration: 0.3 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </motion.svg>
          </div>
        </motion.div>

        <div className="absolute inset-0 rounded-full opacity-0 transition-opacity group-hover:opacity-100">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
        </div>
      </button>

      {/* Tooltip avec nom du thème */}
      {showTooltip && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute right-0 top-full mt-2 z-50"
        >
          <div className="rounded-lg bg-gray-900 dark:bg-gray-700 px-3 py-2 text-xs font-semibold text-white shadow-xl whitespace-nowrap">
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${theme === 'light' ? 'bg-primary-500' : 'bg-secondary-400'}`} />
              {themeName}
            </div>
            <div className="absolute -top-1 right-4 h-2 w-2 rotate-45 bg-gray-900 dark:bg-gray-700" />
          </div>
        </motion.div>
      )}
    </div>
  )
}
