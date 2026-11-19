import { useState } from "react";
import BaseButton from "./BaseButton";
import BaseInputField from "./BaseInputField";
import { autenticar, sair, type UsuarioAutenticado } from "../services/segurancaService";

const SecurityPanel = () => {
  const [usuario, setUsuario] = useState("aluno");
  const [senha, setSenha] = useState("");
  const [autenticado, setAutenticado] = useState<UsuarioAutenticado | null>(null);
  const [erro, setErro] = useState("");

  async function handleEntrar() {
    try {
      setErro("");
      setAutenticado(await autenticar(usuario, senha));
      setSenha("");
    } catch (error) {
      setAutenticado(null);
      setErro(error instanceof Error ? error.message : "Não foi possível autenticar.");
    }
  }

  function handleSair() {
    sair();
    setAutenticado(null);
  }

  return (
    <section style={{ border: "1px solid #bbb", borderRadius: 6, margin: "2rem", padding: "1rem" }}>
      <h2>Segurança</h2>
      <p>Entre como <strong>aluno</strong> para calcular/salvar ou como <strong>admin</strong> para também limpar.</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "end" }}>
        <div>
          <BaseInputField label="Usuário" inputType="text" value={usuario} onChange={(event) => setUsuario(event.target.value)} />
        </div>
        <div>
          <BaseInputField label="Senha" inputType="password" value={senha} onChange={(event) => setSenha(event.target.value)} />
        </div>
        <BaseButton text="Entrar" color="#33691E" action={handleEntrar} />
        {autenticado && <BaseButton text="Sair" color="#585858" action={handleSair} />}
      </div>
      {autenticado && <p>Autenticado: {autenticado.usuario} ({autenticado.permissoes.join(", ")})</p>}
      {erro && <p role="alert" style={{ color: "#b00020" }}>{erro}</p>}
    </section>
  );
};

export default SecurityPanel;
