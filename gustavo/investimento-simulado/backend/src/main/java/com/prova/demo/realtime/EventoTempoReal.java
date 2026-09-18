package com.prova.demo.realtime;

import java.time.Instant;

public record EventoTempoReal(String tipo, String mensagem, Instant dataHora) {

    public static EventoTempoReal criar(String tipo, String mensagem) {
        return new EventoTempoReal(tipo, mensagem, Instant.now());
    }
}
