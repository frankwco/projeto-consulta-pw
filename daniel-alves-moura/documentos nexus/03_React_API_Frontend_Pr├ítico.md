# React + API — Frontend na Prática

Guia de React, Vite, Axios, autenticação, rotas, formulários e integração com Spring

**Projeto de referência:** NexusERP

Java 21 • Spring Boot 3.4.5 • React 19 • Vite • MySQL/XAMPP

| Objetivo: consulta rápida durante a prova, com teoria suficiente para entender e exemplos práticos para adaptar. |
| --- |

## Índice alfabético para consulta rápida

Procure pelo termo que apareceu na questão e vá direto à seção indicada. Os números de seção são estáveis e facilitam a busca no Markdown/GitHub.

| Termo | Seção | Lembrete rápido |
| --- | --- | --- |
| API | 8 | Axios chama o Spring em /api e recebe JSON. |
| Axios | 8 | Instância central com baseURL e interceptors. |
| BrowserRouter | 4 | Habilita navegação client-side. |
| Build | 12 | npm run build gera dist. |
| Component | 2 | Função que retorna JSX. |
| Context API | 6 | Estado global de autenticação. |
| CORS | 9 | Permissão deve existir no backend para origem do Vite. |
| Debounce | 11.4 | Evita requisição por tecla. |
| Environment | 3.3 | VITE_API_URL configura base da API. |
| Formulário controlado | 10 | input value ligado a state. |
| Interceptor | 8.2 | Insere JWT e trata 401. |
| JSX | 2.1 | Sintaxe declarativa para UI. |
| JWT | 6.2 | Salvo no localStorage e enviado em Authorization. |
| localStorage | 6.3 | Persiste sessão entre reloads. |
| Navigate | 5 | Redirecionamento declarativo. |
| Network | 13 | DevTools do navegador para diagnosticar API. |
| Outlet | 4.3 | Ponto em que rota filha é renderizada. |
| Pagination | 11 | Navega Page retornada pelo Spring. |
| Props | 2.3 | Dados recebidos por componente. |
| ProtectedRoute | 5 | Bloqueia telas sem usuário. |
| React Router | 4 | Mapeamento URL → componente. |
| State | 2.2 | Dados que mudam e provocam renderização. |
| useContext | 6 | Acessa AuthContext. |
| useEffect | 7 | Efeito após render, usado para carregar API. |
| useMemo | 11.3 | Memoriza cálculo como total. |
| useParams | 4.4 | Lê :id da rota. |
| Vite | 3 | Servidor de desenvolvimento e build. |
| XAMPP Apache | 12.3 | Opcional para hospedar dist; exige fallback SPA. |

## 1. Arquitetura do frontend NexusERP

O frontend é uma Single Page Application. O navegador baixa o JavaScript do React; a navegação entre telas é feita pelo React Router sem recarregar documentos HTML inteiros. Os dados vêm do Spring via HTTP/JSON.

```text
src/
├─ api/client.js
├─ components/
├─ context/AuthContext.jsx
├─ hooks/useDebounce.js
├─ pages/
├─ styles/global.css
├─ App.jsx
└─ main.jsx
```

## 2. Fundamentos de React usados no projeto

### 2.1 Componente e JSX

```jsx
export default function Pagination({ page, totalPages, onChange }) {
  if (!totalPages || totalPages <= 1) return null;
  return (
    <div className="pagination">
      <button disabled={page === 0} onClick={() => onChange(page - 1)}>Anterior</button>
      <span>Página {page + 1} de {totalPages}</span>
    </div>
  );
}
```

O componente é uma função. Props entram como argumento. JSX parece HTML, mas é sintaxe JavaScript transformada pelo build. Eventos usam camelCase, como onClick.

### 2.2 State

```jsx
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');
```

Não altere state diretamente. Chame o setter. React agenda nova renderização com o valor atualizado.

### 2.3 Props

Pagination recebe page, totalPages e onChange. O pai é dono do estado da página; o filho apenas exibe e chama callback. Isso é fluxo de dados de cima para baixo.

## 3. Vite e inicialização

### 3.1 package.json

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}
```

### 3.2 main.jsx

```jsx
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
```

A ordem importa: App precisa estar dentro de BrowserRouter para usar rotas e dentro de AuthProvider para usar autenticação.

### 3.3 Variáveis Vite

```properties
# .env
VITE_API_URL=http://localhost:8080/api

// JavaScript
const url = import.meta.env.VITE_API_URL;
```

Vite só expõe ao código cliente variáveis com prefixo VITE_. Elas vão para o bundle e não devem conter segredos.

## 4. React Router: estrutura de navegação

### 4.1 Rotas

```jsx
<Route path="/products" element={<Products />} />
<Route path="/products/new" element={<ProductForm />} />
<Route path="/products/:id/edit" element={<ProductForm />} />
```

### 4.2 Navigate

<Navigate to="/dashboard" replace /> redireciona declarativamente. useNavigate() é a versão imperativa usada depois de submit, como nav(`/orders/${data.id}`).

### 4.3 Outlet e layout aninhado

```jsx
export default function Layout() {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-area">
        <Header />
        <main className="content"><Outlet /></main>
      </div>
    </div>
  );
}
```

### 4.4 useParams

OrderDetails faz const { id } = useParams();. Em /orders/42, id vale "42". Parâmetros de URL chegam como string.

## 5. ProtectedRoute e controle de acesso visual

```jsx
export default function ProtectedRoute() {
  const { user } = useAuth();
  const location = useLocation();
  return user
    ? <Outlet />
    : <Navigate to="/login" state={{ from: location }} replace />;
}
```

Isso protege a navegação da SPA, mas não substitui segurança do backend. Qualquer pessoa pode alterar JavaScript no navegador; por isso o Spring continua validando JWT e role.

| Regra de segurança: Frontend esconde/guia ações; backend decide autorização de verdade. |
| --- |

## 6. Context API e autenticação

### 6.1 Criando contexto

```jsx
const AuthContext = createContext(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth precisa estar dentro de AuthProvider');
  return context;
}
```

### 6.2 Login

```jsx
const login = async (email, password) => {
  const { data } = await api.post('/auth/login', { email, password });
  const nextUser = { id: data.id, name: data.name, email: data.email, role: data.role };
  localStorage.setItem('nexuserp_token', data.token);
  localStorage.setItem('nexuserp_user', JSON.stringify(nextUser));
  setUser(nextUser);
};
```

### 6.3 localStorage

localStorage persiste por origem até ser removido. É simples para projeto didático. Em arquiteturas diferentes, tokens podem ser tratados em cookies HttpOnly; isso muda também a estratégia de CSRF/CORS.

### 6.4 isAdmin

O contexto deriva isAdmin: user?.role === "ADMIN". Sidebar usa isso para mostrar Usuários. Novamente: é UX, não a barreira de segurança.

## 7. useEffect: carregar e sincronizar dados

```text
useEffect(() => {
  api.get('/dashboard')
    .then(r => setData(r.data))
    .catch(e => setError(apiErrorMessage(e)));
}, []);
```

| Dependências | Comportamento |
| --- | --- |
| [] | Executa após montagem; comum para carga inicial. |
| [id] | Executa após montagem e quando id muda. |
| [debouncedSearch, page] | Recarrega lista quando busca estabiliza ou página muda. |
| sem array | Executa após toda renderização; fácil causar loop se atualizar state. |

| Cleanup: Timers, subscriptions e listeners devem ser limpos no retorno do effect. useDebounce usa clearTimeout(timer). |
| --- |

## 8. Axios e contrato com a API

### 8.1 Instância

```jsx
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  timeout: 15000,
});
```

api.get("/products") vira GET http://localhost:8080/api/products. Centralizar evita concatenar URL em toda tela.

### 8.2 Request interceptor: JWT

```jsx
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('nexuserp_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

### 8.3 Response interceptor: 401

```text
if (error.response?.status === 401 && !error.config?.url?.includes('/auth/login')) {
  localStorage.removeItem('nexuserp_token');
  localStorage.removeItem('nexuserp_user');
  window.location.href = '/login';
}
```

### 8.4 GET, POST, PUT, PATCH, DELETE

```text
await api.get('/products', { params: { q: 'mouse', page: 0, size: 10 } });
await api.post('/products', payload);
await api.put(`/products/${id}`, payload);
await api.patch(`/orders/${id}/status`, { status: 'PAID' });
await api.delete(`/products/${id}`);
```

### 8.5 Tratamento de erro

```jsx
export function apiErrorMessage(error) {
  const data = error.response?.data;
  if (data?.validationErrors)
    return Object.values(data.validationErrors).join(' • ');
  return data?.message || error.message || 'Erro inesperado';
}
```

## 9. CORS: por que React 5173 e Spring 8080 precisam conversar

Origem inclui protocolo + host + porta. http://localhost:5173 e http://localhost:8080 são origens diferentes. O navegador envia/valida cabeçalhos CORS e, em alguns casos, faz preflight OPTIONS.

| Diagnóstico: Se curl/Postman funciona e navegador falha com mensagem CORS, olhe SecurityConfig/corsConfigurationSource e FRONTEND_URL. |
| --- |

## 10. Formulários controlados

```jsx
const [form, setForm] = useState({ email: '', password: '' });

<input
  type="email"
  value={form.email}
  onChange={e => setForm({ ...form, email: e.target.value })}
/>
```

O React state é a fonte da verdade. onChange cria novo objeto preservando os outros campos com spread. No submit, e.preventDefault() impede recarga do navegador.

### 10.1 Campos checkbox e number

```jsx
// checkbox
setForm({ ...form, active: e.target.checked });

// number: e.target.value ainda é string
const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };
```

Mesmo input type=number entrega string em event.target.value. Converta quando o contrato da API espera número.

## 11. Listas, paginação, busca e cálculos

### 11.1 Paginação alinhada ao Spring Page

O backend retorna content e totalPages. A tela guarda page; Pagination recebe page/totalPages e chama onChange. Ao mudar page, a tela consulta API novamente com params.

### 11.2 Renderização de lista e key

```text
products.map(p => <tr key={p.id}>...</tr>)
```

key deve ser estável e única entre irmãos. ID do banco é ideal; índice do array pode causar reconciliação incorreta quando a ordem muda.

### 11.3 useMemo no total

```jsx
const total = useMemo(
  () => items.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0),
  [items]
);
```

### 11.4 Debounce

A busca deve trabalhar com o valor debounced, não necessariamente com o valor digitado imediatamente. Isso reduz tráfego e flicker.

## 12. Build e execução

### 12.1 Desenvolvimento

```bash
npm install
npm run dev
```

### 12.2 Build de produção

```bash
npm run build
# saída: frontend/dist/
npm run preview
```

dist contém arquivos estáticos otimizados. Configure VITE_API_URL antes do build para apontar para a API correta.

### 12.3 Servir dist no Apache/XAMPP — opcional

Você pode copiar o conteúdo de dist para htdocs. Como React Router usa rotas client-side, o Apache precisa redirecionar URLs desconhecidas para index.html; caso contrário, atualizar /products pode retornar 404 do Apache.

```text
# Exemplo .htaccess dentro da pasta da SPA
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

| No desenvolvimento: É mais simples usar Vite em 5173 e XAMPP apenas para MySQL. Apache não é necessário para npm run dev. |
| --- |

## 13. Debug prático no navegador

| Ferramenta | O que verificar |
| --- | --- |
| Console | Erros JS, stack trace, warnings. |
| Network | URL, método, status, request payload, response JSON, Authorization. |
| Application → Local Storage | nexuserp_token e nexuserp_user. |
| React DevTools | Props, state, árvore de componentes. |
| Sources | Breakpoints e código carregado. |

Ao investigar API: abra Network → clique na requisição → Headers para URL/header/token; Payload para JSON enviado; Response para erro do Spring.

## 14. Receitas para adaptar o frontend

| Quero... | Como fazer |
| --- | --- |
| Nova página | Criar src/pages/X.jsx → importar em App.jsx → adicionar Route → link opcional no Sidebar. |
| Novo endpoint GET | api.get("/rota", {params}) dentro de effect/handler → guardar data no state. |
| Novo formulário | state inicial → inputs controlados → submit async → loading/error → POST/PUT. |
| Rota por id | path="/x/:id" → useParams → api.get(`/x/${id}`). |
| Proteger menu ADMIN | useAuth().isAdmin para UX + @PreAuthorize no backend. |
| Busca | state search → useDebounce → params q → reset page ao mudar busca. |
| Modal simples | state open + render condicional; para app maior considerar biblioteca acessível. |
| Mensagem de erro | catch(err) + apiErrorMessage(err). |

## 15. Erros comuns React/API

| Sintoma | Causa provável | Solução |
| --- | --- | --- |
| Network Error | API fora do ar/CORS/DNS | Teste localhost:8080, console e backend. |
| 401 após F5 | Token inválido/expirado | Ver localStorage e interceptor. |
| 403 | Role não permite | Backend @PreAuthorize; não é só menu. |
| Cannot read properties of null | Render antes dos dados | Loading/optional chaining/valor inicial. |
| Loop de requisições | useEffect dependências/updates | Corrigir array e evitar criar dependência instável. |
| Campo number vira string | Comportamento DOM | Number(...) antes de enviar. |
| 404 ao atualizar rota no Apache | Sem fallback SPA | Rewrite para index.html. |
| import.meta.env undefined | Nome sem VITE_ ou env após start | Usar VITE_* e reiniciar Vite. |
