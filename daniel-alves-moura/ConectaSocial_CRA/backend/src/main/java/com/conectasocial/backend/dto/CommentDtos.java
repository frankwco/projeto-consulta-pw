package com.conectasocial.backend.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

public final class CommentDtos {
    private CommentDtos() {}

    public record CommentRequest(@NotBlank @Size(max = 1000) String content) {}

    public record CommentResponse(
        Long id,
        UserDtos.UserSummary author,
        String content,
        boolean mine,
        LocalDateTime createdAt
    ) {}
}
