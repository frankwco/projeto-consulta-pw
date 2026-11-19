import { useState } from "react";
import BaseButton from "../components/BaseButton";
import HomePageLayout from "../layouts/HomePageLayout";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  // A função é executada apenas na abertura da página; não é necessário
  // useEffect para criar um valor inicial que não depende de algo externo.
  const [dataHora] = useState(() => new Date());

  const goToMainPage = () => {
    navigate("/main");
  };

  return (
    <>
      <HomePageLayout text={'home'}>
        <h1>Olá você acessou a página dia {dataHora.toLocaleString("pt-BR")}</h1>
        <div style={{display:"flex"}}>
        <BaseButton
          text="Realizar calculo de investimento"
          color="#689E39"
          action={goToMainPage}
        />
        </div>
      </HomePageLayout>
    </>
  );
};

export default HomePage;
