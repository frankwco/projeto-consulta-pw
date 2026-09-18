import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import api, { apiErrorMessage } from '../api/client';
import Loading from '../components/Loading';
import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';

const money=v=>Number(v).toLocaleString('pt-BR',{style:'currency',currency:'BRL'}); const date=v=>new Date(v).toLocaleString('pt-BR');
const statuses=['PENDING','PAID','PROCESSING','SHIPPED','COMPLETED','CANCELED'];
export default function OrderDetails(){
  const {id}=useParams(); const [order,setOrder]=useState(null); const [error,setError]=useState(''); const [updating,setUpdating]=useState(false);
  const load=()=>api.get(`/orders/${id}`).then(r=>setOrder(r.data)).catch(e=>setError(apiErrorMessage(e))); useEffect(()=>{load();},[id]);
  const changeStatus=async status=>{setUpdating(true);try{const {data}=await api.patch(`/orders/${id}/status`,{status});setOrder(data);}catch(e){alert(apiErrorMessage(e));}finally{setUpdating(false);}};
  if(!order&&!error)return <Loading/>; if(error)return <div className="alert error">{error}</div>;
  return <><PageHeader title={`Pedido #${order.id}`} description={`Criado em ${date(order.createdAt)}`} actions={<Link className="btn secondary" to="/orders"><ArrowLeft size={18}/>Voltar</Link>}/><div className="two-columns order-details-grid"><section className="card"><div className="card-title"><h2>Itens</h2><StatusBadge status={order.status}/></div><div className="table-wrap"><table><thead><tr><th>Produto</th><th>Qtd.</th><th>Unitário</th><th>Subtotal</th></tr></thead><tbody>{order.items.map(i=><tr key={i.id}><td><strong>{i.productName}</strong><div className="muted small">{i.sku}</div></td><td>{i.quantity}</td><td>{money(i.unitPrice)}</td><td>{money(i.subtotal)}</td></tr>)}</tbody></table></div><div className="order-total big"><span>Total do pedido</span><strong>{money(order.total)}</strong></div></section><aside className="card"><h2>Dados do pedido</h2><div className="detail-list"><div><span>Cliente</span><strong>{order.customerName}</strong></div><div><span>Status atual</span><StatusBadge status={order.status}/></div><div><span>Última atualização</span><strong>{date(order.updatedAt)}</strong></div></div><h3>Alterar status</h3><select value={order.status} disabled={updating||order.status==='CANCELED'} onChange={e=>changeStatus(e.target.value)}>{statuses.map(s=><option key={s} value={s}>{s}</option>)}</select>{order.status==='CANCELED'&&<p className="muted small">Pedidos cancelados não podem ser reabertos.</p>}</aside></div></>;
}
