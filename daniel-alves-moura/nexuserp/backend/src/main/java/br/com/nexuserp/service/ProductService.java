package br.com.nexuserp.service;

import br.com.nexuserp.dto.product.*;
import br.com.nexuserp.entity.Product;
import br.com.nexuserp.exception.BusinessException;
import br.com.nexuserp.exception.ResourceNotFoundException;
import br.com.nexuserp.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProductService {
    private final ProductRepository repository;
    private final CategoryService categoryService;

    public ProductService(ProductRepository repository, CategoryService categoryService) {
        this.repository = repository;
        this.categoryService = categoryService;
    }

    @Transactional(readOnly = true)
    public Page<ProductResponse> list(String q, Pageable pageable) {
        var page = (q == null || q.isBlank()) ? repository.findAll(pageable) : repository.search(q, pageable);
        return page.map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public ProductResponse get(Long id) { return toResponse(find(id)); }

    public ProductResponse create(ProductRequest request) {
        if (repository.existsBySkuIgnoreCase(request.sku())) throw new BusinessException("SKU já cadastrado");
        var p = new Product();
        apply(p, request);
        return toResponse(repository.save(p));
    }

    public ProductResponse update(Long id, ProductRequest request) {
        if (repository.existsBySkuIgnoreCaseAndIdNot(request.sku(), id)) throw new BusinessException("SKU já cadastrado");
        var p = find(id);
        apply(p, request);
        return toResponse(repository.save(p));
    }

    public void delete(Long id) { repository.delete(find(id)); }

    public Product find(Long id) {
        return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado"));
    }

    private void apply(Product p, ProductRequest r) {
        p.setSku(r.sku().trim().toUpperCase());
        p.setName(r.name().trim());
        p.setDescription(r.description());
        p.setPrice(r.price());
        p.setStock(r.stock());
        p.setActive(r.active());
        p.setCategory(categoryService.find(r.categoryId()));
    }

    public ProductResponse toResponse(Product p) {
        return new ProductResponse(p.getId(), p.getSku(), p.getName(), p.getDescription(), p.getPrice(), p.getStock(), p.isActive(),
                p.getCategory().getId(), p.getCategory().getName(), p.getCreatedAt(), p.getUpdatedAt());
    }
}
