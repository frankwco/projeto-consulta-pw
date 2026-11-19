package com.conectasocial.backend.repository;

import com.conectasocial.backend.entity.User;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmailIgnoreCase(String email);
    Optional<User> findByUsernameIgnoreCase(String username);
    boolean existsByEmailIgnoreCase(String email);
    boolean existsByUsernameIgnoreCase(String username);
    Page<User> findByUsernameContainingIgnoreCaseOrDisplayNameContainingIgnoreCase(
        String username, String displayName, Pageable pageable);
}
