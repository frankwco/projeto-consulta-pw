import { useEffect, useState } from 'react';
import { Pencil, Plus, Trash2, X } from 'lucide-react';
import api, { apiErrorMessage } from '../api/client';
import PageHeader from '../components/PageHeader';
import { useAuth } from '../context/AuthContext';

export default function Categories(){
  const {isAdmin}=useAuth(); const [items,setItems]=useState([]); const [form,setForm]=useState({name:'',description:''}); const [editing,setEditing]=useState(null); const [error,setError]=useState('');
  const load=()=>api.get('/categories').then(r=>setItems(r.data)).catch(e=>setError(apiErrorMessage(e))); useEffect(()=>{load();},[]);
  const reset=()=>{setEditing(null);setForm({name:'',description:''});setError('');};
  const edit=c=>{setEditing(c.id);setForm({name:c.name,description:c.description||''});};
  const submit=async e=>{e.preventDefault();try{editing?await api.put(`/categories/${editing}`,form):await api.post('/categories',form);reset();load();}catch(e){setError(apiErrorMessage(e));}};
  const remove=async id=>{if(!confirm('Excluir a categoria? Produtos vinculados podem impedir a exclusão.'))return;try{await api.delete(`/categories/${id}`);load();}catch(e){alert(apiErrorMessage(e));}};
  return <><PageHeader title="Categorias" description="Organização do catálogo de produtos."/>{error&&<div className="alert error">{error}</div>}<div className="two-columns categories-layout">
    <section className="card"><div className="card-title"><h2>Categorias cadastradas</h2><span>{items.length} registros</span></div><div className="category-list">{items.map(c=><div className="category-row" key={c.id}><div><strong>{c.name}</strong><span>{c.description||'Sem descrição'}</span></div>{isAdmin&&<div className="table-actions"><button className="icon-btn" onClick={()=>edit(c)}><Pencil size={17}/></button><button className="icon-btn danger" onClick={()=>remove(c.id)}><Trash2 size={17}/></button></div>}</div>)}</div></section>
    {isAdmin&&<form className="card" onSubmit={submit}><div className="card-title"><h2>{editing?'Editar categoria':'Nova categoria'}</h2>{editing&&<button type="button" className="icon-btn" onClick={reset}><X size={18}/></button>}</div><div className="form-grid one-col"><label>Nome *<input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/></label><label>Descrição<textarea rows="4" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></label><button className="btn primary"><Plus size={18}/>{editing?'Atualizar':'Adicionar'}</button></div></form>}
  </div></>;
}
