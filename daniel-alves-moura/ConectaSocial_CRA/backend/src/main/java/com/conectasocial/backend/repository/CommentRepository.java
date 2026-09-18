package com.conectasocial.backend.repository;

import com.conectasocial.backend.entity.*;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    Page<Comment> findByPostOrderByCreatedAtAsc(Post post, Pageable pageable);
    long countByPost(Post post);
    void deleteByPost(Post post);
}
