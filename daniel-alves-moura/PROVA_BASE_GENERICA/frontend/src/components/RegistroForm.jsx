import { useEffect, useState } from 'react'

const vazio = {
  nome: '',
  descricao: '',
  categoria: '',
  valor: 0,
  status: 'ATIVO'
}

export default function RegistroForm({ registro, onSalvar, onCancelar, salvando }) {
  const [form, setForm] = useState(vazio)

  useEffect(() => {
    setForm(registro ? {
      nome: registro.nome ?? '',
      descricao: registro.descricao ?? '',
      categoria: registro.categoria ?? '',
      valor: registro.valor ?? 0,
      status: registro.status ?? 'ATIVO'
    } : vazio)
  }, [registro])

  function alterar(event) {
    const { name, value } = event.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function submit(event) {
    event.preventDefault()
    onSalvar({ ...form, valor: Number(form.valor || 0) })
  }

  return (
    <form className="form-card" onSubmit={submit}>
      <h3>{registro ? 'Editar registro' : 'Novo registro'}</h3>
      <div className="form-grid">
        <label>Nome
          <input name="nome" value={form.nome} onChange={alterar} required maxLength={120} />
        </label>
        <label>Categoria
          <input name="categoria" value={form.categoria} onChange={alterar} maxLength={80} />
        </label>
        <label>Valor
          <input name="valor" type="number" min="0" step="0.01" value={form.valor} onChange={alterar} />
        </label>
        <label>Status
          <select name="status" value={form.status} onChange={alterar}>
            <option value="ATIVO">ATIVO</option>
            <option value="PENDENTE">PENDENTE</option>
            <option value="CONCLUIDO">CONCLUÍDO</option>
            <option value="INATIVO">INATIVO</option>
          </select>
        </label>
        <label className="full">Descrição
          <textarea name="descricao" value={form.descricao} onChange={alterar} rows="4" maxLength={500} />
        </label>
      </div>
      <div className="actions">
        <button type="button" className="btn btn-ghost" onClick={onCancelar}>Cancelar</button>
        <button className="btn btn-primary" disabled={salvando}>{salvando ? 'Salvando...' : 'Salvar'}</button>
      </div>
    </form>
  )
}
