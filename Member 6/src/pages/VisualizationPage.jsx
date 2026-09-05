import { useEffect, useState } from 'react'
import ChartCard from '../components/ChartCard'
import DataState from '../components/DataState'
import { getVisualizationData } from '../services/api'

export default function VisualizationPage() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let isActive = true
    getVisualizationData()
      .then((visualizationData) => isActive && setData(visualizationData))
      .catch(() => isActive && setError('Unable to load visualization data.'))
    return () => { isActive = false }
  }, [])

  if (error) return <DataState kind="error" message={error} />
  if (!data) return <DataState kind="loading" />
  if (![data.temperatureTrend, data.humidityTrend, data.comfortTrend, data.shelterComparison].every((items) => Array.isArray(items) && items.length)) return <DataState kind="empty" message="No visualization data is available yet." />

  return <div className="space-y-7"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-600">Visualization</p><h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Read the patterns</h1><p className="mt-2 text-sm text-slate-500">Trends help teams decide where a small shelter intervention can make a large difference.</p></div><div className="grid gap-5 lg:grid-cols-2"><ChartCard title="Temperature over time" subtitle="°C, last 12 hours" data={data.temperatureTrend} color="#f97316" unit="°C" type="area" /><ChartCard title="Humidity over time" subtitle="Relative humidity, last 12 hours" data={data.humidityTrend} color="#0ea5e9" unit="%" /><ChartCard title="Thermal comfort trend" subtitle="Comfort index, higher is better" data={data.comfortTrend} color="#10b981" unit="" /></div><ComparisonChart data={data.shelterComparison} /></div>
}

function ComparisonChart({ data }) {
  return <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/40"><div><h3 className="text-sm font-bold text-slate-900">Shelter condition comparison</h3><p className="mt-1 text-xs text-slate-400">Comfort score across representative designs</p></div><div className="mt-6 space-y-4">{data.map((item) => <div key={item.shelter} className="grid grid-cols-[90px_1fr_44px] items-center gap-3 text-xs"><span className="font-semibold text-slate-500">{item.shelter}</span><div className="h-2 rounded-full bg-slate-100"><div className="h-full rounded-full bg-orange-500" style={{ width: `${item.comfort}%` }} /></div><span className="text-right font-bold text-slate-800">{item.comfort}</span></div>)}</div></article>
}
