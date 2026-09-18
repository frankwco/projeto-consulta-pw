import MainPageLayout from "../layouts/MainPageLayout";
import BaseButton from "../components/BaseButton";
import BaseInputField from "../components/BaseInputField";
import BaseResult from "../components/BaseResultField";
import BaseTable from "../components/BaseTable";
import type { Calculo } from "../components/BaseTable";
import { useNavigate } from "react-router-dom";
import { calcular, deletarTodos, salvar, filtrarPorData, listarTodos } from "../services/calculoService";
import { useCallback, useEffect, useState } from "react";
import SecurityPanel from "../components/SecurityPanel";
import RealtimePanel from "../components/RealtimePanel";

const MainPage = () =>{

    const [valor, setValor] = useState(0);
    const [valorInicial, setValorInicial] = useState(0);
    const [prazo, setPrazo] = useState(0);
    const [juro, setJuro] = useState(0);
    const [data, setData] = useState("");
    const [history, setHistorico] = useState<Calculo[]>([]);
    const [erro, setErro] = useState("");
    const navigate = useNavigate();

    const carregarHistorico = useCallback(async () => {
        try {
            const calculos = await listarTodos();
            setHistorico(calculos);
            setErro("");
        } catch (error) {
            setErro(error instanceof Error ? error.message : "Não foi possível carregar os cálculos.");
        }
    }, []);

    useEffect(() => {
        let paginaAtiva = true;

        void listarTodos()
            .then((calculos) => {
                if (paginaAtiva) {
                    setHistorico(calculos);
                    setErro("");
                }
            })
            .catch((error: unknown) => {
                if (paginaAtiva) {
                    setErro(error instanceof Error ? error.message : "Não foi possível carregar os cálculos.");
                }
            });

        return () => {
            paginaAtiva = false;
        };
    }, []);

    async function handleFiltrarPorData() {
        try {
            setHistorico(await filtrarPorData(data));
            setErro("");
        } catch (error) {
            setErro(error instanceof Error ? error.message : "Não foi possível filtrar.");
        }
    }


    async function handleCalcular() {
        const calculo = {
            valorInicial,
            prazo,
            juro
        }
        try {
            setValor(await calcular(calculo));
            setErro("");
        } catch (error) {
            setErro(error instanceof Error ? error.message : "Não foi possível calcular.");
        }
    }

    async function handleSalvar(){
        const calculo = {
            valorInicial,
            prazo,
            juro
        }
        try {
            const calculoSalvo = await salvar(calculo);
            setValor(calculoSalvo.valorFinal ?? 0);
            setErro("");
        } catch (error) {
            setErro(error instanceof Error ? error.message : "Não foi possível salvar.");
        }
    }

    async function handleLimpar() {
        try {
            await deletarTodos();
            setHistorico([]);
            setErro("");
        } catch (error) {
            setErro(error instanceof Error ? error.message : "Não foi possível limpar os dados.");
        }
    }

    const goToHomePage = () =>{
        navigate("/")
    }

    return(
    <>
        <MainPageLayout text="Cálculo" title=" - Listagem">
            <SecurityPanel />
            <RealtimePanel onCalculosChanged={carregarHistorico} />
            {erro && <p role="alert" style={{ color: "#b00020", margin: "2rem" }}>{erro}</p>}
            <section style={{display:"flex", flexDirection:"column", gap: "2rem", width:"30rem", margin:"2rem"}}>
            <BaseInputField label="Valor inicial" inputType="number" minValue={1} required={true} value={valorInicial} onChange={(e) => setValorInicial(Number(e.target.value))}/>
            <BaseInputField label="Prazo em meses" inputType="number" minValue={1} required={true} value={prazo} onChange={(e) => setPrazo(Number(e.target.value))}/>
            <BaseInputField label="Juro Mensal" inputType="number" minValue={1} required={true} value={juro} onChange={(e) => setJuro(Number(e.target.value))}/>
            <BaseButton text="calcular" color="#689E39" action={handleCalcular}></BaseButton>
            <BaseResult text="o valor final será de:" result={valor}/>
            <BaseButton text="salvar" color="#689E39" action={handleSalvar}/>
            </section>
            <section style={{display:"flex"}}>
            <section style={{display:"flex"}}>
            <div style={{display:"flex",flexDirection:"column", gap: "2rem", maxWidth:"20rem", margin:"2rem"}}>
                <BaseInputField label="Filtrar por data" inputType="date" required={true} value={data} onChange={(e) => setData(e.target.value)}/>
            </div>
            <div style={{margin:'3rem'}}>
                <BaseButton text="pesquisar" color="#1A76D2" action={handleFiltrarPorData}/>
            </div>
            </section>
            <section style={{display:"flex"}}>
            <div style={{display:"flex",flexDirection:"column", gap: "2rem", maxWidth:"20rem", margin:"2rem"}}>
                <BaseInputField label="Filtrar por prazo ou juros" inputType="number"/>
            </div>
            <div style={{margin:'3rem'}}>
                <BaseButton text="pesquisar" color="#1A76D2" action={handleCalcular}/>
            </div>
            </section>
            </section>
            <BaseTable history={history}></BaseTable>
            <div style={{display:"flex",margin:"3rem", gap:"27rem"}}>
            <BaseButton text='voltar para o home' color="#689E39" action={goToHomePage} />
            <BaseButton text='Limpar dados' color="#fc0000" action={handleLimpar} />
            </div>
        </MainPageLayout>
    </>
    );
}


export default MainPage;
