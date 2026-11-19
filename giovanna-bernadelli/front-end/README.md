# 🔐 Variáveis de ambiente — `.env`

O arquivo **`.env`** é utilizado para armazenar variáveis de ambiente que podem mudar dependendo da configuração do projeto.

Por exemplo asdasa2, em vez de colocar diretamente a URL da API no código:

```jsx
axios.get("http://localhost:8080/api/livros");
```

podemos armazená-la em uma variável de ambiente.

## Criando o `.env`

Dentro da pasta `front-end`, crie um arquivo chamado:

```text
.env
```

No **Create React App**, as variáveis que precisam estar disponíveis no código React devem começar com `REACT_APP_`.

Exemplo:

```env
REACT_APP_API_URL=http://localhost:8080
```

Depois, podemos utilizar a variável no código:

```jsx
import axios from "axios";

axios.get(`${process.env.REACT_APP_API_URL}/api/livros`);
```

Assim, se a URL do Back-end mudar, não é necessário alterar vários arquivos do projeto.

## ⚠️ Não envie o `.env` para o Git

Adicione o `.env` ao arquivo `.gitignore`:

```gitignore
.env
```

Dessa forma, o arquivo não será enviado para o repositório.

É recomendado criar um arquivo:

```text
.env.example
```

com as variáveis necessárias, mas sem informações privadas:

```env
REACT_APP_API_URL=http://localhost:8080
```

Cada pessoa que clonar o projeto poderá criar seu próprio `.env` baseado no `.env.example`.

> **Importante:** variáveis de ambiente do React **não são um local seguro para guardar senhas, tokens privados ou chaves secretas**. Essas informações podem acabar sendo disponibilizadas no navegador. Segredos devem permanecer no Back-end.



DEPENDENCIAS DO SPRING : web, data, lombok, driver banco, dev tools, validation.

