import { useState } from 'react'
import { MapPin } from 'lucide-react'
import ResultCard from '../components/ResultCard'
import ThermalForm from '../components/ThermalForm'
import { defaultAnalysisInput } from '../data/mockData'
import { runThermalAnalysis, validateThermalInput } from '../services/api'

export default function AnalysisPage() {
  const [values, setValues] = useState(defaultAnalysisInput)
  const [result, setResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  const handleChange = ({ target }) => {
    setValues((current) => ({ ...current, [target.name]: target.type === 'number' ? Number(target.value) : target.value }))
    setFieldErrors((current) => ({ ...current, [target.name]: '' }))
  }
  const handleSubmit = async (event) => {
    event.preventDefault()
    const validationErrors = validateThermalInput(values)
    if (Object.keys(validationErrors).length) {
      setFieldErrors(validationErrors)
      setResult(null)
      return
    }

    setIsLoading(true)
    setError('')
    try { setResult(await runThermalAnalysis(values)) } catch { setError('Unable to calculate this analysis. Please try again.') } finally { setIsLoading(false) }
  }
  const handleReset = () => {
    setValues(defaultAnalysisInput)
    setResult(null)
    setError('')
    setFieldErrors({})
  }

  return <div className="space-y-7"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-600">Thermal analysis</p><div className="mt-1 flex flex-wrap items-end justify-between gap-3"><div><h1 className="text-2xl font-bold tracking-tight text-slate-900">Model a shelter condition</h1><p className="mt-2 text-sm text-slate-500">Enter the local parameters to estimate comfort and heat risk.</p></div><div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400"><MapPin size={14} className="text-orange-500" />{values.location || 'Choose a region'}</div></div></div><div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]"><div><ThermalForm values={values} errors={fieldErrors} onChange={handleChange} onReset={handleReset} onSubmit={handleSubmit} isLoading={isLoading} />{error && <p className="mt-3 rounded-xl bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-700">{error}</p>}</div><ResultCard result={result} /></div></div>
}
