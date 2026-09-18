package com.prova.demo.realtime;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Service
public class EventoSseService {

    private static final long TEMPO_LIMITE = 30 * 60 * 1_000L;
    private final Map<String, SseEmitter> emissores = new ConcurrentHashMap<>();

    public SseEmitter conectar() {
        String id = UUID.randomUUID().toString();
        SseEmitter emissor = new SseEmitter(TEMPO_LIMITE);
        emissores.put(id, emissor);

        emissor.onCompletion(() -> emissores.remove(id));
        emissor.onTimeout(() -> {
            emissores.remove(id);
            emissor.complete();
        });

        enviar(id, emissor, EventoTempoReal.criar("CONECTADO", "Canal SSE conectado"));
        return emissor;
    }

    public void publicar(String tipo, String mensagem) {
        EventoTempoReal evento = EventoTempoReal.criar(tipo, mensagem);
        emissores.forEach((id, emissor) -> enviar(id, emissor, evento));
    }

    @Scheduled(fixedRate = 15_000)
    public void manterConexoesAtivas() {
        publicar("HEARTBEAT", "Conexão ativa");
    }

    private void enviar(String id, SseEmitter emissor, EventoTempoReal evento) {
        try {
            emissor.send(SseEmitter.event()
                .name("notificacao")
                .id(UUID.randomUUID().toString())
                .data(evento));
        } catch (IOException | IllegalStateException exception) {
            emissores.remove(id);
        }
    }
}
