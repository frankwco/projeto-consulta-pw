interface NavItem {
  label: string;
  href: string;
}

interface NavbarProps {
  items: NavItem[];
  ariaLabel?: string;
}

export function Navbar({ items, ariaLabel = "Navegação principal" }: NavbarProps) {
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
