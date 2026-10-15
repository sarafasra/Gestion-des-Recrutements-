import { useState, useEffect } from 'react'
import AdminHeader from '../../components/AdminHeader'
import api from '../../services/api'

export default function AdminDashboard() {
  const [data, setData] = useState({ stats: {}, candidates: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchSupervisionData = async () => {
      try {
        const res = await api.get('/admin/supervision')
        setData({
          stats: res.data.stats || {},
          candidates: Array.isArray(res.data.candidates) ? res.data.candidates : [],
        })
      } catch (err) {
        setError(err.response?.data?.message || 'Erreur lors du chargement des données de supervision.')
      } finally {
        setLoading(false)
      }
    }

    fetchSupervisionData()
  }, [])

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminHeader />

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
                Suivi Général des Candidatures 
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
                          <td className="px-6 py-4 font-medium text-slate-900">{c.prenom} {c.nom}</td>
                          <td className="px-6 py-4">{c.fonction}</td>
                          <td className="px-6 py-4">{c.source}</td>
                          <td className="px-6 py-4">
                            <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                              {c.interviews?.[0]?.statut || 'Planifié'}
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