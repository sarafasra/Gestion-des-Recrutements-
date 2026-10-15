import { useState, useEffect } from 'react'
import AdminHeader from '../../components/AdminHeader'
import api from '../../services/api'

export default function UserManagement() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null) 

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('rh')

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users')
      setUsers(res.data)
    } catch (err) {
      setError('Erreur lors du chargement des utilisateurs.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleOpenCreateModal = () => {
    setEditingUser(null)
    setName('')
    setEmail('')
    setPassword('')
    setRole('rh')
    setShowModal(true)
  }

  const handleOpenEditModal = (u) => {
    setEditingUser(u)
    setName(u.name)
    setEmail(u.email)
    setPassword('') 
    setRole(u.role || 'rh')
    setShowModal(true)
  }

  const handleSubmitUser = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (editingUser) {
        const payload = { name, email, role }
        if (password) payload.password = password 

        await api.put(`/users/${editingUser.id}`, payload)
      } else {
        await api.post('/users', { name, email, password, role })
      }

      setShowModal(false)
      fetchUsers()
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'enregistrement.')
    }
  }

  const handleDeleteUser = async (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) {
      try {
        await api.delete(`/users/${id}`)
        fetchUsers()
      } catch (err) {
        alert('Impossible de supprimer cet utilisateur.')
      }
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminHeader />

      <div className="mx-auto max-w-6xl p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Gestion des Utilisateurs</h1>
            <p className="text-slate-500">Ajoutez, gérez et supervisez les comptes de la plateforme.</p>
          </div>
          <button
            onClick={handleOpenCreateModal}
            className="rounded-lg bg-indigo-600 px-5 py-2.5 font-semibold text-white transition hover:bg-indigo-700"
          >
            + Ajouter un Utilisateur
          </button>
        </div>

        {error && <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-600 border border-red-200">{error}</div>}

        {loading ? (
          <p className="text-slate-600">Chargement...</p>
        ) : (
          <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-slate-200">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-100 text-xs uppercase text-slate-700">
                <tr>
                  <th className="px-6 py-4">Nom</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Rôle</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">{u.name}</td>
                    <td className="px-6 py-4">{u.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                          u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {u.role ? u.role.toUpperCase() : 'RH'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <button
                        onClick={() => handleOpenEditModal(u)}
                        className="font-semibold text-indigo-600 hover:underline"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="font-semibold text-red-600 hover:underline"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 p-4 z-50">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
              <h2 className="mb-4 text-xl font-bold text-slate-800">
                {editingUser ? 'Modifier l\'Utilisateur' : 'Ajouter un Utilisateur'}
              </h2>
              <form onSubmit={handleSubmitUser} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Nom Complet</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Adresse Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Mot de passe {editingUser && '(Laissez vide si inchangé)'}
                  </label>
                  <input
                    type="password"
                    required={!editingUser}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Rôle</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-indigo-500"
                  >
                    <option value="rh">RH</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="rounded-lg bg-slate-200 px-4 py-2 text-slate-700 hover:bg-slate-300"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700"
                  >
                    {editingUser ? 'Enregistrer les modifications' : 'Créer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}