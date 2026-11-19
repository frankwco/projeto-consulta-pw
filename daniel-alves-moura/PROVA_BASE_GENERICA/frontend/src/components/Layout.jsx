import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Layout() {
  const { usuario, logout } = useAuth()

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">PROVA<span>BASE</span></div>
        <nav>
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/registros">Registros</NavLink>
        </nav>
        <div className="sidebar-footer">
          <small>{usuario?.nome}</small>
          <button className="btn btn-ghost" onClick={logout}>Sair</button>
        </div>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}
