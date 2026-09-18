package com.conectasocial.backend.service;

import com.conectasocial.backend.dto.AuthDtos.*;
import com.conectasocial.backend.dto.UserDtos.UserSummary;
import com.conectasocial.backend.entity.*;
import com.conectasocial.backend.exception.BusinessException;
import com.conectasocial.backend.repository.UserRepository;
import com.conectasocial.backend.security.JwtService;
import org.springframework.security.authentication.*;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final AuthenticationManager manager;
    private final JwtService jwt;

    public AuthService(UserRepository users, PasswordEncoder encoder,
                       AuthenticationManager manager, JwtService jwt) {
        this.users = users; this.encoder = encoder; this.manager = manager; this.jwt = jwt;
    }

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        String username = req.username().trim().toLowerCase();
        String email = req.email().trim().toLowerCase();
        if (users.existsByUsernameIgnoreCase(username)) throw new BusinessException("Username já está em uso");
        if (users.existsByEmailIgnoreCase(email)) throw new BusinessException("E-mail já está em uso");

        User u = new User();
        u.setUsername(username); u.setDisplayName(req.displayName().trim()); u.setEmail(email);
        u.setPassword(encoder.encode(req.password())); u.setRole(Role.USER); u.setActive(true);
        users.save(u);
        return authenticate(email, req.password());
    }

    public AuthResponse login(LoginRequest req) { return authenticate(req.email().trim().toLowerCase(), req.password()); }

    private AuthResponse authenticate(String email, String password) {
        Authentication a = manager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
        UserDetails principal = (UserDetails) a.getPrincipal();
        User u = users.findByEmailIgnoreCase(email).orElseThrow();
        return new AuthResponse(jwt.generate(principal), "Bearer", summary(u));
    }

    private UserSummary summary(User u) { return new UserSummary(u.getId(), u.getUsername(), u.getDisplayName(), u.getAvatarUrl(), u.getRole()); }
}
