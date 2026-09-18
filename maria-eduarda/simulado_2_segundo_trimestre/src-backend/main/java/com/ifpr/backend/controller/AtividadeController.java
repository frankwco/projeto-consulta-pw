package com.ifpr.backend.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ifpr.backend.model.Atividade;
import com.ifpr.backend.service.AtividadeService;


@RestController
@RequestMapping("/atividade")
@CrossOrigin
public class AtividadeController {
    
    @Autowired
    private AtividadeService service;

    @PostMapping
    public Atividade create(@RequestBody Atividade atividade) {
        return service.create(atividade);
    }

    @PutMapping
    public Atividade update(@RequestBody Atividade atividade) {
        return service.update(atividade);
    }

    @GetMapping
    public java.util.List<Atividade> listAll() {
        return service.listAll();
    }

    @DeleteMapping("/limpar")
    public void deleteAll() {
        service.deleteAll();
    }

    @PostMapping("/calcular")
    public float calcular(@RequestBody Atividade atividade) {
        return service.calcular(atividade);
    }

    @GetMapping("/dataHora")
    public LocalDateTime getDataHora() {
            return service.getDataHora();
        }

    @GetMapping("/classificacao/{classificacao}")
    public List <Atividade> listarPorClassificacao(@PathVariable String classificacao){
        return service.listarPorClassificacao(classificacao);
    }
}