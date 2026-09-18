package com.conectasocial.backend.service;

import com.conectasocial.backend.dto.UserDtos.*;
import com.conectasocial.backend.entity.*;
import com.conectasocial.backend.exception.*;
import com.conectasocial.backend.repository.*;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {
    private final UserRepository users;
    private final FollowRepository follows;
    private final PostRepository posts;
    private final CurrentUserService current;

    public UserService(UserRepository users, FollowRepository follows, PostRepository posts, CurrentUserService current) {
        this.users = users; this.follows = follows; this.posts = posts; this.current = current;
    }

    @Transactional(readOnly = true)
    public UserProfile me() { User u = current.get(); return profile(u, u); }

    @Transactional(readOnly = true)
    public UserProfile profile(String username) {
        User viewer = current.get();
        User target = users.findByUsernameIgnoreCase(username)
            .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));
        return profile(target, viewer);
    }

    @Transactional
    public UserProfile update(UpdateProfileRequest req) {
        User u = current.get();
        u.setDisplayName(req.displayName().trim());
        u.setBio(blankToNull(req.bio())); u.setAvatarUrl(blankToNull(req.avatarUrl())); u.setLocation(blankToNull(req.location()));
        return profile(u, u);
    }

    @Transactional(readOnly = true)
    public Page<UserSummary> search(String q, int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.min(Math.max(size,1), 50), Sort.by("displayName"));
        String term = q == null ? "" : q.trim();
        return users.findByUsernameContainingIgnoreCaseOrDisplayNameContainingIgnoreCase(term, term, pageable)
            .map(this::summary);
    }

    @Transactional
    public UserProfile follow(String username) {
        User me = current.get(); User target = find(username);
        if (me.getId().equals(target.getId())) throw new BusinessException("Você não pode seguir a si mesmo");
        if (!follows.existsByFollowerAndFollowing(me, target)) {
            Follow f = new Follow(); f.setFollower(me); f.setFollowing(target); follows.save(f);
        }
        return profile(target, me);
    }

    @Transactional
    public UserProfile unfollow(String username) {
        User me = current.get(); User target = find(username);
        follows.findByFollowerAndFollowing(me, target).ifPresent(follows::delete);
        return profile(target, me);
    }

    public User find(String username) {
        return users.findByUsernameIgnoreCase(username)
            .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));
    }

    private UserProfile profile(User target, User viewer) {
        String visibleEmail = target.getId().equals(viewer.getId()) || viewer.getRole() == Role.ADMIN ? target.getEmail() : null;
        return new UserProfile(target.getId(), target.getUsername(), target.getDisplayName(), visibleEmail,
            target.getBio(), target.getAvatarUrl(), target.getLocation(), target.getRole(), posts.countByAuthor(target),
            follows.countByFollowing(target), follows.countByFollower(target),
            !target.getId().equals(viewer.getId()) && follows.existsByFollowerAndFollowing(viewer, target), target.getCreatedAt());
    }
    private UserSummary summary(User u) { return new UserSummary(u.getId(), u.getUsername(), u.getDisplayName(), u.getAvatarUrl(), u.getRole()); }
    private String blankToNull(String s) { return s == null || s.isBlank() ? null : s.trim(); }
}
