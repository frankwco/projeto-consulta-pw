package com.conectasocial.backend.service;

import com.conectasocial.backend.entity.User;
import com.conectasocial.backend.exception.ResourceNotFoundException;
import com.conectasocial.backend.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class CurrentUserService {
    private final UserRepository users;
    public CurrentUserService(UserRepository users) { this.users = users; }

    public User get() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return users.findByEmailIgnoreCase(email)
            .orElseThrow(() -> new ResourceNotFoundException("Usuário autenticado não encontrado"));
    }
}
