package com.ifpr.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ifpr.backend.model.Atividade;

public interface AtividadeRepository extends JpaRepository<Atividade, Long> {
    List<Atividade> findByClassificacao(String classificacao);
}