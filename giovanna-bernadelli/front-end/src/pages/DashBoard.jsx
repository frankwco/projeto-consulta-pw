import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import CalculoService from '../service/CalculoService';
import Header from './Header';
import '../css/DashBoard.css';
const DashBaord = () => {
    const [peso, setPeso] = useState("");
    const [distancia, setDistancia] = useState("");
    const [urgencia, setUrgencia] = useState("");
    const [tipo, setTipo] = useState("");
    const [simulacao, setSimulacao] = useState("");
    const [listaSimulacao, setListaSimulacao] = useState([]);
    const [filtroDistancia, setFiltroDistancia] = useState("");
    const [filtroData, setFiltroData] = useState("");

    const navigate = useNavigate();
    const service = new CalculoService();


    const simularFrete = async () => {

        const calculo = {
            pesoPacote: peso,
            distanciaEntrega: distancia,
            adicionalUrgencia: urgencia,
            tipoEnvio: tipo
        }

        const resposta = await service.simularCalculo(calculo);
        setSimulacao(resposta);
    };

    const salvar = async () => {

        const calculo = {
            pesoPacote: peso,
            distanciaEntrega: distancia,
            adicionalUrgencia: urgencia,
            tipoEnvio: tipo
        }

        const resposta = await service.adicionarCalculo(calculo);
        listarTodos();
    };

    const listarTodos = async () => {
        const resposta = await service.listarTodos();
        setListaSimulacao(resposta);
    };  

    const excluirNaLista = async (id) => {
         await service.excluirPorID(id);
            listarTodos();
    };

    const excluirTodos = async () => {
        await service.excluirTodos();
        listarTodos();
    };

    const listarPorDistancia = async (distancia) => {
        const resposta = await service.filtrarPorDistancia(distancia);
        setListaSimulacao(resposta);
    };

    const listarPorData = async (data) => {
        const resposta = await service.listarTodosPorData(data);
        setListaSimulacao(resposta);
    };

      useEffect(() => {
            listarTodos();
        }, []);
    
    
    return (
        <>
            {<Header nome="Frank" />}
            <p>Seja bem-vindo à DashBoard</p>
            <label>Peso Pacote - kg</label><br></br>
            <input value={peso} onChange={e => setPeso(e.target.value)}></input>

            <label>Distancia Entrega - km</label>
            <input value={distancia} onChange={e => setDistancia(e.target.value)}></input>

            <label>Adicional de urgencia % - opcional</label>
            <input value={urgencia} onChange={e => setUrgencia(e.target.value)}></input>

            <p>Tipo envio</p>
            <label>ECONOMICO</label>
            <input type='radio' name='tipo' value="ECONOMICO" onChange={e => setTipo(e.target.value)}></input>
            <label>EXPRESSO</label>
            <input type='radio' name='tipo' value="EXPRESSO" onChange={e => setTipo(e.target.value)}></input>

            <button onClick={() => {simularFrete()}}>CALCULAR</button>
            <button onClick={() => { salvar()}}>SALVAR</button>

            <p>Resultado da sua simulacao: {simulacao}</p>
            <label>FILTRAR POR DISTANCIA</label>
            <input value={filtroDistancia} onChange={e => setFiltroDistancia(e.target.value)}></input>
            <button onClick={() => { listarPorDistancia(filtroDistancia) }}>PESQUISAR</button>

            <label>FILTRAR POR DATA</label>
            <input value={filtroData} onChange={e => setFiltroData(e.target.value)}></input>
            <button onClick={() => { listarPorData(filtroData) }}>PESQUISAR</button>

            <table border="1">
                <thead style={{ backgroundColor: "green", color: "white" }}>
                    <tr>
                        <th>Data Cálculo</th>
                        <th>Peso</th>
                        <th>Distancia</th>
                        <th>Urgencia</th>
                        <th>Tipo envio</th>
                        <th>Valor Final</th>
                        <th>Ação</th>
                    </tr>
                </thead>
                <tbody>
                    {listaSimulacao.map((item) => (
                        <tr key={item.id}>
                            <td>{item.dataCalculo}</td>
                            <td>{item.pesoPacote}</td>
                            <td>{item.distanciaEntrega}</td>
                            <td>{item.adicionalUrgencia}</td>   
                            <td>{item.tipoEnvio}</td>
                            <td>{Number(item.valorFrete).toFixed(2)}</td>
                            <td><button onClick={() => { excluirNaLista(item.id) }}>EXCLUIR</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={() => {excluirTodos()}}>EXCLUIR TABELA</button>

        </>
    );
}
export default DashBaord;
