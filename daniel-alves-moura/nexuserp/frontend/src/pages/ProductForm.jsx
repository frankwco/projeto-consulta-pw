import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import api, { apiErrorMessage } from '../api/client';
import PageHeader from '../components/PageHeader';
import { useAuth } from '../context/AuthContext';

const empty={sku:'',name:'',description:'',price:'',stock:0,active:true,categoryId:''};
export default function ProductForm(){
  const {isAdmin}=useAuth(); const {id}=useParams(); const editing=Boolean(id); const nav=useNavigate(); const [form,setForm]=useState(empty); const [categories,setCategories]=useState([]); const [error,setError]=useState(''); const [saving,setSaving]=useState(false);
  useEffect(()=>{api.get('/categories').then(r=>setCategories(r.data)); if(editing)api.get(`/products/${id}`).then(r=>setForm(r.data)).catch(e=>setError(apiErrorMessage(e)));},[id]);
  if(!isAdmin)return <Navigate to="/products" replace/>;
  const change=e=>setForm({...form,[e.target.name]:e.target.type==='checkbox'?e.target.checked:e.target.value});
  const submit=async e=>{e.preventDefault();setSaving(true);setError('');const payload={...form,price:Number(form.price),stock:Number(form.stock),categoryId:Number(form.categoryId)};try{editing?await api.put(`/products/${id}`,payload):await api.post('/products',payload);nav('/products');}catch(e){setError(apiErrorMessage(e));}finally{setSaving(false);}};
  return <><PageHeader title={editing?'Editar produto':'Novo produto'} description="Dados comerciais e de estoque."/><form className="card form-grid" onSubmit={submit}>{error&&<div className="alert error span-2">{error}</div>}
    <label>SKU *<input name="sku" value={form.sku} onChange={change} required/></label><label>Nome *<input name="name" value={form.name} onChange={change} required/></label>
    <label>Categoria *<select name="categoryId" value={form.categoryId} onChange={change} required><option value="">Selecione</option>{categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
    <label>Preço *<input name="price" type="number" min="0.01" step="0.01" value={form.price} onChange={change} required/></label><label>Estoque *<input name="stock" type="number" min="0" value={form.stock} onChange={change} required/></label>
    <label className="check-label"><input name="active" type="checkbox" checked={form.active} onChange={change}/> Produto ativo</label>
    <label className="span-2">Descrição<textarea name="description" value={form.description||''} onChange={change} rows="4"/></label>
    <div className="form-actions span-2"><Link className="btn secondary" to="/products">Cancelar</Link><button className="btn primary" disabled={saving}>{saving?'Salvando...':'Salvar'}</button></div>
  </form></>;
}
