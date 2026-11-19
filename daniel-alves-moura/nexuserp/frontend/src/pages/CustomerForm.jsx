import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api, { apiErrorMessage } from '../api/client';
import PageHeader from '../components/PageHeader';

const empty = { name: '', email: '', phone: '', document: '', address: '' };

export default function CustomerForm() {
  const { id } = useParams(); const editing = Boolean(id); const navigate = useNavigate();
  const [form, setForm] = useState(empty); const [error, setError] = useState(''); const [saving, setSaving] = useState(false);
  useEffect(() => { if (editing) api.get(`/customers/${id}`).then(r => setForm(r.data)).catch(e => setError(apiErrorMessage(e))); }, [id]);
  const change = e => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = async e => { e.preventDefault(); setSaving(true); setError(''); try { editing ? await api.put(`/customers/${id}`, form) : await api.post('/customers', form); navigate('/customers'); } catch(e) { setError(apiErrorMessage(e)); } finally { setSaving(false); } };
  return <>
    <PageHeader title={editing ? 'Editar cliente' : 'Novo cliente'} description="Informações cadastrais e de contato." />
    <form className="card form-grid" onSubmit={submit}>
      {error && <div className="alert error span-2">{error}</div>}
      <label>Nome *<input name="name" value={form.name} onChange={change} required minLength="2" /></label>
      <label>E-mail *<input name="email" type="email" value={form.email} onChange={change} required /></label>
      <label>Telefone<input name="phone" value={form.phone || ''} onChange={change} /></label>
      <label>Documento<input name="document" value={form.document || ''} onChange={change} /></label>
      <label className="span-2">Endereço<textarea name="address" value={form.address || ''} onChange={change} rows="3" /></label>
      <div className="form-actions span-2"><Link className="btn secondary" to="/customers">Cancelar</Link><button className="btn primary" disabled={saving}>{saving ? 'Salvando...' : 'Salvar'}</button></div>
    </form>
  </>;
}
