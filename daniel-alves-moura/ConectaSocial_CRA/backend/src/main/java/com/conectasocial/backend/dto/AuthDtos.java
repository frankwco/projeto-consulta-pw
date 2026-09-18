package com.conectasocial.backend.dto;

import jakarta.validation.constraints.*;

public final class AuthDtos {
    private AuthDtos() {}

    public record RegisterRequest(
        @NotBlank @Size(min = 3, max = 40) @Pattern(regexp = "^[a-zA-Z0-9_.]+$") String username,
        @NotBlank @Size(max = 100) String displayName,
        @NotBlank @Email String email,
        @NotBlank @Size(min = 8, max = 72) String password
    ) {}

    public record LoginRequest(
        @NotBlank @Email String email,
        @NotBlank String password
    ) {}

    public record AuthResponse(
        String token,
        String type,
        UserDtos.UserSummary user
    ) {}
}
