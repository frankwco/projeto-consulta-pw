const STATUS = [
  { value: '', label: 'Todos' },
  { value: 'ATIVO', label: 'Ativo' },
  { value: 'PENDENTE', label: 'Pendente' },
  { value: 'CONCLUIDO', label: 'Concluído' },
  { value: 'INATIVO', label: 'Inativo' }
]

const ORDENACAO = [
  { value: 'id', label: 'ID' },
  { value: 'nome', label: 'Nome' },
  { value: 'categoria', label: 'Categoria' },
  { value: 'valor', label: 'Valor' },
  { value: 'status', label: 'Status' },
  { value: 'criadoEm', label: 'Data de criação' },
  { value: 'atualizadoEm', label: 'Última atualização' }
]

export default function RegistroFiltros({ filtros, onChange, onAplicar, onLimpar, quantidadeAtivos }) {
  function alterar(event) {
    const { name, value } = event.target
    onChange({ ...filtros, [name]: value })
  }

  return (
    <form className="filter-card" onSubmit={onAplicar}>
      <div className="filter-header">
        <div>
          <h3>Filtros personalizados</h3>
          <p>Todos os campos são opcionais e podem ser combinados.</p>
        </div>
        {quantidadeAtivos > 0 && (
          <span className="filter-counter">{quantidadeAtivos} ativo(s)</span>
        )}
      </div>

      <div className="filter-grid">
        <label className="filter-wide">Busca livre
          <input
            name="busca"
            value={filtros.busca}
            onChange={alterar}
            placeholder="Nome, descrição ou categoria..."
          />
        </label>

        <label>Nome
          <input
            name="nome"
            value={filtros.nome}
            onChange={alterar}
            placeholder="Contém..."
          />
        </label>

        <label>Categoria
          <input
            name="categoria"
            value={filtros.categoria}
            onChange={alterar}
            placeholder="Contém..."
          />
        </label>

        <label>Status
          <select name="status" value={filtros.status} onChange={alterar}>
            {STATUS.map(item => (
              <option key={item.value} value={item.value}>{item.label}</option>
            ))}
          </select>
        </label>

        <label>Valor mínimo
          <input
            name="valorMin"
            type="number"
            min="0"
            step="0.01"
            value={filtros.valorMin}
            onChange={alterar}
            placeholder="0,00"
          />
        </label>

        <label>Valor máximo
          <input
            name="valorMax"
            type="number"
            min="0"
            step="0.01"
            value={filtros.valorMax}
            onChange={alterar}
            placeholder="Sem limite"
          />
        </label>

        <label>Criado a partir de
          <input
            name="dataInicio"
            type="date"
            value={filtros.dataInicio}
            onChange={alterar}
          />
        </label>

        <label>Criado até
          <input
            name="dataFim"
            type="date"
            value={filtros.dataFim}
            onChange={alterar}
          />
        </label>

        <label>Ordenar por
          <select name="sort" value={filtros.sort} onChange={alterar}>
            {ORDENACAO.map(item => (
              <option key={item.value} value={item.value}>{item.label}</option>
            ))}
          </select>
        </label>

        <label>Direção
          <select name="direction" value={filtros.direction} onChange={alterar}>
            <option value="asc">Crescente</option>
            <option value="desc">Decrescente</option>
          </select>
        </label>

        <label>Itens por página
          <select name="size" value={filtros.size} onChange={alterar}>
            <option value="5">5</option>
            <option value="8">8</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </label>
      </div>

      <div className="filter-actions">
        <button type="button" className="btn btn-ghost" onClick={onLimpar}>Limpar filtros</button>
        <button className="btn btn-secondary">Aplicar filtros</button>
      </div>
    </form>
  )
}
