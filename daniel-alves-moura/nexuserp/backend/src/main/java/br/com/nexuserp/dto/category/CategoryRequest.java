package br.com.nexuserp.dto.category;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CategoryRequest(
        @NotBlank @Size(min = 2, max = 100) String name,
        @Size(max = 300) String description
) {}
