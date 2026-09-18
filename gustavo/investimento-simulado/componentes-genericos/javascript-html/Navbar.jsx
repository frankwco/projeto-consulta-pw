export function Navbar({ items, ariaLabel = "Navegação principal" }) {
  return (
    <nav className="ui-navbar" aria-label={ariaLabel}>
      <ul>
        {items.map((item) => (
          <li key={item.href}><a href={item.href}>{item.label}</a></li>
        ))}
      </ul>
    </nav>
  );
}
