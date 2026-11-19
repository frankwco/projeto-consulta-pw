import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import './Calculo.css';

// CORREÇÃO 1: Rota ajustada para '/api/calculo'
const API_URL = 'http://localhost:8080/api/calculo';

function Calculo() {
    const [valorInicial, setValorInicial] = useState('');
    const [prazoMeses, setPrazoMeses] = useState('');
    const [juroMensal, setJuroMensal] = useState('');
    const [valorFinal, setValorFinal] = useState(null);

    const [listaInvestimentos, setListaInvestimentos] = useState([]);
    const [filtroData, setFiltroData] = useState('');
    const [filtroPrazoOuJuro, setFiltroPrazoOuJuro] = useState('');

    useEffect(() => {
        carregarRegistros();
    }, []);

    const carregarRegistros = async () => {
        try {
            const res = await fetch(API_URL);
            if (!res.ok) throw new Error();
            const data = await res.json();
            setListaInvestimentos(data);
        } catch (err) {
            console.error('Erro ao carregar registros:', err);
        }
    };

    const validarCampos = () => {
        if (!valorInicial || !prazoMeses || !juroMensal) {
            alert('Preencha todos os campos!');
            return false;
        }
        if (Number(valorInicial) <= 0 || Number(prazoMeses) <= 0 || Number(juroMensal) <= 0) {
            alert('Insira apenas valores maiores que zero!');
            return false;
        }
        return true;
    };

    const handleCalcular = async () => {
        if (!validarCampos()) return;
        try {
            const url = `${API_URL}/calcular?valorInicial=${valorInicial}&prazoMeses=${prazoMeses}&juroMensal=${juroMensal}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error();
            const data = await res.json();
            setValorFinal(data);
        } catch (err) {
            alert('Erro ao realizar o cálculo.');
        }
    };

    const handleSalvar = async () => {
        if (!validarCampos()) return;
        try {
            // CORREÇÃO 2: Enviando 'jurosMensal' (com 's') para coincidir com o atributo Java
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    valorInicial: Number(valorInicial),
                    prazoMeses: Number(prazoMeses),
                    jurosMensal: Number(juroMensal) 
                })
            });
            if (!res.ok) throw new Error();
            alert('Cálculo salvo com sucesso!');
            carregarRegistros();
        } catch (err) {
            alert('Erro ao salvar investimento.');
        }
    };

    const handleLimparTabela = async () => {
        if (window.confirm('Deseja realmente apagar todos os dados?')) {
            try {
                const res = await fetch(API_URL, { method: 'DELETE' });
                if (!res.ok) throw new Error();
                setListaInvestimentos([]);
            } catch (err) {
                alert('Erro ao limpar a tabela.');
            }
        }
    };

    const handlePesquisarData = async () => {
        if (!filtroData) return carregarRegistros();
        try {
            const res = await fetch(`${API_URL}/filtro/data?data=${filtroData}`);
            if (!res.ok) throw new Error();
            const data = await res.json();
            setListaInvestimentos(data);
        } catch (err) {
            alert('Erro ao filtrar por data.');
        }
    };

    const handlePesquisarPrazoOuJuro = async () => {
        if (!filtroPrazoOuJuro) return carregarRegistros();
        try {
            const res = await fetch(`${API_URL}/filtro/prazo-juro?prazo=${filtroPrazoOuJuro}&juro=${filtroPrazoOuJuro}`);
            if (!res.ok) throw new Error();
            const data = await res.json();
            setListaInvestimentos(data);
        } catch (err) {
            alert('Erro ao filtrar.');
        }
    };

    return (
        <div>
            <Header titulo="Cálculo de Investimento - Listagem" />

            <div style={{ padding: '20px' }}>
                <div>
                    <label>Valor inicial:</label><br />
                    <input 
                        type="number" 
                        value={valorInicial} 
                        onChange={(e) => setValorInicial(e.target.value)} 
                    />
                </div>

                <div>
                    <label>Prazo em Meses:</label><br />
                    <input 
                        type="number" 
                        value={prazoMeses} 
                        onChange={(e) => setPrazoMeses(e.target.value)} 
                    />
                </div>

                <div>
                    <label>Juro Mensal:</label><br />
                    <input 
                        type="number" 
                        value={juroMensal} 
                        onChange={(e) => setJuroMensal(e.target.value)} 
                    />
                </div>

                <br />
                <button onClick={handleCalcular}>Calcular</button>

                {valorFinal !== null && (
                    <p>o valor final será de {Number(valorFinal).toFixed(2)}</p>
                )}

                <br />
                <button onClick={handleSalvar}>Salvar Cálculo</button>

                <hr style={{ margin: '20px 0' }} />

                <div style={{ display: 'flex', gap: '20px' }}>
                    <div>
                        <label>Filtro por data: </label>
                        <input type="date" value={filtroData} onChange={(e) => setFiltroData(e.target.value)} />
                        <button onClick={handlePesquisarData}>Pesquisar</button>
                    </div>

                    <div>
                        <label>Filtro por prazo ou juro: </label>
                        <input type="number" value={filtroPrazoOuJuro} onChange={(e) => setFiltroPrazoOuJuro(e.target.value)} />
                        <button onClick={handlePesquisarPrazoOuJuro}>Pesquisar</button>
                    </div>
                </div>

                <h2>ÚLTIMOS CÁLCULOS REALIZADOS</h2>
                <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th>Data Cálculo</th>
                            <th>Prazo</th>
                            <th>Juro</th>
                            <th>Valor Final</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listaInvestimentos.map((item) => (
                            <tr key={item.id}>
                                <td>{item.dataCalculo}</td>
                                <td>{item.prazoMeses}</td>
                                {/* CORREÇÃO 3: Exibindo item.jurosMensal (com 's') */}
                                <td>{item.jurosMensal}</td>
                                <td>{item.valorFinal ? Number(item.valorFinal).toFixed(2) : '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <br />
                <button onClick={handleLimparTabela} style={{ backgroundColor: 'red', color: 'white' }}>
                    Limpar Dados
                </button>
            </div>
        </div>
    );
}

export default Calculo;