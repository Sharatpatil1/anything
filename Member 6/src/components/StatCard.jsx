import { ArrowDownRight, ArrowUpRight, Thermometer, Waves, Wind, ShieldCheck } from 'lucide-react'

const iconMap = {
  orange: { icon: Thermometer, className: 'bg-orange-50 text-orange-600' },
  blue: { icon: Waves, className: 'bg-sky-50 text-sky-600' },
  green: { icon: ShieldCheck, className: 'bg-emerald-50 text-emerald-600' },
  yellow: { icon: Wind, className: 'bg-amber-50 text-amber-600' },
}

export default function StatCard({ label, value, unit, detail, tone, trend }) {
  const { icon: Icon, className } = iconMap[tone]
  const TrendIcon = trend === 'down' ? ArrowDownRight : ArrowUpRight

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/40">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <span className={`grid h-10 w-10 place-items-center rounded-xl ${className}`}><Icon size={19} /></span>
      </div>
      <div className="mt-5 flex items-end gap-1.5">
        <span className="text-2xl font-bold tracking-tight text-slate-900">{value}</span>
        {unit && <span className="pb-0.5 text-sm font-medium text-slate-400">{unit}</span>}
      </div>
      <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
        {trend && <TrendIcon size={14} className={trend === 'down' ? 'text-emerald-600' : 'text-orange-500'} />}
        <span>{detail}</span>
      </div>
    </article>
  )
}
