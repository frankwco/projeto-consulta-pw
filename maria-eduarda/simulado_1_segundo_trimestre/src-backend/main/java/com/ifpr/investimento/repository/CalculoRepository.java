package com.ifpr.investimento.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ifpr.investimento.model.Calculo;

public interface CalculoRepository extends JpaRepository<Calculo, UUID> {

    List<Calculo> findByDataCalculo(LocalDate dataCalculo);

    @Query("SELECT i FROM Calculo i WHERE i.prazoMeses = :prazo OR i.jurosMensal = :juro")
    List<Calculo> filtrarPorPrazoOuJuro(@Param("prazo") Integer prazo, @Param("juro") Double juro);

}