package com.ifpr.investimento.model;

import java.time.LocalDate;
import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
@Entity
public class Calculo{

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotNull(message = "Valor inicial é obrigatório")
    @Positive(message = "O valor inicial deve ser positivo")
    private float valorInicial;

    @NotNull(message = "Prazo é obrigatório")
    @Positive(message = "O prazo deve ser positivo")
    private int prazoMeses;

    @NotNull(message = "Juro mensal é obrigatório")
    @Positive(message = "A taxa de juros deve ser positiva")
    private float jurosMensal;

    private float valorFinal;

    private LocalDate dataCalculo;

    public UUID getId() {return id;}
    public void setId(UUID id) {this.id = id;}

    public float getValorInicial() {return valorInicial;}
    public void setValorInicial(float valorInicial) {this.valorInicial = valorInicial;}

    public int getPrazoMeses() {return prazoMeses;}
    public void setPrazoMeses(int prazoMeses) {this.prazoMeses = prazoMeses;}

    public float getJurosMensal() {return jurosMensal;}
    public void setJurosMensal(float jurosMensal) {this.jurosMensal = jurosMensal;}

    public float getValorFinal() {return valorFinal;}
    public void setValorFinal(float valorFinal) {this.valorFinal = valorFinal;}

    public LocalDate getDataCalculo() {return dataCalculo;}
    public void setDataCalculo(LocalDate dataCalculo) {this.dataCalculo = dataCalculo;}
}