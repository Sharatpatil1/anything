import { useEffect, useState } from 'react'
import { ArrowRight, MapPin, RefreshCw, SunMedium } from 'lucide-react'
import DataState from '../components/DataState'
import ChartCard from '../components/ChartCard'
import StatCard from '../components/StatCard'
import StatusBadge from '../components/StatusBadge'
import { getDashboardData } from '../services/api'

const parameterIcons = { wind: '↝', sun: '☼', users: '◌', sunrise: '◒' }

export default function DashboardPage({ onNavigate }) {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let isActive = true
    getDashboardData()
      .then((dashboardData) => isActive && setData(dashboardData))
      .catch(() => isActive && setError('Unable to load dashboard data.'))
    return () => { isActive = false }
  }, [])

  if (error) return <DataState kind="error" message={error} />
  if (!data) return <DataState kind="loading" />
  if (!data.stats?.length || !data.environmentParameters?.length || !data.temperatureTrend?.length) return <DataState kind="empty" message="No dashboard data is available yet." />

  return <div className="space-y-7"><section className="relative overflow-hidden rounded-3xl bg-slate-950 p-6 text-white sm:p-8"><div className="relative z-10 max-w-xl"><div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-300"><span className="flex items-center gap-1.5"><MapPin size={13} className="text-orange-300" /> {data.meta.location}</span><span className="text-slate-700">/</span><span>{data.meta.zoneLabel}</span></div><h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">Thermal conditions, <span className="text-orange-300">made visible.</span></h1><p className="mt-3 max-w-lg text-sm leading-6 text-slate-300">A clear view of how local shelter and environmental conditions affect the comfort and safety of the people inside.</p><div className="mt-6 flex flex-wrap items-center gap-3"><button onClick={() => onNavigate('analysis')} className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-orange-400">Start analysis <ArrowRight size={16} /></button><span className="flex items-center gap-2 text-xs text-slate-400"><RefreshCw size={13} /> {data.meta.updatedLabel}</span></div></div><div className="absolute -right-12 -top-24 h-80 w-80 rounded-full border-[36px] border-orange-500/10" /><div className="absolute -right-4 -bottom-28 h-64 w-64 rounded-full border border-orange-300/20" /><SunMedium className="absolute right-16 top-12 text-orange-300/50" size={30} /></section><section><div className="mb-4 flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-600">Current snapshot</p><h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900">Comfort at a glance</h2></div><StatusBadge tone="warning">{data.meta.statusLabel}</StatusBadge></div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{data.stats.map((stat) => <StatCard key={stat.label} {...stat} trend={stat.tone === 'green' ? 'up' : undefined} />)}</div></section><section className="grid gap-5 xl:grid-cols-[1.35fr_1fr]"><ChartCard title="Temperature over time" subtitle="Today's observed range" data={data.temperatureTrend} color="#f97316" unit="°C" type="area" /><article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/40"><div className="flex items-start justify-between"><div><h3 className="text-sm font-bold text-slate-900">Environmental parameters</h3><p className="mt-1 text-xs text-slate-400">Inputs shaping the current result</p></div><span className="text-xs font-bold text-slate-400">Now</span></div><div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">{data.environmentParameters.map((parameter) => <div key={parameter.label} className="flex items-center justify-between rounded-xl bg-slate-50 p-3"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-lg bg-white text-lg text-orange-500 shadow-sm">{parameterIcons[parameter.icon]}</span><span className="text-xs font-semibold text-slate-500">{parameter.label}</span></div><span className="text-sm font-bold text-slate-800">{parameter.value}</span></div>)}</div></article></section></div>
}
