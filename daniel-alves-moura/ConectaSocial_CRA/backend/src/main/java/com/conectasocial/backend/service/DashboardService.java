package com.conectasocial.backend.service;
import com.conectasocial.backend.dto.DashboardResponse;
import com.conectasocial.backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
@Service
public class DashboardService {
    private final UserRepository users; private final PostRepository posts; private final CommentRepository comments; private final PostLikeRepository likes; private final FollowRepository follows;
    public DashboardService(UserRepository users,PostRepository posts,CommentRepository comments,PostLikeRepository likes,FollowRepository follows){this.users=users;this.posts=posts;this.comments=comments;this.likes=likes;this.follows=follows;}
    @Transactional(readOnly=true)
    public DashboardResponse get(){return new DashboardResponse(users.count(),posts.count(),comments.count(),likes.count(),follows.count());}
}
