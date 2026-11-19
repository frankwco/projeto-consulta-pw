package com.prova.demo.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.prova.demo.model.Calculo;
import com.prova.demo.realtime.NotificacaoService;
import com.prova.demo.service.CalculoService;



@RestController
@RequestMapping("/main")
@CrossOrigin(origins = "http://localhost:5173")
public class CalculoController {
    
    private final CalculoService calculoService;
    private final NotificacaoService notificacaoService;

    public CalculoController(CalculoService calculoService, NotificacaoService notificacaoService) {
        this.calculoService = calculoService;
        this.notificacaoService = notificacaoService;
    }
    
    @PostMapping()
    public ResponseEntity<Calculo> inserirCalculo(@RequestBody Calculo calculo){
        Calculo calculoSalvo = calculoService.criarCalculo(calculo);
        notificacaoService.publicar("CALCULO_SALVO", "Um novo cálculo foi salvo");
        return ResponseEntity.status(HttpStatus.CREATED).body(calculoSalvo);
    }

    @PostMapping("/calculando")
    public double calcularValor(@RequestBody  Calculo calculo){
        return calculoService.calcularValor(calculo);
    }

    @GetMapping()
    public ResponseEntity<List<Calculo>> listarTodos(){
        return ResponseEntity.ok(calculoService.listarTodos());
    }

    @GetMapping("/data/{data}")
    public ResponseEntity<List<Calculo>> buscarPorData(@PathVariable LocalDate data){
        return ResponseEntity.ok(calculoService.findByData(data));
    }

    @GetMapping("juro/{juro}")
    public ResponseEntity<List<Calculo>> buscarPorJuro(@PathVariable int juro){
        return ResponseEntity.ok(calculoService.findByJuros(juro));
    }

    @DeleteMapping()
    public ResponseEntity<Void> deletarDados(){
        calculoService.deletarTodos();
        notificacaoService.publicar("CALCULOS_LIMPOS", "Todos os cálculos foram removidos");
        return ResponseEntity.noContent().build();
    }
}
