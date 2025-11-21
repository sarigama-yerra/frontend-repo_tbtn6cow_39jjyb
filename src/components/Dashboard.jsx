import { useEffect, useState } from 'react'
import TaskCard from './TaskCard'

const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function Dashboard() {
  const [userEmail, setUserEmail] = useState('demo@example.com')
  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(false)
  const [wallet, setWallet] = useState(0)
  const [banner, setBanner] = useState(null)

  const fetchWallet = async (email) => {
    try {
      const res = await fetch(`${baseUrl}/api/users/${encodeURIComponent(email)}/wallet`)
      if (res.ok) {
        const data = await res.json()
        setWallet(data.wallet_balance_cents)
      }
    } catch (e) { /* ignore */ }
  }

  useEffect(() => {
    // seed demo data once on load
    fetch(`${baseUrl}/api/seed`, { method: 'POST' }).catch(() => {})
    fetchWallet(userEmail)
  }, [])

  const handleStart = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${baseUrl}/api/tasks/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_email: userEmail })
      })
      if (!res.ok) throw new Error('No tasks available')
      const t = await res.json()
      setTask(t)
    } catch (e) {
      setBanner({ type: 'error', text: e.message })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (choice) => {
    setLoading(true)
    try {
      const res = await fetch(`${baseUrl}/api/tasks/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_email: userEmail, task_id: task.task_id, choice })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Submit failed')

      setBanner({ type: 'success', text: `Task completed! ${(task.reward_cents/100).toFixed(2)} has been added to your wallet.` })

      // Refresh wallet and auto-load next task
      await fetchWallet(userEmail)
      const nextRes = await fetch(`${baseUrl}/api/tasks/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_email: userEmail })
      })
      if (nextRes.ok) {
        const nextTask = await nextRes.json()
        setTask(nextTask)
      } else {
        setTask(null)
      }
    } catch (e) {
      setBanner({ type: 'error', text: e.message })
    } finally {
      setLoading(false)
      setTimeout(() => setBanner(null), 2500)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 -mt-20 md:-mt-24">
      <div className="bg-slate-800/40 border border-blue-500/20 rounded-2xl p-4 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold">{userEmail[0].toUpperCase()}</div>
          <div>
            <p className="text-white text-sm">Signed in as</p>
            <p className="text-blue-100 text-sm font-medium">{userEmail}</p>
          </div>
        </div>
        <div className="text-white text-sm">Wallet: <span className="font-semibold">${(wallet/100).toFixed(2)}</span></div>
      </div>

      {banner && (
        <div className={`mb-4 px-4 py-3 rounded-xl text-sm ${banner.type === 'success' ? 'bg-emerald-500/15 text-emerald-200 border border-emerald-400/20' : 'bg-rose-500/15 text-rose-200 border border-rose-400/20'}`}>
          {banner.text}
        </div>
      )}

      <TaskCard task={task} onStart={handleStart} onSubmit={handleSubmit} loading={loading} walletCents={wallet} />
    </div>
  )
}
