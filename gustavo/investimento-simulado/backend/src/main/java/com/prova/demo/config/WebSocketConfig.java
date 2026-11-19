package com.prova.demo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

import com.prova.demo.realtime.NotificacaoWebSocketHandler;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final NotificacaoWebSocketHandler notificacaoHandler;

    public WebSocketConfig(NotificacaoWebSocketHandler notificacaoHandler) {
        this.notificacaoHandler = notificacaoHandler;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(notificacaoHandler, "/ws/notificacoes")
            .setAllowedOrigins("http://localhost:5173");
    }
}
