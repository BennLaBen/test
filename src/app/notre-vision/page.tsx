'use client'

import React from 'react'
import Link from 'next/link'
import { SEO } from '@/components/SEO'
import { motion } from 'framer-motion'
import { IndustrialBackground } from '@/components/IndustrialBackground'
import { 
  Heart, 
  Target, 
  Users, 
  TrendingUp, 
  Award,
  Lightbulb,
  Shield,
  Handshake,
  ArrowRight,
  Quote,
  Factory,
  Wrench,
  Zap,
  Sparkles
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

const iconMap = {
  excellence: Shield,
  humain: Users,
  engagement: Handshake,
  innovation: Lightbulb,
  reactivite: Target,
  certifications: Award
}

const objectiveIcons = [TrendingUp, Lightbulb, Target, Users]

export default function NotreVisionPage() {
  const { t } = useTranslation('vision')

  const values = t('values.list', { returnObjects: true }) as any[]
  const paragraphs = t('industrialVision.paragraphs', { returnObjects: true }) as string[]
  const objectives = t('industrialVision.objectives.list', { returnObjects: true }) as any[]
  const heroStats = t('hero.stats', { returnObjects: true }) as any[]

  return (
    <React.Fragment>
      <SEO
        title={t('title')}
        description={t('description')}
        canonical="/notre-vision"
      />

      {/* Hero Section - TONY STARK STYLE */}
      <section id="vision-hero" className="relative bg-gradient-to-br from-primary-600 to-primary-800 py-20 text-white dark:from-primary-700 dark:to-primary-900 lg:py-32 overflow-hidden">
        <IndustrialBackground variant="circuit" className="opacity-20" />
        
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full industrial-grid bg-center" />
        </div>

        {/* Particules ultra-optimisées */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 bg-white rounded-full"
              style={{
                left: `${(i * 16.67) % 100}%`,
                top: `${(i * 20) % 100}%`,
                willChange: 'transform',
              }}
              animate={{
                y: [0, -50, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                delay: i * 1,
                ease: "linear"
              }}
            />
          ))}
        </div>

        {/* Cercles holographiques optimisés */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none">
          <motion.div
            className="absolute inset-0 rounded-full border border-white/15"
            style={{ willChange: 'transform, opacity' }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>

        {/* Lignes holographiques optimisées */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
          animate={{
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 4, repeat: Infinity }}
          style={{ willChange: 'opacity' }}
        />

        {/* Animated corner accents - MEGA VERSION */}
        <motion.div 
          className="absolute top-0 left-0 w-32 h-32 tech-corner opacity-40"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div 
          className="absolute top-0 right-0 w-32 h-32 tech-corner opacity-40 rotate-90"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        />
        <motion.div 
          className="absolute bottom-0 left-0 w-32 h-32 tech-corner opacity-40 -rotate-90"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
        />
        <motion.div 
          className="absolute bottom-0 right-0 w-32 h-32 tech-corner opacity-40 rotate-180"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
        />

        <div className="container relative">
          <div className="mx-auto max-w-4xl text-center">
            {/* Photo Fondateur */}
            <motion.div
              className="relative mx-auto mb-8 h-40 w-40 overflow-hidden rounded-full border-4 border-white/20 shadow-2xl"
              initial={{ opacity: 0, scale: 0.5, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{
                boxShadow: '0 0 40px rgba(255, 255, 255, 0.2)'
              }}
            >
              {/* Placeholder pour la photo de Gérard Lledo */}
              <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                <Users className="h-16 w-16 text-gray-600" />
              </div>
              {/* 
                 Décommenter et utiliser une vraie image :
                 <Image 
                   src="/images/gerard-lledo.jpg" 
                   alt="Gérard Lledo" 
                   fill 
                   className="object-cover"
                 /> 
              */}
            </motion.div>

            <motion.span 
              className="chip mb-6 inline-flex bg-white/20 text-white backdrop-blur-sm tech-border px-6 py-3 text-base relative overflow-hidden"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.03, y: -2 }}
              style={{
                boxShadow: '0 0 30px rgba(255, 255, 255, 0.3)',
                willChange: 'transform'
              }}
            >
              {/* Scan holographique */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
              
              {/* Anneau d'énergie optimisé */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-white/30"
                animate={{
                  scale: [1, 1.3],
                  opacity: [0.6, 0]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{ willChange: 'transform, opacity' }}
              />
              
              <Sparkles className="h-5 w-5 mr-2 relative z-10 inline-block" />
              <span className="relative z-10 font-bold">{t('hero.badge')}</span>
            </motion.span>
            
            <motion.h1 
              className="mb-6 text-5xl font-bold tracking-tight lg:text-7xl relative"
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ 
                transformStyle: 'preserve-3d',
                textShadow: '0 0 40px rgba(255, 255, 255, 0.5)'
              }}
            >
              {t('hero.title')}
            </motion.h1>
            
            <motion.p 
              className="mb-6 text-xl opacity-90"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.9 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {t('hero.subtitle')}
            </motion.p>
            
            <motion.p 
              className="mb-12 text-lg leading-relaxed opacity-80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {t('hero.intro')}
            </motion.p>

            <motion.div 
              className="glass-card mb-12 bg-white/10 p-10 backdrop-blur-sm tech-border relative overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              whileHover={{ scale: 1.02, y: -3 }}
              style={{ 
                willChange: 'transform',
                boxShadow: '0 0 40px rgba(255, 255, 255, 0.2)'
              }}
            >
              {/* Scan holographique optimisé */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                style={{ willChange: 'transform' }}
              />

              {/* Grille technique */}
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px'
              }} />

              {/* Coins HUD statiques */}
              <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-white/60" />
              <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-white/60" />
              <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-white/60" />
              <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-white/60" />

              {/* Icône Quote holographique */}
              <div className="relative mb-4">
                <motion.div
                  className="absolute inset-0 rounded-full blur-xl bg-white/20"
                  animate={{
                    scale: [1, 1.4, 1],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <Quote className="mx-auto h-14 w-14 opacity-80 relative z-10" />
              </div>
              
              <blockquote 
                className="text-2xl font-medium italic leading-relaxed relative z-10"
                style={{
                  textShadow: '0 0 25px rgba(255, 255, 255, 0.4)'
                }}
              >
                "{t('hero.quote')}"
              </blockquote>
            </motion.div>

            <motion.div 
              className="grid grid-cols-2 gap-8 md:grid-cols-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              {heroStats.map((stat: any, index: number) => (
                <motion.div 
                  key={index} 
                  className="text-center relative group"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: 1 + index * 0.08
                  }}
                  whileHover={{ scale: 1.15, y: -10, z: 30 }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Anneau d'énergie optimisé */}
                  <motion.div
                    className="absolute inset-0 rounded-lg border-2 border-white/30"
                    animate={{
                      scale: [1, 1.3],
                      opacity: [0.5, 0]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: index * 0.2
                    }}
                    style={{ willChange: 'transform, opacity' }}
                  />

                  {/* Grille holographique */}
                  <div className="absolute inset-0 bg-white/5 rounded-lg tech-border opacity-0 group-hover:opacity-100 transition-opacity overflow-hidden">
                    <div className="absolute inset-0 opacity-30" style={{
                      backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)',
                      backgroundSize: '8px 8px'
                    }} />
                  </div>

                  {/* Bordure glow optimisée */}
                  <div
                    className="absolute inset-0 rounded-lg"
                    style={{
                      boxShadow: '0 0 20px rgba(255, 255, 255, 0.3)'
                    }}
                  />
                  
                  <div 
                    className="text-4xl font-bold relative z-10"
                    style={{
                      textShadow: '0 0 25px rgba(255, 255, 255, 0.5)'
                    }}
                  >
                    {stat.value}
                  </div>
                  <div className="mt-2 text-sm opacity-90 relative z-10 font-semibold">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section - TONY STARK UPGRADED */}
      <section id="nos-valeurs" className="py-20 lg:py-32 relative overflow-hidden">
        <IndustrialBackground variant="grid" />
        
        {/* Particules ultra-optimisées */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary-500 rounded-full opacity-40"
              style={{
                left: `${(i * 20) % 100}%`,
                top: `${(i * 25) % 100}%`,
                willChange: 'transform',
              }}
              animate={{
                y: [0, -35, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                delay: i * 1,
                ease: "linear"
              }}
            />
          ))}
        </div>
        
        <div className="container relative z-10">
          <motion.div 
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="chip mb-4 tech-border">
              <Factory className="h-4 w-4 mr-2 inline-block" />
              {t('values.badge')}
            </span>
            <h2 className="mb-6 text-3xl font-bold text-muted-strong lg:text-5xl">
              {t('values.title')}
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted">
              {t('values.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {values.map((value: any, index: number) => {
              const Icon = Object.values(iconMap)[index]
              return (
                <motion.div 
                  key={index} 
                  className="glass-card group p-8 relative overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer"
                  initial={{ opacity: 0, y: 40, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.1
                  }}
                  whileHover={{ 
                    y: -8,
                    scale: 1.02,
                    transition: { duration: 0.3 }
                  }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Holographic scan multi-directionnel */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-transparent via-primary-500/25 to-transparent"
                    animate={{
                      x: ['-100%', '100%'],
                      y: ['-100%', '100%']
                    }}
                    transition={{
                      duration: 3,
                      delay: index * 0.3 + 1,
                      repeat: Infinity,
                      repeatDelay: 2,
                      ease: "easeInOut"
                    }}
                  />

                  {/* Grille holographique */}
                  <div className="absolute inset-0 opacity-5" style={{
                    backgroundImage: `
                      linear-gradient(rgba(59, 130, 246, 0.4) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(59, 130, 246, 0.4) 1px, transparent 1px)
                    `,
                    backgroundSize: '15px 15px'
                  }} />

                  {/* Coins HUD statiques */}
                  <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-primary-500/60" />
                  <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-primary-500/60" />
                  <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-primary-500/60" />
                  <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-primary-500/60" />
                  
                  {/* Animated gradient background on hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-primary-600/10 opacity-0"
                    whileHover={{ 
                      opacity: 1,
                      scale: 1.05,
                    }}
                    transition={{ duration: 0.4 }}
                  />
                  
                  {/* Border glow on hover */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl"
                    whileHover={{
                      boxShadow: [
                        '0 0 0 0 rgba(59, 130, 246, 0)',
                        '0 0 20px 2px rgba(59, 130, 246, 0.3)',
                        '0 0 0 0 rgba(59, 130, 246, 0)'
                      ]
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  
                  <div className="relative">
                    {/* Anneaux d'énergie Arc Reactor */}
                    <motion.div
                      className="absolute inset-0 rounded-2xl border-2 border-primary-500/30"
                      animate={{
                        scale: [1, 1.5],
                        opacity: [0.6, 0]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: index * 0.2
                      }}
                    />
                    <motion.div
                      className="absolute inset-0 rounded-2xl border-2 border-primary-400/20"
                      animate={{
                        scale: [1, 1.5],
                        opacity: [0.5, 0]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: index * 0.2 + 0.5
                      }}
                    />

                    {/* Icon avec animation float holographique */}
                    <motion.div
                      animate={{ 
                        y: [0, -15, 0],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ 
                        duration: 4, 
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.2
                      }}
                      className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 text-white mb-6 group-hover:shadow-2xl transition-shadow duration-300"
                      style={{
                        boxShadow: '0 0 20px rgba(59, 130, 246, 0.4), inset 0 0 15px rgba(255, 255, 255, 0.2)'
                      }}
                      whileHover={{ 
                        rotate: [0, 360],
                        scale: 1.15,
                        boxShadow: '0 0 40px rgba(59, 130, 246, 0.7), inset 0 0 25px rgba(255, 255, 255, 0.3)'
                      }}
                    >
                      {/* Grille radiale */}
                      <div className="absolute inset-0 opacity-20 rounded-2xl" style={{
                        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)',
                        backgroundSize: '8px 8px'
                      }} />
                      
                      <motion.div
                        whileHover={{ 
                          rotate: 360,
                          scale: [1, 1.2, 1]
                        }}
                        transition={{ duration: 0.6 }}
                        className="relative z-10"
                      >
                        <Icon className="h-8 w-8" />
                      </motion.div>
                    </motion.div>
                    
                    {/* Title with gradient on hover */}
                    <motion.h3 
                      className="text-xl font-bold text-muted-strong mb-3 group-hover:text-primary-600 transition-colors"
                      whileHover={{ x: 5 }}
                    >
                      {value.title}
                    </motion.h3>
                    
                    <p className="text-muted leading-relaxed">
                      {value.description}
                    </p>
                    
                    {/* Sparkle effect */}
                    <motion.div
                      className="absolute top-2 right-2"
                      animate={{ 
                        scale: [0, 1, 0],
                        rotate: [0, 180, 360]
                      }}
                      transition={{ 
                        duration: 2,
                        delay: index * 0.3 + 0.5,
                        repeat: Infinity,
                        repeatDelay: 4,
                        ease: "easeOut"
                      }}
                    >
                      <Sparkles className="h-4 w-4 text-yellow-400" />
                    </motion.div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Industrial Vision Section */}
      <section id="vision-industrielle" className="py-20 lg:py-32 relative overflow-hidden">
        <IndustrialBackground variant="precision" />
        
        <div className="container relative z-10">
          <motion.div 
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="chip mb-4 tech-border">
              <Wrench className="h-4 w-4 mr-2 inline-block" />
              {t('industrialVision.badge')}
            </span>
            <h2 className="mb-6 text-3xl font-bold text-muted-strong lg:text-5xl">
              {t('industrialVision.title')}
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted">
              {t('industrialVision.subtitle')}
            </p>
          </motion.div>

          <div className="mx-auto max-w-4xl space-y-6">
            {paragraphs.map((paragraph: string, index: number) => (
              <motion.p 
                key={index} 
                className="text-lg leading-relaxed text-muted"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                {paragraph}
              </motion.p>
            ))}
          </div>

          <div className="mt-16">
            <motion.h3 
              className="mb-8 text-center text-2xl font-bold text-muted-strong"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {t('industrialVision.objectives.title')}
            </motion.h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {objectives.map((objective: any, index: number) => {
                const Icon = objectiveIcons[index]
                return (
                  <motion.div 
                    key={index} 
                    className="glass-card flex items-start gap-4 p-6 tech-border relative overflow-hidden"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.15 }}
                    whileHover={{ scale: 1.03, x: 5 }}
                  >
                    <motion.div
                      className="absolute inset-0 -translate-y-full"
                      whileHover={{ translateY: '100%' }}
                      transition={{ duration: 0.6 }}
                      style={{ background: 'linear-gradient(180deg, transparent, rgba(59, 130, 246, 0.05), transparent)' }}
                    />
                    <motion.div 
                      className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary-500/15 text-primary-600 tech-corner relative z-10"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Icon className="h-6 w-6" />
                    </motion.div>
                    <div className="relative z-10">
                      <h4 className="mb-2 font-bold text-muted-strong">{objective.title}</h4>
                      <p className="text-sm text-muted">{objective.description}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact-vision" className="py-20 lg:py-32 relative overflow-hidden">
        <IndustrialBackground variant="circuit" />
        
        <div className="container relative z-10">
          <motion.div 
            className="glass-card glass-card--muted mx-auto max-w-4xl p-12 text-center tech-border relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Animated corners */}
            <div className="absolute top-0 left-0 w-20 h-20 tech-corner opacity-20" />
            <div className="absolute top-0 right-0 w-20 h-20 tech-corner opacity-20 rotate-90" />
            <div className="absolute bottom-0 left-0 w-20 h-20 tech-corner opacity-20 -rotate-90" />
            <div className="absolute bottom-0 right-0 w-20 h-20 tech-corner opacity-20 rotate-180" />
            
            {/* Scanline effect */}
            <motion.div
              className="absolute inset-0 scanline-effect opacity-20"
              animate={{ translateY: ['0%', '100%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />

            <motion.h2 
              className="mb-6 text-3xl font-bold text-muted-strong lg:text-4xl relative z-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Zap className="inline-block h-8 w-8 mr-3 text-primary-600" />
              {t('cta.title')}
            </motion.h2>
            
            <motion.p 
              className="mb-10 text-lg text-muted relative z-10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {t('cta.subtitle')}
            </motion.p>
            
            <motion.div 
              className="flex flex-col justify-center gap-4 sm:flex-row relative z-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <motion.div whileHover={{ scale: 1.05, x: 5 }} whileTap={{ scale: 0.95 }}>
                <Link href="/contact" className="btn-primary inline-flex items-center gap-2 tech-border">
                  {t('cta.buttons.contact')}
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05, x: 5 }} whileTap={{ scale: 0.95 }}>
                <Link href="/carriere" className="btn-secondary inline-flex items-center gap-2 tech-border">
                  {t('cta.buttons.careers')}
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05, x: 5 }} whileTap={{ scale: 0.95 }}>
                <Link href="/nos-expertises" className="btn-secondary inline-flex items-center gap-2 tech-border">
                  {t('cta.buttons.expertises')}
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </React.Fragment>
  )
}
