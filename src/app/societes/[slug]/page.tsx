'use client'

import { useEffect, useState } from 'react'
import { useParams, notFound } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { SEO } from '@/components/SEO'
import { 
  Factory,
  ArrowRight,
  CheckCircle,
  Award,
  Target,
  TrendingUp,
  Users,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Mail,
  Phone,
  MapPin
} from 'lucide-react'

interface Company {
  id: string
  slug: string
  name: string
  tagline: string
  description: string
  logoUrl: string | null
  heroImage: string | null
  galleryImages: string[]
  capabilities: Record<string, string> | null
  expertise: string[]
  certifications: string[]
  stats: Array<{ label: string; value: string; icon: string; color: string }> | null
  contactEmail: string | null
  contactPhone: string | null
  address: string | null
}

const iconMap: Record<string, any> = {
  TrendingUp,
  Factory,
  Users,
  Target,
  Award,
}

export default function CompanyPage() {
  const params = useParams()
  const slug = params.slug as string
  
  const [company, setCompany] = useState<Company | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [currentImage, setCurrentImage] = useState(0)

  useEffect(() => {
    async function fetchCompany() {
      try {
        const res = await fetch(`/api/companies/${slug}`)
        const data = await res.json()
        
        if (!data.success || !data.company) {
          setError(true)
          return
        }
        
        setCompany(data.company)
      } catch (err) {
        console.error('Error fetching company:', err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchCompany()
  }, [slug])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
      </div>
    )
  }

  if (error || !company) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white">
        <h1 className="text-4xl font-bold mb-4">Entreprise non trouvée</h1>
        <Link href="/nos-expertises" className="text-blue-400 hover:underline">
          Retour aux expertises
        </Link>
      </div>
    )
  }

  const images = company.galleryImages.length > 0 ? company.galleryImages : [company.heroImage || '/images/placeholder.jpg']

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % images.length)
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + images.length) % images.length)

  return (
    <>
      <SEO
        title={`${company.name} - ${company.tagline}`}
        description={company.description.substring(0, 160)}
        canonical={`/societes/${company.slug}`}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-gray-900 to-gray-900 py-24 text-white lg:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div 
            style={{
              backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.4) 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }}
            className="h-full w-full"
          />
        </div>

        <div className="container relative z-10">
          <div className="mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, type: "spring" }}
              className="mb-8 inline-flex items-center gap-3 px-6 py-3 bg-blue-500/20 backdrop-blur-xl border-2 border-blue-400/50 rounded-full"
              style={{ boxShadow: '0 0 30px rgba(59, 130, 246, 0.6)' }}
            >
              <Factory className="h-5 w-5 text-blue-300" />
              <span className="font-black text-white text-sm uppercase tracking-widest">{company.tagline}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-6 text-5xl font-black lg:text-7xl uppercase"
              style={{ textShadow: '0 0 40px rgba(59, 130, 246, 0.8)' }}
            >
              {company.name}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mx-auto max-w-3xl text-xl text-gray-300 leading-relaxed"
            >
              {company.description.split('\n')[0]}
            </motion.p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {company.stats && company.stats.length > 0 && (
        <section className="py-16 bg-gray-800">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {company.stats.map((stat, index) => {
                const IconComponent = iconMap[stat.icon] || Target
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.color} mb-4`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-4xl font-black text-white mb-2">{stat.value}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Description & Capabilities */}
      <section className="py-24 bg-gray-900">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Description */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-black text-white mb-6 uppercase">À propos</h2>
              <div className="prose prose-lg prose-invert">
                {company.description.split('\n\n').map((paragraph, i) => (
                  <p key={i} className="text-gray-300 leading-relaxed mb-4">{paragraph}</p>
                ))}
              </div>

              {/* Certifications */}
              {company.certifications.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Award className="h-5 w-5 text-blue-400" />
                    Certifications
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {company.certifications.map((cert, i) => (
                      <span 
                        key={i}
                        className="px-4 py-2 bg-blue-500/20 border border-blue-400/30 rounded-full text-sm font-medium text-blue-300"
                      >
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Capabilities & Expertise */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              {/* Capabilities */}
              {company.capabilities && (
                <div className="mb-10">
                  <h3 className="text-lg font-bold text-white mb-4">Capacités</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {Object.entries(company.capabilities).map(([key, value], i) => (
                      <div 
                        key={i}
                        className="p-4 bg-gray-800 rounded-xl border border-gray-700 text-center"
                      >
                        <div className="text-2xl font-black text-blue-400 mb-1">{value}</div>
                        <div className="text-xs text-gray-400 uppercase tracking-wider">{key}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Expertise */}
              {company.expertise.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-white mb-4">Notre expertise</h3>
                  <div className="space-y-3">
                    {company.expertise.map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50"
                      >
                        <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                        <span className="text-gray-300">{item}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      {images.length > 0 && images[0] && (
        <section className="py-24 bg-gray-800">
          <div className="container">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-black text-white mb-12 text-center uppercase"
            >
              Nos installations
            </motion.h2>

            <div className="relative max-w-4xl mx-auto">
              <div className="aspect-video rounded-2xl overflow-hidden bg-gray-900">
                <img
                  src={images[currentImage]}
                  alt={`${company.name} - Image ${currentImage + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>

              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>

                  <div className="flex justify-center gap-2 mt-4">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentImage(i)}
                        className={`w-3 h-3 rounded-full transition-colors ${
                          i === currentImage ? 'bg-blue-500' : 'bg-gray-600 hover:bg-gray-500'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Contact CTA */}
      <section className="py-24 bg-gradient-to-br from-blue-900 via-gray-900 to-gray-900">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-black text-white mb-6 uppercase"
            >
              Travaillons ensemble
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-300 mb-10"
            >
              Vous avez un projet ? Contactez notre équipe pour discuter de vos besoins.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors"
                style={{ boxShadow: '0 0 30px rgba(59, 130, 246, 0.5)' }}
              >
                Demander un devis
                <ArrowRight className="h-5 w-5" />
              </Link>
              
              {company.contactEmail && (
                <a
                  href={`mailto:${company.contactEmail}`}
                  className="inline-flex items-center gap-2 px-6 py-4 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-xl border border-gray-700 transition-colors"
                >
                  <Mail className="h-5 w-5" />
                  {company.contactEmail}
                </a>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}
