import { useState } from 'react'

export function LoginForm({ onSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL
      const body = new URLSearchParams()
      body.append('username', email)
      body.append('password', password)
      const res = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body
      })
      if (!res.ok) throw new Error('Invalid credentials')
      const data = await res.json()
      localStorage.setItem('token', data.access_token)
      const me = await fetch(`${baseUrl}/auth/me`, { headers: { Authorization: `Bearer ${data.access_token}` } })
      const user = await me.json()
      onSuccess(user)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {error && <div className="text-red-400 text-sm">{error}</div>}
      <input className="w-full px-3 py-2 rounded bg-slate-800 text-white border border-slate-700" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
      <input className="w-full px-3 py-2 rounded bg-slate-800 text-white border border-slate-700" type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />
      <button disabled={loading} className="w-full px-3 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white">{loading? 'Signing in...' : 'Sign in'}</button>
    </form>
  )
}

export function RegisterForm({ onSuccess }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL
      const res = await fetch(`${baseUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      })
      if (!res.ok) throw new Error('Registration failed')
      const user = await res.json()
      onSuccess(user)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {error && <div className="text-red-400 text-sm">{error}</div>}
      <input className="w-full px-3 py-2 rounded bg-slate-800 text-white border border-slate-700" placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} />
      <input className="w-full px-3 py-2 rounded bg-slate-800 text-white border border-slate-700" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
      <input className="w-full px-3 py-2 rounded bg-slate-800 text-white border border-slate-700" type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />
      <button disabled={loading} className="w-full px-3 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white">{loading? 'Creating account...' : 'Create account'}</button>
    </form>
  )
}
