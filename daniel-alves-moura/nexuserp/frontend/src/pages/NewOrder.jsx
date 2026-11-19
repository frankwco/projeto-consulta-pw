import { useEffect, useMemo, useState } from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api, { apiErrorMessage } from '../api/client';
import PageHeader from '../components/PageHeader';

const money=v=>Number(v||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
export default function NewOrder(){
  const nav=useNavigate(); const [customers,setCustomers]=useState([]); const [products,setProducts]=useState([]); const [customerId,setCustomerId]=useState(''); const [items,setItems]=useState([]); const [error,setError]=useState(''); const [saving,setSaving]=useState(false);
  useEffect(()=>{Promise.all([api.get('/customers',{params:{size:100,sort:'name,asc'}}),api.get('/products',{params:{size:100,sort:'name,asc'}})]).then(([c,p])=>{setCustomers(c.data.content);setProducts(p.data.content.filter(x=>x.active));}).catch(e=>setError(apiErrorMessage(e)));},[]);
  const add=product=>{setItems(prev=>{const existing=prev.find(i=>i.productId===product.id); if(existing)return prev.map(i=>i.productId===product.id?{...i,quantity:Math.min(i.quantity+1,product.stock)}:i); return [...prev,{productId:product.id,name:product.name,price:product.price,stock:product.stock,quantity:1}];});};
  const qty=(id,next)=>setItems(prev=>prev.map(i=>i.productId===id?{...i,quantity:Math.max(1,Math.min(next,i.stock))}:i)); const remove=id=>setItems(prev=>prev.filter(i=>i.productId!==id));
  const total=useMemo(()=>items.reduce((s,i)=>s+Number(i.price)*i.quantity,0),[items]);
  const submit=async()=>{if(!customerId||!items.length){setError('Selecione um cliente e pelo menos um produto.');return;}setSaving(true);setError('');try{const {data}=await api.post('/orders',{customerId:Number(customerId),items:items.map(i=>({productId:i.productId,quantity:i.quantity}))});nav(`/orders/${data.id}`);}catch(e){setError(apiErrorMessage(e));}finally{setSaving(false);}};
  return <><PageHeader title="Novo pedido" description="Selecione o cliente e monte os itens da venda."/>{error&&<div className="alert error">{error}</div>}<div className="order-builder">
    <section className="card"><h2>1. Cliente</h2><select value={customerId} onChange={e=>setCustomerId(e.target.value)}><option value="">Selecione um cliente</option>{customers.map(c=><option key={c.id} value={c.id}>{c.name} — {c.email}</option>)}</select><h2 className="section-gap">2. Produtos</h2><div className="product-picker">{products.map(p=><button key={p.id} type="button" className="product-pick" disabled={p.stock===0} onClick={()=>add(p)}><div><strong>{p.name}</strong><span>{p.sku} · estoque {p.stock}</span></div><b>{money(p.price)}</b></button>)}</div></section>
    <aside className="card order-summary"><h2>3. Resumo</h2>{items.map(i=><div className="cart-item" key={i.productId}><div><strong>{i.name}</strong><span>{money(i.price)} cada</span></div><div className="qty"><button onClick={()=>qty(i.productId,i.quantity-1)}><Minus size={14}/></button><span>{i.quantity}</span><button onClick={()=>qty(i.productId,i.quantity+1)}><Plus size={14}/></button><button className="trash" onClick={()=>remove(i.productId)}><Trash2 size={15}/></button></div></div>)}{!items.length&&<div className="empty">Adicione produtos ao pedido.</div>}<div className="order-total"><span>Total</span><strong>{money(total)}</strong></div><div className="form-actions"><Link className="btn secondary" to="/orders">Cancelar</Link><button className="btn primary" onClick={submit} disabled={saving}>{saving?'Finalizando...':'Criar pedido'}</button></div></aside>
  </div></>;
}
