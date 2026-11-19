package com.provabase.dto;

import java.math.BigDecimal;

public record DashboardResponse(
        long total,
        long ativos,
        long pendentes,
        long concluidos,
        BigDecimal somaValores
) {}
