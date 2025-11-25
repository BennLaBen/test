'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { List, ArrowUp } from 'lucide-react'

export function SmartNavigator() {
  const pathname = usePathname()
  const [sections, setSections] = useState<{ id: string; title: string }[]>([])
  const [activeSection, setActiveSection] = useState('')
  const [scrollProgress, setScrollProgress] = useState(0)

  // Détecter les sections de la page - plus agressif
  useEffect(() => {
    const detectSections = () => {
      // Chercher h2, h3 avec id, sections avec id, et sections avec aria-label
      const elements = document.querySelectorAll('h1[id], h2[id], h3[id], section[id], section[aria-label], div[id^="section"]')
      const sectionData: { id: string; title: string }[] = []
      
      elements.forEach((element) => {
        let title = element.textContent?.trim()
        const id = element.id
        
        // Si pas de texte, essayer aria-label
        if (!title && element.hasAttribute('aria-label')) {
          title = element.getAttribute('aria-label')
        }
        
        // Si toujours pas de titre, chercher le premier heading dans l'élément
        if (!title) {
          const heading = element.querySelector('h1, h2, h3, h4')
          title = heading?.textContent?.trim()
        }
        
        if (id && title && title.length < 100) {
          sectionData.push({ id, title })
        }
      })
      
      setSections(sectionData)
    }

    // Attendre que le DOM soit chargé
    setTimeout(detectSections, 500)
    setTimeout(detectSections, 1500) // Re-check après animations
    
    // Re-détecter si la page change
    const observer = new MutationObserver(() => {
      setTimeout(detectSections, 300)
    })
    observer.observe(document.body, { childList: true, subtree: true })
    
    return () => observer.disconnect()
  }, [pathname])

  // Tracking du scroll et de la section active
  useEffect(() => {
    const handleScroll = () => {
      // Progress bar
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY
      const progress = (scrollTop / (documentHeight - windowHeight)) * 100
      setScrollProgress(Math.min(100, Math.max(0, progress)))

      // Section active
      const sectionElements = sections.map(s => document.getElementById(s.id))
      let currentSection = ''
      
      for (const section of sectionElements) {
        if (section) {
          const rect = section.getBoundingClientRect()
          if (rect.top <= 150 && rect.bottom >= 150) {
            currentSection = section.id
            break
          }
        }
      }
      
      setActiveSection(currentSection)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [sections])

  // Scroll smooth vers une section
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - 100
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  // Ne rien afficher si pas de sections
  if (sections.length === 0) {
    return null
  }

  return (
    <aside className="fixed left-4 top-32 z-30 hidden w-72 xl:block">
      <div className="glass-card overflow-hidden rounded-2xl shadow-xl">
        {/* Progress Bar */}
        <div className="relative h-1.5 bg-gray-200 dark:bg-gray-700">
          <motion.div
            className="h-full bg-gradient-to-r from-primary-600 via-primary-500 to-primary-400"
            style={{ width: `${scrollProgress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>

        <div className="p-5">
          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-muted-strong">
              <List className="h-4 w-4 text-primary-600" />
              Navigation rapide
            </div>
            <div className="rounded-full bg-primary-100 px-2 py-0.5 text-xs font-semibold text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
              {Math.round(scrollProgress)}%
            </div>
          </div>

          {/* Sections de la page */}
          <div className="space-y-1.5">
            {sections.map((section, index) => {
              const isActive = activeSection === section.id
              
              return (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`group relative flex w-full items-start gap-3 rounded-xl px-4 py-3 text-left transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg'
                      : 'text-muted hover:bg-gray-100 hover:text-muted-strong dark:hover:bg-gray-800'
                  }`}
                >
                  {/* Numéro de section */}
                  <div className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                  }`}>
                    {index + 1}
                  </div>
                  
                  {/* Titre */}
                  <div className="flex-1 min-w-0">
                    <span className={`line-clamp-2 text-sm font-medium ${
                      isActive ? 'font-semibold' : ''
                    }`}>
                      {section.title}
                    </span>
                  </div>

                  {/* Indicateur actif */}
                  {isActive && (
                    <motion.div
                      className="absolute right-3 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-white"
                      animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                </button>
              )
            })}
          </div>

          {/* Scroll to top button */}
          {scrollProgress > 15 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gray-100 to-gray-50 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:from-gray-200 hover:to-gray-100 dark:from-gray-800 dark:to-gray-750 dark:text-gray-200 dark:hover:from-gray-700 dark:hover:to-gray-650"
            >
              <ArrowUp className="h-4 w-4" />
              Retour en haut
            </motion.button>
          )}
        </div>
      </div>
    </aside>
  )
}

