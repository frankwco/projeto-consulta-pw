package com.conectasocial.backend.dto;

import com.conectasocial.backend.entity.Role;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

public final class UserDtos {
    private UserDtos() {}

    public record UserSummary(Long id, String username, String displayName, String avatarUrl, Role role) {}

    public record UserProfile(
        Long id,
        String username,
        String displayName,
        String email,
        String bio,
        String avatarUrl,
        String location,
        Role role,
        long posts,
        long followers,
        long following,
        boolean followingByMe,
        LocalDateTime createdAt
    ) {}

    public record UpdateProfileRequest(
        @NotBlank @Size(max = 100) String displayName,
        @Size(max = 280) String bio,
        @Size(max = 500) String avatarUrl,
        @Size(max = 100) String location
    ) {}
}
