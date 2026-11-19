# Roteiro rápido de implementação

## Spring Security

1. Adicionar `spring-boot-starter-security`.
2. Criar `SecurityConfig` com um bean `SecurityFilterChain`.
3. Declarar primeiro as rotas específicas e terminar com `anyRequest()`.
4. Criar `PasswordEncoder` e `UserDetailsService`.
5. Configurar CORS para a origem exata do frontend.
6. Testar separadamente respostas `200`, `401` e `403`.

## WebSocket

1. Adicionar `spring-boot-starter-websocket`.
2. Criar handler estendendo `TextWebSocketHandler`.
3. Registrar o handler com `@EnableWebSocket` e `WebSocketConfigurer`.
4. Guardar/remover sessões de forma concorrente.
5. No React, criar `WebSocket` dentro do `useEffect` e chamar `close()` no cleanup.

## SSE

1. Criar endpoint com `produces = MediaType.TEXT_EVENT_STREAM_VALUE`.
2. Retornar um `SseEmitter` e guardar o emissor enquanto estiver conectado.
3. Remover emissores em `onCompletion`, `onTimeout` e falha de envio.
4. Enviar heartbeat para evitar conexões ociosas.
5. No React, criar `EventSource` dentro do `useEffect` e chamar `close()` no cleanup.

## Escolha rápida

| Necessidade | Tecnologia |
|---|---|
| Requisição e resposta comum | REST |
| Cliente e servidor enviam mensagens | WebSocket |
| Apenas o servidor envia atualizações | SSE |
| Restringir acesso e papéis | Spring Security |
