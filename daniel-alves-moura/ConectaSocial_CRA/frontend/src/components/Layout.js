import React from 'react';
import { Home, Search, LogOut, Shield, UserRound } from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Avatar from './Avatar';

export default function Layout() {
  const { user, logout } = useAuth(); const nav = useNavigate();
  function sair(){ logout(); nav('/login'); }
  return <div className="shell">
    <aside className="sidebar">
      <div className="brand">Conecta<span>Social</span></div>
      <nav>
        <NavLink to="/" end><Home size={20}/> Feed</NavLink>
        <NavLink to="/explore"><Search size={20}/> Explorar</NavLink>
        <NavLink to={`/u/${user.username}`}><UserRound size={20}/> Perfil</NavLink>
        {user.role === 'ADMIN' && <NavLink to="/dashboard"><Shield size={20}/> Dashboard</NavLink>}
      </nav>
      <div className="sidebar-user"><Avatar user={user}/><div><strong>{user.displayName}</strong><small>@{user.username}</small></div></div>
      <button className="ghost danger" onClick={sair}><LogOut size={18}/> Sair</button>
    </aside>
    <main className="main"><Outlet /></main>
  </div>;
}
