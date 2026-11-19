package com.ifpr.backend.service;


import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ifpr.backend.model.Atividade;
import com.ifpr.backend.repository.AtividadeRepository;

@Service
public class AtividadeService{

    @Autowired
    private AtividadeRepository repository;

    private Atividade atividade;

    public Atividade create(Atividade atividade){
        if (atividade.getDataHora() == null) {
        atividade.setDataHora(java.time.LocalDateTime.now());
    }
        atividade.setVelocidadeMedia(calcular(atividade));
        atividade.setClassificacao(classificacao(atividade.getVelocidadeMedia()));
        return repository.save(atividade);
    }

    public Atividade update(Atividade atividade){
        Atividade salvo = repository.findById(atividade.getId()).orElseThrow(() -> new NoSuchElementException("Atividade não encontrada"));
        if (salvo != null) {
            salvo.setDistancia(salvo.getDistancia());
            salvo.setTempo(salvo.getTempo());
            salvo.setVelocidadeMedia(calcular(atividade));
            if (atividade.getDataHora() != null) {
                salvo.setDataHora(atividade.getDataHora());
            }
            salvo.setClassificacao(classificacao(salvo.getVelocidadeMedia()));
            return repository.save(salvo);
        }
        return null;
    }

    public void delete(Long id){
        repository.deleteById(id);
    }

    public List<Atividade> listAll(){
        return repository.findAll();
    }

    public void deleteAll() {
        repository.deleteAll();
    }

    public float calcular(Atividade atividade){
        return (float) atividade.getDistancia() / (atividade.getTempo() / 60);
    }

    public LocalDateTime getDataHora() {
        return LocalDateTime.now();
    }

    public String classificacao(float velocidadeMedia) {
        if (velocidadeMedia < 5) {
            return "Caminhada";
        } else if(velocidadeMedia >= 5 && velocidadeMedia < 10) {
            return "Trote";
        } else {
            return "Corrida";
        }
    }

    public List<Atividade> listarPorClassificacao(String classificacao){
        return repository.findByClassificacao(classificacao);
    }


}