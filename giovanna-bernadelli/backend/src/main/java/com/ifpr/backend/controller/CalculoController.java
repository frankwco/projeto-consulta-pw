package com.ifpr.backend.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ifpr.backend.model.Calculo;
import com.ifpr.backend.service.ServiceCalculo;

@CrossOrigin
@RestController
@RequestMapping("/calculoFrete")
public class CalculoController {
    
    @Autowired
    private ServiceCalculo service;

    @PostMapping("/calcular")
    public Double calcularFrete(@RequestBody Calculo calc) {
        return service.calcularFrete(calc);
    }

    @PostMapping("/adicionar")
    public Calculo adicionar (@RequestBody Calculo calc){
        return service.adicionarCalculo(calc);
    }

    @GetMapping("/listarTodos")
    public List<Calculo> listar (){
        return service.listar();
    }

    @GetMapping("/listarTodos/{distancia}")
    public List<Calculo> listarPorDistancia (@PathVariable Double distancia){
        return service.filtrarPorDistancia(distancia);
    }

    @GetMapping("/hora")
    public LocalDate mostrarHora() {
        return service.horaAgora();
    }
    @GetMapping("/hora/{data}")
    public List<Calculo> filtrarPorData(@PathVariable LocalDate data) {
        return service.acharPorData(data);
    }
    
    @GetMapping("/quantidade")
    public Long quantidadeSimulacoes() {
        return service.quantidadeSimulacoes();
    }

    @GetMapping("/media")
    public Double mediaSimulacoes() {
        return service.media();
    }

    @GetMapping("/ultima")
    public LocalDate ultimaSimulacao() {
        return service.ultimaSimulacao();
    }
    @DeleteMapping("excluir/{id}")
    public void deletar (@PathVariable Long id){
        service.excluirCalculo(id);
    }

    @DeleteMapping("/deletarTodos")
    public void deletarTodos() {
        service.excluirTodos();
    }
}
