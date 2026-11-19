package br.com.nexuserp.config;

import br.com.nexuserp.entity.*;
import br.com.nexuserp.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;

@Configuration
public class DataInitializer {
    @Bean
    CommandLineRunner seed(UserRepository users, CategoryRepository categories, ProductRepository products,
                           CustomerRepository customers, PasswordEncoder encoder) {
        return args -> {
            if (!users.existsByEmailIgnoreCase("admin@nexuserp.com")) {
                users.save(new User("Administrador", "admin@nexuserp.com", encoder.encode("Admin123!"), Role.ADMIN));
            }
            if (!users.existsByEmailIgnoreCase("user@nexuserp.com")) {
                users.save(new User("Usuário Padrão", "user@nexuserp.com", encoder.encode("User123!"), Role.USER));
            }

            if (categories.count() == 0) {
                categories.save(new Category("Informática", "Equipamentos e acessórios"));
                categories.save(new Category("Escritório", "Materiais de escritório"));
                categories.save(new Category("Serviços", "Produtos de natureza recorrente ou serviço"));
            }

            if (customers.count() == 0) {
                var c1 = new Customer(); c1.setName("Ana Martins"); c1.setEmail("ana@example.com"); c1.setPhone("(44) 99999-1111"); c1.setDocument("111.222.333-44"); c1.setAddress("Av. Central, 100"); customers.save(c1);
                var c2 = new Customer(); c2.setName("Bruno Silva"); c2.setEmail("bruno@example.com"); c2.setPhone("(44) 98888-2222"); c2.setDocument("222.333.444-55"); c2.setAddress("Rua das Flores, 50"); customers.save(c2);
            }

            if (products.count() == 0) {
                var info = categories.findAllByOrderByNameAsc().stream().filter(c -> c.getName().equals("Informática")).findFirst().orElseThrow();
                var office = categories.findAllByOrderByNameAsc().stream().filter(c -> c.getName().equals("Escritório")).findFirst().orElseThrow();
                products.save(product("NOTE-001", "Notebook Pro 15", "Notebook para trabalho e estudos", "4599.90", 8, info));
                products.save(product("MOUSE-001", "Mouse Sem Fio", "Mouse ergonômico", "129.90", 4, info));
                products.save(product("CAD-001", "Caderno Executivo", "Capa dura, 100 folhas", "39.90", 30, office));
            }
        };
    }

    private Product product(String sku, String name, String desc, String price, int stock, Category category) {
        var p = new Product();
        p.setSku(sku); p.setName(name); p.setDescription(desc); p.setPrice(new BigDecimal(price)); p.setStock(stock); p.setActive(true); p.setCategory(category);
        return p;
    }
}
