package com.provabase.repository;

import com.provabase.entity.Registro;
import com.provabase.entity.StatusRegistro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;

public interface RegistroRepository extends JpaRepository<Registro, Long>, JpaSpecificationExecutor<Registro> {

    /*
     * O JpaSpecificationExecutor fornece findAll(Specification, Pageable),
     * permitindo combinar filtros opcionais sem criar um método para cada
     * combinação possível.
     */

    long countByStatus(StatusRegistro status);

    @Query("SELECT COALESCE(SUM(r.valor), 0) FROM Registro r")
    BigDecimal somarValores();
}
