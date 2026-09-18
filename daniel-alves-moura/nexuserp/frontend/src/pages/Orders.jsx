import { useEffect, useState } from 'react';
import { Eye, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import api, { apiErrorMessage } from '../api/client';
import PageHeader from '../components/PageHeader';
import Pagination from '../components/Pagination';
import StatusBadge from '../components/StatusBadge';

const money=v=>Number(v).toLocaleString('pt-BR',{style:'currency',currency:'BRL'}); const date=v=>new Date(v).toLocaleString('pt-BR');
export default function Orders(){
  const [data,setData]=useState({content:[],totalPages:0,number:0}); const [page,setPage]=useState(0); const [error,setError]=useState('');
  useEffect(()=>{api.get('/orders',{params:{page,size:10,sort:'createdAt,desc'}}).then(r=>setData(r.data)).catch(e=>setError(apiErrorMessage(e)));},[page]);
  return <><PageHeader title="Pedidos" description="Fluxo de vendas e acompanhamento de status." actions={<Link className="btn primary" to="/orders/new"><Plus size={18}/>Novo pedido</Link>}/>{error&&<div className="alert error">{error}</div>}<section className="card"><div className="table-wrap"><table><thead><tr><th>Pedido</th><th>Cliente</th><th>Data</th><th>Status</th><th>Total</th><th className="right">Detalhes</th></tr></thead><tbody>{data.content.map(o=><tr key={o.id}><td><strong>#{o.id}</strong></td><td>{o.customerName}</td><td>{date(o.createdAt)}</td><td><StatusBadge status={o.status}/></td><td>{money(o.total)}</td><td className="right"><Link className="icon-btn" to={`/orders/${o.id}`}><Eye size={18}/></Link></td></tr>)}{!data.content.length&&<tr><td colSpan="6" className="empty">Nenhum pedido.</td></tr>}</tbody></table></div><Pagination page={data.number??page} totalPages={data.totalPages} onChange={setPage}/></section></>;
}
