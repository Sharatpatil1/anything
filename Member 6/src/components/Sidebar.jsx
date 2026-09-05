import { Activity, BarChart3, ChevronRight, LayoutDashboard, Menu, Settings2, Shield, X } from 'lucide-react'

const navigation = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'analysis', label: 'Thermal Analysis', icon: Activity },
  { id: 'visualization', label: 'Visualization', icon: BarChart3 },
  { id: 'about', label: 'About Project', icon: Shield },
]

export default function Sidebar({ activePage, onNavigate, isOpen, onClose }) {
  return (
    <>
      {isOpen && <button className="fixed inset-0 z-30 bg-slate-950/30 lg:hidden" onClick={onClose} aria-label="Close menu" />}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-200 bg-white px-5 py-6 transition-transform duration-200 lg:static lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-950 text-orange-300"><ThermalMark /></span>
            <div><p className="text-sm font-bold tracking-tight text-slate-900">THERMAL<span className="text-orange-500">SENSE</span></p><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Area comfort intelligence</p></div>
          </div>
          <button className="text-slate-400 lg:hidden" onClick={onClose} aria-label="Close sidebar"><X size={20} /></button>
        </div>

        <div className="mt-12"><p className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Workspace</p><nav className="mt-3 space-y-1">{navigation.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => onNavigate(id)} className={`group flex w-full items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold transition ${activePage === id ? 'bg-slate-950 text-white shadow-lg shadow-slate-950/10' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}><span className="flex items-center gap-3"><Icon size={18} strokeWidth={activePage === id ? 2.3 : 1.8} />{label}</span>{activePage === id && <ChevronRight size={15} className="text-orange-300" />}</button>)}</nav></div>
        <div className="mt-auto rounded-2xl bg-orange-50 p-4"><div className="flex items-center gap-2 text-orange-700"><Settings2 size={16} /><span className="text-xs font-bold">Demo environment</span></div><p className="mt-2 text-xs leading-5 text-orange-900/60">Using representative local readings until the project API is connected.</p></div>
      </aside>
    </>
  )
}

function ThermalMark() {
  return <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M10 2v10.2a3.2 3.2 0 1 0 2 0V2a2 2 0 0 0-4 0v10.2a3.2 3.2 0 1 0 2 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><path d="M10 4v8" stroke="#fb923c" strokeWidth="1.8" strokeLinecap="round" /></svg>
}

export { Menu }
