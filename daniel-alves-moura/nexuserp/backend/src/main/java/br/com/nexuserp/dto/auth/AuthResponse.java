package br.com.nexuserp.dto.auth;

import br.com.nexuserp.entity.Role;

public record AuthResponse(
        String token,
        Long id,
        String name,
        String email,
        Role role
) {}
