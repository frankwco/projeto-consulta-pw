import { useEffect, useState } from 'react'
import api from '../api/api'

export default function DashboardPage() {
  const [dados, setDados] = useState(null)
  const [erro, setErro] = useState('')

  useEffect(() => {
    api.get('/dashboard')
      .then(res => setDados(res.data))
      .catch(() => setErro('Não foi possível carregar o dashboard'))
  }, [])

  const cards = [
    ['Total', dados?.total ?? '—'],
    ['Ativos', dados?.ativos ?? '—'],
    ['Pendentes', dados?.pendentes ?? '—'],
    ['Concluídos', dados?.concluidos ?? '—'],
    ['Soma dos valores', dados ? Number(dados.somaValores || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '—']
  ]

  return (
    <section>
      <header className="page-header">
        <div><h1>Dashboard</h1><p>Resumo rápido dos dados cadastrados.</p></div>
      </header>
      {erro && <div className="alert error">{erro}</div>}
      <div className="dashboard-grid">
        {cards.map(([titulo, valor]) => (
          <article className="stat-card" key={titulo}>
            <span>{titulo}</span>
            <strong>{valor}</strong>
          </article>
        ))}
      </div>
      <div className="info-card">
        <h3>Como adaptar</h3>
        <p>Troque “Registro” pelo domínio pedido na prova e altere estes cards para os indicadores relevantes.</p>
      </div>
    </section>
  )
}
