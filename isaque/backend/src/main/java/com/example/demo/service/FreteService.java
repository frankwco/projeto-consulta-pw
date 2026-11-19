package com.example.demo.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.CalculoRequestDTO;
import com.example.demo.dto.CalculoResponseDTO;
import com.example.demo.dto.FreteResponseDTO;
import com.example.demo.dto.ResumoDTO;
import com.example.demo.enums.TipoEnvio;
import com.example.demo.excecoes.NaoEncontradoExcecao;
import com.example.demo.excecoes.NegocioExcecao;
import com.example.demo.model.Frete;
import com.example.demo.repository.FreteRepository;

@Service
public class FreteService {

    @Autowired
    private FreteRepository repository;

    private Double taxaPeso = 3.50;
    private Double taxaDistancia = 1.20;

    public CalculoResponseDTO calcular(CalculoRequestDTO request) {
        Double valor = 0.0;
        if (request.tipoEnvio() == TipoEnvio.ECONOMICO) {
            if (request.urgencia() > 0) {
                throw new NegocioExcecao("urgencia deve ser 0 se tipo de envio for ECONOMICO");
            }
            valor = calcularEconomico(request.peso(), request.distancia());
        } else {
            if(request.urgencia() == null){
                throw new NegocioExcecao("urgencia nao deve ser nula se tipo de envio for EXPRESSO");
            }
            if (request.urgencia() <= 0) {
                throw new NegocioExcecao("urgencia deve ser maior que 0 se tipo de envio for EXPRESSO");
            }
            valor = calcularExpresso(request.peso(), request.distancia(), request.urgencia());

        }

        return new CalculoResponseDTO(
                LocalDate.now(),
                request.tipoEnvio(),
                request.peso(),
                request.distancia(),
                valor);
    }

    public FreteResponseDTO salvar(CalculoRequestDTO request) {
        Double valor = 0.0;
        if (request.tipoEnvio() == TipoEnvio.ECONOMICO) {
            if (request.urgencia() > 0) {
                throw new NegocioExcecao("urgencia deve ser 0 se tipo de envio for ECONOMICO");
            }
            valor = calcularEconomico(request.peso(), request.distancia());
        } else {
            if (request.urgencia() == null) {
                throw new NegocioExcecao("urgencia nao deve ser nula se tipo de envio for EXPRESSO");
            }
            if (request.urgencia() <= 0) {
                throw new NegocioExcecao("urgencia deve ser maior que 0 se tipo de envio for EXPRESSO");
            }
            valor = calcularExpresso(request.peso(), request.distancia(), request.urgencia());

        }

        Frete frete = new Frete();
        frete.setPeso(request.peso());
        frete.setDistancia(request.distancia());
        frete.setPeso(request.peso());
        frete.setTipoEnvio(request.tipoEnvio());
        frete.setUrgencia(request.urgencia());
        frete.setValor(valor);
        frete.setData(LocalDate.now());

        repository.save(frete);

        return toResponse(frete);
    }

    public ResumoDTO obterResumo() {
        List<Frete> lista = repository.findAll();

        if (lista.size() == 0) {
            return new ResumoDTO(0, 0.0, null);
        }

        Double media = lista.stream().mapToDouble(Frete::getValor).average().orElse(0.0);

        LocalDate ultimaData = lista.stream().map(Frete::getData).max(LocalDate::compareTo).orElse(null);

        return new ResumoDTO(lista.size(), media, ultimaData);
    }

    public List<FreteResponseDTO> listarTodos() {
        return repository.findAll()
        .stream()
        .map(this::toResponse)
        .collect(Collectors.toList());
    }

    public List<FreteResponseDTO> listarDataEntre(LocalDate inicio, LocalDate fim) {
        if (fim.isBefore(inicio)) {
            throw new NegocioExcecao("data final deve ser posterior a data inicial");
        }
        return repository.findByDataBetween(inicio, fim)
        .stream()
        .map(this::toResponse)
        .collect(Collectors.toList());
    }

    public List<FreteResponseDTO> listarPesoEntre(Double minimo, Double maximo) {
        if (maximo < minimo) {
            throw new NegocioExcecao("peso maximo deve ser maior que o peso minimo");
        }
        return repository.findByPesoBetween(minimo, maximo).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<FreteResponseDTO> listarDistanciaEntre(Double minimo, Double maximo) {
        if(maximo < minimo) {
            throw new NegocioExcecao("distancia maxima deve ser maior que a distancia minima");
        }
        return repository.findByDistanciaBetween(minimo, maximo).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public String obterDataHora() {
        LocalDateTime agora = LocalDateTime.now();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");

        return agora.format(formatter);
    }

    public void deletarId(Long id) {
        if (!repository.existsById(id)) {
            throw new NaoEncontradoExcecao("id nao encontrado para deletar");
        }
        repository.deleteById(id);
    }

    public void deletarTodos() {
        repository.deleteAll();
    }

    private FreteResponseDTO toResponse(Frete frete){
        return new FreteResponseDTO(
            frete.getId(),
            frete.getPeso(),
            frete.getDistancia(),
            frete.getTipoEnvio(),
            frete.getUrgencia(),
            frete.getValor(),
            frete.getData());
    }

    private Double calcularEconomico(Double peso, Double distancia) {
        return (peso * taxaPeso) + (distancia * taxaDistancia);
    }

    private Double calcularExpresso(Double peso, Double distancia, Double urgencia) {
        Double valor = (peso * taxaPeso) + (distancia * taxaDistancia);

        Double valorTotal = valor * (1.0 + (urgencia / 100.0));

        return valorTotal;
    }

}
