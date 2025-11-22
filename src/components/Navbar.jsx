import { Link, useNavigate } from 'react-router-dom'

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate()
  const handleLogout = () => {
    onLogout()
    navigate('/')
  }
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/60 bg-slate-900/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src="/flame-icon.svg" className="w-7 h-7" alt="logo" />
          <span className="text-white font-semibold">HabitPilot</span>
        </Link>
        <nav className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-blue-200/80">{user.email} · {user.plan === 'pro' ? 'Pro' : 'Free'}</span>
              <Link to="/dashboard" className="px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-500 transition">Dashboard</Link>
              <button onClick={handleLogout} className="px-3 py-1.5 rounded bg-slate-700 text-white hover:bg-slate-600 transition">Log out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-3 py-1.5 rounded bg-slate-700 text-white hover:bg-slate-600 transition">Log in</Link>
              <Link to="/register" className="px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-500 transition">Get started</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
