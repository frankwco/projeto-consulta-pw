import { useEffect, useState } from 'react'
import api from '../api/api'
import RegistroFiltros from '../components/RegistroFiltros'
import RegistroForm from '../components/RegistroForm'

const filtrosIniciais = {
  busca: '',
  nome: '',
  categoria: '',
  status: '',
  valorMin: '',
  valorMax: '',
  dataInicio: '',
  dataFim: '',
  sort: 'id',
  direction: 'desc',
  size: '8'
}

function montarParams(filtros, page) {
  const params = { page, size: Number(filtros.size || 8) }

  Object.entries(filtros).forEach(([chave, valor]) => {
    if (chave === 'size') return
    if (valor !== '' && valor !== null && valor !== undefined) {
      params[chave] = valor
    }
  })

  return params
}

function contarFiltrosAtivos(filtros) {
  const ignorar = new Set(['sort', 'direction', 'size'])
  return Object.entries(filtros)
    .filter(([chave, valor]) => !ignorar.has(chave) && valor !== '' && valor != null)
    .length
}

export default function RegistrosPage() {
  const [pagina, setPagina] = useState({ content: [], number: 0, totalPages: 0, totalElements: 0 })
  const [filtros, setFiltros] = useState({ ...filtrosIniciais })
  const [filtrosAplicados, setFiltrosAplicados] = useState({ ...filtrosIniciais })
  const [editando, setEditando] = useState(undefined)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')

  async function carregar(page = 0, filtrosConsulta = filtrosAplicados) {
    setCarregando(true)
    try {
      setErro('')
      const { data } = await api.get('/registros', {
        params: montarParams(filtrosConsulta, page)
      })
      setPagina(data)
    } catch (err) {
      setErro(err.response?.data?.erro || 'Falha ao carregar registros')
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregar(0, filtrosIniciais)
  }, [])

  async function aplicarFiltros(event) {
    event.preventDefault()
    const novos = { ...filtros }
    setFiltrosAplicados(novos)
    await carregar(0, novos)
  }

  async function limparFiltros() {
    const limpos = { ...filtrosIniciais }
    setFiltros(limpos)
    setFiltrosAplicados(limpos)
    await carregar(0, limpos)
  }

  function novo() {
    setEditando(undefined)
    setMostrarForm(true)
  }

  function editar(registro) {
    setEditando(registro)
    setMostrarForm(true)
  }

  async function salvar(payload) {
    setSalvando(true)
    setErro('')
    try {
      if (editando?.id) await api.put(`/registros/${editando.id}`, payload)
      else await api.post('/registros', payload)
      setMostrarForm(false)
      setEditando(undefined)
      await carregar(pagina.number, filtrosAplicados)
    } catch (err) {
      const campos = err.response?.data?.campos
      setErro(campos ? Object.values(campos).join(' | ') : (err.response?.data?.erro || 'Erro ao salvar'))
    } finally {
      setSalvando(false)
    }
  }

  async function excluir(id) {
    if (!confirm('Excluir este registro?')) return
    try {
      await api.delete(`/registros/${id}`)
      const paginaDepoisDaExclusao = pagina.content.length === 1 && pagina.number > 0
        ? pagina.number - 1
        : pagina.number
      await carregar(paginaDepoisDaExclusao, filtrosAplicados)
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao excluir')
    }
  }

  const filtrosAtivos = contarFiltrosAtivos(filtrosAplicados)

  return (
    <section>
      <header className="page-header">
        <div>
          <h1>Registros</h1>
          <p>CRUD genérico com filtros combináveis, ordenação e paginação.</p>
        </div>
        <button className="btn btn-primary" onClick={novo}>+ Novo</button>
      </header>

      {erro && <div className="alert error">{erro}</div>}

      {mostrarForm && (
        <RegistroForm
          registro={editando}
          onSalvar={salvar}
          onCancelar={() => setMostrarForm(false)}
          salvando={salvando}
        />
      )}

      <RegistroFiltros
        filtros={filtros}
        onChange={setFiltros}
        onAplicar={aplicarFiltros}
        onLimpar={limparFiltros}
        quantidadeAtivos={filtrosAtivos}
      />

      <div className="table-card">
        <div className="table-summary">
          <span>{pagina.totalElements} registro(s) encontrado(s)</span>
          {carregando && <span>Carregando...</span>}
        </div>

        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Categoria</th>
                <th>Valor</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {pagina.content.map(r => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td><strong>{r.nome}</strong><small>{r.descricao}</small></td>
                  <td>{r.categoria || '—'}</td>
                  <td>{Number(r.valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                  <td><span className={`badge ${r.status.toLowerCase()}`}>{r.status}</span></td>
                  <td className="row-actions">
                    <button className="btn btn-small" onClick={() => editar(r)}>Editar</button>
                    <button className="btn btn-small danger" onClick={() => excluir(r.id)}>Excluir</button>
                  </td>
                </tr>
              ))}
              {!carregando && pagina.content.length === 0 && (
                <tr><td colSpan="6" className="empty">Nenhum registro encontrado com os filtros informados.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <button
            className="btn btn-ghost"
            disabled={carregando || pagina.number <= 0}
            onClick={() => carregar(pagina.number - 1, filtrosAplicados)}
          >
            Anterior
          </button>
          <span>Página {pagina.number + 1} de {Math.max(pagina.totalPages, 1)}</span>
          <button
            className="btn btn-ghost"
            disabled={carregando || pagina.number + 1 >= pagina.totalPages}
            onClick={() => carregar(pagina.number + 1, filtrosAplicados)}
          >
            Próxima
          </button>
        </div>
      </div>
    </section>
  )
}
