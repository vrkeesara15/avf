import { Link } from "react-router-dom";
import { org } from "../data/content";

export function Logo({ footer = false }: { footer?: boolean }) {
  return (
    <Link
      to="/"
      className={footer ? "brand footer__brand" : "brand"}
      aria-label={`${org.name} — home`}
    >
      <svg
        className="brand__mark"
        viewBox="0 0 64 64"
        role="img"
        aria-hidden="true"
        focusable="false"
      >
        <rect width="64" height="64" rx="14" fill="#1B4F8A" />
        <path d="M32 12 L50 52 H40 L32 32 L24 52 H14 Z" fill="#FFFFFF" />
        <circle cx="32" cy="22" r="6" fill="#F2792B" />
      </svg>
      <span className="brand__text">
        <span className="brand__name">Akshaya Vidya</span>
        <span className="brand__tag">{org.tagline}</span>
      </span>
    </Link>
  );
}
