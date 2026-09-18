import { createContext, useContext, useMemo, useState } from 'react'
import api from '../api/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const salvo = localStorage.getItem('usuario')
    return salvo ? JSON.parse(salvo) : null
  })

  async function login(email, senha) {
    const { data } = await api.post('/auth/login', { email, senha })
    localStorage.setItem('token', data.token)
    const user = { nome: data.nome, email: data.email, role: data.role }
    localStorage.setItem('usuario', JSON.stringify(user))
    setUsuario(user)
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    setUsuario(null)
  }

  const value = useMemo(() => ({
    usuario,
    autenticado: Boolean(usuario && localStorage.getItem('token')),
    login,
    logout
  }), [usuario])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
