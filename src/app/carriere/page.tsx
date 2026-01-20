'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { SEO } from '@/components/SEO'
import { motion } from 'framer-motion'
import { IndustrialBackground } from '@/components/IndustrialBackground'
import { 
  Users, 
  Zap, 
  Award,
  GraduationCap,
  Clock,
  Heart,
  Target,
  TrendingUp,
  Briefcase,
  MapPin,
  Mail,
  Phone,
  CheckCircle,
  Sparkles,
  ArrowRight,
  Calendar,
  DollarSign,
  Coffee,
  Car,
  Shield,
  Lightbulb,
  Building2,
  Rocket
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

const cultureIcons = [Lightbulb, Users, Award, GraduationCap]
const benefitIcons = [Shield, Heart, Coffee, GraduationCap, Clock, Car]

interface Job {
  id: string
  title: string
  slug: string
  type: string
  location: string
  department?: string
  description: string
  published: boolean
}

export default function CareersPage() {
  const { t } = useTranslation('careers')
  const [jobs, setJobs] = useState<Job[]>([])
  const [loadingJobs, setLoadingJobs] = useState(true)

  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await fetch('/api/jobs')
        const data = await res.json()
        if (data.success) {
          setJobs(data.jobs.filter((j: Job) => j.published))
        }
      } catch (err) {
        console.error('Error fetching jobs:', err)
      } finally {
        setLoadingJobs(false)
      }
    }
    fetchJobs()
  }, [])

  const culture = [
    {
      title: "Innovation",
      description: "Nous encourageons la créativité et l'innovation pour développer des solutions techniques de pointe."
    },
    {
      title: "Équipe",
      description: "Nous travaillons ensemble dans un environnement collaboratif et bienveillant."
    },
    {
      title: "Qualité",
      description: "Nous nous engageons pour l'excellence et la qualité dans tous nos projets."
    },
    {
      title: "Formation",
      description: "Nous investissons dans la formation et le développement de nos collaborateurs."
    }
  ]

  const benefits = [
    "Mutuelle d'entreprise",
    "Prévoyance",
    "Ticket restaurant",
    "Formation continue",
    "Horaires flexibles",
    "Parking gratuit"
  ]

  const stats = [
    { value: "25+", label: "Années d'expérience" },
    { value: "50+", label: "Collaborateurs" },
    { value: "100%", label: "Taux de satisfaction" },
    { value: "3", label: "Postes ouverts" }
  ]
  
  return (
    <>
      <SEO
        title={t('title')}
        description={t('description')}
        canonical="/carriere"
      />

      {/* Hero Section - Tony Stark */}
      <section id="careers-hero" className="relative bg-gradient-to-br from-blue-900 via-gray-900 to-gray-900 py-12 text-white lg:py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div style={{
            backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.4) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }} className="h-full w-full" />
        </div>

        <div className="container relative">
          <div className="mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, type: "spring" }}
              className="mb-8 inline-flex items-center gap-3 px-6 py-3 bg-blue-500/20 backdrop-blur-xl border-2 border-blue-400/50 rounded-full"
              style={{ boxShadow: '0 0 30px rgba(59, 130, 246, 0.6)' }}
            >
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}>
                <Rocket className="h-5 w-5 text-blue-300" />
              </motion.div>
              <span className="font-black text-white text-sm uppercase tracking-widest">Rejoignez l'aventure</span>
            </motion.div>
            
            <motion.h1 
              className="mb-6 text-5xl font-black tracking-tight lg:text-7xl uppercase"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ textShadow: '0 0 40px rgba(59, 130, 246, 0.8)', lineHeight: '1.2' }}
            >
              {t('hero.title')}
            </motion.h1>
            
            <motion.p 
              className="mb-12 text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {t('hero.subtitle')}
            </motion.p>

            <motion.div 
              className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {stats.map((stat, index) => (
                <motion.div 
                  key={index} 
                  className="text-center relative p-4 bg-white/5 backdrop-blur-sm border border-blue-400/20 rounded-xl"
                  whileHover={{ scale: 1.05, y: -5 }}
                  style={{ boxShadow: '0 4px 20px rgba(59, 130, 246, 0.15)', willChange: 'transform' }}
                >
                  <div className="text-4xl font-black relative z-10 text-white">{stat.value}</div>
                  <div className="mt-2 text-sm font-semibold uppercase tracking-wider text-gray-400 relative z-10">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Culture Section - Dark Mode */}
      <section id="culture" className="py-16 lg:py-20 relative overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="absolute inset-0 opacity-5">
          <div style={{
            backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.4) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }} className="h-full w-full" />
        </div>
        
        <div className="container relative z-10">
          <motion.div 
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 px-5 py-2 bg-blue-500/20 backdrop-blur-xl border-2 border-blue-400/50 rounded-full">
              <Heart className="h-5 w-5 text-blue-300" />
              <span className="font-black text-white text-sm uppercase tracking-widest">Notre Culture</span>
            </div>
            <h2 className="mb-6 text-4xl font-black text-white lg:text-6xl uppercase" style={{ textShadow: '0 0 30px rgba(59, 130, 246, 0.8)' }}>
              Notre culture d'entreprise
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-gray-300">
              Rejoignez une équipe passionnée par l'excellence et l'innovation dans le secteur aéronautique
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:gap-8 md:grid-cols-2">
            {culture.map((item, index) => {
              const Icon = cultureIcons[index]
              return (
                <motion.div 
                  key={index} 
                  className="group p-8 relative overflow-hidden bg-white/5 backdrop-blur-sm border border-blue-400/20 rounded-2xl"
                  initial={{ opacity: 0, y: 40, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.03 }}
                  style={{ boxShadow: '0 8px 32px rgba(59, 130, 246, 0.15)', willChange: 'transform' }}
                >
                  {/* Shimmer effect */}
                  <motion.div
                    className="absolute inset-0 -translate-x-full"
                    animate={{
                      translateX: ['100%', '-100%']
                    }}
                    transition={{
                      duration: 2.5,
                      delay: index * 0.3 + 1.5,
                      repeat: Infinity,
                      repeatDelay: 3,
                      ease: "easeInOut"
                    }}
                    style={{
                      background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.3), transparent)',
                      pointerEvents: 'none'
                    }}
                  />
                  
                  {/* Gradient background on hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-primary-600/10 opacity-0"
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                  />
                  
                  <div className="relative">
                    <motion.div
                      animate={{ 
                        y: [0, -12, 0],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ 
                        duration: 4, 
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.2
                      }}
                      className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-xl mb-6"
                      whileHover={{ 
                        rotate: [0, -10, 10, -10, 0],
                        scale: 1.1
                      }}
                    >
                      <motion.div
                        whileHover={{ 
                          rotate: 360,
                          scale: [1, 1.2, 1]
                        }}
                        transition={{ duration: 0.6 }}
                      >
                        <Icon className="h-7 w-7" />
                      </motion.div>
                    </motion.div>
                    
                    <h3 className="text-2xl font-black text-white mb-3 uppercase group-hover:text-blue-300 transition-colors">
                      {item.title}
                    </h3>
                    
                    <p className="text-gray-300 leading-relaxed">
                      {item.description}
                    </p>
                    
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

      {/* Benefits Section - Dark Mode */}
      <section id="benefits" className="bg-gray-800 py-16 lg:py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div style={{
            backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.4) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }} className="h-full w-full" />
        </div>
        
        <div className="container relative z-10">
          <motion.div 
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 px-5 py-2 bg-blue-500/20 backdrop-blur-xl border-2 border-blue-400/50 rounded-full">
              <Award className="h-5 w-5 text-blue-300" />
              <span className="font-black text-white text-sm uppercase tracking-widest">Avantages</span>
            </div>
            <h2 className="mb-6 text-4xl font-black text-white lg:text-6xl uppercase" style={{ textShadow: '0 0 30px rgba(59, 130, 246, 0.8)' }}>
              Nos avantages
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-gray-300">
              Des conditions de travail optimales pour votre épanouissement professionnel
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {benefits.map((benefit, index) => {
              const Icon = benefitIcons[index]
              return (
                <motion.div 
                  key={index} 
                  className="flex items-center gap-4 p-6 bg-white/5 backdrop-blur-sm border border-green-400/20 rounded-xl relative overflow-hidden group"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.03, x: 8 }}
                  style={{ boxShadow: '0 4px 20px rgba(34, 197, 94, 0.15)', willChange: 'transform' }}
                >
                  <motion.div
                    className="absolute inset-0 -translate-y-full opacity-0 group-hover:opacity-100"
                    whileHover={{ translateY: 0 }}
                    transition={{ duration: 0.4 }}
                    style={{ background: 'linear-gradient(180deg, transparent, rgba(59, 130, 246, 0.05), transparent)' }}
                  />
                  <motion.div 
                    className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-green-500/15 text-green-600 relative z-10"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Icon className="h-6 w-6" />
                  </motion.div>
                  <span className="font-bold text-white relative z-10">{benefit}</span>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Job Openings Section - Dark Mode */}
      <section id="jobs" className="py-16 lg:py-20 relative overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="absolute inset-0 opacity-5">
          <div style={{
            backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.4) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }} className="h-full w-full" />
        </div>
        
        <div className="container relative z-10">
          <motion.div 
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 px-5 py-2 bg-blue-500/20 backdrop-blur-xl border-2 border-blue-400/50 rounded-full">
              <Briefcase className="h-5 w-5 text-blue-300" />
              <span className="font-black text-white text-sm uppercase tracking-widest">Offres d'emploi</span>
            </div>
            <h2 className="mb-6 text-4xl font-black text-white lg:text-6xl uppercase" style={{ textShadow: '0 0 30px rgba(59, 130, 246, 0.8)' }}>
              Postes disponibles
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-gray-300">
              Découvrez nos opportunités de carrière et trouvez le poste qui vous correspond
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {loadingJobs ? (
              <div className="text-center py-12">
                <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-gray-400">Chargement des offres...</p>
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-12 bg-white/5 backdrop-blur-sm border border-blue-400/20 rounded-2xl">
                <Briefcase className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">Aucune offre disponible pour le moment</p>
              </div>
            ) : (
              jobs.map((job, index) => (
                <Link href={`/carriere/${job.slug}`} key={job.id}>
                  <motion.div 
                    className="p-8 bg-white/5 backdrop-blur-sm border border-blue-400/20 rounded-2xl relative overflow-hidden group cursor-pointer"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.15 }}
                    whileHover={{ scale: 1.03, y: -8 }}
                    style={{ boxShadow: '0 8px 32px rgba(59, 130, 246, 0.15)', willChange: 'transform' }}
                  >
                    <motion.div
                      className="absolute inset-0 opacity-0"
                      whileHover={{ opacity: 1 }}
                      style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.03), transparent)' }}
                    />
                    
                    <div className="flex items-start gap-6 relative z-10">
                      <motion.div 
                        className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-xl"
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                      >
                        <Briefcase className="h-8 w-8" />
                      </motion.div>
                      
                      <div className="flex-1">
                        <h3 className="text-2xl font-black text-white mb-3 uppercase group-hover:text-blue-300 transition-colors">
                          {job.title}
                        </h3>
                        <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-400">
                          <span className="flex items-center gap-1.5 font-semibold">
                            <Calendar className="h-4 w-4" />
                            {job.type}
                          </span>
                          <span className="flex items-center gap-1.5 font-semibold">
                            <MapPin className="h-4 w-4" />
                            {job.location}
                          </span>
                          {job.department && (
                            <span className="flex items-center gap-1.5 font-semibold">
                              <Building2 className="h-4 w-4" />
                              {job.department}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-300 line-clamp-2">
                          {job.description.substring(0, 150)}...
                        </p>
                      </div>
                      
                      <motion.div
                        whileHover={{ x: 8 }}
                        className="flex items-center text-blue-400"
                      >
                        <ArrowRight className="h-7 w-7" />
                      </motion.div>
                    </div>
                  </motion.div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Contact Section - Dark Mode */}
      <section id="contact" className="bg-gray-800 py-16 lg:py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div style={{
            backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.4) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }} className="h-full w-full" />
        </div>
        
        <div className="container relative z-10">
          <motion.div 
            className="mx-auto max-w-3xl p-12 bg-white/5 backdrop-blur-sm border border-blue-400/20 rounded-2xl relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ boxShadow: '0 8px 32px rgba(59, 130, 246, 0.2)' }}
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

            <div className="text-center relative z-10">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, type: "spring" }}
                className="inline-block mb-6"
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-2xl mx-auto">
                  <Mail className="h-10 w-10" />
                </div>
              </motion.div>
              
              <h2 className="mb-6 text-4xl font-black text-white lg:text-5xl uppercase" style={{ textShadow: '0 0 20px rgba(59, 130, 246, 0.8)' }}>
                Candidature spontanée
              </h2>
              <p className="mb-8 text-xl text-gray-300">
                Vous ne trouvez pas le poste qui vous correspond ? Envoyez-nous votre candidature spontanée.
              </p>
              
              <div className="space-y-6 mb-10">
                <motion.a 
                  href="mailto:rh@lledo-industries.com" 
                  className="glass-card flex items-center justify-center gap-3 p-4 tech-border hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors group"
                  whileHover={{ scale: 1.05, x: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Mail className="h-5 w-5 text-primary-600" />
                  <span className="font-semibold text-muted-strong group-hover:text-primary-600">
                    rh@lledo-industries.com
                  </span>
                </motion.a>
                
                <motion.a 
                  href="tel:+33442029674" 
                  className="glass-card flex items-center justify-center gap-3 p-4 tech-border hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors group"
                  whileHover={{ scale: 1.05, x: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Phone className="h-5 w-5 text-primary-600" />
                  <span className="font-semibold text-muted-strong group-hover:text-primary-600">
                    +33 (4) 42 02 96 74
                  </span>
                </motion.a>
              </div>

              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/contact">
                  <motion.div
                    className="relative inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl font-black text-lg text-white overflow-hidden uppercase tracking-wider"
                    whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ scale: 0.98 }}
                    style={{ boxShadow: '0 0 30px rgba(59, 130, 246, 0.6)', willChange: 'transform' }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      animate={{ x: ['-200%', '200%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      style={{ willChange: 'transform' }}
                    />
                    <span className="relative z-10">Nous contacter</span>
                    <ArrowRight className="h-6 w-6 relative z-10" />
                  </motion.div>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
