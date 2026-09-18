import { NavLink } from 'react-router-dom';
import { Boxes, ChartNoAxesCombined, FolderTree, LogOut, Package, ShoppingCart, Users, UserRoundCog } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: ChartNoAxesCombined },
  { to: '/customers', label: 'Clientes', icon: Users },
  { to: '/products', label: 'Produtos', icon: Package },
  { to: '/categories', label: 'Categorias', icon: FolderTree },
  { to: '/orders', label: 'Pedidos', icon: ShoppingCart },
];

export default function Sidebar() {
  const { logout, isAdmin } = useAuth();
  return (
    <aside className="sidebar">
      <div className="brand"><Boxes size={24} /><span>NexusERP</span></div>
      <nav>
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Icon size={19} /><span>{label}</span>
          </NavLink>
        ))}
        {isAdmin && (
          <NavLink to="/users" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <UserRoundCog size={19} /><span>Usuários</span>
          </NavLink>
        )}
      </nav>
      <button className="nav-link logout" onClick={logout}><LogOut size={19} /> Sair</button>
    </aside>
  );
}
