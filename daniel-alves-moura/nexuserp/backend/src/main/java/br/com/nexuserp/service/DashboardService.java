package br.com.nexuserp.service;

import br.com.nexuserp.dto.dashboard.DashboardResponse;
import br.com.nexuserp.entity.OrderStatus;
import br.com.nexuserp.repository.CustomerRepository;
import br.com.nexuserp.repository.OrderRepository;
import br.com.nexuserp.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DashboardService {
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final ProductService productService;
    private final OrderService orderService;

    public DashboardService(CustomerRepository customerRepository, ProductRepository productRepository,
                            OrderRepository orderRepository, ProductService productService, OrderService orderService) {
        this.customerRepository = customerRepository;
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
        this.productService = productService;
        this.orderService = orderService;
    }

    @Transactional(readOnly = true)
    public DashboardResponse get() {
        var recent = orderRepository.findTop5ByOrderByCreatedAtDesc().stream().map(orderService::toSummary).toList();
        var low = productRepository.findTop5ByStockLessThanEqualOrderByStockAsc(5).stream().map(productService::toResponse).toList();
        return new DashboardResponse(
                customerRepository.count(),
                productRepository.countByActiveTrue(),
                orderRepository.count(),
                orderRepository.countByStatus(OrderStatus.PENDING),
                productRepository.countByStockLessThanEqual(5),
                orderRepository.totalRevenue(),
                recent,
                low
        );
    }
}
