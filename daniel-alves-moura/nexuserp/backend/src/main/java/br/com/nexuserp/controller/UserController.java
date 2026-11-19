package br.com.nexuserp.controller;

import br.com.nexuserp.dto.user.UserResponse;
import br.com.nexuserp.service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@PreAuthorize("hasRole('ADMIN')")
public class UserController {
    private final UserService service;
    public UserController(UserService service) { this.service = service; }

    @GetMapping public Page<UserResponse> list(@PageableDefault(size = 10, sort = "name") Pageable pageable) { return service.list(pageable); }
    @PatchMapping("/{id}/active") public UserResponse toggle(@PathVariable Long id) { return service.toggleActive(id); }
}
