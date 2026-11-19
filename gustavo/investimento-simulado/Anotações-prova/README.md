# Anotações para a prova

Esta pasta centraliza os materiais de consulta criados durante a preparação do projeto. Os códigos executáveis continuam separados das anotações.

## Conteúdo

### Segurança e comunicação em tempo real

- [`segurança/README.md`](./segurança/README.md): explicação completa de Spring Security, autenticação, autorização, CORS, WebSocket e Server-Sent Events.
- [`segurança/roteiro-prova.md`](./segurança/roteiro-prova.md): checklist curto com a ordem de implementação de cada recurso.

### Componentes genéricos React

- [`componentes-genericos/README.md`](./componentes-genericos/README.md): visão geral da biblioteca.
- [`componentes-genericos/typescript-html/README.md`](./componentes-genericos/typescript-html/README.md): componentes com TypeScript e TSX.
- [`componentes-genericos/javascript-html/README.md`](./componentes-genericos/javascript-html/README.md): componentes com JavaScript e JSX.

## Onde está o código

| Assunto | Implementação |
|---|---|
| Frontend React | `src/` |
| Backend Spring | `backend/src/main/` |
| Componentes TypeScript | `componentes-genericos/typescript-html/` |
| Componentes JavaScript | `componentes-genericos/javascript-html/` |

## Ordem sugerida de estudo

1. Revisar o roteiro rápido de segurança.
2. Ler o fluxo completo de autenticação e autorização.
3. Comparar REST, WebSocket e SSE.
4. Praticar a criação e importação dos componentes genéricos.
5. Executar o projeto e observar as respostas `200`, `401` e `403`.
