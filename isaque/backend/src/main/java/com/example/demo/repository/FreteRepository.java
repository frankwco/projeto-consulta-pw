package com.example.demo.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.Frete;

@Repository
public interface FreteRepository extends JpaRepository<Frete, Long> {

    public List<Frete> findByDataBetween(LocalDate inicio, LocalDate fim);

    public List<Frete> findByPesoBetween(Double minimo, Double maximo);

    public List<Frete> findByDistanciaBetween(Double minimo, Double maximo);
}
