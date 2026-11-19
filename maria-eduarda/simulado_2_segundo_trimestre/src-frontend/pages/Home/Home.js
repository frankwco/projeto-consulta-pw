import Header from '../../components/Header'
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AtividadeService from '../../service/AtividadeService';

function Home(){
    const navigate = useNavigate();
    const[dataHora, setDataHora] = useState('');

    const service = new AtividadeService();

    useEffect(() => {
        handleData();
    }, []);


    const handleData = async() => {
         const data = await service.data();
         setDataHora(data);
    }

   

    return (
        <div>
            <Header titulo = "Página principal"></Header>
            <h2>Bem vindo! você entrou em:</h2>
            <h3>{dataHora}</h3>
            <button 
            onClick={() => navigate("/atividade")}>
                Registrar Atividade</button>
        </div>
    );
}

export default Home;