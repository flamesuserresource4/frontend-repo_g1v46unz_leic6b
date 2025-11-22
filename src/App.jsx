import { useEffect, useState } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import { LoginForm, RegisterForm } from './components/AuthForms'
import Dashboard from './components/Dashboard'

function Home() {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.08),transparent_40%)]"/>
      <div className="relative max-w-5xl mx-auto px-6 py-20 text-center">
        <img src="/flame-icon.svg" alt="logo" className="w-20 h-20 mx-auto mb-6"/>
        <h1 className="text-5xl font-bold text-white mb-4">HabitPilot</h1>
        <p className="text-blue-200/90 text-lg max-w-2xl mx-auto">A simple habit-tracking SaaS with accounts, payments, and a clean dashboard. Create habits, log completions, and upgrade when you need more.</p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link to="/register" className="px-5 py-2.5 rounded bg-blue-600 hover:bg-blue-500 text-white">Get started free</Link>
          <Link to="/login" className="px-5 py-2.5 rounded bg-slate-700 hover:bg-slate-600 text-white">I already have an account</Link>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()
  const baseUrl = import.meta.env.VITE_BACKEND_URL

  const fetchMe = async () => {
    const token = localStorage.getItem('token')
    if (!token) return
    const res = await fetch(`${baseUrl}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
    if (res.ok) setUser(await res.json())
  }

  useEffect(() => { fetchMe() }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <Navbar user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<div className="max-w-md mx-auto px-6 py-12"><h2 className="text-2xl font-semibold mb-6">Welcome back</h2><LoginForm onSuccess={(u)=>{ setUser(u); navigate('/dashboard') }} /></div>} />
        <Route path="/register" element={<div className="max-w-md mx-auto px-6 py-12"><h2 className="text-2xl font-semibold mb-6">Create your account</h2><RegisterForm onSuccess={()=>{ navigate('/login') }} /></div>} />
        <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <div className="max-w-md mx-auto px-6 py-12"><p className="text-blue-200/80">Please sign in to access your dashboard.</p><div className="mt-4 flex gap-3"><Link className="px-4 py-2 rounded bg-blue-600 text-white" to="/login">Sign in</Link><Link className="px-4 py-2 rounded bg-slate-700 text-white" to="/register">Create account</Link></div></div>} />
      </Routes>
    </div>
  )
}
