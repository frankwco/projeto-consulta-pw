# Frontend com Create React App — sem Vite

Este frontend foi estruturado para o **Create React App (CRA)**.

## Criar a mesma base do zero

Com npm:

```bash
npm create react-app frontend
```

Ou usando a forma tradicional do pacote:

```bash
npx create-react-app frontend
```

Depois instale as bibliotecas usadas pela rede social:

```bash
cd frontend
npm install axios react-router-dom lucide-react
```

## Diferenças em relação a Vite

| CRA | Vite |
| --- | --- |
| `npm start` | `npm run dev` |
| `react-scripts` | `vite` |
| `public/index.html` | `index.html` na raiz |
| `src/index.js` | geralmente `src/main.jsx` |
| `REACT_APP_API_URL` | `VITE_API_URL` |
| `process.env.REACT_APP_API_URL` | `import.meta.env.VITE_API_URL` |
| build em `build/` | build em `dist/` |

## Executar

```bash
npm install
npm start
```

Abra:

```text
http://localhost:3000
```

## API

Arquivo `.env`:

```properties
REACT_APP_API_URL=http://localhost:8080/api
```

No código:

```javascript
const apiUrl = process.env.REACT_APP_API_URL;
```

O prefixo `REACT_APP_` é obrigatório para variáveis expostas pelo CRA ao código cliente.
