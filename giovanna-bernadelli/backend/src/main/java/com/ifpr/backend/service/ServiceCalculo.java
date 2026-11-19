package com.ifpr.backend.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ifpr.backend.model.Calculo;
import com.ifpr.backend.repository.CalculoRepository;

@Service
public class ServiceCalculo {
    
    @Autowired 
    private CalculoRepository calculoRepository;

    public Double calcularFrete (Calculo frete){
        Double tarifaPeso = 1.20;
        Double tarifaKg = 3.50;
        Double valorFrete=0.0;

        if(frete.getTipoEnvio().equals("EXPRESSO") && frete.getAdicionalUrgencia()!=null && frete.getDistanciaEntrega()>=1 && frete.getDistanciaEntrega()<=5000 && frete.getAdicionalUrgencia()>=0 && frete.getAdicionalUrgencia()<=100){
             valorFrete = ((frete.getPesoPacote() * tarifaKg) + 
            (frete.getDistanciaEntrega() * tarifaPeso)) * 
            (1+(frete.getAdicionalUrgencia()/100));
        }
        else if (frete.getTipoEnvio().equals("ECONOMICO") && frete.getDistanciaEntrega() >= 1
                && frete.getDistanciaEntrega() <= 5000 && frete.getAdicionalUrgencia() >= 0
                && frete.getAdicionalUrgencia() <= 100){

             valorFrete = ((frete.getPesoPacote() * tarifaKg) + 
            (frete.getDistanciaEntrega() * tarifaPeso));
        }   
        frete.setValorFrete(valorFrete);
        frete.setDataCalculo(LocalDate.now());
        return valorFrete;
    }

    public Calculo adicionarCalculo (Calculo calc){
        calcularFrete(calc);
        calc.setDataCalculo(LocalDate.now());
        return calculoRepository.save(calc);
    }

    public void excluirCalculo(Long id) {
       calculoRepository.deleteById(id);
    }

    public void excluirTodos(){
        calculoRepository.deleteAll();
    }

    public List<Calculo> listar (){
        return calculoRepository.findAll();
    }

    public List<Calculo> filtrarPorDistancia(Double distancia) {
        return calculoRepository.findByDistanciaEntrega(distancia);
    }

    public LocalDate horaAgora (){
        return LocalDate.now();
    }

    public Long quantidadeSimulacoes () {
        return calculoRepository.count();
    }

    public Double media() {
        Double media =0.0;
        List<Calculo> acha = calculoRepository.findAll();
        for (Calculo c: acha){
            media=+c.getValorFrete();
        }
        return media/acha.size();
    }

    public LocalDate ultimaSimulacao () {
        Calculo acha = calculoRepository.findTopByOrderByDataCalculoDesc();
        return acha.getDataCalculo();
    }

    public List<Calculo> acharPorData(LocalDate data){
        return calculoRepository.findByDataCalculo(data);
    }
}
