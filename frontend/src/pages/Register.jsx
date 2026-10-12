
import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  })

  const [message, setMessage] = useState('')

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    })
  }

  
async function handleSubmit(event) {
  event.preventDefault()
  setMessage('')

  if (form.password !== form.password_confirmation) {
    setMessage('Les mots de passe ne correspondent pas.')
    return
  }

  try {
    const response = await api.post('/register', form)

    setMessage(response.data.message)

    setForm({
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
    })
  } catch (error) {
    if (error.response?.status === 422) {
      const errors = error.response.data.errors

      setMessage(
        Object.values(errors).flat().join(' ')
      )
    } else {
      setMessage(
        'Une erreur est survenue. Vérifiez que le serveur Laravel est démarré.'
      )
    }
  }
}

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-indigo-700">
            RecrutPro
          </h1>

          <h2 className="mt-5 text-2xl font-bold text-slate-800">
            Créer un compte
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Créez votre compte pour accéder à la plateforme.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Nom complet
            </label>

            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Entrez votre nom"
              autoComplete="name"
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Adresse e-mail
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="exemple@email.com"
              autoComplete="email"
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Mot de passe
            </label>

            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Minimum 8 caractères"
              autoComplete="new-password"
              minLength={8}
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label
              htmlFor="password_confirmation"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Confirmer le mot de passe
            </label>

            <input
              id="password_confirmation"
              name="password_confirmation"
              type="password"
              value={form.password_confirmation}
              onChange={handleChange}
              placeholder="Confirmez votre mot de passe"
              autoComplete="new-password"
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {message && (
            <p role="status" className="rounded-lg bg-indigo-50 p-3 text-sm text-indigo-700">
              {message}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700"
          >
            Créer mon compte
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Vous avez déjà un compte ?{' '}
          <Link
            to="/login"
            className="font-semibold text-indigo-600 hover:underline"
          >
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register