import { Link } from "react-router-dom";
import { PageHeader } from "../components/PageHeader";
import { team, partners, org } from "../data/content";

export function About() {
  return (
    <>
      <PageHeader
        title="About Akshaya Vidya Foundation"
        intro="A Hyderabad-based non-profit working since 2013 for the comprehensive development of underprivileged communities."
        crumbs={[{ label: "Home", to: "/" }, { label: "About" }]}
      />

      {/* Mission narrative — carried over from the original site */}
      <section className="section">
        <div className="container split">
          <div className="prose">
            <span className="eyebrow">Who we are</span>
            <h2>Education and dignity for every underprivileged child</h2>
            <p>
              Akshaya Vidya Foundation (AVF) is a Hyderabad-based non-profit
              founded with the mission of achieving comprehensive development of
              underprivileged communities — with a strong focus on the
              educational needs of slum children, employment opportunities for
              youth, and women empowerment through skill development.
            </p>
            <p>
              Since 2013, AVF has operated Akshaya Vidya Learning Centres across
              the twin cities, running free evening classes that supplement
              government school education with structured academics, life skills
              and mentorship.
            </p>
          </div>
          <div
            className="media-block"
            style={{ background: "linear-gradient(135deg,#1b4f8a,#0f2c4d)" }}
            aria-hidden="true"
          >
            🏫
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section section--alt">
        <div className="container grid grid--2">
          <div className="card" style={{ padding: "2rem" }}>
            <span className="badge badge--orange">Our Mission</span>
            <h3 style={{ marginTop: "0.8rem" }}>
              To break the cycle of disadvantage through education
            </h3>
            <p style={{ color: "var(--avf-ink-soft)" }}>
              We bring free, quality education, vocational skills and community
              support to those who need it most — ensuring no child is left
              behind because of where they were born.
            </p>
          </div>
          <div className="card" style={{ padding: "2rem" }}>
            <span className="badge">Our Vision</span>
            <h3 style={{ marginTop: "0.8rem" }}>
              Empowered, self-reliant communities
            </h3>
            <p style={{ color: "var(--avf-ink-soft)" }}>
              A future where every child learns, every woman earns with dignity,
              and every community can stand on its own.
            </p>
          </div>
        </div>
      </section>

      {/* Our story timeline */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Our journey</span>
            <h2>Twelve years of service</h2>
          </div>
          <div className="grid grid--4">
            {[
              { y: "2013", t: "First AVLC opens", d: "Free evening classes begin in Hyderabad." },
              { y: "2016", t: "Science & Digital", d: "C.V. Raman Science Centre and Digital Education launch." },
              { y: "2019", t: "Women Empowerment", d: "Vocational skills programme placing women in jobs." },
              { y: "2025", t: "5 centres strong", d: "Fifth AVLC opens in Medchal; 8,500+ children reached." },
            ].map((m) => (
              <div className="card" key={m.y} style={{ padding: "1.5rem" }}>
                <div
                  style={{
                    fontSize: "1.8rem",
                    fontWeight: 800,
                    color: "var(--avf-orange-600)",
                  }}
                >
                  {m.y}
                </div>
                <h3 style={{ fontSize: "1.1rem" }}>{m.t}</h3>
                <p style={{ color: "var(--avf-muted)", fontSize: "0.95rem" }}>
                  {m.d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section section--alt">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Leadership</span>
            <h2>The people behind AVF</h2>
          </div>
          <div className="grid grid--4">
            {team.map((m) => (
              <div className="card team-card" key={m.name}>
                <div
                  className="team-card__avatar"
                  style={{ background: m.color }}
                  aria-hidden="true"
                >
                  {m.initials}
                </div>
                <h3 style={{ fontSize: "1.05rem" }}>{m.name}</h3>
                <p style={{ color: "var(--avf-muted)", margin: 0 }}>{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust / compliance */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Transparency &amp; trust</span>
            <h2>Registered, compliant and accountable</h2>
          </div>
          <div className="grid grid--3">
            <div className="card" style={{ padding: "1.5rem", textAlign: "center" }}>
              <div style={{ fontSize: "2rem" }}>🛡️</div>
              <h3>80G Certified</h3>
              <p style={{ color: "var(--avf-muted)" }}>Reg. {org.reg80G}</p>
            </div>
            <div className="card" style={{ padding: "1.5rem", textAlign: "center" }}>
              <div style={{ fontSize: "2rem" }}>🌐</div>
              <h3>FCRA Registered</h3>
              <p style={{ color: "var(--avf-muted)" }}>Reg. {org.fcra}</p>
            </div>
            <div className="card" style={{ padding: "1.5rem", textAlign: "center" }}>
              <div style={{ fontSize: "2rem" }}>📄</div>
              <h3>Annual Reports</h3>
              <p style={{ color: "var(--avf-muted)" }}>
                <Link to="/news#reports">View financial transparency →</Link>
              </p>
            </div>
          </div>

          <div className="section-head" style={{ marginTop: "3rem" }}>
            <span className="eyebrow">Our supporters</span>
            <h2>Endorsed by leaders and institutions</h2>
          </div>
          <div className="grid grid--3">
            {partners.map((p) => (
              <div
                className="card"
                key={p}
                style={{ padding: "1.25rem", fontWeight: 700 }}
              >
                🤝 {p}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
