package br.com.nexuserp.repository;

import br.com.nexuserp.entity.Order;
import br.com.nexuserp.entity.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
    @Override
    @EntityGraph(attributePaths = {"customer"})
    Page<Order> findAll(Pageable pageable);

    @EntityGraph(attributePaths = {"customer", "items", "items.product"})
    Optional<Order> findDetailedById(Long id);

    long countByStatus(OrderStatus status);

    @Query("select coalesce(sum(o.total), 0) from Order o where o.status <> br.com.nexuserp.entity.OrderStatus.CANCELED")
    BigDecimal totalRevenue();

    @EntityGraph(attributePaths = {"customer"})
    List<Order> findTop5ByOrderByCreatedAtDesc();
}
