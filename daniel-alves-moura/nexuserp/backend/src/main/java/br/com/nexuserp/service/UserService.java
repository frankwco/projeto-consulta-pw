package br.com.nexuserp.service;

import br.com.nexuserp.dto.user.UserResponse;
import br.com.nexuserp.exception.ResourceNotFoundException;
import br.com.nexuserp.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepository repository;

    public UserService(UserRepository repository) { this.repository = repository; }

    public Page<UserResponse> list(Pageable pageable) { return repository.findAll(pageable).map(this::toResponse); }

    public UserResponse toggleActive(Long id) {
        var user = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));
        user.setActive(!user.isActive());
        return toResponse(repository.save(user));
    }

    private UserResponse toResponse(br.com.nexuserp.entity.User u) {
        return new UserResponse(u.getId(), u.getName(), u.getEmail(), u.getRole(), u.isActive(), u.getCreatedAt());
    }
}
