package com.prova.demo.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.checkerframework.checker.units.qual.A;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.AutoConfigureOrder;
import org.springframework.stereotype.Service;

import com.prova.demo.model.Calculo;
import com.prova.demo.repository.CalculoRepository;

@Service
public class CalculoService {


    @Autowired
    private CalculoRepository calculoRepository;
    
    public Calculo criarCalculo(Calculo calculo){
        calculo.setValorFinal(calcularValor(calculo));
        calculo.setData(LocalDate.now());
        return calculoRepository.save(calculo);
    }

    public double calcularValor(Calculo calculo){
        System.out.println(calculo.getValorInicial());
        System.out.println(calculo.getPrazo());
        System.out.println(calculo.getJuro());

        double result = calculo.getValorInicial() * Math.pow((1+(calculo.getJuro()/100.0)), calculo.getPrazo());
        result = Math.round(result * 100.0) / 100.0;

        System.out.println(result);

        return result;
    }

    public List<Calculo> listarTodos(){
        return calculoRepository.findAll();
    }

    public List<Calculo> findByData(LocalDate date){
        System.out.println("chamou");
        return calculoRepository.findByData(date);
    }

    public List<Calculo> findByJuros(int juro){
        return calculoRepository.findByjuro(juro);
    }

    public void deletarTodos(){
        calculoRepository.deleteAll();
    }

}
