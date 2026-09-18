import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import api, { apiErrorMessage } from '../api/client';
import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/PageHeader';
import Pagination from '../components/Pagination';

export default function Users(){
  const {isAdmin,user}=useAuth(); const [data,setData]=useState({content:[],totalPages:0,number:0}); const [page,setPage]=useState(0); const [error,setError]=useState('');
  const load=()=>api.get('/users',{params:{page,size:10,sort:'name,asc'}}).then(r=>setData(r.data)).catch(e=>setError(apiErrorMessage(e))); useEffect(()=>{if(isAdmin)load();},[page,isAdmin]);
  if(!isAdmin)return <Navigate to="/dashboard" replace/>;
  const toggle=async id=>{if(id===user.id){alert('Evite desativar a própria conta durante a sessão.');return;}try{await api.patch(`/users/${id}/active`);load();}catch(e){alert(apiErrorMessage(e));}};
  return <><PageHeader title="Usuários" description="Acesso ao sistema e estado das contas."/>{error&&<div className="alert error">{error}</div>}<section className="card"><div className="table-wrap"><table><thead><tr><th>Nome</th><th>E-mail</th><th>Perfil</th><th>Status</th><th className="right">Ação</th></tr></thead><tbody>{data.content.map(u=><tr key={u.id}><td><strong>{u.name}</strong></td><td>{u.email}</td><td>{u.role}</td><td><span className={`pill ${u.active?'success':'neutral'}`}>{u.active?'Ativo':'Inativo'}</span></td><td className="right"><button className="btn secondary small-btn" disabled={u.id===user.id} onClick={()=>toggle(u.id)}>{u.active?'Desativar':'Ativar'}</button></td></tr>)}</tbody></table></div><Pagination page={data.number??page} totalPages={data.totalPages} onChange={setPage}/></section></>;
}
