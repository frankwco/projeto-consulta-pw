package br.com.nexuserp.service;

import br.com.nexuserp.dto.order.*;
import br.com.nexuserp.entity.*;
import br.com.nexuserp.exception.BusinessException;
import br.com.nexuserp.exception.ResourceNotFoundException;
import br.com.nexuserp.repository.CustomerRepository;
import br.com.nexuserp.repository.OrderRepository;
import br.com.nexuserp.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class OrderService {
    private final OrderRepository orderRepository;
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;

    public OrderService(OrderRepository orderRepository, CustomerRepository customerRepository, ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.customerRepository = customerRepository;
        this.productRepository = productRepository;
    }

    public Page<OrderResponse> list(Pageable pageable) {
        return orderRepository.findAll(pageable).map(this::toSummary);
    }

    @Transactional(readOnly = true)
    public OrderResponse get(Long id) { return toResponse(findDetailed(id)); }

    @Transactional
    public OrderResponse create(OrderRequest request) {
        var customer = customerRepository.findById(request.customerId())
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado"));

        var order = new Order();
        order.setCustomer(customer);
        order.setStatus(OrderStatus.PENDING);
        var total = BigDecimal.ZERO;

        for (var reqItem : request.items()) {
            var product = productRepository.findById(reqItem.productId())
                    .orElseThrow(() -> new ResourceNotFoundException("Produto " + reqItem.productId() + " não encontrado"));
            if (!product.isActive()) throw new BusinessException("Produto inativo: " + product.getName());
            if (product.getStock() < reqItem.quantity()) throw new BusinessException("Estoque insuficiente para " + product.getName());

            var subtotal = product.getPrice().multiply(BigDecimal.valueOf(reqItem.quantity()));
            var item = new OrderItem();
            item.setProduct(product);
            item.setQuantity(reqItem.quantity());
            item.setUnitPrice(product.getPrice());
            item.setSubtotal(subtotal);
            order.addItem(item);

            product.setStock(product.getStock() - reqItem.quantity());
            total = total.add(subtotal);
        }

        order.setTotal(total);
        var saved = orderRepository.save(order);
        return toResponse(saved);
    }

    @Transactional
    public OrderResponse updateStatus(Long id, OrderStatus newStatus) {
        var order = findDetailed(id);
        if (order.getStatus() == OrderStatus.CANCELED && newStatus != OrderStatus.CANCELED) {
            throw new BusinessException("Pedido cancelado não pode ser reaberto");
        }
        if (newStatus == OrderStatus.CANCELED && order.getStatus() != OrderStatus.CANCELED) {
            order.getItems().forEach(item -> {
                var p = item.getProduct();
                p.setStock(p.getStock() + item.getQuantity());
            });
        }
        order.setStatus(newStatus);
        return toResponse(orderRepository.save(order));
    }

    public Order findDetailed(Long id) {
        return orderRepository.findDetailedById(id).orElseThrow(() -> new ResourceNotFoundException("Pedido não encontrado"));
    }

    public OrderResponse toSummary(Order o) {
        return new OrderResponse(o.getId(), o.getCustomer().getId(), o.getCustomer().getName(), o.getStatus(), o.getTotal(), null, o.getCreatedAt(), o.getUpdatedAt());
    }

    public OrderResponse toResponse(Order o) {
        var items = o.getItems().stream().map(i -> new OrderItemResponse(
                i.getId(), i.getProduct().getId(), i.getProduct().getName(), i.getProduct().getSku(),
                i.getQuantity(), i.getUnitPrice(), i.getSubtotal())).toList();
        return new OrderResponse(o.getId(), o.getCustomer().getId(), o.getCustomer().getName(), o.getStatus(), o.getTotal(), items, o.getCreatedAt(), o.getUpdatedAt());
    }
}
