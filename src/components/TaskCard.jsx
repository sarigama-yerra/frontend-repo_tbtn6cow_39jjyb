import { useState } from 'react'

export default function TaskCard({ task, onStart, onSubmit, loading, walletCents }) {
  const [choice, setChoice] = useState(null)

  const fmt = (cents) => `$${(cents / 100).toFixed(2)}`

  return (
    <div className="bg-slate-800/60 border border-blue-500/20 rounded-2xl shadow-xl overflow-hidden">
      {task?.image_url && (
        <div className="aspect-[16/9] w-full overflow-hidden">
          <img src={task.image_url} alt={task.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="p-5 md:p-6">
        <div className="flex items-center justify-between gap-4 mb-3">
          <h3 className="text-white font-semibold text-lg">{task ? task.title : 'Your next task is ready'}</h3>
          <span className="text-emerald-300 text-sm font-medium bg-emerald-500/10 border border-emerald-400/20 rounded-full px-3 py-1">{fmt(task?.reward_cents ?? 30)}</span>
        </div>
        {task ? (
          <>
            <p className="text-blue-200/80 text-sm">{task.property_type} • ${task.price} • {task.location}</p>
            <p className="text-blue-200/80 text-sm mt-2">{task.instructions}</p>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { key: 'active', label: 'Appears to be still active', icon: '✅' },
                { key: 'inactive', label: 'No longer active', icon: '🚫' },
                { key: 'unknown', label: 'Unable to determine', icon: '❓' },
              ].map(opt => (
                <button
                  key={opt.key}
                  onClick={() => setChoice(opt.key)}
                  className={`text-left px-4 py-3 rounded-xl border transition ${choice === opt.key ? 'bg-blue-500/20 border-blue-400/40 text-white' : 'bg-slate-900/40 border-blue-400/20 text-blue-100/90 hover:border-blue-300/30'}`}
                >
                  <span className="mr-2">{opt.icon}</span>{opt.label}
                </button>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-3">
              <button
                disabled={!choice || loading}
                onClick={() => onSubmit(choice)}
                className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-medium"
              >
                {loading ? 'Submitting...' : 'Submit'}
              </button>
              <p className="text-blue-200/70 text-sm">Wallet: <span className="text-white font-semibold">{fmt(walletCents)}</span></p>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-between">
            <p className="text-blue-200/80">Start your next verification task.</p>
            <button
              onClick={onStart}
              className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium"
            >
              Start Task
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
