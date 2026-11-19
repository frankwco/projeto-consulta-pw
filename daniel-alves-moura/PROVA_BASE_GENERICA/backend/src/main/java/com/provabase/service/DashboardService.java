package com.provabase.service;

import com.provabase.dto.DashboardResponse;
import com.provabase.entity.StatusRegistro;
import com.provabase.repository.RegistroRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DashboardService {
    private final RegistroRepository repository;

    public DashboardService(RegistroRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public DashboardResponse resumo() {
        return new DashboardResponse(
                repository.count(),
                repository.countByStatus(StatusRegistro.ATIVO),
                repository.countByStatus(StatusRegistro.PENDENTE),
                repository.countByStatus(StatusRegistro.CONCLUIDO),
                repository.somarValores()
        );
    }
}
