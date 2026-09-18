package br.com.nexuserp.dto.order;

import br.com.nexuserp.entity.OrderStatus;
import jakarta.validation.constraints.NotNull;

public record OrderStatusRequest(@NotNull OrderStatus status) {}
