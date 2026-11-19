package com.prova.demo.model;
import java.time.LocalDate;

import org.checkerframework.checker.index.qual.Positive;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
public class Calculo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Positive
    private double valorInicial;
    @Positive
    private int prazo;
    @Positive
    private int juro;
    
    private double valorFinal;
    private LocalDate data;

}
