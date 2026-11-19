package com.provabase.service;

import com.provabase.dto.RegistroFiltro;
import com.provabase.dto.RegistroRequest;
import com.provabase.dto.RegistroResponse;
import com.provabase.entity.Registro;
import com.provabase.exception.ResourceNotFoundException;
import com.provabase.repository.RegistroRepository;
import com.provabase.specification.RegistroSpecifications;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Set;

@Service
public class RegistroService {
    private static final Set<String> CAMPOS_ORDENACAO = Set.of(
            "id", "nome", "categoria", "valor", "status", "criadoEm", "atualizadoEm"
    );

    private final RegistroRepository repository;

    public RegistroService(RegistroRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public Page<RegistroResponse> listar(
            RegistroFiltro filtro,
            int page,
            int size,
            String sort,
            String direction) {

        validarFiltros(filtro);

        int paginaSegura = Math.max(page, 0);
        int tamanhoSeguro = Math.min(Math.max(size, 1), 100);
        String campoOrdenacao = CAMPOS_ORDENACAO.contains(sort) ? sort : "id";
        Sort.Direction direcao = "asc".equalsIgnoreCase(direction)
                ? Sort.Direction.ASC
                : Sort.Direction.DESC;

        PageRequest pageable = PageRequest.of(
                paginaSegura,
                tamanhoSeguro,
                Sort.by(direcao, campoOrdenacao)
        );

        return repository.findAll(RegistroSpecifications.comFiltros(filtro), pageable)
                .map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public RegistroResponse buscarPorId(Long id) {
        return toResponse(encontrar(id));
    }

    @Transactional
    public RegistroResponse criar(RegistroRequest request) {
        Registro registro = new Registro();
        aplicar(request, registro);
        return toResponse(repository.save(registro));
    }

    @Transactional
    public RegistroResponse atualizar(Long id, RegistroRequest request) {
        Registro registro = encontrar(id);
        aplicar(request, registro);
        return toResponse(repository.save(registro));
    }

    @Transactional
    public void excluir(Long id) {
        Registro registro = encontrar(id);
        repository.delete(registro);
    }

    private void validarFiltros(RegistroFiltro filtro) {
        if (filtro.valorMin() != null && filtro.valorMax() != null
                && filtro.valorMin().compareTo(filtro.valorMax()) > 0) {
            throw new IllegalArgumentException("valorMin não pode ser maior que valorMax");
        }

        if (filtro.dataInicio() != null && filtro.dataFim() != null
                && filtro.dataInicio().isAfter(filtro.dataFim())) {
            throw new IllegalArgumentException("dataInicio não pode ser posterior a dataFim");
        }
    }

    private Registro encontrar(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Registro " + id + " não encontrado"));
    }

    private void aplicar(RegistroRequest request, Registro registro) {
        registro.setNome(request.nome().trim());
        registro.setDescricao(request.descricao());
        registro.setCategoria(request.categoria());
        registro.setValor(request.valor() == null ? BigDecimal.ZERO : request.valor());
        registro.setStatus(request.status());
    }

    private RegistroResponse toResponse(Registro r) {
        return new RegistroResponse(
                r.getId(), r.getNome(), r.getDescricao(), r.getCategoria(), r.getValor(),
                r.getStatus(), r.getCriadoEm(), r.getAtualizadoEm()
        );
    }
}
