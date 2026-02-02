'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { SEO } from '@/components/SEO'
import { useForm } from 'react-hook-form'
import { 
  User, 
  Mail, 
  Phone,
  Building2,
  Save,
  Loader2,
  CheckCircle,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

interface ProfileForm {
  firstName: string
  lastName: string
  company: string
  phone: string
}

export default function ProfilPage() {
  const { data: session, update } = useSession()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { t } = useTranslation('common')

  const { register, handleSubmit } = useForm<ProfileForm>({
    defaultValues: {
      firstName: session?.user?.firstName || '',
      lastName: session?.user?.lastName || '',
      company: '',
      phone: '',
    }
  })

  const onSubmit = async (data: ProfileForm) => {
    setLoading(true)
    setSuccess(false)

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (res.ok) {
        setSuccess(true)
        await update()
      }
    } catch (err) {
      console.error('Error updating profile:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <SEO title={t('auth.myProfile')} />

      <section className="py-12 lg:py-16">
        <div className="container max-w-2xl">
          <Link 
            href="/espace-client"
            className="inline-flex items-center gap-2 text-muted hover:text-primary-600 mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('profile.backToSpace')}
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-primary-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-muted-strong">{t('auth.myProfile')}</h1>
                <p className="text-muted">{session?.user?.email}</p>
              </div>
            </div>

            {success && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-3 text-green-700 dark:text-green-400">
                <CheckCircle className="h-5 w-5" />
                {t('profile.updateSuccess')}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-muted-strong mb-2">
                    <User className="h-4 w-4 inline mr-2" />
                    {t('auth.firstName')}
                  </label>
                  <input
                    {...register('firstName')}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-strong mb-2">
                    <User className="h-4 w-4 inline mr-2" />
                    {t('auth.lastName')}
                  </label>
                  <input
                    {...register('lastName')}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-strong mb-2">
                  <Mail className="h-4 w-4 inline mr-2" />
                  Email
                </label>
                <input
                  type="email"
                  value={session?.user?.email || ''}
                  disabled
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-muted cursor-not-allowed"
                />
                <p className="text-sm text-muted mt-1">{t('profile.emailCannotBeChanged')}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-strong mb-2">
                  <Building2 className="h-4 w-4 inline mr-2" />
                  {t('auth.company')}
                </label>
                <input
                  {...register('company')}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Votre entreprise"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-strong mb-2">
                  <Phone className="h-4 w-4 inline mr-2" />
                  {t('auth.phone')}
                </label>
                <input
                  {...register('phone')}
                  type="tel"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="06 12 34 56 78"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    {t('profile.saving')}
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    {t('profile.saveChanges')}
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </>
  )
}
