package br.com.nexuserp.service;

import br.com.nexuserp.dto.category.*;
import br.com.nexuserp.entity.Category;
import br.com.nexuserp.exception.BusinessException;
import br.com.nexuserp.exception.ResourceNotFoundException;
import br.com.nexuserp.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {
    private final CategoryRepository repository;

    public CategoryService(CategoryRepository repository) { this.repository = repository; }

    public List<CategoryResponse> list() {
        return repository.findAllByOrderByNameAsc().stream().map(this::toResponse).toList();
    }

    public CategoryResponse create(CategoryRequest request) {
        if (repository.existsByNameIgnoreCase(request.name())) throw new BusinessException("Categoria já existe");
        return toResponse(repository.save(new Category(request.name().trim(), request.description())));
    }

    public CategoryResponse update(Long id, CategoryRequest request) {
        if (repository.existsByNameIgnoreCaseAndIdNot(request.name(), id)) throw new BusinessException("Categoria já existe");
        var c = find(id);
        c.setName(request.name().trim());
        c.setDescription(request.description());
        return toResponse(repository.save(c));
    }

    public void delete(Long id) { repository.delete(find(id)); }

    public Category find(Long id) {
        return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada"));
    }

    private CategoryResponse toResponse(Category c) { return new CategoryResponse(c.getId(), c.getName(), c.getDescription()); }
}
