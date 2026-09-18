package com.conectasocial.backend.config;

import com.conectasocial.backend.entity.*;
import com.conectasocial.backend.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {
    @Bean
    CommandLineRunner seed(UserRepository users, PostRepository posts, FollowRepository follows, PasswordEncoder encoder) {
        return args -> {
            User admin = users.findByEmailIgnoreCase("admin@conectasocial.com").orElseGet(() -> {
                User u=new User();u.setUsername("admin");u.setDisplayName("Administrador");u.setEmail("admin@conectasocial.com");u.setPassword(encoder.encode("Admin123!"));u.setRole(Role.ADMIN);u.setBio("Administração da ConectaSocial");return users.save(u);
            });
            User ana = users.findByEmailIgnoreCase("ana@conectasocial.com").orElseGet(() -> {
                User u=new User();u.setUsername("ana");u.setDisplayName("Ana Martins");u.setEmail("ana@conectasocial.com");u.setPassword(encoder.encode("User123!"));u.setRole(Role.USER);u.setBio("Desenvolvedora e estudante de tecnologia.");u.setLocation("Brasil");return users.save(u);
            });
            if(posts.count()==0){Post p1=new Post();p1.setAuthor(ana);p1.setContent("Primeiro post na ConectaSocial 🚀");posts.save(p1);Post p2=new Post();p2.setAuthor(admin);p2.setContent("Bem-vindo à rede social de demonstração!");posts.save(p2);}
            if(!follows.existsByFollowerAndFollowing(ana,admin)){Follow f=new Follow();f.setFollower(ana);f.setFollowing(admin);follows.save(f);}
        };
    }
}
