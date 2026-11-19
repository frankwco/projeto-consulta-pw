import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user } = useAuth();
  return (
    <header className="topbar">
      <div>
        <div className="topbar-title">Painel administrativo</div>
        <div className="muted small">Gestão integrada de clientes, estoque e vendas</div>
      </div>
      <div className="user-chip">
        <div className="avatar">{user?.name?.charAt(0)?.toUpperCase()}</div>
        <div><strong>{user?.name}</strong><span>{user?.role}</span></div>
      </div>
    </header>
  );
}
