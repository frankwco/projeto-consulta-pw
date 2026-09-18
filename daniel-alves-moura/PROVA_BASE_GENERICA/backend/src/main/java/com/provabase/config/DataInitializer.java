package com.provabase.config;

import com.provabase.entity.*;
import com.provabase.repository.RegistroRepository;
import com.provabase.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;

@Configuration
public class DataInitializer {
    @Bean
    CommandLineRunner init(UsuarioRepository usuarioRepository,
                           RegistroRepository registroRepository,
                           PasswordEncoder encoder) {
        return args -> {
            if (!usuarioRepository.existsByEmail("admin@prova.com")) {
                usuarioRepository.save(new Usuario(
                        "Administrador", "admin@prova.com", encoder.encode("Admin123!"), Role.ADMIN));
            }

            if (registroRepository.count() == 0) {
                registroRepository.save(criar("Exemplo A", "Registro inicial", "Categoria 1", "125.50", StatusRegistro.ATIVO));
                registroRepository.save(criar("Exemplo B", "Troque pelos dados da prova", "Categoria 2", "89.90", StatusRegistro.PENDENTE));
                registroRepository.save(criar("Exemplo C", "Exemplo concluído", "Categoria 1", "250.00", StatusRegistro.CONCLUIDO));
            }
        };
    }

    private Registro criar(String nome, String descricao, String categoria, String valor, StatusRegistro status) {
        Registro r = new Registro();
        r.setNome(nome);
        r.setDescricao(descricao);
        r.setCategoria(categoria);
        r.setValor(new BigDecimal(valor));
        r.setStatus(status);
        return r;
    }
}
