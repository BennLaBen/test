'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Building2, Wrench, Package, Phone, Users, Download, Newspaper } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useTranslation } from 'react-i18next'

export function TopInfoBar() {
  const { t } = useTranslation('common')
  const pathname = usePathname()

  // Ne rien afficher sur la boutique
  if (pathname?.startsWith('/boutique')) return null

  const quickLinks = [
    { 
      icon: Package, 
      label: t('topBar.products'), 
      href: '/aerotools',
      color: 'from-orange-500 to-orange-600'
    },
    { 
      icon: Phone, 
      label: t('nav.contact'), 
      href: '/contact',
      color: 'from-primary-500 to-primary-600'
    },
    { 
      icon: Users, 
      label: t('topBar.recruitment'), 
      href: '/carriere',
      color: 'from-amber-500 to-amber-600'
    },
    { 
      icon: Newspaper, 
      label: t('nav.blog'), 
      href: '/blog',
      color: 'from-indigo-500 to-indigo-600'
    },
    { 
      icon: Download, 
      label: t('topBar.brochure'), 
      href: '/plaquette-lledo-industries.pdf',
      color: 'from-gray-500 to-gray-600',
      isDownload: true
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="fixed top-20 left-0 right-0 z-40 border-b border-gray-300/30 bg-white/98 backdrop-blur-xl dark:border-gray-700/40 dark:bg-gray-900/98 shadow-sm overflow-hidden"
    >
      {/* Grille industrielle + lignes de mesure */}
      <div className="absolute inset-0 opacity-[0.03] industrial-grid pointer-events-none" />
      <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-primary-500/20 to-transparent" />
      <div className="absolute left-0 bottom-0 h-px w-full bg-gradient-to-r from-transparent via-primary-500/20 to-transparent" />
      
      {/* Coins techniques */}
      <div className="absolute left-4 top-0 h-1 w-8 bg-primary-500/30" />
      <div className="absolute right-4 top-0 h-1 w-8 bg-primary-500/30" />
      
      <div className="relative py-2 px-2 lg:px-4">
        {/* Desktop: centré */}
        <div className="hidden lg:flex items-center justify-center gap-1.5 mx-auto max-w-7xl">
          {quickLinks.map((link, index) => {
            const Icon = link.icon
            const isDownload = link.isDownload || false
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.04, duration: 0.3 }}
              >
                {isDownload ? (
                  <a
                    href={link.href}
                    download
                    className="group relative flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-bold tracking-wide uppercase text-gray-700 transition-all hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 flex-shrink-0 tech-corner overflow-hidden"
                  >
                    {/* Fond avec bordure technique */}
                    <div className="absolute inset-0 bg-gray-100/50 dark:bg-gray-800/50 transition-all group-hover:bg-primary-50 dark:group-hover:bg-primary-900/30" />
                    <div className="absolute inset-0 border border-gray-300/50 dark:border-gray-700/50 transition-all group-hover:border-primary-400/50" />
                    
                    {/* Grille subtile */}
                    <div className="absolute inset-0 opacity-[0.02] blueprint-pattern pointer-events-none" />
                    
                    {/* Coins industriels */}
                    <div className="absolute left-0 top-0 h-1.5 w-1.5 border-l-2 border-t-2 border-transparent transition-colors group-hover:border-primary-500" />
                    <div className="absolute right-0 bottom-0 h-1.5 w-1.5 border-r-2 border-b-2 border-transparent transition-colors group-hover:border-primary-500" />
                    
                    {/* Icon avec gradient */}
                    <div className={`relative flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-sm bg-gradient-to-br ${link.color} transition-transform group-hover:scale-110`}>
                      <Icon className="h-3 w-3 text-white" />
                    </div>
                    
                    <span className="relative whitespace-nowrap">
                      {link.label}
                    </span>
                  </a>
                ) : (
                  <Link
                    href={link.href}
                    className="group relative flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-bold tracking-wide uppercase text-gray-700 transition-all hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 flex-shrink-0 tech-corner overflow-hidden"
                  >
                    {/* Fond avec bordure technique */}
                    <div className="absolute inset-0 bg-gray-100/50 dark:bg-gray-800/50 transition-all group-hover:bg-primary-50 dark:group-hover:bg-primary-900/30" />
                    <div className="absolute inset-0 border border-gray-300/50 dark:border-gray-700/50 transition-all group-hover:border-primary-400/50" />
                    
                    {/* Grille subtile */}
                    <div className="absolute inset-0 opacity-[0.02] blueprint-pattern pointer-events-none" />
                    
                    {/* Coins industriels */}
                    <div className="absolute left-0 top-0 h-1.5 w-1.5 border-l-2 border-t-2 border-transparent transition-colors group-hover:border-primary-500" />
                    <div className="absolute right-0 bottom-0 h-1.5 w-1.5 border-r-2 border-b-2 border-transparent transition-colors group-hover:border-primary-500" />
                    
                    {/* Icon avec gradient */}
                    <div className={`relative flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-sm bg-gradient-to-br ${link.color} transition-transform group-hover:scale-110`}>
                      <Icon className="h-3 w-3 text-white" />
                    </div>
                    
                    <span className="relative whitespace-nowrap">
                      {link.label}
                    </span>
                  </Link>
                )}
              </motion.div>
            )
          })}
        </div>
        
        {/* Mobile: scroll horizontal avec boutons tactiles optimisés */}
        <div className="lg:hidden overflow-x-auto hide-scrollbar">
          <div className="flex items-center gap-2 px-2 min-w-max">
            {quickLinks.map((link, index) => {
              const Icon = link.icon
              const isDownload = link.isDownload || false
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + index * 0.05, duration: 0.3 }}
                >
                  {isDownload ? (
                    <a
                      href={link.href}
                      download
                      className="group relative flex items-center gap-2 px-4 py-2.5 min-h-[44px] text-xs font-bold tracking-wide text-gray-700 transition-all active:scale-95 dark:text-gray-300 flex-shrink-0 rounded-lg overflow-hidden"
                    >
                      {/* Fond avec bordure technique */}
                      <div className="absolute inset-0 bg-gray-100/90 dark:bg-gray-800/90 transition-all active:bg-primary-50 dark:active:bg-primary-900/30" />
                      <div className="absolute inset-0 border-2 border-gray-300/50 dark:border-gray-700/50 transition-all active:border-primary-400" />
                      
                      {/* Icon avec gradient - Plus grand sur mobile */}
                      <div className={`relative flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-gradient-to-br ${link.color} transition-transform active:scale-110 shadow-lg`}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      
                      <span className="relative whitespace-nowrap font-bold">
                        {link.label}
                      </span>
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="group relative flex items-center gap-2 px-4 py-2.5 min-h-[44px] text-xs font-bold tracking-wide text-gray-700 transition-all active:scale-95 dark:text-gray-300 flex-shrink-0 rounded-lg overflow-hidden"
                    >
                      {/* Fond avec bordure technique */}
                      <div className="absolute inset-0 bg-gray-100/90 dark:bg-gray-800/90 transition-all active:bg-primary-50 dark:active:bg-primary-900/30" />
                      <div className="absolute inset-0 border-2 border-gray-300/50 dark:border-gray-700/50 transition-all active:border-primary-400" />
                      
                      {/* Icon avec gradient - Plus grand sur mobile */}
                      <div className={`relative flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-gradient-to-br ${link.color} transition-transform active:scale-110 shadow-lg`}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      
                      <span className="relative whitespace-nowrap font-bold">
                        {link.label}
                      </span>
                    </Link>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
      
      {/* Scanline effect */}
      <motion.div
        className="absolute inset-0 h-full w-full pointer-events-none"
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}
        style={{ 
          background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.05), transparent)',
        }}
      />
    </motion.div>
  )
}

