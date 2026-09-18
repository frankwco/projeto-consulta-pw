package com.example.demo.excecoes;

public class NegocioExcecao extends RuntimeException {
    public NegocioExcecao(String mensagem) {
        super(mensagem);
    }
}
