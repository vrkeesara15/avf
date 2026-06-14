import { Link } from "react-router-dom";

export interface Crumb {
  label: string;
  to?: string;
}

/** NAV-05 — breadcrumb navigation on inner pages. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol>
        {items.map((c, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={c.label} {...(isLast ? { "aria-current": "page" } : {})}>
              {c.to && !isLast ? <Link to={c.to}>{c.label}</Link> : c.label}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
