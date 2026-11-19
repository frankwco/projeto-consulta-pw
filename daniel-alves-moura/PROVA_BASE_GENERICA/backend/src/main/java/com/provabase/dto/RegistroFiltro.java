package com.provabase.dto;

import com.provabase.entity.StatusRegistro;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Filtros opcionais do CRUD genérico.
 *
 * Todos os campos podem ser nulos/vazios. A Specification só adiciona ao SQL
 * os filtros que realmente foram informados pelo cliente.
 */
public record RegistroFiltro(
        String busca,
        String nome,
        String categoria,
        StatusRegistro status,
        BigDecimal valorMin,
        BigDecimal valorMax,
        LocalDate dataInicio,
        LocalDate dataFim
) {
}
