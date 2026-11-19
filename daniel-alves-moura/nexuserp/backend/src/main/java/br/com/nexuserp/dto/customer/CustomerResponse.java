package br.com.nexuserp.dto.customer;

import java.time.LocalDateTime;

public record CustomerResponse(
        Long id,
        String name,
        String email,
        String phone,
        String document,
        String address,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
