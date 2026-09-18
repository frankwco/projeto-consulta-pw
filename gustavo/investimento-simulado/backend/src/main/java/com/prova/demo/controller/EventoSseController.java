package com.prova.demo.controller;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.prova.demo.realtime.EventoSseService;

@RestController
@RequestMapping("/api/eventos")
public class EventoSseController {

    private final EventoSseService eventoService;

    public EventoSseController(EventoSseService eventoService) {
        this.eventoService = eventoService;
    }

    @GetMapping(path = "/calculos", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter acompanharCalculos() {
        return eventoService.conectar();
    }
}
