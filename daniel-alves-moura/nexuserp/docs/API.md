# Referência rápida da API

Base URL: `http://localhost:8080/api`

Todas as rotas, exceto `/auth/**`, usam:

```http
Authorization: Bearer <JWT>
Content-Type: application/json
```

## Autenticação

### POST `/auth/login`

```json
{
  "email": "admin@nexuserp.com",
  "password": "Admin123!"
}
```

Retorna token JWT e os dados mínimos do usuário.

### POST `/auth/register`

Cria usuário com perfil `USER`.

```json
{
  "name": "Maria",
  "email": "maria@example.com",
  "password": "Senha123!"
}
```

## Clientes

- `GET /customers?q=&page=0&size=10&sort=name,asc`
- `GET /customers/{id}`
- `POST /customers`
- `PUT /customers/{id}`
- `DELETE /customers/{id}`

## Categorias

- `GET /categories`
- `POST /categories` — ADMIN
- `PUT /categories/{id}` — ADMIN
- `DELETE /categories/{id}` — ADMIN

## Produtos

- `GET /products?q=&page=0&size=10`
- `GET /products/{id}`
- `POST /products` — ADMIN
- `PUT /products/{id}` — ADMIN
- `DELETE /products/{id}` — ADMIN

Exemplo:

```json
{
  "sku": "MON-001",
  "name": "Monitor 27",
  "description": "IPS Full HD",
  "price": 1299.90,
  "stock": 12,
  "active": true,
  "categoryId": 1
}
```

## Pedidos

- `GET /orders?page=0&size=10`
- `GET /orders/{id}`
- `POST /orders`
- `PATCH /orders/{id}/status`

Status: `PENDING`, `PAID`, `PROCESSING`, `SHIPPED`, `COMPLETED`, `CANCELED`.

Ao criar um pedido, o estoque é baixado dentro de uma transação. Ao cancelar um pedido, o estoque é devolvido.

## Usuários

Somente ADMIN:

- `GET /users`
- `PATCH /users/{id}/active`

## Dashboard

`GET /dashboard` retorna contadores, receita, pedidos recentes e produtos com estoque baixo.

## Erros

Formato geral:

```json
{
  "timestamp": "2026-09-17T20:00:00",
  "status": 422,
  "error": "Unprocessable Entity",
  "message": "Dados inválidos",
  "path": "/api/products",
  "validationErrors": {
    "price": "must be greater than or equal to 0.01"
  }
}
```
