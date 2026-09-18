package com.ifpr.backend.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ifpr.backend.model.Calculo;

public interface CalculoRepository extends JpaRepository <Calculo, Long>  {
    
    public List<Calculo> findByDataCalculo (LocalDate data);

    public List<Calculo> findByDistanciaEntrega(Double prazo);

    public Calculo findTopByOrderByDataCalculoDesc();
}
