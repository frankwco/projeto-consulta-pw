package com.example.demo.dto;

import com.example.demo.enums.TipoEnvio;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

public record CalculoRequestDTO(
        @NotNull(message = "valor peso nao deve ser nulo")
        @Positive(message = "peso deve ser valor positivo e maior que 0") 
        Double peso,
        @Min(value = 1, message = "distancia minima de 1 km") 
        @Max(value = 5000, message = "distancia maxima de 5000 km") 
        @NotNull(message = "valor distancia nao deve ser nulo")
        Double distancia,
        @PositiveOrZero 
        @Min(value = 0, message = "urgencia minima de 0") 
        @Max(value = 100, message = "urgencia maxima de 100") 
        Double urgencia,
        @NotNull(message = "tipo de envio nao deve ser nulo")
        TipoEnvio tipoEnvio

) {

}