
import { useEffect, useState } from 'react'
import api from '../services/api'

const initialForm = {
  nom: '',
  prenom: '',
  email: '',
  telephone: '',
  source: '',
  fonction: '',
  duree_stage: '',
  priorite: 'moyenne',
  cv: null,
}

function Candidates() {
  const [candidates, setCandidates] = useState([])
  const [form, setForm] = useState(initialForm)
  const [editId, setEditId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState('')
  const [priority, setPriority] = useState('all')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  async function loadCandidates() {
    try {
      const response = await api.get('/candidates')
      setCandidates(response.data)
      setError('')
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de chargement des candidats.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCandidates()
  }, [])

  function handleChange(e) {
    const { name, value, files } = e.target

    setForm({
      ...form,
      [name]: name === 'cv' ? files[0] : value,
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      const data = new FormData()

      Object.entries(form).forEach(([key, value]) => {
        if (value !== null && value !== '') {
          data.append(key, value)
        }
      })

      if (editId) {
        data.append('_method', 'PUT')
        await api.post(`/candidates/${editId}`, data)
      } else {
        await api.post('/candidates', data)
      }

      setForm(initialForm)
      setEditId(null)
      setShowForm(false)
      setError('')
      await loadCandidates()
    } catch (err) {
      const errors = err.response?.data?.errors

      setError(
        errors
          ? Object.values(errors).flat().join(' ')
          : err.response?.data?.message || 'Erreur lors de l’enregistrement.'
      )
    }
  }

  function handleEdit(candidate) {
    setForm({
      nom: candidate.nom || '',
      prenom: candidate.prenom || '',
      email: candidate.email || '',
      telephone: candidate.telephone || '',
      source: candidate.source || '',
      fonction: candidate.fonction || '',
      duree_stage: candidate.duree_stage || '',
      priorite: candidate.priorite || 'moyenne',
      cv: null,
    })

    setEditId(candidate.id)
    setShowForm(true)
  }

  async function handleDelete(id) {
    if (!window.confirm('Supprimer ce candidat ?')) return

    try {
      await api.delete(`/candidates/${id}`)
      await loadCandidates()
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la suppression.')
    }
  }

  async function handleCvDownload(candidate) {
    try {
      const response = await api.get(`/candidates/${candidate.id}/cv`, {
        responseType: 'blob',
      })
      const url = URL.createObjectURL(response.data)
      const link = document.createElement('a')
      link.href = url
      link.download = `CV-${candidate.prenom}-${candidate.nom}.${candidate.cv.split('.').pop()}`
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.setTimeout(() => URL.revokeObjectURL(url), 1000)
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du téléchargement du CV.')
    }
  }

  function cancelForm() {
    setForm(initialForm)
    setEditId(null)
    setShowForm(false)
  }

  const filteredCandidates = candidates.filter((c) => {
    const text = `${c.nom} ${c.prenom} ${c.email} ${c.fonction}`.toLowerCase()

    return (
      text.includes(search.toLowerCase()) &&
      (priority === 'all' || c.priorite === priority)
    )
  })

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-7xl p-4 md:p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Gestion des candidats
            </h1>
            <p className="mt-2 text-gray-500">
              Total : {candidates.length} candidat(s)
            </p>
          </div>

          <button
            onClick={() => {
              cancelForm()
              setShowForm(true)
            }}
            className="rounded-lg bg-violet-600 px-5 py-3 text-white hover:bg-violet-700"
          >
            + Ajouter un candidat
          </button>
        </div>

        {error && (
          <div className="mb-5 rounded-lg bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="mb-6 rounded-xl bg-white p-6 shadow"
          >
            <h2 className="mb-5 text-xl font-bold">
              {editId ? 'Modifier le candidat' : 'Nouveau candidat'}
            </h2>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <input
                name="prenom"
                value={form.prenom}
                onChange={handleChange}
                placeholder="Prénom"
                required
                className="rounded-lg border p-3"
              />

              <input
                name="nom"
                value={form.nom}
                onChange={handleChange}
                placeholder="Nom"
                required
                className="rounded-lg border p-3"
              />

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                required
                className="rounded-lg border p-3"
              />

              <input
                name="telephone"
                value={form.telephone}
                onChange={handleChange}
                placeholder="Téléphone"
                required
                className="rounded-lg border p-3"
              />

              <input
                name="source"
                value={form.source}
                onChange={handleChange}
                placeholder="Source du candidat"
                required
                className="rounded-lg border p-3"
              />

              <input
                name="fonction"
                value={form.fonction}
                onChange={handleChange}
                placeholder="Fonction recherchée"
                required
                className="rounded-lg border p-3"
              />

              <input
                name="duree_stage"
                value={form.duree_stage}
                onChange={handleChange}
                placeholder="Durée du stage"
                required
                className="rounded-lg border p-3"
              />

              <select
                name="priorite"
                value={form.priorite}
                onChange={handleChange}
                className="rounded-lg border bg-white p-3"
              >
                <option value="haute">Priorité haute</option>
                <option value="moyenne">Priorité moyenne</option>
                <option value="basse">Priorité basse</option>
              </select>

              <label className="min-w-0 text-sm font-medium text-gray-700">
                CV
                <input
                  type="file"
                  name="cv"
                  accept=".pdf,.doc,.docx"
                  onChange={handleChange}
                  className="mt-1 block w-full min-w-0 rounded-lg border p-3 text-sm"
                />
              </label>
            </div>

            <div className="mt-5 flex gap-3">
              <button
                type="submit"
                className="rounded-lg bg-violet-600 px-5 py-3 text-white"
              >
                {editId ? 'Enregistrer' : 'Ajouter'}
              </button>

              <button
                type="button"
                onClick={cancelForm}
                className="rounded-lg border px-5 py-3"
              >
                Annuler
              </button>
            </div>
          </form>
        )}

        <div className="mb-5 flex flex-wrap gap-3 rounded-xl bg-white p-4 shadow">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un candidat..."
            className="min-w-48 flex-1 rounded-lg border p-3"
          />

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="rounded-lg border bg-white p-3"
          >
            <option value="all">Toutes les priorités</option>
            <option value="haute">Haute</option>
            <option value="moyenne">Moyenne</option>
            <option value="basse">Basse</option>
          </select>
        </div>

        <div className="overflow-x-auto rounded-xl bg-white shadow">
          <table className="w-full min-w-[960px] text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-4">Candidat</th>
                <th className="p-4">Email</th>
                <th className="p-4">Téléphone</th>
                <th className="p-4">Fonction</th>
                <th className="p-4">Priorité</th>
                <th className="p-4">CV</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center">
                    Chargement...
                  </td>
                </tr>
              ) : filteredCandidates.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-gray-500">
                    Aucun candidat trouvé.
                  </td>
                </tr>
              ) : (
                filteredCandidates.map((c) => (
                  <tr key={c.id} className="border-t">
                    <td className="p-4 font-medium">
                      {c.prenom} {c.nom}
                    </td>
                    <td className="p-4">{c.email}</td>
                    <td className="p-4">{c.telephone}</td>
                    <td className="p-4">{c.fonction}</td>
                    <td className="p-4">{c.priorite}</td>
                    <td className="p-4">
                      {c.cv ? (
                        <button
                          type="button"
                          onClick={() => handleCvDownload(c)}
                          className="whitespace-nowrap font-medium text-violet-600 hover:text-violet-800"
                        >
                          Télécharger
                        </button>
                      ) : (
                        <span className="text-gray-400">Aucun CV</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleEdit(c)}
                          className="text-violet-600"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="text-red-600"
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Candidates
