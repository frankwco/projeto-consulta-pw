# Arquitetura

```text
Create React App :3000
        ↓ Axios + JWT
Spring Security Filter Chain
        ↓
Controllers REST
        ↓
Services / Transactions
        ↓
Repositories / Specifications
        ↓
Hibernate / JPA
        ↓
MySQL :3306
```

## Domínios

- User: perfil e autenticação.
- Follow: relacionamento usuário → usuário.
- Post: publicação.
- PostLike: curtida única por usuário/post.
- Comment: comentários.

## Frontend CRA

Este projeto não usa Vite.

Características CRA presentes:

```text
public/index.html
src/index.js
react-scripts start
react-scripts build
REACT_APP_API_URL
```
