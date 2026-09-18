# Projeto Full Stack completo — Spring Boot + React + MySQL + JWT + Recharts

**VERSÃO 1 — roteiro rápido para prova.** Este material ensina um projeto genérico do começo ao fim. A entidade principal é chamada `Registro` para que possa ser renomeada para `Produto`, `Aluno`, `Cliente`, `Livro`, `Chamado`, `Veículo`, `Consulta`, `Pedido` ou outro domínio exigido.

## Stack de referência

- Java 21
- Spring Boot 3.5.x
- Spring Web / MVC
- Spring Data JPA / Hibernate
- Spring Validation
- Spring Security 6.x
- MySQL/XAMPP
- JJWT 0.13.x
- React 19
- Vite
- Axios
- React Router
- Recharts

> Os exemplos de Security foram escritos no estilo da linha Spring Security 6.x usada pelo Spring Boot 3.5.x. Se seu projeto estiver em Spring Boot 4/Spring Security 7, confira a documentação da mesma versão antes de copiar construtores ou métodos.

## Índice

- [Arquitetura geral](#arquitetura-geral)
- [Pré-requisitos](#pre-requisitos)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Criando o backend](#criando-o-backend)
- [pom.xml](#pomxml)
- [MySQL e XAMPP](#mysql-e-xampp)
- [application.properties](#applicationproperties)
- [Pacotes do backend](#pacotes-do-backend)
- [Entidade Registro](#entidade-registro)
- [Entidade Usuario](#entidade-usuario)
- [Repositories](#repositories)
- [DTOs](#dtos)
- [Validation](#validation)
- [Exceptions globais](#exceptions-globais)
- [Service](#service)
- [Filtros personalizados](#filtros-personalizados)
- [Paginação](#paginacao)
- [Ordenação](#ordenacao)
- [Controller REST](#controller-rest)
- [Dashboard no backend](#dashboard-no-backend)
- [Spring Security](#spring-security)
- [JWT](#jwt)
- [Filtro JWT](#filtro-jwt)
- [SecurityConfig](#securityconfig)
- [Login](#login)
- [CORS](#cors)
- [Usuário inicial](#usuario-inicial)
- [Testando a API](#testando-a-api)
- [Criando o frontend](#criando-o-frontend)
- [Dependências React](#dependencias-react)
- [Estrutura React](#estrutura-react)
- [Vite e .env](#vite-e-env)
- [Axios](#axios)
- [Interceptor JWT](#interceptor-jwt)
- [AuthContext](#authcontext)
- [React Router](#react-router)
- [Rotas protegidas](#rotas-protegidas)
- [Layout](#layout)
- [Página de login](#pagina-de-login)
- [Formulário CRUD](#formulario-crud)
- [Tabela CRUD](#tabela-crud)
- [Filtros no React](#filtros-no-react)
- [Paginação no React](#paginacao-no-react)
- [Ordenação no React](#ordenacao-no-react)
- [Dashboard no React](#dashboard-no-react)
- [Recharts](#recharts)
- [Erros no frontend](#erros-no-frontend)
- [Loading e empty state](#loading-e-empty-state)
- [Integração completa](#integracao-completa)
- [Debug](#debug)
- [Build](#build)
- [Adaptação para a prova](#adaptacao-para-a-prova)
- [Checklist](#checklist)
- [Referências](#referencias)

Use esta versão para localizar rapidamente a sequência e copiar a implementação essencial.

## Arquitetura geral

```text
React/Vite
   ↓
Axios
   ↓ HTTP + JSON + Authorization: Bearer JWT
Spring Security Filter Chain
   ↓
JwtAuthenticationFilter
   ↓
Controller
   ↓
Service / @Transactional
   ↓
Repository / Specification
   ↓
JPA / Hibernate
   ↓
MySQL
```

## Pré-requisitos

- JDK 21
- Maven 3.6.3+
- Node.js + npm
- XAMPP/MySQL
- VS Code ou IntelliJ

```bash
java -version
mvn -version
node --version
npm --version
```

## Estrutura do projeto

```text
projeto/
├── backend/
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/exemplo/projetobase/
│       │   ├── config/
│       │   ├── controller/
│       │   ├── dto/
│       │   ├── entity/
│       │   ├── exception/
│       │   ├── repository/
│       │   ├── security/
│       │   ├── service/
│       │   └── specification/
│       └── resources/
│           └── application.properties
└── frontend/
    ├── .env
    └── src/
        ├── api/
        ├── components/
        ├── context/
        ├── pages/
        ├── App.jsx
        └── main.jsx
```

## Criando o backend

1. Crie Spring Boot com Java 21.
2. Coloque a classe `@SpringBootApplication` no pacote raiz.
3. Adicione Web, JPA, Validation, Security e MySQL.
4. Adicione JJWT.
5. Execute o projeto antes de criar regras.

## pom.xml

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.5.16</version>
        <relativePath/>
    </parent>

    <groupId>com.exemplo</groupId>
    <artifactId>projeto-base</artifactId>
    <version>0.0.1-SNAPSHOT</version>

    <properties>
        <java.version>21</java.version>
        <jjwt.version>0.13.0</jjwt.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>

        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <scope>runtime</scope>
        </dependency>

        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>${jjwt.version}</version>
        </dependency>

        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>${jjwt.version}</version>
            <scope>runtime</scope>
        </dependency>

        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>${jjwt.version}</version>
            <scope>runtime</scope>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

## MySQL e XAMPP

1. Inicie MySQL no XAMPP.
2. Confirme porta 3306.
3. Confirme usuário/senha.
4. Crie o banco ou deixe a URL criar.

```sql
CREATE DATABASE IF NOT EXISTS projeto_base
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

## application.properties

```properties
spring.application.name=projeto-base
server.port=8080

spring.datasource.url=jdbc:mysql://localhost:3306/projeto_base?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=America/Sao_Paulo
spring.datasource.username=root
spring.datasource.password=

spring.jpa.hibernate.ddl-auto=update
spring.jpa.open-in-view=false
spring.jpa.show-sql=true

app.jwt.secret=${JWT_SECRET:MUDE_ESTA_CHAVE_LOCAL_PARA_UMA_CHAVE_LONGA_DE_32_BYTES_OU_MAIS}
app.jwt.expiration-ms=3600000

app.cors.allowed-origin=${FRONTEND_URL:http://localhost:5173}
```

## Pacotes do backend

```text
config        → beans/security/cors
controller    → HTTP
dto           → requests/responses/filtros
entity        → JPA
exception     → erros de negócio/API
repository    → Spring Data
security      → JWT/UserDetails
service       → casos de uso
specification → filtros dinâmicos
```

## Entidade Registro

```java
public enum StatusRegistro {
    ATIVO,
    PENDENTE,
    CONCLUIDO,
    INATIVO
}
```

```java
@Entity
@Table(name = "registros")
public class Registro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String nome;

    @Column(length = 500)
    private String descricao;

    @Column(nullable = false, length = 80)
    private String categoria;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal valor;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private StatusRegistro status;

    @Column(nullable = false, updatable = false)
    private LocalDateTime criadoEm;

    @Column(nullable = false)
    private LocalDateTime atualizadoEm;

    @PrePersist
    void prePersist() {
        LocalDateTime agora = LocalDateTime.now();
        criadoEm = agora;
        atualizadoEm = agora;
    }

    @PreUpdate
    void preUpdate() {
        atualizadoEm = LocalDateTime.now();
    }

    // getters e setters
}
```

## Entidade Usuario

```java
public enum Perfil {
    ADMIN,
    USER
}
```

```java
@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String senha;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Perfil perfil = Perfil.USER;

    @Column(nullable = false)
    private boolean ativo = true;

    // getters e setters
}
```

## Repositories

```java
public interface RegistroRepository
        extends JpaRepository<Registro, Long>,
                JpaSpecificationExecutor<Registro> {

    long countByStatus(StatusRegistro status);

    @Query("select coalesce(sum(r.valor), 0) from Registro r")
    BigDecimal somarValorTotal();

    @Query("select r.categoria, count(r) from Registro r group by r.categoria order by count(r) desc")
    List<Object[]> contarPorCategoria();
}
```

```java
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCase(String email);
}
```

## DTOs

```java
public record RegistroRequest(
    @NotBlank(message = "Nome é obrigatório")
    @Size(max = 120)
    String nome,

    @Size(max = 500)
    String descricao,

    @NotBlank(message = "Categoria é obrigatória")
    String categoria,

    @NotNull
    @PositiveOrZero
    BigDecimal valor,

    @NotNull
    StatusRegistro status
) {}
```

```java
public record RegistroResponse(
    Long id,
    String nome,
    String descricao,
    String categoria,
    BigDecimal valor,
    StatusRegistro status,
    LocalDateTime criadoEm,
    LocalDateTime atualizadoEm
) {}
```

```java
public record RegistroFiltro(
    String busca,
    String nome,
    String categoria,
    StatusRegistro status,
    BigDecimal valorMin,
    BigDecimal valorMax,
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataInicio,
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataFim
) {}
```

## Validation

- `@Valid` no controller dispara Bean Validation.
- `@NotBlank` para texto obrigatório.
- `@NotNull` para objetos/enums.
- `@PositiveOrZero` para valores não negativos.
- Regras que dependem de dois campos ficam no service ou validator de classe.

## Exceptions globais

```java
public class RecursoNaoEncontradoException extends RuntimeException {
    public RecursoNaoEncontradoException(String message) {
        super(message);
    }
}
```

```java
public class RegraNegocioException extends RuntimeException {
    public RegraNegocioException(String message) {
        super(message);
    }
}
```

```java
public record ApiError(
    LocalDateTime timestamp,
    int status,
    String erro,
    String mensagem,
    String path
) {}
```

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RecursoNaoEncontradoException.class)
    ResponseEntity<ApiError> notFound(
            RecursoNaoEncontradoException ex,
            HttpServletRequest request) {

        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new ApiError(
                LocalDateTime.now(),
                404,
                "Recurso não encontrado",
                ex.getMessage(),
                request.getRequestURI()
            ));
    }

    @ExceptionHandler(RegraNegocioException.class)
    ResponseEntity<ApiError> business(
            RegraNegocioException ex,
            HttpServletRequest request) {

        return ResponseEntity.badRequest()
            .body(new ApiError(
                LocalDateTime.now(),
                400,
                "Regra de negócio",
                ex.getMessage(),
                request.getRequestURI()
            ));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<Map<String, String>> validation(
            MethodArgumentNotValidException ex) {

        Map<String, String> errors = new LinkedHashMap<>();

        ex.getBindingResult()
            .getFieldErrors()
            .forEach(error ->
                errors.put(error.getField(), error.getDefaultMessage())
            );

        return ResponseEntity.badRequest().body(errors);
    }
}
```

## Service

```java
@Service
public class RegistroService {

    private static final Set<String> SORTS =
        Set.of(
            "id",
            "nome",
            "categoria",
            "valor",
            "status",
            "criadoEm",
            "atualizadoEm"
        );

    private final RegistroRepository repository;

    public RegistroService(RegistroRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public Page<RegistroResponse> listar(
            RegistroFiltro filtro,
            int page,
            int size,
            String sort,
            String direction) {

        validarFiltro(filtro);

        String campo =
            SORTS.contains(sort) ? sort : "id";

        Sort.Direction dir =
            "asc".equalsIgnoreCase(direction)
                ? Sort.Direction.ASC
                : Sort.Direction.DESC;

        Pageable pageable =
            PageRequest.of(
                Math.max(page, 0),
                Math.min(Math.max(size, 1), 100),
                Sort.by(dir, campo)
            );

        return repository
            .findAll(
                RegistroSpecifications.comFiltro(filtro),
                pageable
            )
            .map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public RegistroResponse buscar(Long id) {
        return toResponse(buscarEntidade(id));
    }

    @Transactional
    public RegistroResponse criar(RegistroRequest request) {
        Registro entity = new Registro();
        copiar(request, entity);

        return toResponse(
            repository.save(entity)
        );
    }

    @Transactional
    public RegistroResponse atualizar(
            Long id,
            RegistroRequest request) {

        Registro entity = buscarEntidade(id);
        copiar(request, entity);

        return toResponse(entity);
    }

    @Transactional
    public void excluir(Long id) {
        repository.delete(buscarEntidade(id));
    }

    private Registro buscarEntidade(Long id) {
        return repository.findById(id)
            .orElseThrow(() ->
                new RecursoNaoEncontradoException(
                    "Registro " + id + " não encontrado"
                )
            );
    }

    private void validarFiltro(RegistroFiltro filtro) {
        if (filtro.valorMin() != null &&
            filtro.valorMax() != null &&
            filtro.valorMin().compareTo(filtro.valorMax()) > 0) {

            throw new RegraNegocioException(
                "valorMin não pode ser maior que valorMax"
            );
        }

        if (filtro.dataInicio() != null &&
            filtro.dataFim() != null &&
            filtro.dataInicio().isAfter(filtro.dataFim())) {

            throw new RegraNegocioException(
                "dataInicio não pode ser posterior a dataFim"
            );
        }
    }

    private void copiar(
            RegistroRequest request,
            Registro entity) {

        entity.setNome(request.nome().trim());
        entity.setDescricao(request.descricao());
        entity.setCategoria(request.categoria().trim());
        entity.setValor(request.valor());
        entity.setStatus(request.status());
    }

    private RegistroResponse toResponse(Registro entity) {
        return new RegistroResponse(
            entity.getId(),
            entity.getNome(),
            entity.getDescricao(),
            entity.getCategoria(),
            entity.getValor(),
            entity.getStatus(),
            entity.getCriadoEm(),
            entity.getAtualizadoEm()
        );
    }
}
```

## Filtros personalizados

```java
public final class RegistroSpecifications {

    private RegistroSpecifications() {}

    public static Specification<Registro> comFiltro(
            RegistroFiltro filtro) {

        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (filtro.busca() != null &&
                !filtro.busca().isBlank()) {

                String termo =
                    "%" + filtro.busca().trim().toLowerCase() + "%";

                Predicate porNome =
                    cb.like(cb.lower(root.get("nome")), termo);

                Predicate porDescricao =
                    cb.like(cb.lower(root.get("descricao")), termo);

                Predicate porCategoria =
                    cb.like(cb.lower(root.get("categoria")), termo);

                predicates.add(
                    cb.or(porNome, porDescricao, porCategoria)
                );
            }

            if (filtro.categoria() != null &&
                !filtro.categoria().isBlank()) {

                predicates.add(
                    cb.equal(
                        cb.lower(root.get("categoria")),
                        filtro.categoria().trim().toLowerCase()
                    )
                );
            }

            if (filtro.status() != null) {
                predicates.add(
                    cb.equal(root.get("status"), filtro.status())
                );
            }

            if (filtro.valorMin() != null) {
                predicates.add(
                    cb.greaterThanOrEqualTo(
                        root.get("valor"),
                        filtro.valorMin()
                    )
                );
            }

            if (filtro.valorMax() != null) {
                predicates.add(
                    cb.lessThanOrEqualTo(
                        root.get("valor"),
                        filtro.valorMax()
                    )
                );
            }

            if (filtro.dataInicio() != null) {
                predicates.add(
                    cb.greaterThanOrEqualTo(
                        root.get("criadoEm"),
                        filtro.dataInicio().atStartOfDay()
                    )
                );
            }

            if (filtro.dataFim() != null) {
                predicates.add(
                    cb.lessThan(
                        root.get("criadoEm"),
                        filtro.dataFim()
                            .plusDays(1)
                            .atStartOfDay()
                    )
                );
            }

            return cb.and(
                predicates.toArray(Predicate[]::new)
            );
        };
    }
}
```

```http
GET /api/registros?
    busca=note
    &categoria=hardware
    &status=ATIVO
    &valorMin=100
    &valorMax=5000
    &dataInicio=2026-01-01
    &dataFim=2026-12-31
```

## Paginação

```text
page=0
size=10
```

## Ordenação

```text
sort=valor
direction=desc
```

Use whitelist de campos permitidos, como mostrado no `RegistroService`.

## Controller REST

```java
@RestController
@RequestMapping("/api/registros")
public class RegistroController {

    private final RegistroService service;

    public RegistroController(RegistroService service) {
        this.service = service;
    }

    @GetMapping
    public Page<RegistroResponse> listar(
            RegistroFiltro filtro,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sort,
            @RequestParam(defaultValue = "desc") String direction) {

        return service.listar(
            filtro,
            page,
            size,
            sort,
            direction
        );
    }

    @GetMapping("/{id}")
    public RegistroResponse buscar(
            @PathVariable Long id) {
        return service.buscar(id);
    }

    @PostMapping
    public ResponseEntity<RegistroResponse> criar(
            @Valid @RequestBody RegistroRequest request) {

        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(service.criar(request));
    }

    @PutMapping("/{id}")
    public RegistroResponse atualizar(
            @PathVariable Long id,
            @Valid @RequestBody RegistroRequest request) {

        return service.atualizar(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(
            @PathVariable Long id) {

        service.excluir(id);

        return ResponseEntity.noContent().build();
    }
}
```

## Dashboard no backend

```java
public record DashboardResponse(
    long total,
    long ativos,
    long pendentes,
    long concluidos,
    BigDecimal valorTotal,
    List<CategoriaResumo> porCategoria
) {
    public record CategoriaResumo(
        String categoria,
        long quantidade
    ) {}
}
```

```java
@Service
public class DashboardService {

    private final RegistroRepository repository;

    public DashboardService(
            RegistroRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public DashboardResponse resumo() {
        var categorias =
            repository.contarPorCategoria()
                .stream()
                .map(row ->
                    new DashboardResponse.CategoriaResumo(
                        (String) row[0],
                        (Long) row[1]
                    )
                )
                .toList();

        return new DashboardResponse(
            repository.count(),
            repository.countByStatus(StatusRegistro.ATIVO),
            repository.countByStatus(StatusRegistro.PENDENTE),
            repository.countByStatus(StatusRegistro.CONCLUIDO),
            repository.somarValorTotal(),
            categorias
        );
    }
}
```

```java
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService service;

    public DashboardController(
            DashboardService service) {
        this.service = service;
    }

    @GetMapping
    public DashboardResponse resumo() {
        return service.resumo();
    }
}
```

## Spring Security

```java
@Service
public class CustomUserDetailsService
        implements UserDetailsService {

    private final UsuarioRepository repository;

    public CustomUserDetailsService(
            UsuarioRepository repository) {
        this.repository = repository;
    }

    @Override
    public UserDetails loadUserByUsername(
            String email) {

        Usuario usuario =
            repository.findByEmailIgnoreCase(email)
                .orElseThrow(() ->
                    new UsernameNotFoundException(
                        "Usuário não encontrado"
                    )
                );

        return User
            .withUsername(usuario.getEmail())
            .password(usuario.getSenha())
            .authorities(
                "ROLE_" + usuario.getPerfil().name()
            )
            .disabled(!usuario.isAtivo())
            .build();
    }
}
```

## JWT

```java
@Service
public class JwtService {

    private final SecretKey key;
    private final long expirationMs;

    public JwtService(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.expiration-ms}") long expirationMs) {

        this.key = Keys.hmacShaKeyFor(
            secret.getBytes(StandardCharsets.UTF_8)
        );

        this.expirationMs = expirationMs;
    }

    public String gerar(UserDetails user) {
        Date agora = new Date();
        Date expira =
            new Date(agora.getTime() + expirationMs);

        return Jwts.builder()
            .subject(user.getUsername())
            .issuedAt(agora)
            .expiration(expira)
            .signWith(key)
            .compact();
    }

    public String extrairUsername(String token) {
        return claims(token).getSubject();
    }

    public boolean valido(
            String token,
            UserDetails user) {

        Claims claims = claims(token);

        return claims.getSubject()
                .equalsIgnoreCase(user.getUsername())
            && claims.getExpiration()
                .after(new Date());
    }

    private Claims claims(String token) {
        return Jwts.parser()
            .verifyWith(key)
            .build()
            .parseSignedClaims(token)
            .getPayload();
    }
}
```

## Filtro JWT

```java
@Component
public class JwtAuthenticationFilter
        extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;

    public JwtAuthenticationFilter(
            JwtService jwtService,
            CustomUserDetailsService userDetailsService) {

        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String header =
            request.getHeader("Authorization");

        if (header == null ||
            !header.startsWith("Bearer ")) {

            filterChain.doFilter(request, response);
            return;
        }

        try {
            String token = header.substring(7);
            String username =
                jwtService.extrairUsername(token);

            if (username != null &&
                SecurityContextHolder
                    .getContext()
                    .getAuthentication() == null) {

                UserDetails user =
                    userDetailsService
                        .loadUserByUsername(username);

                if (jwtService.valido(token, user)) {
                    var auth =
                        new UsernamePasswordAuthenticationToken(
                            user,
                            null,
                            user.getAuthorities()
                        );

                    SecurityContextHolder
                        .getContext()
                        .setAuthentication(auth);
                }
            }
        } catch (
            JwtException |
            IllegalArgumentException ignored
        ) {
            // Continua sem autenticação.
        }

        filterChain.doFilter(
            request,
            response
        );
    }
}
```

## SecurityConfig

```java
@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    AuthenticationProvider authenticationProvider(
            UserDetailsService userDetailsService,
            PasswordEncoder passwordEncoder) {

        // Compatível com Spring Security 6.x.
        DaoAuthenticationProvider provider =
            new DaoAuthenticationProvider();

        provider.setUserDetailsService(
            userDetailsService
        );

        provider.setPasswordEncoder(
            passwordEncoder
        );

        return provider;
    }

    @Bean
    AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration)
            throws Exception {

        return configuration
            .getAuthenticationManager();
    }

    @Bean
    SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            JwtAuthenticationFilter jwtFilter,
            AuthenticationProvider provider,
            CorsConfigurationSource cors)
            throws Exception {

        return http
            .csrf(csrf -> csrf.disable())
            .cors(c -> c.configurationSource(cors))
            .sessionManagement(session ->
                session.sessionCreationPolicy(
                    SessionCreationPolicy.STATELESS
                )
            )
            .authenticationProvider(provider)
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**")
                    .permitAll()
                .requestMatchers("/api/admin/**")
                    .hasRole("ADMIN")
                .anyRequest()
                    .authenticated()
            )
            .addFilterBefore(
                jwtFilter,
                UsernamePasswordAuthenticationFilter.class
            )
            .build();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource(
            @Value("${app.cors.allowed-origin}")
            String origin) {

        CorsConfiguration config =
            new CorsConfiguration();

        config.setAllowedOrigins(
            List.of(origin)
        );

        config.setAllowedMethods(
            List.of(
                "GET",
                "POST",
                "PUT",
                "PATCH",
                "DELETE",
                "OPTIONS"
            )
        );

        config.setAllowedHeaders(
            List.of("*")
        );

        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
            new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
            "/**",
            config
        );

        return source;
    }
}
```

> Em Spring Security 6.x, use `new DaoAuthenticationProvider()` + setters. Um construtor visto na documentação do Security 7 pode não existir no Security 6.

## Login

```java
public record LoginRequest(
    @NotBlank @Email String email,
    @NotBlank String senha
) {}
```

```java
public record LoginResponse(
    String token,
    String tipo,
    String email
) {}
```

```java
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager manager;
    private final JwtService jwtService;

    public AuthController(
            AuthenticationManager manager,
            JwtService jwtService) {

        this.manager = manager;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public LoginResponse login(
            @Valid @RequestBody
            LoginRequest request) {

        Authentication authentication =
            manager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    request.email(),
                    request.senha()
                )
            );

        UserDetails user =
            (UserDetails)
            authentication.getPrincipal();

        return new LoginResponse(
            jwtService.gerar(user),
            "Bearer",
            user.getUsername()
        );
    }
}
```

## CORS

```text
Frontend: http://localhost:5173
Backend:  http://localhost:8080
```

Como são origens diferentes, o navegador aplica CORS. A configuração está no `SecurityConfig`.

## Usuário inicial

```java
@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner criarAdmin(
            UsuarioRepository repository,
            PasswordEncoder encoder) {

        return args -> {
            String email = "admin@prova.com";

            if (!repository
                .existsByEmailIgnoreCase(email)) {

                Usuario admin = new Usuario();

                admin.setNome("Administrador");
                admin.setEmail(email);
                admin.setSenha(
                    encoder.encode("Admin123!")
                );
                admin.setPerfil(Perfil.ADMIN);
                admin.setAtivo(true);

                repository.save(admin);
            }
        };
    }
}
```

## Testando a API

```http
### Login
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "email": "admin@prova.com",
  "senha": "Admin123!"
}

### Cole o token:
@token = TOKEN_AQUI

### CRUD + filtros
GET http://localhost:8080/api/registros?status=ATIVO&valorMin=10&valorMax=5000&page=0&size=10&sort=valor&direction=desc
Authorization: Bearer {{token}}

### Dashboard
GET http://localhost:8080/api/dashboard
Authorization: Bearer {{token}}
```

1. Login válido.
2. GET protegido sem token deve falhar.
3. GET protegido com token deve funcionar.
4. POST inválido deve retornar 400.
5. CRUD completo.
6. Filtros combinados.
7. Dashboard.

## Criando o frontend

```bash
npm create vite@latest frontend -- --template react
cd frontend
npm install
npm install axios react-router-dom recharts
npm run dev
```

## Dependências React

| Pacote | Uso |
| --- | --- |
| axios | HTTP e interceptors |
| react-router-dom | rotas SPA |
| recharts | gráficos |

## Estrutura React

```text
src/
├── api/
│   └── api.js
├── components/
│   ├── AppLayout.jsx
│   ├── RegistroForm.jsx
│   └── RegistroFiltros.jsx
├── context/
│   └── AuthContext.jsx
├── pages/
│   ├── LoginPage.jsx
│   ├── DashboardPage.jsx
│   └── RegistrosPage.jsx
├── App.jsx
└── main.jsx
```

## Vite e .env

```properties
VITE_API_URL=http://localhost:8080/api
```

Acesso: `import.meta.env.VITE_API_URL`.

## Axios

```javascript
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token");

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
    }

    return Promise.reject(error);
  }
);
```

## Interceptor JWT

```text
localStorage.token
 ↓
Axios request interceptor
 ↓
Authorization: Bearer TOKEN
 ↓
Spring JWT filter
```

## AuthContext

```jsx
import {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

import { api } from "../api/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] =
    useState(() => {
      const salvo =
        localStorage.getItem("usuario");

      return salvo
        ? JSON.parse(salvo)
        : null;
    });

  async function login(email, senha) {
    const response =
      await api.post(
        "/auth/login",
        { email, senha }
      );

    localStorage.setItem(
      "token",
      response.data.token
    );

    const novoUsuario = {
      email: response.data.email,
    };

    localStorage.setItem(
      "usuario",
      JSON.stringify(novoUsuario)
    );

    setUsuario(novoUsuario);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setUsuario(null);
  }

  const value = useMemo(
    () => ({
      usuario,
      autenticado:
        Boolean(
          usuario &&
          localStorage.getItem("token")
        ),
      login,
      logout,
    }),
    [usuario]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth fora de AuthProvider"
    );
  }

  return context;
}
```

## React Router

```jsx
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

function ProtectedRoute({ children }) {
  const { autenticado } = useAuth();

  if (!autenticado) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route
            path="/login"
            element={<LoginPage />}
          />

          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route
              path="/dashboard"
              element={<DashboardPage />}
            />

            <Route
              path="/registros"
              element={<RegistrosPage />}
            />
          </Route>

          <Route
            path="*"
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
```

## Rotas protegidas

O `ProtectedRoute` só controla navegação/UX. A segurança real continua no backend.

## Layout

```jsx
function AppLayout() {
  return (
    <div className="shell">
      <aside>
        <NavLink to="/dashboard">
          Dashboard
        </NavLink>

        <NavLink to="/registros">
          Registros
        </NavLink>
      </aside>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
```

## Página de login

```jsx
export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] =
    useState({
      email: "admin@prova.com",
      senha: "Admin123!",
    });

  const [loading, setLoading] =
    useState(false);

  const [erro, setErro] =
    useState("");

  async function submit(event) {
    event.preventDefault();

    try {
      setLoading(true);
      setErro("");

      await login(
        form.email,
        form.senha
      );

      navigate("/dashboard");
    } catch (error) {
      setErro(
        error.response?.data?.mensagem ??
        "Login inválido"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit}>
      <h1>Login</h1>

      <input
        type="email"
        value={form.email}
        onChange={(e) =>
          setForm({
            ...form,
            email: e.target.value,
          })
        }
      />

      <input
        type="password"
        value={form.senha}
        onChange={(e) =>
          setForm({
            ...form,
            senha: e.target.value,
          })
        }
      />

      {erro && (
        <p role="alert">
          {erro}
        </p>
      )}

      <button
        disabled={loading}
      >
        {loading
          ? "Entrando..."
          : "Entrar"}
      </button>
    </form>
  );
}
```

## Formulário CRUD

```jsx
const VAZIO = {
  nome: "",
  descricao: "",
  categoria: "",
  valor: "",
  status: "ATIVO",
};

export default function RegistroForm({
  registro,
  onSalvar,
  onCancelar,
}) {
  const [form, setForm] =
    useState(VAZIO);

  useEffect(() => {
    setForm(
      registro
        ? {
            nome: registro.nome ?? "",
            descricao:
              registro.descricao ?? "",
            categoria:
              registro.categoria ?? "",
            valor:
              registro.valor ?? "",
            status:
              registro.status ?? "ATIVO",
          }
        : VAZIO
    );
  }, [registro]);

  function change(event) {
    const { name, value } =
      event.target;

    setForm((old) => ({
      ...old,
      [name]: value,
    }));
  }

  async function submit(event) {
    event.preventDefault();

    await onSalvar({
      ...form,
      valor: Number(form.valor),
    });

    setForm(VAZIO);
  }

  return (
    <form onSubmit={submit}>
      <input
        name="nome"
        value={form.nome}
        onChange={change}
        required
      />

      <textarea
        name="descricao"
        value={form.descricao}
        onChange={change}
      />

      <input
        name="categoria"
        value={form.categoria}
        onChange={change}
        required
      />

      <input
        name="valor"
        type="number"
        step="0.01"
        min="0"
        value={form.valor}
        onChange={change}
        required
      />

      <select
        name="status"
        value={form.status}
        onChange={change}
      >
        <option value="ATIVO">
          ATIVO
        </option>

        <option value="PENDENTE">
          PENDENTE
        </option>

        <option value="CONCLUIDO">
          CONCLUIDO
        </option>

        <option value="INATIVO">
          INATIVO
        </option>
      </select>

      <button type="submit">
        {registro
          ? "Atualizar"
          : "Criar"}
      </button>

      {registro && (
        <button
          type="button"
          onClick={onCancelar}
        >
          Cancelar
        </button>
      )}
    </form>
  );
}
```

## Tabela CRUD

```jsx
<table>
  <thead>
    <tr>
      <th>Nome</th>
      <th>Categoria</th>
      <th>Valor</th>
      <th>Status</th>
      <th>Ações</th>
    </tr>
  </thead>

  <tbody>
    {pagina.content.map(
      (registro) => (
        <tr key={registro.id}>
          <td>{registro.nome}</td>
          <td>{registro.categoria}</td>
          <td>{registro.valor}</td>
          <td>{registro.status}</td>
          <td>
            <button>
              Editar
            </button>
          </td>
        </tr>
      )
    )}
  </tbody>
</table>
```

## Filtros no React

```jsx
const FILTROS_VAZIOS = {
  busca: "",
  categoria: "",
  status: "",
  valorMin: "",
  valorMax: "",
  dataInicio: "",
  dataFim: "",
};

function RegistroFiltros({
  filtros,
  onChange,
  onAplicar,
  onLimpar,
}) {
  function change(event) {
    const { name, value } =
      event.target;

    onChange({
      ...filtros,
      [name]: value,
    });
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onAplicar();
      }}
    >
      <input
        name="busca"
        value={filtros.busca}
        onChange={change}
        placeholder="Busca"
      />

      <input
        name="categoria"
        value={filtros.categoria}
        onChange={change}
        placeholder="Categoria"
      />

      <select
        name="status"
        value={filtros.status}
        onChange={change}
      >
        <option value="">
          Todos
        </option>

        <option value="ATIVO">
          ATIVO
        </option>

        <option value="PENDENTE">
          PENDENTE
        </option>

        <option value="CONCLUIDO">
          CONCLUIDO
        </option>
      </select>

      <input
        name="valorMin"
        type="number"
        value={filtros.valorMin}
        onChange={change}
        placeholder="Valor mínimo"
      />

      <input
        name="valorMax"
        type="number"
        value={filtros.valorMax}
        onChange={change}
        placeholder="Valor máximo"
      />

      <input
        name="dataInicio"
        type="date"
        value={filtros.dataInicio}
        onChange={change}
      />

      <input
        name="dataFim"
        type="date"
        value={filtros.dataFim}
        onChange={change}
      />

      <button type="submit">
        Aplicar
      </button>

      <button
        type="button"
        onClick={onLimpar}
      >
        Limpar
      </button>
    </form>
  );
}
```

## Paginação no React

```jsx
<button
  disabled={page === 0}
  onClick={() =>
    setPage((p) => p - 1)
  }
>
  Anterior
</button>

<button
  disabled={
    page + 1 >=
    pagina.totalPages
  }
  onClick={() =>
    setPage((p) => p + 1)
  }
>
  Próxima
</button>
```

## Ordenação no React

```jsx
<select
  value={sort}
  onChange={(e) => {
    setSort(e.target.value);
    setPage(0);
  }}
>
  <option value="id">ID</option>
  <option value="nome">Nome</option>
  <option value="valor">Valor</option>
</select>
```

## Dashboard no React

```jsx
export default function DashboardPage() {
  const [dados, setDados] =
    useState(null);

  useEffect(() => {
    async function carregar() {
      const response =
        await api.get("/dashboard");

      setDados(response.data);
    }

    carregar();
  }, []);

  if (!dados) {
    return <p>Carregando...</p>;
  }

  const porStatus = [
    {
      name: "Ativos",
      value: dados.ativos,
    },
    {
      name: "Pendentes",
      value: dados.pendentes,
    },
    {
      name: "Concluídos",
      value: dados.concluidos,
    },
  ];

  return (
    <section>
      <div className="cards">
        <article>
          <span>Total</span>
          <strong>
            {dados.total}
          </strong>
        </article>

        <article>
          <span>Valor total</span>
          <strong>
            {Number(
              dados.valorTotal
            ).toLocaleString(
              "pt-BR",
              {
                style: "currency",
                currency: "BRL",
              }
            )}
          </strong>
        </article>
      </div>

      <div
        style={{
          width: "100%",
          height: 320,
        }}
      >
        <ResponsiveContainer>
          <BarChart
            data={dados.porCategoria}
          >
            <CartesianGrid />
            <XAxis
              dataKey="categoria"
            />
            <YAxis
              allowDecimals={false}
            />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="quantidade"
              name="Quantidade"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div
        style={{
          width: "100%",
          height: 320,
        }}
      >
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={porStatus}
              dataKey="value"
              nameKey="name"
              label
            />
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
```

## Recharts

```bash
npm install recharts
```

```jsx
<div
  style={{
    width: "100%",
    height: 300,
  }}
>
  <ResponsiveContainer>
    <BarChart data={dados}>
      <XAxis dataKey="categoria" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="quantidade" />
    </BarChart>
  </ResponsiveContainer>
</div>
```

## Erros no frontend

```javascript
function extrairMensagem(error) {
  const data =
    error.response?.data;

  if (
    typeof data?.mensagem ===
    "string"
  ) {
    return data.mensagem;
  }

  if (
    data &&
    typeof data === "object"
  ) {
    return Object
      .values(data)
      .join(" | ");
  }

  return (
    error.message ??
    "Erro inesperado"
  );
}
```

## Loading e empty state

```jsx
if (loading) {
  return <p>Carregando...</p>;
}

if (erro) {
  return (
    <p role="alert">
      {erro}
    </p>
  );
}

if (pagina.content.length === 0) {
  return (
    <p>
      Nenhum registro encontrado.
    </p>
  );
}
```

## Integração completa

```text
LOGIN:
React
 → POST /auth/login
 → AuthenticationManager
 → UserDetailsService
 → BCrypt
 → JWT
 ← token
 → localStorage

LISTAGEM:
React
 → Axios interceptor
 → Bearer JWT
 → JwtAuthenticationFilter
 → Controller
 → Service
 → Specification
 → Repository
 → MySQL
 ← Page JSON
 → tabela

DASHBOARD:
React
 → GET /dashboard
 → queries agregadas
 ← JSON
 → Recharts
```

## Debug

| Sintoma | Verifique |
| --- | --- |
| Backend não sobe | primeiro `Caused by:` |
| MySQL Access denied | user/senha/porta |
| 401 | token/login/interceptor |
| 403 | role/regra de autorização |
| CORS | origin + OPTIONS + `.cors` |
| constructor undefined | versão da dependência |
| 400 | Validation/payload/enum |
| tabela vazia | filtros + page |
| gráfico vazio | dados + altura do container |
| loop useEffect | dependências instáveis |

## Build

```bash
# backend
mvn clean test
mvn clean package
java -jar target/projeto-base-0.0.1-SNAPSHOT.jar

# frontend
npm run build
npm run preview
```

## Adaptação para a prova

```text
Registro.java
 ↓
RegistroRequest / Response / Filtro
 ↓
RegistroRepository
 ↓
RegistroSpecifications
 ↓
RegistroService
 ↓
RegistroController
 ↓
RegistroForm.jsx
 ↓
RegistroFiltros.jsx
 ↓
RegistrosPage.jsx
 ↓
Dashboard backend
 ↓
DashboardPage.jsx
```

| Se pedirem | Exemplos de campos/filtros |
| --- | --- |
| Produto | nome, categoria, preço, estoque, ativo |
| Aluno | nome, matrícula, curso, período, situação |
| Cliente | nome, cidade, limite, ativo |
| Livro | título, autor, gênero, ano, disponível |
| Chamado | título, prioridade, status, responsável, datas |

## Checklist

- Java/Maven corretos.
- MySQL ligado.
- Banco conecta.
- CRUD funciona sem erros.
- Validation retorna 400.
- 404 padronizado.
- JWT gerado.
- Senha BCrypt.
- Rota protegida sem token falha.
- Axios envia Bearer.
- CORS correto.
- Filtros combinam.
- Faixas inválidas são rejeitadas.
- Paginação funciona.
- Sort usa whitelist.
- Dashboard agrega no backend.
- Recharts recebe array correto.
- Loading/erro/empty state existem.
- Logout limpa token.
- `mvn clean test` passa.
- `npm run build` passa.

## Referências


- Spring Boot: https://docs.spring.io/spring-boot/
- Spring Security: https://docs.spring.io/spring-security/reference/
- Spring Data JPA: https://docs.spring.io/spring-data/jpa/reference/
- React: https://react.dev/
- Vite: https://vite.dev/
- React Router: https://reactrouter.com/
- Recharts: https://recharts.github.io/
- JJWT: https://github.com/jwtk/jjwt
