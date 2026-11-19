
# Spring Boot — configuração prática por módulos

Esta é a **versão passo a passo** do guia de consulta para configurar os principais módulos do ecossistema Spring em projetos web com Java 21.

> **Compatibilidade:** os exemplos principais usam estilo compatível com Spring Boot 3.x. Quando uma API mudou no Spring Boot 4 / Spring Security 7, o texto chama isso explicitamente. Não copie configuração de Security de uma versão diferente sem conferir a versão do seu projeto.

## Regra de ouro antes de configurar qualquer módulo

1. Confira a versão do Spring Boot no `pom.xml`.
2. Adicione apenas o starter/dependência necessária.
3. Atualize `application.properties` ou `application.yml` quando o módulo exigir configuração.
4. Crie as classes de configuração somente quando a auto-configuração não for suficiente.
5. Reinicie a aplicação e leia o primeiro `Caused by:` do stack trace.
6. Teste o módulo isoladamente antes de misturá-lo com outras funcionalidades.

## Dependências base para um projeto web típico

```xml
<properties>
    <java.version>21</java.version>
</properties>

<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>

    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>

    <dependency>
        <groupId>com.mysql</groupId>
        <artifactId>mysql-connector-j</artifactId>
        <scope>runtime</scope>
    </dependency>

    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

## Índice alfabético

- [Actuator](#actuator)
- [AOP](#aop)
- [Async](#async)
- [Beans e Injeção de Dependência](#beans-e-injeo-de-dependncia)
- [Cache](#cache)
- [Configuração e Properties](#configurao-e-properties)
- [CORS](#cors)
- [Data JPA](#data-jpa)
- [Eventos](#eventos)
- [Flyway](#flyway)
- [Jackson / JSON](#jackson-json)
- [Mail](#mail)
- [MVC / REST](#mvc-rest)
- [OAuth2 Resource Server](#oauth2-resource-server)
- [Perfis](#perfis)
- [Scheduling](#scheduling)
- [Security](#security)
- [Security com JWT](#security-com-jwt)
- [Specifications](#specifications)
- [Testes](#testes)
- [Transactions](#transactions)
- [Upload de arquivos](#upload-de-arquivos)
- [Validation](#validation)
- [WebClient / RestClient](#webclient-restclient)
- [WebSocket](#websocket)


## Como usar esta versão

Cada módulo segue o fluxo:

**quando usar → dependência → arquivos → configuração → implementação → teste → erros comuns → como adaptar**.

Os exemplos são pequenos, mas mostram a estrutura que normalmente aparece em prova e projeto CRUD.

## Actuator

### Quando usar

Expor health, métricas e informações operacionais.

### Dependência

`spring-boot-starter-actuator`

### Passo a passo

1. Adicione Actuator.
2. Escolha quais endpoints serão expostos.
3. Proteja endpoints sensíveis.
4. Use `/actuator/health` como primeira verificação.

### Implementação mínima

```properties
management.endpoints.web.exposure.include=health,info,metrics
management.endpoint.health.show-details=when_authorized
```

### Como testar

Acesse `/actuator/health` e confirme `UP` quando dependências estiverem saudáveis.


### Segurança

Não exponha tudo em produção sem proteção:

```properties
management.endpoints.web.exposure.include=health,info
```

`env`, `beans`, `configprops` e endpoints semelhantes podem revelar detalhes internos.

## AOP

### Quando usar

Aplicar comportamento transversal como logging, auditoria ou medição sem repetir código.

### Dependência

`spring-boot-starter-aop`

### Passo a passo

1. Adicione starter AOP.
2. Crie `@Aspect`.
3. Defina pointcut.
4. Use `@Around`, `@Before`, `@AfterReturning` conforme a necessidade.
5. Evite esconder regra de negócio importante dentro de aspectos.

### Implementação mínima

```java
@Aspect
@Component
public class TempoAspect {

    @Around("execution(* com.exemplo.service..*(..))")
    public Object medir(ProceedingJoinPoint pjp) throws Throwable {
        long inicio = System.nanoTime();
        try {
            return pjp.proceed();
        } finally {
            long ms = (System.nanoTime() - inicio) / 1_000_000;
            System.out.println(pjp.getSignature() + " levou " + ms + "ms");
        }
    }
}
```

### Como testar

Execute um service e confirme que o aspecto envolve a chamada sem mudar o resultado.


### Quando evitar

Se o comportamento faz parte da regra principal do caso de uso, deixe explícito no service. AOP é melhor para aspectos transversais.

## Async

### Quando usar

Executar métodos em outra thread sem bloquear a chamada atual.

### Dependência

Faz parte do Spring Framework.

### Passo a passo

1. Habilite `@EnableAsync`.
2. Marque método público em outro bean com `@Async`.
3. Quando precisar de retorno, use `CompletableFuture`.
4. Configure executor dedicado em aplicações sérias.

### Implementação mínima

```java
@Configuration
@EnableAsync
public class AsyncConfig {}
```
```java
@Async
public CompletableFuture<Void> enviarRelatorio() {
    // trabalho assíncrono
    return CompletableFuture.completedFuture(null);
}
```

### Como testar

Registre o nome da thread e confirme que difere da thread HTTP.


### Executor dedicado

```java
@Bean(name = "appExecutor")
Executor appExecutor() {
    ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
    executor.setCorePoolSize(4);
    executor.setMaxPoolSize(8);
    executor.setQueueCapacity(100);
    executor.setThreadNamePrefix("app-");
    executor.initialize();
    return executor;
}
```

```java
@Async("appExecutor")
public void processar() {
}
```

## Beans e Injeção de Dependência

### Quando usar

Registrar objetos no container Spring e receber dependências sem instanciar tudo manualmente.

### Dependência

Nenhuma dependência extra: faz parte do Spring Core.

### Passo a passo

1. Marque classes de serviço com `@Service`, repositórios com `@Repository`, controladores com `@RestController` e componentes genéricos com `@Component`.
2. Prefira injeção por construtor.
3. Use `@Bean` quando o objeto vem de biblioteca externa ou precisa de criação manual.
4. Evite `new MinhaService()` em classes gerenciadas pelo Spring.

### Implementação mínima

```java
@Service
public class ProdutoService {
    private final ProdutoRepository repository;

    public ProdutoService(ProdutoRepository repository) {
        this.repository = repository;
    }
}
```
```java
@Configuration
public class AppConfig {
    @Bean
    public Clock clock() {
        return Clock.systemDefaultZone();
    }
}
```

### Como testar

Se a aplicação iniciar sem `NoSuchBeanDefinitionException`, o bean foi encontrado. Para confirmar, injete-o em um controller ou teste.

## Cache

### Quando usar

Evitar recomputar ou consultar repetidamente dados caros.

### Dependência

`spring-boot-starter-cache` + implementação de cache opcional (Caffeine, Redis etc.)

### Passo a passo

1. Adicione o starter de cache.
2. Habilite `@EnableCaching`.
3. Use `@Cacheable`, `@CachePut` e `@CacheEvict`.
4. Defina claramente quando invalidar o cache.

### Implementação mínima

```java
@Configuration
@EnableCaching
public class CacheConfig {}
```
```java
@Cacheable(cacheNames = "produtos", key = "#id")
public ProdutoResponse buscar(Long id) {
    return carregarDoBanco(id);
}

@CacheEvict(cacheNames = "produtos", key = "#id")
public void excluir(Long id) {
    repository.deleteById(id);
}
```

### Como testar

Chame o mesmo método duas vezes e confirme, via log/profiler, que a consulta cara executa apenas quando necessário.


### Dependência Caffeine

```xml
<dependency>
    <groupId>com.github.ben-manes.caffeine</groupId>
    <artifactId>caffeine</artifactId>
</dependency>
```

```properties
spring.cache.type=caffeine
spring.cache.caffeine.spec=maximumSize=500,expireAfterWrite=10m
```

A regra mais importante do cache é saber **quando invalidar**.

## Configuração e Properties

### Quando usar

Mover URLs, segredos, limites e comportamentos para arquivos de configuração/variáveis de ambiente.

### Dependência

Faz parte do Spring Boot. Para metadados no IDE, opcionalmente use `spring-boot-configuration-processor`.

### Passo a passo

1. Use `application.properties` ou `application.yml`.
2. Para poucas propriedades, `@Value` funciona.
3. Para grupos de propriedades, prefira `@ConfigurationProperties`.
4. Nunca fixe senha de produção no código-fonte.

### Implementação mínima

```properties
app.jwt.secret=${JWT_SECRET:segredo-local}
app.jwt.expiration=3600000
app.upload-dir=uploads
```
```java
@ConfigurationProperties(prefix = "app.jwt")
public record JwtProperties(
    String secret,
    long expiration
) {}
```
```java
@SpringBootApplication
@ConfigurationPropertiesScan
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

### Como testar

Defina uma variável de ambiente e confira se o valor recebido muda sem recompilar.


### Variável de ambiente

```properties
spring.datasource.password=${DB_PASSWORD:}
```

Se `DB_PASSWORD` não existir, será usada string vazia.

### Agrupando properties

```java
@ConfigurationProperties(prefix = "app.upload")
@Validated
public record UploadProperties(
    @NotBlank String directory,
    @Positive long maxBytes
) {}
```

```properties
app.upload.directory=uploads
app.upload.max-bytes=10485760
```

## CORS

### Quando usar

Permitir que o frontend em uma origem diferente chame a API.

### Dependência

Já faz parte do stack web/Security.

### Passo a passo

1. Defina origens específicas, métodos e headers.
2. Se houver Spring Security, habilite `.cors(...)` também na `SecurityFilterChain`.
3. Evite `*` com credenciais.
4. Em desenvolvimento, normalmente permita `http://localhost:5173` para Vite.

### Implementação mínima

```java
@Bean
CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowedOrigins(List.of("http://localhost:5173"));
    config.setAllowedMethods(List.of(
        "GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"
    ));
    config.setAllowedHeaders(List.of("*"));
    config.setAllowCredentials(true);

    UrlBasedCorsConfigurationSource source =
        new UrlBasedCorsConfigurationSource();

    source.registerCorsConfiguration("/**", config);
    return source;
}
```

### Como testar

Abra o frontend em outra porta e confira no DevTools se o preflight OPTIONS e a requisição final passam.


### CORS com Security

```java
@Bean
SecurityFilterChain filterChain(
        HttpSecurity http,
        CorsConfigurationSource corsSource) throws Exception {

    return http
        .cors(cors -> cors.configurationSource(corsSource))
        .csrf(csrf -> csrf.disable())
        .authorizeHttpRequests(auth -> auth.anyRequest().permitAll())
        .build();
}
```

### Sintoma típico

Se Postman funciona mas o navegador bloqueia, investigue CORS antes de culpar o controller.

## Data JPA

### Quando usar

Persistir entidades relacionais usando JPA/Hibernate e repositories.

### Dependência

`spring-boot-starter-data-jpa` + driver do banco

### Passo a passo

1. Adicione Data JPA e o driver do banco.
2. Configure datasource.
3. Crie entidade com `@Entity`, `@Id` e estratégia de geração.
4. Crie repository estendendo `JpaRepository`.
5. Use service para coordenar persistência.

### Implementação mínima

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/app_db?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=
spring.jpa.hibernate.ddl-auto=update
spring.jpa.open-in-view=false
```
```java
@Entity
@Table(name = "produtos")
public class Produto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String nome;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal preco;
}
```
```java
public interface ProdutoRepository
        extends JpaRepository<Produto, Long> {
    List<Produto> findByNomeContainingIgnoreCase(String nome);
}
```

### Como testar

Suba o banco, inicie a aplicação e confirme que a tabela/consulta funcionam. Em projeto real, prefira migrações a `ddl-auto=update`.


### Relacionamento ManyToOne

```java
@ManyToOne(fetch = FetchType.LAZY, optional = false)
@JoinColumn(name = "categoria_id", nullable = false)
private Categoria categoria;
```

### Relacionamento OneToMany

```java
@OneToMany(mappedBy = "categoria")
private List<Produto> produtos = new ArrayList<>();
```

Evite devolver entidades relacionais diretamente no JSON. DTOs reduzem ciclos e vazamento de detalhes internos.

### Paginação

```java
Page<Produto> findByNomeContainingIgnoreCase(
    String nome,
    Pageable pageable
);
```

```java
Pageable pageable = PageRequest.of(
    page,
    size,
    Sort.by(Sort.Direction.DESC, "id")
);
```

### Erros comuns

- `LazyInitializationException`: relacionamento lazy acessado fora do contexto apropriado;
- `detached entity passed to persist`: relação recebeu entidade fora do contexto ou uso incorreto de cascade;
- coluna não existe: schema e entidade divergiram;
- recursão infinita em JSON: entidades bidirecionais foram serializadas diretamente.

## Eventos

### Quando usar

Desacoplar ações internas usando publicação/escuta de eventos.

### Dependência

Faz parte do Spring Core.

### Passo a passo

1. Defina um record/classe de evento.
2. Injete `ApplicationEventPublisher`.
3. Publique após a ação principal.
4. Use `@EventListener` ou `@TransactionalEventListener` quando depender da transação.

### Implementação mínima

```java
public record PedidoCriadoEvent(Long pedidoId) {}
```
```java
publisher.publishEvent(new PedidoCriadoEvent(pedido.getId()));
```
```java
@EventListener
public void aoCriarPedido(PedidoCriadoEvent event) {
    // ação secundária
}
```

### Como testar

Crie um pedido e confirme que o listener recebe exatamente um evento.


### Evento após commit

```java
@TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
public void aposCommit(PedidoCriadoEvent event) {
    // ação que só deve ocorrer se a transação realmente confirmar
}
```

## Flyway

### Quando usar

Versionar alterações de schema de forma reproduzível.

### Dependência

`org.flywaydb:flyway-core` e, dependendo da versão/banco, módulo específico do banco.

### Passo a passo

1. Adicione Flyway.
2. Crie scripts em `src/main/resources/db/migration`.
3. Nomeie como `V1__descricao.sql`, `V2__descricao.sql` etc.
4. Em projetos com migração, normalmente use `ddl-auto=validate` ou `none` em vez de `update`.

### Implementação mínima

```sql
-- src/main/resources/db/migration/V1__criar_produtos.sql
CREATE TABLE produtos (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(120) NOT NULL,
    preco DECIMAL(12,2) NOT NULL
);
```
```properties
spring.jpa.hibernate.ddl-auto=validate
spring.flyway.enabled=true
```

### Como testar

Apague/crie banco de teste e confirme que o schema é reconstruído apenas pelas migrações.


### Ordem típica

```text
V1__estrutura_inicial.sql
V2__adicionar_coluna_status.sql
V3__criar_indice_email.sql
```

Nunca edite uma migração já executada em ambientes compartilhados. Crie uma nova versão.

## Jackson / JSON

### Quando usar

Converter Java ↔ JSON e controlar nomes/formato de campos.

### Dependência

Já vem com `spring-boot-starter-web`.

### Passo a passo

1. DTOs são serializados automaticamente.
2. Use `@JsonProperty` para renomear um campo.
3. Use `@JsonIgnore` para não serializar um campo.
4. Evite serializar entidades JPA complexas diretamente, pois relacionamentos podem causar ciclos.

### Implementação mínima

```java
public record UsuarioResponse(
    Long id,
    String nome,
    @JsonProperty("email_principal")
    String email
) {}
```

### Como testar

Faça uma requisição e compare exatamente o JSON devolvido com o contrato esperado.


### Datas

Com Spring Boot, o suporte a `java.time` já é normalmente configurado. Prefira:

```java
public record EventoResponse(
    Long id,
    LocalDate data,
    LocalDateTime criadoEm
) {}
```

Evite converter datas para `String` cedo demais dentro do domínio.

## Mail

### Quando usar

Enviar e-mails via SMTP.

### Dependência

`spring-boot-starter-mail`

### Passo a passo

1. Adicione starter de mail.
2. Configure host, porta, usuário, senha e TLS.
3. Injete `JavaMailSender`.
4. Não coloque credenciais reais no Git.

### Implementação mínima

```properties
spring.mail.host=smtp.example.com
spring.mail.port=587
spring.mail.username=${MAIL_USER}
spring.mail.password=${MAIL_PASSWORD}
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```
```java
@Service
public class EmailService {
    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void enviar(String para, String assunto, String texto) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(para);
        message.setSubject(assunto);
        message.setText(texto);
        mailSender.send(message);
    }
}
```

### Como testar

Use servidor SMTP de teste/local antes de usar credenciais reais.


### HTML/MIME

Para HTML/anexos, use `MimeMessage` + `MimeMessageHelper` em vez de `SimpleMailMessage`.

## MVC / REST

### Quando usar

Criar APIs HTTP com controllers, rotas, parâmetros e corpos JSON.

### Dependência

`spring-boot-starter-web`

### Passo a passo

1. Adicione `spring-boot-starter-web`.
2. Crie `@RestController` e um `@RequestMapping` base.
3. Use `@GetMapping`, `@PostMapping`, `@PutMapping` e `@DeleteMapping`.
4. Use DTOs no corpo da requisição em vez de expor diretamente a entidade.
5. Retorne códigos HTTP adequados.

### Implementação mínima

```java
@RestController
@RequestMapping("/api/produtos")
public class ProdutoController {

    @GetMapping("/{id}")
    public ResponseEntity<ProdutoResponse> buscar(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscar(id));
    }

    @PostMapping
    public ResponseEntity<ProdutoResponse> criar(
            @Valid @RequestBody ProdutoRequest request) {
        ProdutoResponse criado = service.criar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(criado);
    }
}
```

### Como testar

Use um arquivo `.http`, Postman ou curl e teste GET/POST separadamente.


### Tipos de parâmetros

```java
@GetMapping
public Page<ProdutoResponse> listar(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(required = false) String busca) {
    // ...
}
```

```java
@GetMapping("/{id}")
public ProdutoResponse buscar(@PathVariable Long id) {
    // ...
}
```

### PATCH

Use PATCH quando quiser atualização parcial. Uma abordagem simples é um DTO específico:

```java
public record ProdutoStatusRequest(
    @NotNull StatusProduto status
) {}
```

```java
@PatchMapping("/{id}/status")
public ProdutoResponse alterarStatus(
        @PathVariable Long id,
        @Valid @RequestBody ProdutoStatusRequest request) {
    return service.alterarStatus(id, request);
}
```

## OAuth2 Resource Server

### Quando usar

Validar access tokens emitidos por um Authorization Server/IdP sem implementar JWT manualmente.

### Dependência

`spring-boot-starter-oauth2-resource-server`

### Passo a passo

1. Adicione Resource Server.
2. Configure `issuer-uri` ou JWK Set.
3. Ative `.oauth2ResourceServer(...)` na SecurityFilterChain.
4. Mapeie authorities/claims conforme necessário.
5. Prefira esse caminho quando autenticação é delegada a Keycloak/Auth0/Entra/servidor OAuth2.

### Implementação mínima

```properties
spring.security.oauth2.resourceserver.jwt.issuer-uri=https://idp.example.com/realms/app
```
```java
@Bean
SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    return http
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/publico/**").permitAll()
            .anyRequest().authenticated()
        )
        .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()))
        .build();
}
```

### Como testar

Teste token válido do emissor correto e tokens com emissor/assinatura/expiração incorretos.


### Quando usar

Use Resource Server quando o token vem de um provedor/Authorization Server. Nesse cenário você evita escrever filtro JWT manual para validar assinatura, expiração e issuer.

### Autorização por authority

```java
.authorizeHttpRequests(auth -> auth
    .requestMatchers("/api/admin/**").hasAuthority("SCOPE_admin")
    .anyRequest().authenticated()
)
```

## Perfis

### Quando usar

Ter configurações diferentes para desenvolvimento, teste e produção.

### Dependência

Faz parte do Spring Boot.

### Passo a passo

1. Crie `application-dev.properties`, `application-test.properties` e `application-prod.properties`.
2. Ative um perfil com `spring.profiles.active=dev`, variável `SPRING_PROFILES_ACTIVE`, parâmetro Maven ou argumento da aplicação.
3. Use `@Profile` apenas quando realmente precisar criar beans diferentes.

### Implementação mínima

```properties
# application-dev.properties
spring.jpa.show-sql=true

# application-prod.properties
spring.jpa.show-sql=false
```
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

### Como testar

Confira no log qual perfil foi ativado e teste uma propriedade que muda entre perfis.

## Scheduling

### Quando usar

Executar tarefas em horários ou intervalos.

### Dependência

Faz parte do Spring Framework.

### Passo a passo

1. Adicione `@EnableScheduling` em uma configuração.
2. Crie método `@Scheduled`.
3. Escolha `fixedRate`, `fixedDelay` ou cron.
4. Não bloqueie o scheduler com tarefas muito pesadas.

### Implementação mínima

```java
@Configuration
@EnableScheduling
public class SchedulingConfig {}
```
```java
@Scheduled(cron = "0 0 2 * * *", zone = "America/Sao_Paulo")
public void executarLimpeza() {
    // rotina diária às 02:00
}
```

### Como testar

Durante desenvolvimento, use um intervalo curto e confirme pelo log; depois volte para o cron real.


### Fixed delay e fixed rate

```java
@Scheduled(fixedDelay = 5000)
void aposTerminarEsperaCincoSegundos() {}

@Scheduled(fixedRate = 5000)
void tentaRodarACadaCincoSegundos() {}
```

Use cron para horários de negócio e intervalos para tarefas técnicas simples.

## Security

### Quando usar

Controlar autenticação, autorização, senhas e acesso a endpoints.

### Dependência

`spring-boot-starter-security`

### Passo a passo

1. Adicione Spring Security.
2. Crie um `PasswordEncoder`.
3. Implemente/forneça um `UserDetailsService` quando usar usuário do banco.
4. Crie uma `SecurityFilterChain`.
5. Libere apenas rotas públicas.
6. Para APIs stateless, desabilite sessão e configure CSRF conscientemente.

### Implementação mínima

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        return http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .anyRequest().authenticated()
            )
            .build();
    }
}
```

### Como testar

A rota pública deve responder sem login; uma rota protegida deve ser bloqueada.


### Estrutura recomendada

```text
security/
├── SecurityConfig.java
└── CustomUserDetailsService.java
```

### Erros comuns

- `401` em rota que deveria ser pública: matcher não corresponde à URL real.
- `403`: usuário autenticado, mas sem autorização, ou CSRF interferindo em cenário baseado em sessão.
- senha nunca confere: senha foi salva sem BCrypt ou foi codificada duas vezes.
- `UserDetailsService` não encontrado: bean não foi registrado ou está fora do component scan.

### Observação de versão importante

No Spring Security 6.x, uma configuração segura para `DaoAuthenticationProvider` é:

```java
DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
provider.setUserDetailsService(userDetailsService);
provider.setPasswordEncoder(passwordEncoder);
```

Não copie cegamente exemplos de Spring Security 7 para um projeto 6.x.

## Security com JWT

### Quando usar

Autenticar uma API stateless usando token Bearer.

### Dependência

Spring Security + biblioteca JWT escolhida, ou OAuth2 Resource Server quando apropriado.

### Passo a passo

1. Autentique e valide usuário/senha com `AuthenticationManager`.
2. Gere token contendo subject/claims e expiração.
3. Crie filtro que lê `Authorization: Bearer ...`.
4. Valide token e configure `SecurityContextHolder`.
5. Adicione o filtro antes de `UsernamePasswordAuthenticationFilter`.
6. Use `SessionCreationPolicy.STATELESS`.

### Implementação mínima

```java
@Bean
AuthenticationProvider authenticationProvider(
        UserDetailsService userDetailsService,
        PasswordEncoder passwordEncoder) {

    // Forma compatível com Spring Security 6.x:
    DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
    provider.setUserDetailsService(userDetailsService);
    provider.setPasswordEncoder(passwordEncoder);
    return provider;
}
```
```java
@Bean
SecurityFilterChain securityFilterChain(
        HttpSecurity http,
        JwtAuthenticationFilter jwtFilter,
        AuthenticationProvider provider) throws Exception {

    return http
        .csrf(csrf -> csrf.disable())
        .sessionManagement(session ->
            session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        )
        .authenticationProvider(provider)
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/auth/**").permitAll()
            .anyRequest().authenticated()
        )
        .addFilterBefore(
            jwtFilter,
            UsernamePasswordAuthenticationFilter.class
        )
        .build();
}
```

### Como testar

Teste login, token válido, token ausente, token expirado e token adulterado.


### Fluxo completo

```text
POST /api/auth/login
        ↓
AuthenticationManager
        ↓
AuthenticationProvider
        ↓
UserDetailsService + PasswordEncoder
        ↓
credenciais válidas
        ↓
JwtService gera token
        ↓
frontend salva token
        ↓
Authorization: Bearer TOKEN
        ↓
JwtAuthenticationFilter
        ↓
SecurityContextHolder
        ↓
Controller protegido
```

### Esqueleto do filtro

```java
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        if (header == null || !header.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = header.substring(7);

        // 1. validar token
        // 2. extrair username
        // 3. carregar UserDetails
        // 4. criar Authentication
        // 5. colocar no SecurityContextHolder

        filterChain.doFilter(request, response);
    }
}
```

### Erros comuns

- filtro não registrado antes de `UsernamePasswordAuthenticationFilter`;
- token inclui `"Bearer "` dentro do próprio valor armazenado;
- secret pequeno/incompatível com algoritmo;
- expiração interpretada em segundos quando código espera milissegundos;
- esquecer `STATELESS`;
- frontend não envia header em todas as chamadas.

## Specifications

### Quando usar

Criar filtros dinâmicos combináveis sem multiplicar métodos do repository.

### Dependência

Já vem com Spring Data JPA.

### Passo a passo

1. Faça o repository estender `JpaSpecificationExecutor<T>`.
2. Crie métodos que retornem `Specification<T>`.
3. Retorne `null` ou `conjunction()` para filtros não preenchidos, conforme o estilo adotado.
4. Combine filtros com `and()`.

### Implementação mínima

```java
public interface ProdutoRepository
        extends JpaRepository<Produto, Long>,
                JpaSpecificationExecutor<Produto> {
}
```
```java
public final class ProdutoSpecifications {

    public static Specification<Produto> nomeContem(String nome) {
        return (root, query, cb) -> {
            if (nome == null || nome.isBlank()) {
                return null;
            }

            return cb.like(
                cb.lower(root.get("nome")),
                "%" + nome.toLowerCase() + "%"
            );
        };
    }
}
```

### Como testar

Teste nenhum filtro, um filtro e vários filtros ao mesmo tempo.


### DTO de filtro

```java
public record ProdutoFiltro(
    String nome,
    Long categoriaId,
    BigDecimal precoMin,
    BigDecimal precoMax,
    Boolean ativo
) {}
```

### Combinação

```java
Specification<Produto> spec = Specification
    .where(ProdutoSpecifications.nomeContem(filtro.nome()))
    .and(ProdutoSpecifications.categoriaIgual(filtro.categoriaId()))
    .and(ProdutoSpecifications.precoMinimo(filtro.precoMin()))
    .and(ProdutoSpecifications.precoMaximo(filtro.precoMax()))
    .and(ProdutoSpecifications.ativoIgual(filtro.ativo()));

return repository.findAll(spec, pageable);
```

### Filtro por relacionamento

```java
public static Specification<Produto> categoriaIgual(Long categoriaId) {
    return (root, query, cb) -> {
        if (categoriaId == null) return null;
        return cb.equal(root.get("categoria").get("id"), categoriaId);
    };
}
```

## Testes

### Quando usar

Testar unidade, camada web, JPA e integração.

### Dependência

`spring-boot-starter-test`

### Passo a passo

1. Use JUnit 5/Mockito para unidade.
2. Use `@WebMvcTest` para controller.
3. Use `@DataJpaTest` para repository.
4. Use `@SpringBootTest` quando precisar do contexto completo.
5. Não use sempre `@SpringBootTest`; é mais pesado.

### Implementação mínima

```java
@ExtendWith(MockitoExtension.class)
class ProdutoServiceTest {

    @Mock
    ProdutoRepository repository;

    @InjectMocks
    ProdutoService service;

    @Test
    void deveBuscarProduto() {
        // arrange / act / assert
    }
}
```
```java
@WebMvcTest(ProdutoController.class)
class ProdutoControllerTest {

    @Autowired
    MockMvc mockMvc;

    @MockBean
    ProdutoService service;
}
```

### Como testar

Execute `mvn test` e mantenha testes independentes de dados manuais locais.


### Teste de controller com MockMvc

```java
@WebMvcTest(ProdutoController.class)
class ProdutoControllerTest {

    @Autowired
    MockMvc mvc;

    @MockBean
    ProdutoService service;

    @Test
    void deveRetornar200() throws Exception {
        when(service.buscar(1L))
            .thenReturn(new ProdutoResponse(1L, "Mouse"));

        mvc.perform(get("/api/produtos/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.nome").value("Mouse"));
    }
}
```

### Teste de repository

```java
@DataJpaTest
class ProdutoRepositoryTest {

    @Autowired
    ProdutoRepository repository;

    @Test
    void devePersistir() {
        Produto produto = new Produto();
        produto.setNome("Mouse");
        produto.setPreco(new BigDecimal("100"));

        Produto salvo = repository.save(produto);

        assertNotNull(salvo.getId());
    }
}
```

## Transactions

### Quando usar

Garantir que várias operações de banco sejam confirmadas ou revertidas como uma unidade.

### Dependência

Já vem com Data JPA; o suporte transacional é parte do Spring Framework.

### Passo a passo

1. Coloque `@Transactional` na camada de service.
2. Use `readOnly = true` para consultas quando fizer sentido.
3. Entenda que chamada interna no mesmo bean pode não passar pelo proxy transacional.
4. Por padrão, exceções unchecked causam rollback.

### Implementação mínima

```java
@Service
public class PedidoService {

    @Transactional
    public void finalizar(Long pedidoId) {
        Pedido pedido = buscarEntidade(pedidoId);
        baixarEstoque(pedido);
        pedido.setStatus(StatusPedido.FINALIZADO);
    }

    @Transactional(readOnly = true)
    public PedidoResponse buscar(Long id) {
        return mapper.toResponse(buscarEntidade(id));
    }
}
```

### Como testar

Provoque uma exceção após a primeira alteração e confirme que nenhuma mudança parcial ficou gravada.


### Exemplo com rollback

```java
@Transactional
public PedidoResponse criar(PedidoRequest request) {
    Pedido pedido = salvarCabecalho(request);
    baixarEstoque(request.itens());

    // Se baixarEstoque lançar RuntimeException,
    // o cabeçalho também é revertido.
    return mapper.toResponse(pedido);
}
```

### Armadilha de self-invocation

Isto pode não aplicar a transação do método interno como você espera:

```java
public void metodoA() {
    metodoB(); // chamada no mesmo objeto
}

@Transactional
public void metodoB() {
}
```

A razão é que a interceptação típica ocorre por proxy.

## Upload de arquivos

### Quando usar

Receber arquivos enviados por formulário multipart.

### Dependência

Já suportado por `spring-boot-starter-web` para multipart.

### Passo a passo

1. Configure limites máximos.
2. Receba `MultipartFile` no controller.
3. Valide tamanho, content type e nome.
4. Gere nome seguro no servidor; não confie no nome original.
5. Nunca salve arquivo arbitrário em caminho fornecido pelo cliente.

### Implementação mínima

```properties
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
```
```java
@PostMapping(value = "/arquivos", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
public ResponseEntity<Void> upload(
        @RequestPart("arquivo") MultipartFile arquivo) {

    arquivoService.salvar(arquivo);
    return ResponseEntity.noContent().build();
}
```

### Como testar

Envie arquivo válido, arquivo acima do limite e tipo não permitido.


### Nome seguro

```java
String extensao = ".bin"; // determine de forma controlada
String nomeSeguro = UUID.randomUUID() + extensao;
Path destino = uploadDir.resolve(nomeSeguro).normalize();

if (!destino.startsWith(uploadDir)) {
    throw new IllegalArgumentException("Caminho inválido");
}
```

## Validation

### Quando usar

Validar dados de entrada antes da regra de negócio.

### Dependência

`spring-boot-starter-validation`

### Passo a passo

1. Adicione o starter de Validation.
2. Coloque anotações como `@NotBlank`, `@Email`, `@Size`, `@Min`, `@Positive` no DTO.
3. Use `@Valid` no parâmetro do controller.
4. Trate `MethodArgumentNotValidException` em um `@RestControllerAdvice` para uma resposta amigável.

### Implementação mínima

```java
public record ProdutoRequest(
    @NotBlank(message = "Nome é obrigatório")
    @Size(max = 120)
    String nome,

    @NotNull
    @PositiveOrZero
    BigDecimal preco
) {}
```

### Como testar

Envie um POST sem nome e confirme HTTP 400 antes de o service gravar dados.


### Tratamento global

```java
@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<Map<String, String>> handleValidation(
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

### Validação customizada no service

Validation resolve formato/estrutura. Regras dependentes do banco normalmente ficam no service:

```java
if (repository.existsByEmailIgnoreCase(request.email())) {
    throw new RegraNegocioException("E-mail já cadastrado");
}
```

## WebClient / RestClient

### Quando usar

Consumir APIs externas do backend.

### Dependência

`RestClient` vem do Spring Framework web; `WebClient` normalmente é usado com `spring-boot-starter-webflux`.

### Passo a passo

1. Para aplicações MVC síncronas modernas, considere `RestClient`.
2. Para fluxo reativo, use `WebClient`.
3. Configure base URL, headers, timeout e tratamento de erro.
4. Não crie cliente novo a cada chamada.

### Implementação mínima

```java
@Configuration
public class HttpClientConfig {

    @Bean
    RestClient catalogoClient(RestClient.Builder builder) {
        return builder
            .baseUrl("https://api.example.com")
            .build();
    }
}
```
```java
ProdutoExterno response = catalogoClient.get()
    .uri("/produtos/{id}", id)
    .retrieve()
    .body(ProdutoExterno.class);
```

### Como testar

Use uma API de teste/mock e valide sucesso, timeout e resposta 4xx/5xx.


### RestClient com tratamento de status

```java
return client.get()
    .uri("/produtos/{id}", id)
    .retrieve()
    .onStatus(
        status -> status.value() == 404,
        (request, response) -> {
            throw new ProdutoExternoNaoEncontradoException();
        }
    )
    .body(ProdutoExterno.class);
```

## WebSocket

### Quando usar

Comunicação bidirecional em tempo real, por exemplo notificações e chat.

### Dependência

`spring-boot-starter-websocket`

### Passo a passo

1. Adicione starter WebSocket.
2. Habilite broker STOMP quando usar esse modelo.
3. Defina endpoint de handshake.
4. Defina prefixos de destino.
5. Proteja mensagens/endpoints quando houver autenticação.

### Implementação mínima

```java
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig
        implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/topic");
        registry.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
            .setAllowedOrigins("http://localhost:5173");
    }
}
```
```java
@MessageMapping("/mensagem")
@SendTo("/topic/mensagens")
public Mensagem enviar(Mensagem mensagem) {
    return mensagem;
}
```

### Como testar

Conecte um cliente STOMP, assine `/topic/mensagens`, envie para `/app/mensagem` e confirme o retorno.


### Quando não usar

Não use WebSocket apenas para atualizar uma tela uma vez ao minuto. Polling simples pode ser suficiente. WebSocket vale mais quando baixa latência e bidirecionalidade importam.

## Sequência recomendada para montar um CRUD completo

1. Spring Initializr / `pom.xml`.
2. Configuração do banco.
3. Entidade.
4. Repository.
5. DTOs.
6. Service.
7. Controller.
8. Validation.
9. `@RestControllerAdvice`.
10. CORS.
11. Security.
12. JWT ou OAuth2.
13. Filtros/Specifications.
14. Paginação.
15. Transactions.
16. Testes.
17. Actuator.
18. Flyway antes de produção.

Essa ordem reduz a quantidade de problemas simultâneos.

## Diagnóstico por mensagem de erro

| Erro/sintoma | Primeiro lugar para olhar |
| --- | --- |
| `NoSuchBeanDefinitionException` | Bean/component scan/configuração. |
| `BeanCreationException` | Veja o primeiro `Caused by:`. |
| `Failed to configure a DataSource` | URL/driver/usuário/senha. |
| `Table ... doesn't exist` | Migração/ddl-auto/schema. |
| `401 Unauthorized` | Autenticação/token/filtro. |
| `403 Forbidden` | Autorização/CSRF/roles. |
| CORS no navegador | CORS no Spring MVC/Security. |
| `LazyInitializationException` | Fronteira transacional/fetch/DTO. |
| `MethodArgumentNotValidException` | Payload falhou no Bean Validation. |
| `HttpMessageNotReadableException` | JSON inválido/tipo incompatível/enum/data. |
| `the constructor ... is undefined` | Exemplo copiado de outra versão da biblioteca. |
