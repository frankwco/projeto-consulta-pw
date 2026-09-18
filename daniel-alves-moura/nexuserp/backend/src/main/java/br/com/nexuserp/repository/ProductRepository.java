package br.com.nexuserp.repository;

import br.com.nexuserp.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    @EntityGraph(attributePaths = {"category"})
    @Query("""
        select p from Product p
        join p.category c
        where lower(p.name) like lower(concat('%', :q, '%'))
           or lower(p.sku) like lower(concat('%', :q, '%'))
           or lower(c.name) like lower(concat('%', :q, '%'))
        """)
    Page<Product> search(@Param("q") String q, Pageable pageable);

    @Override
    @EntityGraph(attributePaths = {"category"})
    Page<Product> findAll(Pageable pageable);

    boolean existsBySkuIgnoreCase(String sku);
    boolean existsBySkuIgnoreCaseAndIdNot(String sku, Long id);
    long countByActiveTrue();
    long countByStockLessThanEqual(Integer stock);
    @EntityGraph(attributePaths = {"category"})
    List<Product> findTop5ByStockLessThanEqualOrderByStockAsc(Integer stock);
}
