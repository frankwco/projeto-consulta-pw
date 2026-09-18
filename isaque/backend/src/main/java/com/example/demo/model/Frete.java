package com.example.demo.model;

import java.time.LocalDate;

import com.example.demo.enums.TipoEnvio;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

@Entity
@Table
@Data
public class Frete {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Positive
    private Double peso;

    @Positive
    @Min(1)
    @Max(5000)
    private Double distancia;

    @Enumerated(EnumType.STRING)
    private TipoEnvio tipoEnvio;

    @PositiveOrZero
    @Min(0)
    @Max(100)
    private Double urgencia;

    @Positive
    private Double valor;

    @NotNull
    private LocalDate data;
}
