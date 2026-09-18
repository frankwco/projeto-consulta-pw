package com.conectasocial.backend.repository;

import com.conectasocial.backend.entity.*;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

public interface PostRepository extends JpaRepository<Post, Long>, JpaSpecificationExecutor<Post> {
    @EntityGraph(attributePaths = "author")
    Page<Post> findByAuthorOrderByCreatedAtDesc(User author, Pageable pageable);

    @EntityGraph(attributePaths = "author")
    @Query("""
        select p from Post p
        where p.author = :user
           or p.author.id in (
               select f.following.id from Follow f where f.follower = :user
           )
        order by p.createdAt desc
    """)
    Page<Post> feed(@Param("user") User user, Pageable pageable);

    long countByAuthor(User author);
}
