export function Footer({ children, owner = "Minha aplicação" }) {
  return (
    <footer className="ui-footer">
      {children ?? <small>© {new Date().getFullYear()} {owner}</small>}
    </footer>
  );
}
