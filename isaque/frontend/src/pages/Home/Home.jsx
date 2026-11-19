import React, { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import FreteService from "../../service/FreteService";
import { useNavigate } from "react-router-dom";
import CardResumo from "../../components/CardResumo/CardResumo";

const Home = () => {
    const [ agora, setAgora ] = useState("");
    const [ quantidade, setQuantidade ] = useState("");
    const [ mediaFrete, setMediaFrete ] = useState("");
    const [ ultimaData, setUltimaData ] = useState("");

    const service = new FreteService();
    const navigate = useNavigate();

    async function obterDataHora() {
        const response = await service.obterDataHora();
        setAgora(response);
    } 

    async function obterResumo() {
        const response = await service.obterResumo();
        setQuantidade(response.quantidade);
        setMediaFrete(response.mediaFrete);
        setUltimaData(response.ultimaData);
    } 

    useEffect(()=>{
        obterDataHora();
        obterResumo();
    }, []);

    return (
        <div style={{justifyItems:"center"}}>
            <Header nomePagina="HOME" subtitulo="Resumo de seus Registros"/>
            <div>
                <div style={{display:"flex", gap:"20px"}}>
                    <CardResumo titulo="n° de registros" valor={quantidade} />
                    <CardResumo titulo="valor medio do frete" valor={mediaFrete} />
                    <CardResumo titulo="data ultimo registro" valor={ultimaData ? ultimaData : "nenhum registro salvo"} />
                </div>
            </div>
            <div>
                <p>Olá, você acessou essa página em <strong>{agora}</strong></p>
            </div>
            <div>
                <button type="button" onClick={() => navigate("/calculo-frete")}>Ir para pagina de Cálculo</button>
            </div>
        </div>
    );
}

export default Home;