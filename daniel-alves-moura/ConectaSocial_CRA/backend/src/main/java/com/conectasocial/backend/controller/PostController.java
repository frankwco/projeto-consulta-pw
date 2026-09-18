package com.conectasocial.backend.controller;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import com.conectasocial.backend.dto.PostDtos.*;
import com.conectasocial.backend.service.PostService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
@RestController @SecurityRequirement(name = "bearerAuth") @RequestMapping("/api/posts")
public class PostController {
    private final PostService service; public PostController(PostService service){this.service=service;}
    @GetMapping("/feed") public Page<PostResponse> feed(@RequestParam(defaultValue="0") int page,@RequestParam(defaultValue="10") int size){return service.feed(page,size);}
    @GetMapping("/explore") public Page<PostResponse> explore(PostFilter filter,@RequestParam(defaultValue="0") int page,@RequestParam(defaultValue="10") int size){return service.explore(filter,page,size);}
    @GetMapping("/user/{username}") public Page<PostResponse> byUser(@PathVariable String username,@RequestParam(defaultValue="0") int page,@RequestParam(defaultValue="10") int size){return service.byUser(username,page,size);}
    @GetMapping("/{id}") public PostResponse get(@PathVariable Long id){return service.get(id);}
    @PostMapping public ResponseEntity<PostResponse> create(@Valid @RequestBody PostRequest r){return ResponseEntity.status(HttpStatus.CREATED).body(service.create(r));}
    @PutMapping("/{id}") public PostResponse update(@PathVariable Long id,@Valid @RequestBody PostRequest r){return service.update(id,r);}
    @DeleteMapping("/{id}") public ResponseEntity<Void> delete(@PathVariable Long id){service.delete(id);return ResponseEntity.noContent().build();}
    @PostMapping("/{id}/like") public PostResponse like(@PathVariable Long id){return service.like(id);}
    @DeleteMapping("/{id}/like") public PostResponse unlike(@PathVariable Long id){return service.unlike(id);}
}
