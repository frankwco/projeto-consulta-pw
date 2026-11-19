package com.example.demo.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.CalculoRequestDTO;
import com.example.demo.dto.CalculoResponseDTO;
import com.example.demo.dto.FreteResponseDTO;
import com.example.demo.dto.ResumoDTO;
import com.example.demo.service.FreteService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/frete")
@CrossOrigin
public class FreteController {

    @Autowired
    private FreteService service;

    @PostMapping("/calcular")
    public ResponseEntity<CalculoResponseDTO> calcular(@Valid @RequestBody CalculoRequestDTO request) {
        return ResponseEntity.ok(service.calcular(request));
    }

    @PostMapping()
    public ResponseEntity<FreteResponseDTO> salvar(@Valid @RequestBody CalculoRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.salvar(request));
    }

    @GetMapping("/data-hora")
    public ResponseEntity<String> obterDataHora() {
        return ResponseEntity.ok(service.obterDataHora());
    }

    @GetMapping("/resumo")
    public ResponseEntity<ResumoDTO> obterResumo() {
        return ResponseEntity.ok(service.obterResumo());
    }

    @GetMapping()
    public ResponseEntity<List<FreteResponseDTO>> listarTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/filtro-data")
    public ResponseEntity<List<FreteResponseDTO>> listarDataEntre(@RequestParam LocalDate inicio, @RequestParam LocalDate fim) {
        return ResponseEntity.ok(service.listarDataEntre(inicio, fim));
    }

    @GetMapping("/filtro-peso")
    public ResponseEntity<List<FreteResponseDTO>> listarPesoEntre(@RequestParam Double minimo, @RequestParam Double maximo) {
        return ResponseEntity.ok(service.listarPesoEntre(minimo, maximo));
    }

    @GetMapping("/filtro-distancia")
    public ResponseEntity<List<FreteResponseDTO>> listarDistanciaEntre(@RequestParam Double minimo, @RequestParam Double maximo) {
        return ResponseEntity.ok(service.listarDistanciaEntre(minimo, maximo));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarId(@PathVariable("id") Long id) {
        service.deletarId(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping()
    public ResponseEntity<Void> deletarTodos() {
        service.deletarTodos();
        return ResponseEntity.noContent().build();
    }
}
