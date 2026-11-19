package com.prova.demo.controller;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/seguranca")
public class SegurancaController {

    @GetMapping("/usuario-atual")
    public UsuarioAutenticado usuarioAtual(Authentication authentication) {
        List<String> permissoes = authentication.getAuthorities().stream()
            .map(authority -> authority.getAuthority())
            .toList();

        return new UsuarioAutenticado(authentication.getName(), permissoes);
    }

    public record UsuarioAutenticado(String usuario, List<String> permissoes) {
    }
}
