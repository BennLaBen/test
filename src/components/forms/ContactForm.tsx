"use client"

import { useState, useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { Building2, Mail } from 'lucide-react'

type ContactValues = {
  firstName: string
  lastName: string
  email: string
  userCompany?: string
  phone?: string
  targetCompany: string
  subject: string
  message: string
  consent: boolean
}

const companyEmails: Record<string, string> = {
  mpeb: 'contact@mpeb13.com',
  egi: 'contact@mpeb13.com',
  frem: 'contact@mpeb13.com',
  mgp: 'mega.gen.pro@wanadoo.fr',
  aerotools: 'contact@mpeb13.com',
  general: 'contact@mpeb13.com',
}

export function ContactForm() {
  const { t } = useTranslation('common')

  const contactSchema = z.object({
    firstName: z.string().min(1, t('contactForm.errors.firstNameRequired')),
    lastName: z.string().min(1, t('contactForm.errors.lastNameRequired')),
    email: z.string().email(t('contactForm.errors.emailInvalid')),
    userCompany: z.string().optional(),
    phone: z.string().optional(),
    targetCompany: z.string().min(1, t('contactForm.errors.companyRequired') || 'Veuillez sélectionner une société'),
    subject: z.string().min(1, t('contactForm.errors.subjectRequired')),
    message: z.string().min(10, t('contactForm.errors.messageMinLength')),
    consent: z.literal(true, { errorMap: () => ({ message: t('contactForm.errors.consentRequired') }) }),
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [destinationEmail, setDestinationEmail] = useState(companyEmails.general)
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ContactValues>({ resolver: zodResolver(contactSchema), defaultValues: { targetCompany: '', consent: false } })

  const selectedCompany = useWatch({ control, name: 'targetCompany' })
  const consentChecked = useWatch({ control, name: 'consent' })

  useEffect(() => {
    if (selectedCompany && companyEmails[selectedCompany]) {
      setDestinationEmail(companyEmails[selectedCompany])
    } else {
      setDestinationEmail(companyEmails.general)
    }
  }, [selectedCompany])

  const onSubmit = async (values: ContactValues) => {
    try {
      setStatus('loading')
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, destinationEmail }),
      })

      if (!res.ok) throw new Error('Request failed')
      setStatus('success')
      reset()
    } catch (e) {
      setStatus('error')
    } finally {
      setTimeout(() => setStatus('idle'), 4000)
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
      {/* Company selector with email indicator */}
      <div>
        <label htmlFor="targetCompany" className="block text-sm font-medium text-gray-300 mb-1">
          <Building2 className="inline h-4 w-4 mr-1" />
          {t('contactForm.targetCompany') || 'Société concernée'} *
        </label>
        <select 
          id="targetCompany" 
          className="mt-1 block w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 text-white"
          {...register('targetCompany')}
        >
          <option value="">{t('contactForm.selectCompany') || 'Sélectionnez une société'}</option>
          <option value="mpeb">MPEB - Usinage de précision</option>
          <option value="egi">EGI - Bureau d'études</option>
          <option value="frem">FREM - Maintenance industrielle</option>
          <option value="mgp">MGP - Tôlerie & chaudronnerie</option>
          <option value="aerotools">LLEDO Aerotools - Équipements GSE</option>
          <option value="general">{t('contactForm.generalInquiry') || 'Demande générale'}</option>
        </select>
        {errors.targetCompany && <p className="mt-1 text-sm text-red-500">{errors.targetCompany.message}</p>}
        
        {/* Email destination indicator */}
        {selectedCompany && (
          <div className="mt-2 flex items-center gap-2 text-xs text-blue-400 bg-blue-500/10 px-3 py-2 rounded-lg border border-blue-500/20">
            <Mail className="h-3.5 w-3.5" />
            <span>Email de destination : <strong>{destinationEmail}</strong></span>
          </div>
        )}
      </div>

      {/* Name fields - responsive grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-300">
            {t('auth.firstName')} *
          </label>
          <input 
            id="firstName" 
            className="mt-1 block w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 text-white placeholder-gray-400" 
            {...register('firstName')} 
          />
          {errors.firstName && <p className="mt-1 text-sm text-red-500">{errors.firstName.message}</p>}
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-300">
            {t('auth.lastName')} *
          </label>
          <input 
            id="lastName" 
            className="mt-1 block w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 text-white placeholder-gray-400" 
            {...register('lastName')} 
          />
          {errors.lastName && <p className="mt-1 text-sm text-red-500">{errors.lastName.message}</p>}
        </div>
      </div>

      {/* Email and phone - responsive grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300">{t('auth.email')} *</label>
          <input 
            id="email" 
            type="email" 
            className="mt-1 block w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 text-white placeholder-gray-400" 
            {...register('email')} 
          />
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-300">{t('auth.phone')}</label>
          <input 
            id="phone" 
            className="mt-1 block w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 text-white placeholder-gray-400" 
            {...register('phone')} 
          />
        </div>
      </div>

      {/* User company */}
      <div>
        <label htmlFor="userCompany" className="block text-sm font-medium text-gray-300">{t('auth.company')}</label>
        <input 
          id="userCompany" 
          className="mt-1 block w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 text-white placeholder-gray-400" 
          {...register('userCompany')} 
        />
      </div>

      {/* Subject */}
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-300">{t('contactForm.subject')} *</label>
        <select 
          id="subject" 
          className="mt-1 block w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 text-white" 
          {...register('subject')}
        >
          <option value="">{t('contactForm.selectSubject')}</option>
          <option value="quote">{t('contactForm.subjects.quote') || 'Demande de devis'}</option>
          <option value="information">{t('contactForm.subjects.information')}</option>
          <option value="support">{t('contactForm.subjects.support')}</option>
          <option value="partnership">{t('contactForm.subjects.partnership')}</option>
          <option value="other">{t('contactForm.subjects.other')}</option>
        </select>
        {errors.subject && <p className="mt-1 text-sm text-red-500">{errors.subject.message}</p>}
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-300">{t('contactForm.message')} *</label>
        <textarea 
          id="message" 
          rows={5} 
          className="mt-1 block w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 text-white placeholder-gray-400 resize-none" 
          placeholder={t('contactForm.messagePlaceholder')} 
          {...register('message')} 
        />
        {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>}
      </div>

      {/* Consent checkbox - grayed when unchecked */}
      <div className={`flex items-start p-3 rounded-lg border transition-all ${consentChecked ? 'bg-green-500/10 border-green-500/30' : 'bg-gray-700/30 border-gray-600'}`}>
        <input 
          id="consent" 
          type="checkbox" 
          className="mt-0.5 h-5 w-5 rounded border-gray-500 text-primary-600 focus:ring-primary-500 cursor-pointer" 
          {...register('consent')} 
        />
        <label htmlFor="consent" className={`ml-3 text-sm cursor-pointer ${consentChecked ? 'text-gray-200' : 'text-gray-400'}`}>
          {t('contactForm.consent')} <a href="/privacy" className="text-primary-500 hover:text-primary-400 underline">{t('contactForm.privacyPolicy')}</a>. *
        </label>
      </div>
      {errors.consent && <p className="text-sm text-red-500">{errors.consent.message}</p>}

      {/* Submit button - disabled when consent not checked */}
      <button 
        type="submit" 
        className={`w-full py-3 px-6 rounded-lg font-bold uppercase tracking-wider text-sm transition-all ${
          consentChecked && status !== 'loading'
            ? 'bg-primary-600 hover:bg-primary-700 text-white cursor-pointer shadow-lg hover:shadow-xl'
            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
        }`}
        disabled={!consentChecked || status === 'loading'}
      >
        {status === 'loading' ? t('contactForm.sending') : t('contactForm.submit')}
      </button>

      {/* Status messages */}
      {status === 'success' && (
        <div className="p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-sm text-green-400 text-center">
          {t('contactForm.success')}
        </div>
      )}
      {status === 'error' && (
        <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-sm text-red-400 text-center">
          {t('contactForm.error')}
        </div>
      )}
    </form>
  )
}


