import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import api, { apiErrorMessage } from '../api/client';
import useDebounce from '../hooks/useDebounce';
import PageHeader from '../components/PageHeader';
import Pagination from '../components/Pagination';

export default function Customers() {
  const [data, setData] = useState({ content: [], totalPages: 0, number: 0 });
  const [q, setQ] = useState(''); const debounced = useDebounce(q); const [page, setPage] = useState(0); const [error, setError] = useState('');
  const load = () => api.get('/customers', { params: { q: debounced || undefined, page, size: 10, sort: 'name,asc' } }).then(r => setData(r.data)).catch(e => setError(apiErrorMessage(e)));
  useEffect(() => { load(); }, [debounced, page]);
  useEffect(() => setPage(0), [debounced]);

  const remove = async (id) => { if (!confirm('Excluir este cliente?')) return; try { await api.delete(`/customers/${id}`); load(); } catch(e) { alert(apiErrorMessage(e)); } };

  return <>
    <PageHeader title="Clientes" description="Cadastro e manutenção da base de clientes." actions={<Link className="btn primary" to="/customers/new"><Plus size={18}/>Novo cliente</Link>} />
    {error && <div className="alert error">{error}</div>}
    <section className="card">
      <div className="toolbar"><div className="search-box"><Search size={18}/><input placeholder="Buscar por nome ou e-mail" value={q} onChange={e=>setQ(e.target.value)}/></div></div>
      <div className="table-wrap"><table><thead><tr><th>Nome</th><th>E-mail</th><th>Telefone</th><th>Documento</th><th className="right">Ações</th></tr></thead><tbody>
        {data.content.map(c => <tr key={c.id}><td><strong>{c.name}</strong></td><td>{c.email}</td><td>{c.phone || '—'}</td><td>{c.document || '—'}</td><td className="right table-actions"><Link className="icon-btn" to={`/customers/${c.id}/edit`} title="Editar"><Pencil size={17}/></Link><button className="icon-btn danger" onClick={()=>remove(c.id)} title="Excluir"><Trash2 size={17}/></button></td></tr>)}
        {!data.content.length && <tr><td colSpan="5" className="empty">Nenhum cliente encontrado.</td></tr>}
      </tbody></table></div>
      <Pagination page={data.number ?? page} totalPages={data.totalPages} onChange={setPage}/>
    </section>
  </>;
}
