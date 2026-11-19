# NexusERP — Spring Boot + React + MySQL

Projeto full stack de referência para estudo, revisão e consulta durante prova.

## Stack

- Java 21
- Spring Boot 3.4.x
- Spring Security + JWT
- Spring Data JPA / Hibernate
- Bean Validation
- MySQL (compatível com XAMPP)
- React + Vite
- React Router
- Axios
- CSS responsivo sem framework obrigatório

## Módulos

- Autenticação JWT
- Perfis ADMIN / USER
- Dashboard com indicadores
- Usuários
- Clientes
- Categorias
- Produtos e estoque
- Pedidos e itens
- Cancelamento de pedido com devolução automática ao estoque
- Busca, paginação e filtros
- Validação de dados
- Tratamento global de exceções
- CORS
- Dados iniciais
- Auditoria simples (`createdAt` / `updatedAt`)

## 1. Banco com XAMPP

1. Abra o XAMPP.
2. Inicie **MySQL**.
3. Opcional: abra o phpMyAdmin e execute `database/create_database.sql`.
4. O backend também usa `createDatabaseIfNotExist=true`, então pode criar o banco automaticamente se o usuário tiver permissão.

Configuração padrão:

- host: `localhost`
- porta: `3306`
- banco: `nexuserp`
- usuário: `root`
- senha: vazia

Se seu MySQL tiver senha, altere `backend/src/main/resources/application.properties`.

## 2. Backend

Com Java 21 e Maven instalados:

```bash
cd backend
mvn spring-boot:run
```

No Windows, você também pode executar `start-backend.bat` na raiz.

API: `http://localhost:8080`

## 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

No Windows, você também pode executar `start-frontend.bat` na raiz.

Aplicação: `http://localhost:5173`

## Usuários iniciais

| Perfil | E-mail | Senha |
|---|---|---|
| ADMIN | admin@nexuserp.com | Admin123! |
| USER | user@nexuserp.com | User123! |

> Troque essas credenciais em uso real.

## Endpoints principais

- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/dashboard`
- `GET/POST/PUT/DELETE /api/customers`
- `GET/POST/PUT/DELETE /api/categories`
- `GET/POST/PUT/DELETE /api/products`
- `GET/POST /api/orders`
- `GET /api/orders/{id}`
- `PATCH /api/orders/{id}/status`
- `GET /api/users` (ADMIN)
- `PATCH /api/users/{id}/active` (ADMIN)

## Estrutura

```text
nexuserp/
├── backend/
│   └── src/main/java/br/com/nexuserp/
│       ├── config/
│       ├── controller/
│       ├── dto/
│       ├── entity/
│       ├── exception/
│       ├── repository/
│       ├── security/
│       └── service/
├── frontend/
│   └── src/
│       ├── api/
│       ├── components/
│       ├── context/
│       ├── hooks/
│       ├── pages/
│       └── styles/
└── database/
```

## Pontos úteis para prova

O projeto demonstra separação em camadas, DTOs, records Java, validação, relacionamentos JPA (`ManyToOne`, `OneToMany`), transação, consultas derivadas, JPQL, paginação, segurança stateless, filtros HTTP, tratamento centralizado de erro, Context API, rotas protegidas, interceptador Axios e formulários controlados.
