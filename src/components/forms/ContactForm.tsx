"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const contactSchema = z.object({
  firstName: z.string().min(1, 'Le prénom est requis'),
  lastName: z.string().min(1, 'Le nom est requis'),
  email: z.string().email('Email invalide'),
  company: z.string().optional(),
  phone: z.string().optional(),
  subject: z.string().min(1, 'Le sujet est requis'),
  message: z.string().min(10, 'Le message doit contenir au moins 10 caractères'),
  consent: z.literal(true, { errorMap: () => ({ message: 'Vous devez accepter la politique de confidentialité' }) }),
})

type ContactValues = z.infer<typeof contactSchema>

export function ContactForm() {
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
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Prénom *
          </label>
          <input id="firstName" className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" {...register('firstName')} />
          {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>}
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Nom *
          </label>
          <input id="lastName" className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" {...register('lastName')} />
          {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email *</label>
        <input id="email" type="email" className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" {...register('email')} />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Société</label>
        <input id="company" className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" {...register('company')} />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Téléphone</label>
        <input id="phone" className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" {...register('phone')} />
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Sujet *</label>
        <select id="subject" className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" {...register('subject')}>
          <option value="">Sélectionnez un sujet</option>
          <option value="contact">Prise de contact</option>
          <option value="information">Demande d'information</option>
          <option value="support">Support technique</option>
          <option value="partnership">Partenariat</option>
          <option value="other">Autre</option>
        </select>
        {errors.subject && <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>}
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Message *</label>
        <textarea id="message" rows={6} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" placeholder="Décrivez votre projet ou votre demande..." {...register('message')} />
        {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>}
      </div>

      <div className="flex items-start">
        <input id="consent" type="checkbox" className="mt-1 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" {...register('consent')} />
        <label htmlFor="consent" className="ml-2 text-sm text-gray-600 dark:text-gray-300">
          J'accepte que mes données soient utilisées pour traiter ma demande conformément à la <a href="/privacy" className="text-primary-600 hover:text-primary-500">politique de confidentialité</a>. *
        </label>
      </div>
      {errors.consent && <p className="mt-1 text-sm text-red-600">{errors.consent.message}</p>}

      <button type="submit" className="btn-primary w-full" disabled={status === 'loading'}>
        {status === 'loading' ? 'Envoi…' : 'Envoyer la demande'}
      </button>

      {status === 'success' && (
        <p className="text-sm text-green-600">Votre message a été envoyé. Merci, nous revenons vers vous sous 24h.</p>
      )}
      {status === 'error' && (
        <p className="text-sm text-red-600">Une erreur est survenue. Merci de réessayer ou de nous contacter par téléphone.</p>
      )}
    </form>
  )
}


