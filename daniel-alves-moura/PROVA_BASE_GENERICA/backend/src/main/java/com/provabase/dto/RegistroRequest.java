package com.provabase.dto;

import com.provabase.entity.StatusRegistro;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record RegistroRequest(
        @NotBlank(message = "Nome é obrigatório")
        @Size(max = 120, message = "Nome deve ter no máximo 120 caracteres")
        String nome,

        @Size(max = 500, message = "Descrição deve ter no máximo 500 caracteres")
        String descricao,

        @Size(max = 80, message = "Categoria deve ter no máximo 80 caracteres")
        String categoria,

        @DecimalMin(value = "0.0", inclusive = true, message = "Valor não pode ser negativo")
        BigDecimal valor,

        @NotNull(message = "Status é obrigatório")
        StatusRegistro status
) {}
