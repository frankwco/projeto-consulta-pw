import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger";
}

// Exemplo: import { Button } from "./componentes-genericos/typescript-html";
export function Button({ children, variant = "primary", className = "", ...props }: ButtonProps) {
  return (
    <button className={`ui-button ui-button--${variant} ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}
