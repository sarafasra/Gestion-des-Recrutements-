import { createContext, useState, useEffect } from 'react'
import api from '../services/api'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    const loadUser = async () => {
      if (!token) {
        setUser(null)
        setLoading(false)
        return
      }

      setLoading(true)

      try {
        const res = await api.get('/me')
        if (active) setUser(res.data)
      } catch {
        if (active) {
          localStorage.removeItem('token')
          setToken(null)
          setUser(null)
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    loadUser()

    return () => {
      active = false
    }
  }, [token])

  const login = async (email, password) => {
    const res = await api.post('/login', { email, password })

    if (!res.data?.token || !res.data?.user) {
      throw new Error('Invalid login response')
    }

    localStorage.setItem('token', res.data.token)
    setToken(res.data.token)
    setUser(res.data.user)
    setLoading(false)
    return res.data
  }

  const logout = async () => {
    try {
      await api.post('/logout')
    } catch {
      localStorage.removeItem('token')
    }
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    setLoading(false)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}