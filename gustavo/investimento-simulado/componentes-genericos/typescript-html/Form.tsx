import type { FormHTMLAttributes, ReactNode } from "react";

interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode;
  title?: string;
}

export function Form({ children, title, className = "", ...props }: FormProps) {
  return (
    <form className={`ui-form ${className}`.trim()} {...props}>
      {title && <h2 className="ui-form__title">{title}</h2>}
      {children}
    </form>
  );
}
