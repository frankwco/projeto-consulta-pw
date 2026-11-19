package com.prova.demo.realtime;

import org.springframework.stereotype.Service;

@Service
public class NotificacaoService {

    private final NotificacaoWebSocketHandler webSocket;
    private final EventoSseService sse;

    public NotificacaoService(NotificacaoWebSocketHandler webSocket, EventoSseService sse) {
        this.webSocket = webSocket;
        this.sse = sse;
    }

    public void publicar(String tipo, String mensagem) {
        webSocket.publicar(tipo, mensagem);
        sse.publicar(tipo, mensagem);
    }
}
