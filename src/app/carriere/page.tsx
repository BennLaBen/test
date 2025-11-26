'use client'

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

export default function CareersPage() {
  const { t } = useTranslation('careers')
  
  const jobs = [
    {
      title: "Ingénieur Mécanique",
      type: "CDI • Temps plein",
      location: "Les Pennes-Mirabeau",
      description: "Conception et développement d'outillages aéronautiques",
      icon: Building2
    },
    {
      title: "Technicien Usinage",
      type: "CDI • Temps plein",
      location: "Les Pennes-Mirabeau",
      description: "Usinage de précision sur machines 5 axes",
      icon: Target
    },
    {
      title: "Commercial Technique",
      type: "CDI • Temps plein",
      location: "Région Sud",
      description: "Développement commercial secteur aéronautique",
      icon: TrendingUp
    }
  ]

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

      {/* Hero Section */}
      <section id="careers-hero" className="relative bg-gradient-to-br from-primary-600 to-primary-800 py-20 text-white dark:from-primary-700 dark:to-primary-900 lg:py-32 overflow-hidden">
        <IndustrialBackground variant="circuit" className="opacity-20" />
        
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full industrial-grid bg-center" />
        </div>

        {/* Animated corner accents */}
        <div className="absolute top-0 left-0 w-32 h-32 tech-corner opacity-30" />
        <div className="absolute top-0 right-0 w-32 h-32 tech-corner opacity-30 rotate-90" />
        <div className="absolute bottom-0 left-0 w-32 h-32 tech-corner opacity-30 -rotate-90" />
        <div className="absolute bottom-0 right-0 w-32 h-32 tech-corner opacity-30 rotate-180" />

        <div className="container relative">
          <div className="mx-auto max-w-4xl text-center">
            <motion.span 
              className="chip mb-6 inline-flex bg-white/20 text-white backdrop-blur-sm tech-border"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Rocket className="h-4 w-4 mr-2" />
              Rejoignez l'aventure
            </motion.span>
            
            <motion.h1 
              className="mb-4 text-5xl font-bold tracking-tight lg:text-6xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {t('hero.title')}
            </motion.h1>
            
            <motion.p 
              className="mb-12 text-xl opacity-90 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.9 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {t('hero.subtitle')}
            </motion.p>

            <motion.div 
              className="grid grid-cols-2 gap-6 md:grid-cols-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {stats.map((stat, index) => (
                <motion.div 
                  key={index} 
                  className="text-center relative group"
                  whileHover={{ scale: 1.1, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="absolute inset-0 bg-white/5 rounded-lg tech-border opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="text-3xl font-bold relative z-10 shimmer-text">{stat.value}</div>
                  <div className="mt-1 text-sm opacity-80 relative z-10">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Culture Section */}
      <section id="culture" className="py-20 lg:py-32 relative overflow-hidden">
        <IndustrialBackground variant="grid" />
        
        <div className="container relative z-10">
          <motion.div 
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="chip mb-4 tech-border">
              <Heart className="h-4 w-4 mr-2 inline-block" />
              Notre Culture
            </span>
            <h2 className="mb-6 text-3xl font-bold text-muted-strong lg:text-5xl">
              Notre culture d'entreprise
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted">
              Rejoignez une équipe passionnée par l'excellence et l'innovation dans le secteur aéronautique
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {culture.map((item, index) => {
              const Icon = cultureIcons[index]
              return (
                <motion.div 
                  key={index} 
                  className="glass-card group p-8 relative overflow-hidden hover:shadow-2xl transition-all duration-300"
                  initial={{ opacity: 0, y: 50, rotateX: -15 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.8, 
                    delay: index * 0.15,
                    type: "spring",
                    stiffness: 80
                  }}
                  whileHover={{ 
                    y: -8,
                    scale: 1.02,
                    transition: { duration: 0.3 }
                  }}
                  style={{ transformStyle: 'preserve-3d' }}
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
                    
                    <motion.h3 
                      className="text-xl font-bold text-muted-strong mb-3 group-hover:text-primary-600 transition-colors"
                      whileHover={{ x: 5 }}
                    >
                      {item.title}
                    </motion.h3>
                    
                    <p className="text-muted leading-relaxed">
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

      {/* Benefits Section */}
      <section id="benefits" className="bg-gradient-to-b from-gray-50 to-white py-20 dark:from-gray-800 dark:to-gray-900 lg:py-32 relative overflow-hidden">
        <IndustrialBackground variant="blueprint" />
        
        <div className="container relative z-10">
          <motion.div 
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="chip mb-4 tech-border">
              <Award className="h-4 w-4 mr-2 inline-block" />
              Avantages
            </span>
            <h2 className="mb-6 text-3xl font-bold text-muted-strong lg:text-5xl">
              Nos avantages
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted">
              Des conditions de travail optimales pour votre épanouissement professionnel
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {benefits.map((benefit, index) => {
              const Icon = benefitIcons[index]
              return (
                <motion.div 
                  key={index} 
                  className="glass-card flex items-center gap-4 p-6 tech-border relative overflow-hidden group"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, x: 5 }}
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
                  <span className="font-medium text-muted-strong relative z-10">{benefit}</span>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Job Openings Section */}
      <section id="jobs" className="py-20 lg:py-32 relative overflow-hidden">
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
              <Briefcase className="h-4 w-4 mr-2 inline-block" />
              Offres d'emploi
            </span>
            <h2 className="mb-6 text-3xl font-bold text-muted-strong lg:text-5xl">
              Postes disponibles
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted">
              Découvrez nos opportunités de carrière et trouvez le poste qui vous correspond
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 max-w-4xl mx-auto">
            {jobs.map((job, index) => {
              const Icon = job.icon
              return (
                <motion.div 
                  key={index} 
                  className="glass-card p-8 tech-border relative overflow-hidden group cursor-pointer"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  whileHover={{ scale: 1.02, y: -5 }}
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
                      <Icon className="h-8 w-8" />
                    </motion.div>
                    
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-muted-strong mb-2 group-hover:text-primary-600 transition-colors">
                        {job.title}
                      </h3>
                      <div className="flex flex-wrap gap-4 mb-3 text-sm text-muted">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {job.type}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {job.location}
                        </span>
                      </div>
                      <p className="text-muted">
                        {job.description}
                      </p>
                    </div>
                    
                    <motion.div
                      whileHover={{ x: 5 }}
                      className="flex items-center text-primary-600"
                    >
                      <ArrowRight className="h-6 w-6" />
                    </motion.div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-gradient-to-b from-gray-50 to-white py-20 dark:from-gray-800 dark:to-gray-900 lg:py-32 relative overflow-hidden">
        <IndustrialBackground variant="grid" />
        
        <div className="container relative z-10">
          <motion.div 
            className="glass-card glass-card--muted mx-auto max-w-3xl p-12 tech-border relative overflow-hidden"
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
              
              <h2 className="mb-4 text-3xl font-bold text-muted-strong lg:text-4xl">
                Candidature spontanée
              </h2>
              <p className="mb-8 text-lg text-muted">
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
                <Link href="/contact" className="btn-primary inline-flex items-center gap-2 tech-border">
                  Nous contacter
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
