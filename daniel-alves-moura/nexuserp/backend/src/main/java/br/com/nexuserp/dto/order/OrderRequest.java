package br.com.nexuserp.dto.order;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record OrderRequest(
        @NotNull Long customerId,
        @NotEmpty List<@Valid OrderItemRequest> items
) {}
