import Header from '../../components/Header'
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AtividadeService from '../../service/AtividadeService';

function Atividade(){
    const navigate = useNavigate();
    const[atividade, setAtividade] = useState('');
    const[atividades, setAtividades] = useState([]);
    const[distancia, setDistancia] = useState('');
    const[calculo, setCalculo] = useState('');
    const[tempo, setTempo] = useState('');
    const[velocidadeMedia, setVelocidadeMedia] = useState('');
    const[filtrar, setFiltrar] = useState('');

    const service = new AtividadeService();

       useEffect(() => {
        carregarAtividades();
    }, []);

    const carregarAtividades = async() => {
        const data = await service.list();
        setAtividades(data);
    }

    const salvar = async() =>{
        const novaAtividade = {
            distancia: parseFloat(distancia),
            tempo: parseFloat(tempo)
        };

        await service.insert(novaAtividade);
        carregarAtividades();
    }

    const calcular = async() =>{
        const dados = {
            distancia: parseInt(distancia),
            tempo: parseInt(tempo)
        }
        const calculo = await service.calcular(dados);
        setVelocidadeMedia(calculo);
        carregarAtividades();
    }

    const limpar = async() =>{
        await service.limparTabela();
        carregarAtividades();
    }

    const filtrarPorClassificacao = async(busca) =>{
        const resposta = await service.filtrarPorClassificacao(busca);
        setAtividades(resposta);
    }


    return(
        <div>
            <Header titulo={"Registrar atividade"}/>
            <label>Distância percorrida (em km)</label>
            <br></br>
            <input type='number' value={distancia} onChange={e => setDistancia(e.target.value)}></input>
            <br></br>
            <label>Tempo gasto (em minutos)</label>
            <br></br>
            <input type='number' value={tempo} onChange={e => setTempo(e.target.value)}></input>
            <br></br>
            <button onClick={()=> {
                calcular()
            }}>Calcular</button>
            <br></br>
            <p>{velocidadeMedia}</p>
            <br></br>
            <button onClick={()=> {
                salvar()
            }}>Salvar</button>
            <br></br>
            <button onClick={()=> {
                limpar()
            }}>Limpar Tabela</button>
            <br></br>

            <label>Filtrar por classificacao</label>
            <input value={filtrar} onChange={e => setFiltrar(e.target.value)}></input>
            <button onClick={
                ()=> filtrarPorClassificacao(filtrar)
            }>Pesquisar</button>

            <table border="1">
            <thead style={{ backgroundColor: "green", color: "white" }}>
              <tr>
                <th>Distância</th>
                <th> Tempo (em minutos)</th>
                <th>Velocidade Média</th>
                <th>Data</th>
                <th>Classificação</th>
              </tr>
            </thead>
            <tbody>
              {atividades.map((item) => (
                <tr key={item.id}>
                  <td>{item.distancia}</td>
                  <td>{item.tempo}</td>
                  <td>{Number(item.velocidadeMedia).toFixed(2)}</td>
                <td>{item.dataHora}</td>
                <td>{item.classificacao}</td>
                </tr>
              ))}
            </tbody>
          </table>



        </div>
    );
}

export default Atividade;