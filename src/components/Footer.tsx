import { useState } from "react";
import { Link } from "react-router-dom";
import { org } from "../data/content";
import { footerQuickLinks, footerSupportLinks } from "../data/nav";
import { Logo } from "./Logo";
import { api } from "../lib/api";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  // NAV-07 — copyright with auto-updating year.
  const year = new Date().getFullYear();

  const onSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return;
    // Newsletter signup (NEWS-06). Optimistic — failures are non-blocking.
    try {
      await api.subscribe(email);
    } catch {
      /* ignore network errors for newsletter UX */
    }
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div>
            <Logo footer />
            <p style={{ marginTop: "1rem", maxWidth: "32ch" }}>
              {org.name} works for the comprehensive development of
              underprivileged communities across {org.city} — through education,
              empowerment and relief.
            </p>
            <p style={{ fontSize: "0.85rem" }}>
              <strong>Reg. No:</strong> {org.regNumber}
              <br />
              <strong>CIN:</strong> {org.cin}
            </p>
          </div>

          <div>
            <h4>Quick Links</h4>
            <ul className="footer__links">
              {footerQuickLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4>Support Us</h4>
            <ul className="footer__links">
              {footerSupportLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4>Stay Updated</h4>
            <p style={{ fontSize: "0.92rem" }}>
              Get impact stories and event updates in your inbox.
            </p>
            {subscribed ? (
              <p role="status" style={{ color: "#7ee0ad", fontWeight: 600 }}>
                🎉 You're subscribed — thank you!
              </p>
            ) : (
              <form
                className="footer__newsletter"
                onSubmit={onSubscribe}
                aria-label="Newsletter signup"
              >
                <label htmlFor="newsletter-email" className="visually-hidden">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  className="input"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className="btn btn--donate btn--sm">
                  Join
                </button>
              </form>
            )}
            <div style={{ marginTop: "1.25rem" }}>
              <h4>Contact</h4>
              <p style={{ fontSize: "0.9rem" }}>
                {org.address}
                <br />
                <a href={`tel:${org.phone.replace(/\s/g, "")}`}>{org.phone}</a>
                <br />
                <a href={`mailto:${org.email}`}>{org.email}</a>
              </p>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <span>
            © {year} {org.name}. All rights reserved. ·{" "}
            <Link to="/privacy">Privacy Policy</Link> ·{" "}
            <Link to="/terms">Terms</Link>
          </span>
          <div className="footer__social" aria-label="Social media">
            {org.social.map((s) => (
              <a key={s.label} href={s.href} aria-label={s.label} title={s.label}>
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
