package com.conectasocial.backend.service;

import com.conectasocial.backend.dto.PostDtos.*;
import com.conectasocial.backend.dto.UserDtos.UserSummary;
import com.conectasocial.backend.entity.*;
import com.conectasocial.backend.exception.*;
import com.conectasocial.backend.repository.*;
import com.conectasocial.backend.specification.PostSpecifications;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PostService {
    private final PostRepository posts;
    private final PostLikeRepository likes;
    private final CommentRepository comments;
    private final CurrentUserService current;
    private final UserService userService;

    public PostService(PostRepository posts, PostLikeRepository likes, CommentRepository comments,
                       CurrentUserService current, UserService userService) {
        this.posts=posts; this.likes=likes; this.comments=comments; this.current=current; this.userService=userService;
    }

    @Transactional(readOnly = true)
    public Page<PostResponse> feed(int page, int size) {
        User me=current.get(); Pageable p=pageable(page,size); return posts.feed(me,p).map(post -> response(post,me));
    }

    @Transactional(readOnly = true)
    public Page<PostResponse> explore(PostFilter filter, int page, int size) {
        User me=current.get(); Pageable p=pageable(page,size);
        return posts.findAll(PostSpecifications.withFilter(filter), p).map(post -> response(post,me));
    }

    @Transactional(readOnly = true)
    public Page<PostResponse> byUser(String username, int page, int size) {
        User me=current.get(); User author=userService.find(username);
        return posts.findByAuthorOrderByCreatedAtDesc(author, pageable(page,size)).map(post -> response(post,me));
    }

    @Transactional(readOnly = true)
    public PostResponse get(Long id) { User me=current.get(); return response(entity(id),me); }

    @Transactional
    public PostResponse create(PostRequest req) {
        User me=current.get(); Post p=new Post(); p.setAuthor(me); p.setContent(req.content().trim()); p.setImageUrl(blankToNull(req.imageUrl()));
        return response(posts.save(p),me);
    }

    @Transactional
    public PostResponse update(Long id, PostRequest req) {
        User me=current.get(); Post p=entity(id); requireOwner(p,me); p.setContent(req.content().trim()); p.setImageUrl(blankToNull(req.imageUrl()));
        return response(p,me);
    }

    @Transactional
    public void delete(Long id) { User me=current.get(); Post p=entity(id); requireOwnerOrAdmin(p,me); comments.deleteByPost(p); likes.deleteByPost(p); posts.delete(p); }

    @Transactional
    public PostResponse like(Long id) {
        User me=current.get(); Post p=entity(id);
        if (!likes.existsByPostAndUser(p,me)) { PostLike l=new PostLike(); l.setPost(p); l.setUser(me); likes.save(l); }
        return response(p,me);
    }

    @Transactional
    public PostResponse unlike(Long id) {
        User me=current.get(); Post p=entity(id); likes.findByPostAndUser(p,me).ifPresent(likes::delete); return response(p,me);
    }

    public Post entity(Long id) { return posts.findById(id).orElseThrow(() -> new ResourceNotFoundException("Post não encontrado")); }

    private PostResponse response(Post p, User me) {
        return new PostResponse(p.getId(), new UserSummary(p.getAuthor().getId(),p.getAuthor().getUsername(),p.getAuthor().getDisplayName(),p.getAuthor().getAvatarUrl(),p.getAuthor().getRole()),
            p.getContent(),p.getImageUrl(),likes.countByPost(p),comments.countByPost(p),likes.existsByPostAndUser(p,me),p.getAuthor().getId().equals(me.getId()),p.getCreatedAt(),p.getUpdatedAt());
    }
    private Pageable pageable(int page,int size){return PageRequest.of(Math.max(page,0),Math.min(Math.max(size,1),50),Sort.by(Sort.Direction.DESC,"createdAt"));}
    private void requireOwner(Post p,User me){if(!p.getAuthor().getId().equals(me.getId()))throw new BusinessException("Você não pode editar este post");}
    private void requireOwnerOrAdmin(Post p,User me){if(!p.getAuthor().getId().equals(me.getId())&&me.getRole()!=Role.ADMIN)throw new BusinessException("Você não pode excluir este post");}
    private String blankToNull(String s){return s==null||s.isBlank()?null:s.trim();}
}
