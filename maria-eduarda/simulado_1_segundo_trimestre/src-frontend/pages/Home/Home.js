import { useState, useEffect } from 'react'; // <- Faltava essa linha!
import './Home.css';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';

function Home() {
    const navigate = useNavigate(); 
    const [dataHora, setDataHora] = useState('');

    useEffect(() => {
        const agora = new Date();
        const dataFormatada = agora.toLocaleDateString('pt-BR');
        const horaFormatada = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        setDataHora(`dia ${dataFormatada} às ${horaFormatada}`);
    }, []);

    const handleLogin = () => {
        navigate('/calculo');
    };

    return (
        <div className="Home">
            <Header titulo="Cálculo de Investimento"/>
            <div className='home-content'>
                <div className='home-card'>
                    <h2>Olá você acessou essa página em {dataHora}</h2>
                    <button onClick={handleLogin}>
                        Realizar o Cálculo de Investimento
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Home;