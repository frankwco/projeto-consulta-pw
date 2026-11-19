import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Boxes } from 'lucide-react';
import { apiErrorMessage } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: 'admin@nexuserp.com', password: 'Admin123!' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  const submit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      await login(form.email, form.password);
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
    } catch (err) { setError(apiErrorMessage(err)); }
    finally { setLoading(false); }
  };

  return (
    <div className="login-page">
      <div className="login-panel">
        <div className="brand login-brand"><Boxes size={30} /><span>NexusERP</span></div>
        <h1>Bem-vindo</h1>
        <p className="muted">Entre para acessar o painel administrativo.</p>
        {error && <div className="alert error">{error}</div>}
        <form onSubmit={submit} className="form-grid one-col">
          <label>E-mail<input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required /></label>
          <label>Senha<input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required /></label>
          <button className="btn primary full" disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</button>
        </form>
        <div className="demo-box"><strong>Conta de demonstração</strong><span>admin@nexuserp.com / Admin123!</span></div>
      </div>
      <div className="login-hero"><div><h2>Projeto completo para revisão full stack.</h2><p>React, Java 21, Spring Boot, JWT, JPA, MySQL e arquitetura em camadas.</p></div></div>
    </div>
  );
}
