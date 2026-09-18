package com.example.demo.excecoes;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class RespostaErro {
    Integer statu;
    String titulo;
    String mensagem;
    String path;
    List<String> erros;
    String dataHora;
}
