
# Spring Boot — configuração prática por módulos

Esta é a **versão aprofundada** do guia de consulta para configurar os principais módulos do ecossistema Spring em projetos web com Java 21.

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


## Objetivo desta versão

Esta versão explica não só **o que copiar**, mas **por que a configuração funciona**, quais proxies/filtros/auto-configurações estão envolvidos, onde costumam surgir incompatibilidades de versão e como escolher entre alternativas.

## Arquitetura de referência

```text
HTTP
 ↓
Filter Chain / Security
 ↓
DispatcherServlet
 ↓
Controller
 ↓
Validation / DTO
 ↓
Service
 ↓
@Transactional
 ↓
Repository
 ↓
JPA / Hibernate
 ↓
DataSource
 ↓
Banco
```

Componentes transversais:

```text
Config Properties
CORS
Exception Handler
Cache
AOP
Events
Async
Scheduling
Actuator
Observability
```

## Actuator

### Papel no sistema

Expor health, métricas e informações operacionais.

### Dependência / origem

`spring-boot-starter-actuator`

### Configuração base — passo a passo

1. Adicione Actuator.
2. Escolha quais endpoints serão expostos.
3. Proteja endpoints sensíveis.
4. Use `/actuator/health` como primeira verificação.

### Implementação mínima funcional

```properties
management.endpoints.web.exposure.include=health,info,metrics
management.endpoint.health.show-details=when_authorized
```

### Teste mínimo

Acesse `/actuator/health` e confirme `UP` quando dependências estiverem saudáveis.


### Segurança

Não exponha tudo em produção sem proteção:

```properties
management.endpoints.web.exposure.include=health,info
```

`env`, `beans`, `configprops` e endpoints semelhantes podem revelar detalhes internos.

### Health contributors

Actuator agrega indicadores de saúde. Banco e outros componentes podem contribuir automaticamente conforme dependências.

### Kubernetes/infra

Health endpoints são úteis para readiness/liveness, mas a estratégia depende do ambiente.

### Métricas

Com Micrometer, Actuator pode expor métricas. Em sistemas reais, Prometheus/OTel são opções frequentes.

### Segurança operacional

Nunca trate Actuator como "só debug". Alguns endpoints revelam topologia/configuração e devem ser restritos.

## AOP

### Papel no sistema

Aplicar comportamento transversal como logging, auditoria ou medição sem repetir código.

### Dependência / origem

`spring-boot-starter-aop`

### Configuração base — passo a passo

1. Adicione starter AOP.
2. Crie `@Aspect`.
3. Defina pointcut.
4. Use `@Around`, `@Before`, `@AfterReturning` conforme a necessidade.
5. Evite esconder regra de negócio importante dentro de aspectos.

### Implementação mínima funcional

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

### Teste mínimo

Execute um service e confirme que o aspecto envolve a chamada sem mudar o resultado.


### Quando evitar

Se o comportamento faz parte da regra principal do caso de uso, deixe explícito no service. AOP é melhor para aspectos transversais.

### Join point e pointcut

AspectJ pointcut expressions escolhem quais métodos serão interceptados.

```java
@Around("@annotation(Auditavel)")
```

pode ser mais controlável que interceptar pacote inteiro.

### Proxy limitation

Assim como transações e async, self-invocation é uma armadilha frequente em AOP baseado em proxy.

## Async

### Papel no sistema

Executar métodos em outra thread sem bloquear a chamada atual.

### Dependência / origem

Faz parte do Spring Framework.

### Configuração base — passo a passo

1. Habilite `@EnableAsync`.
2. Marque método público em outro bean com `@Async`.
3. Quando precisar de retorno, use `CompletableFuture`.
4. Configure executor dedicado em aplicações sérias.

### Implementação mínima funcional

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

### Teste mínimo

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

### Proxy novamente

`@Async` também depende normalmente de proxy. Chamada interna no mesmo bean pode não ser assíncrona.

### Contexto

Thread local/security/MDC não é automaticamente igual em outra thread. Se precisar propagar contexto, configure conscientemente.

### Exceções

Em método `void @Async`, exceções não voltam ao chamador como numa chamada síncrona. Planeje tratamento.

## Beans e Injeção de Dependência

### Papel no sistema

Registrar objetos no container Spring e receber dependências sem instanciar tudo manualmente.

### Dependência / origem

Nenhuma dependência extra: faz parte do Spring Core.

### Configuração base — passo a passo

1. Marque classes de serviço com `@Service`, repositórios com `@Repository`, controladores com `@RestController` e componentes genéricos com `@Component`.
2. Prefira injeção por construtor.
3. Use `@Bean` quando o objeto vem de biblioteca externa ou precisa de criação manual.
4. Evite `new MinhaService()` em classes gerenciadas pelo Spring.

### Implementação mínima funcional

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

### Teste mínimo

Se a aplicação iniciar sem `NoSuchBeanDefinitionException`, o bean foi encontrado. Para confirmar, injete-o em um controller ou teste.


### O que acontece por baixo

`@SpringBootApplication` combina, entre outras coisas, component scanning e auto-configuração. O Spring monta um `ApplicationContext`, registra `BeanDefinition`s e cria objetos gerenciados.

A injeção por construtor deixa dependências explícitas e favorece imutabilidade/testes:

```java
@Service
public class PedidoService {
    private final PedidoRepository pedidoRepository;
    private final EstoqueService estoqueService;

    public PedidoService(
            PedidoRepository pedidoRepository,
            EstoqueService estoqueService) {
        this.pedidoRepository = pedidoRepository;
        this.estoqueService = estoqueService;
    }
}
```

### `@Component` vs especializações

- `@Component`: genérico.
- `@Service`: intenção de camada de negócio.
- `@Repository`: intenção de persistência e integração com tradução de exceções.
- `@Controller`: MVC com views.
- `@RestController`: `@Controller + @ResponseBody`.
- `@Configuration`: fonte de beans/configuração.

### Mais de um bean do mesmo tipo

```java
public interface Notificador {
    void enviar(String mensagem);
}
```

```java
@Component("email")
class EmailNotificador implements Notificador { ... }

@Component("sms")
class SmsNotificador implements Notificador { ... }
```

```java
public PedidoService(@Qualifier("email") Notificador notificador) {
    this.notificador = notificador;
}
```

Use `@Primary` quando houver um padrão.

### Escopos

Em aplicações web, singleton é o padrão. Existem também `prototype`, `request`, `session` e outros. Não mude o escopo sem necessidade.

## Cache

### Papel no sistema

Evitar recomputar ou consultar repetidamente dados caros.

### Dependência / origem

`spring-boot-starter-cache` + implementação de cache opcional (Caffeine, Redis etc.)

### Configuração base — passo a passo

1. Adicione o starter de cache.
2. Habilite `@EnableCaching`.
3. Use `@Cacheable`, `@CachePut` e `@CacheEvict`.
4. Defina claramente quando invalidar o cache.

### Implementação mínima funcional

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

### Teste mínimo

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

### Cache-aside via anotação

`@Cacheable` consulta cache antes de executar o método.

`@CachePut` executa o método e atualiza cache.

`@CacheEvict` remove entrada.

### Chave

```java
@Cacheable(cacheNames = "produto", key = "#id")
```

Chaves ruins geram colisão ou cache inútil.

### Consistência

O principal problema não é "como salvar no cache", mas garantir que uma mutação invalide as entradas corretas.

## Configuração e Properties

### Papel no sistema

Mover URLs, segredos, limites e comportamentos para arquivos de configuração/variáveis de ambiente.

### Dependência / origem

Faz parte do Spring Boot. Para metadados no IDE, opcionalmente use `spring-boot-configuration-processor`.

### Configuração base — passo a passo

1. Use `application.properties` ou `application.yml`.
2. Para poucas propriedades, `@Value` funciona.
3. Para grupos de propriedades, prefira `@ConfigurationProperties`.
4. Nunca fixe senha de produção no código-fonte.

### Implementação mínima funcional

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

### Teste mínimo

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

### Ordem e externalização

Spring Boot combina fontes de configuração, incluindo arquivos, variáveis de ambiente e argumentos. Para produção, externalize segredos.

### `@Value` vs `@ConfigurationProperties`

`@Value` é conveniente para algo pontual:

```java
@Value("${app.nome}")
private String nome;
```

Para conjunto coerente, prefira tipo próprio:

```java
@ConfigurationProperties("app.security")
@Validated
public record SecurityProperties(
    @NotBlank String issuer,
    @DurationMin(seconds = 30) Duration tokenTtl
) {}
```

A grande vantagem é tipagem, validação e centralização.

### YAML

```yaml
app:
  security:
    issuer: minha-api
    token-ttl: 1h
```

### Diagnóstico

Quando uma property parece ignorada:
1. confirme perfil ativo;
2. procure variável de ambiente sobrescrevendo;
3. verifique prefixo;
4. verifique se `@ConfigurationPropertiesScan` está ativo;
5. evite duplicar a mesma property em múltiplos arquivos sem entender precedência.

## CORS

### Papel no sistema

Permitir que o frontend em uma origem diferente chame a API.

### Dependência / origem

Já faz parte do stack web/Security.

### Configuração base — passo a passo

1. Defina origens específicas, métodos e headers.
2. Se houver Spring Security, habilite `.cors(...)` também na `SecurityFilterChain`.
3. Evite `*` com credenciais.
4. Em desenvolvimento, normalmente permita `http://localhost:5173` para Vite.

### Implementação mínima funcional

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

### Teste mínimo

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

### Por que existe

CORS é política aplicada pelo navegador para requisições cross-origin. Não é mecanismo de autenticação.

### Preflight

Requisições não simples podem gerar `OPTIONS` antes da chamada real. Se Security bloquear OPTIONS ou CORS não estiver integrado, a chamada falha no navegador.

### Credenciais

Quando `allowCredentials(true)` é usado, configure origens explicitamente. Não combine credenciais com origem curinga de maneira insegura.

### Desenvolvimento vs produção

Desenvolvimento:

```text
http://localhost:5173
```

Produção:

```text
https://app.seudominio.com
```

Mantenha origens em properties por ambiente.

## Data JPA

### Papel no sistema

Persistir entidades relacionais usando JPA/Hibernate e repositories.

### Dependência / origem

`spring-boot-starter-data-jpa` + driver do banco

### Configuração base — passo a passo

1. Adicione Data JPA e o driver do banco.
2. Configure datasource.
3. Crie entidade com `@Entity`, `@Id` e estratégia de geração.
4. Crie repository estendendo `JpaRepository`.
5. Use service para coordenar persistência.

### Implementação mínima funcional

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

### Teste mínimo

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

### Ciclo de vida de entidade

Entidades podem estar:
- transient;
- managed;
- detached;
- removed.

Dentro do contexto de persistência, alterações em entidade managed podem ser sincronizadas no flush sem chamar `save` novamente em cada mudança.

### `save()` não significa sempre INSERT

O comportamento depende se a entidade é nova. Pode haver `persist` ou `merge` por baixo.

### Fetch

- `LAZY`: carrega quando acessado.
- `EAGER`: carrega antecipadamente.

Evite resolver `LazyInitializationException` tornando tudo EAGER. Normalmente o melhor é modelar a consulta/DTO/fetch conforme o caso de uso.

### `@EntityGraph`

```java
@EntityGraph(attributePaths = "categoria")
Optional<Produto> findComCategoriaById(Long id);
```

### Projeções

Quando só precisa de poucos campos, projeção/DTO query pode reduzir carga.

### N+1

Sintoma:

```text
1 query de produtos
+ 1 query de categoria para cada produto
```

Soluções possíveis:
- fetch join;
- entity graph;
- projeção;
- batch fetching, conforme caso.

### Cascade

Não use `CascadeType.ALL` automaticamente em toda relação. Cascade define propagação de operações de persistência, não "facilidade geral".

## Eventos

### Papel no sistema

Desacoplar ações internas usando publicação/escuta de eventos.

### Dependência / origem

Faz parte do Spring Core.

### Configuração base — passo a passo

1. Defina um record/classe de evento.
2. Injete `ApplicationEventPublisher`.
3. Publique após a ação principal.
4. Use `@EventListener` ou `@TransactionalEventListener` quando depender da transação.

### Implementação mínima funcional

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

### Teste mínimo

Crie um pedido e confirme que o listener recebe exatamente um evento.


### Evento após commit

```java
@TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
public void aposCommit(PedidoCriadoEvent event) {
    // ação que só deve ocorrer se a transação realmente confirmar
}
```

### Evento de domínio vs integração

Evento interno do Spring ocorre dentro da aplicação/processo. Não equivale a mensageria durável entre sistemas.

Para integração entre serviços, Kafka/RabbitMQ/outbox podem ser necessários — outro problema arquitetural.

### Transacional

`@TransactionalEventListener(AFTER_COMMIT)` é útil quando a ação só faz sentido após commit.

## Flyway

### Papel no sistema

Versionar alterações de schema de forma reproduzível.

### Dependência / origem

`org.flywaydb:flyway-core` e, dependendo da versão/banco, módulo específico do banco.

### Configuração base — passo a passo

1. Adicione Flyway.
2. Crie scripts em `src/main/resources/db/migration`.
3. Nomeie como `V1__descricao.sql`, `V2__descricao.sql` etc.
4. Em projetos com migração, normalmente use `ddl-auto=validate` ou `none` em vez de `update`.

### Implementação mínima funcional

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

### Teste mínimo

Apague/crie banco de teste e confirme que o schema é reconstruído apenas pelas migrações.


### Ordem típica

```text
V1__estrutura_inicial.sql
V2__adicionar_coluna_status.sql
V3__criar_indice_email.sql
```

Nunca edite uma migração já executada em ambientes compartilhados. Crie uma nova versão.

### Baseline mental

Schema é código. O repositório deve conter a sequência que permite chegar ao estado esperado.

### Em equipe

- não renumerar migrações aplicadas;
- não editar migração antiga para "corrigir";
- criar migração nova;
- testar migrações em banco limpo e banco atualizado.

### Hibernate

`ddl-auto=validate` combina bem com Flyway porque Hibernate verifica o mapeamento sem tentar controlar a evolução do schema.

## Jackson / JSON

### Papel no sistema

Converter Java ↔ JSON e controlar nomes/formato de campos.

### Dependência / origem

Já vem com `spring-boot-starter-web`.

### Configuração base — passo a passo

1. DTOs são serializados automaticamente.
2. Use `@JsonProperty` para renomear um campo.
3. Use `@JsonIgnore` para não serializar um campo.
4. Evite serializar entidades JPA complexas diretamente, pois relacionamentos podem causar ciclos.

### Implementação mínima funcional

```java
public record UsuarioResponse(
    Long id,
    String nome,
    @JsonProperty("email_principal")
    String email
) {}
```

### Teste mínimo

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

### Ciclos JPA

Um `Produto` aponta para `Categoria`, que aponta para lista de `Produto`: serializar ambos diretamente pode recursar.

DTOs resolvem o contrato explicitamente:

```java
public record ProdutoResponse(
    Long id,
    String nome,
    Long categoriaId,
    String categoriaNome
) {}
```

### Enums

JSON inválido para enum costuma gerar `HttpMessageNotReadableException`. Trate esse erro se quiser mensagem amigável.

## Mail

### Papel no sistema

Enviar e-mails via SMTP.

### Dependência / origem

`spring-boot-starter-mail`

### Configuração base — passo a passo

1. Adicione starter de mail.
2. Configure host, porta, usuário, senha e TLS.
3. Injete `JavaMailSender`.
4. Não coloque credenciais reais no Git.

### Implementação mínima funcional

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

### Teste mínimo

Use servidor SMTP de teste/local antes de usar credenciais reais.


### HTML/MIME

Para HTML/anexos, use `MimeMessage` + `MimeMessageHelper` em vez de `SimpleMailMessage`.

### Assíncrono e transação

Não envie email irreversível antes de saber se a transação de negócio confirmou. Uma opção é publicar evento e reagir `AFTER_COMMIT`.

### Idempotência

Em rotinas reprocessáveis, previna envio duplicado quando necessário.

## MVC / REST

### Papel no sistema

Criar APIs HTTP com controllers, rotas, parâmetros e corpos JSON.

### Dependência / origem

`spring-boot-starter-web`

### Configuração base — passo a passo

1. Adicione `spring-boot-starter-web`.
2. Crie `@RestController` e um `@RequestMapping` base.
3. Use `@GetMapping`, `@PostMapping`, `@PutMapping` e `@DeleteMapping`.
4. Use DTOs no corpo da requisição em vez de expor diretamente a entidade.
5. Retorne códigos HTTP adequados.

### Implementação mínima funcional

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

### Teste mínimo

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

### DispatcherServlet

No stack Servlet/MVC, o `DispatcherServlet` é o front controller. Ele recebe a requisição e encontra o handler/controller apropriado.

### DTO de entrada e saída

```java
public record ProdutoRequest(
    @NotBlank String nome,
    @PositiveOrZero BigDecimal preco
) {}
```

```java
public record ProdutoResponse(
    Long id,
    String nome,
    BigDecimal preco
) {}
```

Isso evita:
- cliente controlar campos internos;
- expor relacionamento JPA;
- acoplamento do contrato HTTP ao schema;
- problemas de serialização lazy.

### Status HTTP úteis

| Situação | Status |
| --- | --- |
| GET com sucesso | 200 |
| criação | 201 |
| atualização sem body | 204 |
| payload inválido | 400 |
| não autenticado | 401 |
| sem permissão | 403 |
| recurso ausente | 404 |
| conflito de regra/duplicidade | 409 (quando fizer sentido) |
| erro inesperado | 500 |

### `ResponseEntity`

Use quando precisa controlar headers/status. Para resposta simples 200, retornar o DTO diretamente também é válido.

### Conteúdo negociado

Spring usa `HttpMessageConverter`s para transformar JSON em objetos e vice-versa. Jackson normalmente cuida do JSON.

## OAuth2 Resource Server

### Papel no sistema

Validar access tokens emitidos por um Authorization Server/IdP sem implementar JWT manualmente.

### Dependência / origem

`spring-boot-starter-oauth2-resource-server`

### Configuração base — passo a passo

1. Adicione Resource Server.
2. Configure `issuer-uri` ou JWK Set.
3. Ative `.oauth2ResourceServer(...)` na SecurityFilterChain.
4. Mapeie authorities/claims conforme necessário.
5. Prefira esse caminho quando autenticação é delegada a Keycloak/Auth0/Entra/servidor OAuth2.

### Implementação mínima funcional

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

### Teste mínimo

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

### Validações importantes

Com `issuer-uri`, o framework pode validar issuer e obter chaves conforme configuração do provedor.

Além de assinatura/expiração, autorização depende de como claims viram authorities.

### Conversor customizado

Quando roles estão em claim específico, configure `JwtAuthenticationConverter` em vez de espalhar parsing manual nos controllers.

## Perfis

### Papel no sistema

Ter configurações diferentes para desenvolvimento, teste e produção.

### Dependência / origem

Faz parte do Spring Boot.

### Configuração base — passo a passo

1. Crie `application-dev.properties`, `application-test.properties` e `application-prod.properties`.
2. Ative um perfil com `spring.profiles.active=dev`, variável `SPRING_PROFILES_ACTIVE`, parâmetro Maven ou argumento da aplicação.
3. Use `@Profile` apenas quando realmente precisar criar beans diferentes.

### Implementação mínima funcional

```properties
# application-dev.properties
spring.jpa.show-sql=true

# application-prod.properties
spring.jpa.show-sql=false
```
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

### Teste mínimo

Confira no log qual perfil foi ativado e teste uma propriedade que muda entre perfis.


### Beans por perfil

```java
@Bean
@Profile("dev")
Storage storageDev() {
    return new LocalStorage();
}

@Bean
@Profile("prod")
Storage storageProd() {
    return new S3Storage();
}
```

Use profiles para diferenças reais de ambiente, não para transformar cada pequena feature em árvore de `@Profile`.

## Scheduling

### Papel no sistema

Executar tarefas em horários ou intervalos.

### Dependência / origem

Faz parte do Spring Framework.

### Configuração base — passo a passo

1. Adicione `@EnableScheduling` em uma configuração.
2. Crie método `@Scheduled`.
3. Escolha `fixedRate`, `fixedDelay` ou cron.
4. Não bloqueie o scheduler com tarefas muito pesadas.

### Implementação mínima funcional

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

### Teste mínimo

Durante desenvolvimento, use um intervalo curto e confirme pelo log; depois volte para o cron real.


### Fixed delay e fixed rate

```java
@Scheduled(fixedDelay = 5000)
void aposTerminarEsperaCincoSegundos() {}

@Scheduled(fixedRate = 5000)
void tentaRodarACadaCincoSegundos() {}
```

Use cron para horários de negócio e intervalos para tarefas técnicas simples.

### Concorrência

Se uma execução demora mais do que o intervalo, o comportamento depende da configuração/executor. Tarefas críticas merecem desenho explícito de concorrência.

### Mais de uma instância da aplicação

Em cluster, `@Scheduled` normalmente roda em cada instância. Para job único global, considere lock distribuído ou scheduler externo.

## Security

### Papel no sistema

Controlar autenticação, autorização, senhas e acesso a endpoints.

### Dependência / origem

`spring-boot-starter-security`

### Configuração base — passo a passo

1. Adicione Spring Security.
2. Crie um `PasswordEncoder`.
3. Implemente/forneça um `UserDetailsService` quando usar usuário do banco.
4. Crie uma `SecurityFilterChain`.
5. Libere apenas rotas públicas.
6. Para APIs stateless, desabilite sessão e configure CSRF conscientemente.

### Implementação mínima funcional

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

### Teste mínimo

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

### SecurityFilterChain

A segurança Servlet funciona como uma cadeia de filtros antes do controller. Requisições podem ser autenticadas/rejeitadas antes de chegarem ao MVC.

### 401 vs 403

- `401`: autenticação ausente/inválida.
- `403`: identidade conhecida, mas acesso negado (simplificação útil para diagnóstico).

### PasswordEncoder

Nunca armazene senha pura.

```java
@Bean
PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
}
```

Cadastro:

```java
usuario.setSenha(
    passwordEncoder.encode(request.senha())
);
```

Login não deve comparar `encode(senhaRecebida)` com hash salvo; BCrypt usa salt. O provider usa `matches`.

### Roles e authorities

```java
.requestMatchers("/api/admin/**").hasRole("ADMIN")
```

`hasRole("ADMIN")` normalmente trabalha com authority `ROLE_ADMIN`.

### Method Security

```java
@EnableMethodSecurity
@Configuration
class MethodSecurityConfig {}
```

```java
@PreAuthorize("hasRole('ADMIN')")
public void excluirUsuario(Long id) {}
```

### Compatibilidade de versão

Spring Boot gerencia a versão do Spring Security. Consulte `mvn dependency:tree` antes de copiar assinatura de construtor da documentação de outra major version.

## Security com JWT

### Papel no sistema

Autenticar uma API stateless usando token Bearer.

### Dependência / origem

Spring Security + biblioteca JWT escolhida, ou OAuth2 Resource Server quando apropriado.

### Configuração base — passo a passo

1. Autentique e valide usuário/senha com `AuthenticationManager`.
2. Gere token contendo subject/claims e expiração.
3. Crie filtro que lê `Authorization: Bearer ...`.
4. Valide token e configure `SecurityContextHolder`.
5. Adicione o filtro antes de `UsernamePasswordAuthenticationFilter`.
6. Use `SessionCreationPolicy.STATELESS`.

### Implementação mínima funcional

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

### Teste mínimo

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

### JWT não é sessão

Em uma API stateless, cada requisição carrega credencial suficiente para autenticação. O servidor não precisa manter uma `HttpSession` de login.

### Claims mínimos

Evite colocar informação sensível no payload. JWT normalmente é assinado, não criptografado.

Claims possíveis:
- `sub`: identidade principal;
- `iat`: emitido em;
- `exp`: expiração;
- roles/authorities quando o design exigir.

### Filtro — ordem conceitual

1. ler header;
2. checar prefixo;
3. extrair token;
4. validar assinatura/expiração;
5. extrair subject;
6. carregar usuário, se necessário;
7. criar `Authentication`;
8. salvar no `SecurityContextHolder`;
9. continuar chain.

### Falhas que merecem teste

- token vazio;
- `Bearer` sem token;
- token expirado;
- token com assinatura inválida;
- usuário do token removido/bloqueado;
- token válido mas sem role;
- refresh/login conforme arquitetura.

### Quando preferir Resource Server

Se token é emitido por IdP/Authorization Server, use OAuth2 Resource Server e evite implementar parsing/validação manual.

## Specifications

### Papel no sistema

Criar filtros dinâmicos combináveis sem multiplicar métodos do repository.

### Dependência / origem

Já vem com Spring Data JPA.

### Configuração base — passo a passo

1. Faça o repository estender `JpaSpecificationExecutor<T>`.
2. Crie métodos que retornem `Specification<T>`.
3. Retorne `null` ou `conjunction()` para filtros não preenchidos, conforme o estilo adotado.
4. Combine filtros com `and()`.

### Implementação mínima funcional

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

### Teste mínimo

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

### Criteria API por baixo

`Specification<T>` recebe `Root<T>`, `CriteriaQuery<?>` e `CriteriaBuilder`. Você constrói predicates dinamicamente.

### Implementação centralizada

```java
public static Specification<Produto> comFiltro(ProdutoFiltro filtro) {
    return (root, query, cb) -> {
        List<Predicate> predicates = new ArrayList<>();

        if (filtro.nome() != null && !filtro.nome().isBlank()) {
            predicates.add(
                cb.like(
                    cb.lower(root.get("nome")),
                    "%" + filtro.nome().toLowerCase() + "%"
                )
            );
        }

        if (filtro.precoMin() != null) {
            predicates.add(
                cb.greaterThanOrEqualTo(
                    root.get("preco"),
                    filtro.precoMin()
                )
            );
        }

        if (filtro.precoMax() != null) {
            predicates.add(
                cb.lessThanOrEqualTo(
                    root.get("preco"),
                    filtro.precoMax()
                )
            );
        }

        return cb.and(predicates.toArray(Predicate[]::new));
    };
}
```

### Paginação + Specification

```java
Page<Produto> pagina = repository.findAll(specification, pageable);
```

### Regra de validação do filtro

Antes de consultar:

```java
if (min != null && max != null && min.compareTo(max) > 0) {
    throw new IllegalArgumentException(
        "Preço mínimo não pode superar o máximo"
    );
}
```

## Testes

### Papel no sistema

Testar unidade, camada web, JPA e integração.

### Dependência / origem

`spring-boot-starter-test`

### Configuração base — passo a passo

1. Use JUnit 5/Mockito para unidade.
2. Use `@WebMvcTest` para controller.
3. Use `@DataJpaTest` para repository.
4. Use `@SpringBootTest` quando precisar do contexto completo.
5. Não use sempre `@SpringBootTest`; é mais pesado.

### Implementação mínima funcional

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

### Teste mínimo

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

### Pirâmide prática

**Unitário:** service puro/mapper/validador.

**Slice:** controller ou repository com parte do contexto.

**Integração:** contexto completo + infraestrutura realista.

### MockMvc

Bom para stack MVC sem subir servidor real.

### Testcontainers

Para comportamento dependente de MySQL/PostgreSQL, container de teste reduz discrepância de banco em memória. Exige Docker disponível no ambiente de teste.

### Security em teste

Quando endpoint é protegido, o teste precisa simular autenticação ou executar o fluxo real, dependendo do escopo.

## Transactions

### Papel no sistema

Garantir que várias operações de banco sejam confirmadas ou revertidas como uma unidade.

### Dependência / origem

Já vem com Data JPA; o suporte transacional é parte do Spring Framework.

### Configuração base — passo a passo

1. Coloque `@Transactional` na camada de service.
2. Use `readOnly = true` para consultas quando fizer sentido.
3. Entenda que chamada interna no mesmo bean pode não passar pelo proxy transacional.
4. Por padrão, exceções unchecked causam rollback.

### Implementação mínima funcional

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

### Teste mínimo

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

### Proxy e fronteira transacional

Em configuração típica, `@Transactional` é aplicada por proxy. Por isso a chamada precisa atravessar o proxy para a interceptação funcionar como esperado.

### Propagation

O padrão é `REQUIRED`: entra na transação atual ou cria uma.

Outras opções existem (`REQUIRES_NEW`, `MANDATORY`, etc.), mas use apenas quando você entende a fronteira transacional desejada.

### Isolation

Isolamento controla efeitos concorrentes do banco. Não aumente isolamento indiscriminadamente: pode reduzir concorrência.

### Rollback

Por padrão, runtime exceptions acionam rollback. Para checked exceptions específicas:

```java
@Transactional(rollbackFor = Exception.class)
public void executar() throws Exception {
}
```

### Transação curta

Evite manter transação aberta enquanto:
- chama API externa lenta;
- envia email;
- espera usuário;
- processa arquivo grande sem necessidade.

Transação deve proteger a unidade de dados, não toda atividade arbitrária.

## Upload de arquivos

### Papel no sistema

Receber arquivos enviados por formulário multipart.

### Dependência / origem

Já suportado por `spring-boot-starter-web` para multipart.

### Configuração base — passo a passo

1. Configure limites máximos.
2. Receba `MultipartFile` no controller.
3. Valide tamanho, content type e nome.
4. Gere nome seguro no servidor; não confie no nome original.
5. Nunca salve arquivo arbitrário em caminho fornecido pelo cliente.

### Implementação mínima funcional

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

### Teste mínimo

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

### Segurança

Valide:
- tamanho;
- tipo esperado;
- extensão quando relevante;
- conteúdo quando necessário;
- caminho;
- permissões de acesso.

Nunca use diretamente:

```java
Path destino = Path.of(uploadDir, arquivo.getOriginalFilename());
```

sem sanitização/renomeação controlada.

### Armazenamento

Para projeto local, disco pode bastar. Para produção distribuída, storage de objetos costuma ser mais apropriado.

## Validation

### Papel no sistema

Validar dados de entrada antes da regra de negócio.

### Dependência / origem

`spring-boot-starter-validation`

### Configuração base — passo a passo

1. Adicione o starter de Validation.
2. Coloque anotações como `@NotBlank`, `@Email`, `@Size`, `@Min`, `@Positive` no DTO.
3. Use `@Valid` no parâmetro do controller.
4. Trate `MethodArgumentNotValidException` em um `@RestControllerAdvice` para uma resposta amigável.

### Implementação mínima funcional

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

### Teste mínimo

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

### Onde validar cada regra

**DTO/Bean Validation:**
- obrigatório;
- tamanho;
- formato;
- mínimo/máximo;
- email;
- padrão regex.

**Service:**
- unicidade no banco;
- transição de status permitida;
- estoque suficiente;
- permissão de negócio;
- relacionamento existente.

### Validação cruzada

Quando duas propriedades dependem uma da outra, você pode:
- validar manualmente no service;
- criar constraint customizada de classe.

Exemplo conceitual:

```java
@PeriodoValido
public record RelatorioFiltro(
    LocalDate inicio,
    LocalDate fim
) {}
```

### Grupos de validação

Existem validation groups, mas em APIs CRUD muitas vezes DTOs separados para criar/editar são mais claros.

## WebClient / RestClient

### Papel no sistema

Consumir APIs externas do backend.

### Dependência / origem

`RestClient` vem do Spring Framework web; `WebClient` normalmente é usado com `spring-boot-starter-webflux`.

### Configuração base — passo a passo

1. Para aplicações MVC síncronas modernas, considere `RestClient`.
2. Para fluxo reativo, use `WebClient`.
3. Configure base URL, headers, timeout e tratamento de erro.
4. Não crie cliente novo a cada chamada.

### Implementação mínima funcional

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

### Teste mínimo

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

### RestClient vs WebClient

- `RestClient`: API síncrona/fluent para aplicações imperativas.
- `WebClient`: não bloqueante/reativo, adequado ao stack WebFlux e cenários reativos.

Não use WebClient "só porque é novo" e bloqueie tudo com `.block()` sem entender o modelo.

### Timeout

Toda chamada externa deve ter estratégia de timeout. Uma dependência externa nunca deve poder prender indefinidamente seus recursos.

### Resiliência

Retry sem critério pode piorar incidentes. Só repita operações idempotentes ou quando a semântica permitir.

## WebSocket

### Papel no sistema

Comunicação bidirecional em tempo real, por exemplo notificações e chat.

### Dependência / origem

`spring-boot-starter-websocket`

### Configuração base — passo a passo

1. Adicione starter WebSocket.
2. Habilite broker STOMP quando usar esse modelo.
3. Defina endpoint de handshake.
4. Defina prefixos de destino.
5. Proteja mensagens/endpoints quando houver autenticação.

### Implementação mínima funcional

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

### Teste mínimo

Conecte um cliente STOMP, assine `/topic/mensagens`, envie para `/app/mensagem` e confirme o retorno.


### Quando não usar

Não use WebSocket apenas para atualizar uma tela uma vez ao minuto. Polling simples pode ser suficiente. WebSocket vale mais quando baixa latência e bidirecionalidade importam.

### STOMP

STOMP adiciona semântica de destinos e mensagens sobre WebSocket.

Fluxo típico:

```text
cliente conecta /ws
cliente SUBSCRIBE /topic/atualizacoes
cliente SEND /app/acao
@MessageMapping recebe
broker publica /topic/atualizacoes
assinantes recebem
```

### Escala

O simple broker é ótimo para estudo/projeto simples. Em escala/múltiplas instâncias, broker externo pode ser necessário.

## Tratamento global de erros

Embora não seja um starter separado, é peça central de APIs Spring MVC.

```java
@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(RecursoNaoEncontradoException.class)
    ResponseEntity<ProblemaResponse> notFound(
            RecursoNaoEncontradoException ex) {

        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new ProblemaResponse(
                404,
                "Recurso não encontrado",
                ex.getMessage()
            ));
    }

    @ExceptionHandler(RegraNegocioException.class)
    ResponseEntity<ProblemaResponse> business(
            RegraNegocioException ex) {

        return ResponseEntity.status(HttpStatus.CONFLICT)
            .body(new ProblemaResponse(
                409,
                "Regra de negócio",
                ex.getMessage()
            ));
    }
}
```

```java
public record ProblemaResponse(
    int status,
    String erro,
    String mensagem
) {}
```

O objetivo é impedir controllers cheios de `try/catch` repetido e padronizar o contrato de erro.

## Paginação e ordenação

Spring Data trabalha com `Pageable`.

```java
@GetMapping
public Page<ProdutoResponse> listar(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "id") String sort,
        @RequestParam(defaultValue = "desc") String direction) {

    Sort.Direction dir =
        "asc".equalsIgnoreCase(direction)
            ? Sort.Direction.ASC
            : Sort.Direction.DESC;

    Pageable pageable = PageRequest.of(
        page,
        Math.min(size, 100),
        Sort.by(dir, validarCampoSort(sort))
    );

    return service.listar(pageable);
}
```

Nunca aceite qualquer nome de campo sem validação:

```java
private static final Set<String> SORTS =
    Set.of("id", "nome", "preco", "criadoEm");

private String validarCampoSort(String sort) {
    return SORTS.contains(sort) ? sort : "id";
}
```

## Auditoria JPA

Para preencher criação/alteração automaticamente:

```java
@Configuration
@EnableJpaAuditing
class JpaConfig {}
```

```java
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class EntidadeAuditavel {

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime criadoEm;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime atualizadoEm;
}
```

Para registrar **quem** alterou, use `AuditorAware<T>` e `@CreatedBy`/`@LastModifiedBy`.

## Observabilidade e logs

Use logs estruturados e níveis coerentes:

```java
private static final Logger log =
    LoggerFactory.getLogger(PedidoService.class);

public PedidoResponse criar(PedidoRequest request) {
    log.info("Criando pedido para clienteId={}", request.clienteId());
    // ...
}
```

Evite logar:
- senha;
- token completo;
- número completo de cartão;
- dados pessoais desnecessários.

Actuator + Micrometer oferecem base de métricas/observabilidade. Em sistemas maiores, integre com a solução escolhida de métricas/tracing.

## Checklist de segurança para API

- Senha sempre com `PasswordEncoder` adequado.
- Secrets fora do Git.
- CORS restrito ao frontend necessário.
- Validação de payload.
- Autorização além de autenticação.
- JWT com expiração e assinatura validadas.
- Nunca confiar em ID/role enviados pelo cliente sem verificar permissão.
- Paginação com limite máximo.
- Upload com tamanho/tipo/nome controlados.
- Erros sem stack trace sensível para o cliente.
- Actuator restrito.
- Queries parametrizadas/JPA em vez de concatenar SQL do usuário.
- Atualizações de dependências acompanhadas de testes.

## Checklist final de projeto Spring

```text
[ ] Java correto
[ ] versão do Spring Boot conhecida
[ ] pom.xml resolve
[ ] profiles definidos
[ ] datasource conecta
[ ] Flyway/schema consistente
[ ] entidades mapeadas
[ ] repositories testados
[ ] DTOs separados
[ ] validation funcionando
[ ] services transacionais quando necessário
[ ] controllers com status HTTP corretos
[ ] exception handler padronizado
[ ] CORS configurado
[ ] Security configurado
[ ] autenticação testada
[ ] autorização testada
[ ] filtros/paginação testados
[ ] testes automatizados executam
[ ] Actuator protegido
[ ] secrets externalizados
[ ] build final funciona
```

## Comandos Maven úteis

```bash
mvn clean
mvn test
mvn clean test
mvn clean package
mvn spring-boot:run
mvn dependency:tree
mvn help:effective-pom
```

Use `mvn dependency:tree` quando houver dúvida sobre a versão real de Spring Security, Jackson, Hibernate ou outra dependência transitiva.

## Como identificar incompatibilidade de versão

Quando o IDE diz:

```text
The constructor X(...) is undefined
The method Y(...) is undefined
Cannot resolve method ...
```

faça:

1. Veja o Spring Boot no `pom.xml`.
2. Rode:

```bash
mvn dependency:tree
```

3. Descubra a versão real do módulo.
4. Abra a documentação daquela **mesma linha de versão**.
5. Compare assinatura de construtor/método.
6. Evite adicionar versão manual a starters gerenciados pelo BOM apenas para "fazer compilar".

Exemplo clássico: APIs de `DaoAuthenticationProvider` diferem entre linhas do Spring Security. Um exemplo da major mais nova pode não compilar na anterior.

## Referências oficiais para conferir versões

- Spring Boot Reference: https://docs.spring.io/spring-boot/reference/
- Spring Framework Reference: https://docs.spring.io/spring-framework/reference/
- Spring Security Reference: https://docs.spring.io/spring-security/reference/
- Spring Data JPA Reference: https://docs.spring.io/spring-data/jpa/reference/

Sempre selecione a versão correspondente ao seu projeto quando a documentação oferecer seletor de versões.
