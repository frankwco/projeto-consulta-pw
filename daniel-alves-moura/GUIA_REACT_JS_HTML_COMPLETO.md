# Guia Completo de HTML, JavaScript e React — Consulta Prática para Provas
Este material foi organizado para consulta rápida durante exercícios, provas e desenvolvimento. A ideia é mostrar cada recurso de forma isolada, com exemplos pequenos e reutilizáveis, e depois combinar os conceitos em receitas maiores.
> Dica de prova: use a busca do VS Code (`Ctrl+F`) pelos termos do índice. Os exemplos foram escritos para serem copiados e adaptados.
## Índice alfabético
| Termo | Onde procurar |
| --- | --- |
| AbortController | JavaScript → Requisições canceláveis |
| Acessibilidade | HTML → Acessibilidade |
| API REST | React → Consumindo API |
| Array | JavaScript → Arrays |
| async/await | JavaScript → Assincronismo |
| Axios | React → Axios |
| Botões | HTML → Button |
| Checkbox | HTML → Inputs |
| Classes | JavaScript → Classes |
| Componentes | React → Componentes |
| Context API | React → Context API |
| CRUD | React → CRUD completo |
| Data attributes | HTML → data-* |
| Datas | JavaScript → Date |
| Debounce | JavaScript → Debounce |
| Desestruturação | JavaScript → Destructuring |
| DOM | JavaScript → DOM |
| Eventos | HTML/JS/React → Eventos |
| Fetch | JavaScript/React → Fetch |
| Filtros | JavaScript/React → Filtros |
| FormData | JavaScript → FormData |
| Formulários | HTML/React → Formulários |
| Funções | JavaScript → Funções |
| Hooks | React → Hooks |
| HTML semântico | HTML → Semântica |
| Imagens | HTML → Imagens |
| Inputs | HTML → Inputs |
| JSON | JavaScript → JSON |
| JSX | React → JSX |
| JWT | React → Autenticação |
| Lazy loading | React → lazy/Suspense |
| Listas | HTML/React → Listas |
| localStorage | JavaScript → Storage |
| Map | JavaScript → Map |
| Modal | HTML/React → Dialog e Modal |
| Módulos | JavaScript → import/export |
| Objetos | JavaScript → Objetos |
| Paginação | React → Paginação |
| Promises | JavaScript → Promises |
| Props | React → Props |
| Radio | HTML → Inputs |
| React Router | React → Rotas |
| Regex | JavaScript → Expressões regulares |
| Select | HTML/React → Select |
| sessionStorage | JavaScript → Storage |
| Set | JavaScript → Set |
| Sort | JavaScript/React → Ordenação |
| Spread | JavaScript → Spread |
| State | React → useState |
| Tabelas | HTML/React → Tabelas |
| Timers | JavaScript → setTimeout/setInterval |
| Validação | HTML/JS/React → Validação |
| Vite | React → Projeto com Vite |

## 1. HTML — fundamentos e implementações práticas
### 1.1 Estrutura mínima de uma página HTML
Todo documento HTML moderno começa com `<!DOCTYPE html>`. O navegador usa essa declaração para renderizar em modo padrão.
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Minha Página</title>
</head>
<body>
  <h1>Olá, mundo!</h1>
</body>
</html>
```
### 1.2 Meta tags essenciais
| Meta tag | Uso |
| --- | --- |
| charset | Define codificação, normalmente UTF-8. |
| viewport | Faz a página responder corretamente em celulares. |
| description | Descrição da página para mecanismos de busca. |
| author | Autor do documento. |
| robots | Orientações para indexadores. |

```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Sistema acadêmico">
  <meta name="author" content="Equipe">
  <meta name="robots" content="index,follow">
</head>
```
### 1.3 Títulos e hierarquia
Use `h1` até `h6` respeitando hierarquia semântica. Normalmente existe um `h1` principal e subtítulos abaixo dele.
```html
<h1>Sistema de Estoque</h1>
<h2>Produtos</h2>
<h3>Produto em destaque</h3>
<h4>Detalhes técnicos</h4>
```
### 1.4 Parágrafos, quebra de linha e linha horizontal
```html
<p>Primeiro parágrafo.</p>
<p>
  Linha 1<br>
  Linha 2
</p>
<hr>
<p>Conteúdo após a separação.</p>
```
### 1.5 Ênfase e texto
| Tag | Significado |
| --- | --- |
| strong | Importância forte. |
| em | Ênfase. |
| mark | Destaque visual/semântico. |
| small | Texto secundário. |
| del | Conteúdo removido. |
| ins | Conteúdo inserido. |
| code | Trecho de código inline. |
| pre | Texto pré-formatado. |

```html
<p><strong>Atenção:</strong> operação irreversível.</p>
<p><em>Texto enfatizado.</em></p>
<p><mark>Trecho destacado.</mark></p>
<p><small>Informação auxiliar.</small></p>
<p>Preço antigo: <del>R$ 100</del> <ins>R$ 80</ins></p>
<p>Execute <code>npm run dev</code>.</p>
<pre>
linha 1
linha 2
</pre>
```
### 1.6 Links
```html
<a href="https://example.com">Abrir site</a>
<a href="/produtos">Ir para produtos</a>
<a href="#contato">Ir para seção de contato</a>
<a href="mailto:contato@example.com">Enviar e-mail</a>
<a href="tel:+5511999999999">Ligar</a>
<a href="/arquivo.pdf" download>Baixar arquivo</a>
<a href="https://example.com" target="_blank" rel="noopener noreferrer">
  Abrir em nova aba
</a>
```
### 1.7 Listas
```html
<h4>Lista não ordenada</h4>
<ul>
  <li>Java</li>
  <li>React</li>
  <li>MySQL</li>
</ul>

<h4>Lista ordenada</h4>
<ol>
  <li>Instalar dependências</li>
  <li>Iniciar backend</li>
  <li>Iniciar frontend</li>
</ol>

<h4>Lista de definições</h4>
<dl>
  <dt>API</dt>
  <dd>Interface usada para comunicação entre sistemas.</dd>

  <dt>JWT</dt>
  <dd>Token usado com frequência em autenticação.</dd>
</dl>
```
### 1.8 Imagens
```html
<img
  src="/imagens/produto.jpg"
  alt="Notebook preto aberto sobre uma mesa"
  width="500"
  height="300"
  loading="lazy"
>
```
O atributo `alt` é importante para acessibilidade. `loading="lazy"` atrasa o carregamento de imagens fora da área visível.
### 1.9 Figure e figcaption
```html
<figure>
  <img src="/grafico.png" alt="Gráfico de vendas mensais">
  <figcaption>Vendas de janeiro a dezembro.</figcaption>
</figure>
```
### 1.10 Áudio e vídeo
```html
<audio controls>
  <source src="/audio.mp3" type="audio/mpeg">
  Seu navegador não suporta áudio.
</audio>

<video controls width="640">
  <source src="/video.mp4" type="video/mp4">
  Seu navegador não suporta vídeo.
</video>
```
### 1.11 iframe
```html
<iframe
  src="https://example.com"
  title="Conteúdo externo"
  width="800"
  height="500"
  loading="lazy">
</iframe>
```
### 1.12 HTML semântico
Tags semânticas deixam clara a função de cada região do documento.
```html
<header>
  <h1>Sistema</h1>
</header>

<nav aria-label="Navegação principal">
  <a href="/">Início</a>
  <a href="/produtos">Produtos</a>
</nav>

<main>
  <section>
    <h2>Indicadores</h2>
  </section>

  <article>
    <h2>Notícia</h2>
    <p>Conteúdo independente.</p>
  </article>

  <aside>
    <p>Conteúdo complementar.</p>
  </aside>
</main>

<footer>
  <p>© Sistema</p>
</footer>
```
### 1.13 Div e span
```html
<div class="card">
  <h2>Produto</h2>
  <p>Preço: <span class="preco">R$ 100,00</span></p>
</div>
```
`div` é um contêiner genérico em bloco. `span` é um contêiner genérico inline.
### 1.14 Tabelas
```html
<table>
  <caption>Produtos cadastrados</caption>

  <thead>
    <tr>
      <th scope="col">ID</th>
      <th scope="col">Nome</th>
      <th scope="col">Preço</th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <td>1</td>
      <td>Notebook</td>
      <td>R$ 3.500,00</td>
    </tr>
  </tbody>

  <tfoot>
    <tr>
      <td colspan="2">Total</td>
      <td>R$ 3.500,00</td>
    </tr>
  </tfoot>
</table>
```
### 1.15 Formulário básico
```html
<form action="/usuarios" method="post">
  <label for="nome">Nome</label>
  <input id="nome" name="nome" type="text" required>

  <button type="submit">Salvar</button>
</form>
```
### 1.16 Tipos de input
#### Input `text`
Texto simples.
```html
<input type="text" name="nome" placeholder="Nome">
```
#### Input `email`
E-mail com validação nativa.
```html
<input type="email" name="email" required>
```
#### Input `password`
Senha.
```html
<input type="password" name="senha" minlength="8">
```
#### Input `number`
Número.
```html
<input type="number" name="idade" min="0" max="120">
```
#### Input `date`
Data.
```html
<input type="date" name="nascimento">
```
#### Input `datetime-local`
Data e hora locais.
```html
<input type="datetime-local" name="agendamento">
```
#### Input `time`
Hora.
```html
<input type="time" name="hora">
```
#### Input `month`
Mês/ano.
```html
<input type="month" name="competencia">
```
#### Input `week`
Semana.
```html
<input type="week" name="semana">
```
#### Input `url`
URL.
```html
<input type="url" name="site">
```
#### Input `tel`
Telefone.
```html
<input type="tel" name="telefone">
```
#### Input `search`
Campo de busca.
```html
<input type="search" name="busca">
```
#### Input `color`
Seletor de cor.
```html
<input type="color" name="cor">
```
#### Input `range`
Faixa numérica.
```html
<input type="range" name="nota" min="0" max="10">
```
#### Input `file`
Upload de arquivo.
```html
<input type="file" name="arquivo">
```
#### Input `hidden`
Valor oculto.
```html
<input type="hidden" name="id" value="10">
```
#### Input `checkbox`
Opção independente.
```html
<input type="checkbox" name="ativo" value="true">
```
#### Input `radio`
Opção exclusiva em grupo.
```html
<input type="radio" name="perfil" value="ADMIN">
```
### 1.17 Checkbox
```html
<label>
  <input type="checkbox" name="aceite" required>
  Aceito os termos
</label>
```
### 1.18 Grupo de radio buttons
```html
<fieldset>
  <legend>Perfil</legend>

  <label>
    <input type="radio" name="perfil" value="USER" checked>
    Usuário
  </label>

  <label>
    <input type="radio" name="perfil" value="ADMIN">
    Administrador
  </label>
</fieldset>
```
### 1.19 Select
```html
<label for="status">Status</label>
<select id="status" name="status">
  <option value="">Selecione</option>
  <option value="ATIVO">Ativo</option>
  <option value="INATIVO">Inativo</option>
</select>
```
### 1.20 Select múltiplo
```html
<select name="permissoes" multiple>
  <option value="LER">Ler</option>
  <option value="CRIAR">Criar</option>
  <option value="EDITAR">Editar</option>
</select>
```
### 1.21 Textarea
```html
<label for="descricao">Descrição</label>
<textarea
  id="descricao"
  name="descricao"
  rows="5"
  maxlength="500"
  placeholder="Digite a descrição">
</textarea>
```
### 1.22 Datalist
```html
<label for="cidade">Cidade</label>
<input id="cidade" name="cidade" list="cidades">

<datalist id="cidades">
  <option value="Curitiba">
  <option value="Londrina">
  <option value="Maringá">
</datalist>
```
### 1.23 Fieldset e legend
```html
<fieldset>
  <legend>Dados pessoais</legend>

  <label for="nomePessoa">Nome</label>
  <input id="nomePessoa" type="text">

  <label for="cpfPessoa">CPF</label>
  <input id="cpfPessoa" type="text">
</fieldset>
```
### 1.24 Botões
```html
<button type="button">Botão comum</button>
<button type="submit">Enviar formulário</button>
<button type="reset">Limpar formulário</button>
```
### 1.25 Validação HTML
```html
<form>
  <input
    type="text"
    name="usuario"
    required
    minlength="3"
    maxlength="20"
    pattern="[A-Za-z0-9_]+"
  >

  <input
    type="number"
    name="quantidade"
    min="1"
    max="100"
    step="1"
  >

  <button type="submit">Salvar</button>
</form>
```
### 1.26 Atributos data-*
```html
<button
  type="button"
  data-id="42"
  data-status="ATIVO"
  id="editar">
  Editar
</button>

<script>
  const botao = document.querySelector("#editar");

  console.log(botao.dataset.id);
  console.log(botao.dataset.status);
</script>
```
### 1.27 details e summary
```html
<details>
  <summary>Ver detalhes</summary>
  <p>Conteúdo expansível sem JavaScript.</p>
</details>
```
### 1.28 dialog
```html
<button id="abrir">Abrir modal</button>

<dialog id="modal">
  <h2>Confirmar exclusão</h2>
  <button id="fechar">Fechar</button>
</dialog>

<script>
  const modal = document.querySelector("#modal");

  document.querySelector("#abrir").addEventListener("click", () => {
    modal.showModal();
  });

  document.querySelector("#fechar").addEventListener("click", () => {
    modal.close();
  });
</script>
```
### 1.29 template
```html
<template id="produto-template">
  <article class="produto">
    <h2 class="nome"></h2>
    <p class="preco"></p>
  </article>
</template>

<div id="lista"></div>

<script>
  const template = document.querySelector("#produto-template");
  const clone = template.content.cloneNode(true);

  clone.querySelector(".nome").textContent = "Notebook";
  clone.querySelector(".preco").textContent = "R$ 3.500";

  document.querySelector("#lista").appendChild(clone);
</script>
```
### 1.30 Canvas
```html
<canvas id="grafico" width="300" height="150"></canvas>

<script>
  const canvas = document.querySelector("#grafico");
  const ctx = canvas.getContext("2d");

  ctx.fillRect(20, 20, 100, 50);
</script>
```
### 1.31 SVG
```html
<svg width="200" height="100" viewBox="0 0 200 100" role="img" aria-label="Círculo">
  <circle cx="50" cy="50" r="30"></circle>
</svg>
```
### 1.32 Acessibilidade básica
- Associe `label` e `input` com `for` e `id`.
- Use `alt` descritivo em imagens informativas.
- Use elementos semânticos antes de recorrer a `div`.
- Evite criar botões com `div`; use `<button>`.
- Garanta navegação por teclado.
- Use `aria-label` quando o controle não tiver texto visível.

```html
<button type="button" aria-label="Fechar janela">
  ×
</button>
```
## 2. JavaScript — fundamentos e implementações práticas
### 2.1 Declaração de variáveis
```javascript
const nome = "Ana";
let contador = 0;

contador += 1;

console.log(nome);
console.log(contador);
```
Prefira `const` quando a referência não precisa ser reatribuída. Use `let` quando haverá reatribuição.
### 2.2 Tipos primitivos
```javascript
const texto = "Olá";
const numero = 10;
const decimal = 10.5;
const ativo = true;
const ausente = null;
let indefinido;
const grande = 9007199254740993n;
const simbolo = Symbol("id");

console.log(typeof texto);
console.log(typeof numero);
console.log(typeof ativo);
console.log(typeof indefinido);
```
### 2.3 Conversões
```javascript
const textoNumero = "42";

const n1 = Number(textoNumero);
const n2 = parseInt("42px", 10);
const n3 = parseFloat("10.50");

const texto = String(123);
const booleano = Boolean(1);

console.log(n1, n2, n3, texto, booleano);
```
### 2.4 Comparações
```javascript
console.log(10 === 10);      // true
console.log("10" === 10);    // false
console.log("10" == 10);     // true, com coerção

console.log(5 > 3);
console.log(5 >= 5);
console.log(2 < 10);
console.log(2 <= 2);
console.log(1 !== 2);
```
Em código moderno, normalmente prefira `===` e `!==`.
### 2.5 Operadores lógicos
```javascript
const idade = 20;
const possuiDocumento = true;

const podeEntrar = idade >= 18 && possuiDocumento;
const temDesconto = idade < 12 || idade >= 60;
const bloqueado = !possuiDocumento;

console.log(podeEntrar, temDesconto, bloqueado);
```
### 2.6 Nullish coalescing
```javascript
const recebido = null;
const valor = recebido ?? "valor padrão";

console.log(valor);
```
`??` usa o valor da direita apenas quando a esquerda é `null` ou `undefined`.
### 2.7 Optional chaining
```javascript
const usuario = {
  endereco: {
    cidade: "Curitiba"
  }
};

console.log(usuario.endereco?.cidade);
console.log(usuario.contato?.telefone);
```
### 2.8 Template strings
```javascript
const nome = "Carlos";
const total = 150.75;

const mensagem = `Olá, ${nome}. Total: R$ ${total.toFixed(2)}`;

console.log(mensagem);
```
### 2.9 if / else
```javascript
const nota = 8;

if (nota >= 7) {
  console.log("Aprovado");
} else if (nota >= 5) {
  console.log("Recuperação");
} else {
  console.log("Reprovado");
}
```
### 2.10 Operador ternário
```javascript
const ativo = true;

const texto = ativo ? "Ativo" : "Inativo";

console.log(texto);
```
### 2.11 switch
```javascript
const status = "PENDENTE";

switch (status) {
  case "ATIVO":
    console.log("Registro ativo");
    break;

  case "PENDENTE":
    console.log("Registro pendente");
    break;

  default:
    console.log("Outro status");
}
```
### 2.12 for
```javascript
for (let i = 0; i < 5; i += 1) {
  console.log(i);
}
```
### 2.13 for...of
```javascript
const nomes = ["Ana", "Bruno", "Carlos"];

for (const nome of nomes) {
  console.log(nome);
}
```
### 2.14 for...in
```javascript
const usuario = {
  nome: "Ana",
  idade: 25
};

for (const chave in usuario) {
  console.log(chave, usuario[chave]);
}
```
### 2.15 while
```javascript
let contador = 0;

while (contador < 3) {
  console.log(contador);
  contador += 1;
}
```
### 2.16 do...while
```javascript
let contador = 0;

do {
  console.log(contador);
  contador += 1;
} while (contador < 3);
```
### 2.17 Função declarada
```javascript
function somar(a, b) {
  return a + b;
}

console.log(somar(2, 3));
```
### 2.18 Function expression
```javascript
const multiplicar = function (a, b) {
  return a * b;
};

console.log(multiplicar(2, 4));
```
### 2.19 Arrow function
```javascript
const dobrar = (numero) => {
  return numero * 2;
};

const triplicar = numero => numero * 3;

console.log(dobrar(5));
console.log(triplicar(5));
```
### 2.20 Parâmetro padrão
```javascript
function saudar(nome = "Visitante") {
  return `Olá, ${nome}`;
}

console.log(saudar());
console.log(saudar("Ana"));
```
### 2.21 Rest parameters
```javascript
function somarTudo(...numeros) {
  return numeros.reduce((total, numero) => total + numero, 0);
}

console.log(somarTudo(1, 2, 3, 4));
```
### 2.22 Spread em array
```javascript
const a = [1, 2];
const b = [3, 4];

const combinado = [...a, ...b, 5];

console.log(combinado);
```
### 2.23 Spread em objeto
```javascript
const usuario = {
  nome: "Ana",
  ativo: true
};

const atualizado = {
  ...usuario,
  ativo: false
};

console.log(atualizado);
```
### 2.24 Desestruturação de array
```javascript
const coordenadas = [10, 20];

const [x, y] = coordenadas;

console.log(x, y);
```
### 2.25 Desestruturação de objeto
```javascript
const produto = {
  id: 1,
  nome: "Notebook",
  preco: 3500
};

const { nome, preco } = produto;

console.log(nome, preco);
```
### 2.26 Desestruturação com renomeação
```javascript
const usuario = {
  nome: "Ana"
};

const { nome: nomeUsuario } = usuario;

console.log(nomeUsuario);
```
### 2.27 Arrays — criação e acesso
```javascript
const frutas = ["Maçã", "Banana", "Uva"];

console.log(frutas[0]);
console.log(frutas.length);

frutas[1] = "Pera";

console.log(frutas);
```
### 2.x Array.push()
Adiciona no fim.
```javascript
const itens = ["A"];
itens.push("B");
console.log(itens);
```
### 2.x Array.pop()
Remove do fim.
```javascript
const itens = ["A", "B"];
const removido = itens.pop();
console.log(removido, itens);
```
### 2.x Array.unshift()
Adiciona no início.
```javascript
const itens = ["B"];
itens.unshift("A");
console.log(itens);
```
### 2.x Array.shift()
Remove do início.
```javascript
const itens = ["A", "B"];
const removido = itens.shift();
console.log(removido, itens);
```
### 2.x Array.map()
Transforma cada item e cria um novo array.
```javascript
const numeros = [1, 2, 3];
const dobrados = numeros.map(numero => numero * 2);
console.log(dobrados);
```
### 2.x Array.filter()
Mantém os itens que passam no teste.
```javascript
const numeros = [1, 2, 3, 4, 5];
const pares = numeros.filter(numero => numero % 2 === 0);
console.log(pares);
```
### 2.x Array.find()
Retorna o primeiro item encontrado.
```javascript
const usuarios = [
  { id: 1, nome: "Ana" },
  { id: 2, nome: "Bruno" }
];

const usuario = usuarios.find(item => item.id === 2);
console.log(usuario);
```
### 2.x Array.findIndex()
Retorna o índice do primeiro item encontrado.
```javascript
const nomes = ["Ana", "Bruno", "Carlos"];
const indice = nomes.findIndex(nome => nome === "Bruno");
console.log(indice);
```
### 2.x Array.some()
Retorna true se pelo menos um item passar no teste.
```javascript
const notas = [4, 5, 8];
const existeAprovado = notas.some(nota => nota >= 7);
console.log(existeAprovado);
```
### 2.x Array.every()
Retorna true se todos passarem no teste.
```javascript
const idades = [18, 20, 30];
const todosMaiores = idades.every(idade => idade >= 18);
console.log(todosMaiores);
```
### 2.x Array.reduce()
Acumula os valores.
```javascript
const valores = [10, 20, 30];
const total = valores.reduce((acumulado, valor) => acumulado + valor, 0);
console.log(total);
```
### 2.x Array.includes()
Verifica se o array contém o valor.
```javascript
const perfis = ["USER", "ADMIN"];
console.log(perfis.includes("ADMIN"));
```
### 2.x Array.slice()
Cria uma cópia parcial sem alterar o original.
```javascript
const itens = ["A", "B", "C", "D"];
console.log(itens.slice(1, 3));
```
### 2.x Array.splice()
Remove/insere alterando o array original.
```javascript
const itens = ["A", "B", "C"];
itens.splice(1, 1, "X");
console.log(itens);
```
### 2.x Array.concat()
Combina arrays.
```javascript
const a = [1, 2];
const b = [3, 4];
const c = a.concat(b);
console.log(c);
```
### 2.x Array.join()
Transforma array em texto.
```javascript
const nomes = ["Ana", "Bruno", "Carlos"];
console.log(nomes.join(", "));
```
### 2.x Array.sort()
Ordena o array.
```javascript
const numeros = [10, 2, 30, 1];
numeros.sort((a, b) => a - b);
console.log(numeros);
```
### 2.x Array.reverse()
Inverte a ordem.
```javascript
const itens = [1, 2, 3];
itens.reverse();
console.log(itens);
```
### 2.x Array.flat()
Achata arrays aninhados.
```javascript
const itens = [[1, 2], [3, 4]];
console.log(itens.flat());
```
### 2.x Array.flatMap()
Mapeia e achata um nível.
```javascript
const frases = ["a b", "c d"];
const palavras = frases.flatMap(frase => frase.split(" "));
console.log(palavras);
```
### 2.28 Objetos
```javascript
const pessoa = {
  nome: "Ana",
  idade: 25,
  ativo: true,
  apresentar() {
    return `Sou ${this.nome}`;
  }
};

console.log(pessoa.nome);
console.log(pessoa["idade"]);
console.log(pessoa.apresentar());
```
### 2.29 Object.keys
```javascript
const pessoa = { nome: "Ana", idade: 25 };

console.log(Object.keys(pessoa));
```
### 2.30 Object.values
```javascript
const pessoa = { nome: "Ana", idade: 25 };

console.log(Object.values(pessoa));
```
### 2.31 Object.entries
```javascript
const pessoa = { nome: "Ana", idade: 25 };

for (const [chave, valor] of Object.entries(pessoa)) {
  console.log(chave, valor);
}
```
### 2.32 Object.fromEntries
```javascript
const pares = [
  ["nome", "Ana"],
  ["idade", 25]
];

const objeto = Object.fromEntries(pares);

console.log(objeto);
```
### 2.33 Cópia rasa
```javascript
const original = { nome: "Ana", ativo: true };

const copia1 = { ...original };
const copia2 = Object.assign({}, original);

console.log(copia1, copia2);
```
### 2.34 Map
```javascript
const mapa = new Map();

mapa.set("nome", "Ana");
mapa.set("idade", 25);

console.log(mapa.get("nome"));
console.log(mapa.has("idade"));

mapa.delete("idade");

for (const [chave, valor] of mapa) {
  console.log(chave, valor);
}
```
### 2.35 Set
```javascript
const numeros = new Set([1, 1, 2, 2, 3]);

numeros.add(4);
numeros.delete(2);

console.log(numeros.has(3));
console.log([...numeros]);
```
### 2.36 Remover duplicados
```javascript
const valores = [1, 1, 2, 3, 3];

const unicos = [...new Set(valores)];

console.log(unicos);
```
### 2.37 Math
```javascript
console.log(Math.round(10.5));
console.log(Math.floor(10.9));
console.log(Math.ceil(10.1));
console.log(Math.max(1, 20, 3));
console.log(Math.min(1, 20, 3));
console.log(Math.abs(-10));
console.log(Math.pow(2, 3));
console.log(Math.sqrt(81));
```
### 2.38 Número aleatório
```javascript
const entreZeroEUm = Math.random();

const de1a10 = Math.floor(Math.random() * 10) + 1;

console.log(entreZeroEUm, de1a10);
```
### 2.39 Formatação numérica
```javascript
const valor = 1234.56;

const formatado = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL"
}).format(valor);

console.log(formatado);
```
### 2.40 Date
```javascript
const agora = new Date();
const dataEspecifica = new Date("2026-09-17T10:30:00");

console.log(agora);
console.log(dataEspecifica.getFullYear());
console.log(dataEspecifica.getMonth());
console.log(dataEspecifica.getDate());
```
### 2.41 Formatar data
```javascript
const data = new Date("2026-09-17T10:30:00");

const formatada = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short"
}).format(data);

console.log(formatada);
```
### 2.42 Regex
```javascript
const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

console.log(regex.test("a@b.com"));
console.log(regex.test("email-invalido"));
```
### 2.43 String — métodos úteis
```javascript
const texto = "  JavaScript Moderno  ";

console.log(texto.trim());
console.log(texto.toLowerCase());
console.log(texto.toUpperCase());
console.log(texto.includes("Script"));
console.log(texto.startsWith("  Java"));
console.log(texto.endsWith("  "));
console.log(texto.replace("Moderno", "Prático"));
console.log(texto.split(" "));
```
### 2.44 JSON.stringify
```javascript
const usuario = {
  id: 1,
  nome: "Ana"
};

const json = JSON.stringify(usuario);

console.log(json);
```
### 2.45 JSON.parse
```javascript
const json = '{"id":1,"nome":"Ana"}';

const usuario = JSON.parse(json);

console.log(usuario.nome);
```
### 2.46 try / catch / finally
```javascript
try {
  const dados = JSON.parse("json inválido");
  console.log(dados);
} catch (erro) {
  console.error("Falha ao processar:", erro.message);
} finally {
  console.log("Sempre executa.");
}
```
### 2.47 Criar erro
```javascript
function dividir(a, b) {
  if (b === 0) {
    throw new Error("Divisão por zero não permitida.");
  }

  return a / b;
}

try {
  console.log(dividir(10, 0));
} catch (erro) {
  console.error(erro.message);
}
```
### 2.48 Classes
```javascript
class Produto {
  constructor(nome, preco) {
    this.nome = nome;
    this.preco = preco;
  }

  aplicarDesconto(percentual) {
    this.preco -= this.preco * (percentual / 100);
  }
}

const produto = new Produto("Notebook", 3500);

produto.aplicarDesconto(10);

console.log(produto);
```
### 2.49 Herança
```javascript
class Pessoa {
  constructor(nome) {
    this.nome = nome;
  }

  apresentar() {
    return `Olá, sou ${this.nome}`;
  }
}

class Aluno extends Pessoa {
  constructor(nome, curso) {
    super(nome);
    this.curso = curso;
  }
}

const aluno = new Aluno("Ana", "ADS");

console.log(aluno.apresentar());
console.log(aluno.curso);
```
### 2.50 Getter e setter
```javascript
class Conta {
  #saldo = 0;

  get saldo() {
    return this.#saldo;
  }

  set saldo(valor) {
    if (valor < 0) {
      throw new Error("Saldo inválido");
    }

    this.#saldo = valor;
  }
}

const conta = new Conta();

conta.saldo = 100;

console.log(conta.saldo);
```
### 2.51 Módulos ES — export/import
```javascript
// matematica.js
export function somar(a, b) {
  return a + b;
}

export const PI = 3.14159;
```
```javascript
// app.js
import { somar, PI } from "./matematica.js";

console.log(somar(2, 3));
console.log(PI);
```
### 2.52 Export default
```javascript
// Usuario.js
export default class Usuario {
  constructor(nome) {
    this.nome = nome;
  }
}
```
```javascript
// app.js
import Usuario from "./Usuario.js";

const usuario = new Usuario("Ana");

console.log(usuario);
```
### 2.53 Promise
```javascript
const promessa = new Promise((resolve, reject) => {
  const sucesso = true;

  if (sucesso) {
    resolve("Concluído");
  } else {
    reject(new Error("Falhou"));
  }
});

promessa
  .then(resultado => console.log(resultado))
  .catch(erro => console.error(erro.message))
  .finally(() => console.log("Fim"));
```
### 2.54 async / await
```javascript
async function executar() {
  try {
    const resposta = await Promise.resolve("OK");
    console.log(resposta);
  } catch (erro) {
    console.error(erro);
  }
}

executar();
```
### 2.x Promise.all
Falha se qualquer Promise falhar.
```javascript
const [usuario, pedidos] = await Promise.all([
  fetch("/api/usuario").then(r => r.json()),
  fetch("/api/pedidos").then(r => r.json())
]);

console.log(usuario, pedidos);
```
### 2.x Promise.allSettled
Aguarda todas e informa o estado de cada uma.
```javascript
const resultados = await Promise.allSettled([
  Promise.resolve("A"),
  Promise.reject(new Error("B"))
]);

console.log(resultados);
```
### 2.x Promise.race
Retorna a primeira Promise que resolver ou rejeitar.
```javascript
const resultado = await Promise.race([
  new Promise(resolve => setTimeout(() => resolve("A"), 100)),
  new Promise(resolve => setTimeout(() => resolve("B"), 200))
]);

console.log(resultado);
```
### 2.x Promise.any
Retorna a primeira Promise resolvida com sucesso.
```javascript
const resultado = await Promise.any([
  Promise.reject(new Error("Falhou A")),
  Promise.resolve("Sucesso B")
]);

console.log(resultado);
```
### 2.55 Fetch GET
```javascript
async function listarProdutos() {
  const response = await fetch("http://localhost:8080/api/produtos");

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const dados = await response.json();

  console.log(dados);
}

listarProdutos();
```
### 2.56 Fetch POST
```javascript
async function criarProduto() {
  const produto = {
    nome: "Notebook",
    preco: 3500
  };

  const response = await fetch("http://localhost:8080/api/produtos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(produto)
  });

  const criado = await response.json();

  console.log(criado);
}
```
### 2.57 Fetch PUT
```javascript
async function atualizarProduto(id) {
  const response = await fetch(`http://localhost:8080/api/produtos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      nome: "Notebook atualizado",
      preco: 3200
    })
  });

  return response.json();
}
```
### 2.58 Fetch DELETE
```javascript
async function excluirProduto(id) {
  const response = await fetch(`http://localhost:8080/api/produtos/${id}`, {
    method: "DELETE"
  });

  if (!response.ok) {
    throw new Error("Falha ao excluir");
  }
}
```
### 2.59 Authorization Bearer
```javascript
const token = localStorage.getItem("token");

const response = await fetch("/api/produtos", {
  headers: {
    Authorization: `Bearer ${token}`
  }
});
```
### 2.60 AbortController
```javascript
const controller = new AbortController();

fetch("/api/produtos", {
  signal: controller.signal
})
  .then(response => response.json())
  .then(console.log)
  .catch(erro => {
    if (erro.name === "AbortError") {
      console.log("Requisição cancelada");
    }
  });

controller.abort();
```
### 2.61 URLSearchParams
```javascript
const params = new URLSearchParams({
  nome: "Notebook",
  status: "ATIVO",
  page: "0",
  size: "10"
});

console.log(params.toString());

const url = `/api/produtos?${params.toString()}`;

console.log(url);
```
### 2.62 FormData
```javascript
const form = document.querySelector("#form");

form.addEventListener("submit", async event => {
  event.preventDefault();

  const dados = new FormData(form);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: dados
  });

  console.log(await response.json());
});
```
### 2.63 setTimeout
```javascript
const id = setTimeout(() => {
  console.log("Executou depois de 1 segundo");
}, 1000);

clearTimeout(id);
```
### 2.64 setInterval
```javascript
const id = setInterval(() => {
  console.log(new Date());
}, 1000);

setTimeout(() => {
  clearInterval(id);
}, 5000);
```
### 2.65 Debounce
```javascript
function debounce(fn, delay) {
  let timer;

  return (...args) => {
    clearTimeout(timer);

    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

const buscar = debounce(texto => {
  console.log("Buscando:", texto);
}, 500);

buscar("rea");
buscar("react");
```
### 2.66 Throttle
```javascript
function throttle(fn, intervalo) {
  let bloqueado = false;

  return (...args) => {
    if (bloqueado) {
      return;
    }

    fn(...args);
    bloqueado = true;

    setTimeout(() => {
      bloqueado = false;
    }, intervalo);
  };
}

const aoScroll = throttle(() => {
  console.log("scroll");
}, 200);

window.addEventListener("scroll", aoScroll);
```
### 2.67 DOM — querySelector
```javascript
const titulo = document.querySelector("#titulo");
const primeiroBotao = document.querySelector(".botao");

console.log(titulo, primeiroBotao);
```
### 2.68 DOM — querySelectorAll
```javascript
const botoes = document.querySelectorAll(".botao");

botoes.forEach(botao => {
  console.log(botao.textContent);
});
```
### 2.69 DOM — criar elemento
```javascript
const item = document.createElement("li");

item.textContent = "Novo item";
item.classList.add("item");

document.querySelector("#lista").appendChild(item);
```
### 2.70 DOM — alterar conteúdo
```javascript
const titulo = document.querySelector("#titulo");

titulo.textContent = "Novo título";

const container = document.querySelector("#container");

container.innerHTML = "<strong>Conteúdo HTML</strong>";
```
Prefira `textContent` quando não precisar interpretar HTML recebido. `innerHTML` exige cuidado com conteúdo não confiável.
### 2.71 DOM — classes
```javascript
const card = document.querySelector(".card");

card.classList.add("ativo");
card.classList.remove("oculto");
card.classList.toggle("selecionado");

console.log(card.classList.contains("ativo"));
```
### 2.72 DOM — atributos
```javascript
const link = document.querySelector("a");

link.setAttribute("href", "/dashboard");

console.log(link.getAttribute("href"));

link.removeAttribute("target");
```
### 2.73 Eventos
```javascript
const botao = document.querySelector("#salvar");

botao.addEventListener("click", event => {
  console.log("Clicou", event.target);
});
```
### 2.74 preventDefault
```javascript
const form = document.querySelector("#form");

form.addEventListener("submit", event => {
  event.preventDefault();

  console.log("Envio tratado por JavaScript");
});
```
### 2.75 stopPropagation
```javascript
const interno = document.querySelector("#interno");

interno.addEventListener("click", event => {
  event.stopPropagation();

  console.log("Evento não sobe para o pai");
});
```
### 2.76 Delegação de eventos
```javascript
document.querySelector("#lista").addEventListener("click", event => {
  const botao = event.target.closest("[data-id]");

  if (!botao) {
    return;
  }

  console.log("ID:", botao.dataset.id);
});
```
### 2.77 Capturar valores de formulário
```javascript
const form = document.querySelector("#form");

form.addEventListener("submit", event => {
  event.preventDefault();

  const nome = form.elements.nome.value;
  const email = form.elements.email.value;

  console.log({ nome, email });
});
```
### 2.78 Validar formulário via JS
```javascript
const form = document.querySelector("#form");

form.addEventListener("submit", event => {
  event.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  console.log("Formulário válido");
});
```
### 2.79 localStorage
```javascript
localStorage.setItem("tema", "escuro");

const tema = localStorage.getItem("tema");

console.log(tema);

localStorage.removeItem("tema");

// localStorage.clear();
```
### 2.80 Guardar objeto no localStorage
```javascript
const usuario = {
  id: 1,
  nome: "Ana"
};

localStorage.setItem("usuario", JSON.stringify(usuario));

const salvo = JSON.parse(localStorage.getItem("usuario"));

console.log(salvo);
```
### 2.81 sessionStorage
```javascript
sessionStorage.setItem("etapa", "2");

console.log(sessionStorage.getItem("etapa"));

sessionStorage.removeItem("etapa");
```
### 2.82 Clipboard
```javascript
async function copiar(texto) {
  await navigator.clipboard.writeText(texto);
}

copiar("Texto copiado");
```
### 2.83 FileReader
```javascript
const input = document.querySelector("#arquivo");

input.addEventListener("change", () => {
  const arquivo = input.files[0];

  if (!arquivo) {
    return;
  }

  const reader = new FileReader();

  reader.onload = event => {
    console.log(event.target.result);
  };

  reader.readAsText(arquivo);
});
```
### 2.84 Location
```javascript
console.log(window.location.href);
console.log(window.location.pathname);
console.log(window.location.search);

window.location.href = "/login";
```
### 2.85 History API
```javascript
history.pushState(
  { pagina: "produtos" },
  "",
  "/produtos?page=2"
);

window.addEventListener("popstate", event => {
  console.log("Navegação:", event.state);
});
```
### 2.86 IntersectionObserver
```javascript
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      console.log("Elemento ficou visível");
    }
  });
});

observer.observe(document.querySelector("#alvo"));
```
### 2.87 MutationObserver
```javascript
const alvo = document.querySelector("#lista");

const observer = new MutationObserver(mutations => {
  console.log("DOM alterado:", mutations);
});

observer.observe(alvo, {
  childList: true,
  subtree: true
});
```
### 2.88 Ordenar objetos por número
```javascript
const produtos = [
  { nome: "A", preco: 20 },
  { nome: "B", preco: 5 },
  { nome: "C", preco: 10 }
];

const ordenados = [...produtos].sort((a, b) => a.preco - b.preco);

console.log(ordenados);
```
### 2.89 Ordenar objetos por texto
```javascript
const produtos = [
  { nome: "Teclado" },
  { nome: "Mouse" },
  { nome: "Monitor" }
];

const ordenados = [...produtos].sort((a, b) =>
  a.nome.localeCompare(b.nome, "pt-BR")
);

console.log(ordenados);
```
### 2.90 Filtro com múltiplos critérios
```javascript
const produtos = [
  { nome: "Notebook", categoria: "Informática", preco: 3500, ativo: true },
  { nome: "Mouse", categoria: "Informática", preco: 100, ativo: false },
  { nome: "Mesa", categoria: "Móveis", preco: 800, ativo: true }
];

const filtros = {
  texto: "note",
  categoria: "Informática",
  precoMin: 1000,
  ativo: true
};

const resultado = produtos.filter(produto => {
  const combinaTexto =
    !filtros.texto ||
    produto.nome.toLowerCase().includes(filtros.texto.toLowerCase());

  const combinaCategoria =
    !filtros.categoria ||
    produto.categoria === filtros.categoria;

  const combinaPreco =
    filtros.precoMin == null ||
    produto.preco >= filtros.precoMin;

  const combinaAtivo =
    filtros.ativo == null ||
    produto.ativo === filtros.ativo;

  return combinaTexto &&
         combinaCategoria &&
         combinaPreco &&
         combinaAtivo;
});

console.log(resultado);
```
## 3. React — fundamentos e implementações práticas
### 3.1 Criar projeto React com Vite
```bash
npm create vite@latest meu-projeto
cd meu-projeto
npm install
npm run dev
```
### 3.2 Estrutura mínima
```text
src/
├── App.jsx
├── main.jsx
├── components/
├── pages/
├── services/
├── hooks/
├── context/
└── styles/
```
### 3.3 main.jsx
```jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```
### 3.4 Componente funcional
```jsx
function Saudacao() {
  return <h1>Olá!</h1>;
}

export default Saudacao;
```
### 3.5 JSX
```jsx
function Produto() {
  const nome = "Notebook";
  const preco = 3500;

  return (
    <article>
      <h2>{nome}</h2>
      <p>R$ {preco.toFixed(2)}</p>
    </article>
  );
}
```
### 3.6 Fragment
```jsx
function Cabecalho() {
  return (
    <>
      <h1>Sistema</h1>
      <p>Bem-vindo.</p>
    </>
  );
}
```
### 3.7 Props
```jsx
function CardProduto({ nome, preco }) {
  return (
    <article>
      <h2>{nome}</h2>
      <p>R$ {preco.toFixed(2)}</p>
    </article>
  );
}

export default function App() {
  return (
    <CardProduto
      nome="Notebook"
      preco={3500}
    />
  );
}
```
### 3.8 Prop children
```jsx
function Card({ children }) {
  return (
    <div className="card">
      {children}
    </div>
  );
}

export default function App() {
  return (
    <Card>
      <h2>Título</h2>
      <p>Conteúdo.</p>
    </Card>
  );
}
```
### 3.9 Renderização condicional com if
```jsx
function Status({ autenticado }) {
  if (!autenticado) {
    return <p>Faça login.</p>;
  }

  return <p>Usuário autenticado.</p>;
}
```
### 3.10 Renderização condicional com ternário
```jsx
function Status({ ativo }) {
  return (
    <span>
      {ativo ? "Ativo" : "Inativo"}
    </span>
  );
}
```
### 3.11 Renderização condicional com &&
```jsx
function Alerta({ erro }) {
  return (
    <div>
      {erro && (
        <p role="alert">
          {erro}
        </p>
      )}
    </div>
  );
}
```
### 3.12 Renderizar lista
```jsx
function ListaProdutos({ produtos }) {
  return (
    <ul>
      {produtos.map(produto => (
        <li key={produto.id}>
          {produto.nome}
        </li>
      ))}
    </ul>
  );
}
```
### 3.13 key
A `key` deve identificar o item de forma estável entre renderizações. Quando existir, prefira o ID real do registro.
```jsx
{usuarios.map(usuario => (
  <UsuarioItem
    key={usuario.id}
    usuario={usuario}
  />
))}
```
### 3.14 Evento onClick
```jsx
function Botao() {
  function handleClick() {
    alert("Clicou");
  }

  return (
    <button type="button" onClick={handleClick}>
      Clique
    </button>
  );
}
```
### 3.15 Passar parâmetro no evento
```jsx
function Lista({ produtos }) {
  function excluir(id) {
    console.log("Excluir:", id);
  }

  return produtos.map(produto => (
    <button
      key={produto.id}
      type="button"
      onClick={() => excluir(produto.id)}
    >
      Excluir {produto.nome}
    </button>
  ));
}
```
### 3.16 useState
```jsx
import { useState } from "react";

function Contador() {
  const [contador, setContador] = useState(0);

  return (
    <div>
      <p>{contador}</p>

      <button
        type="button"
        onClick={() => setContador(contador + 1)}
      >
        Incrementar
      </button>
    </div>
  );
}
```
### 3.17 Atualização funcional do state
```jsx
setContador(valorAnterior => valorAnterior + 1);
```
### 3.18 State com objeto
```jsx
import { useState } from "react";

function Formulario() {
  const [produto, setProduto] = useState({
    nome: "",
    preco: 0
  });

  function alterarNome(event) {
    setProduto(anterior => ({
      ...anterior,
      nome: event.target.value
    }));
  }

  return (
    <input
      value={produto.nome}
      onChange={alterarNome}
    />
  );
}
```
### 3.19 State com array
```jsx
const [itens, setItens] = useState([]);

function adicionar(item) {
  setItens(anteriores => [
    ...anteriores,
    item
  ]);
}

function remover(id) {
  setItens(anteriores =>
    anteriores.filter(item => item.id !== id)
  );
}
```
### 3.20 Formulário controlado
```jsx
import { useState } from "react";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    console.log({
      email,
      senha
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={event => setEmail(event.target.value)}
      />

      <input
        type="password"
        value={senha}
        onChange={event => setSenha(event.target.value)}
      />

      <button type="submit">
        Entrar
      </button>
    </form>
  );
}
```
### 3.21 Formulário genérico com name
```jsx
import { useState } from "react";

const inicial = {
  nome: "",
  email: "",
  idade: ""
};

function Formulario() {
  const [form, setForm] = useState(inicial);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm(anterior => ({
      ...anterior,
      [name]: value
    }));
  }

  return (
    <form>
      <input
        name="nome"
        value={form.nome}
        onChange={handleChange}
      />

      <input
        name="email"
        value={form.email}
        onChange={handleChange}
      />

      <input
        name="idade"
        value={form.idade}
        onChange={handleChange}
      />
    </form>
  );
}
```
### 3.22 Checkbox controlado
```jsx
const [ativo, setAtivo] = useState(false);

<input
  type="checkbox"
  checked={ativo}
  onChange={event => setAtivo(event.target.checked)}
/>
```
### 3.23 Radio controlado
```jsx
const [perfil, setPerfil] = useState("USER");

<label>
  <input
    type="radio"
    name="perfil"
    value="USER"
    checked={perfil === "USER"}
    onChange={event => setPerfil(event.target.value)}
  />
  Usuário
</label>

<label>
  <input
    type="radio"
    name="perfil"
    value="ADMIN"
    checked={perfil === "ADMIN"}
    onChange={event => setPerfil(event.target.value)}
  />
  Admin
</label>
```
### 3.24 Select controlado
```jsx
const [status, setStatus] = useState("");

<select
  value={status}
  onChange={event => setStatus(event.target.value)}
>
  <option value="">Todos</option>
  <option value="ATIVO">Ativo</option>
  <option value="INATIVO">Inativo</option>
</select>
```
### 3.25 Textarea controlado
```jsx
const [descricao, setDescricao] = useState("");

<textarea
  value={descricao}
  onChange={event => setDescricao(event.target.value)}
/>
```
### 3.26 useEffect no carregamento
```jsx
import { useEffect } from "react";

function Pagina() {
  useEffect(() => {
    console.log("Executou após montar");
  }, []);

  return <h1>Página</h1>;
}
```
### 3.27 useEffect com dependência
```jsx
useEffect(() => {
  console.log("ID mudou:", id);
}, [id]);
```
### 3.28 Cleanup do useEffect
```jsx
useEffect(() => {
  const id = setInterval(() => {
    console.log("Atualizando");
  }, 1000);

  return () => {
    clearInterval(id);
  };
}, []);
```
### 3.29 Buscar API no useEffect
```jsx
import { useEffect, useState } from "react";

function Produtos() {
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    async function carregar() {
      const response = await fetch("/api/produtos");
      const dados = await response.json();

      setProdutos(dados);
    }

    carregar();
  }, []);

  return (
    <ul>
      {produtos.map(produto => (
        <li key={produto.id}>
          {produto.nome}
        </li>
      ))}
    </ul>
  );
}
```
### 3.30 Loading, erro e dados
```jsx
import { useEffect, useState } from "react";

function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregar() {
      try {
        setLoading(true);
        setErro("");

        const response = await fetch("/api/produtos");

        if (!response.ok) {
          throw new Error("Falha ao carregar");
        }

        const dados = await response.json();

        setProdutos(dados);
      } catch (error) {
        setErro(error.message);
      } finally {
        setLoading(false);
      }
    }

    carregar();
  }, []);

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (erro) {
    return <p role="alert">{erro}</p>;
  }

  return (
    <ul>
      {produtos.map(produto => (
        <li key={produto.id}>
          {produto.nome}
        </li>
      ))}
    </ul>
  );
}
```
### 3.31 useMemo
```jsx
import { useMemo } from "react";

function Total({ itens }) {
  const total = useMemo(() => {
    return itens.reduce(
      (soma, item) => soma + item.valor,
      0
    );
  }, [itens]);

  return <strong>{total}</strong>;
}
```
### 3.32 useCallback
```jsx
import { useCallback } from "react";

function Lista({ onSelecionar }) {
  const selecionarPrimeiro = useCallback(() => {
    onSelecionar(1);
  }, [onSelecionar]);

  return (
    <button onClick={selecionarPrimeiro}>
      Selecionar
    </button>
  );
}
```
### 3.33 useRef para elemento DOM
```jsx
import { useRef } from "react";

function Busca() {
  const inputRef = useRef(null);

  function focar() {
    inputRef.current?.focus();
  }

  return (
    <>
      <input ref={inputRef} />

      <button type="button" onClick={focar}>
        Focar
      </button>
    </>
  );
}
```
### 3.34 useRef para valor persistente
```jsx
const renderizacoes = useRef(0);

renderizacoes.current += 1;

console.log(renderizacoes.current);
```
### 3.35 useReducer
```jsx
import { useReducer } from "react";

const inicial = {
  contador: 0
};

function reducer(state, action) {
  switch (action.type) {
    case "incrementar":
      return {
        ...state,
        contador: state.contador + 1
      };

    case "zerar":
      return inicial;

    default:
      return state;
  }
}

function Contador() {
  const [state, dispatch] = useReducer(reducer, inicial);

  return (
    <>
      <p>{state.contador}</p>

      <button onClick={() => dispatch({ type: "incrementar" })}>
        +
      </button>

      <button onClick={() => dispatch({ type: "zerar" })}>
        Zerar
      </button>
    </>
  );
}
```
### 3.36 Elevar state para o componente pai
```jsx
function Filtro({ valor, onChange }) {
  return (
    <input
      value={valor}
      onChange={event => onChange(event.target.value)}
    />
  );
}

function Pagina() {
  const [busca, setBusca] = useState("");

  return (
    <>
      <Filtro
        valor={busca}
        onChange={setBusca}
      />

      <p>Buscando: {busca}</p>
    </>
  );
}
```
### 3.37 Context API — criar contexto
```jsx
import { createContext } from "react";

export const AuthContext = createContext(null);
```
### 3.38 Context Provider
```jsx
import { useState } from "react";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);

  function login(dados) {
    setUsuario(dados);
  }

  function logout() {
    setUsuario(null);
  }

  return (
    <AuthContext.Provider
      value={{
        usuario,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
```
### 3.39 useContext
```jsx
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

function Perfil() {
  const { usuario, logout } = useContext(AuthContext);

  return (
    <>
      <p>{usuario?.nome}</p>

      <button onClick={logout}>
        Sair
      </button>
    </>
  );
}
```
### 3.40 Custom Hook
```jsx
import { useEffect, useState } from "react";

export function useFetch(url) {
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      try {
        setLoading(true);

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Falha na API");
        }

        const json = await response.json();

        if (ativo) {
          setDados(json);
        }
      } catch (error) {
        if (ativo) {
          setErro(error);
        }
      } finally {
        if (ativo) {
          setLoading(false);
        }
      }
    }

    carregar();

    return () => {
      ativo = false;
    };
  }, [url]);

  return {
    dados,
    loading,
    erro
  };
}
```
### 3.41 React.memo
```jsx
import { memo } from "react";

const LinhaProduto = memo(function LinhaProduto({ produto }) {
  return (
    <tr>
      <td>{produto.nome}</td>
      <td>{produto.preco}</td>
    </tr>
  );
});

export default LinhaProduto;
```
### 3.42 lazy e Suspense
```jsx
import { lazy, Suspense } from "react";

const Dashboard = lazy(() => import("./Dashboard.jsx"));

function App() {
  return (
    <Suspense fallback={<p>Carregando módulo...</p>}>
      <Dashboard />
    </Suspense>
  );
}
```
### 3.43 Portal
```jsx
import { createPortal } from "react-dom";

function Modal({ children }) {
  return createPortal(
    <div className="modal">
      {children}
    </div>,
    document.body
  );
}
```
### 3.44 Error Boundary
```jsx
import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      erro: false
    };
  }

  static getDerivedStateFromError() {
    return {
      erro: true
    };
  }

  componentDidCatch(error, info) {
    console.error(error, info);
  }

  render() {
    if (this.state.erro) {
      return <h2>Algo deu errado.</h2>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```
### 3.45 React Router — instalação
```bash
npm install react-router-dom
```
### 3.46 Configuração de rotas
```jsx
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Home from "./pages/Home";
import Produtos from "./pages/Produtos";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/produtos" element={<Produtos />} />
      </Routes>
    </BrowserRouter>
  );
}
```
### 3.47 Link
```jsx
import { Link } from "react-router-dom";

function Menu() {
  return (
    <nav>
      <Link to="/">Início</Link>
      <Link to="/produtos">Produtos</Link>
    </nav>
  );
}
```
### 3.48 useNavigate
```jsx
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  function sucesso() {
    navigate("/dashboard");
  }

  return (
    <button onClick={sucesso}>
      Simular login
    </button>
  );
}
```
### 3.49 useParams
```jsx
import { useParams } from "react-router-dom";

function ProdutoDetalhe() {
  const { id } = useParams();

  return <p>Produto: {id}</p>;
}
```
### 3.50 Query string com useSearchParams
```jsx
import { useSearchParams } from "react-router-dom";

function Produtos() {
  const [params, setParams] = useSearchParams();

  const busca = params.get("busca") ?? "";

  function atualizarBusca(valor) {
    setParams({
      busca: valor
    });
  }

  return (
    <input
      value={busca}
      onChange={event => atualizarBusca(event.target.value)}
    />
  );
}
```
### 3.51 Rotas aninhadas
```jsx
<Routes>
  <Route path="/admin" element={<AdminLayout />}>
    <Route path="usuarios" element={<Usuarios />} />
    <Route path="produtos" element={<Produtos />} />
  </Route>
</Routes>
```
```jsx
import { Outlet } from "react-router-dom";

function AdminLayout() {
  return (
    <main>
      <h1>Admin</h1>
      <Outlet />
    </main>
  );
}
```
### 3.52 Rota protegida
```jsx
import { Navigate } from "react-router-dom";

function ProtectedRoute({ autenticado, children }) {
  if (!autenticado) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
```
```jsx
<Route
  path="/dashboard"
  element={
    <ProtectedRoute autenticado={autenticado}>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```
### 3.53 Axios — instalação
```bash
npm install axios
```
### 3.54 Instância Axios
```javascript
import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8080/api",
  timeout: 10000
});
```
### 3.55 Axios GET
```javascript
const response = await api.get("/produtos");

console.log(response.data);
```
### 3.56 Axios GET com params
```javascript
const response = await api.get("/produtos", {
  params: {
    busca: "note",
    page: 0,
    size: 10
  }
});

console.log(response.data);
```
### 3.57 Axios POST
```javascript
const novoProduto = {
  nome: "Notebook",
  preco: 3500
};

const response = await api.post(
  "/produtos",
  novoProduto
);

console.log(response.data);
```
### 3.58 Axios PUT
```javascript
const response = await api.put(
  "/produtos/10",
  {
    nome: "Notebook atualizado",
    preco: 3200
  }
);

console.log(response.data);
```
### 3.59 Axios DELETE
```javascript
await api.delete("/produtos/10");
```
### 3.60 Interceptor JWT
```javascript
api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
```
### 3.61 Interceptor de erro 401
```javascript
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);
```
### 3.62 Login com JWT
```jsx
async function login(email, senha) {
  const response = await api.post("/auth/login", {
    email,
    senha
  });

  localStorage.setItem(
    "token",
    response.data.token
  );

  return response.data;
}
```
### 3.63 Logout
```javascript
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");

  window.location.href = "/login";
}
```
### 3.64 Tabela React
```jsx
function ProdutoTabela({ produtos }) {
  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nome</th>
          <th>Preço</th>
        </tr>
      </thead>

      <tbody>
        {produtos.map(produto => (
          <tr key={produto.id}>
            <td>{produto.id}</td>
            <td>{produto.nome}</td>
            <td>{produto.preco}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```
### 3.65 Tabela vazia
```jsx
<tbody>
  {produtos.length === 0 ? (
    <tr>
      <td colSpan={3}>
        Nenhum produto encontrado.
      </td>
    </tr>
  ) : (
    produtos.map(produto => (
      <tr key={produto.id}>
        <td>{produto.id}</td>
        <td>{produto.nome}</td>
        <td>{produto.preco}</td>
      </tr>
    ))
  )}
</tbody>
```
### 3.66 Paginação simples
```jsx
function Paginacao({
  page,
  totalPages,
  onPageChange
}) {
  return (
    <div>
      <button
        type="button"
        disabled={page === 0}
        onClick={() => onPageChange(page - 1)}
      >
        Anterior
      </button>

      <span>
        Página {page + 1} de {totalPages}
      </span>

      <button
        type="button"
        disabled={page + 1 >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Próxima
      </button>
    </div>
  );
}
```
### 3.67 Paginação consumindo Spring Page
```jsx
const [pagina, setPagina] = useState({
  content: [],
  number: 0,
  totalPages: 0,
  totalElements: 0
});

async function carregar(page = 0) {
  const response = await api.get("/produtos", {
    params: {
      page,
      size: 10
    }
  });

  setPagina(response.data);
}
```
### 3.68 Filtros controlados
```jsx
const filtrosIniciais = {
  busca: "",
  status: "",
  precoMin: "",
  precoMax: ""
};

const [filtros, setFiltros] = useState(filtrosIniciais);

function handleFiltro(event) {
  const { name, value } = event.target;

  setFiltros(anterior => ({
    ...anterior,
    [name]: value
  }));
}
```
### 3.69 Enviar apenas filtros preenchidos
```javascript
function limparVazios(objeto) {
  return Object.fromEntries(
    Object.entries(objeto)
      .filter(([, valor]) =>
        valor !== "" &&
        valor !== null &&
        valor !== undefined
      )
  );
}

const params = limparVazios({
  ...filtros,
  page: 0,
  size: 10
});

const response = await api.get("/produtos", {
  params
});
```
### 3.70 Busca com debounce no React
```jsx
import { useEffect, useState } from "react";

function Busca({ onBuscar }) {
  const [texto, setTexto] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      onBuscar(texto);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [texto, onBuscar]);

  return (
    <input
      value={texto}
      onChange={event => setTexto(event.target.value)}
      placeholder="Buscar..."
    />
  );
}
```
### 3.71 Ordenação
```jsx
const [sort, setSort] = useState("nome");
const [direction, setDirection] = useState("asc");

async function carregar() {
  const response = await api.get("/produtos", {
    params: {
      sort,
      direction
    }
  });

  return response.data;
}
```
### 3.72 CRUD — criar
```jsx
async function criarProduto(form) {
  const payload = {
    nome: form.nome.trim(),
    preco: Number(form.preco),
    ativo: form.ativo
  };

  const response = await api.post(
    "/produtos",
    payload
  );

  return response.data;
}
```
### 3.73 CRUD — editar
```jsx
async function editarProduto(id, form) {
  const response = await api.put(
    `/produtos/${id}`,
    {
      nome: form.nome,
      preco: Number(form.preco),
      ativo: form.ativo
    }
  );

  return response.data;
}
```
### 3.74 CRUD — excluir
```jsx
async function excluirProduto(id) {
  const confirmou = window.confirm(
    "Deseja realmente excluir?"
  );

  if (!confirmou) {
    return;
  }

  await api.delete(`/produtos/${id}`);

  await carregarProdutos();
}
```
### 3.75 CRUD — buscar por ID
```jsx
async function buscarProduto(id) {
  const response = await api.get(
    `/produtos/${id}`
  );

  return response.data;
}
```
### 3.76 Formulário de criação e edição reutilizável
```jsx
import { useEffect, useState } from "react";

const vazio = {
  nome: "",
  preco: "",
  ativo: true
};

function ProdutoForm({
  produto,
  onSalvar
}) {
  const [form, setForm] = useState(vazio);

  useEffect(() => {
    if (produto) {
      setForm({
        nome: produto.nome ?? "",
        preco: produto.preco ?? "",
        ativo: produto.ativo ?? true
      });
    } else {
      setForm(vazio);
    }
  }, [produto]);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm(anterior => ({
      ...anterior,
      [name]: type === "checkbox" ? checked : value
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSalvar(form);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="nome"
        value={form.nome}
        onChange={handleChange}
      />

      <input
        name="preco"
        type="number"
        value={form.preco}
        onChange={handleChange}
      />

      <label>
        <input
          name="ativo"
          type="checkbox"
          checked={form.ativo}
          onChange={handleChange}
        />
        Ativo
      </label>

      <button type="submit">
        Salvar
      </button>
    </form>
  );
}
```
### 3.77 Validação manual no React
```jsx
function validar(form) {
  const erros = {};

  if (!form.nome.trim()) {
    erros.nome = "Nome é obrigatório";
  }

  const preco = Number(form.preco);

  if (Number.isNaN(preco) || preco < 0) {
    erros.preco = "Preço inválido";
  }

  return erros;
}
```
### 3.78 Exibir erros por campo
```jsx
<div>
  <label htmlFor="nome">Nome</label>

  <input
    id="nome"
    name="nome"
    value={form.nome}
    onChange={handleChange}
    aria-invalid={Boolean(erros.nome)}
  />

  {erros.nome && (
    <small role="alert">
      {erros.nome}
    </small>
  )}
</div>
```
### 3.79 Upload de arquivo
```jsx
const [arquivo, setArquivo] = useState(null);

async function enviar() {
  const dados = new FormData();

  dados.append("arquivo", arquivo);

  await api.post("/arquivos", dados, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
}

return (
  <input
    type="file"
    onChange={event => setArquivo(event.target.files?.[0] ?? null)}
  />
);
```
### 3.80 Preview de imagem
```jsx
const [arquivo, setArquivo] = useState(null);

const preview = arquivo
  ? URL.createObjectURL(arquivo)
  : null;

return (
  <>
    <input
      type="file"
      accept="image/*"
      onChange={event => {
        setArquivo(
          event.target.files?.[0] ?? null
        );
      }}
    />

    {preview && (
      <img
        src={preview}
        alt="Pré-visualização"
        width="200"
      />
    )}
  </>
);
```
### 3.81 Dashboard com cards
```jsx
function Dashboard({ resumo }) {
  return (
    <section className="cards">
      <article className="card">
        <span>Total</span>
        <strong>{resumo.total}</strong>
      </article>

      <article className="card">
        <span>Ativos</span>
        <strong>{resumo.ativos}</strong>
      </article>

      <article className="card">
        <span>Valor total</span>
        <strong>
          {resumo.valorTotal.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
          })}
        </strong>
      </article>
    </section>
  );
}
```
### 3.82 Dashboard carregando da API
```jsx
const [resumo, setResumo] = useState(null);

useEffect(() => {
  async function carregar() {
    const response = await api.get("/dashboard");

    setResumo(response.data);
  }

  carregar();
}, []);
```
### 3.83 Modal simples controlado
```jsx
function Modal({
  aberto,
  titulo,
  children,
  onFechar
}) {
  if (!aberto) {
    return null;
  }

  return (
    <div className="modal-backdrop">
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
      >
        <header>
          <h2>{titulo}</h2>

          <button
            type="button"
            onClick={onFechar}
          >
            Fechar
          </button>
        </header>

        {children}
      </div>
    </div>
  );
}
```
### 3.84 Confirmar exclusão com modal
```jsx
const [idExcluir, setIdExcluir] = useState(null);

function solicitarExclusao(id) {
  setIdExcluir(id);
}

async function confirmarExclusao() {
  await api.delete(`/produtos/${idExcluir}`);

  setIdExcluir(null);

  await carregarProdutos();
}
```
### 3.85 Toast simples sem biblioteca
```jsx
function Toast({ mensagem, onFechar }) {
  if (!mensagem) {
    return null;
  }

  return (
    <div role="status">
      <span>{mensagem}</span>

      <button
        type="button"
        onClick={onFechar}
      >
        ×
      </button>
    </div>
  );
}
```
### 3.86 Variáveis de ambiente no Vite
```text
# .env
VITE_API_URL=http://localhost:8080/api
```
```javascript
const apiUrl = import.meta.env.VITE_API_URL;

console.log(apiUrl);
```
### 3.87 Axios usando variável de ambiente
```javascript
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});
```
### 3.88 Build
```bash
npm run build
```
No Vite, o resultado de produção normalmente é gerado em `dist/`.
### 3.89 Preview do build
```bash
npm run preview
```
## 4. Receitas completas para prova
### 4.1 Página CRUD genérica completa
```jsx
import { useCallback, useEffect, useState } from "react";
import { api } from "./api";

const filtrosIniciais = {
  busca: "",
  status: ""
};

export default function RegistrosPage() {
  const [registros, setRegistros] = useState([]);
  const [filtros, setFiltros] = useState(filtrosIniciais);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const carregar = useCallback(async () => {
    try {
      setLoading(true);
      setErro("");

      const response = await api.get("/registros", {
        params: {
          ...filtros,
          page,
          size: 10,
          sort: "id",
          direction: "desc"
        }
      });

      setRegistros(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      setErro(
        error.response?.data?.message ??
        "Falha ao carregar"
      );
    } finally {
      setLoading(false);
    }
  }, [filtros, page]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  function handleFiltro(event) {
    const { name, value } = event.target;

    setFiltros(anterior => ({
      ...anterior,
      [name]: value
    }));

    setPage(0);
  }

  async function excluir(id) {
    if (!window.confirm("Excluir registro?")) {
      return;
    }

    await api.delete(`/registros/${id}`);

    await carregar();
  }

  return (
    <main>
      <h1>Registros</h1>

      <section>
        <input
          name="busca"
          value={filtros.busca}
          onChange={handleFiltro}
          placeholder="Buscar..."
        />

        <select
          name="status"
          value={filtros.status}
          onChange={handleFiltro}
        >
          <option value="">Todos</option>
          <option value="ATIVO">Ativo</option>
          <option value="INATIVO">Inativo</option>
        </select>
      </section>

      {loading && <p>Carregando...</p>}
      {erro && <p role="alert">{erro}</p>}

      {!loading && !erro && (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {registros.map(registro => (
              <tr key={registro.id}>
                <td>{registro.id}</td>
                <td>{registro.nome}</td>
                <td>{registro.status}</td>
                <td>
                  <button
                    type="button"
                    onClick={() => excluir(registro.id)}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <footer>
        <button
          type="button"
          disabled={page === 0}
          onClick={() => setPage(p => p - 1)}
        >
          Anterior
        </button>

        <span>
          {page + 1} / {Math.max(totalPages, 1)}
        </span>

        <button
          type="button"
          disabled={page + 1 >= totalPages}
          onClick={() => setPage(p => p + 1)}
        >
          Próxima
        </button>
      </footer>
    </main>
  );
}
```
### 4.2 Login completo com estado e erro
```jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "./api";

export default function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    senha: ""
  });

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setForm(anterior => ({
      ...anterior,
      [name]: value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setLoading(true);
      setErro("");

      const response = await api.post(
        "/auth/login",
        form
      );

      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "usuario",
        JSON.stringify(response.data.usuario)
      );

      navigate("/dashboard");
    } catch (error) {
      setErro(
        error.response?.data?.message ??
        "E-mail ou senha inválidos"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <h1>Entrar</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="email">
          E-mail
        </label>

        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="senha">
          Senha
        </label>

        <input
          id="senha"
          name="senha"
          type="password"
          value={form.senha}
          onChange={handleChange}
          required
        />

        {erro && (
          <p role="alert">
            {erro}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </main>
  );
}
```
### 4.3 AuthContext completo
```jsx
import {
  createContext,
  useContext,
  useMemo,
  useState
} from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const salvo = localStorage.getItem("usuario");

    return salvo
      ? JSON.parse(salvo)
      : null;
  });

  function login(dados) {
    localStorage.setItem(
      "token",
      dados.token
    );

    localStorage.setItem(
      "usuario",
      JSON.stringify(dados.usuario)
    );

    setUsuario(dados.usuario);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");

    setUsuario(null);
  }

  const value = useMemo(() => ({
    usuario,
    autenticado: Boolean(usuario),
    login,
    logout
  }), [usuario]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const contexto = useContext(AuthContext);

  if (!contexto) {
    throw new Error(
      "useAuth deve ser usado dentro de AuthProvider"
    );
  }

  return contexto;
}
```
### 4.4 Rota protegida baseada em contexto
```jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export function ProtectedRoute({ children }) {
  const { autenticado } = useAuth();

  if (!autenticado) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return children;
}
```
### 4.5 Filtro avançado com vários campos
```jsx
const inicial = {
  busca: "",
  categoria: "",
  status: "",
  valorMin: "",
  valorMax: "",
  dataInicio: "",
  dataFim: ""
};

function Filtros({ onAplicar }) {
  const [form, setForm] = useState(inicial);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm(anterior => ({
      ...anterior,
      [name]: value
    }));
  }

  function aplicar(event) {
    event.preventDefault();

    onAplicar({
      ...form,
      valorMin:
        form.valorMin === ""
          ? undefined
          : Number(form.valorMin),
      valorMax:
        form.valorMax === ""
          ? undefined
          : Number(form.valorMax)
    });
  }

  function limpar() {
    setForm(inicial);
    onAplicar({});
  }

  return (
    <form onSubmit={aplicar}>
      <input
        name="busca"
        value={form.busca}
        onChange={handleChange}
        placeholder="Busca livre"
      />

      <input
        name="categoria"
        value={form.categoria}
        onChange={handleChange}
        placeholder="Categoria"
      />

      <select
        name="status"
        value={form.status}
        onChange={handleChange}
      >
        <option value="">Todos</option>
        <option value="ATIVO">Ativo</option>
        <option value="INATIVO">Inativo</option>
      </select>

      <input
        name="valorMin"
        type="number"
        value={form.valorMin}
        onChange={handleChange}
        placeholder="Valor mínimo"
      />

      <input
        name="valorMax"
        type="number"
        value={form.valorMax}
        onChange={handleChange}
        placeholder="Valor máximo"
      />

      <input
        name="dataInicio"
        type="date"
        value={form.dataInicio}
        onChange={handleChange}
      />

      <input
        name="dataFim"
        type="date"
        value={form.dataFim}
        onChange={handleChange}
      />

      <button type="submit">
        Aplicar
      </button>

      <button
        type="button"
        onClick={limpar}
      >
        Limpar
      </button>
    </form>
  );
}
```
### 4.6 API service separado por domínio
```javascript
import { api } from "./api";

export const produtoService = {
  listar(params) {
    return api.get("/produtos", {
      params
    });
  },

  buscarPorId(id) {
    return api.get(`/produtos/${id}`);
  },

  criar(payload) {
    return api.post(
      "/produtos",
      payload
    );
  },

  atualizar(id, payload) {
    return api.put(
      `/produtos/${id}`,
      payload
    );
  },

  excluir(id) {
    return api.delete(
      `/produtos/${id}`
    );
  }
};
```
### 4.7 Componente de campo reutilizável
```jsx
function Campo({
  label,
  erro,
  id,
  ...inputProps
}) {
  return (
    <div>
      <label htmlFor={id}>
        {label}
      </label>

      <input
        id={id}
        aria-invalid={Boolean(erro)}
        {...inputProps}
      />

      {erro && (
        <small role="alert">
          {erro}
        </small>
      )}
    </div>
  );
}
```
### 4.8 Componente de botão com loading
```jsx
function BotaoSalvar({
  loading,
  children = "Salvar"
}) {
  return (
    <button
      type="submit"
      disabled={loading}
    >
      {loading
        ? "Salvando..."
        : children}
    </button>
  );
}
```
### 4.9 Estado de requisição reutilizável
```jsx
const [request, setRequest] = useState({
  loading: false,
  erro: ""
});

async function executar() {
  try {
    setRequest({
      loading: true,
      erro: ""
    });

    await api.post("/registros", payload);
  } catch (error) {
    setRequest({
      loading: false,
      erro:
        error.response?.data?.message ??
        "Falha na operação"
    });

    return;
  }

  setRequest({
    loading: false,
    erro: ""
  });
}
```
### 4.10 CRUD em memória para prova sem backend
```jsx
import { useState } from "react";

export default function App() {
  const [nome, setNome] = useState("");

  const [itens, setItens] = useState([
    {
      id: 1,
      nome: "Exemplo"
    }
  ]);

  function adicionar(event) {
    event.preventDefault();

    if (!nome.trim()) {
      return;
    }

    setItens(anteriores => [
      ...anteriores,
      {
        id: Date.now(),
        nome: nome.trim()
      }
    ]);

    setNome("");
  }

  function excluir(id) {
    setItens(anteriores =>
      anteriores.filter(
        item => item.id !== id
      )
    );
  }

  return (
    <main>
      <form onSubmit={adicionar}>
        <input
          value={nome}
          onChange={event =>
            setNome(event.target.value)
          }
        />

        <button type="submit">
          Adicionar
        </button>
      </form>

      <ul>
        {itens.map(item => (
          <li key={item.id}>
            {item.nome}

            <button
              type="button"
              onClick={() => excluir(item.id)}
            >
              Excluir
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
```
## 5. Padrões rápidos de adaptação
### Trocar Produto por Aluno
- Renomeie o domínio visual e os endpoints.
- Troque campos `preco`/`estoque` por `matricula`/`curso`/`situacao`.
- Mantenha o mesmo fluxo de lista, formulário, filtros e paginação.

### Trocar Produto por Cliente
- Use campos como `nome`, `email`, `telefone`, `cidade`, `ativo`.
- Filtros comuns: nome, cidade, ativo.
- Dashboard: total de clientes e clientes ativos.

### Trocar Produto por Livro
- Use `titulo`, `autor`, `isbn`, `ano`, `disponivel`.
- Filtros comuns: título, autor e disponibilidade.
- Tabela e formulário continuam com a mesma arquitetura.

### Trocar Produto por Pedido
- Use `cliente`, `status`, `valorTotal`, `data`.
- Filtros comuns: status, período e faixa de valor.
- Pode exigir tela de itens do pedido além do cabeçalho.

## 6. Checklist de prova
- O projeto inicia sem erro?
- A rota da API está correta?
- O `baseURL` do Axios aponta para a porta certa?
- O CORS do backend permite o frontend?
- O token JWT está sendo enviado no `Authorization`?
- A rota protegida redireciona sem login?
- O formulário usa `value` e `onChange` corretamente?
- Os números são convertidos com `Number(...)` antes de enviar?
- Checkbox usa `event.target.checked`?
- A tabela usa `key` estável?
- O CRUD recarrega a lista após criar/editar/excluir?
- Filtros voltam para página 0 ao mudar?
- Paginação usa `totalPages` do backend?
- Erros da API são exibidos para o usuário?
- Loading desabilita ações duplicadas?
- Campos obrigatórios têm validação?
- IDs de edição/exclusão são os IDs reais da API?
- Não há `console.log` de senha/token sensível em produção?
- Variáveis Vite começam com `VITE_`?
- O build `npm run build` funciona?

## 7. Mapa mental rápido
```text
HTML
│
├── estrutura
├── semântica
├── formulários
├── tabelas
├── inputs
└── acessibilidade

JavaScript
│
├── tipos
├── condições
├── loops
├── funções
├── arrays
├── objetos
├── promises
├── fetch
├── DOM
├── eventos
└── storage

React
│
├── componentes
├── JSX
├── props
├── state
├── eventos
├── formulários
├── hooks
├── Context
├── Router
├── API
├── JWT
├── CRUD
├── filtros
├── paginação
└── dashboard
```
## 8. Referência rápida de sintaxe
| Necessidade | Sintaxe |
| --- | --- |
| Interpolar JSX | `{valor}` |
| Evento React | `onClick={funcao}` |
| State | `const [x, setX] = useState(valor)` |
| Efeito inicial | `useEffect(() => {}, [])` |
| Lista | `array.map(item => ...)` |
| Filtro | `array.filter(item => ...)` |
| Buscar item | `array.find(item => ...)` |
| Somar | `array.reduce((a, b) => a + b, 0)` |
| Copiar array | `[...array]` |
| Copiar objeto | `{...objeto}` |
| GET Axios | `api.get('/rota')` |
| POST Axios | `api.post('/rota', payload)` |
| PUT Axios | `api.put('/rota/1', payload)` |
| DELETE Axios | `api.delete('/rota/1')` |
| Query string | `api.get('/rota', { params })` |
| Token | `Authorization: Bearer <token>` |

## 9. Exemplos-relâmpago adicionais
### Converter texto para inteiro
```javascript
const idade = Number.parseInt("25", 10);
```
### Converter texto para decimal
```javascript
const valor = Number.parseFloat("10.50");
```
### Verificar NaN
```javascript
console.log(Number.isNaN(Number("abc")));
```
### Arredondar duas casas
```javascript
const valor = Number(10.567.toFixed(2));
```
### Maior valor do array
```javascript
const maior = Math.max(...[1, 5, 3]);
```
### Menor valor do array
```javascript
const menor = Math.min(...[1, 5, 3]);
```
### Somar objetos
```javascript
const total = itens.reduce((soma, item) => soma + item.valor, 0);
```
### Contar itens filtrados
```javascript
const ativos = itens.filter(item => item.ativo).length;
```
### Encontrar por ID
```javascript
const item = itens.find(item => item.id === id);
```
### Remover por ID
```javascript
const novos = itens.filter(item => item.id !== id);
```
### Atualizar por ID
```javascript
const novos = itens.map(item =>
  item.id === atualizado.id
    ? atualizado
    : item
);
```
### Adicionar ao array
```javascript
const novos = [...itens, novoItem];
```
### Prepend no array
```javascript
const novos = [novoItem, ...itens];
```
### Toggle boolean
```javascript
setAtivo(valor => !valor);
```
### Limpar formulário
```jsx
setForm(formInicial);
```
### Redirecionar
```jsx
navigate("/dashboard");
```
### Ler parâmetro de rota
```jsx
const { id } = useParams();
```
### Ler query string
```jsx
const busca = searchParams.get("busca") ?? "";
```
### Salvar token
```javascript
localStorage.setItem("token", token);
```
### Ler token
```javascript
const token = localStorage.getItem("token");
```
### Excluir token
```javascript
localStorage.removeItem("token");
```
### Input texto React
```jsx
<input value={nome} onChange={e => setNome(e.target.value)} />
```
### Checkbox React
```jsx
<input type="checkbox" checked={ativo} onChange={e => setAtivo(e.target.checked)} />
```
### Select React
```jsx
<select value={status} onChange={e => setStatus(e.target.value)}>
  <option value="">Todos</option>
  <option value="ATIVO">Ativo</option>
</select>
```
### Botão desabilitado
```jsx
<button disabled={loading}>Salvar</button>
```
### Mensagem condicional
```jsx
{erro && <p>{erro}</p>}
```
### Ternário JSX
```jsx
{ativo ? <span>Ativo</span> : <span>Inativo</span>}
```
### Lista JSX
```jsx
{itens.map(item => (
  <div key={item.id}>
    {item.nome}
  </div>
))}
```
### Formatar moeda
```javascript
const texto = valor.toLocaleString("pt-BR", {
  style: "currency",
  currency: "BRL"
});
```
### Formatar data
```javascript
const texto = new Date(data).toLocaleDateString("pt-BR");
```
### Objeto sem campo vazio
```javascript
const limpo = Object.fromEntries(
  Object.entries(objeto).filter(([, valor]) => valor !== "")
);
```
### Esperar múltiplas APIs
```javascript
const [a, b] = await Promise.all([
  api.get("/a"),
  api.get("/b")
]);
```
### Capturar erro Axios
```javascript
const mensagem =
  error.response?.data?.message ??
  error.message ??
  "Erro inesperado";
```
## 10. Conclusão
A lógica principal para adaptar qualquer exercício é separar responsabilidades: HTML define estrutura e semântica; JavaScript manipula dados, eventos e APIs; React organiza a interface em componentes e estados. Em prova, identifique primeiro o domínio, depois os campos, depois o CRUD, e só então adicione autenticação, filtros, paginação e dashboard.
## Apêndice A — Consulta expressa por implementação
### A — Adicionar item ao state
```javascript
setItens(anteriores => [...anteriores, novoItem]);
```
### A — Alterar campo de objeto
```javascript
setForm(anterior => ({ ...anterior, nome: valor }));
```
### A — Atualizar item por ID
```javascript
setItens(xs => xs.map(x => x.id === item.id ? item : x));
```
### B — Buscar em array
```javascript
const achado = itens.find(item => item.id === id);
```
### B — Buscar texto ignorando maiúsculas
```javascript
nome.toLowerCase().includes(busca.toLowerCase())
```
### C — Clonar objeto
```javascript
const copia = { ...objeto };
```
### C — Clonar array
```javascript
const copia = [...array];
```
### C — Converter para número
```javascript
const numero = Number(valor);
```
### D — Desabilitar botão
```javascript
<button disabled={loading}>Salvar</button>
```
### E — Excluir item do state
```javascript
setItens(xs => xs.filter(x => x.id !== id));
```
### F — Filtrar
```javascript
const filtrados = itens.filter(item => item.ativo);
```
### F — Formatar moeda
```javascript
valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
```
### G — GET
```javascript
const response = await api.get("/rota");
```
### J — JSON para objeto
```javascript
const obj = JSON.parse(json);
```
### J — Objeto para JSON
```javascript
const json = JSON.stringify(obj);
```
### L — Ler localStorage
```javascript
const valor = localStorage.getItem("chave");
```
### M — Mapear array
```javascript
const nomes = itens.map(item => item.nome);
```
### N — Navegar com React Router
```javascript
navigate("/destino");
```
### P — POST
```javascript
await api.post("/rota", payload);
```
### P — Promise paralela
```javascript
const [a, b] = await Promise.all([pa, pb]);
```
### R — Remover localStorage
```javascript
localStorage.removeItem("chave");
```
### S — Salvar localStorage
```javascript
localStorage.setItem("chave", valor);
```
### S — Somar array
```javascript
const total = valores.reduce((a, b) => a + b, 0);
```
### T — Toggle boolean
```javascript
setAtivo(v => !v);
```
### U — PUT
```javascript
await api.put("/rota/1", payload);
```
### V — Validar obrigatório
```javascript
if (!nome.trim()) throw new Error("Nome obrigatório");
```
## Apêndice B — Catálogo de padrões pequenos
### Array vazio
```javascript
const itens = [];
```
### Objeto vazio
```javascript
const dados = {};
```
### Função assíncrona
```javascript
async function carregar() {
  return await Promise.resolve(true);
}
```
### Clone profundo simples por structuredClone
```javascript
const copia = structuredClone(objeto);
```
### Retornar boolean
```javascript
const maior = idade >= 18;
```
### Coalescência nula
```javascript
const nome = recebido ?? "Sem nome";
```
### Optional chaining
```javascript
const cidade = usuario.endereco?.cidade;
```
### Desestruturar props
```jsx
function Card({ titulo, children }) {
  return <section><h2>{titulo}</h2>{children}</section>;
}
```
### ClassName condicional
```jsx
const classe = ativo ? "ativo" : "inativo";
```
### Template de classe
```jsx
<div className={`card ${ativo ? "ativo" : ""}`}>...</div>
```
### Evento submit
```jsx
<form onSubmit={handleSubmit}>...</form>
```
### Prevent default React
```javascript
function handleSubmit(event) {
  event.preventDefault();
}
```
### Entrada numérica React
```jsx
<input type="number" value={valor} onChange={e => setValor(e.target.value)} />
```
### Converter antes de enviar
```javascript
const payload = { valor: Number(form.valor) };
```
### Lista ordenada por cópia
```javascript
const ordenados = [...itens].sort((a, b) => a.nome.localeCompare(b.nome));
```
### Lista por valor desc
```javascript
const ordenados = [...itens].sort((a, b) => b.valor - a.valor);
```
### Estado inicial por função
```jsx
const [usuario] = useState(() => JSON.parse(localStorage.getItem("usuario")) ?? null);
```
### Efeito com cleanup
```jsx
useEffect(() => {
  const id = setInterval(fn, 1000);
  return () => clearInterval(id);
}, []);
```
### Header Bearer
```javascript
config.headers.Authorization = `Bearer ${token}`;
```
### Query params Axios
```javascript
api.get("/itens", { params: { page: 0, size: 10 } });
```
### Status HTTP Axios
```javascript
const status = error.response?.status;
```
### Resposta Spring Page
```javascript
const { content, number, totalPages, totalElements } = response.data;
```
### Controlar modal
```jsx
const [aberto, setAberto] = useState(false);
```
### Abrir modal
```jsx
<button onClick={() => setAberto(true)}>Abrir</button>
```
### Fechar modal
```jsx
<button onClick={() => setAberto(false)}>Fechar</button>
```
### Loading condicional
```jsx
{loading ? <p>Carregando...</p> : <Lista itens={itens} />}
```
### Erro condicional
```jsx
{erro && <p role="alert">{erro}</p>}
```
### Empty state
```jsx
{itens.length === 0 && <p>Nenhum resultado.</p>}
```
### Desabilitar próxima página
```jsx
<button disabled={page + 1 >= totalPages}>Próxima</button>
```
### Desabilitar página anterior
```jsx
<button disabled={page === 0}>Anterior</button>
```
### Resetar página ao filtrar
```javascript
setPage(0);
```
### Resetar formulário
```javascript
setForm(formInicial);
```
### Campo obrigatório HTML
```html
<input name="nome" required>
```
### Campo mínimo HTML
```html
<input type="number" min="0">
```
### Campo máximo HTML
```html
<input type="number" max="100">
```
### Comprimento mínimo
```html
<input minlength="3">
```
### Comprimento máximo
```html
<input maxlength="50">
```
### Pattern
```html
<input pattern="[A-Za-z]+">
```
### Autocomplete
```html
<input name="email" autocomplete="email">
```
### Placeholder
```html
<input placeholder="Digite aqui">
```
### Readonly
```html
<input value="fixo" readonly>
```
### Disabled
```html
<input value="bloqueado" disabled>
```
### Data attribute
```html
<button data-id="10">Editar</button>
```
### Ler dataset
```javascript
const id = botao.dataset.id;
```
### Criar elemento
```javascript
const div = document.createElement("div");
```
### Adicionar classe
```javascript
elemento.classList.add("ativo");
```
### Remover classe
```javascript
elemento.classList.remove("ativo");
```
### Toggle classe
```javascript
elemento.classList.toggle("ativo");
```
### Selecionar ID
```javascript
const el = document.querySelector("#id");
```
### Selecionar classe
```javascript
const el = document.querySelector(".classe");
```
### Selecionar todos
```javascript
const els = document.querySelectorAll(".item");
```
### Texto DOM
```javascript
el.textContent = "Novo";
```
### Atributo DOM
```javascript
el.setAttribute("title", "Ajuda");
```
### Remover atributo
```javascript
el.removeAttribute("disabled");
```
### Evento click DOM
```javascript
el.addEventListener("click", handler);
```
### Evento input DOM
```javascript
input.addEventListener("input", e => console.log(e.target.value));
```
### Evento change DOM
```javascript
select.addEventListener("change", e => console.log(e.target.value));
```
### Validar formulário nativo
```javascript
if (!form.checkValidity()) form.reportValidity();
```
### FormData a objeto
```javascript
const obj = Object.fromEntries(new FormData(form));
```
### Fetch status
```javascript
if (!response.ok) throw new Error(`HTTP ${response.status}`);
```
### Fetch JSON
```javascript
const dados = await response.json();
```
### Fetch texto
```javascript
const texto = await response.text();
```
### Fetch POST JSON
```javascript
fetch("/api", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
```
### Abortar fetch
```javascript
controller.abort();
```
### Timeout com Promise
```javascript
await new Promise(resolve => setTimeout(resolve, 1000));
```
### Regex telefone simples
```javascript
const ok = /^\d{10,11}$/.test(telefone.replace(/\D/g, ''));
```
### Remover não dígitos
```javascript
const numeros = texto.replace(/\D/g, '');
```
### Capitalizar
```javascript
const cap = texto.charAt(0).toUpperCase() + texto.slice(1);
```
### Data ISO para BR
```javascript
const br = new Date(data).toLocaleDateString("pt-BR");
```
### Moeda BR
```javascript
const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor);
```
### Percentual
```javascript
const pct = new Intl.NumberFormat("pt-BR", { style: "percent" }).format(0.15);
```
### Remover duplicados
```javascript
const unicos = [...new Set(valores)];
```
### Agrupar com reduce
```javascript
const grupos = itens.reduce((acc, item) => { (acc[item.categoria] ??= []).push(item); return acc; }, {});
```
### Somar propriedade
```javascript
const total = itens.reduce((s, item) => s + item.valor, 0);
```
### Média
```javascript
const media = valores.reduce((a, b) => a + b, 0) / valores.length;
```
### Verificar todos
```javascript
const todosAtivos = itens.every(item => item.ativo);
```
### Verificar algum
```javascript
const existeAtivo = itens.some(item => item.ativo);
```
### Encontrar índice
```javascript
const indice = itens.findIndex(item => item.id === id);
```
### String inclui
```javascript
const contem = texto.includes("abc");
```
### String começa
```javascript
const comeca = texto.startsWith("abc");
```
### String termina
```javascript
const termina = texto.endsWith("xyz");
```
### Trim
```javascript
const limpo = texto.trim();
```
### Split
```javascript
const partes = texto.split(",");
```
### Join
```javascript
const texto = itens.join(", ");
```
### URLSearchParams
```javascript
const params = new URLSearchParams({ page: '0', size: '10' });
```
### Lazy import
```jsx
const Pagina = lazy(() => import("./Pagina"));
```
### Suspense
```jsx
<Suspense fallback={<p>Carregando...</p>}><Pagina /></Suspense>
```
### Memo
```jsx
export default memo(Componente);
```
### Custom hook
```jsx
function useBoolean(inicial=false) {
  const [valor,setValor]=useState(inicial);
  return [valor, () => setValor(v => !v)];
}
```
### Contexto
```jsx
const MeuContexto = createContext(null);
```
### Provider
```jsx
<MeuContexto.Provider value={valor}>{children}</MeuContexto.Provider>
```
### Consumir contexto
```jsx
const valor = useContext(MeuContexto);
```
### useRef
```jsx
const ref = useRef(null);
```
### Focar input
```jsx
ref.current?.focus();
```
### useMemo
```jsx
const filtrados = useMemo(() => itens.filter(fn), [itens]);
```
### useCallback
```jsx
const handler = useCallback(() => executar(id), [id]);
```
### Navigate
```jsx
return <Navigate to="/login" replace />;
```
### Outlet
```jsx
<Outlet />
```
### Link
```jsx
<Link to="/dashboard">Dashboard</Link>
```
### Params
```jsx
const { id } = useParams();
```
## Apêndice C — Glossário rápido
| Termo | Definição |
| --- | --- |
| API | Interface utilizada para comunicação entre aplicações. |
| Callback | Função passada para outra função ser executada depois. |
| Componente | Unidade reutilizável de interface no React. |
| Context | Mecanismo do React para compartilhar valores entre componentes. |
| DOM | Representação da página HTML em objetos manipuláveis por JavaScript. |
| Endpoint | Endereço específico de uma API. |
| Hook | Função especial do React para usar recursos como estado e efeitos. |
| JSX | Sintaxe que permite escrever estrutura semelhante a HTML dentro do JavaScript. |
| Promise | Objeto que representa resultado futuro de uma operação assíncrona. |
| Props | Dados recebidos por um componente React. |
| REST | Estilo arquitetural comum para APIs HTTP. |
| State | Dados internos que podem mudar e provocar nova renderização. |
| Token | Valor usado para representar autenticação/autorização. |
| Vite | Ferramenta de desenvolvimento e build muito usada em projetos frontend modernos. |
