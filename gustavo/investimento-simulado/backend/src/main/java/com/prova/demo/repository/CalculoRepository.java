package com.prova.demo.repository;
import com.prova.demo.model.Calculo;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CalculoRepository extends JpaRepository<Calculo, Long> {

    List<Calculo> findByData(LocalDate date);
    List<Calculo> findByjuro(int juro);
}
