package com.prova.demo.realtime;

import java.io.IOException;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.ConcurrentWebSocketSessionDecorator;
import org.springframework.web.socket.handler.TextWebSocketHandler;

@Component
public class NotificacaoWebSocketHandler extends TextWebSocketHandler {

    private final Map<String, WebSocketSession> sessoes = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws IOException {
        WebSocketSession sessaoSegura = new ConcurrentWebSocketSessionDecorator(session, 5_000, 8_192);
        sessoes.put(session.getId(), sessaoSegura);
        sessaoSegura.sendMessage(new TextMessage(criarJson("CONECTADO", "WebSocket conectado")));
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) {
        publicar("MENSAGEM", message.getPayload());
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        sessoes.remove(session.getId());
    }

    public void publicar(String tipo, String mensagem) {
        TextMessage evento = new TextMessage(criarJson(tipo, mensagem));

        sessoes.forEach((id, sessao) -> {
            if (!sessao.isOpen()) {
                sessoes.remove(id);
                return;
            }

            try {
                sessao.sendMessage(evento);
            } catch (IOException exception) {
                sessoes.remove(id);
            }
        });
    }

    private String criarJson(String tipo, String mensagem) {
        return "{\"tipo\":\"" + escapar(tipo) + "\",\"mensagem\":\"" + escapar(mensagem)
            + "\",\"dataHora\":\"" + Instant.now() + "\"}";
    }

    private String escapar(String valor) {
        return valor.replace("\\", "\\\\")
            .replace("\"", "\\\"")
            .replace("\r", "\\r")
            .replace("\n", "\\n");
    }
}
