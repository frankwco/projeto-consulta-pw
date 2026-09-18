package com.prova.demo.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(Customizer.withDefaults())
            // A API usa HTTP Basic e não mantém sessão. Em uma aplicação com
            // cookies, mantenha CSRF habilitado e envie o token no frontend.
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(authorize -> authorize
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers("/ws/**", "/api/eventos/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/main/**").permitAll()
                .requestMatchers(HttpMethod.DELETE, "/main/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/main/**").hasRole("USER")
                .requestMatchers("/api/seguranca/**").authenticated()
                .anyRequest().permitAll())
            .httpBasic(Customizer.withDefaults());

        return http.build();
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    UserDetailsService userDetailsService(PasswordEncoder passwordEncoder) {
        UserDetails aluno = User.builder()
            .username("aluno")
            .password(passwordEncoder.encode("prova123"))
            .roles("USER")
            .build();

        UserDetails administrador = User.builder()
            .username("admin")
            .password(passwordEncoder.encode("admin123"))
            .roles("USER", "ADMIN")
            .build();

        // Usuários em memória são ótimos para prova e estudo. Em produção,
        // substitua por UserDetailsService ligado ao banco de dados.
        return new InMemoryUserDetailsManager(aluno, administrador);
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173"));
        configuration.setAllowedMethods(List.of("GET", "POST", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
