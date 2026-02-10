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
  Rocket,
  Upload,
  Send,
  FileText,
  User,
  MessageSquare
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

const cultureIcons = [Lightbulb, Users, Award, GraduationCap]
const benefitIcons = [Shield, Heart, Coffee, GraduationCap, Building2, Users]

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
  const [showApplicationForm, setShowApplicationForm] = useState(false)
  const [applicationData, setApplicationData] = useState({
    name: '',
    email: '',
    position: '',
    message: '',
    cv: null as File | null
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Créer FormData pour envoyer le fichier
      const formData = new FormData()
      formData.append('name', applicationData.name)
      formData.append('email', applicationData.email)
      formData.append('position', applicationData.position)
      formData.append('message', applicationData.message)
      if (applicationData.cv) {
        formData.append('cv', applicationData.cv)
      }

      const response = await fetch('/api/applications/quick', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Erreur lors de l\'envoi')
      }

      setSubmitSuccess(true)
      
      // Reset après 3 secondes
      setTimeout(() => {
        setSubmitSuccess(false)
        setShowApplicationForm(false)
        setApplicationData({ name: '', email: '', position: '', message: '', cv: null })
      }, 3000)
    } catch (error) {
      console.error('Application error:', error)
      alert(t('apply.error'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const scrollToJobs = () => {
    document.getElementById('jobs')?.scrollIntoView({ behavior: 'smooth' })
  }

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

  const culture = t('culture.items', { returnObjects: true }) as { title: string; description: string }[]
  const benefits = t('benefits.list', { returnObjects: true }) as string[]

  const stats = [
    { value: t('stats.expertise.value'), label: t('stats.expertise.label') },
    { value: t('stats.team.value'), label: t('stats.team.label') },
    { value: t('stats.quality.value'), label: t('stats.quality.label') },
    { value: t('stats.evolution.value'), label: t('stats.evolution.label') }
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
              <span className="font-black text-white text-sm uppercase tracking-widest">{t('hero.badge')}</span>
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

      {/* ========== SECTION OFFRES DISPONIBLES - EN PREMIER ========== */}
      <section id="jobs" className="py-16 lg:py-20 relative overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-20">
          <motion.div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.4) 0%, transparent 50%),
                               radial-gradient(circle at 80% 50%, rgba(59, 130, 246, 0.4) 0%, transparent 50%)`
            }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <motion.div
              className="text-center mb-6 sm:mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white uppercase mb-2" style={{ textShadow: '0 0 30px rgba(255, 255, 255, 0.3)' }}>
                {t('apply.title')}
              </h2>
              <p className="text-blue-200 text-sm sm:text-base">
                {t('apply.subtitle')}
              </p>
            </motion.div>

            {/* CTA Buttons */}
            {!showApplicationForm ? (
              <motion.div
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {/* Bouton Principal - Déposer ma candidature */}
                <motion.button
                  onClick={() => setShowApplicationForm(true)}
                  className="w-full sm:w-auto relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-blue-900 rounded-xl font-black text-base sm:text-lg uppercase tracking-wider overflow-hidden group touch-manipulation"
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ boxShadow: '0 0 40px rgba(255, 255, 255, 0.4)' }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-100 to-transparent"
                    animate={{ x: ['-200%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                  <Upload className="h-5 w-5 relative z-10" />
                  <span className="relative z-10">{t('apply.submitApplication')}</span>
                </motion.button>

                {/* Bouton Secondaire - Contacter l'équipe */}
                <motion.a
                  href="mailto:rh@lledo-industries.com"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-transparent border-2 border-white/50 text-white rounded-xl font-bold text-base sm:text-lg uppercase tracking-wider hover:bg-white/10 transition-all touch-manipulation"
                  whileHover={{ scale: 1.05, y: -3, borderColor: 'rgba(255,255,255,0.8)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Mail className="h-5 w-5" />
                  <span>{t('apply.contactTeam')}</span>
                </motion.a>

                {/* Lien vers les offres */}
                <motion.button
                  onClick={scrollToJobs}
                  className="text-blue-200 hover:text-white text-sm font-semibold flex items-center gap-2 mt-2 sm:mt-0 sm:ml-4 touch-manipulation"
                  whileHover={{ x: 5 }}
                >
                  <span>{t('apply.viewOffers')}</span>
                  <ArrowRight className="h-4 w-4" />
                </motion.button>
              </motion.div>
            ) : (
              /* Formulaire de candidature */
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 sm:p-8"
                style={{ boxShadow: '0 0 60px rgba(59, 130, 246, 0.3)' }}
              >
                {submitSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", duration: 0.6 }}
                      className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
                    >
                      <CheckCircle className="h-10 w-10 text-white" />
                    </motion.div>
                    <h3 className="text-2xl font-black text-white mb-2">{t('apply.applicationSent')}</h3>
                    <p className="text-blue-200">{t('apply.applicationSentMessage')}</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleApplicationSubmit} className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-black text-white uppercase">{t('apply.quickApplication')}</h3>
                      <button
                        type="button"
                        onClick={() => setShowApplicationForm(false)}
                        className="text-white/60 hover:text-white p-2 touch-manipulation"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Nom */}
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-300" />
                        <input
                          type="text"
                          placeholder={t('apply.yourName')}
                          required
                          value={applicationData.name}
                          onChange={(e) => setApplicationData({ ...applicationData, name: e.target.value })}
                          className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200/60 focus:outline-none focus:border-white/50 focus:ring-2 focus:ring-white/20"
                        />
                      </div>

                      {/* Email */}
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-300" />
                        <input
                          type="email"
                          placeholder={t('apply.yourEmail')}
                          required
                          value={applicationData.email}
                          onChange={(e) => setApplicationData({ ...applicationData, email: e.target.value })}
                          className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200/60 focus:outline-none focus:border-white/50 focus:ring-2 focus:ring-white/20"
                        />
                      </div>
                    </div>

                    {/* Poste souhaité */}
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-300" />
                      <select
                        required
                        value={applicationData.position}
                        onChange={(e) => setApplicationData({ ...applicationData, position: e.target.value })}
                        className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-white/50 focus:ring-2 focus:ring-white/20 appearance-none"
                      >
                        <option value="" className="bg-gray-800">{t('apply.desiredPosition')}</option>
                        <option value="spontanee" className="bg-gray-800">{t('apply.spontaneousApplication')}</option>
                        {jobs.map(job => (
                          <option key={job.id} value={job.title} className="bg-gray-800">{job.title}</option>
                        ))}
                      </select>
                    </div>

                    {/* Message */}
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-blue-300" />
                      <textarea
                        placeholder={t('apply.yourMessage')}
                        rows={3}
                        value={applicationData.message}
                        onChange={(e) => setApplicationData({ ...applicationData, message: e.target.value })}
                        className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200/60 focus:outline-none focus:border-white/50 focus:ring-2 focus:ring-white/20 resize-none"
                      />
                    </div>

                    {/* Upload CV */}
                    <div className="relative">
                      <label className="flex items-center justify-center gap-3 w-full py-4 bg-white/5 border-2 border-dashed border-white/30 rounded-xl cursor-pointer hover:bg-white/10 hover:border-white/50 transition-all touch-manipulation">
                        <FileText className="h-5 w-5 text-blue-300" />
                        <span className="text-blue-200 font-medium">
                          {applicationData.cv ? applicationData.cv.name : t('apply.attachCV')}
                        </span>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          className="hidden"
                          onChange={(e) => setApplicationData({ ...applicationData, cv: e.target.files?.[0] || null })}
                        />
                      </label>
                    </div>

                    {/* Submit */}
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-white text-blue-900 rounded-xl font-black text-lg uppercase tracking-wider disabled:opacity-50 touch-manipulation"
                      whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                      whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                      style={{ boxShadow: '0 0 30px rgba(255, 255, 255, 0.3)' }}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin h-5 w-5 border-2 border-blue-900 border-t-transparent rounded-full" />
                          <span>{t('apply.sending')}</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5" />
                          <span>{t('apply.sendApplication')}</span>
                        </>
                      )}
                    </motion.button>
                  </form>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </section>
      {/* ========== FIN SECTION POSTULER ========== */}

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
              <span className="font-black text-white text-sm uppercase tracking-widest">{t('culture.badge')}</span>
            </div>
            <h2 className="mb-6 text-4xl font-black text-white lg:text-6xl uppercase" style={{ textShadow: '0 0 30px rgba(59, 130, 246, 0.8)' }}>
              {t('culture.title')}
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-gray-300">
              {t('culture.subtitle')}
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
              <span className="font-black text-white text-sm uppercase tracking-widest">{t('benefits.badge')}</span>
            </div>
            <h2 className="mb-6 text-4xl font-black text-white lg:text-6xl uppercase" style={{ textShadow: '0 0 30px rgba(59, 130, 246, 0.8)' }}>
              {t('benefits.title')}
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-gray-300">
              {t('benefits.subtitle')}
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
              <span className="font-black text-white text-sm uppercase tracking-widest">{t('jobs.badge')}</span>
            </div>
            <h2 className="mb-6 text-4xl font-black text-white lg:text-6xl uppercase" style={{ textShadow: '0 0 30px rgba(59, 130, 246, 0.8)' }}>
              {t('jobs.title')}
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-gray-300">
              {t('jobs.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {loadingJobs ? (
              <div className="text-center py-12">
                <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-gray-400">{t('jobs.loading')}</p>
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-12 bg-white/5 backdrop-blur-sm border border-blue-400/20 rounded-2xl">
                <Briefcase className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">{t('jobs.noOffers')}</p>
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
                {t('contact.title')}
              </h2>
              <p className="mb-8 text-xl text-gray-300">
                {t('contact.subtitle')}
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
                    <span className="relative z-10">{t('contact.contactUs')}</span>
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
