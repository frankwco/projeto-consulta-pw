package br.com.nexuserp.dto.dashboard;

import br.com.nexuserp.dto.order.OrderResponse;
import br.com.nexuserp.dto.product.ProductResponse;

import java.math.BigDecimal;
import java.util.List;

public record DashboardResponse(
        long customers,
        long activeProducts,
        long orders,
        long pendingOrders,
        long lowStockProducts,
        BigDecimal totalRevenue,
        List<OrderResponse> recentOrders,
        List<ProductResponse> lowStock
) {}
