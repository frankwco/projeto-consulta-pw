package com.ifpr.investimento.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ifpr.investimento.model.Calculo;
import com.ifpr.investimento.repository.CalculoRepository;

@Service
public class CalculoService {

    @Autowired
    private CalculoRepository repository;

    public Double calcular(Double valorInicial, Integer prazoMeses, Double juroMensal) {
        return valorInicial * Math.pow((1 + (juroMensal / 100.0)), prazoMeses);
    }

    // Renomeado para 'salvar' e feito o cast explícito de float <-> Double
    public Calculo salvar(Calculo calculo){
        Double valorFinal = calcular(
            (double) calculo.getValorInicial(), 
            calculo.getPrazoMeses(), 
            (double) calculo.getJurosMensal()
        );
        calculo.setValorFinal(valorFinal.floatValue());
        calculo.setDataCalculo(LocalDate.now());
        return repository.save(calculo);
    }

    public List<Calculo> listarTodos(){
        return repository.findAll();
    }

    public void limparTabela() {
        repository.deleteAll();
    }

    public List<Calculo> filtrarPorData(LocalDate data) {
        return repository.findByDataCalculo(data);
    }

    public List<Calculo> filtrarPorPrazoOuJuro(Integer prazo, Double juro) {
        return repository.filtrarPorPrazoOuJuro(prazo, juro);
    }
}