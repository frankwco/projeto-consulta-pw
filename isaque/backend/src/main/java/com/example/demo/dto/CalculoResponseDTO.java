package com.example.demo.dto;

import java.time.LocalDate;

import com.example.demo.enums.TipoEnvio;

public record CalculoResponseDTO(
        LocalDate data,
        TipoEnvio tipoEnvio,
        Double peso,
        Double distancia,
        Double valor) {

}
