package com.provabase.specification;

import com.provabase.dto.RegistroFiltro;
import com.provabase.entity.Registro;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Monta dinamicamente o WHERE da consulta.
 *
 * Para adaptar na prova, normalmente basta trocar/adicionar os campos usados
 * em root.get("campo") e os tipos de comparação (like, equal, >=, <= etc.).
 */
public final class RegistroSpecifications {

    private RegistroSpecifications() {
    }

    public static Specification<Registro> comFiltros(RegistroFiltro filtro) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Busca livre em vários campos ao mesmo tempo.
            if (temTexto(filtro.busca())) {
                String termo = "%" + filtro.busca().trim().toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.<String>get("nome")), termo),
                        cb.like(cb.lower(cb.coalesce(root.<String>get("descricao"), "")), termo),
                        cb.like(cb.lower(cb.coalesce(root.<String>get("categoria"), "")), termo)
                ));
            }

            // Filtro específico por nome.
            if (temTexto(filtro.nome())) {
                String nome = "%" + filtro.nome().trim().toLowerCase() + "%";
                predicates.add(cb.like(cb.lower(root.<String>get("nome")), nome));
            }

            // Categoria parcial. Se a prova pedir igualdade exata, use cb.equal(...).
            if (temTexto(filtro.categoria())) {
                String categoria = "%" + filtro.categoria().trim().toLowerCase() + "%";
                predicates.add(cb.like(
                        cb.lower(cb.coalesce(root.<String>get("categoria"), "")),
                        categoria
                ));
            }

            if (filtro.status() != null) {
                predicates.add(cb.equal(root.get("status"), filtro.status()));
            }

            if (filtro.valorMin() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("valor"), filtro.valorMin()));
            }

            if (filtro.valorMax() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("valor"), filtro.valorMax()));
            }

            if (filtro.dataInicio() != null) {
                LocalDateTime inicio = filtro.dataInicio().atStartOfDay();
                predicates.add(cb.greaterThanOrEqualTo(root.get("criadoEm"), inicio));
            }

            if (filtro.dataFim() != null) {
                // < início do dia seguinte inclui qualquer horário do dataFim.
                LocalDateTime fimExclusivo = filtro.dataFim().plusDays(1).atStartOfDay();
                predicates.add(cb.lessThan(root.get("criadoEm"), fimExclusivo));
            }

            return cb.and(predicates.toArray(Predicate[]::new));
        };
    }

    private static boolean temTexto(String valor) {
        return valor != null && !valor.isBlank();
    }
}
