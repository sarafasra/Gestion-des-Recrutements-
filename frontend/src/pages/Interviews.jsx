import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import AdminHeader from '../components/AdminHeader'
import api from '../services/api'

const emptyForm = {
  candidate_id: '',
  responsable_id: '',
  type: 'presentiel',
  lieu_lien: '',
  date_heure: '',
  statut: 'planifiee',
  resultat: '',
}

export default function Interviews() {
  const { user } = useContext(AuthContext)
  const [interviews, setInterviews] = useState([])
  const [candidates, setCandidates] = useState([])
  const [rhUsers, setRhUsers] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function fetchData() {
    const [interviewsResponse, candidatesResponse, usersResponse] = await Promise.all([
        api.get('/interviews'),
        api.get('/candidates'),
        api.get('/rh-users'),
      ])

    return {
      interviews: interviewsResponse.data,
      candidates: candidatesResponse.data,
      rhUsers: usersResponse.data,
    }
  }

  function setData(data) {
    setInterviews(data.interviews)
    setCandidates(data.candidates)
    setRhUsers(data.rhUsers)
    setError('')
  }

  async function loadData() {
    try {
      setData(await fetchData())
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du chargement des entretiens.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let active = true

    fetchData()
      .then((data) => {
        if (active) setData(data)
      })
      .catch((err) => {
        if (active) {
          setError(err.response?.data?.message || 'Erreur lors du chargement des entretiens.')
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  function handleCreate() {
    setEditingId(null)
    setForm({
      ...emptyForm,
      responsable_id: user?.role === 'rh'
        ? String(user.id)
        : String(rhUsers[0]?.id || ''),
    })
    setShowForm(true)
  }

  function handleEdit(interview) {
    setEditingId(interview.id)
    setForm({
      candidate_id: String(interview.candidate_id),
      responsable_id: String(interview.responsable_id || ''),
      type: interview.type || 'presentiel',
      lieu_lien: interview.lieu_lien || '',
      date_heure: interview.date_heure ? interview.date_heure.slice(0, 16) : '',
      statut: interview.statut || 'planifiee',
      resultat: interview.resultat || '',
    })
    setShowForm(true)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    try {
      if (editingId) {
        await api.put(`/interviews/${editingId}`, form)
      } else {
        await api.post('/interviews', form)
      }

      setForm(emptyForm)
      setEditingId(null)
      setShowForm(false)
      await loadData()
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l’enregistrement de l’entretien.')
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Supprimer cet entretien ?')) return

    try {
      await api.delete(`/interviews/${id}`)
      await loadData()
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la suppression de l’entretien.')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {user?.role === 'admin' && <AdminHeader />}
      <main className="mx-auto max-w-7xl p-6 md:p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Gestion des entretiens</h1>
            <p className="mt-2 text-slate-500">Planifiez et gérez les entretiens candidats.</p>
          </div>
          <button
            onClick={handleCreate}
            className="rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
          >
            + Ajouter un entretien
          </button>
        </div>

        {error && <div className="mb-5 rounded-lg bg-red-50 p-4 text-red-700">{error}</div>}

        {showForm && (
          <form onSubmit={handleSubmit} className="mb-6 grid gap-4 rounded-xl bg-white p-6 shadow md:grid-cols-2">
            <select
              name="candidate_id"
              value={form.candidate_id}
              onChange={handleChange}
              required
              className="rounded-lg border p-3"
            >
              <option value="">Choisir un candidat</option>
              {candidates.map((candidate) => (
                <option key={candidate.id} value={candidate.id}>
                  {candidate.prenom} {candidate.nom}
                </option>
              ))}
            </select>
            <select
              name="responsable_id"
              value={form.responsable_id}
              onChange={handleChange}
              required
              className="rounded-lg border p-3"
            >
              <option value="">Choisir un responsable RH</option>
              {rhUsers.map((rh) => (
                <option key={rh.id} value={rh.id}>{rh.name}</option>
              ))}
            </select>
            <select name="type" value={form.type} onChange={handleChange} className="rounded-lg border p-3">
              <option value="presentiel">Présentiel</option>
              <option value="en_ligne">En ligne</option>
            </select>
            <input
              name="lieu_lien"
              value={form.lieu_lien}
              onChange={handleChange}
              placeholder="Lieu ou lien"
              required
              className="rounded-lg border p-3"
            />
            <input
              type="datetime-local"
              name="date_heure"
              value={form.date_heure}
              onChange={handleChange}
              required
              className="rounded-lg border p-3"
            />
            <select name="statut" value={form.statut} onChange={handleChange} className="rounded-lg border p-3">
              <option value="planifiee">Planifiée</option>
              <option value="en_attente">En attente</option>
              <option value="accepte">Acceptée</option>
              <option value="refuse">Refusée</option>
              <option value="annule">Annulée</option>
            </select>
            <textarea
              name="resultat"
              value={form.resultat}
              onChange={handleChange}
              placeholder="Résultat (facultatif)"
              className="rounded-lg border p-3 md:col-span-2"
            />
            <div className="flex gap-3 md:col-span-2">
              <button type="submit" className="rounded-lg bg-indigo-600 px-5 py-3 text-white">
                {editingId ? 'Enregistrer' : 'Ajouter'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingId(null)
                  setForm(emptyForm)
                }}
                className="rounded-lg border px-5 py-3"
              >
                Annuler
              </button>
            </div>
          </form>
        )}

        <div className="overflow-x-auto rounded-xl bg-white shadow">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="bg-slate-100 text-slate-600">
              <tr>
                <th className="p-4">Candidat</th>
                <th className="p-4">Date</th>
                <th className="p-4">Type</th>
                <th className="p-4">Statut</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="p-8 text-center">Chargement...</td></tr>
              ) : interviews.length === 0 ? (
                <tr><td colSpan="5" className="p-8 text-center text-slate-500">Aucun entretien trouvé.</td></tr>
              ) : interviews.map((interview) => (
                <tr key={interview.id} className="border-t">
                  <td className="p-4">
                    {interview.candidate?.prenom} {interview.candidate?.nom}
                  </td>
                  <td className="p-4">{interview.date_heure}</td>
                  <td className="p-4">{interview.type}</td>
                  <td className="p-4">{interview.statut}</td>
                  <td className="p-4">
                    <div className="flex gap-3">
                      <button onClick={() => handleEdit(interview)} className="text-indigo-600">
                        Modifier
                      </button>
                      <button onClick={() => handleDelete(interview.id)} className="text-red-600">
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
