'use client'

import { motion } from 'framer-motion'
import { MessageSquare, FileText, Cog, Truck, Award, HeadphonesIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useTranslation } from 'react-i18next'

interface Step {
  title: string
  description: string
  details: string[]
}

const icons = [MessageSquare, FileText, Cog, Truck, Award, HeadphonesIcon]

export function Process() {
  const { t } = useTranslation('homepage')
  const steps = t('process.steps', { returnObjects: true }) as Step[]
  const pathname = usePathname()
  const locale = pathname.startsWith('/en') ? 'en' : 'fr'

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-b from-gray-900 to-gray-800 relative overflow-hidden">
      {/* Grille industrielle */}
      <div className="absolute inset-0 opacity-5">
        <div 
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.4) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.4) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
          className="h-full w-full"
        />
      </div>

      <div className="container relative z-10">
        {/* Header Tony Stark */}
        <div className="mx-auto mb-20 max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mb-6 inline-flex"
          >
            <div className="px-6 py-2 bg-blue-500/20 backdrop-blur-xl border-2 border-blue-400/50 rounded-full"
              style={{
                boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)'
              }}
            >
              <span className="font-bold text-white text-sm uppercase tracking-wider">{t('process.badge')}</span>
            </div>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-fluid-3xl font-black text-white mb-4 sm:mb-6 uppercase"
            style={{
              textShadow: '0 0 30px rgba(59, 130, 246, 0.8)'
            }}
          >
            {t('process.title')}
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-fluid-base text-gray-300"
          >
            {t('process.subtitle')}
          </motion.p>
        </div>

        {/* Process Timeline - Style futuriste */}
        <div className="relative">
          {/* Ligne verticale lumineuse */}
          <div 
            className="absolute left-1/2 top-0 hidden h-full w-1 -translate-x-1/2 lg:block"
            style={{
              background: 'linear-gradient(to bottom, transparent, rgba(59, 130, 246, 0.6), rgba(59, 130, 246, 0.8), rgba(59, 130, 246, 0.6), transparent)',
              boxShadow: '0 0 20px rgba(59, 130, 246, 0.6)'
            }}
          />

          <div className="space-y-6 sm:space-y-10 lg:space-y-24">
            {steps.map((step, index) => {
              const Icon = icons[index] || MessageSquare
              const isEven = index % 2 === 0

              return (
                <motion.div
                  key={`${locale}-step-${index}`}
                  initial={{ opacity: 0, x: isEven ? -40 : 40, scale: 0.95 }}
                  whileInView={{ opacity: 1, x: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="relative"
                >
                  <div className={`lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-12 ${isEven ? '' : 'lg:grid-flow-dense'}`}>
                    <div className={`${isEven ? 'lg:text-right' : 'lg:col-start-2'}`}>
                      <div className="inline-block w-full max-w-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 bg-white/5 backdrop-blur-sm border border-blue-400/20 relative overflow-hidden"
                        style={{
                          boxShadow: '0 8px 32px rgba(59, 130, 246, 0.15)'
                        }}
                      >
                        {/* Scan line */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/20 to-transparent"
                          animate={{ x: ['-100%', '200%'] }}
                          transition={{ duration: 5, repeat: Infinity, ease: "linear", delay: index * 0.7 }}
                          style={{ willChange: 'transform' }}
                        />
                        <div className={`mb-6 flex items-center gap-4 relative z-10 ${isEven ? 'lg:flex-row-reverse' : ''}`}>
                          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg">
                            <Icon className="h-7 w-7" />
                          </div>
                          <div>
                            <div className="mb-1 text-xs font-bold text-blue-400 uppercase tracking-wider">
                              {t('process.stepLabel', { defaultValue: 'Étape {{number}}', number: index + 1 })}
                            </div>
                            <h3 className="text-xl font-black text-white uppercase">
                              {step.title}
                            </h3>
                          </div>
                        </div>

                        <p className="mb-5 text-gray-300 relative z-10">
                          {step.description}
                        </p>

                        <ul className={`space-y-2.5 relative z-10 ${isEven ? 'lg:text-right' : ''}`}>
                          {step.details.map((detail, idx) => (
                            <li key={idx} className={`flex items-center gap-2.5 text-sm text-gray-400 ${isEven ? 'lg:flex-row-reverse' : ''}`}>
                              <span className="flex h-2 w-2 flex-shrink-0 rounded-full bg-blue-400" 
                                style={{
                                  boxShadow: '0 0 10px rgba(59, 130, 246, 0.8)'
                                }}
                              />
                              <span className="font-medium">{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 lg:block z-20">
                      <motion.div 
                        className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-500 text-2xl font-black text-white"
                        whileHover={{ scale: 1.1, rotate: 360 }}
                        transition={{ duration: 0.6 }}
                        style={{
                          boxShadow: '0 0 30px rgba(59, 130, 246, 0.8), inset 0 0 20px rgba(255, 255, 255, 0.2)',
                          border: '3px solid rgba(255, 255, 255, 0.3)'
                        }}
                      >
                        {index + 1}
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* CTA Footer - Style Arc Reactor */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-24 text-center"
        >
          <div className="inline-block rounded-2xl p-10 lg:p-16 bg-white/5 backdrop-blur-sm border border-blue-400/30 relative overflow-hidden max-w-3xl"
            style={{
              boxShadow: '0 0 60px rgba(59, 130, 246, 0.3)'
            }}
          >
            {/* Scan lines */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/20 to-transparent"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              style={{ willChange: 'transform' }}
            />
            
            <h3 className="mb-4 text-3xl font-black text-white lg:text-4xl uppercase relative z-10"
              style={{
                textShadow: '0 0 20px rgba(59, 130, 246, 0.8)'
              }}
            >
              {t('process.cta.title')}
            </h3>
            <p className="mb-8 text-lg text-gray-300 relative z-10">
              {t('process.cta.subtitle')}
            </p>
            
            <motion.a
              href="/contact"
              className="relative inline-flex items-center px-10 py-4 text-lg font-black uppercase text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl overflow-hidden z-10"
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.98 }}
              style={{
                boxShadow: '0 0 30px rgba(59, 130, 246, 0.6)'
              }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ['-200%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                style={{ willChange: 'transform' }}
              />
              <span className="relative z-10">{t('process.cta.button')}</span>
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
