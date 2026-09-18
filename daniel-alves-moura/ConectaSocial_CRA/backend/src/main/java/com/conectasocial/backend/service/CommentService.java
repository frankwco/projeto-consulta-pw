package com.conectasocial.backend.service;

import com.conectasocial.backend.dto.CommentDtos.*;
import com.conectasocial.backend.dto.UserDtos.UserSummary;
import com.conectasocial.backend.entity.*;
import com.conectasocial.backend.exception.*;
import com.conectasocial.backend.repository.CommentRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CommentService {
    private final CommentRepository comments; private final PostService posts; private final CurrentUserService current;
    public CommentService(CommentRepository comments, PostService posts, CurrentUserService current){this.comments=comments;this.posts=posts;this.current=current;}

    @Transactional(readOnly=true)
    public Page<CommentResponse> list(Long postId,int page,int size){User me=current.get();Post p=posts.entity(postId);return comments.findByPostOrderByCreatedAtAsc(p,PageRequest.of(Math.max(page,0),Math.min(Math.max(size,1),100))).map(c->response(c,me));}

    @Transactional
    public CommentResponse create(Long postId,CommentRequest req){User me=current.get();Post p=posts.entity(postId);Comment c=new Comment();c.setPost(p);c.setAuthor(me);c.setContent(req.content().trim());return response(comments.save(c),me);}

    @Transactional
    public void delete(Long id){User me=current.get();Comment c=comments.findById(id).orElseThrow(()->new ResourceNotFoundException("Comentário não encontrado"));if(!c.getAuthor().getId().equals(me.getId())&&me.getRole()!=Role.ADMIN)throw new BusinessException("Você não pode excluir este comentário");comments.delete(c);}

    private CommentResponse response(Comment c,User me){return new CommentResponse(c.getId(),new UserSummary(c.getAuthor().getId(),c.getAuthor().getUsername(),c.getAuthor().getDisplayName(),c.getAuthor().getAvatarUrl(),c.getAuthor().getRole()),c.getContent(),c.getAuthor().getId().equals(me.getId()),c.getCreatedAt());}
}
