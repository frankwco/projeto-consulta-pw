package com.conectasocial.backend.specification;

import com.conectasocial.backend.dto.PostDtos.PostFilter;
import com.conectasocial.backend.entity.Post;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import java.util.*;

public final class PostSpecifications {
    private PostSpecifications() {}

    public static Specification<Post> withFilter(PostFilter filter) {
        return (root, query, cb) -> {
            List<Predicate> p = new ArrayList<>();
            if (filter.q() != null && !filter.q().isBlank()) {
                String q = "%" + filter.q().trim().toLowerCase() + "%";
                p.add(cb.like(cb.lower(root.get("content")), q));
            }
            if (filter.author() != null && !filter.author().isBlank()) {
                p.add(cb.like(cb.lower(root.get("author").get("username")),
                    "%" + filter.author().trim().toLowerCase() + "%"));
            }
            if (filter.startDate() != null) {
                p.add(cb.greaterThanOrEqualTo(root.get("createdAt"), filter.startDate().atStartOfDay()));
            }
            if (filter.endDate() != null) {
                p.add(cb.lessThan(root.get("createdAt"), filter.endDate().plusDays(1).atStartOfDay()));
            }
            return cb.and(p.toArray(Predicate[]::new));
        };
    }
}
