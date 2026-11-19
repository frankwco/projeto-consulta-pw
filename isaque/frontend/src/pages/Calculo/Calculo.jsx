import React, { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import FreteService from "../../service/FreteService";
import { useNavigate } from "react-router-dom";

const Calculo = () => {

    const [ peso, setPeso] = useState("");
    const [ distancia, setDistancia] = useState("");
    const [ urgencia, setUrgencia] = useState("");
    const [ tipoEnvio, setTipoEnvio] = useState("ECONOMICO");

    const [ registros, setRegistros ] = useState([]);
    const [ valorTotal, setValorTotal ] = useState("");

    const [ erro, setErro ] = useState("");
    const [ dataInicio, setDataInicio ] = useState("");
    const [ dataFim, setDataFim ] = useState("");
    const [ pesoMin, setPesoMin ] = useState("");
    const [ pesoMax, setPesoMax ] = useState("");
    const [ distanciaMin, setDistanciaMin ] = useState("");
    const [ distanciaMax, setDistanciaMax ] = useState("");

    const request = {
        "peso": Number(peso),
        "distancia": Number(distancia),
        "urgencia": urgencia === "" ? 0 : Number(urgencia),
        "tipoEnvio": tipoEnvio
    }

    const service = new FreteService();
    const navigate = useNavigate();

    async function listarRegistros() {
        try {
            const response = await service.listarTodos();
            setRegistros(response);
            setErro("");
        } catch (error) {
            const dataErro = error.response?.data;
            setErro(dataErro?.erros?.join(", ") || dataErro?.mensagem);
        }        
    }

    async function deletarTodos() {
        if(window.confirm("deseja apagar todos os registros? ") === true){
            try {
                await service.deletarTodos();
                await listarRegistros();
                setErro("");
            } catch (error) {
                const dataErro = error.response?.data;
                setErro(dataErro?.erros?.join(", ") || dataErro?.mensagem);
            }
        }
    }

    async function deletarId(id) {
        try {
            await service.deletarId(id);
            await listarRegistros();
            setErro("");
        } catch (error) {
            const dataErro = error.response?.data;
            setErro(dataErro?.erros?.join(", ") || dataErro?.mensagem);
        }  
    }

    async function calcular(){
        try {
            const response = await service.calcular(request);
            setValorTotal(response.valor);
            setErro("");
        } catch (error) {
            const dataErro = error.response?.data;
            setErro(dataErro?.erros?.join(", ") || dataErro?.mensagem);
        } 
        
    }

    async function salvar() {
        try {
            await service.salvar(request);
            await listarRegistros();
            setErro("");
        } catch (error) {
            const dataErro = error.response?.data;
            setErro(dataErro?.erros?.join(", ") || dataErro?.mensagem);
        } 
    }

    async function listarDataEntre(){
        if (dataInicio === "" || dataFim === "") {
            setErro("preencha os dois campos de filtro de DATA");
            return;
        }
        try {
            const response = await service.listarDataEntre(dataInicio, dataFim);
            setRegistros(response);
            setErro("");
        } catch (error) {
            const dataErro = error.response?.data;
            setErro(dataErro?.erros?.join(", ") || dataErro?.mensagem);
        } 
        
    }

    async function listarPesoEntre() {
        if (pesoMin === "" || pesoMax === "") {
            setErro("preencha os dois campos de filtro de PESO");
            return;
        }
        try {
            const response = await service.listarPesoEntre(Number(pesoMin), Number(pesoMax));
            setRegistros(response);
            setErro("");
        } catch (error) {
            const dataErro = error.response?.data;
            setErro(dataErro?.erros?.join(", ") || dataErro?.mensagem);
        }

    }

    async function listarDistanciaEntre() {
        if (distanciaMin === "" || distanciaMax === "") {
            setErro("preencha os dois campos de filtro de DISTANCIA");
            return;
        }
        try {
            const response = await service.listarDistanciaEntre(Number(distanciaMin), Number(distanciaMax));
            setRegistros(response);
            setErro("");
        } catch (error) {
            const dataErro = error.response?.data;
            setErro(dataErro?.erros?.join(", ") || dataErro?.mensagem);
        }

    }

    async function limparFiltros(){
        setDataInicio("");
        setDataFim("");
        setPesoMin("");
        setPesoMax("");
        setDistanciaMin("");
        setDistanciaMax("");
        setErro("");
        await listarRegistros();
    }

    async function limparCamposRequest() {
        setPeso("");
        setDistancia("");
        setUrgencia("");
        setTipoEnvio("ECONOMICO");
        setValorTotal("")
        setErro("");
        // await listarRegistros();
    }

    useEffect(()=>{
        listarRegistros();
    },[]);

    return (
        <div style={{justifyItems:"center"}}>
            <Header nomePagina="CALCULO" subtitulo="Histórico de Fretes"/>
            <div>
                <strong><p>Faça sua simulação de Frete!!!</p></strong>
            </div>
            <div style={{display:"flex", gap:"30px"}}>
                <button type="button" onClick={() => navigate("/")}>Voltar</button>
                <button type="button" onClick={limparCamposRequest}>Limpar Campos de Calculo</button>
            </div>
            <form>
                <div>
                    <label htmlFor="peso">Peso (em Kg)</label>
                    <input type="number" name="peso" id="peso" value={peso} onChange={e => setPeso(e.target.value)}/>
                </div>
                <div>
                    <label htmlFor="distancia">Distância (em Km)</label>
                    <input type="number" name="distancia" id="distancia" value={distancia} onChange={(e) => setDistancia(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="urgencia">Adicional de Urgência (em %)</label>
                    <input type="number" name="urgencia" id="urgencia" value={urgencia} onChange={(e) => setUrgencia(e.target.value)} />
                </div>
                <div>
                    <label>Tipo de Envio</label>
                    <div>
                        <label htmlFor="tipoEnvio">
                            <input type="radio" name="tipoEnvio" id="tipoEnvio" value="EXPRESSO" checked={tipoEnvio === "EXPRESSO"} onChange={(e) => setTipoEnvio(e.target.value)} />
                        Expresso</label>
                        
                        <label htmlFor="tipoEnvio">
                            <input type="radio" name="tipoEnvio" id="tipoEnvio" value="ECONOMICO" checked={tipoEnvio === "ECONOMICO"} onChange={(e) => setTipoEnvio(e.target.value)} />
                        Economico</label>
                    </div>
                </div>
                
            </form>

            <div style={{display:"flex", gap:"30px"}}>
                <button type="button" onClick={calcular}>Calcular</button>
                <button type="button" onClick={salvar}>Salvar Simulação</button>
                <button type="button" onClick={deletarTodos}>Exluir Todos os Registros</button>
            </div>

            {valorTotal !== "" && (
                <div>
                    <p>Valor da última simulação realizada: R${valorTotal}</p>
                </div>
            )}

            {erro !== "" && (
                <div>
                    <p>ERRO: {erro}</p>
                </div>
            )}

            {registros.length > 0 
            ? (<div>
                <strong><p>Detalhamento de seus Registros</p></strong>
                <table border="1">
                    <thead style={{ backgroundColor: "green", color: "white" }}>
                        <tr>
                            <th>Data Cálculo</th>
                            <th>Tipo de Envio</th>
                            <th>Peso (kg)</th>
                            <th>Distância (km)</th>
                            <th>Valor do Frete</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {registros.map((item) => (
                            <tr key={item.id}>
                                <td>{item.data}</td>
                                <td>{item.tipoEnvio}</td>
                                <td>{item.peso}</td>
                                <td>{item.distancia}</td>
                                <td>{item.valor}</td>
                                <td><button type="button" onClick={() => {deletarId(item.id)}}>Excluir Registro</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>)
            : (<strong style={{display: "flex"}}><p>Nenhum Registro Salvo</p></strong>)}

            <div style={{ display: "flex", gap: "30px" }}>
                <div>
                    <strong><p>Intervalo de Datas</p></strong>
                    <div>
                        <div>
                            <label htmlFor="dataInicio">Data Inicial</label>
                            <input type="date" name="dataInicio" id="dataInicio" value={dataInicio} onChange={e => setDataInicio(e.target.value)} />
                        </div>
                        <div>
                            <label htmlFor="dataFim">Data Final</label>
                            <input type="date" name="dataFim" id="dataFim" value={dataFim} onChange={e => setDataFim(e.target.value)} />
                        </div>
                        <button type="button" onClick={listarDataEntre}>Filtrar</button>
                    </div>
                </div>
                <div>
                    <strong><p>Intervalo de Peso</p></strong>
                    <div>
                        <div>
                            <label htmlFor="pesoMin">Peso Minimo</label>
                            <input type="number" name="pesoMin" id="pesoMin" value={pesoMin} onChange={e => setPesoMin(e.target.value)} />
                        </div>
                        <div>
                            <label htmlFor="pesoMax">Peso Maximo</label>
                            <input type="number" name="pesoMax" id="pesoMax" value={pesoMax} onChange={e => setPesoMax(e.target.value)} />
                        </div>
                        <button type="button" onClick={listarPesoEntre}>Filtrar</button>
                    </div>
                </div>
                <div>
                    <strong><p>Intervalo de Distancia</p></strong>
                    <div>
                        <div>
                            <label htmlFor="distanciaMin">Distancia Minima</label>
                            <input type="number" name="distanciaMin" id="distanciaMin" value={distanciaMin} onChange={e => setDistanciaMin(e.target.value)} />
                        </div>
                        <div>
                            <label htmlFor="distanciaMax">Distancia Maxima</label>
                            <input type="number" name="distanciaMax" id="distanciaMax" value={distanciaMax} onChange={e => setDistanciaMax(e.target.value)} />
                        </div>
                        <button type="button" onClick={listarDistanciaEntre}>Filtrar</button>
                    </div>
                </div>
            </div>

            <div>
                <button type="button" onClick={limparFiltros}>Limpar Filtros</button>
            </div>

        </div>
    );
}

export default Calculo;