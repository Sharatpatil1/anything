export default function DataState({ kind, message }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm font-semibold text-slate-500">
      {kind === 'loading' ? 'Loading data...' : message}
    </div>
  )
}
