# Componentes genéricos - React com TypeScript e HTML (TSX)

Os arquivos `.tsx` combinam TypeScript com marcação HTML escrita em JSX. A implementação está em `componentes-genericos/typescript-html/`. Copie a pasta de implementação para dentro de `src` em outro projeto React ou ajuste o caminho do import.

```tsx
import { Button, Form, InputField, Header, Navbar, Table, Footer } from "./componentes-genericos/typescript-html";

export function ExamplePage() {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
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

O `index.ts` importa o CSS e reexporta todos os componentes, por isso basta um único caminho de importação.
