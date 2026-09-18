package br.com.nexuserp.service;

import br.com.nexuserp.dto.customer.*;
import br.com.nexuserp.entity.Customer;
import br.com.nexuserp.exception.BusinessException;
import br.com.nexuserp.exception.ResourceNotFoundException;
import br.com.nexuserp.repository.CustomerRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class CustomerService {
    private final CustomerRepository repository;

    public CustomerService(CustomerRepository repository) { this.repository = repository; }

    public Page<CustomerResponse> list(String q, Pageable pageable) {
        Page<Customer> page = (q == null || q.isBlank())
                ? repository.findAll(pageable)
                : repository.findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(q, q, pageable);
        return page.map(this::toResponse);
    }

    public CustomerResponse get(Long id) { return toResponse(find(id)); }

    public CustomerResponse create(CustomerRequest request) {
        if (repository.existsByEmailIgnoreCase(request.email())) throw new BusinessException("E-mail já utilizado por outro cliente");
        var customer = new Customer();
        apply(customer, request);
        return toResponse(repository.save(customer));
    }

    public CustomerResponse update(Long id, CustomerRequest request) {
        if (repository.existsByEmailIgnoreCaseAndIdNot(request.email(), id)) throw new BusinessException("E-mail já utilizado por outro cliente");
        var customer = find(id);
        apply(customer, request);
        return toResponse(repository.save(customer));
    }

    public void delete(Long id) { repository.delete(find(id)); }

    private Customer find(Long id) {
        return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado"));
    }

    private void apply(Customer c, CustomerRequest r) {
        c.setName(r.name().trim());
        c.setEmail(r.email().trim().toLowerCase());
        c.setPhone(blankToNull(r.phone()));
        c.setDocument(blankToNull(r.document()));
        c.setAddress(blankToNull(r.address()));
    }

    private String blankToNull(String value) { return value == null || value.isBlank() ? null : value.trim(); }

    public CustomerResponse toResponse(Customer c) {
        return new CustomerResponse(c.getId(), c.getName(), c.getEmail(), c.getPhone(), c.getDocument(), c.getAddress(), c.getCreatedAt(), c.getUpdatedAt());
    }
}
