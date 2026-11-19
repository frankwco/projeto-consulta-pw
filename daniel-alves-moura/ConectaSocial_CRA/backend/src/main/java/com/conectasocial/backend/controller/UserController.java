package com.conectasocial.backend.controller;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import com.conectasocial.backend.dto.UserDtos.*;
import com.conectasocial.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
@RestController @SecurityRequirement(name = "bearerAuth") @RequestMapping("/api/users")
public class UserController {
    private final UserService service; public UserController(UserService service){this.service=service;}
    @GetMapping("/me") public UserProfile me(){return service.me();}
    @PutMapping("/me") public UserProfile update(@Valid @RequestBody UpdateProfileRequest r){return service.update(r);}
    @GetMapping("/search") public Page<UserSummary> search(@RequestParam(defaultValue="") String q,@RequestParam(defaultValue="0") int page,@RequestParam(defaultValue="12") int size){return service.search(q,page,size);}
    @GetMapping("/{username}") public UserProfile profile(@PathVariable String username){return service.profile(username);}
    @PostMapping("/{username}/follow") public UserProfile follow(@PathVariable String username){return service.follow(username);}
    @DeleteMapping("/{username}/follow") public UserProfile unfollow(@PathVariable String username){return service.unfollow(username);}
}
