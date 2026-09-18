# Configurando Swagger no Spring Boot

Guia simples para adicionar **Swagger UI + OpenAPI** em um projeto com:

- Java 21
- Spring Boot 3.x
- Spring Web MVC
- Spring Security
- JWT

> Para Spring Boot 3.x, use a linha **springdoc-openapi 2.x**.  
> O exemplo abaixo usa `springdoc-openapi-starter-webmvc-ui`.

---

# 1. Adicionar a dependência

No `pom.xml`, dentro de `<dependencies>`:

```xml
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.9.1</version>
</dependency>
```

Depois atualize as dependências:

```bash
mvn clean install
```

Ou simplesmente inicie novamente:

```bash
mvn spring-boot:run
```

---

# 2. Testar o Swagger sem configuração extra

Com a aplicação rodando em:

```text
http://localhost:8080
```

abra:

```text
http://localhost:8080/swagger-ui.html
```

A especificação OpenAPI em JSON fica em:

```text
http://localhost:8080/v3/api-docs
```

E em YAML:

```text
http://localhost:8080/v3/api-docs.yaml
```

Se o projeto **não usa Spring Security**, normalmente isso já basta.

---

# 3. Liberar Swagger no Spring Security

Se seu projeto usa Spring Security/JWT, o Swagger pode retornar:

```text
401 Unauthorized
```

ou:

```text
403 Forbidden
```

Nesse caso, libere as rotas do Swagger no `SecurityConfig`.

Exemplo:

```java
@Bean
SecurityFilterChain securityFilterChain(
        HttpSecurity http,
        JwtAuthenticationFilter jwtFilter,
        AuthenticationProvider provider,
        CorsConfigurationSource corsSource)
        throws Exception {

    return http
        .csrf(csrf -> csrf.disable())

        .cors(cors ->
            cors.configurationSource(corsSource)
        )

        .sessionManagement(session ->
            session.sessionCreationPolicy(
                SessionCreationPolicy.STATELESS
            )
        )

        .authenticationProvider(provider)

        .authorizeHttpRequests(auth -> auth

            // Swagger / OpenAPI
            .requestMatchers(
                "/swagger-ui/**",
                "/swagger-ui.html",
                "/v3/api-docs/**"
            )
            .permitAll()

            // Login
            .requestMatchers("/api/auth/**")
            .permitAll()

            // Restante da API
            .anyRequest()
            .authenticated()
        )

        .addFilterBefore(
            jwtFilter,
            UsernamePasswordAuthenticationFilter.class
        )

        .build();
}
```

A parte importante é:

```java
.requestMatchers(
    "/swagger-ui/**",
    "/swagger-ui.html",
    "/v3/api-docs/**"
)
.permitAll()
```

---

# 4. Criar configuração básica do OpenAPI

Crie:

```text
config/OpenApiConfig.java
```

Exemplo:

```java
package com.exemplo.projetobase.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
    info = @Info(
        title = "Projeto Base API",
        version = "1.0",
        description = "API REST do projeto base"
    )
)
public class OpenApiConfig {
}
```

Agora o Swagger mostrará:

```text
Projeto Base API
versão 1.0
```

---

# 5. Configurar Swagger para JWT

Se sua API usa:

```http
Authorization: Bearer TOKEN
```

configure um esquema de segurança.

Altere `OpenApiConfig.java`:

```java
package com.exemplo.projetobase.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
    info = @Info(
        title = "Projeto Base API",
        version = "1.0",
        description = "API REST com autenticação JWT"
    )
)
@SecurityScheme(
    name = "bearerAuth",
    type = SecuritySchemeType.HTTP,
    scheme = "bearer",
    bearerFormat = "JWT"
)
public class OpenApiConfig {
}
```

A parte responsável pelo JWT é:

```java
@SecurityScheme(
    name = "bearerAuth",
    type = SecuritySchemeType.HTTP,
    scheme = "bearer",
    bearerFormat = "JWT"
)
```

---

# 6. Marcar um Controller como protegido

Em um controller protegido:

```java
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@RestController
@RequestMapping("/api/registros")
@SecurityRequirement(name = "bearerAuth")
public class RegistroController {

}
```

Agora o Swagger sabe que os endpoints desse controller precisam de JWT.

---

# 7. Usar o botão Authorize

Abra:

```text
http://localhost:8080/swagger-ui.html
```

Depois:

1. Faça login em:

```text
POST /api/auth/login
```

2. Copie o token retornado.

Exemplo:

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "tipo": "Bearer",
  "email": "admin@prova.com"
}
```

3. Clique no botão:

```text
Authorize
```

4. Cole **somente o token**:

```text
eyJhbGciOiJIUzI1NiJ9...
```

Normalmente não é necessário digitar:

```text
Bearer eyJ...
```

porque o Swagger já sabe que o esquema é `bearer`.

Depois clique:

```text
Authorize
```

A partir daí o Swagger enviará:

```http
Authorization: Bearer eyJ...
```

nas rotas protegidas.

---

# 8. Documentar um Controller

Você pode deixar o Swagger inferir quase tudo automaticamente.

Mas pode adicionar descrições.

Exemplo:

```java
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/registros")
@Tag(
    name = "Registros",
    description = "CRUD de registros"
)
@SecurityRequirement(name = "bearerAuth")
public class RegistroController {

    @Operation(
        summary = "Lista registros",
        description = "Lista registros com filtros e paginação"
    )
    @GetMapping
    public Page<RegistroResponse> listar(...) {
        // ...
    }
}
```

---

# 9. Documentar um endpoint

Exemplo:

```java
@Operation(
    summary = "Buscar registro",
    description = "Busca um registro pelo ID"
)
@GetMapping("/{id}")
public RegistroResponse buscar(
        @PathVariable Long id) {

    return service.buscar(id);
}
```

---

# 10. Documentar POST

```java
@Operation(
    summary = "Criar registro",
    description = "Cadastra um novo registro"
)
@PostMapping
public ResponseEntity<RegistroResponse> criar(
        @Valid
        @RequestBody
        RegistroRequest request) {

    return ResponseEntity
        .status(HttpStatus.CREATED)
        .body(service.criar(request));
}
```

---

# 11. Documentar parâmetros

Exemplo:

```java
import io.swagger.v3.oas.annotations.Parameter;

@GetMapping("/{id}")
public RegistroResponse buscar(

        @Parameter(
            description = "ID do registro",
            example = "10"
        )
        @PathVariable
        Long id) {

    return service.buscar(id);
}
```

---

# 12. Documentar DTO

Também é possível documentar campos.

Exemplo:

```java
import io.swagger.v3.oas.annotations.media.Schema;

public record RegistroRequest(

    @Schema(
        description = "Nome do registro",
        example = "Notebook"
    )
    String nome,

    @Schema(
        description = "Categoria",
        example = "Hardware"
    )
    String categoria,

    @Schema(
        description = "Valor",
        example = "3500.00"
    )
    BigDecimal valor

) {}
```

---

# 13. Documentar respostas HTTP

Exemplo:

```java
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

@ApiResponses({

    @ApiResponse(
        responseCode = "200",
        description = "Registro encontrado"
    ),

    @ApiResponse(
        responseCode = "404",
        description = "Registro não encontrado"
    ),

    @ApiResponse(
        responseCode = "401",
        description = "Não autenticado"
    )
})
@GetMapping("/{id}")
public RegistroResponse buscar(
        @PathVariable Long id) {

    return service.buscar(id);
}
```

---

# 14. Configuração opcional no application.properties

Você pode mudar o endereço do Swagger.

```properties
springdoc.swagger-ui.path=/swagger
```

Então ele poderá ser acessado em:

```text
http://localhost:8080/swagger
```

Também é possível mudar o JSON OpenAPI:

```properties
springdoc.api-docs.path=/api-docs
```

Então:

```text
http://localhost:8080/api-docs
```

Se fizer isso e usar Spring Security, lembre-se de liberar os novos caminhos.

Exemplo:

```java
.requestMatchers(
    "/swagger/**",
    "/api-docs/**"
)
.permitAll()
```

---

# 15. Configuração recomendada para o projeto base

## pom.xml

```xml
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.9.1</version>
</dependency>
```

## SecurityConfig

```java
.requestMatchers(
    "/api/auth/**",
    "/swagger-ui/**",
    "/swagger-ui.html",
    "/v3/api-docs/**"
)
.permitAll()
```

## OpenApiConfig

```java
@Configuration
@OpenAPIDefinition(
    info = @Info(
        title = "Projeto Base API",
        version = "1.0"
    )
)
@SecurityScheme(
    name = "bearerAuth",
    type = SecuritySchemeType.HTTP,
    scheme = "bearer",
    bearerFormat = "JWT"
)
public class OpenApiConfig {
}
```

## Controllers protegidos

```java
@RestController
@RequestMapping("/api/registros")
@SecurityRequirement(name = "bearerAuth")
public class RegistroController {
}
```

---

# 16. Fluxo completo

```text
Spring Boot inicia
        ↓
springdoc analisa Controllers
        ↓
gera OpenAPI
        ↓
/v3/api-docs
        ↓
Swagger UI
        ↓
/swagger-ui.html
        ↓
Login
        ↓
JWT
        ↓
Authorize
        ↓
Authorization: Bearer TOKEN
        ↓
testar GET / POST / PUT / DELETE
```

---

# 17. Erros comuns

## Swagger retorna 401

Provável causa:

```text
Swagger não foi liberado no SecurityConfig.
```

Confira:

```java
"/swagger-ui/**",
"/swagger-ui.html",
"/v3/api-docs/**"
```

---

## Swagger abre, mas não carrega os endpoints

Teste diretamente:

```text
http://localhost:8080/v3/api-docs
```

Se esse endereço falhar, o problema está na geração do OpenAPI.

---

## Endpoints protegidos retornam 401 no Swagger

Clique:

```text
Authorize
```

e forneça um JWT válido.

---

## Botão Authorize não aparece

Confira se existe:

```java
@SecurityScheme(
    name = "bearerAuth",
    type = SecuritySchemeType.HTTP,
    scheme = "bearer",
    bearerFormat = "JWT"
)
```

---

## Controller não mostra cadeado

Adicione:

```java
@SecurityRequirement(
    name = "bearerAuth"
)
```

---

## Dependência não funciona

Confira a versão do Spring Boot:

```xml
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>3.x.x</version>
</parent>
```

Para Spring Boot 3.x, use `springdoc-openapi` da linha 2.x.

Não misture:

```text
Spring Boot 3
+
springdoc 3.x
```

porque `springdoc-openapi 3.x` é a linha voltada ao Spring Boot 4.

---

# 18. Checklist

```text
[ ] dependência springdoc adicionada
[ ] Maven atualizou as dependências
[ ] aplicação inicia
[ ] /v3/api-docs funciona
[ ] /swagger-ui.html abre
[ ] rotas Swagger estão permitAll()
[ ] SecurityScheme JWT criado
[ ] controllers protegidos possuem SecurityRequirement
[ ] login gera token
[ ] botão Authorize funciona
[ ] GET funciona pelo Swagger
[ ] POST funciona pelo Swagger
[ ] PUT funciona pelo Swagger
[ ] DELETE funciona pelo Swagger
```

---

# Resumo mínimo para a prova

## 1. Dependência

```xml
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.9.1</version>
</dependency>
```

## 2. Liberar no Security

```java
.requestMatchers(
    "/swagger-ui/**",
    "/swagger-ui.html",
    "/v3/api-docs/**"
)
.permitAll()
```

## 3. JWT

```java
@SecurityScheme(
    name = "bearerAuth",
    type = SecuritySchemeType.HTTP,
    scheme = "bearer",
    bearerFormat = "JWT"
)
```

## 4. Controller protegido

```java
@SecurityRequirement(
    name = "bearerAuth"
)
```

## 5. Abrir

```text
http://localhost:8080/swagger-ui.html
```
