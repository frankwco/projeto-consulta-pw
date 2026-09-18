package com.provabase.dto;

import com.provabase.entity.StatusRegistro;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record RegistroResponse(
        Long id,
        String nome,
        String descricao,
        String categoria,
        BigDecimal valor,
        StatusRegistro status,
        LocalDateTime criadoEm,
        LocalDateTime atualizadoEm
) {}
