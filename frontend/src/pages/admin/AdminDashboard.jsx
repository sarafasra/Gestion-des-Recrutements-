import { useState, useEffect, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import api from '../../services/api'

export default function AdminDashboard() {
  const [data, setData] = useState({ stats: {}, candidates: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchSupervisionData = async () => {
      try {
        const res = await api.get('/admin/supervision')
        setData(res.data)
      } catch (err) {
        setError('Erreur lors du chargement des données de supervision.')
      } finally {
        setLoading(false)
      }
    }

    fetchSupervisionData()
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="border-b border-slate-200 bg-white px-8 py-4 shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center space-x-6">
            <span className="text-xl font-bold text-indigo-700">RecrutPro</span>
            <div className="flex space-x-4">
              <Link
                to="/admin/dashboard"
                className="rounded-lg bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700"
              >
                Supervision Globale
              </Link>
              <Link
                to="/admin/users"
                className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
              >
                Gestion Utilisateurs
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-slate-700">{user?.name}</span>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Se déconnecter
            </button>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Tableau de Bord — Supervision</h1>
          <p className="text-slate-500">Aperçu en lecture seule sur l'avancement des recrutements et statistiques.</p>
        </div>

        {error && <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-600 border border-red-200">{error}</div>}

        {loading ? (
          <p className="text-slate-600">Chargement des données...</p>
        ) : (
          <>
            <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-medium text-slate-500">Utilisateurs Totaux</p>
                <p className="mt-2 text-3xl font-bold text-slate-800">{data.stats?.total_users || 0}</p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-medium text-slate-500">Comptes RH</p>
                <p className="mt-2 text-3xl font-bold text-indigo-600">{data.stats?.total_rh || 0}</p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-medium text-slate-500">Candidats Enregistrés</p>
                <p className="mt-2 text-3xl font-bold text-emerald-600">{data.stats?.total_candidates || 0}</p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-medium text-slate-500">Entretiens Planifiés</p>
                <p className="mt-2 text-3xl font-bold text-purple-600">{data.stats?.total_interviews || 0}</p>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-bold text-slate-800">
                Suivi Général des Candidatures (Lecture Seule)
              </h2>

              {data.candidates.length === 0 ? (
                <p className="py-6 text-center text-sm text-slate-500">
                  Aucun candidat enregistré pour le moment.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-100 text-xs uppercase text-slate-700">
                      <tr>
                        <th className="px-6 py-4">Nom Candidat</th>
                        <th className="px-6 py-4">Poste Visé</th>
                        <th className="px-6 py-4">Source</th>
                        <th className="px-6 py-4">Statut Entretien</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {data.candidates.map((c) => (
                        <tr key={c.id} className="hover:bg-slate-50">
                          <td className="px-6 py-4 font-medium text-slate-900">{c.name}</td>
                          <td className="px-6 py-4">{c.position}</td>
                          <td className="px-6 py-4">{c.source}</td>
                          <td className="px-6 py-4">
                            <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                              {c.status || 'Planifié'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}