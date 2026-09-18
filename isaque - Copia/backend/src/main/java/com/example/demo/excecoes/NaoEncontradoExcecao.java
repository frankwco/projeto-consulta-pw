package com.example.demo.excecoes;

public class NaoEncontradoExcecao extends RuntimeException {
    public NaoEncontradoExcecao(String mensagem) {
        super(mensagem);
    }
}
