import type { ReactNode } from "react";

interface FooterProps {
  children?: ReactNode;
  owner?: string;
}

export function Footer({ children, owner = "Minha aplicação" }: FooterProps) {
  return (
    <footer className="ui-footer">
      {children ?? <small>© {new Date().getFullYear()} {owner}</small>}
    </footer>
  );
}
