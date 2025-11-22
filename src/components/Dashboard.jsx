import { useEffect, useState } from 'react'

export default function Dashboard({ user }) {
  const [habits, setHabits] = useState([])
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const baseUrl = import.meta.env.VITE_BACKEND_URL

  const fetchHabits = async () => {
    const token = localStorage.getItem('token')
    const res = await fetch(`${baseUrl}/habits`, { headers: { Authorization: `Bearer ${token}` } })
    if (res.ok) setHabits(await res.json())
  }

  useEffect(() => { fetchHabits() }, [])

  const addHabit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const token = localStorage.getItem('token')
    const res = await fetch(`${baseUrl}/habits`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name, frequency: 'daily' })
    })
    setLoading(false)
    if (res.ok) {
      setName('')
      fetchHabits()
    }
  }

  const upgrade = async () => {
    const token = localStorage.getItem('token')
    const res = await fetch(`${baseUrl}/billing/create-checkout-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({})
    })
    const data = await res.json()
    if (data.url) window.location.href = data.url
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl text-white font-semibold">Welcome back, {user.name.split(' ')[0]}</h2>
        {user.plan !== 'pro' && (
          <button onClick={upgrade} className="px-4 py-2 rounded bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold">Upgrade to Pro</button>
        )}
      </div>

      <form onSubmit={addHabit} className="bg-slate-800/60 border border-slate-700 rounded p-4 flex gap-3 mb-6">
        <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Add a new habit (e.g., Read 20 mins)" className="flex-1 px-3 py-2 rounded bg-slate-900 text-white border border-slate-700" />
        <button disabled={loading || !name} className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white">{loading? 'Adding...' : 'Add'}</button>
      </form>

      <div className="grid sm:grid-cols-2 gap-4">
        {habits.map(h => (
          <div key={h.id} className="bg-slate-800/60 border border-slate-700 rounded p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-semibold">{h.name}</h3>
                <p className="text-blue-200/70 text-sm">{h.frequency} • Streak {h.streak}</p>
              </div>
              <button onClick={async ()=>{
                const token = localStorage.getItem('token')
                await fetch(`${baseUrl}/habits/log`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ habit_id: h.id, date: new Date().toISOString().slice(0,10) }) })
                fetchHabits()
              }} className="px-3 py-1.5 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold">Complete today</button>
            </div>
          </div>
        ))}
        {habits.length === 0 && (
          <div className="text-center text-blue-200/70">No habits yet. Add your first one above.</div>
        )}
      </div>
    </div>
  )
}
