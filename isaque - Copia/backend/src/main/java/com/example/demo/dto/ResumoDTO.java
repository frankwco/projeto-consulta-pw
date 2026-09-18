package com.example.demo.dto;

import java.time.LocalDate;

public record ResumoDTO(
        Integer quantidade,
        Double mediaFrete,
        LocalDate ultimaData) {

}
