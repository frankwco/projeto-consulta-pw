export function Form({ children, title, className = "", ...props }) {
  return (
    <form className={`ui-form ${className}`.trim()} {...props}>
      {title && <h2 className="ui-form__title">{title}</h2>}
      {children}
    </form>
  );
}
