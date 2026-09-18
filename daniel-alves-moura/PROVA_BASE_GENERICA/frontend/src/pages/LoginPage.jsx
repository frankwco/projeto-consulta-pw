import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { login, autenticado } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('admin@prova.com')
  const [senha, setSenha] = useState('Admin123!')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  if (autenticado) return <Navigate to="/dashboard" replace />

  async function submit(e) {
    e.preventDefault()
    setErro('')
    setCarregando(true)
    try {
      await login(email, senha)
      navigate('/dashboard')
    } catch (err) {
      setErro(err.response?.data?.erro || 'Não foi possível entrar')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={submit}>
        <div className="brand dark">PROVA<span>BASE</span></div>
        <h1>Entrar</h1>
        <p>Base genérica para adaptar durante a prova.</p>
        {erro && <div className="alert error">{erro}</div>}
        <label>E-mail
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </label>
        <label>Senha
          <input type="password" value={senha} onChange={e => setSenha(e.target.value)} required />
        </label>
        <button className="btn btn-primary wide" disabled={carregando}>
          {carregando ? 'Entrando...' : 'Entrar'}
        </button>
        <small>admin@prova.com / Admin123!</small>
      </form>
    </div>
  )
}
