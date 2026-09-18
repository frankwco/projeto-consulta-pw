# Guia de revisão — NexusERP

Este arquivo foi pensado para consulta rápida durante avaliação prática.

## 1. Arquitetura em camadas

Fluxo típico no backend:

`HTTP -> Controller -> Service -> Repository -> JPA/Hibernate -> MySQL`

- **Controller**: recebe HTTP, valida DTO e define status code.
- **Service**: regra de negócio e transações.
- **Repository**: acesso ao banco via Spring Data JPA.
- **Entity**: mapeia tabela/relacionamento.
- **DTO**: contrato externo da API; evita expor entidade diretamente.
- **ExceptionHandler**: centraliza formato dos erros.

No frontend:

`Route -> Page/Component -> Axios -> API -> State -> Render`

## 2. REST e HTTP

Convenção comum:

- `GET /resources` lista.
- `GET /resources/{id}` busca um.
- `POST /resources` cria.
- `PUT /resources/{id}` substitui/atualiza o recurso.
- `PATCH /resources/{id}/field` atualiza parte específica.
- `DELETE /resources/{id}` remove.

Status importantes:

- `200 OK`: leitura/alteração concluída.
- `201 Created`: criação.
- `204 No Content`: remoção sem corpo.
- `400 Bad Request`: regra de negócio/entrada inválida.
- `401 Unauthorized`: não autenticado ou credenciais inválidas.
- `403 Forbidden`: autenticado, mas sem permissão.
- `404 Not Found`: recurso não existe.
- `409 Conflict`: conflito/integridade.
- `422 Unprocessable Entity`: validação dos campos.
- `500 Internal Server Error`: erro não tratado.

## 3. DTO com Java record

```java
public record ProductRequest(
    @NotBlank String name,
    @NotNull @DecimalMin("0.01") BigDecimal price
) {}
```

Vantagens: imutável, conciso, bom para contratos de entrada/saída.

## 4. Bean Validation

Anotações frequentes:

```java
@NotNull
@NotBlank
@Email
@Size(min = 2, max = 100)
@Min(0)
@DecimalMin("0.01")
@Valid
```

No controller:

```java
public ResponseEntity<?> create(@Valid @RequestBody ProductRequest request) { ... }
```

## 5. JPA — entidades

```java
@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
}
```

Tipos de relação:

```java
@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "category_id")
private Category category;

@OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
private List<OrderItem> items;
```

Regra mental:

- Muitos produtos pertencem a uma categoria -> `Product @ManyToOne Category`.
- Um pedido contém muitos itens -> `Order @OneToMany OrderItem`.

## 6. LAZY vs EAGER

- `LAZY`: carrega relacionamento quando necessário. Evita trazer dados demais.
- `EAGER`: carrega sempre. Pode gerar consultas grandes/N+1.

Com `spring.jpa.open-in-view=false`, acesse relacionamento lazy dentro de transação ou use `@EntityGraph`/`join fetch`.

Exemplo do projeto:

```java
@EntityGraph(attributePaths = {"category"})
Page<Product> findAll(Pageable pageable);
```

## 7. Paginação

Controller:

```java
@GetMapping
public Page<ProductResponse> list(
    @PageableDefault(size = 10, sort = "name") Pageable pageable
) {
    return service.list(pageable);
}
```

URL:

```text
/api/products?page=0&size=10&sort=name,asc
```

Campos úteis da resposta: `content`, `number`, `totalPages`, `totalElements`, `first`, `last`.

## 8. Repository derivado

Spring interpreta o nome:

```java
Optional<User> findByEmailIgnoreCase(String email);
boolean existsBySkuIgnoreCase(String sku);
long countByStockLessThanEqual(Integer stock);
```

## 9. JPQL

```java
@Query("""
    select p from Product p
    join p.category c
    where lower(p.name) like lower(concat('%', :q, '%'))
       or lower(c.name) like lower(concat('%', :q, '%'))
""")
Page<Product> search(@Param("q") String q, Pageable pageable);
```

JPQL usa **nomes de entidades/campos Java**, não nomes de tabelas SQL.

## 10. Transação

Pedido é um ótimo exemplo: baixar vários estoques e criar pedido deve acontecer como uma unidade.

```java
@Transactional
public OrderResponse create(OrderRequest request) {
    // valida cliente
    // valida produtos
    // baixa estoque
    // cria itens
    // salva pedido
}
```

Se uma exceção runtime ocorrer, a transação é revertida.

## 11. Spring Security + JWT

Fluxo:

1. Login recebe e-mail/senha.
2. `AuthenticationManager` valida senha BCrypt.
3. Backend gera JWT.
4. Frontend salva token.
5. Axios envia `Authorization: Bearer TOKEN`.
6. Filtro JWT lê o header.
7. Usuário é colocado no `SecurityContext`.
8. Regras de autorização são avaliadas.

Proteção por método:

```java
@PreAuthorize("hasRole('ADMIN')")
```

Configuração stateless:

```java
.sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
```

## 12. BCrypt

Nunca armazene senha em texto puro.

```java
@Bean
PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
}
```

```java
String hash = passwordEncoder.encode(request.password());
```

## 13. CORS

React roda em `localhost:5173`; Spring em `localhost:8080`. São origens diferentes.

Por isso o backend libera a origem do frontend em `SecurityConfig`.

## 14. Tratamento global de erro

```java
@RestControllerAdvice
class GlobalExceptionHandler {
    @ExceptionHandler(ResourceNotFoundException.class)
    ResponseEntity<ApiError> notFound(...) { ... }
}
```

Evita `try/catch` repetido em cada controller.

## 15. React — estado controlado

```jsx
const [form, setForm] = useState({ name: '' });

<input
  value={form.name}
  onChange={e => setForm({ ...form, name: e.target.value })}
/>
```

## 16. useEffect

```jsx
useEffect(() => {
  api.get('/products').then(r => setProducts(r.data.content));
}, []);
```

`[]` executa no mount. Dependências diferentes fazem o efeito reagir às mudanças.

## 17. Context API

O projeto usa `AuthContext` para compartilhar usuário/login/logout sem prop drilling.

```jsx
const { user, login, logout, isAdmin } = useAuth();
```

## 18. Rotas protegidas

```jsx
return user ? <Outlet /> : <Navigate to="/login" replace />;
```

Isso melhora UX, mas **segurança real precisa estar no backend**. Nunca confie apenas em esconder botão no React.

## 19. Axios interceptor

```js
api.interceptors.request.use(config => {
  const token = localStorage.getItem('nexuserp_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

Centraliza autenticação para todas as requisições.

## 20. Debounce de busca

Evita enviar uma requisição a cada tecla imediatamente. O hook `useDebounce` aguarda alguns milissegundos antes de atualizar o termo efetivo.

## 21. MySQL — JOIN

```sql
SELECT p.name, c.name AS category
FROM products p
JOIN categories c ON c.id = p.category_id;
```

## 22. GROUP BY

```sql
SELECT status, COUNT(*) AS qtd, SUM(total) AS total
FROM orders
GROUP BY status;
```

## 23. Índices e UNIQUE

No projeto, e-mail e SKU usam `unique = true`. Isso garante consistência também no banco. Em sistemas reais, índices devem refletir filtros e joins mais usados.

## 24. Problemas comuns

### MySQL não conecta

Confira XAMPP, porta 3306, usuário/senha e se outro MySQL já está usando a porta.

### `Access denied for user 'root'`

Ajuste `spring.datasource.password` ou variável `DB_PASSWORD`.

### CORS

Se o frontend rodar em outra porta, altere `FRONTEND_URL` ou `app.cors.allowed-origin`.

### 401

Token ausente, expirado, inválido ou usuário desativado. Faça login novamente.

### 403

Usuário autenticado, porém sem o perfil exigido.

### LazyInitializationException

Relacionamento lazy foi acessado fora de uma sessão/transação. Use transação, projection, `@EntityGraph` ou `join fetch`.

### `DataIntegrityViolationException`

Pode ser chave única repetida ou tentativa de remover registro ainda referenciado.

## 25. Ordem de criação de um CRUD novo

Uma sequência rápida e segura:

1. Criar entidade.
2. Criar repository.
3. Criar DTO request/response.
4. Criar service com regras.
5. Criar controller.
6. Criar tratamento de erro.
7. Testar API.
8. Criar página React.
9. Integrar Axios.
10. Tratar loading/erro/paginação.

## 26. Checklist para explicar o projeto

Se pedirem "como funciona?", responda em blocos:

- SPA React faz navegação e formulários.
- Axios chama API REST.
- JWT autentica chamadas stateless.
- Controllers expõem endpoints.
- Services contêm regras/transações.
- Repositories usam Spring Data JPA.
- Hibernate mapeia entidades para MySQL.
- XAMPP fornece o MySQL local.
- DTOs + Validation controlam contrato e entrada.
- Exception Handler padroniza erros.
