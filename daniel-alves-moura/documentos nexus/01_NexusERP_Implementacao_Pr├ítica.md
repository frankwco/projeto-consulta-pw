# NexusERP — Implementação do Projeto na Prática

Explicação aprofundada de como backend e frontend foram implementados e como o código se conecta

**Projeto de referência:** NexusERP

Java 21 • Spring Boot 3.4.5 • React 19 • Vite • MySQL/XAMPP

| Objetivo: consulta rápida durante a prova, com teoria suficiente para entender e exemplos práticos para adaptar. |
| --- |

## Índice alfabético para consulta rápida

Procure pelo termo que apareceu na questão e vá direto à seção indicada. Os números de seção são estáveis e facilitam a busca no Markdown/GitHub.

| Termo | Seção | Lembrete rápido |
| --- | --- | --- |
| API REST | 4 | Controllers expõem endpoints /api/* e delegam regra de negócio aos services. |
| Autenticação | 7 | Login usa AuthenticationManager; JWT volta ao frontend e segue no header Authorization. |
| Axios | 13 | client.js concentra baseURL, timeout, JWT e tratamento de 401. |
| BaseEntity | 5.1 | Auditoria automática com @PrePersist e @PreUpdate. |
| BCrypt | 7.2 | PasswordEncoder codifica senhas; nunca se salva senha em texto puro. |
| Context API | 14 | AuthContext mantém usuário/login/logout para a árvore React. |
| Controller | 4 | Camada HTTP: recebe request, valida DTO e retorna status/response. |
| CORS | 7.5 | SecurityConfig libera a origem do frontend configurada por app.cors.allowed-origin. |
| Dashboard | 10 | Agrega contagens, receita, pedidos recentes e estoque crítico. |
| Debounce | 16.4 | Atrasa busca para não disparar API a cada tecla. |
| DTO | 6 | Contrato de entrada/saída; evita expor entidade diretamente. |
| EntityGraph | 8.3 | Busca relacionamentos necessários sem depender de open-in-view. |
| ExceptionHandler | 9 | @RestControllerAdvice padroniza respostas de erro. |
| JPA | 5 | Entidades representam tabelas e relacionamentos do MySQL. |
| JWT | 7 | Token stateless identifica o usuário a cada requisição. |
| localStorage | 14.2 | Persiste token e dados básicos do usuário entre recargas. |
| ManyToOne | 5.3 | Produto -> Categoria e Pedido -> Cliente. |
| OneToMany | 5.4 | Pedido -> Itens, com cascade e orphanRemoval. |
| Paginação | 8.2 | Pageable entra no controller e Page<T> volta ao frontend. |
| Pedido | 11 | Transação valida estoque, cria itens, calcula total e baixa estoque. |
| React Router | 15 | Rotas públicas, protegidas e layout com Outlet. |
| Repository | 8 | JpaRepository entrega CRUD e permite queries derivadas/JPQL. |
| SecurityConfig | 7.4 | Define rotas públicas, sessão stateless, CORS, provider e filtro JWT. |
| Service | 9.1 | Camada central para regra de negócio e transação. |
| Transação | 11.2 | @Transactional garante atomicidade ao criar/cancelar pedido. |
| useEffect | 16 | Carrega dados da API após a renderização. |
| useMemo | 16.3 | Evita recalcular total do pedido sem mudança dos itens. |
| Validação | 6.2 | @Valid + Bean Validation rejeitam dados incorretos antes da regra de negócio. |
| XAMPP | 3 | É usado para subir o MySQL; o Spring conecta pela porta 3306. |

## 1. Visão geral da arquitetura

O NexusERP segue uma arquitetura em camadas no backend e uma SPA no frontend. A ideia-chave é separar responsabilidades: HTTP no controller, regra no service, persistência no repository, dados do banco nas entities e contrato da API nos DTOs.

| Camada | Responsabilidade | Exemplo no projeto |
| --- | --- | --- |
| Frontend React | Tela, estado, navegação e chamadas HTTP | frontend/src/pages, components, context, api |
| Controller | Traduz HTTP para chamadas Java | ProductController, OrderController |
| Service | Regra de negócio e transação | ProductService, OrderService |
| Repository | Acesso ao banco via Spring Data JPA | ProductRepository, OrderRepository |
| Entity | Mapeamento objeto-relacional | Product, Category, Order, OrderItem |
| DTO | Formato da requisição/resposta | ProductRequest, ProductResponse, OrderRequest |
| Security | Autenticação/autorização | SecurityConfig, JwtAuthenticationFilter, JwtService |
| MySQL | Persistência final | Banco nexuserp em localhost:3306 |

| Fluxo mental para prova: React -> requisição HTTP -> filtro JWT -> Controller -> Service -> Repository -> Hibernate/JPA -> MySQL. A resposta faz o caminho inverso e normalmente retorna um DTO em JSON. |
| --- |

## 2. Estrutura de pastas e motivo de cada diretório

```text
nexuserp/
├─ backend/
│  ├─ pom.xml
│  └─ src/main/
│     ├─ java/br/com/nexuserp/
│     │  ├─ config/       # SecurityConfig, DataInitializer
│     │  ├─ controller/   # endpoints REST
│     │  ├─ dto/          # requests e responses
│     │  ├─ entity/       # entidades JPA
│     │  ├─ exception/    # erros e handler global
│     │  ├─ repository/   # Spring Data JPA
│     │  ├─ security/     # JWT + UserDetailsService
│     │  └─ service/      # regras de negócio
│     └─ resources/application.properties
├─ frontend/
│  ├─ src/api/            # Axios
│  ├─ src/context/        # autenticação global
│  ├─ src/components/     # componentes reutilizáveis
│  ├─ src/hooks/          # hooks próprios
│  ├─ src/pages/          # telas ligadas às rotas
│  └─ src/styles/
└─ database/              # scripts SQL
```

Essa divisão reduz acoplamento. Uma alteração de CSS não deve exigir mudança no repository; uma mudança na consulta SQL não deveria quebrar o componente React se o contrato do DTO continuar igual.

## 3. Inicialização: XAMPP, banco, Spring e React

### 3.1 MySQL pelo XAMPP

- Abra o XAMPP e inicie MySQL. O Apache é opcional para o desenvolvimento normal do React com Vite.
- O backend usa jdbc:mysql://localhost:3306/nexuserp e createDatabaseIfNotExist=true; portanto o schema pode ser criado automaticamente se o usuário tiver permissão.
- Por padrão: usuário root e senha vazia. Em ambiente real, defina DB_USERNAME e DB_PASSWORD como variáveis de ambiente.
**Trecho real: backend/src/main/resources/application.properties**

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/nexuserp?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=America/Sao_Paulo
spring.datasource.username=${DB_USERNAME:root}
spring.datasource.password=${DB_PASSWORD:}
spring.jpa.hibernate.ddl-auto=update
spring.jpa.open-in-view=false
```

### 3.2 Subida do backend e frontend

```bash
# terminal 1
cd backend
mvn spring-boot:run

# terminal 2
cd frontend
npm install
npm run dev
```

| Sinal de que está funcionando: Backend em http://localhost:8080 e frontend em http://localhost:5173. Se o frontend abre mas a API falha, confira MySQL, CORS e a aba Network do navegador. |
| --- |

## 4. Controllers: a porta de entrada HTTP

Controller deve ser fino: ele conhece HTTP, parâmetros, status e validação; não deve concentrar regra de estoque, cálculo financeiro ou consultas complexas.

**Exemplo real simplificado do ProductController**

```java
@RestController
@RequestMapping("/api/products")
public class ProductController {
    private final ProductService service;

    @GetMapping
    public Page<ProductResponse> list(
            @RequestParam(required = false) String q,
            @PageableDefault(size = 10, sort = "name") Pageable pageable) {
        return service.list(q, pageable);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductResponse> create(@Valid @RequestBody ProductRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request));
    }
}
```

| Anotação | Na prática |
| --- | --- |
| @RestController | Combina @Controller + serialização do retorno para JSON. |
| @RequestMapping | Define prefixo comum da rota. |
| @GetMapping/@PostMapping | Mapeia método HTTP. |
| @RequestBody | Converte JSON do corpo em objeto/record Java. |
| @PathVariable | Lê valor embutido na URL, como /products/15. |
| @RequestParam | Lê query string, como ?q=mouse. |
| @Valid | Dispara Bean Validation no DTO. |
| @PreAuthorize | Autoriza por regra antes de executar o método. |

| Onde está no NexusERP: backend/src/main/java/br/com/nexuserp/controller/ — Todos os endpoints REST do sistema. |
| --- |

## 5. Entidades JPA: como o banco vira objetos Java

### 5.1 BaseEntity e auditoria automática

```sql
@MappedSuperclass
public abstract class BaseEntity {
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        var now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
    }
    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
```

@MappedSuperclass não cria uma tabela BaseEntity. Ele faz com que os campos sejam herdados pelas entidades concretas. @PrePersist roda antes do INSERT; @PreUpdate, antes do UPDATE.

### 5.2 Product: colunas, tipos e restrições

```java
@Entity
@Table(name = "products")
public class Product extends BaseEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 60)
    private String sku;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;
}
```

BigDecimal é usado para dinheiro para evitar erro de precisão típico de double. IDENTITY delega a geração do id ao AUTO_INCREMENT do MySQL. A FK category_id é criada pelo relacionamento @ManyToOne.

### 5.3 ManyToOne: Produto → Categoria

Vários produtos podem apontar para uma categoria. LAZY significa que a categoria não precisa ser carregada imediatamente. Como open-in-view=false, o código precisa buscar o relacionamento dentro do contexto transacional quando for necessário.

### 5.4 OneToMany: Pedido → Itens

```text
@OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
private List<OrderItem> items = new ArrayList<>();

public void addItem(OrderItem item) {
    items.add(item);
    item.setOrder(this);
}
```

mappedBy="order" indica que OrderItem é o lado dono da relação porque contém a FK order_id. cascade=ALL faz o save do pedido persistir seus itens. orphanRemoval=true remove item órfão quando ele sai da coleção.

## 6. DTOs e validação: contrato da API

### 6.1 Por que DTO em vez de retornar entidade

- Evita expor campos internos, como password.
- Controla exatamente o JSON que o frontend recebe.
- Desacopla mudanças no banco do contrato HTTP.
- Permite validações diferentes em entrada e saída.
- Evita problemas de serialização de relacionamentos bidirecionais/lazy.
### 6.2 Bean Validation no ProductRequest

```text
public record ProductRequest(
    @NotBlank @Size(max = 60) String sku,
    @NotBlank @Size(min = 2, max = 160) String name,
    @Size(max = 500) String description,
    @NotNull @DecimalMin("0.01") BigDecimal price,
    @NotNull @Min(0) Integer stock,
    boolean active,
    @NotNull Long categoryId
) {}
```

Quando o controller usa @Valid @RequestBody ProductRequest, o Spring valida antes de chamar o service. Se falhar, MethodArgumentNotValidException é capturada pelo handler global e vira HTTP 422.

| Pegadinha comum: @Column(nullable=false) protege o banco; @NotNull/@NotBlank protege a entrada da API. São camadas diferentes e é normal usar as duas. |
| --- |

## 7. Autenticação e autorização com Spring Security + JWT

### 7.1 Fluxo completo do login

1. React envia POST /api/auth/login com email e senha.
1. AuthService chama AuthenticationManager.authenticate(...).
1. DaoAuthenticationProvider usa CustomUserDetailsService para buscar o usuário por email.
1. BCryptPasswordEncoder compara a senha informada com o hash salvo.
1. Se correto, JwtService gera um token assinado contendo o email como subject.
1. O frontend salva token e usuário no localStorage.
1. Nas próximas requisições, Axios envia Authorization: Bearer <token>.
1. JwtAuthenticationFilter valida o token e preenche SecurityContextHolder.
1. O Spring libera a rota se autenticada e, quando houver @PreAuthorize, verifica a role.
### 7.2 UserDetails e authorities

```text
@Override
public Collection<? extends GrantedAuthority> getAuthorities() {
    return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
}
@Override public String getUsername() { return email; }
@Override public boolean isEnabled() { return active; }
```

hasRole("ADMIN") internamente procura ROLE_ADMIN. Por isso o prefixo ROLE_ aparece em getAuthorities().

### 7.3 JwtService

```text
return Jwts.builder()
    .subject(userDetails.getUsername())
    .issuedAt(now)
    .expiration(new Date(now.getTime() + expiration))
    .signWith(getSigningKey())
    .compact();
```

O token tem emissão, expiração e assinatura. Não é criptografia do conteúdo; é uma forma de garantir integridade/autenticidade. Não coloque senha ou segredo sensível dentro dos claims.

### 7.4 SecurityConfig e sessão stateless

```text
http
  .csrf(csrf -> csrf.disable())
  .cors(cors -> cors.configurationSource(corsConfigurationSource()))
  .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
  .authorizeHttpRequests(auth -> auth
      .requestMatchers("/api/auth/**", "/error").permitAll()
      .anyRequest().authenticated())
  .authenticationProvider(authenticationProvider())
  .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
```

STATELESS é coerente com JWT: o servidor não mantém HttpSession de login. Cada requisição carrega sua prova de autenticação.

### 7.5 CORS

Como o Vite roda em localhost:5173 e o Spring em localhost:8080, o navegador considera origens diferentes. O backend libera explicitamente a origem do frontend e os métodos GET/POST/PUT/PATCH/DELETE/OPTIONS.

## 8. Repositories, consultas e paginação

### 8.1 JpaRepository

```text
public interface ProductRepository extends JpaRepository<Product, Long> { ... }
```

Sem implementar métodos básicos, já existem save, findById, findAll, delete, count etc. O Spring cria uma implementação proxy em tempo de execução.

### 8.2 Pageable e Page

```text
@GetMapping
public Page<ProductResponse> list(
    @RequestParam(required = false) String q,
    @PageableDefault(size = 10, sort = "name") Pageable pageable) {
    return service.list(q, pageable);
}
```

Uma chamada como /api/products?page=1&size=20&sort=price,desc é convertida em Pageable. O JSON Page inclui content, number, totalPages, totalElements, size etc., que o componente Pagination usa.

### 8.3 JPQL + @EntityGraph

```sql
@EntityGraph(attributePaths = {"category"})
@Query("""
 select p from Product p
 join p.category c
 where lower(p.name) like lower(concat('%', :q, '%'))
    or lower(p.sku) like lower(concat('%', :q, '%'))
    or lower(c.name) like lower(concat('%', :q, '%'))
""")
Page<Product> search(@Param("q") String q, Pageable pageable);
```

JPQL consulta entidades e atributos, não nomes físicos de coluna. @EntityGraph pede ao JPA que carregue category junto, evitando LazyInitializationException na conversão para ProductResponse com open-in-view=false.

## 9. Services, exceções e regras de negócio

### 9.1 ProductService como exemplo de regra

```text
public ProductResponse create(ProductRequest request) {
    if (repository.existsBySkuIgnoreCase(request.sku()))
        throw new BusinessException("SKU já cadastrado");
    var p = new Product();
    apply(p, request);
    return toResponse(repository.save(p));
}
```

O controller não pergunta se SKU já existe. Essa é regra de negócio e fica no service. Assim, a mesma regra pode ser reutilizada por outro endpoint, teste ou integração.

### 9.2 Handler global

```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiError> notFound(...) { ... } // 404

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ApiError> business(...) { ... } // 400

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> validation(...) { ... } // 422
}
```

| Situação | Exceção/status | Exemplo |
| --- | --- | --- |
| Recurso não existe | ResourceNotFoundException → 404 | Produto id 999 |
| Regra violada | BusinessException → 400 | Estoque insuficiente |
| DTO inválido | MethodArgumentNotValidException → 422 | Preço 0 ou nome vazio |
| Restrição do banco | DataIntegrityViolationException → 409 | UNIQUE/FK |
| Falha não prevista | Exception → 500 | Erro interno |

## 10. Dashboard: agregação de várias fontes

DashboardService coordena vários repositories e services para montar um único DashboardResponse. Em uma única chamada, o frontend recebe quantidade de clientes, produtos ativos, pedidos, pendentes, estoque baixo, receita e listas recentes.

```text
@Transactional(readOnly = true)
public DashboardResponse get() {
    var recent = orderRepository.findTop5ByOrderByCreatedAtDesc()
        .stream().map(orderService::toSummary).toList();
    var low = productRepository.findTop5ByStockLessThanEqualOrderByStockAsc(5)
        .stream().map(productService::toResponse).toList();
    return new DashboardResponse(
        customerRepository.count(),
        productRepository.countByActiveTrue(),
        orderRepository.count(),
        orderRepository.countByStatus(OrderStatus.PENDING),
        productRepository.countByStockLessThanEqual(5),
        orderRepository.totalRevenue(), recent, low);
}
```

Essa abordagem reduz múltiplas chamadas do React. Para dashboards maiores, seria possível criar projections, queries agregadas ou cache.

## 11. Pedido: o fluxo de negócio mais importante do projeto

### 11.1 Criação do pedido passo a passo

1. Busca o cliente e falha com 404 se não existir.
1. Cria Order com status PENDING e total zero.
1. Para cada item: busca produto, verifica se ativo, verifica estoque.
1. Calcula subtotal = preço × quantidade usando BigDecimal.
1. Cria OrderItem guardando unitPrice. Isso preserva o preço histórico do momento da venda.
1. Adiciona item ao pedido e reduz o estoque do Product.
1. Soma subtotais em total.
1. Salva Order. Pelo cascade, os OrderItem também são persistidos.
1. Retorna OrderResponse detalhado.
### 11.2 Por que @Transactional é obrigatório aqui

```text
@Transactional
public OrderResponse create(OrderRequest request) {
    // valida cliente/produtos
    // reduz estoques
    // cria itens
    // salva pedido
}
```

Sem transação, poderia ocorrer um erro depois de baixar o estoque de alguns produtos e antes de salvar o pedido. Com uma transação, uma RuntimeException provoca rollback e o banco volta ao estado anterior.

### 11.3 Cancelamento e devolução ao estoque

```text
if (newStatus == OrderStatus.CANCELED && order.getStatus() != OrderStatus.CANCELED) {
    order.getItems().forEach(item -> {
        var p = item.getProduct();
        p.setStock(p.getStock() + item.getQuantity());
    });
}
```

| Ideia de consistência: O pedido cancelado devolve o estoque exatamente uma vez. A regra impede reabrir pedido cancelado, evitando trajetórias de estado ambíguas. |
| --- |

## 12. DataInitializer: dados iniciais

DataInitializer expõe um CommandLineRunner executado na inicialização. Ele cria usuários, categorias, clientes e produtos somente quando necessário. O password encoder é usado também no seed, então senhas iniciais são gravadas como hash BCrypt.

| Em produção: Seeds com credenciais fixas são úteis para aula/desenvolvimento, mas em produção devem ser substituídos por migrações/rotinas seguras e variáveis de ambiente. |
| --- |

## 13. Axios: cliente HTTP centralizado no frontend

```jsx
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('nexuserp_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

Todas as páginas importam a mesma instância api. Assim, baseURL, timeout e autenticação não são repetidos. O interceptor de resposta captura 401, limpa sessão local e redireciona ao login.

| Onde está no NexusERP: frontend/src/api/client.js — Instância Axios, JWT e apiErrorMessage. |
| --- |

## 14. AuthContext: autenticação global no React

### 14.1 Provider e hook useAuth

```jsx
const value = useMemo(
  () => ({ user, login, logout, isAdmin: user?.role === 'ADMIN' }),
  [user]
);
return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
```

main.jsx envolve App com AuthProvider, então qualquer componente descendente pode chamar useAuth(). Isso evita repassar user/login/logout por props em muitos níveis.

### 14.2 Persistência no localStorage

O state inicial tenta ler nexuserp_user do localStorage. login grava token e usuário; logout remove ambos. Isso mantém a sessão visual após F5. O backend ainda é a autoridade: token expirado ou inválido retorna 401 e o interceptor força novo login.

## 15. React Router: rotas, layout e proteção

```jsx
<Routes>
  <Route path="/login" element={<Login />} />
  <Route element={<ProtectedRoute />}>
    <Route element={<Layout />}>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/products/:id/edit" element={<ProductForm />} />
      <Route path="/orders/:id" element={<OrderDetails />} />
    </Route>
  </Route>
</Routes>
```

ProtectedRoute retorna <Outlet/> se existe usuário e <Navigate/> para login caso contrário. Layout também usa Outlet para encaixar a página dentro de Sidebar + Header. Rotas com :id usam useParams().

## 16. Estado e efeitos nas páginas React

### 16.1 useState: dados mutáveis da tela

Login usa state para form, error e loading. NewOrder usa customers, products, customerId, items, error e saving. Atualizar state provoca nova renderização.

### 16.2 useEffect: carregar dados

```text
useEffect(() => {
  api.get('/dashboard')
    .then(r => setData(r.data))
    .catch(e => setError(apiErrorMessage(e)));
}, []);
```

Array vazio significa executar depois da montagem. Em telas por id, a dependência [id] recarrega quando o parâmetro muda.

### 16.3 useMemo: total do pedido

```jsx
const total = useMemo(
  () => items.reduce((s, i) => s + Number(i.price) * i.quantity, 0),
  [items]
);
```

### 16.4 Hook useDebounce

```jsx
export default function useDebounce(value, delay = 350) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}
```

O cleanup cancela o timer anterior. Em busca, isso evita disparar uma requisição para cada tecla e só consulta após o usuário parar de digitar por ~350 ms.

## 17. Integração ponta a ponta: exemplo completo de criar produto

1. Usuário preenche ProductForm.
1. O submit monta JSON com sku, name, description, price, stock, active e categoryId.
1. Axios adiciona Authorization automaticamente.
1. POST /api/products chega ao JwtAuthenticationFilter e depois ao ProductController.
1. @PreAuthorize exige ADMIN.
1. @Valid valida ProductRequest.
1. ProductService verifica SKU duplicado, busca categoria e mapeia DTO -> entidade.
1. ProductRepository.save chama JPA/Hibernate e executa INSERT.
1. ProductService converte Entity -> ProductResponse.
1. JSON retorna ao React; a tela navega/atualiza conforme implementação.
| Como responder questão de arquitetura: Descreva sempre o caminho entrada → validação → regra → persistência → resposta. Isso mostra domínio de REST, Spring e React ao mesmo tempo. |
| --- |

## 18. Mapa rápido: “quero alterar X, onde mexo?”

| Necessidade | Arquivos principais |
| --- | --- |
| Adicionar campo em Produto | Product entity + ProductRequest/Response + ProductService + form React; talvez migration/DDL. |
| Nova validação | DTO Bean Validation e/ou regra no Service. |
| Nova rota | Controller + Service; Repository se exigir consulta. |
| Restringir rota a ADMIN | @PreAuthorize e, para UX, ocultar ação no frontend com isAdmin. |
| Mudar URL da API no frontend | .env com VITE_API_URL. |
| Mudar credencial MySQL | DB_USERNAME/DB_PASSWORD ou application.properties. |
| Nova consulta com filtro | Repository + Service + RequestParam + query params no Axios. |
| Novo status de pedido | OrderStatus + regra de transição + frontend StatusBadge/seleção. |
| Erro padronizado novo | Nova exception e @ExceptionHandler. |
| Mostrar informação no Dashboard | DashboardResponse + DashboardService + Dashboard.jsx. |

## 19. Checklist de diagnóstico

| Sintoma | Onde olhar primeiro |
| --- | --- |
| Communications link failure | MySQL/XAMPP, porta 3306, usuário/senha. |
| 401 Unauthorized | Token, expiration, header Bearer, usuário ativo. |
| 403 Forbidden | Role/authority e @PreAuthorize. |
| CORS blocked | allowedOrigin e URL/porta do Vite. |
| 422 Unprocessable Entity | Campos e anotações do DTO. |
| LazyInitializationException | @EntityGraph, transação, open-in-view=false. |
| Tela vazia após API | Console e Network do navegador, formato JSON esperado. |
| npm não reconhecido | Node.js/npm ausente ou PATH. |
| mvn não reconhecido | Maven ausente ou PATH/MAVEN_HOME. |
| Tabela/coluna não atualiza | ddl-auto, entidade e conexão com schema correto. |
