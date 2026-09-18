# Componentes genéricos - React com JavaScript e HTML (JSX)

Os arquivos `.jsx` combinam JavaScript com marcação HTML escrita em JSX. A implementação está em `componentes-genericos/javascript-html/`. Copie a pasta de implementação para dentro de `src` em outro projeto React ou ajuste o caminho do import.

```jsx
import { Button, Form, InputField, Header, Navbar, Table, Footer } from "./componentes-genericos/javascript-html";

export function ExamplePage() {
  function handleSubmit(event) {
    event.preventDefault(); // Impede o navegador de recarregar a página.
  }

  return (
    <>
      <Header title="Meu sistema"><Navbar items={[{ label: "Início", href: "/" }]} /></Header>
      <main>
        <Form title="Cadastro" onSubmit={handleSubmit}>
          <InputField id="name" name="name" label="Nome" required />
          <Button type="submit">Salvar</Button>
        </Form>
        <Table headers={["Nome", "Status"]} rows={[["Ana", "Ativo"]]} />
      </main>
      <Footer owner="Minha empresa" />
    </>
  );
}
```

O `index.js` importa o CSS e reexporta todos os componentes, por isso basta um único caminho de importação.
