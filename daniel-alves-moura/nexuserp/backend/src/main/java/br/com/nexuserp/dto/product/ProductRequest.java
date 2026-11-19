package br.com.nexuserp.dto.product;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public record ProductRequest(
        @NotBlank @Size(max = 60) String sku,
        @NotBlank @Size(min = 2, max = 160) String name,
        @Size(max = 500) String description,
        @NotNull @DecimalMin("0.01") BigDecimal price,
        @NotNull @Min(0) Integer stock,
        boolean active,
        @NotNull Long categoryId
) {}
