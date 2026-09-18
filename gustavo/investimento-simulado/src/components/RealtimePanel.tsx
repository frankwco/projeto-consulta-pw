import { useEffect, useRef, useState } from "react";
import BaseButton from "./BaseButton";
import BaseInputField from "./BaseInputField";

interface EventoTempoReal {
  tipo: string;
  mensagem: string;
  dataHora: string;
}

interface RealtimePanelProps {
  onCalculosChanged: () => void | Promise<void>;
}

const RealtimePanel = ({ onCalculosChanged }: RealtimePanelProps) => {
  const [statusWebSocket, setStatusWebSocket] = useState("conectando");
  const [statusSse, setStatusSse] = useState("conectando");
  const [mensagem, setMensagem] = useState("Olá pelo WebSocket");
  const [eventos, setEventos] = useState<string[]>([]);
  const webSocketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const webSocket = new WebSocket("ws://localhost:8081/ws/notificacoes");
    const eventSource = new EventSource("http://localhost:8081/api/eventos/calculos");
    webSocketRef.current = webSocket;

    webSocket.onopen = () => setStatusWebSocket("conectado");
    webSocket.onclose = () => setStatusWebSocket("desconectado");
    webSocket.onerror = () => setStatusWebSocket("erro");
    webSocket.onmessage = (event) => {
      const recebido = JSON.parse(event.data) as EventoTempoReal;
      setEventos((atuais) => [`WS: ${recebido.tipo} - ${recebido.mensagem}`, ...atuais].slice(0, 8));
    };

    eventSource.onopen = () => setStatusSse("conectado");
    eventSource.onerror = () => setStatusSse("reconectando");

    const receberSse = (event: Event) => {
      const recebido = JSON.parse((event as MessageEvent<string>).data) as EventoTempoReal;
      setEventos((atuais) => [`SSE: ${recebido.tipo} - ${recebido.mensagem}`, ...atuais].slice(0, 8));

      if (recebido.tipo === "CALCULO_SALVO" || recebido.tipo === "CALCULOS_LIMPOS") {
        void onCalculosChanged();
      }
    };

    eventSource.addEventListener("notificacao", receberSse);

    // O retorno do useEffect encerra conexões quando a página é desmontada.
    return () => {
      webSocket.close();
      eventSource.removeEventListener("notificacao", receberSse);
      eventSource.close();
      webSocketRef.current = null;
    };
  }, [onCalculosChanged]);

  function enviarMensagem() {
    if (webSocketRef.current?.readyState === WebSocket.OPEN) {
      webSocketRef.current.send(mensagem);
    }
  }

  return (
    <section style={{ border: "1px solid #bbb", borderRadius: 6, margin: "2rem", padding: "1rem" }}>
      <h2>Tempo real</h2>
      <p>WebSocket: <strong>{statusWebSocket}</strong> | SSE: <strong>{statusSse}</strong></p>
      <div style={{ display: "flex", gap: "1rem", alignItems: "end" }}>
        <div style={{ flex: 1 }}>
          <BaseInputField label="Mensagem WebSocket" inputType="text" value={mensagem} onChange={(event) => setMensagem(event.target.value)} />
        </div>
        <BaseButton text="Enviar" color="#1A76D2" action={enviarMensagem} />
      </div>
      <ul aria-live="polite">
        {eventos.map((evento, index) => <li key={`${evento}-${index}`}>{evento}</li>)}
      </ul>
    </section>
  );
};

export default RealtimePanel;
