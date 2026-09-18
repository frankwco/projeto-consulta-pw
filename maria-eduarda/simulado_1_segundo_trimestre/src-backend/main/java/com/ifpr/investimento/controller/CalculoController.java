package com.ifpr.investimento.controller;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ifpr.investimento.model.Calculo;
import com.ifpr.investimento.service.CalculoService;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/calculo")
@CrossOrigin(origins = "*")
public class CalculoController {
    
    @Autowired
    private CalculoService service;

    @GetMapping("/calcular")
    public ResponseEntity<Double> calcular(
            @RequestParam Double valorInicial,
            @RequestParam Integer prazoMeses,
            @RequestParam Double juroMensal) {
        Double resultado = service.calcular(valorInicial, prazoMeses, juroMensal);
        return ResponseEntity.ok(resultado);
    }

    @PostMapping
    public ResponseEntity<Calculo> salvar(@Valid @RequestBody Calculo calculo) {
        Calculo salvo = service.salvar(calculo);
        return ResponseEntity.ok(salvo);
    }

    @GetMapping
    public ResponseEntity<List<Calculo>> listarTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @DeleteMapping
    public ResponseEntity<Void> limparTabela() {
        service.limparTabela();
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/filtro/data")
    public ResponseEntity<List<Calculo>> filtrarPorData(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate data) {
        return ResponseEntity.ok(service.filtrarPorData(data));
    }

    @GetMapping("/filtro/prazo-juro")
    public ResponseEntity<List<Calculo>> filtrarPorPrazoOuJuro(
            @RequestParam(required = false) Integer prazo,
            @RequestParam(required = false) Double juro) {
        return ResponseEntity.ok(service.filtrarPorPrazoOuJuro(prazo, juro));
    }

}