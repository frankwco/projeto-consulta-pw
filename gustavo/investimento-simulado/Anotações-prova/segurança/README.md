# Guia de implementação de segurança com Spring Security e React

Este guia explica como a segurança foi construída no projeto, por que cada arquivo existe e como reproduzir a estrutura durante a prova.

> A implementação executável está em `backend/src/main` e `src`. As credenciais deste documento são apenas para estudo.

## 1. Conceitos que precisam estar claros

### Autenticação

Autenticação responde: **quem é o usuário?**

Neste projeto, o usuário envia nome e senha usando HTTP Basic. O Spring Security procura esse usuário no `UserDetailsService` e compara a senha usando o `PasswordEncoder`.

### Autorização

Autorização responde: **o usuário autenticado pode executar esta operação?**

- `aluno` possui `ROLE_USER` e pode calcular/salvar;
- `admin` possui `ROLE_USER` e `ROLE_ADMIN`, portanto também pode excluir os registros.

### Fluxo de uma requisição protegida

```text
React
  │
  │ Authorization: Basic usuario:senha
  ▼
Spring SecurityFilterChain
  │
  ├── autentica o usuário
  ├── verifica a rota, o método HTTP e o papel
  ├── permitido ──► Controller ──► Service ──► Repository
  └── negado ─────► resposta 401 ou 403
```

O controller não precisa conferir senha manualmente. Ele só é executado depois que a cadeia de filtros autoriza a requisição.

## 2. Dependência necessária

No `backend/pom.xml`, adicione:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
```

Depois que essa dependência é adicionada, o Spring protege as requisições por padrão. Para definir regras próprias, crie um bean `SecurityFilterChain`.

## 3. Criando o arquivo `SecurityConfig`

Local usado neste projeto:

```text
backend/src/main/java/com/prova/demo/config/SecurityConfig.java
```

```java
@Configuration
public class SecurityConfig {
    // Beans de segurança ficam aqui.
}
```

`@Configuration` informa que a classe declara configurações e beans administrados pelo Spring.

### 3.1 Criando a cadeia de filtros

```java
@Bean
SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .cors(Customizer.withDefaults())
        .csrf(csrf -> csrf.disable())
        .sessionManagement(session ->
            session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(authorize -> authorize
            .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
            .requestMatchers("/ws/**", "/api/eventos/**").permitAll()
            .requestMatchers(HttpMethod.GET, "/main/**").permitAll()
            .requestMatchers(HttpMethod.DELETE, "/main/**").hasRole("ADMIN")
            .requestMatchers(HttpMethod.POST, "/main/**").hasRole("USER")
            .requestMatchers("/api/seguranca/**").authenticated()
            .anyRequest().permitAll())
        .httpBasic(Customizer.withDefaults());

    return http.build();
}
```

O que cada parte faz:

| Configuração | Função |
|---|---|
| `cors(...)` | Permite integrar o React da porta `5173` com o backend da porta `8081`. |
| `csrf(...disable())` | Desabilita CSRF neste exemplo stateless com header HTTP Basic. |
| `STATELESS` | Não cria sessão; cada requisição precisa trazer a autenticação. |
| `authorizeHttpRequests` | Define as regras de autorização. |
| `permitAll()` | Não exige login para a rota. |
| `authenticated()` | Aceita qualquer usuário autenticado. |
| `hasRole("USER")` | Exige a autoridade `ROLE_USER`. |
| `hasRole("ADMIN")` | Exige a autoridade `ROLE_ADMIN`. |
| `httpBasic(...)` | Ativa a leitura do header HTTP Basic. |
| `http.build()` | Constrói a cadeia de filtros da aplicação. |

### A ordem das regras importa

O Spring testa as regras na ordem declarada. Coloque as rotas mais específicas antes de `anyRequest()`.

Este exemplo separa também por método HTTP:

```java
.requestMatchers(HttpMethod.GET, "/main/**").permitAll()
.requestMatchers(HttpMethod.DELETE, "/main/**").hasRole("ADMIN")
.requestMatchers(HttpMethod.POST, "/main/**").hasRole("USER")
```

Assim, a mesma URL pode ser pública para leitura e protegida para alteração.

Se a prova pedir que **toda a aplicação** seja protegida, troque:

```java
.anyRequest().permitAll()
```

por:

```java
.anyRequest().authenticated()
```

### Quando não desabilitar CSRF

Neste projeto, o frontend adiciona manualmente o header de autenticação e o backend não mantém sessão. Por isso, o exemplo desabilita CSRF para simplificar a API.

Se a aplicação autenticar com cookie ou sessão, mantenha CSRF habilitado e envie o token CSRF nas operações `POST`, `PUT`, `PATCH` e `DELETE`.

## 4. Protegendo as senhas com `PasswordEncoder`

Nunca compare nem armazene senhas em texto puro. Declare um codificador:

```java
@Bean
PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
}
```

O BCrypt gera um hash diferente mesmo quando duas pessoas usam a mesma senha, porque utiliza um valor aleatório chamado *salt*.

```text
Cadastro: senha digitada ──► passwordEncoder.encode(...) ──► hash salvo
Login:    senha digitada ──► passwordEncoder.matches(...) ──► true/false
```

Não tente descriptografar um hash. O Spring Security usa `matches` para comparar a senha recebida com o hash armazenado.

## 5. Criando usuários em memória

Para uma prova simples, `InMemoryUserDetailsManager` evita criar tabela de usuários:

```java
@Bean
UserDetailsService userDetailsService(PasswordEncoder passwordEncoder) {
    UserDetails aluno = User.builder()
        .username("aluno")
        .password(passwordEncoder.encode("prova123"))
        .roles("USER")
        .build();

    UserDetails administrador = User.builder()
        .username("admin")
        .password(passwordEncoder.encode("admin123"))
        .roles("USER", "ADMIN")
        .build();

    return new InMemoryUserDetailsManager(aluno, administrador);
}
```

Usuários deste projeto:

| Usuário | Senha | Papéis | Operações |
|---|---|---|---|
| `aluno` | `prova123` | `ROLE_USER` | Calcular e salvar |
| `admin` | `admin123` | `ROLE_USER`, `ROLE_ADMIN` | Calcular, salvar e limpar |

### `roles` ou `authorities`?

Ao escrever `.roles("ADMIN")`, o Spring cria a autoridade `ROLE_ADMIN`. Por isso, confira com `.hasRole("ADMIN")`.

Não escreva `.roles("ROLE_ADMIN")`, pois o prefixo já é adicionado automaticamente.

Quando usar `.authorities("CALCULO_EXCLUIR")`, confira com `.hasAuthority("CALCULO_EXCLUIR")`.

## 6. Configurando CORS

O React executa em `http://localhost:5173` e o Spring em `http://localhost:8081`. Como as origens são diferentes, o navegador exige uma política CORS.

```java
@Bean
CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(List.of("http://localhost:5173"));
    configuration.setAllowedMethods(
        List.of("GET", "POST", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(
        List.of("Authorization", "Content-Type"));

    UrlBasedCorsConfigurationSource source =
        new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
}
```

Pontos importantes:

- `Authorization` precisa estar em `allowedHeaders`, pois contém as credenciais;
- `OPTIONS` permite a requisição de verificação (*preflight*) do navegador;
- em produção, informe origens exatas e evite liberar `*` sem necessidade;
- CORS não autentica usuários: ele apenas controla chamadas feitas pelo navegador.

## 7. Criando um endpoint para validar o login

O endpoint recebe o objeto `Authentication` já preenchido pelo Spring Security:

```java
@RestController
@RequestMapping("/api/seguranca")
public class SegurancaController {

    @GetMapping("/usuario-atual")
    public UsuarioAutenticado usuarioAtual(Authentication authentication) {
        List<String> permissoes = authentication.getAuthorities().stream()
            .map(authority -> authority.getAuthority())
            .toList();

        return new UsuarioAutenticado(
            authentication.getName(), permissoes);
    }

    public record UsuarioAutenticado(
        String usuario,
        List<String> permissoes
    ) {}
}
```

Esse endpoint não confere senha. A senha já foi validada pela cadeia de filtros antes de o controller ser executado.

A regra responsável por protegê-lo é:

```java
.requestMatchers("/api/seguranca/**").authenticated()
```

## 8. Enviando HTTP Basic pelo React

HTTP Basic utiliza o formato:

```text
Authorization: Basic base64(usuario:senha)
```

Base64 **não é criptografia**. Use HTTPS em aplicações reais.

No projeto, `src/services/apiClient.ts` mantém a credencial apenas na memória:

```ts
let authorization: string | null = null;

export function definirCredenciaisBasicas(usuario: string, senha: string) {
  authorization = `Basic ${btoa(`${usuario}:${senha}`)}`;
}

export function limparCredenciais() {
  authorization = null;
}
```

Manter a senha somente em memória significa que ela desaparece quando a página é recarregada. Para este exercício isso é intencional e evita gravá-la no `localStorage`.

### Criando um `fetch` centralizado

```ts
export async function apiFetch(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);

  if (authorization) {
    headers.set("Authorization", authorization);
  }

  const response = await fetch(`http://localhost:8081${path}`, {
    ...init,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Faça login antes de executar esta operação.");
    }

    if (response.status === 403) {
      throw new Error("Seu usuário não possui permissão.");
    }

    throw new Error(`Erro do servidor (${response.status}).`);
  }

  return response;
}
```

Centralizar o `fetch` evita repetir o header de autenticação em cada service.

### Serviço de login

```ts
export async function autenticar(usuario: string, senha: string) {
  definirCredenciaisBasicas(usuario, senha);

  try {
    const response = await apiFetch("/api/seguranca/usuario-atual");
    return response.json();
  } catch (error) {
    limparCredenciais();
    throw error;
  }
}
```

O login funciona assim:

1. o frontend monta temporariamente o header;
2. chama o endpoint protegido;
3. se receber `200`, mantém a credencial em memória;
4. se receber `401`, remove a credencial e apresenta o erro.

## 9. Usando a segurança nos services existentes

Depois de criar `apiFetch`, substitua chamadas diretas:

```ts
// Antes
fetch("http://localhost:8081/main", configuracao);

// Depois
apiFetch("/main", configuracao);
```

O service não precisa saber qual papel é necessário. A regra fica no backend, que é o único lugar confiável para autorização.

Nunca esconda apenas o botão no React e considere isso segurança. Um usuário poderia chamar o endpoint diretamente. O botão pode ser escondido por usabilidade, mas o backend deve sempre validar a permissão.

## 10. Entendendo os códigos de resposta

| Código | Significado neste projeto | Causa provável |
|---|---|---|
| `200` | Requisição executada | Usuário e permissão válidos |
| `201` | Registro criado | Cálculo salvo |
| `204` | Operação concluída sem corpo | Registros apagados |
| `400` | Dados inválidos | JSON ou validação incorreta |
| `401` | Não autenticado | Credencial ausente ou senha errada |
| `403` | Autenticado sem permissão | `aluno` tentando usar uma rota de `ADMIN` |
| `500` | Erro interno | Exceção no backend |

```text
401 = não provou quem é
403 = provou quem é, mas não pode fazer isso
```

## 11. Como testar a implementação

### Pelo projeto

1. Inicie backend e frontend.
2. Abra a página de cálculo.
3. Tente calcular sem login: deve aparecer erro de autenticação.
4. Entre com `aluno / prova123` e salve um cálculo.
5. Tente limpar a tabela como `aluno`: deve retornar `403`.
6. Entre com `admin / admin123` e limpe a tabela.

### Com `curl`

Ver o usuário autenticado:

```bash
curl -u aluno:prova123 http://localhost:8081/api/seguranca/usuario-atual
```

Tentar acessar sem credenciais:

```bash
curl -i http://localhost:8081/api/seguranca/usuario-atual
```

Tentar excluir como `aluno` - deve retornar `403`:

```bash
curl -i -u aluno:prova123 -X DELETE http://localhost:8081/main
```

Excluir como `admin` - deve retornar `204`:

```bash
curl -i -u admin:admin123 -X DELETE http://localhost:8081/main
```

## 12. Como trocar usuários em memória por banco de dados

Em um projeto real, o caminho comum é:

```text
UsuarioEntity ──► UsuarioRepository ──► UserDetailsService ──► Spring Security
```

Exemplo simplificado:

```java
@Service
public class UsuarioDetailsService implements UserDetailsService {

    private final UsuarioRepository repository;

    public UsuarioDetailsService(UsuarioRepository repository) {
        this.repository = repository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) {
        Usuario usuario = repository.findByUsername(username)
            .orElseThrow(() ->
                new UsernameNotFoundException("Usuário não encontrado"));

        return User.builder()
            .username(usuario.getUsername())
            .password(usuario.getSenha()) // Hash BCrypt vindo do banco.
            .roles(usuario.getPerfil())
            .build();
    }
}
```

No cadastro, salve a senha codificada:

```java
usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
repository.save(usuario);
```

Nunca aplique `encode` novamente durante o login. O Spring fará a comparação do texto digitado com o hash do banco.

## 13. Onde entram JWT e sessão

Este projeto usa HTTP Basic por ser pequeno e fácil de estudar.

| Estratégia | Funcionamento | Uso comum |
|---|---|---|
| HTTP Basic | Usuário e senha acompanham cada requisição | Exercícios e integrações simples sob HTTPS |
| Sessão | Servidor guarda o login e o navegador envia cookie | Aplicações web tradicionais |
| JWT | Cliente envia um token assinado | APIs distribuídas, quando necessário |

JWT não substitui autorização, HTTPS, validação ou expiração. Mesmo com JWT, ainda é necessário configurar as permissões das rotas.

## 14. Segurança de WebSocket e SSE

No projeto didático, `/ws/**` e `/api/eventos/**` estão públicos para facilitar o teste no navegador. O WebSocket restringe a origem a `http://localhost:5173`.

```java
registry.addHandler(notificacaoHandler, "/ws/notificacoes")
    .setAllowedOrigins("http://localhost:5173");
```

Restringir origem não substitui autenticação. Se os eventos carregarem dados privados:

- autentique o handshake WebSocket com sessão/cookie ou token de curta duração;
- proteja o endpoint SSE;
- envie somente eventos que o usuário conectado pode visualizar;
- não coloque senhas ou tokens duradouros em query strings;
- use `wss://` e `https://` em produção.

## 15. Problemas comuns

### Sempre retorna `401`

Confira:

- se `.httpBasic(...)` foi configurado;
- se o header `Authorization` está sendo enviado;
- se usuário e senha estão corretos;
- se a senha cadastrada foi codificada pelo mesmo `PasswordEncoder`.

### Login funciona, mas retorna `403`

O usuário foi autenticado, porém não tem o papel exigido. Verifique `roles(...)`, `hasRole(...)` e o prefixo automático `ROLE_`.

### Erro de CORS no navegador

Confira:

- endereço e porta exatos do frontend;
- método HTTP em `allowedMethods`;
- `Authorization` e `Content-Type` em `allowedHeaders`;
- se `cors(Customizer.withDefaults())` foi habilitado no filtro.

### POST e DELETE retornam `403` mesmo com login

Se estiver usando autenticação por sessão/cookie, pode ser CSRF. Não desabilite automaticamente: obtenha o token e envie no frontend. Neste projeto stateless com header manual, CSRF foi desabilitado intencionalmente.

### A senha salva no banco muda a cada execução

O BCrypt usa salt, então hashes diferentes para a mesma senha são normais. Use `passwordEncoder.matches`, não compare as strings dos hashes.

## 16. Arquivos desta implementação

| Arquivo | Responsabilidade |
|---|---|
| `backend/pom.xml` | Dependência `spring-boot-starter-security` |
| `backend/.../config/SecurityConfig.java` | Filtros, rotas, usuários, BCrypt e CORS |
| `backend/.../controller/SegurancaController.java` | Identidade e papéis do usuário autenticado |
| `src/services/apiClient.ts` | Header de autenticação e erros HTTP |
| `src/services/segurancaService.ts` | Login e remoção das credenciais |
| `src/components/SecurityPanel.tsx` | Interface de login e logout |
| `src/services/calculoService.ts` | Usa `apiFetch` nas operações do projeto |

## 17. Checklist para a prova

- [ ] Adicionei `spring-boot-starter-security`.
- [ ] Criei `SecurityConfig` com `SecurityFilterChain`.
- [ ] Ativei o método de autenticação, como HTTP Basic.
- [ ] Configurei `PasswordEncoder`.
- [ ] Criei `UserDetailsService`.
- [ ] Organizei regras públicas, autenticadas e por papel.
- [ ] Coloquei regras específicas antes de `anyRequest()`.
- [ ] Configurei CORS para a origem do frontend.
- [ ] Decidi conscientemente como tratar CSRF.
- [ ] Centralizei o header de autenticação no frontend.
- [ ] Tratei `401` e `403` separadamente.
- [ ] Testei usuário comum e administrador.
- [ ] Confirmei que o backend protege a rota mesmo sem o botão do frontend.

## Referências oficiais

- Spring Security - configuração Java: <https://docs.spring.io/spring-security/reference/servlet/configuration/java.html>
- Spring Security - autorização HTTP: <https://docs.spring.io/spring-security/reference/servlet/authorization/authorize-http-requests.html>
- Spring Security - HTTP Basic: <https://docs.spring.io/spring-security/reference/servlet/authentication/passwords/basic.html>
- Spring Security - CORS: <https://docs.spring.io/spring-security/reference/servlet/integrations/cors.html>
- Spring Security - CSRF: <https://docs.spring.io/spring-security/reference/servlet/exploits/csrf.html>
