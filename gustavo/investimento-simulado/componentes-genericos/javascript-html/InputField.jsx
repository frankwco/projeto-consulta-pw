export function InputField({ id, label, error, helpText, className = "", ...props }) {
  const descriptionId = error ? `${id}-error` : helpText ? `${id}-help` : undefined;

  return (
    <div className="ui-field">
      <label className="ui-field__label" htmlFor={id}>{label}</label>
      <input
        id={id}
        className={`ui-field__input ${error ? "ui-field__input--error" : ""} ${className}`.trim()}
        aria-invalid={Boolean(error)}
        aria-describedby={descriptionId}
        {...props}
      />
      {error && <small id={`${id}-error`} className="ui-field__error">{error}</small>}
      {!error && helpText && <small id={`${id}-help`} className="ui-field__help">{helpText}</small>}
    </div>
  );
}
