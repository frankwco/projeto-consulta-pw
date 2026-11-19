package com.conectasocial.backend.dto;

import jakarta.validation.constraints.*;
import org.springframework.format.annotation.DateTimeFormat;
import java.time.*;

public final class PostDtos {
    private PostDtos() {}

    public record PostRequest(
        @NotBlank @Size(max = 2000) String content,
        @Size(max = 700) String imageUrl
    ) {}

    public record PostResponse(
        Long id,
        UserDtos.UserSummary author,
        String content,
        String imageUrl,
        long likes,
        long comments,
        boolean likedByMe,
        boolean mine,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
    ) {}

    public record PostFilter(
        String q,
        String author,
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {}
}
