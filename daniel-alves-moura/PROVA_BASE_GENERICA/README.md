# PROVA BASE — Spring Boot + React + MySQL

Projeto propositalmente genérico para ser adaptado rapidamente durante uma prova prática.

## O que já vem pronto

- Login com JWT e Spring Security.
- Usuário inicial criado automaticamente.
- Entidade genérica `Registro`.
- CRUD completo: listar, buscar, criar, editar e excluir.
- Tabela React com filtros personalizados combináveis, ordenação e paginação.
- Formulário de inclusão/edição.
- Dashboard com indicadores.
- Bean Validation e tratamento global de erros.
- MySQL compatível com XAMPP.
- Axios com interceptor JWT.
- Rotas protegidas no React.
- Filtros dinâmicos com `JpaSpecificationExecutor` + `Specification`.
- Validação de faixa de valores e período de datas.


## Filtros personalizados prontos

A listagem aceita filtros opcionais e combináveis:

```text
GET /api/registros?
  busca=texto
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

No backend, a lógica fica em `specification/RegistroSpecifications.java`.
No frontend, o painel reutilizável fica em `components/RegistroFiltros.jsx`.
Veja `docs/ADAPTAR_NA_PROVA.md` para trocar os filtros conforme o domínio da questão.

## Credenciais

- E-mail: `admin@prova.com`
- Senha: `Admin123!`

## 1. MySQL / XAMPP

Inicie o MySQL pelo XAMPP. O backend usa por padrão:

```text
host: localhost
porta: 3306
banco: prova_base
usuário: root
senha: vazia
```

O banco é criado automaticamente por causa de `createDatabaseIfNotExist=true`.

## 2. Backend

```bash
cd backend
mvn spring-boot:run
```

API: `http://localhost:8080/api`

## 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Acesse: `http://localhost:5173`

## Estrutura

```text
backend/
  controller/   endpoints REST
  dto/          entrada e saída da API
  entity/       tabelas/entidades JPA
  repository/   acesso ao banco
  service/      regras de negócio
  security/     JWT e autenticação
  config/       Security/CORS/dados iniciais
  exception/    tratamento de erros

frontend/src/
  api/          Axios
  components/   Layout, formulário, rota protegida
  context/      autenticação global
  pages/        Login, Dashboard e CRUD
  styles/       CSS global
```

Leia `docs/ADAPTAR_NA_PROVA.md` antes da prova.
