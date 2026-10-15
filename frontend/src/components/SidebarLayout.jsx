import { useContext } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

const adminLinks = [
  { to: '/admin/dashboard', label: 'Dashboard / Supervision' },
  { to: '/admin/users', label: 'Gestion Utilisateurs' },
  { to: '/candidates', label: 'Candidats' },
  { to: '/interviews', label: 'Entretiens' },
]

const rhLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/candidates', label: 'Candidats' },
  { to: '/interviews', label: 'Entretiens' },
]

export default function SidebarLayout() {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const links = user?.role === 'admin' ? adminLinks : rhLinks

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      <aside className="flex w-full flex-col bg-white px-5 py-6 shadow-sm md:fixed md:inset-y-0 md:left-0 md:w-64">
        <h1 className="mb-6 text-2xl font-extrabold tracking-tight text-violet-700">
          Recrut<span className="text-slate-800">Pro</span>
        </h1>

        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
          Menu principal
        </p>
        <nav className="flex gap-2 overflow-x-auto md:flex-col">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end
              className={({ isActive }) =>
                `shrink-0 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? 'bg-violet-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-violet-50 hover:text-violet-700'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-left font-semibold text-red-700 transition hover:bg-red-100 md:mt-auto"
        >
          Déconnexion
        </button>
      </aside>

      <div className="min-w-0 flex-1 md:ml-64">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 shadow-sm md:px-8">
          <h2 className="text-lg font-semibold text-slate-800">
            {user?.role === 'admin' ? 'Espace Admin' : 'Espace RH'}
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-700">
              {user?.name || (user?.role === 'admin' ? 'Administrateur' : 'Responsable RH')}
            </span>
            <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-700">
              {user?.role?.toUpperCase()}
            </span>
          </div>
        </header>

        <main className="min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
