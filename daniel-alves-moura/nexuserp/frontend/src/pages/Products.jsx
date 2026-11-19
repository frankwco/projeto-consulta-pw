import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import api, { apiErrorMessage } from '../api/client';
import useDebounce from '../hooks/useDebounce';
import PageHeader from '../components/PageHeader';
import Pagination from '../components/Pagination';
import { useAuth } from '../context/AuthContext';

const money = v => Number(v).toLocaleString('pt-BR', { style:'currency', currency:'BRL' });

export default function Products() {
  const { isAdmin } = useAuth(); const [data,setData]=useState({content:[],totalPages:0,number:0}); const [q,setQ]=useState(''); const dq=useDebounce(q); const [page,setPage]=useState(0); const [error,setError]=useState('');
  const load=()=>api.get('/products',{params:{q:dq||undefined,page,size:10,sort:'name,asc'}}).then(r=>setData(r.data)).catch(e=>setError(apiErrorMessage(e)));
  useEffect(()=>{load();},[dq,page]); useEffect(()=>setPage(0),[dq]);
  const remove=async id=>{if(!confirm('Excluir este produto?'))return; try{await api.delete(`/products/${id}`);load();}catch(e){alert(apiErrorMessage(e));}};
  return <>
    <PageHeader title="Produtos" description="Catálogo, preços e controle de estoque." actions={isAdmin && <Link className="btn primary" to="/products/new"><Plus size={18}/>Novo produto</Link>} />
    {error&&<div className="alert error">{error}</div>}
    <section className="card"><div className="toolbar"><div className="search-box"><Search size={18}/><input placeholder="Buscar nome, SKU ou categoria" value={q} onChange={e=>setQ(e.target.value)}/></div></div>
      <div className="table-wrap"><table><thead><tr><th>Produto</th><th>Categoria</th><th>Preço</th><th>Estoque</th><th>Status</th>{isAdmin&&<th className="right">Ações</th>}</tr></thead><tbody>
        {data.content.map(p=><tr key={p.id}><td><strong>{p.name}</strong><div className="muted small">{p.sku}</div></td><td>{p.categoryName}</td><td>{money(p.price)}</td><td><span className={p.stock<=5?'low-stock':''}>{p.stock}</span></td><td><span className={`pill ${p.active?'success':'neutral'}`}>{p.active?'Ativo':'Inativo'}</span></td>{isAdmin&&<td className="right table-actions"><Link className="icon-btn" to={`/products/${p.id}/edit`}><Pencil size={17}/></Link><button className="icon-btn danger" onClick={()=>remove(p.id)}><Trash2 size={17}/></button></td>}</tr>)}
        {!data.content.length&&<tr><td colSpan={isAdmin?6:5} className="empty">Nenhum produto encontrado.</td></tr>}
      </tbody></table></div><Pagination page={data.number??page} totalPages={data.totalPages} onChange={setPage}/>
    </section>
  </>;
}
