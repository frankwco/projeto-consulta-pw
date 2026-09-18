import { useEffect, useState } from 'react';
import { CircleDollarSign, PackageCheck, ShoppingCart, TriangleAlert, Users } from 'lucide-react';
import api, { apiErrorMessage } from '../api/client';
import Loading from '../components/Loading';
import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';

const money = (v) => Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function Dashboard() {
  const [data, setData] = useState(null); const [error, setError] = useState('');
  useEffect(() => { api.get('/dashboard').then(r => setData(r.data)).catch(e => setError(apiErrorMessage(e))); }, []);
  if (!data && !error) return <Loading />;
  if (error) return <div className="alert error">{error}</div>;

  const cards = [
    ['Clientes', data.customers, Users], ['Produtos ativos', data.activeProducts, PackageCheck], ['Pedidos', data.orders, ShoppingCart],
    ['Estoque baixo', data.lowStockProducts, TriangleAlert], ['Receita', money(data.totalRevenue), CircleDollarSign]
  ];

  return <>
    <PageHeader title="Dashboard" description="Visão geral da operação." />
    <div className="stats-grid">{cards.map(([label, value, Icon]) => <div className="stat-card" key={label}><div className="stat-icon"><Icon size={22}/></div><div><span>{label}</span><strong>{value}</strong></div></div>)}</div>
    <div className="two-columns">
      <section className="card"><div className="card-title"><h2>Pedidos recentes</h2><span>{data.pendingOrders} pendentes</span></div>
        <div className="table-wrap"><table><thead><tr><th>#</th><th>Cliente</th><th>Status</th><th>Total</th></tr></thead><tbody>
          {data.recentOrders.map(o => <tr key={o.id}><td>#{o.id}</td><td>{o.customerName}</td><td><StatusBadge status={o.status}/></td><td>{money(o.total)}</td></tr>)}
          {!data.recentOrders.length && <tr><td colSpan="4" className="empty">Nenhum pedido.</td></tr>}
        </tbody></table></div>
      </section>
      <section className="card"><div className="card-title"><h2>Estoque crítico</h2><span>≤ 5 unidades</span></div>
        <div className="stock-list">{data.lowStock.map(p => <div className="stock-item" key={p.id}><div><strong>{p.name}</strong><span>{p.sku} · {p.categoryName}</span></div><b>{p.stock}</b></div>)}
          {!data.lowStock.length && <div className="empty">Nenhum item crítico.</div>}
        </div>
      </section>
    </div>
  </>;
}
