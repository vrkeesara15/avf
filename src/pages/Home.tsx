import { Link } from "react-router-dom";
import {
  metrics,
  programs,
  stories,
  testimonials,
  donationTiers,
  posts,
  partners,
} from "../data/content";
import { ImpactCounter, formatNumber } from "../components/ImpactCounter";
import { Carousel } from "../components/Carousel";

export function Home() {
  const heroMetrics = metrics.slice(0, 4);
  const featuredPrograms = programs.slice(0, 6);
  const latestNews = posts.slice(0, 3);

  return (
    <>
      {/* ---------------- HERO (HP-01, HP-02, HP-10) ---------------- */}
      <section className="hero">
        <div className="container hero__inner">
          <div>
            <span className="hero__pill">
              🌟 Serving Hyderabad's communities since 2013
            </span>
            <h1 className="hero__tagline">
              Every child deserves a <em>chance to learn</em> and a future to
              dream of.
            </h1>
            <p className="hero__lead">
              Akshaya Vidya Foundation educates underprivileged children,
              empowers women and youth, and uplifts communities across the twin
              cities — one life at a time.
            </p>
            <div className="hero__ctas">
              <Link to="/donate" className="btn btn--donate btn--lg">
                ❤ Donate Now
              </Link>
              <Link to="/get-involved" className="btn btn--on-dark btn--lg">
                Volunteer
              </Link>
              <Link to="/programs" className="btn btn--on-dark btn--lg">
                Learn About Our Work
              </Link>
            </div>
          </div>

          <div className="hero__card">
            <h3>Our impact at a glance</h3>
            <div className="hero__stat-row">
              {heroMetrics.map((m) => (
                <ImpactCounter key={m.id} metric={m} />
              ))}
            </div>
            <Link
              to="/impact"
              className="btn btn--primary btn--block"
              style={{ marginTop: "1.5rem" }}
            >
              See the full impact →
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------- PROGRAMMES (HP-04) ---------------- */}
      <section className="section" id="programs">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">What we do</span>
            <h2>Our Programmes</h2>
            <p>
              Eight focused verticals spanning education, empowerment and
              community support — each designed to break the cycle of
              disadvantage.
            </p>
          </div>
          <div className="grid grid--3">
            {featuredPrograms.map((p) => (
              <Link
                to={`/programs/${p.slug}`}
                key={p.slug}
                className="card card--hover program-card"
              >
                <div
                  className="program-card__media"
                  style={{ background: p.color }}
                  aria-hidden="true"
                >
                  {p.icon}
                </div>
                <div className="program-card__body">
                  <span className="badge">{p.category}</span>
                  <h3 style={{ marginTop: "0.6rem" }}>{p.name}</h3>
                  <p>{p.short}</p>
                  <span className="program-card__link">Learn more →</span>
                </div>
              </Link>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
            <Link to="/programs" className="btn btn--ghost btn--lg">
              View all programmes
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------- MID-PAGE DONATE BLOCK (HP-06) ---------------- */}
      <section className="section section--alt">
        <div className="container split">
          <div>
            <span className="eyebrow">Your gift, real change</span>
            <h2>₹2,400 gives one child a full year of learning</h2>
            <p className="lead">
              Every rupee is accounted for, and you'll receive an instant
              80G-compliant tax receipt. Choose an impact level below and donate
              securely.
            </p>
            <ul className="fact-list" style={{ marginBottom: "1.5rem" }}>
              <li>Secure UPI, card &amp; net-banking via Razorpay</li>
              <li>Instant 80G tax-exemption receipt by email</li>
              <li>100% transparency — see exactly where it goes</li>
            </ul>
            <Link to="/donate" className="btn btn--donate btn--lg">
              ❤ Donate Now
            </Link>
          </div>
          <div className="grid grid--2">
            {donationTiers.map((t) => (
              <Link
                to={`/donate?amount=${t.amount}`}
                key={t.id}
                className="card card--hover"
                style={{ padding: "1.5rem", textDecoration: "none" }}
              >
                <div className="tier__amount">₹{formatNumber(t.amount)}</div>
                <div className="tier__impact">{t.impact}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- IMPACT COUNTERS (HP-03) ---------------- */}
      <section className="section section--navy">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Twelve years of change</span>
            <h2>The difference we've made together</h2>
          </div>
          <div className="grid grid--4">
            {metrics.slice(0, 8).map((m) => (
              <ImpactCounter key={m.id} metric={m} dark />
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- SUCCESS STORIES (HP-05) ---------------- */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">AVF Stars</span>
            <h2>Stories of transformation</h2>
            <p>Real children, women and youth whose lives took a new direction.</p>
          </div>
          <Carousel
            label="Success stories"
            slides={stories.map((s) => (
              <article className="card story-card" key={s.id}>
                <div
                  className="story-card__avatar"
                  style={{ background: s.color }}
                  aria-hidden="true"
                >
                  {s.initials}
                </div>
                <div>
                  <span className="badge badge--orange">{s.program}</span>
                  <h3 style={{ margin: "0.6rem 0" }}>{s.headline}</h3>
                  <blockquote>"{s.body}"</blockquote>
                  <p style={{ marginTop: "1rem", color: "var(--avf-muted)" }}>
                    — {s.name}, {s.year}
                  </p>
                </div>
              </article>
            ))}
          />
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <Link to="/impact" className="btn btn--ghost">
              Read more AVF Stars
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------- TESTIMONIALS (HP-09) ---------------- */}
      <section className="section section--alt">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Trusted by many</span>
            <h2>What people say about us</h2>
          </div>
          <div className="grid grid--2">
            {testimonials.map((t) => (
              <figure className="card quote" key={t.id} style={{ margin: 0 }}>
                <blockquote className="quote__text">"{t.quote}"</blockquote>
                <figcaption className="quote__who">
                  <span
                    className="quote__chip"
                    style={{ background: t.color }}
                    aria-hidden="true"
                  >
                    {t.initials}
                  </span>
                  <span>
                    <span className="quote__name">{t.name}</span>
                    <br />
                    <span className="quote__role">{t.role}</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- LATEST NEWS (HP-07) ---------------- */}
      <section className="section">
        <div className="container">
          <div className="section-head section-head--left">
            <span className="eyebrow">Newsroom</span>
            <h2>Latest news &amp; updates</h2>
          </div>
          <div className="grid grid--3">
            {latestNews.map((n) => (
              <article className="card card--hover" key={n.id}>
                <div
                  className="news-card__media"
                  style={{ background: n.color }}
                  aria-hidden="true"
                >
                  {n.icon}
                </div>
                <div className="news-card__body">
                  <div className="news-card__meta">
                    <span className="badge">{n.category}</span> · {n.date}
                  </div>
                  <h3>{n.title}</h3>
                  <p style={{ color: "var(--avf-muted)" }}>{n.excerpt}</p>
                </div>
              </article>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
            <Link to="/news" className="btn btn--ghost btn--lg">
              Visit the newsroom
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------- PARTNERS (HP-08) ---------------- */}
      <section className="section section--tight section--alt">
        <div className="container">
          <p
            style={{
              textAlign: "center",
              color: "var(--avf-muted)",
              fontWeight: 600,
              marginBottom: "1.5rem",
            }}
          >
            Supported &amp; endorsed by
          </p>
          <div className="marquee">
            <div className="marquee__track">
              {[...partners, ...partners].map((p, i) => (
                <span className="marquee__item" key={i}>
                  🤝 {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- FINAL CTA ---------------- */}
      <section className="section">
        <div className="container">
          <div className="cta-band">
            <h2>Be the reason a child stays in school</h2>
            <p>
              Whether you give, volunteer, or partner with us — you become part
              of a movement that has already changed thousands of lives.
            </p>
            <div className="cta-band__btns">
              <Link to="/donate" className="btn btn--lg" style={{ background: "#fff", color: "var(--avf-orange-600)" }}>
                ❤ Donate
              </Link>
              <Link to="/get-involved" className="btn btn--on-dark btn--lg">
                Become a Volunteer
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
