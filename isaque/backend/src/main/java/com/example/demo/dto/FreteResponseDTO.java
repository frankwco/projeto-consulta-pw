package com.example.demo.dto;

import java.time.LocalDate;

import com.example.demo.enums.TipoEnvio;

public record FreteResponseDTO(
        Long id,
        Double peso,
        Double distancia,
        TipoEnvio tipoEnvio,
        Double urgencia,
        Double valor,
        LocalDate data

) {

}