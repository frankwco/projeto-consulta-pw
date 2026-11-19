package com.ifpr.backend.model;

import java.time.LocalDate;

import org.hibernate.annotations.Changelog.Timestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Entity
@Data
public class Calculo {
    
     @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Positive
   
    private Double pesoPacote;

    @Positive
    private Double valorFrete;

    @Positive
    private Double distanciaEntrega;

    @Positive
    @Column(nullable = true)
    private Double adicionalUrgencia;

    @NotBlank
    private String tipoEnvio;

    @Timestamp
    private LocalDate dataCalculo;


}
