'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUp, ArrowDown, ChevronsUp, ChevronsDown } from 'lucide-react'
import { usePathname } from 'next/navigation'

const HEADER_OFFSET = 100

export function SectionPagination() {
  const pathname = usePathname()
  const [sections, setSections] = useState<HTMLElement[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [showTopButton, setShowTopButton] = useState(false)

  // Détecter les sections
  const detectSections = useCallback(() => {
    const main = document.getElementById('main-content')
    if (!main) return []

    const allSections = Array.from(main.querySelectorAll('section'))
    return allSections.filter(s => {
      const height = s.getBoundingClientRect().height
      return height > 150
    }) as HTMLElement[]
  }, [pathname])

  // RE-DÉTECTER à chaque changement de page
  useEffect(() => {
    setActiveIndex(0)
    setSections([])
    
    const timeouts = [
      setTimeout(() => setSections(detectSections()), 100),
      setTimeout(() => setSections(detectSections()), 500),
      setTimeout(() => setSections(detectSections()), 1000),
    ]

    return () => timeouts.forEach(clearTimeout)
  }, [pathname, detectSections])

  // Calculer la progression du scroll et section active
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight
      const docHeight = document.documentElement.scrollHeight

      // Progression totale
      const progress = (scrollY / (docHeight - windowHeight)) * 100
      setScrollProgress(Math.min(100, Math.max(0, progress)))

      // Afficher bouton "haut" après 300px
      setShowTopButton(scrollY > 300)

      // Section active
      if (sections.length > 0) {
        let newIndex = 0
        for (let i = sections.length - 1; i >= 0; i--) {
          const sectionTop = sections[i].getBoundingClientRect().top + scrollY
          if (scrollY + HEADER_OFFSET + 50 >= sectionTop) {
            newIndex = i
            break
          }
        }
        setActiveIndex(newIndex)
      }
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [sections])

  // Navigation
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const scrollToBottom = () => {
    const docHeight = document.documentElement.scrollHeight
    const windowHeight = window.innerHeight
    window.scrollTo({ top: docHeight - windowHeight, behavior: 'smooth' })
  }

  const goToPreviousSection = () => {
    if (activeIndex > 0) {
      const section = sections[activeIndex - 1]
      const top = section.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET
      window.scrollTo({ top, behavior: 'smooth' })
    } else {
      scrollToTop()
    }
  }

  const goToNextSection = () => {
    if (activeIndex < sections.length - 1) {
      const section = sections[activeIndex + 1]
      const top = section.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET
      window.scrollTo({ top, behavior: 'smooth' })
    } else {
      scrollToBottom()
    }
  }

  return (
    <>
      {/* Barre de progression verticale - DROITE */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="fixed right-6 top-1/2 z-50 hidden -translate-y-1/2 xl:block"
      >
        {/* Conteneur avec style industriel */}
        <div className="relative">
          {/* Indicateurs techniques haut/bas */}
          <motion.div
            className="absolute -top-4 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-primary-500"
            animate={{ opacity: [1, 0.3, 1], scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ boxShadow: '0 0 10px rgba(59, 130, 246, 0.8)' }}
          />
          <motion.div
            className="absolute -bottom-4 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-primary-500"
            animate={{ opacity: [1, 0.3, 1], scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            style={{ boxShadow: '0 0 10px rgba(59, 130, 246, 0.8)' }}
          />
          
          {/* Barre avec coins techniques */}
          <div className="relative h-64 w-2 bg-gray-200 dark:bg-gray-700 tech-corner">
          {/* Progression avec grille industrielle */}
          <motion.div
            className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-primary-500 to-primary-600 tech-corner"
            style={{ height: `${scrollProgress}%` }}
          >
            {/* Grille technique */}
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: 'linear-gradient(0deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '100% 10px'
            }} />
          </motion.div>
          
          {/* Indicateurs de sections */}
          {sections.map((_, index) => {
            const position = ((index + 1) / (sections.length + 1)) * 100
            const isActive = index === activeIndex
            
            return (
              <motion.div
                key={index}
                className={`absolute left-1/2 h-3 w-3 -translate-x-1/2 rounded-full transition-all ${
                  isActive 
                    ? 'bg-primary-500 shadow-lg scale-125' 
                    : 'bg-gray-400 dark:bg-gray-600'
                }`}
                style={{ top: `${position}%` }}
                animate={isActive ? {
                  boxShadow: [
                    '0 0 10px rgba(59, 130, 246, 0.5)',
                    '0 0 20px rgba(59, 130, 246, 0.8)',
                    '0 0 10px rgba(59, 130, 246, 0.5)',
                  ]
                } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )
          })}
          
          {/* Curseur de position actuelle - Style industriel */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 tech-border"
            style={{ top: `${scrollProgress}%` }}
          >
            <div className="h-5 w-5 rotate-45 border-2 border-white bg-primary-500 shadow-xl dark:border-gray-900" />
          </motion.div>
        </div>
        </div>

        {/* Pourcentage avec bordure technique */}
        <motion.div
          className="industrial-badge mt-4 text-center text-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {Math.round(scrollProgress)}%
        </motion.div>
      </motion.div>

      {/* Boutons de navigation - GAUCHE */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="fixed left-6 top-1/2 z-50 hidden -translate-y-1/2 flex-col gap-3 xl:flex"
      >
        {/* Bouton HAUT - Style industriel */}
        <motion.button
          onClick={goToPreviousSection}
          className="group relative flex h-14 w-14 items-center justify-center overflow-hidden bg-white shadow-2xl transition-all hover:bg-primary-500 hover:shadow-2xl tech-corner dark:bg-gray-800 dark:hover:bg-primary-600"
          whileHover={{ scale: 1.1, y: -3 }}
          whileTap={{ scale: 0.9 }}
          title={activeIndex > 0 ? "Section précédente" : "Retour en haut"}
        >
          {/* Grille de fond */}
          <div className="absolute inset-0 opacity-5 industrial-grid" />
          
          {/* Bordures techniques */}
          <div className="absolute left-0 top-0 h-3 w-3 border-l-2 border-t-2 border-primary-500" />
          <div className="absolute bottom-0 right-0 h-3 w-3 border-b-2 border-r-2 border-primary-500" />
          
          <ArrowUp className="relative z-10 h-7 w-7 text-primary-600 transition-colors group-hover:text-white dark:text-primary-400" />
          
          {/* Ligne de scan */}
          <motion.div
            className="absolute inset-x-0 h-px bg-primary-500/50"
            animate={{ y: [0, 56, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </motion.button>

        {/* Séparateur avec compteur - Style industriel */}
        {sections.length > 1 && (
          <div className="flex flex-col items-center gap-2 py-2">
            <div className="measurement-line w-12" />
            <motion.div
              className="industrial-badge"
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {activeIndex + 1}/{sections.length}
            </motion.div>
            <div className="measurement-line w-12" />
          </div>
        )}

        {/* Bouton BAS - Style industriel */}
        <motion.button
          onClick={goToNextSection}
          className="group relative flex h-14 w-14 items-center justify-center overflow-hidden bg-white shadow-2xl transition-all hover:bg-primary-500 hover:shadow-2xl tech-corner dark:bg-gray-800 dark:hover:bg-primary-600"
          whileHover={{ scale: 1.1, y: 3 }}
          whileTap={{ scale: 0.9 }}
          title={activeIndex < sections.length - 1 ? "Section suivante" : "Aller en bas"}
        >
          {/* Grille de fond */}
          <div className="absolute inset-0 opacity-5 industrial-grid" />
          
          {/* Bordures techniques */}
          <div className="absolute left-0 top-0 h-3 w-3 border-l-2 border-t-2 border-primary-500" />
          <div className="absolute bottom-0 right-0 h-3 w-3 border-b-2 border-r-2 border-primary-500" />
          
          <ArrowDown className="relative z-10 h-7 w-7 text-primary-600 transition-colors group-hover:text-white dark:text-primary-400" />
          
          {/* Ligne de scan */}
          <motion.div
            className="absolute inset-x-0 h-px bg-primary-500/50"
            animate={{ y: [0, 56, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 1 }}
          />
        </motion.button>
      </motion.div>

      {/* Bouton RETOUR EN HAUT - Style industriel */}
      <AnimatePresence>
        {showTopButton && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 flex h-16 w-16 items-center justify-center overflow-hidden bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-2xl transition-all hover:scale-110 tech-corner"
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.9 }}
            title="Retour en haut"
          >
            {/* Grille de fond */}
            <div className="absolute inset-0 opacity-10 industrial-grid" />
            
            {/* Coins techniques */}
            <div className="absolute left-0 top-0 h-4 w-4 border-l-2 border-t-2 border-white" />
            <div className="absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 border-white" />
            
            <ChevronsUp className="relative z-10 h-8 w-8" />
            
            {/* Double pulse industriel */}
            <motion.div
              className="absolute inset-0 border-2 border-primary-300 tech-corner"
              animate={{ scale: [1, 1.3, 1], opacity: [0.8, 0, 0.8] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
              className="absolute inset-0 border-2 border-primary-300 tech-corner"
              animate={{ scale: [1, 1.3, 1], opacity: [0.8, 0, 0.8] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Bouton ALLER EN BAS - Style industriel */}
      <AnimatePresence>
        {scrollProgress < 95 && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            onClick={scrollToBottom}
            className="group fixed bottom-8 left-8 z-50 flex h-16 w-16 items-center justify-center overflow-hidden bg-white shadow-2xl transition-all hover:bg-primary-500 hover:scale-110 tech-corner dark:bg-gray-800"
            whileHover={{ y: 4 }}
            whileTap={{ scale: 0.9 }}
            title="Aller en bas"
          >
            {/* Grille de fond */}
            <div className="absolute inset-0 opacity-5 industrial-grid" />
            
            {/* Coins techniques */}
            <div className="absolute left-0 top-0 h-4 w-4 border-l-2 border-t-2 border-primary-500" />
            <div className="absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 border-primary-500" />
            
            <ChevronsDown className="relative z-10 h-8 w-8 text-primary-600 transition-colors group-hover:text-white dark:text-primary-400" />
            
            {/* Ligne de scan */}
            <motion.div
              className="absolute inset-x-0 h-px bg-primary-500/50"
              animate={{ y: [0, 64, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  )
}
