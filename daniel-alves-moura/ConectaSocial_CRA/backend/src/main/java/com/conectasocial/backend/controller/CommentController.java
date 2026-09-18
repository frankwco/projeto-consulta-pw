package com.conectasocial.backend.controller;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import com.conectasocial.backend.dto.CommentDtos.*;
import com.conectasocial.backend.service.CommentService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
@RestController @SecurityRequirement(name = "bearerAuth") @RequestMapping("/api")
public class CommentController {
    private final CommentService service; public CommentController(CommentService service){this.service=service;}
    @GetMapping("/posts/{postId}/comments") public Page<CommentResponse> list(@PathVariable Long postId,@RequestParam(defaultValue="0") int page,@RequestParam(defaultValue="50") int size){return service.list(postId,page,size);}
    @PostMapping("/posts/{postId}/comments") public ResponseEntity<CommentResponse> create(@PathVariable Long postId,@Valid @RequestBody CommentRequest r){return ResponseEntity.status(HttpStatus.CREATED).body(service.create(postId,r));}
    @DeleteMapping("/comments/{id}") public ResponseEntity<Void> delete(@PathVariable Long id){service.delete(id);return ResponseEntity.noContent().build();}
}
