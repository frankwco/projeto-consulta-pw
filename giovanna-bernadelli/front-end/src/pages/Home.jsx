import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import CalculoService from '../service/CalculoService';
import Header from './Header';
import '../css/Home.css';

const Home = () => {
    
    const [data, setData] = useState("");
    const [simulacoes, setSimulacoes] = useState("");
    const [media, setMedia] = useState("");
    const [dataUltima, setDataUltima] = useState("");

    const navigate = useNavigate();
    const service = new CalculoService();

    const carregarHora = async () => {
        const resposta = service.mostrarData();
        setData(resposta);
    };

    const carregarSimulacoes = async () => {
        const resposta = service.mostrarSimulacoes();
        setSimulacoes(resposta);
    };

    const carregarMedia = async () => {
        const resposta = service.mostrarMedia();
        setMedia(resposta);
    };
    const carregarUltimaSimulacao = async () => {
        const resposta = service.mostrarUltimaSimulacao();
        setDataUltima(resposta);
    };

    useEffect(() => {
        carregarUltimaSimulacao();
    }, []);

    useEffect(() => {
        carregarMedia();
    }, []);

    useEffect(() => {
        carregarHora();
    }, []);

    useEffect(() => {
        carregarSimulacoes();
    }, []);


    return (
        <>
            {<Header nome="Frank" />}
            <div className='info'>
                <p className='primeira'>Você acessou a página em: {data}</p>
                <p className='info-escrita'>Simulações feitas: {simulacoes}</p>
                <p className='info-escrita'>Média de simulações: {media}</p>
                <p className='info-escrita'>Ultima simulação: {dataUltima}</p>
            </div>
            
            <button className ="botao-entrar" onClick={()=>{navigate("/DashBoard")}}>FAZER NOVA SIMULAÇÃO</button>
        </>
    );
}
export default Home;
