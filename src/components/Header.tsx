import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { mainNav } from "../data/nav";
import { org } from "../data/content";
import { Logo } from "./Logo";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // NAV-03 — compact sticky header on scroll.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Top trust bar — NGO credibility (Trust requirements) */}
      <div className="trustbar">
        <div className="container trustbar__inner">
          <div className="trustbar__badges">
            <span>🛡️ 80G Tax Exemption: {org.reg80G}</span>
            <span>🌐 FCRA Reg: {org.fcra}</span>
            <span>📞 {org.phone}</span>
          </div>
          <div className="trustbar__social" aria-label="Social media">
            {org.social.map((s) => (
              <a key={s.label} href={s.href} aria-label={s.label} title={s.label}>
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      <header className={`header${scrolled ? " header--scrolled" : ""}`}>
        <div className="container header__inner">
          <Logo />

          <nav
            id="primary-nav"
            className={`nav${open ? " is-open" : ""}`}
            aria-label="Primary"
          >
            {mainNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `nav__link${isActive ? " is-active" : ""}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="header__actions">
            {/* NAV-02 — Donate is always-visible & distinctly coloured */}
            <Link to="/donate" className="btn btn--donate btn--sm">
              ❤ Donate
            </Link>
            <button
              type="button"
              className="nav-toggle"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="primary-nav"
              onClick={() => setOpen((v) => !v)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      {open && (
        <button
          type="button"
          className="nav-backdrop"
          aria-label="Close menu overlay"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
