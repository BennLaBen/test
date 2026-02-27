'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BarChart3,
  Users,
  Eye,
  Globe,
  Monitor,
  Smartphone,
  Tablet,
  ArrowUp,
  ArrowDown,
  Loader2,
  RefreshCw,
  ExternalLink,
  TrendingUp,
  MapPin,
  Activity,
  Zap,
  MousePointerClick,
  DatabaseZap,
} from 'lucide-react'

interface AnalyticsData {
  totalViews: number
  prevTotalViews: number
  uniqueVisitors: number
  prevUniqueVisitors: number
  liveVisitors: number
  chart: { date: string; views: number; visitors: number }[]
  topPages: { path: string; views: number }[]
  topReferrers: { referrer: string; views: number }[]
  countries: { country: string; views: number }[]
  devices: { device: string; views: number }[]
  browsers: { browser: string; views: number }[]
  period: string
}

const COUNTRY_NAMES: Record<string, string> = {
  FR: '🇫🇷 France', US: '🇺🇸 États-Unis', GB: '🇬🇧 Royaume-Uni', DE: '🇩🇪 Allemagne',
  ES: '🇪🇸 Espagne', IT: '🇮🇹 Italie', CH: '🇨🇭 Suisse', BE: '🇧🇪 Belgique',
  CA: '🇨🇦 Canada', MA: '🇲🇦 Maroc', DZ: '🇩🇿 Algérie', TN: '🇹🇳 Tunisie',
  PT: '🇵🇹 Portugal', BR: '🇧🇷 Brésil', NL: '🇳🇱 Pays-Bas', JP: '🇯🇵 Japon',
  CN: '🇨🇳 Chine', IN: '🇮🇳 Inde', AE: '🇦🇪 Émirats arabes unis', SA: '🇸🇦 Arabie saoudite',
}

const PAGE_LABELS: Record<string, string> = {
  '/': 'Accueil',
  '/contact': 'Contact',
  '/carriere': 'Carrières',
  '/expertises': 'Expertises',
  '/vision': 'Notre Vision',
  '/connexion': 'Connexion',
  '/blog': 'Blog',
  '/cas-clients': 'Cas Clients',
  '/aerotools': 'LLEDO Aerotools',
}

const DEVICE_ICONS: Record<string, typeof Monitor> = {
  desktop: Monitor,
  mobile: Smartphone,
  tablet: Tablet,
}

const DEVICE_LABELS: Record<string, string> = {
  desktop: 'Ordinateur',
  mobile: 'Mobile',
  tablet: 'Tablette',
}

function pctChange(current: number, previous: number): { value: number; direction: 'up' | 'down' | 'flat' } {
  if (previous === 0) return { value: current > 0 ? 100 : 0, direction: current > 0 ? 'up' : 'flat' }
  const change = Math.round(((current - previous) / previous) * 100)
  return { value: Math.abs(change), direction: change > 0 ? 'up' : change < 0 ? 'down' : 'flat' }
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('7d')
  const [seeding, setSeeding] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/analytics?period=${period}`)
      const json = await res.json()
      if (json.success) setData(json.data)
    } catch (err) {
      console.error('Analytics fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [period])

  useEffect(() => { fetchData() }, [fetchData])

  useEffect(() => {
    const interval = setInterval(fetchData, 60000)
    return () => clearInterval(interval)
  }, [fetchData])

  const seedDemo = async () => {
    setSeeding(true)
    try {
      await fetch('/api/admin/analytics/seed', { method: 'POST' })
      await fetchData()
    } catch { /* silent */ }
    setSeeding(false)
  }

  const maxChartViews = data ? Math.max(...data.chart.map(c => c.views), 1) : 1
  const isEmpty = data && data.totalViews === 0

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
      >
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Analytics</h1>
              <p className="text-xs text-gray-500">Suivi du trafic en temps réel</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Live badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/80 border border-gray-700 rounded-full mr-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            <span className="text-xs font-semibold text-gray-300">
              {data?.liveVisitors || 0} en ligne
            </span>
          </div>

          {/* Period selector */}
          <div className="flex bg-gray-800/80 rounded-lg border border-gray-700 p-0.5">
            {(['7d', '30d', '90d'] as const).map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  period === p
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {p === '7d' ? '7j' : p === '30d' ? '30j' : '90j'}
              </button>
            ))}
          </div>

          <button
            onClick={fetchData}
            disabled={loading}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </motion.div>

      {loading && !data ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-sm text-gray-500">Chargement des données…</p>
        </div>
      ) : isEmpty ? (
        /* ── Empty state ── */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-20"
        >
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/20 flex items-center justify-center mb-6">
            <MousePointerClick className="h-10 w-10 text-blue-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">En attente de visiteurs</h2>
          <p className="text-sm text-gray-400 max-w-md text-center mb-8">
            Le tracking est actif. Les données apparaîtront ici dès que des visiteurs navigueront sur votre site.
            Chaque page vue est enregistrée automatiquement.
          </p>
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-6 text-xs text-gray-500">
              <span className="flex items-center gap-1.5"><Eye className="h-3.5 w-3.5 text-blue-400" /> Pages vues</span>
              <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-emerald-400" /> Géolocalisation</span>
              <span className="flex items-center gap-1.5"><Monitor className="h-3.5 w-3.5 text-amber-400" /> Appareils</span>
              <span className="flex items-center gap-1.5"><Globe className="h-3.5 w-3.5 text-purple-400" /> Referrers</span>
            </div>
            <button
              onClick={seedDemo}
              disabled={seeding}
              className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-gray-800 border border-gray-700 text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-700 hover:text-white transition-colors disabled:opacity-50"
            >
              {seeding ? <Loader2 className="h-4 w-4 animate-spin" /> : <DatabaseZap className="h-4 w-4" />}
              {seeding ? 'Génération…' : 'Générer des données de démo'}
            </button>
          </div>
        </motion.div>
      ) : data ? (
        <div className="space-y-6">
          {/* ── KPI Cards ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard label="Pages vues" value={data.totalViews} icon={Eye} change={pctChange(data.totalViews, data.prevTotalViews)} color="blue" delay={0} />
            <KPICard label="Visiteurs uniques" value={data.uniqueVisitors} icon={Users} change={pctChange(data.uniqueVisitors, data.prevUniqueVisitors)} color="emerald" delay={0.05} />
            <KPICard label="Moy. vues/jour" value={data.chart.length > 0 ? Math.round(data.totalViews / data.chart.length) : 0} icon={TrendingUp} change={{ value: 0, direction: 'flat' }} color="purple" delay={0.1} />
            <KPICard label="En ligne" value={data.liveVisitors} icon={Activity} change={{ value: 0, direction: 'flat' }} color="green" delay={0.15} live />
          </div>

          {/* ── Chart ── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Zap className="h-4 w-4 text-blue-400" />
                Trafic sur la période
              </h3>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-blue-500" /> Vues</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-blue-300/40" /> Visiteurs</span>
              </div>
            </div>
            <div className="flex items-end gap-[2px] h-[200px]">
              {data.chart.map((day, i) => {
                const heightPct = (day.views / maxChartViews) * 100
                const visitorPct = (day.visitors / maxChartViews) * 100
                const dateObj = new Date(day.date)
                const label = dateObj.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
                return (
                  <div key={day.date} className="flex-1 flex flex-col items-center group relative">
                    <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap shadow-xl">
                      <p className="text-[11px] font-bold text-white">{label}</p>
                      <p className="text-[10px] text-blue-400">{day.views} vues</p>
                      <p className="text-[10px] text-gray-400">{day.visitors} visiteurs</p>
                    </div>
                    <div className="w-full flex flex-col items-stretch justify-end h-full gap-[1px]">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${Math.max(heightPct, 1)}%` }}
                        transition={{ duration: 0.6, delay: i * 0.015 }}
                        className="w-full bg-blue-500 hover:bg-blue-400 rounded-t-sm transition-colors cursor-pointer min-h-[2px]"
                      />
                    </div>
                    {(data.chart.length <= 14 || i % Math.ceil(data.chart.length / 8) === 0) && (
                      <span className="text-[9px] text-gray-600 mt-1.5 truncate max-w-full">{label}</span>
                    )}
                  </div>
                )
              })}
            </div>
          </motion.div>

          {/* ── Grid détails ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Top Pages */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
              className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
                <ExternalLink className="h-4 w-4 text-blue-400" />
                Pages les plus visitées
              </h3>
              {data.topPages.length === 0 ? (
                <p className="text-sm text-gray-600 py-4 text-center">Aucune page visitée</p>
              ) : (
                <div className="space-y-3">
                  {data.topPages.map((page, i) => (
                    <div key={page.path} className="group">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-[10px] font-bold text-gray-600 w-4 text-center flex-shrink-0">{i + 1}</span>
                          <span className="text-sm text-white truncate group-hover:text-blue-400 transition-colors">
                            {PAGE_LABELS[page.path] || page.path}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-blue-400 tabular-nums ml-3">{page.views}</span>
                      </div>
                      <div className="ml-6 w-[calc(100%-1.5rem)] bg-gray-800/50 rounded-full h-1">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(page.views / (data.topPages[0]?.views || 1)) * 100}%` }}
                          transition={{ duration: 0.6, delay: 0.3 + i * 0.05 }}
                          className="bg-blue-500/70 h-1 rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Countries */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-emerald-400" />
                Provenance géographique
              </h3>
              {data.countries.length === 0 ? (
                <p className="text-sm text-gray-600 py-4 text-center">Données géo non disponibles en local</p>
              ) : (
                <div className="space-y-3">
                  {data.countries.map((c, i) => (
                    <div key={c.country} className="group">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2.5">
                          <span className="text-[10px] font-bold text-gray-600 w-4 text-center flex-shrink-0">{i + 1}</span>
                          <span className="text-sm text-white group-hover:text-emerald-400 transition-colors">
                            {COUNTRY_NAMES[c.country] || c.country}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-emerald-400 tabular-nums ml-3">{c.views}</span>
                      </div>
                      <div className="ml-6 w-[calc(100%-1.5rem)] bg-gray-800/50 rounded-full h-1">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(c.views / (data.countries[0]?.views || 1)) * 100}%` }}
                          transition={{ duration: 0.6, delay: 0.35 + i * 0.05 }}
                          className="bg-emerald-500/70 h-1 rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Referrers */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
              className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
                <Globe className="h-4 w-4 text-purple-400" />
                Sources de trafic
              </h3>
              {data.topReferrers.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500">100% trafic direct</p>
                  <p className="text-xs text-gray-600 mt-1">Les visiteurs accèdent directement au site</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {data.topReferrers.map((ref, i) => {
                    let label = ref.referrer
                    try { label = new URL(ref.referrer).hostname } catch { /* keep */ }
                    return (
                      <div key={ref.referrer} className="group">
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="text-[10px] font-bold text-gray-600 w-4 text-center flex-shrink-0">{i + 1}</span>
                            <span className="text-sm text-white truncate group-hover:text-purple-400 transition-colors">{label}</span>
                          </div>
                          <span className="text-xs font-bold text-purple-400 tabular-nums ml-3">{ref.views}</span>
                        </div>
                        <div className="ml-6 w-[calc(100%-1.5rem)] bg-gray-800/50 rounded-full h-1">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(ref.views / (data.topReferrers[0]?.views || 1)) * 100}%` }}
                            transition={{ duration: 0.6, delay: 0.4 + i * 0.05 }}
                            className="bg-purple-500/70 h-1 rounded-full"
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </motion.div>

            {/* Devices & Browsers */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
                <Monitor className="h-4 w-4 text-amber-400" />
                Appareils & Navigateurs
              </h3>

              {data.devices.length === 0 && data.browsers.length === 0 ? (
                <p className="text-sm text-gray-600 py-4 text-center">Aucune donnée</p>
              ) : (
                <>
                  {/* Devices as pie-like cards */}
                  {data.devices.length > 0 && (
                    <>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Appareils</p>
                      <div className="grid grid-cols-3 gap-2 mb-6">
                        {data.devices.map(d => {
                          const Icon = DEVICE_ICONS[d.device] || Monitor
                          const total = data!.devices.reduce((s, x) => s + x.views, 0)
                          const pct = total > 0 ? Math.round((d.views / total) * 100) : 0
                          return (
                            <div key={d.device} className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-3 text-center hover:border-amber-500/30 transition-colors">
                              <Icon className="h-5 w-5 text-amber-400 mx-auto mb-1.5" />
                              <p className="text-xl font-black text-white leading-none">{pct}%</p>
                              <p className="text-[10px] text-gray-500 mt-1">{DEVICE_LABELS[d.device] || d.device}</p>
                            </div>
                          )
                        })}
                      </div>
                    </>
                  )}

                  {/* Browsers */}
                  {data.browsers.length > 0 && (
                    <>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Navigateurs</p>
                      <div className="space-y-2.5">
                        {data.browsers.map(b => {
                          const total = data!.browsers.reduce((s, x) => s + x.views, 0)
                          const pct = total > 0 ? Math.round((b.views / total) * 100) : 0
                          return (
                            <div key={b.browser} className="flex items-center gap-3">
                              <span className="text-xs text-gray-300 w-14 truncate">{b.browser}</span>
                              <div className="flex-1 bg-gray-800/50 rounded-full h-2">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${pct}%` }}
                                  transition={{ duration: 0.6, delay: 0.5 }}
                                  className="bg-amber-500/80 h-2 rounded-full"
                                />
                              </div>
                              <span className="text-xs font-bold text-amber-400 w-10 text-right tabular-nums">{pct}%</span>
                            </div>
                          )
                        })}
                      </div>
                    </>
                  )}
                </>
              )}
            </motion.div>
          </div>
        </div>
      ) : (
        <div className="text-center py-32">
          <p className="text-gray-500">Impossible de charger les données</p>
          <button onClick={fetchData} className="mt-3 text-sm text-blue-400 hover:text-blue-300">Réessayer</button>
        </div>
      )}
    </div>
  )
}

/* ── KPI Card Component ── */
function KPICard({ label, value, icon: Icon, change, color, delay = 0, live }: {
  label: string
  value: number
  icon: typeof Eye
  change: { value: number; direction: 'up' | 'down' | 'flat' }
  color: string
  delay?: number
  live?: boolean
}) {
  const styles: Record<string, { bg: string; icon: string; badge: string }> = {
    blue:    { bg: 'bg-blue-500/5 border-blue-500/10 hover:border-blue-500/30', icon: 'text-blue-400 bg-blue-500/10', badge: 'text-blue-400' },
    emerald: { bg: 'bg-emerald-500/5 border-emerald-500/10 hover:border-emerald-500/30', icon: 'text-emerald-400 bg-emerald-500/10', badge: 'text-emerald-400' },
    purple:  { bg: 'bg-purple-500/5 border-purple-500/10 hover:border-purple-500/30', icon: 'text-purple-400 bg-purple-500/10', badge: 'text-purple-400' },
    green:   { bg: 'bg-green-500/5 border-green-500/10 hover:border-green-500/30', icon: 'text-green-400 bg-green-500/10', badge: 'text-green-400' },
  }
  const s = styles[color] || styles.blue

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`${s.bg} border rounded-2xl p-5 transition-colors`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.icon}`}>
          <Icon className="h-4.5 w-4.5" />
        </div>
        {live ? (
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
          </span>
        ) : change.direction !== 'flat' ? (
          <span className={`flex items-center gap-0.5 text-[11px] font-bold px-2 py-0.5 rounded-full ${
            change.direction === 'up' ? 'text-green-400 bg-green-500/10' : 'text-red-400 bg-red-500/10'
          }`}>
            {change.direction === 'up' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
            {change.value}%
          </span>
        ) : (
          <span className="text-[10px] text-gray-600">—</span>
        )}
      </div>
      <p className="text-2xl font-black text-white tabular-nums">{value.toLocaleString('fr-FR')}</p>
      <p className="text-[11px] text-gray-500 mt-1 font-medium">{label}</p>
    </motion.div>
  )
}
