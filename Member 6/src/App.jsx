import { useState } from 'react'
import { Bell, Menu, UserRound } from 'lucide-react'
import Sidebar from './components/Sidebar'
import AboutPage from './pages/AboutPage'
import AnalysisPage from './pages/AnalysisPage'
import DashboardPage from './pages/DashboardPage'
import VisualizationPage from './pages/VisualizationPage'

function App() {
  const [activePage, setActivePage] = useState('dashboard')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const navigate = (page) => {
    setActivePage(page)
    setIsSidebarOpen(false)
  }

  const pageContent = {
    dashboard: <DashboardPage onNavigate={navigate} />,
    analysis: <AnalysisPage />,
    visualization: <VisualizationPage />,
    about: <AboutPage />,
  }

  return <div className="min-h-screen bg-[#f7f8fa] text-slate-900 lg:flex"><Sidebar activePage={activePage} onNavigate={navigate} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} /><main className="min-w-0 flex-1"><header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white/90 px-5 backdrop-blur sm:px-8"><button onClick={() => setIsSidebarOpen(true)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden" aria-label="Open navigation"><Menu size={21} /></button><div className="hidden lg:block"><p className="text-sm font-bold text-slate-900">Good afternoon, team</p><p className="mt-0.5 text-xs text-slate-400">Monitor today's shelter conditions</p></div><div className="ml-auto flex items-center gap-3"><button className="relative rounded-lg p-2 text-slate-400 hover:bg-slate-100" aria-label="Notifications"><Bell size={19} /><span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-orange-500" /></button><span className="hidden h-6 w-px bg-slate-200 sm:block" /><div className="flex items-center gap-2"><span className="grid h-8 w-8 place-items-center rounded-full bg-orange-100 text-orange-700"><UserRound size={16} /></span><span className="hidden text-xs font-bold text-slate-600 sm:block">Project team</span></div></div></header><div className="mx-auto max-w-[1500px] p-5 sm:p-8">{pageContent[activePage]}</div></main></div>
}

export default App
