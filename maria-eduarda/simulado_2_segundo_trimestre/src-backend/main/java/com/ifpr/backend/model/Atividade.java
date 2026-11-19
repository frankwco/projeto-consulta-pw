package com.ifpr.backend.model;

import java.lang.annotation.Inherited;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;

import jakarta.persistence.*;


@Entity
public class Atividade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private float distancia;
    private float tempo;
    private float velocidadeMedia;
    private String classificacao;
    private LocalDateTime dataHora;

    public Map<String, String> acesso() {
        LocalDateTime agora = LocalDateTime.now();

        DateTimeFormatter dataHoraFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        return Map.of(
            "dataHora",agora.format(dataHoraFormatter)
        );
    } 


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public float getDistancia() {
        return distancia;
    }

    public void setDistancia(float distancia) {
        this.distancia = distancia;
    }

    public float getTempo() {
        return tempo;
    }

    public void setTempo(float tempo) {
        this.tempo = tempo;
    }

    public float getVelocidadeMedia() {
        return velocidadeMedia;
    }

    public void setVelocidadeMedia(float velocidadeMedia) {
        this.velocidadeMedia = velocidadeMedia;
    }

    public LocalDateTime getDataHora() {
        return dataHora;
    }

    public void setDataHora(LocalDateTime dataHora) {
        this.dataHora = dataHora;
    }

    public String getClassificacao() {
        return classificacao;
    }

    public void setClassificacao(String classificacao) {
        this.classificacao = classificacao;
    }
}