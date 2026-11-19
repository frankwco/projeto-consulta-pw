# ConectaSocial — Rede Social Full Stack

Projeto completo de rede social com backend Spring Boot e frontend React criado no estilo **Create React App**, sem Vite.

## Stack

### Backend
- Java 21
- Spring Boot 3.5.16
- Spring Web MVC
- Spring Data JPA / Hibernate
- Spring Security
- Bean Validation
- MySQL / XAMPP
- JWT com JJWT 0.13.0
- Swagger / OpenAPI com springdoc 2.9.1

### Frontend
- React 19
- Create React App / react-scripts
- React Router DOM
- Axios
- Lucide React
- CSS puro

> Create React App foi descontinuado oficialmente pelo React, mas este projeto usa CRA de propósito, conforme solicitado.

## Funcionalidades

- cadastro e login;
- autenticação JWT;
- perfis de usuário;
- editar perfil;
- busca de usuários;
- seguir e deixar de seguir;
- contadores de seguidores e seguindo;
- criar, editar e excluir posts;
- feed com posts próprios + pessoas seguidas;
- explorar posts públicos;
- busca/filtros de posts;
- curtir e descurtir posts;
- comentários;
- página de detalhe do post;
- dashboard administrativo (perfil ADMIN);
- tratamento global de exceptions;
- paginação;
- Swagger com autenticação Bearer;
- seed com usuários e posts de demonstração.

## Estrutura

```text
ConectaSocial_CRA/
├── backend/
├── frontend/
├── database/
├── docs/
├── start-backend.bat
├── start-frontend.bat
├── start-backend.sh
└── start-frontend.sh
```

## Banco de dados / XAMPP

Ligue o **MySQL** no XAMPP. Apache não é necessário.

Configuração padrão:

```text
Banco: conecta_social
Host: localhost
Porta: 3306
Usuário: root
Senha: vazia
```

Opcionalmente execute:

```text
database/create_database.sql
```

## Backend

```bash
cd backend
mvn spring-boot:run
```

API:

```text
http://localhost:8080
```

Swagger:

```text
http://localhost:8080/swagger-ui.html
```

## Frontend — Create React App

A estrutura deste frontend é a gerada pelo Create React App: `public/index.html`, `src/index.js`, `react-scripts` e variáveis `REACT_APP_*`.

Para criar um frontend equivalente do zero com npm:

```bash
npm create react-app frontend
```

O comando tradicional/documentado do CRA também é:

```bash
npx create-react-app frontend
```

Neste ZIP o frontend já está pronto. Basta:

```bash
cd frontend
npm install
npm start
```

Abra:

```text
http://localhost:3000
```

## Usuários iniciais

Administrador:

```text
E-mail: admin@conectasocial.com
Senha: Admin123!
```

Usuário comum:

```text
E-mail: ana@conectasocial.com
Senha: User123!
```

## Variáveis de ambiente

Backend:

```text
DB_USERNAME=root
DB_PASSWORD=
JWT_SECRET=...
FRONTEND_URL=http://localhost:3000
```

Frontend (`frontend/.env`):

```text
REACT_APP_API_URL=http://localhost:8080/api
```

## Principais endpoints

```text
POST   /api/auth/register
POST   /api/auth/login
GET    /api/users/me
PUT    /api/users/me
GET    /api/users/search?q=ana
GET    /api/users/{username}
POST   /api/users/{username}/follow
DELETE /api/users/{username}/follow
GET    /api/posts/feed
GET    /api/posts/explore
POST   /api/posts
GET    /api/posts/{id}
PUT    /api/posts/{id}
DELETE /api/posts/{id}
POST   /api/posts/{id}/like
DELETE /api/posts/{id}/like
GET    /api/posts/{id}/comments
POST   /api/posts/{id}/comments
DELETE /api/comments/{id}
GET    /api/dashboard
```

## Testes manuais

Abra:

```text
backend/http/conecta-social.http
```

com a extensão REST Client do VS Code.

## Observação sobre build neste ambiente

O projeto foi validado estaticamente. O ambiente usado para gerar o ZIP possui Java 21 e Node.js, porém não possui Maven instalado; por isso o build Maven completo não foi executado aqui.
