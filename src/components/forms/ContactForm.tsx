"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'

type ContactValues = {
  firstName: string
  lastName: string
  email: string
  company?: string
  phone?: string
  subject: string
  message: string
  consent: boolean
}

export function ContactForm() {
  const { t } = useTranslation('common')

  const contactSchema = z.object({
    firstName: z.string().min(1, t('contactForm.errors.firstNameRequired')),
    lastName: z.string().min(1, t('contactForm.errors.lastNameRequired')),
    email: z.string().email(t('contactForm.errors.emailInvalid')),
    company: z.string().optional(),
    phone: z.string().optional(),
    subject: z.string().min(1, t('contactForm.errors.subjectRequired')),
    message: z.string().min(10, t('contactForm.errors.messageMinLength')),
    consent: z.literal(true, { errorMap: () => ({ message: t('contactForm.errors.consentRequired') }) }),
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactValues>({ resolver: zodResolver(contactSchema) })

  const onSubmit = async (values: ContactValues) => {
    try {
      setStatus('loading')
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
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
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-300">
            {t('auth.firstName')} *
          </label>
          <input id="firstName" className="mt-1 block w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 text-white placeholder-gray-400" {...register('firstName')} />
          {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>}
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-300">
            {t('auth.lastName')} *
          </label>
          <input id="lastName" className="mt-1 block w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 text-white placeholder-gray-400" {...register('lastName')} />
          {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300">{t('auth.email')} *</label>
        <input id="email" type="email" className="mt-1 block w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 text-white placeholder-gray-400" {...register('email')} />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="company" className="block text-sm font-medium text-gray-300">{t('auth.company')}</label>
        <input id="company" className="mt-1 block w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 text-white placeholder-gray-400" {...register('company')} />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-300">{t('auth.phone')}</label>
        <input id="phone" className="mt-1 block w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 text-white placeholder-gray-400" {...register('phone')} />
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-300">{t('contactForm.subject')} *</label>
        <select id="subject" className="mt-1 block w-full rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 text-white" {...register('subject')}>
          <option value="">{t('contactForm.selectSubject')}</option>
          <option value="contact">{t('contactForm.subjects.contact')}</option>
          <option value="information">{t('contactForm.subjects.information')}</option>
          <option value="support">{t('contactForm.subjects.support')}</option>
          <option value="partnership">{t('contactForm.subjects.partnership')}</option>
          <option value="other">{t('contactForm.subjects.other')}</option>
        </select>
        {errors.subject && <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>}
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-300">{t('contactForm.message')} *</label>
        <textarea id="message" rows={6} className="mt-1 block w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 text-white placeholder-gray-400" placeholder={t('contactForm.messagePlaceholder')} {...register('message')} />
        {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>}
      </div>

      <div className="flex items-start">
        <input id="consent" type="checkbox" className="mt-1 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" {...register('consent')} />
        <label htmlFor="consent" className="ml-2 text-sm text-gray-300">
          {t('contactForm.consent')} <a href="/privacy" className="text-primary-600 hover:text-primary-500">{t('contactForm.privacyPolicy')}</a>. *
        </label>
      </div>
      {errors.consent && <p className="mt-1 text-sm text-red-600">{errors.consent.message}</p>}

      <button type="submit" className="btn-primary w-full" disabled={status === 'loading'}>
        {status === 'loading' ? t('contactForm.sending') : t('contactForm.submit')}
      </button>

      {status === 'success' && (
        <p className="text-sm text-green-600">{t('contactForm.success')}</p>
      )}
      {status === 'error' && (
        <p className="text-sm text-red-600">{t('contactForm.error')}</p>
      )}
    </form>
  )
}


