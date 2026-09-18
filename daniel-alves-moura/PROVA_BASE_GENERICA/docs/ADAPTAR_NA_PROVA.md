# Manual de adaptação da PROVA BASE

> Objetivo: pegar esta base e transformá-la rapidamente no sistema solicitado pela prova sem reconstruir login, segurança, API, tabela e dashboard do zero.

## Índice alfabético de consulta rápida

- **API / endpoints** → seção 8
- **Autenticação / login** → seção 12
- **Banco / MySQL / XAMPP** → seção 3
- **Busca e paginação** → seção 10
- **Controller** → seção 7
- **CRUD** → seções 5 a 9
- **Dashboard** → seção 11
- **DTO** → seção 6
- **Entity / entidade** → seção 5
- **Filtros personalizados / Specification** → seção 10
- **Formulário React** → seção 15
- **Login** → seção 12
- **Nomes / renomear Registro** → seção 4
- **Repository** → seção 9
- **Rotas React** → seção 14
- **Security / JWT** → seção 12
- **Service** → seção 8
- **Tabela React** → seção 15
- **Validação** → seção 6
- **Vite / URL da API** → seção 13

---

## 1. Estratégia durante a prova

A base usa uma entidade propositalmente genérica chamada `Registro`. Quando a prova pedir algo como **Produto**, **Cliente**, **Aluno**, **Livro**, **Consulta**, **Tarefa** ou **Chamado**, faça a adaptação em camadas, nesta ordem:

1. definir os campos da entidade;
2. alterar `Registro.java`;
3. alterar `RegistroRequest` e `RegistroResponse`;
4. adaptar `RegistroRepository` se houver filtros específicos;
5. adaptar `RegistroService`;
6. renomear/ajustar endpoints no `RegistroController`;
7. alterar formulário e colunas da tabela no React;
8. trocar indicadores do dashboard;
9. testar POST, GET, PUT e DELETE.

**Dica de prova:** primeiro faça o sistema funcionar com o nome `Registro`. Se sobrar tempo, renomeie classes e arquivos. O funcionamento costuma valer mais que a estética interna.

---

## 2. Mapa do projeto

### Backend

```text
entity      -> formato das tabelas e relacionamentos
repository  -> consultas ao MySQL
service     -> regras de negócio
controller  -> URLs da API
dto         -> JSON de entrada/saída
security    -> JWT/login
config      -> CORS, Security e carga inicial
exception   -> respostas de erro
```

Fluxo normal:

```text
React -> Controller -> Service -> Repository -> MySQL
                    <- DTO <- Entity <-
```

### Frontend

```text
pages       -> telas
components  -> partes reutilizáveis
api/api.js  -> conexão Axios
context     -> login/token
styles      -> aparência
```

---

## 3. Banco / MySQL / XAMPP

Arquivo:

```text
backend/src/main/resources/application.properties
```

Configuração padrão:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/prova_base?createDatabaseIfNotExist=true...
spring.datasource.username=root
spring.datasource.password=
spring.jpa.hibernate.ddl-auto=update
```

### Se a prova exigir outro banco

Troque apenas `prova_base`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/biblioteca?createDatabaseIfNotExist=true...
```

### Se o MySQL possuir senha

```properties
spring.datasource.password=123456
```

### O que faz `ddl-auto=update`

O Hibernate cria/ajusta tabelas de acordo com as classes `@Entity`. É muito conveniente em prova porque você não precisa escrever todo o DDL manualmente.

---

## 4. Renomeando `Registro` para o domínio da prova

Exemplo: a prova pede **Produto**.

Você pode fazer a versão rápida, mantendo internamente o nome `Registro`, mas alterando os campos e os textos da interface.

Ou fazer a versão organizada:

```text
Registro.java            -> Produto.java
RegistroRepository.java  -> ProdutoRepository.java
RegistroService.java     -> ProdutoService.java
RegistroController.java  -> ProdutoController.java
RegistroRequest.java     -> ProdutoRequest.java
RegistroResponse.java    -> ProdutoResponse.java
RegistrosPage.jsx        -> ProdutosPage.jsx
RegistroForm.jsx         -> ProdutoForm.jsx
```

Depois use a busca global do VS Code:

```text
Ctrl + Shift + F
```

Pesquise `Registro` e substitua cuidadosamente por `Produto`.

Também troque:

```java
@RequestMapping("/api/registros")
```

por:

```java
@RequestMapping("/api/produtos")
```

E no React:

```javascript
api.get('/registros')
```

por:

```javascript
api.get('/produtos')
```

---

## 5. Entity: adaptando os campos do banco

A entidade atual possui:

```java
private String nome;
private String descricao;
private String categoria;
private BigDecimal valor;
private StatusRegistro status;
```

### Exemplo: Produto

```java
@Entity
@Table(name = "produtos")
public class Produto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false, unique = true)
    private String codigo;

    private BigDecimal preco;
    private Integer estoque;
    private Boolean ativo;
}
```

### Exemplo: Aluno

```java
@Entity
@Table(name = "alunos")
public class Aluno {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(unique = true)
    private String matricula;

    private String curso;
    private LocalDate dataNascimento;
}
```

### Exemplo: Tarefa

```java
private String titulo;
private String descricao;
private LocalDate prazo;
private Prioridade prioridade;
private StatusTarefa status;
```

### Tipos Java comuns

```text
VARCHAR             -> String
INT                  -> Integer
BIGINT               -> Long
DECIMAL              -> BigDecimal
BOOLEAN              -> Boolean
DATE                 -> LocalDate
DATETIME/TIMESTAMP   -> LocalDateTime
ENUM                 -> enum + @Enumerated(EnumType.STRING)
```

---

## 6. DTO e validação

O `Request` representa o JSON que chega ao backend.

Exemplo de Produto:

```java
public record ProdutoRequest(
    @NotBlank String nome,
    @NotBlank String codigo,
    @NotNull @DecimalMin("0.0") BigDecimal preco,
    @NotNull @Min(0) Integer estoque
) {}
```

JSON correspondente:

```json
{
  "nome": "Teclado",
  "codigo": "TEC-001",
  "preco": 199.90,
  "estoque": 15
}
```

Validações úteis:

```java
@NotBlank
@NotNull
@Size(min = 3, max = 100)
@Email
@Min(0)
@Max(100)
@DecimalMin("0.0")
@Positive
@Past
@Future
```

O controller já usa:

```java
@Valid @RequestBody RegistroRequest request
```

Portanto, erros de validação passam pelo `GlobalExceptionHandler`.

---

## 7. Controller: adaptando as URLs

O controller atual fornece CRUD completo:

```text
GET    /api/registros
GET    /api/registros/{id}
POST   /api/registros
PUT    /api/registros/{id}
DELETE /api/registros/{id}
```

Para Produtos:

```java
@RestController
@RequestMapping("/api/produtos")
public class ProdutoController {
```

Você normalmente não precisa alterar a lógica básica do CRUD. Apenas tipos e nomes.

### Endpoint extra pedido na prova

Exemplo: produtos com estoque baixo.

```java
@GetMapping("/estoque-baixo")
public List<ProdutoResponse> estoqueBaixo() {
    return service.estoqueBaixo();
}
```

---

## 8. Service: colocando regra de negócio

É aqui que regras específicas da prova devem ficar.

A base atual faz:

```java
public RegistroResponse criar(RegistroRequest request) {
    Registro registro = new Registro();
    aplicar(request, registro);
    return toResponse(repository.save(registro));
}
```

### Exemplo: impedir estoque negativo

```java
if (request.estoque() < 0) {
    throw new IllegalArgumentException("Estoque não pode ser negativo");
}
```

### Exemplo: impedir código duplicado

Repository:

```java
boolean existsByCodigo(String codigo);
```

Service:

```java
if (repository.existsByCodigo(request.codigo())) {
    throw new IllegalArgumentException("Código já cadastrado");
}
```

### Exemplo: cálculo automático

```java
BigDecimal total = request.preco().multiply(
    BigDecimal.valueOf(request.quantidade())
);
entidade.setTotal(total);
```

Use `@Transactional` em operações que alteram dados.

---

## 9. Repository: criando consultas rapidamente

Spring Data consegue gerar várias consultas apenas pelo nome do método.

```java
Optional<Produto> findByCodigo(String codigo);
List<Produto> findByAtivoTrue();
List<Produto> findByCategoria(String categoria);
boolean existsByCodigo(String codigo);
long countByAtivoTrue();
```

Busca parcial:

```java
Page<Produto> findByNomeContainingIgnoreCase(String nome, Pageable pageable);
```

Consulta personalizada:

```java
@Query("SELECT p FROM Produto p WHERE p.estoque < :limite")
List<Produto> estoqueBaixo(@Param("limite") Integer limite);
```

Agregação:

```java
@Query("SELECT COALESCE(SUM(p.preco * p.estoque), 0) FROM Produto p")
BigDecimal valorDoEstoque();
```

---

## 10. Busca, filtros personalizados, ordenação e paginação

A base já vem com filtros dinâmicos usando **Spring Data JPA Specification**. Isso é útil porque todos os filtros são opcionais e podem ser combinados sem criar um método no Repository para cada combinação.

Arquivos principais:

```text
backend/.../dto/RegistroFiltro.java
backend/.../specification/RegistroSpecifications.java
backend/.../repository/RegistroRepository.java
backend/.../service/RegistroService.java
backend/.../controller/RegistroController.java
frontend/src/components/RegistroFiltros.jsx
frontend/src/pages/RegistrosPage.jsx
```

### 10.1 Parâmetros disponíveis

A API aceita:

```text
?busca=texto
&nome=exemplo
&categoria=Categoria 1
&status=ATIVO
&valorMin=10
&valorMax=500
&dataInicio=2026-01-01
&dataFim=2026-12-31
&page=0
&size=8
&sort=valor
&direction=desc
```

Todos os filtros de negócio são opcionais. Se você mandar apenas `status`, filtra somente por status. Se mandar `status + categoria + valorMin`, os três precisam ser verdadeiros ao mesmo tempo.

Exemplo completo:

```http
GET /api/registros?categoria=hardware&status=ATIVO&valorMin=100&valorMax=3000&sort=valor&direction=desc
```

Interpretação aproximada do SQL gerado:

```sql
SELECT *
FROM registros
WHERE LOWER(categoria) LIKE '%hardware%'
  AND status = 'ATIVO'
  AND valor >= 100
  AND valor <= 3000
ORDER BY valor DESC;
```

### 10.2 Por que usar `JpaSpecificationExecutor`

O Repository está assim:

```java
public interface RegistroRepository
        extends JpaRepository<Registro, Long>,
                JpaSpecificationExecutor<Registro> {
}
```

`JpaRepository` continua fornecendo `save`, `findById`, `delete`, `count` etc.

`JpaSpecificationExecutor` acrescenta métodos como:

```java
findAll(specification, pageable);
```

Assim o Service pode montar o filtro dinamicamente e ainda usar paginação e ordenação.

### 10.3 O objeto `RegistroFiltro`

A base concentra os critérios em um `record`:

```java
public record RegistroFiltro(
    String busca,
    String nome,
    String categoria,
    StatusRegistro status,
    BigDecimal valorMin,
    BigDecimal valorMax,
    LocalDate dataInicio,
    LocalDate dataFim
) {}
```

Se a prova pedir Produto, você pode trocar para algo parecido com:

```java
public record ProdutoFiltro(
    String busca,
    String nome,
    Long categoriaId,
    Boolean ativo,
    BigDecimal precoMin,
    BigDecimal precoMax,
    Integer estoqueMin
) {}
```

Se pedir Aluno:

```java
public record AlunoFiltro(
    String nome,
    String matricula,
    String curso,
    String situacao,
    LocalDate nascimentoInicio,
    LocalDate nascimentoFim
) {}
```

### 10.4 Como funciona `RegistroSpecifications`

A Specification recebe `root`, `query` e `CriteriaBuilder`:

```java
return (root, query, cb) -> {
    List<Predicate> predicates = new ArrayList<>();

    if (filtro.status() != null) {
        predicates.add(cb.equal(root.get("status"), filtro.status()));
    }

    if (filtro.valorMin() != null) {
        predicates.add(
            cb.greaterThanOrEqualTo(root.get("valor"), filtro.valorMin())
        );
    }

    return cb.and(predicates.toArray(Predicate[]::new));
};
```

Tradução mental:

```text
root.get("campo")                 -> coluna/campo da entidade
cb.equal(...)                     -> =
cb.notEqual(...)                  -> <>
cb.like(...)                      -> LIKE
cb.greaterThan(...)               -> >
cb.greaterThanOrEqualTo(...)      -> >=
cb.lessThan(...)                  -> <
cb.lessThanOrEqualTo(...)         -> <=
cb.isNull(...)                    -> IS NULL
cb.isNotNull(...)                 -> IS NOT NULL
cb.and(...)                       -> AND
cb.or(...)                        -> OR
```

### 10.5 Busca livre em vários campos

A base possui uma busca que procura em `nome`, `descricao` ou `categoria`:

```java
String termo = "%" + filtro.busca().trim().toLowerCase() + "%";

predicates.add(cb.or(
    cb.like(cb.lower(root.get("nome")), termo),
    cb.like(cb.lower(cb.coalesce(root.get("descricao"), "")), termo),
    cb.like(cb.lower(cb.coalesce(root.get("categoria"), "")), termo)
));
```

Para Produto você pode pesquisar nome + código + marca:

```java
predicates.add(cb.or(
    cb.like(cb.lower(root.get("nome")), termo),
    cb.like(cb.lower(root.get("codigo")), termo),
    cb.like(cb.lower(root.get("marca")), termo)
));
```

### 10.6 Filtro de texto parcial ou exato

Parcial:

```java
cb.like(cb.lower(root.get("nome")), "%" + nome.toLowerCase() + "%")
```

Exato:

```java
cb.equal(root.get("codigo"), filtro.codigo())
```

Use parcial para nome/descrição e exato para código, matrícula, CPF, enum, boolean e IDs.

### 10.7 Faixa numérica

Para preço entre mínimo e máximo:

```java
if (filtro.precoMin() != null) {
    predicates.add(cb.greaterThanOrEqualTo(root.get("preco"), filtro.precoMin()));
}

if (filtro.precoMax() != null) {
    predicates.add(cb.lessThanOrEqualTo(root.get("preco"), filtro.precoMax()));
}
```

A base também valida uma faixa invertida no Service:

```java
if (filtro.valorMin() != null && filtro.valorMax() != null
        && filtro.valorMin().compareTo(filtro.valorMax()) > 0) {
    throw new IllegalArgumentException(
        "valorMin não pode ser maior que valorMax"
    );
}
```

O `GlobalExceptionHandler` transforma isso em HTTP 400.

### 10.8 Intervalo de datas

A base filtra `criadoEm` usando datas sem exigir que o usuário informe horário.

```java
if (filtro.dataInicio() != null) {
    LocalDateTime inicio = filtro.dataInicio().atStartOfDay();
    predicates.add(cb.greaterThanOrEqualTo(root.get("criadoEm"), inicio));
}

if (filtro.dataFim() != null) {
    LocalDateTime fimExclusivo = filtro.dataFim().plusDays(1).atStartOfDay();
    predicates.add(cb.lessThan(root.get("criadoEm"), fimExclusivo));
}
```

O uso de `< início do próximo dia` faz `dataFim=2026-09-17` incluir registros de qualquer horário desse dia.

### 10.9 Boolean no filtro

Se Produto tiver `ativo`:

```java
if (filtro.ativo() != null) {
    predicates.add(cb.equal(root.get("ativo"), filtro.ativo()));
}
```

Use `Boolean`, e não `boolean`, no DTO de filtro. Assim existem três estados:

```text
null  -> não filtrar
true  -> somente ativos
false -> somente inativos
```

### 10.10 Relacionamento `@ManyToOne` no filtro

Se Produto tiver:

```java
@ManyToOne
private Categoria categoria;
```

e o filtro receber `categoriaId`, use:

```java
if (filtro.categoriaId() != null) {
    predicates.add(
        cb.equal(root.get("categoria").get("id"), filtro.categoriaId())
    );
}
```

Para filtrar pelo nome da categoria:

```java
cb.like(
    cb.lower(root.get("categoria").get("nome")),
    "%" + filtro.categoria().toLowerCase() + "%"
)
```

### 10.11 Controller: recebendo filtros

A base recebe os query params no Controller e monta `RegistroFiltro`:

```java
@GetMapping
public Page<RegistroResponse> listar(
        @RequestParam(required = false) String nome,
        @RequestParam(required = false) StatusRegistro status,
        @RequestParam(required = false) BigDecimal valorMin,
        @RequestParam(required = false) BigDecimal valorMax,
        @RequestParam(required = false)
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataInicio,
        @RequestParam(required = false)
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataFim,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size) {
    // monta filtro e chama Service
}
```

### 10.12 Service: Specification + Pageable

A parte principal é:

```java
PageRequest pageable = PageRequest.of(
    paginaSegura,
    tamanhoSeguro,
    Sort.by(direcao, campoOrdenacao)
);

return repository.findAll(
    RegistroSpecifications.comFiltros(filtro),
    pageable
).map(this::toResponse);
```

A base limita `size` a no máximo 100 e possui uma lista de campos permitidos para ordenação. Isso evita erro ao receber algo como `sort=campoQueNaoExiste`.

### 10.13 Frontend: painel de filtros

O componente é:

```text
frontend/src/components/RegistroFiltros.jsx
```

O estado usado pela página contém:

```javascript
const filtrosIniciais = {
  busca: '',
  nome: '',
  categoria: '',
  status: '',
  valorMin: '',
  valorMax: '',
  dataInicio: '',
  dataFim: '',
  sort: 'id',
  direction: 'desc',
  size: '8'
}
```

Antes de chamar a API, a função `montarParams` remove valores vazios. Isso evita enviar filtros que o usuário não preencheu.

```javascript
const { data } = await api.get('/registros', {
  params: montarParams(filtrosConsulta, page)
})
```

### 10.14 Por que existem `filtros` e `filtrosAplicados`

Na página há dois estados:

```text
filtros          -> o que está digitado no formulário
filtrosAplicados -> o que realmente está filtrando a tabela
```

Isso permite digitar novos valores sem alterar a paginação atual até clicar em **Aplicar filtros**.

Também faz com que os mesmos filtros continuem sendo usados depois de:

```text
- avançar página;
- voltar página;
- editar;
- criar;
- excluir.
```

### 10.15 Adaptando rapidamente para Produto

Suponha:

```java
Produto {
    Long id;
    String nome;
    String codigo;
    BigDecimal preco;
    Integer estoque;
    Boolean ativo;
    Categoria categoria;
}
```

Filtro:

```java
public record ProdutoFiltro(
    String busca,
    String codigo,
    Long categoriaId,
    BigDecimal precoMin,
    BigDecimal precoMax,
    Integer estoqueMin,
    Boolean ativo
) {}
```

Specification:

```java
if (temTexto(filtro.codigo())) {
    predicates.add(cb.equal(root.get("codigo"), filtro.codigo()));
}

if (filtro.categoriaId() != null) {
    predicates.add(cb.equal(
        root.get("categoria").get("id"),
        filtro.categoriaId()
    ));
}

if (filtro.precoMin() != null) {
    predicates.add(cb.greaterThanOrEqualTo(
        root.get("preco"), filtro.precoMin()
    ));
}

if (filtro.estoqueMin() != null) {
    predicates.add(cb.greaterThanOrEqualTo(
        root.get("estoque"), filtro.estoqueMin()
    ));
}

if (filtro.ativo() != null) {
    predicates.add(cb.equal(root.get("ativo"), filtro.ativo()));
}
```

No React, troque os inputs de `RegistroFiltros.jsx` pelos campos equivalentes.

### 10.16 Adaptando rapidamente para Aluno

Filtro possível:

```java
public record AlunoFiltro(
    String busca,
    String matricula,
    String curso,
    SituacaoAluno situacao,
    LocalDate nascimentoInicio,
    LocalDate nascimentoFim
) {}
```

Specification:

```java
if (temTexto(filtro.matricula())) {
    predicates.add(cb.equal(root.get("matricula"), filtro.matricula()));
}

if (temTexto(filtro.curso())) {
    predicates.add(cb.like(
        cb.lower(root.get("curso")),
        "%" + filtro.curso().toLowerCase() + "%"
    ));
}

if (filtro.situacao() != null) {
    predicates.add(cb.equal(root.get("situacao"), filtro.situacao()));
}
```

### 10.17 Receita rápida para adicionar um novo filtro

Se a prova pedir um filtro novo chamado `marca`, faça nesta ordem:

**1. DTO de filtro**

```java
String marca
```

**2. Controller**

```java
@RequestParam(required = false) String marca
```

Passe `marca` ao construir o DTO.

**3. Specification**

```java
if (temTexto(filtro.marca())) {
    predicates.add(cb.like(
        cb.lower(root.get("marca")),
        "%" + filtro.marca().toLowerCase() + "%"
    ));
}
```

**4. Frontend**

Adicione no estado:

```javascript
marca: ''
```

e no componente:

```jsx
<label>Marca
  <input name="marca" value={filtros.marca} onChange={alterar} />
</label>
```

Pronto: Axios envia o parâmetro automaticamente porque `montarParams` percorre o objeto de filtros.

### 10.18 Checklist de filtros na prova

```text
[ ] Campo existe na Entity?
[ ] Campo existe no DTO de filtro?
[ ] Controller recebe o query param?
[ ] DTO de filtro recebe o valor?
[ ] Specification cria o Predicate?
[ ] Campo de ordenação foi adicionado à lista permitida, se necessário?
[ ] Frontend tem input/select?
[ ] Estado inicial possui o campo?
[ ] Testei filtro sozinho?
[ ] Testei dois ou mais filtros combinados?
[ ] Testei paginação com filtro ativo?
[ ] Testei Limpar filtros?
```

---

## 11. Dashboard

Arquivos:

```text
backend/.../DashboardService.java
backend/.../DashboardController.java
frontend/src/pages/DashboardPage.jsx
```

A base mostra:

```text
Total
Ativos
Pendentes
Concluídos
Soma dos valores
```

Troque pelos indicadores do problema.

### Produto

```text
Total de produtos
Produtos ativos
Estoque baixo
Sem estoque
Valor total em estoque
```

### Aluno

```text
Total de alunos
Alunos ativos
Cursos cadastrados
Matrículas deste mês
```

### Chamado

```text
Total
Abertos
Em atendimento
Resolvidos
Atrasados
```

No repository crie métodos `count...` e consultas `SUM/AVG` quando necessário. Depois devolva tudo em `DashboardResponse`.

---

## 12. Autenticação, Security e JWT

Esta parte já está pronta. Evite mexer durante a prova se ela não pedir algo específico.

Fluxo:

```text
LoginPage
   |
POST /api/auth/login
   |
AuthenticationManager
   |
JwtService gera token
   |
React salva token no localStorage
   |
Axios envia Authorization: Bearer TOKEN
   |
JwtAuthenticationFilter valida token
```

Usuário inicial:

```text
admin@prova.com
Admin123!
```

### Endpoint público

Em `SecurityConfig`:

```java
.requestMatchers("/api/auth/**").permitAll()
```

Para liberar outro endpoint:

```java
.requestMatchers("/api/publico/**").permitAll()
```

### Endpoint somente ADMIN

Você pode colocar no controller:

```java
@PreAuthorize("hasRole('ADMIN')")
@DeleteMapping("/{id}")
public ResponseEntity<Void> excluir(...) { ... }
```

`@EnableMethodSecurity` já está ativado.

---

## 13. Axios, Vite e URL da API

Arquivo:

```text
frontend/src/api/api.js
```

A URL padrão é:

```javascript
http://localhost:8080/api
```

Pode ser configurada por `.env`:

```env
VITE_API_URL=http://localhost:8080/api
```

O interceptor já adiciona automaticamente:

```http
Authorization: Bearer SEU_TOKEN
```

Por isso as páginas não precisam repetir o código de JWT.

---

## 14. Rotas React

Arquivo:

```text
frontend/src/App.jsx
```

Atualmente:

```text
/login
/dashboard
/registros
```

Para Produtos:

```jsx
<Route path="/produtos" element={<ProdutosPage />} />
```

E no `Layout.jsx`:

```jsx
<NavLink to="/produtos">Produtos</NavLink>
```

A proteção já é aplicada pelo `ProtectedRoute`.

---

## 15. Adaptando formulário e tabela React

### Formulário

Arquivo:

```text
frontend/src/components/RegistroForm.jsx
```

Estado atual:

```javascript
const vazio = {
  nome: '',
  descricao: '',
  categoria: '',
  valor: 0,
  status: 'ATIVO'
}
```

Produto:

```javascript
const vazio = {
  nome: '',
  codigo: '',
  preco: 0,
  estoque: 0,
  ativo: true
}
```

Campo:

```jsx
<label>Preço
  <input
    name="preco"
    type="number"
    step="0.01"
    value={form.preco}
    onChange={alterar}
  />
</label>
```

### Tabela

Arquivo:

```text
frontend/src/pages/RegistrosPage.jsx
```

Cabeçalho atual:

```jsx
<th>ID</th>
<th>Nome</th>
<th>Categoria</th>
<th>Valor</th>
<th>Status</th>
<th>Ações</th>
```

Produto:

```jsx
<th>ID</th>
<th>Código</th>
<th>Produto</th>
<th>Preço</th>
<th>Estoque</th>
<th>Ações</th>
```

Linha:

```jsx
<td>{produto.codigo}</td>
<td>{produto.nome}</td>
<td>{produto.preco}</td>
<td>{produto.estoque}</td>
```

O criar/editar/excluir já está pronto. Normalmente só é preciso ajustar o `payload` e os campos exibidos.

---

## 16. Relacionamentos: quando a prova tiver duas tabelas

Exemplo: Produto pertence a Categoria.

Categoria:

```java
@Entity
public class Categoria {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;
}
```

Produto:

```java
@ManyToOne
@JoinColumn(name = "categoria_id")
private Categoria categoria;
```

No request, prefira receber o ID:

```java
public record ProdutoRequest(
    String nome,
    BigDecimal preco,
    Long categoriaId
) {}
```

No service:

```java
Categoria categoria = categoriaRepository.findById(request.categoriaId())
    .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada"));

produto.setCategoria(categoria);
```

Isso evita o frontend precisar enviar o objeto inteiro.

---

## 17. Receita pronta: transformar em sistema de Produtos

Backend:

```text
1. Registro -> Produto
2. campos: nome, codigo, preco, estoque, ativo
3. endpoint -> /api/produtos
4. Repository: existsByCodigo, countByAtivoTrue
5. Dashboard: total, ativos, estoqueBaixo, valorEstoque
```

Frontend:

```text
1. menu Registros -> Produtos
2. rota /registros -> /produtos
3. formulário com código/preço/estoque
4. tabela com código/preço/estoque
5. cards do dashboard
```

Payload:

```json
{
  "nome": "Mouse sem fio",
  "codigo": "MOU-001",
  "preco": 79.90,
  "estoque": 20,
  "ativo": true
}
```

---

## 18. Receita pronta: transformar em sistema de Alunos

Campos:

```text
nome
matricula
email
curso
dataNascimento
ativo
```

Possíveis validações:

```java
@NotBlank String nome
@NotBlank String matricula
@Email String email
@Past LocalDate dataNascimento
```

Dashboard:

```text
total de alunos
ativos
inativos
quantidade de cursos
novas matrículas
```

Busca:

```text
nome, matrícula ou curso
```

---

## 19. Checklist de 10 minutos antes de entregar

- Backend inicia sem erro.
- MySQL do XAMPP está ligado.
- Login funciona.
- POST cria um registro.
- GET atualiza a tabela.
- PUT altera um registro.
- DELETE remove um registro.
- Busca funciona.
- Dashboard carrega.
- Console do navegador não mostra erro importante.
- Aba Network mostra `200`, `201` ou `204` nas operações corretas.
- Frontend usa a mesma URL definida no controller.
- Nomes dos campos JSON são iguais no React e no DTO.

---

## 20. Erros mais comuns e correção rápida

### 401 Unauthorized

Verifique:

```text
token no localStorage
Authorization: Bearer ...
login correto
JWT_SECRET válido
```

### 403 Forbidden

Geralmente endpoint protegido por role/permissão.

### 400 Bad Request

Compare o JSON enviado pelo React com o `Request DTO`.

### 404

Compare:

```text
@RequestMapping no Controller
URL usada pelo Axios
@PathVariable correto
```

### CORS

O frontend deve rodar em `localhost:5173` ou você deve adicionar a nova origem no `SecurityConfig`.

### Unknown column / tabela estranha

Em prova, se puder apagar dados:

```sql
DROP DATABASE prova_base;
```

Reinicie a aplicação para o Hibernate recriar o esquema.

### Frontend não atualiza depois de salvar

Após POST/PUT/DELETE chame novamente a função que lista os dados.

---

## 21. Atalhos de adaptação

### Alterar uma palavra no projeto inteiro

VS Code:

```text
Ctrl + Shift + F
```

### Renomear símbolo Java/JS de forma segura

```text
F2
```

### Abrir terminal no VS Code

```text
Ctrl + `
```

### Backend

```bash
mvn spring-boot:run
```

### Frontend

```bash
npm run dev
```

### Build backend

```bash
mvn clean package
```

### Build frontend

```bash
npm run build
```

---

## 22. Regra mental para qualquer questão

Quando aparecer um requisito, pergunte:

```text
É dado persistido?       -> Entity + DTO
É consulta ao banco?     -> Repository
É regra de negócio?      -> Service
É URL da API?            -> Controller
É validação?             -> DTO + Bean Validation
É tela?                  -> Page/Component React
É chamada HTTP?          -> Axios
É indicador?             -> DashboardService + DashboardPage
É autenticação?          -> Security/JWT (já pronto)
```

Essa separação evita colocar tudo no Controller ou tudo dentro de um componente React e torna a adaptação muito mais rápida.
