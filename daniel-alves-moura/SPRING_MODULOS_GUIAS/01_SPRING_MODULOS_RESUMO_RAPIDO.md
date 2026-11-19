
# Spring Boot — configuração prática por módulos

Esta é a **versão rápida** do guia de consulta para configurar os principais módulos do ecossistema Spring em projetos web com Java 21.

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

Use quando você já sabe o que o módulo faz e só precisa lembrar **dependência → anotação/configuração → exemplo mínimo → teste**.

## Actuator

**Objetivo:** Expor health, métricas e informações operacionais.

**Dependência:** `spring-boot-starter-actuator`

**Passos:**

- Adicione Actuator.
- Escolha quais endpoints serão expostos.
- Proteja endpoints sensíveis.
- Use `/actuator/health` como primeira verificação.

**Exemplo mínimo:**

```properties
management.endpoints.web.exposure.include=health,info,metrics
management.endpoint.health.show-details=when_authorized
```

**Como testar:** Acesse `/actuator/health` e confirme `UP` quando dependências estiverem saudáveis.

## AOP

**Objetivo:** Aplicar comportamento transversal como logging, auditoria ou medição sem repetir código.

**Dependência:** `spring-boot-starter-aop`

**Passos:**

- Adicione starter AOP.
- Crie `@Aspect`.
- Defina pointcut.
- Use `@Around`, `@Before`, `@AfterReturning` conforme a necessidade.
- Evite esconder regra de negócio importante dentro de aspectos.

**Exemplo mínimo:**

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

**Como testar:** Execute um service e confirme que o aspecto envolve a chamada sem mudar o resultado.

## Async

**Objetivo:** Executar métodos em outra thread sem bloquear a chamada atual.

**Dependência:** Faz parte do Spring Framework.

**Passos:**

- Habilite `@EnableAsync`.
- Marque método público em outro bean com `@Async`.
- Quando precisar de retorno, use `CompletableFuture`.
- Configure executor dedicado em aplicações sérias.

**Exemplo mínimo:**

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

**Como testar:** Registre o nome da thread e confirme que difere da thread HTTP.

## Beans e Injeção de Dependência

**Objetivo:** Registrar objetos no container Spring e receber dependências sem instanciar tudo manualmente.

**Dependência:** Nenhuma dependência extra: faz parte do Spring Core.

**Passos:**

- Marque classes de serviço com `@Service`, repositórios com `@Repository`, controladores com `@RestController` e componentes genéricos com `@Component`.
- Prefira injeção por construtor.
- Use `@Bean` quando o objeto vem de biblioteca externa ou precisa de criação manual.
- Evite `new MinhaService()` em classes gerenciadas pelo Spring.

**Exemplo mínimo:**

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

**Como testar:** Se a aplicação iniciar sem `NoSuchBeanDefinitionException`, o bean foi encontrado. Para confirmar, injete-o em um controller ou teste.

## Cache

**Objetivo:** Evitar recomputar ou consultar repetidamente dados caros.

**Dependência:** `spring-boot-starter-cache` + implementação de cache opcional (Caffeine, Redis etc.)

**Passos:**

- Adicione o starter de cache.
- Habilite `@EnableCaching`.
- Use `@Cacheable`, `@CachePut` e `@CacheEvict`.
- Defina claramente quando invalidar o cache.

**Exemplo mínimo:**

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

**Como testar:** Chame o mesmo método duas vezes e confirme, via log/profiler, que a consulta cara executa apenas quando necessário.

## Configuração e Properties

**Objetivo:** Mover URLs, segredos, limites e comportamentos para arquivos de configuração/variáveis de ambiente.

**Dependência:** Faz parte do Spring Boot. Para metadados no IDE, opcionalmente use `spring-boot-configuration-processor`.

**Passos:**

- Use `application.properties` ou `application.yml`.
- Para poucas propriedades, `@Value` funciona.
- Para grupos de propriedades, prefira `@ConfigurationProperties`.
- Nunca fixe senha de produção no código-fonte.

**Exemplo mínimo:**

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

**Como testar:** Defina uma variável de ambiente e confira se o valor recebido muda sem recompilar.

## CORS

**Objetivo:** Permitir que o frontend em uma origem diferente chame a API.

**Dependência:** Já faz parte do stack web/Security.

**Passos:**

- Defina origens específicas, métodos e headers.
- Se houver Spring Security, habilite `.cors(...)` também na `SecurityFilterChain`.
- Evite `*` com credenciais.
- Em desenvolvimento, normalmente permita `http://localhost:5173` para Vite.

**Exemplo mínimo:**

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

**Como testar:** Abra o frontend em outra porta e confira no DevTools se o preflight OPTIONS e a requisição final passam.

## Data JPA

**Objetivo:** Persistir entidades relacionais usando JPA/Hibernate e repositories.

**Dependência:** `spring-boot-starter-data-jpa` + driver do banco

**Passos:**

- Adicione Data JPA e o driver do banco.
- Configure datasource.
- Crie entidade com `@Entity`, `@Id` e estratégia de geração.
- Crie repository estendendo `JpaRepository`.
- Use service para coordenar persistência.

**Exemplo mínimo:**

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

**Como testar:** Suba o banco, inicie a aplicação e confirme que a tabela/consulta funcionam. Em projeto real, prefira migrações a `ddl-auto=update`.

## Eventos

**Objetivo:** Desacoplar ações internas usando publicação/escuta de eventos.

**Dependência:** Faz parte do Spring Core.

**Passos:**

- Defina um record/classe de evento.
- Injete `ApplicationEventPublisher`.
- Publique após a ação principal.
- Use `@EventListener` ou `@TransactionalEventListener` quando depender da transação.

**Exemplo mínimo:**

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

**Como testar:** Crie um pedido e confirme que o listener recebe exatamente um evento.

## Flyway

**Objetivo:** Versionar alterações de schema de forma reproduzível.

**Dependência:** `org.flywaydb:flyway-core` e, dependendo da versão/banco, módulo específico do banco.

**Passos:**

- Adicione Flyway.
- Crie scripts em `src/main/resources/db/migration`.
- Nomeie como `V1__descricao.sql`, `V2__descricao.sql` etc.
- Em projetos com migração, normalmente use `ddl-auto=validate` ou `none` em vez de `update`.

**Exemplo mínimo:**

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

**Como testar:** Apague/crie banco de teste e confirme que o schema é reconstruído apenas pelas migrações.

## Jackson / JSON

**Objetivo:** Converter Java ↔ JSON e controlar nomes/formato de campos.

**Dependência:** Já vem com `spring-boot-starter-web`.

**Passos:**

- DTOs são serializados automaticamente.
- Use `@JsonProperty` para renomear um campo.
- Use `@JsonIgnore` para não serializar um campo.
- Evite serializar entidades JPA complexas diretamente, pois relacionamentos podem causar ciclos.

**Exemplo mínimo:**

```java
public record UsuarioResponse(
    Long id,
    String nome,
    @JsonProperty("email_principal")
    String email
) {}
```

**Como testar:** Faça uma requisição e compare exatamente o JSON devolvido com o contrato esperado.

## Mail

**Objetivo:** Enviar e-mails via SMTP.

**Dependência:** `spring-boot-starter-mail`

**Passos:**

- Adicione starter de mail.
- Configure host, porta, usuário, senha e TLS.
- Injete `JavaMailSender`.
- Não coloque credenciais reais no Git.

**Exemplo mínimo:**

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

**Como testar:** Use servidor SMTP de teste/local antes de usar credenciais reais.

## MVC / REST

**Objetivo:** Criar APIs HTTP com controllers, rotas, parâmetros e corpos JSON.

**Dependência:** `spring-boot-starter-web`

**Passos:**

- Adicione `spring-boot-starter-web`.
- Crie `@RestController` e um `@RequestMapping` base.
- Use `@GetMapping`, `@PostMapping`, `@PutMapping` e `@DeleteMapping`.
- Use DTOs no corpo da requisição em vez de expor diretamente a entidade.
- Retorne códigos HTTP adequados.

**Exemplo mínimo:**

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

**Como testar:** Use um arquivo `.http`, Postman ou curl e teste GET/POST separadamente.

## OAuth2 Resource Server

**Objetivo:** Validar access tokens emitidos por um Authorization Server/IdP sem implementar JWT manualmente.

**Dependência:** `spring-boot-starter-oauth2-resource-server`

**Passos:**

- Adicione Resource Server.
- Configure `issuer-uri` ou JWK Set.
- Ative `.oauth2ResourceServer(...)` na SecurityFilterChain.
- Mapeie authorities/claims conforme necessário.
- Prefira esse caminho quando autenticação é delegada a Keycloak/Auth0/Entra/servidor OAuth2.

**Exemplo mínimo:**

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

**Como testar:** Teste token válido do emissor correto e tokens com emissor/assinatura/expiração incorretos.

## Perfis

**Objetivo:** Ter configurações diferentes para desenvolvimento, teste e produção.

**Dependência:** Faz parte do Spring Boot.

**Passos:**

- Crie `application-dev.properties`, `application-test.properties` e `application-prod.properties`.
- Ative um perfil com `spring.profiles.active=dev`, variável `SPRING_PROFILES_ACTIVE`, parâmetro Maven ou argumento da aplicação.
- Use `@Profile` apenas quando realmente precisar criar beans diferentes.

**Exemplo mínimo:**

```properties
# application-dev.properties
spring.jpa.show-sql=true

# application-prod.properties
spring.jpa.show-sql=false
```
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

**Como testar:** Confira no log qual perfil foi ativado e teste uma propriedade que muda entre perfis.

## Scheduling

**Objetivo:** Executar tarefas em horários ou intervalos.

**Dependência:** Faz parte do Spring Framework.

**Passos:**

- Adicione `@EnableScheduling` em uma configuração.
- Crie método `@Scheduled`.
- Escolha `fixedRate`, `fixedDelay` ou cron.
- Não bloqueie o scheduler com tarefas muito pesadas.

**Exemplo mínimo:**

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

**Como testar:** Durante desenvolvimento, use um intervalo curto e confirme pelo log; depois volte para o cron real.

## Security

**Objetivo:** Controlar autenticação, autorização, senhas e acesso a endpoints.

**Dependência:** `spring-boot-starter-security`

**Passos:**

- Adicione Spring Security.
- Crie um `PasswordEncoder`.
- Implemente/forneça um `UserDetailsService` quando usar usuário do banco.
- Crie uma `SecurityFilterChain`.
- Libere apenas rotas públicas.
- Para APIs stateless, desabilite sessão e configure CSRF conscientemente.

**Exemplo mínimo:**

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

**Como testar:** A rota pública deve responder sem login; uma rota protegida deve ser bloqueada.

## Security com JWT

**Objetivo:** Autenticar uma API stateless usando token Bearer.

**Dependência:** Spring Security + biblioteca JWT escolhida, ou OAuth2 Resource Server quando apropriado.

**Passos:**

- Autentique e valide usuário/senha com `AuthenticationManager`.
- Gere token contendo subject/claims e expiração.
- Crie filtro que lê `Authorization: Bearer ...`.
- Valide token e configure `SecurityContextHolder`.
- Adicione o filtro antes de `UsernamePasswordAuthenticationFilter`.
- Use `SessionCreationPolicy.STATELESS`.

**Exemplo mínimo:**

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

**Como testar:** Teste login, token válido, token ausente, token expirado e token adulterado.

## Specifications

**Objetivo:** Criar filtros dinâmicos combináveis sem multiplicar métodos do repository.

**Dependência:** Já vem com Spring Data JPA.

**Passos:**

- Faça o repository estender `JpaSpecificationExecutor<T>`.
- Crie métodos que retornem `Specification<T>`.
- Retorne `null` ou `conjunction()` para filtros não preenchidos, conforme o estilo adotado.
- Combine filtros com `and()`.

**Exemplo mínimo:**

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

**Como testar:** Teste nenhum filtro, um filtro e vários filtros ao mesmo tempo.

## Testes

**Objetivo:** Testar unidade, camada web, JPA e integração.

**Dependência:** `spring-boot-starter-test`

**Passos:**

- Use JUnit 5/Mockito para unidade.
- Use `@WebMvcTest` para controller.
- Use `@DataJpaTest` para repository.
- Use `@SpringBootTest` quando precisar do contexto completo.
- Não use sempre `@SpringBootTest`; é mais pesado.

**Exemplo mínimo:**

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

**Como testar:** Execute `mvn test` e mantenha testes independentes de dados manuais locais.

## Transactions

**Objetivo:** Garantir que várias operações de banco sejam confirmadas ou revertidas como uma unidade.

**Dependência:** Já vem com Data JPA; o suporte transacional é parte do Spring Framework.

**Passos:**

- Coloque `@Transactional` na camada de service.
- Use `readOnly = true` para consultas quando fizer sentido.
- Entenda que chamada interna no mesmo bean pode não passar pelo proxy transacional.
- Por padrão, exceções unchecked causam rollback.

**Exemplo mínimo:**

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

**Como testar:** Provoque uma exceção após a primeira alteração e confirme que nenhuma mudança parcial ficou gravada.

## Upload de arquivos

**Objetivo:** Receber arquivos enviados por formulário multipart.

**Dependência:** Já suportado por `spring-boot-starter-web` para multipart.

**Passos:**

- Configure limites máximos.
- Receba `MultipartFile` no controller.
- Valide tamanho, content type e nome.
- Gere nome seguro no servidor; não confie no nome original.
- Nunca salve arquivo arbitrário em caminho fornecido pelo cliente.

**Exemplo mínimo:**

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

**Como testar:** Envie arquivo válido, arquivo acima do limite e tipo não permitido.

## Validation

**Objetivo:** Validar dados de entrada antes da regra de negócio.

**Dependência:** `spring-boot-starter-validation`

**Passos:**

- Adicione o starter de Validation.
- Coloque anotações como `@NotBlank`, `@Email`, `@Size`, `@Min`, `@Positive` no DTO.
- Use `@Valid` no parâmetro do controller.
- Trate `MethodArgumentNotValidException` em um `@RestControllerAdvice` para uma resposta amigável.

**Exemplo mínimo:**

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

**Como testar:** Envie um POST sem nome e confirme HTTP 400 antes de o service gravar dados.

## WebClient / RestClient

**Objetivo:** Consumir APIs externas do backend.

**Dependência:** `RestClient` vem do Spring Framework web; `WebClient` normalmente é usado com `spring-boot-starter-webflux`.

**Passos:**

- Para aplicações MVC síncronas modernas, considere `RestClient`.
- Para fluxo reativo, use `WebClient`.
- Configure base URL, headers, timeout e tratamento de erro.
- Não crie cliente novo a cada chamada.

**Exemplo mínimo:**

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

**Como testar:** Use uma API de teste/mock e valide sucesso, timeout e resposta 4xx/5xx.

## WebSocket

**Objetivo:** Comunicação bidirecional em tempo real, por exemplo notificações e chat.

**Dependência:** `spring-boot-starter-websocket`

**Passos:**

- Adicione starter WebSocket.
- Habilite broker STOMP quando usar esse modelo.
- Defina endpoint de handshake.
- Defina prefixos de destino.
- Proteja mensagens/endpoints quando houver autenticação.

**Exemplo mínimo:**

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

**Como testar:** Conecte um cliente STOMP, assine `/topic/mensagens`, envie para `/app/mensagem` e confirme o retorno.

## Checklist rápido de diagnóstico

- `pom.xml`: a dependência existe e a versão vem do Spring Boot BOM?
- A classe está dentro do pacote escaneado por `@SpringBootApplication`?
- O bean possui `@Component/@Service/@Repository/@Configuration` ou foi criado com `@Bean`?
- O nome da property está correto?
- A variável de ambiente realmente existe no processo que iniciou o Java?
- O banco/SMTP/API externa está acessível?
- A porta já está em uso?
- No Security, a rota foi liberada/protegida no matcher correto?
- Leia o primeiro `Caused by:` e não apenas a última linha do stack trace.
- Rode `mvn clean test` e depois `mvn spring-boot:run`.
