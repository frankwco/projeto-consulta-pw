# Spring Boot — Módulos e Configuração Prática

Guia aprofundado de configuração com exemplos específicos do NexusERP e modelos reutilizáveis

**Projeto de referência:** NexusERP

Java 21 • Spring Boot 3.4.5 • React 19 • Vite • MySQL/XAMPP

| Objetivo: consulta rápida durante a prova, com teoria suficiente para entender e exemplos práticos para adaptar. |
| --- |

## Índice alfabético para consulta rápida

Procure pelo termo que apareceu na questão e vá direto à seção indicada. Os números de seção são estáveis e facilitam a busca no Markdown/GitHub.

| Termo | Seção | Lembrete rápido |
| --- | --- | --- |
| Actuator | 14 | Starter opcional para health, metrics e observabilidade. |
| AuthenticationManager | 8.5 | Coordena autenticação por provider. |
| BCrypt | 8.4 | Hash adaptativo para senha. |
| Bean | 3 | Objeto gerenciado pelo container Spring. |
| Bean Validation | 7 | Validação declarativa com jakarta.validation. |
| Cache | 14.3 | @EnableCaching para resultados caros. |
| ConfigurationProperties | 4.5 | Alternativa tipada para agrupar propriedades customizadas. |
| CORS | 6.4 | Política do navegador entre origens diferentes. |
| CSRF | 8.2 | No projeto foi desabilitado por API stateless com Bearer token. |
| Data JPA | 5 | Starter para Repository, Hibernate e transações. |
| Dependency Injection | 3.2 | Construtor recebe dependências criadas pelo container. |
| DevTools | 14.2 | Opcional para reinício durante desenvolvimento. |
| Entity | 5.2 | Classe persistente com @Entity. |
| EntityGraph | 5.7 | Controla fetch de relacionamentos para uma consulta. |
| Environment Variables | 4.3 | Sobrescrevem segredos e configurações sem editar código. |
| Exception Handler | 9 | @RestControllerAdvice centraliza erros. |
| Hibernate | 5.1 | Implementação JPA usada por Spring Data JPA. |
| Jackson | 10 | Serialização JSON e datas. |
| JPA | 5 | Especificação de persistência ORM. |
| JWT | 8.6 | Token assinado para autenticação stateless. |
| Maven Starter | 2 | Dependências Spring agrupadas por capacidade. |
| Method Security | 8.8 | @EnableMethodSecurity + @PreAuthorize. |
| Open-in-view | 5.8 | Desativado no NexusERP para controlar carregamento na camada de serviço. |
| Profiles | 4.4 | application-dev/prod + spring.profiles.active. |
| Repository | 5.5 | Interface Spring Data para persistência. |
| Scheduling | 14.4 | @EnableScheduling para tarefas periódicas. |
| SecurityFilterChain | 8.2 | Pipeline de segurança HTTP. |
| Spring MVC | 6 | Controllers REST, binding e ResponseEntity. |
| Testing | 13 | spring-boot-starter-test e testes de camadas. |
| Transaction | 5.9 | @Transactional delimita unidade atômica de trabalho. |
| Validation | 7 | @Valid ativa validação do request. |
| Web | 6 | spring-boot-starter-web: MVC, Tomcat, Jackson. |

## 1. Como pensar Spring Boot na prova

Spring Boot não substitui o Spring; ele automatiza configuração, dependências e inicialização. Em uma aplicação, você combina starters, propriedades e beans. O framework detecta classes por component scan e injeta dependências conforme necessário.

| Regra útil: Starter = pacote de dependências; anotação = instrução/metadata; bean = objeto gerenciado; auto-configuration = configuração criada pelo Boot quando as condições são atendidas. |
| --- |

## 2. pom.xml: dependências e starters

**Base real do NexusERP**

```xml
<parent>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-parent</artifactId>
  <version>3.4.5</version>
</parent>
<properties><java.version>21</java.version></properties>
```

| Dependência | O que habilita | Uso no NexusERP |
| --- | --- | --- |
| spring-boot-starter-web | Spring MVC, servidor embutido, Jackson | Controllers REST e JSON |
| spring-boot-starter-data-jpa | Spring Data, JPA, Hibernate | Entities e repositories |
| spring-boot-starter-security | Filtros, autenticação e autorização | JWT + roles |
| spring-boot-starter-validation | Jakarta Bean Validation | DTOs com @NotBlank etc. |
| mysql-connector-j | Driver JDBC MySQL | Conexão com XAMPP |
| jjwt-* | Criação/validação JWT | JwtService |
| spring-boot-starter-test | JUnit/Mockito/Spring Test | Testes |
| spring-security-test | Helpers de segurança em testes | Autenticação simulada |

| Como adicionar módulo: Inclua o starter no pom.xml, rode mvn clean test/package, configure propriedades e crie beans/anotações apenas quando necessário. Muitos starters funcionam com auto-configuração. |
| --- |

## 3. IoC, beans e injeção de dependência

### 3.1 O que vira bean

- Classes anotadas com @Component e especializações: @Service, @Repository, @Controller/@RestController, @Configuration.
- Métodos @Bean dentro de @Configuration.
- Auto-configurações do Spring Boot quando dependências/propriedades estão presentes.
### 3.2 Injeção por construtor

```java
@Service
public class ProductService {
    private final ProductRepository repository;
    private final CategoryService categoryService;

    public ProductService(ProductRepository repository, CategoryService categoryService) {
        this.repository = repository;
        this.categoryService = categoryService;
    }
}
```

A injeção por construtor deixa dependências explícitas, facilita testes e permite campos final. Com um único construtor, @Autowired é desnecessário.

### 3.3 @Bean quando o objeto não é sua classe

```text
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
}
```

BCryptPasswordEncoder é classe de biblioteca. @Bean registra uma instância para ser injetada em AuthService e DataInitializer.

## 4. Configuração: application.properties, env e profiles

### 4.1 Properties essenciais do NexusERP

```properties
server.port=8080
spring.datasource.url=jdbc:mysql://localhost:3306/nexuserp?createDatabaseIfNotExist=true...
spring.datasource.username=${DB_USERNAME:root}
spring.datasource.password=${DB_PASSWORD:}
spring.jpa.hibernate.ddl-auto=update
spring.jpa.open-in-view=false
app.jwt.expiration=86400000
app.cors.allowed-origin=${FRONTEND_URL:http://localhost:5173}
```

### 4.2 Placeholder com valor padrão

${DB_USERNAME:root} significa: use a variável/propriedade DB_USERNAME; se não existir, use root. ${DB_PASSWORD:} usa string vazia como padrão.

### 4.3 Variáveis de ambiente

```bash
# PowerShell
$env:DB_USERNAME="root"
$env:DB_PASSWORD="minhaSenha"
$env:JWT_SECRET="base64..."
mvn spring-boot:run

# Windows CMD
set DB_USERNAME=root
set DB_PASSWORD=minhaSenha
mvn spring-boot:run
```

### 4.4 Profiles: dev e prod

```properties
# application-dev.properties
spring.jpa.show-sql=true
spring.jpa.hibernate.ddl-auto=update

# application-prod.properties
spring.jpa.show-sql=false
spring.jpa.hibernate.ddl-auto=validate

# ativação
mvn spring-boot:run -Dspring-boot.run.profiles=dev
# ou
SPRING_PROFILES_ACTIVE=prod
```

### 4.5 @ConfigurationProperties: configuração tipada

```text
@ConfigurationProperties(prefix = "app.jwt")
public record JwtProperties(String secret, long expiration) {}

// Em configuração:
@EnableConfigurationProperties(JwtProperties.class)
```

No NexusERP foi usado @Value, que é simples para poucos campos. @ConfigurationProperties é melhor quando existe um grupo grande de propriedades e você quer validação/tipagem central.

## 5. Spring Data JPA e Hibernate

### 5.1 JDBC, JPA, Hibernate e Spring Data: diferença

| Termo | Papel |
| --- | --- |
| JDBC | API Java de baixo nível para executar SQL e ler ResultSet. |
| JPA | Especificação para ORM/persistência de entidades. |
| Hibernate | Implementação JPA/ORM que gera SQL, gerencia contexto e dirty checking. |
| Spring Data JPA | Abstração que cria repositories, paginação e queries sobre JPA. |

### 5.2 Mapeamento básico

```java
@Entity
@Table(name = "customers")
public class Customer {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @Column(nullable = false, unique = true, length = 180)
  private String email;
}
```

### 5.3 Relacionamentos

| Anotação | Exemplo | Ideia |
| --- | --- | --- |
| @ManyToOne | Product.category | muitos produtos para uma categoria |
| @OneToMany | Order.items | um pedido para muitos itens |
| @OneToOne | exemplo genérico User.profile | um para um |
| @ManyToMany | exemplo genérico User.roles | muitos para muitos; normalmente tabela de junção |

### 5.4 Cascade e orphanRemoval

cascade define operações propagadas ao relacionamento. No Order.items, cascade=ALL permite persistir os itens ao salvar o pedido. orphanRemoval=true exclui do banco o filho removido da coleção quando apropriado.

### 5.5 Repositories e query derivada

```text
boolean existsBySkuIgnoreCase(String sku);
long countByActiveTrue();
List<Product> findTop5ByStockLessThanEqualOrderByStockAsc(Integer stock);
```

O nome do método é interpretado pelo Spring Data. Isso é excelente para consultas simples; para lógica maior, use @Query ou Specification.

### 5.6 JPQL

```bash
@Query("select coalesce(sum(o.total), 0) from Order o where o.status <> br.com.nexuserp.entity.OrderStatus.CANCELED")
BigDecimal totalRevenue();
```

JPQL usa Order e o.total porque trabalha no modelo de entidades. SQL nativo usaria orders e nomes físicos das colunas.

### 5.7 @EntityGraph e N+1

```java
@EntityGraph(attributePaths = {"customer", "items", "items.product"})
Optional<Order> findDetailedById(Long id);
```

Quando a resposta precisa cliente + itens + produtos, EntityGraph instrui a consulta a buscar os atributos. Isso ajuda a evitar N+1 e acesso lazy fora da transação.

### 5.8 open-in-view=false

O NexusERP desativa Open EntityManager in View. Isso força acesso ao banco a acontecer de forma consciente na camada de serviço/repository, em vez de disparar consultas inesperadas durante serialização da resposta.

### 5.9 @Transactional e dirty checking

```text
@Transactional
public OrderResponse updateStatus(Long id, OrderStatus newStatus) {
    var order = findDetailed(id);
    order.setStatus(newStatus);
    return toResponse(orderRepository.save(order));
}
```

Dentro da transação, entidades gerenciadas são monitoradas. Mudanças podem ser sincronizadas no commit por dirty checking. save é útil/explicita intenção, mas em entidade já gerenciada muitas alterações seriam persistidas no commit mesmo sem save.

| readOnly=true: É uma pista de intenção e pode permitir otimizações. Use em consultas; não use em fluxo que altera estoque, status ou outras entidades. |
| --- |

## 6. Spring Web / MVC / REST

### 6.1 Controller e binding

```text
@PostMapping
public ResponseEntity<CustomerResponse> create(@Valid @RequestBody CustomerRequest request) {
    return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request));
}
```

### 6.2 Status HTTP recomendados

| Operação | Status típico |
| --- | --- |
| GET com sucesso | 200 OK |
| POST criou recurso | 201 Created |
| DELETE sem corpo | 204 No Content |
| Request inválido | 400 ou 422 conforme convenção |
| Não autenticado | 401 Unauthorized |
| Autenticado sem permissão | 403 Forbidden |
| Não encontrado | 404 Not Found |
| Conflito de integridade | 409 Conflict |
| Erro não tratado | 500 Internal Server Error |

### 6.3 ResponseEntity

Use quando precisa controlar status/headers. Se retornar diretamente ProductResponse, Spring assume 200 e serializa para JSON.

### 6.4 CORS

```text
config.setAllowedOrigins(List.of(allowedOrigin));
config.setAllowedMethods(List.of("GET","POST","PUT","PATCH","DELETE","OPTIONS"));
config.setAllowedHeaders(List.of("Authorization","Content-Type"));
config.setAllowCredentials(true);
```

CORS é aplicado pelo navegador. Postman/curl não bloqueiam por CORS. Se o erro só aparece no navegador, isso é uma pista.

## 7. Validation

### 7.1 Dependência

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
```

### 7.2 Anotações frequentes

| Anotação | Valida |
| --- | --- |
| @NotNull | valor não pode ser null |
| @NotBlank | String não nula e com conteúdo não branco |
| @NotEmpty | coleção/string não vazia |
| @Size | tamanho mínimo/máximo |
| @Email | formato de e-mail |
| @Min/@Max | inteiro mínimo/máximo |
| @DecimalMin | mínimo decimal, bom para BigDecimal |
| @Positive | número > 0 |
| @Pattern | regex |

### 7.3 Validação aninhada

```text
public record OrderRequest(
  @NotNull Long customerId,
  @NotEmpty List<@Valid OrderItemRequest> items
) {}
```

@Valid em cada elemento da lista faz as regras de OrderItemRequest serem avaliadas. Sem ele, a lista existe, mas os objetos internos podem não ser validados como esperado.

## 8. Spring Security na prática

### 8.1 Dependência e modelo

spring-boot-starter-security instala a cadeia de filtros. Por padrão, tudo tende a ficar protegido; no NexusERP a configuração substitui o comportamento padrão para permitir /api/auth/** e autenticar o restante via JWT.

### 8.2 SecurityFilterChain

```text
@Bean
SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
  return http
    .csrf(csrf -> csrf.disable())
    .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
    .authorizeHttpRequests(a -> a
       .requestMatchers("/api/auth/**", "/error").permitAll()
       .anyRequest().authenticated())
    .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
    .build();
}
```

### 8.3 UserDetailsService

CustomUserDetailsService recebe o username do Security. Como User.getUsername() retorna email, username significa email neste projeto. O repository busca findByEmailIgnoreCase.

### 8.4 PasswordEncoder

BCrypt gera hash com salt. Você nunca “descriptografa” a senha; a verificação compara a senha candidata com o hash.

### 8.5 AuthenticationManager + DaoAuthenticationProvider

AuthenticationManager delega a um provider. O DaoAuthenticationProvider combina UserDetailsService + PasswordEncoder. Isso permite login tradicional por credencial antes da emissão do JWT.

### 8.6 JWT

JwtService assina token com SecretKey derivada de Base64, grava subject=email e expiration. O filtro extrai Bearer, valida e cria UsernamePasswordAuthenticationToken no SecurityContext.

### 8.7 401 vs 403

| Código | Significa | Exemplo |
| --- | --- | --- |
| 401 | Não autenticado / credencial inválida | Token ausente, inválido ou expirado |
| 403 | Autenticado, mas sem autorização | USER tenta endpoint @PreAuthorize hasRole ADMIN |

### 8.8 Method Security

```text
@EnableMethodSecurity
@Configuration
class SecurityConfig { ... }

@PreAuthorize("hasRole('ADMIN')")
@PostMapping
public ResponseEntity<ProductResponse> create(...) { ... }
```

## 9. Tratamento global de erros

@RestControllerAdvice aplica handlers a todos os controllers. Isso evita try/catch repetitivo e produz JSON consistente para o frontend.

```text
@ExceptionHandler(MethodArgumentNotValidException.class)
public ResponseEntity<ApiError> validation(...) {
  Map<String,String> errors = new LinkedHashMap<>();
  ex.getBindingResult().getFieldErrors()
    .forEach(e -> errors.putIfAbsent(e.getField(), e.getDefaultMessage()));
  return build(HttpStatus.UNPROCESSABLE_ENTITY, "Dados inválidos", request, errors);
}
```

| Boas práticas: Não retorne stack trace para o cliente em produção. Registre detalhes no servidor e exponha mensagem segura, status, path, timestamp e erros de campo. |
| --- |

## 10. Jackson e JSON

spring-boot-starter-web inclui Jackson. Records de resposta são serializados automaticamente. RequestBody é desserializado do JSON para record/classe. O projeto configura timezone e datas ISO em application.properties.

```properties
spring.jackson.serialization.write-dates-as-timestamps=false
spring.jackson.time-zone=America/Sao_Paulo
```

Se precisar renomear campo, use @JsonProperty; ignorar campo, @JsonIgnore; formatar data, @JsonFormat. Prefira DTOs para controlar JSON em vez de encher entidades de anotações de apresentação.

## 11. Inicialização e seed

```java
@Configuration
public class DataInitializer {
  @Bean
  CommandLineRunner seed(UserRepository users, ..., PasswordEncoder encoder) {
    return args -> { /* cria dados se necessário */ };
  }
}
```

CommandLineRunner executa depois que o contexto sobe. É útil para demonstração, seed e rotinas simples. Para evolução de schema profissional, considere Flyway/Liquibase em vez de depender de ddl-auto=update.

## 12. Banco: ddl-auto e migrações

| Valor ddl-auto | Uso típico |
| --- | --- |
| none | Hibernate não mexe no schema. |
| validate | Confere se schema combina com entidades; não altera. |
| update | Tenta adaptar schema; prático em desenvolvimento. |
| create | Recria schema ao iniciar; destrutivo. |
| create-drop | Cria e remove ao encerrar; testes/demos. |

| Projeto: NexusERP usa update para facilitar XAMPP/aula. Em produção, migrations versionadas + validate costumam ser mais previsíveis. |
| --- |

```xml
<!-- Exemplo adicional: Flyway -->
<dependency>
  <groupId>org.flywaydb</groupId>
  <artifactId>flyway-core</artifactId>
</dependency>
<dependency>
  <groupId>org.flywaydb</groupId>
  <artifactId>flyway-mysql</artifactId>
</dependency>

# arquivo: src/main/resources/db/migration/V1__create_tables.sql
```

## 13. Testes no ecossistema Spring

### 13.1 Teste de service com Mockito — modelo

```text
@ExtendWith(MockitoExtension.class)
class ProductServiceTest {
  @Mock ProductRepository repository;
  @Mock CategoryService categoryService;
  @InjectMocks ProductService service;

  @Test
  void deveRejeitarSkuDuplicado() {
    when(repository.existsBySkuIgnoreCase("ABC")).thenReturn(true);
    assertThrows(BusinessException.class, () -> service.create(request));
  }
}
```

### 13.2 Teste de controller com MockMvc — modelo

```text
@WebMvcTest(ProductController.class)
class ProductControllerTest {
  @Autowired MockMvc mvc;
  @MockBean ProductService service;

  // perform(post(...)).andExpect(status().isCreated());
}
```

@SpringBootTest sobe contexto amplo; @WebMvcTest foca MVC; @DataJpaTest foca persistência. Escolha o menor escopo que prova a unidade desejada.

## 14. Módulos úteis adicionais

### 14.1 Actuator

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
management.endpoints.web.exposure.include=health,info,metrics
```

Expõe endpoints operacionais. Em produção, proteja endpoints sensíveis e evite expor tudo indiscriminadamente.

### 14.2 DevTools

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-devtools</artifactId>
  <scope>runtime</scope>
  <optional>true</optional>
</dependency>
```

### 14.3 Cache

```text
@EnableCaching
@SpringBootApplication
class App {}

@Cacheable("categories")
public List<CategoryResponse> list() { ... }
```

Útil para dados lidos muitas vezes e alterados pouco. Ao editar, invalide com @CacheEvict.

### 14.4 Scheduling

```text
@EnableScheduling
@SpringBootApplication
class App {}

@Scheduled(cron = "0 0 2 * * *")
public void rotinaNoturna() { ... }
```

### 14.5 Mail — exemplo de configuração

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-mail</artifactId>
</dependency>
spring.mail.host=smtp.exemplo.com
spring.mail.port=587
spring.mail.username=${MAIL_USER}
spring.mail.password=${MAIL_PASSWORD}
```

## 15. Receitas práticas: como configurar recursos comuns

| Quero... | Passos |
| --- | --- |
| Nova entidade | @Entity + @Id → repository → DTO → service → controller. |
| Filtro paginado | RequestParam + Pageable → repository @Query/derived → Page.map DTO. |
| Endpoint só ADMIN | @EnableMethodSecurity + @PreAuthorize("hasRole('ADMIN')"). |
| Propriedade customizada | app.x=y no properties → @Value ou @ConfigurationProperties. |
| Alterar porta | server.port=9090. |
| Outro banco | Trocar driver, jdbc URL e dialeto quando necessário. |
| Upload de arquivo | MultipartFile no controller + limites spring.servlet.multipart.* + storage service. |
| Executar rotina no start | CommandLineRunner/ApplicationRunner. |
| Transação atômica | @Transactional em método público de service. |
| Padronizar erro | Exception específica + handler em @RestControllerAdvice. |

## 16. Erros clássicos em Spring e causa provável

| Erro | Causa comum | Correção |
| --- | --- | --- |
| Failed to configure a DataSource | URL/driver/credenciais ausentes | Confira mysql-connector e spring.datasource.* |
| Access denied for user | Credencial MySQL errada | DB_USERNAME/DB_PASSWORD e privilégios |
| BeanCreationException | Bean não consegue ser criado | Leia caused by; dependência/configuração ausente |
| NoSuchBeanDefinition | Tipo não registrado | @Service/@Bean, package scan ou dependência |
| LazyInitializationException | Acesso lazy fora do contexto | EntityGraph/fetch query/transação/DTO |
| 401 | Autenticação falhou | Bearer token, filtro, expiração, usuário |
| 403 | Autorização falhou | Roles e @PreAuthorize |
| 415 Unsupported Media Type | Content-Type errado | Enviar application/json |
| 405 Method Not Allowed | Verbo HTTP errado | GET/POST/PUT/PATCH/DELETE correto |
| 422 | Bean Validation | Corrigir payload e constraints |
