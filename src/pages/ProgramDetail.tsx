import { Link, useParams } from "react-router-dom";
import { PageHeader } from "../components/PageHeader";
import { NotFound } from "./NotFound";
import { programs, stories, posts } from "../data/content";

export function ProgramDetail() {
  const { slug } = useParams();
  const program = programs.find((p) => p.slug === slug);

  if (!program) return <NotFound />;

  // PRG-02 — surface a related success story + PRG-06 related news.
  const relatedStory = stories.find((s) =>
    program.category === "Education"
      ? s.program === "Education" || s.program === "Science"
      : s.program.toLowerCase().includes("women")
        ? program.category === "Empowerment"
        : false
  );
  const relatedNews = posts.slice(0, 2);

  return (
    <>
      <PageHeader
        title={program.name}
        intro={program.short}
        crumbs={[
          { label: "Home", to: "/" },
          { label: "Programs", to: "/programs" },
          { label: program.name },
        ]}
      />

      <section className="section">
        <div className="container split">
          <div className="prose">
            <span className="badge">{program.category}</span>
            <h2 style={{ marginTop: "0.8rem" }}>Overview</h2>
            <p>{program.overview}</p>
            <ul className="fact-list">
              {program.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </div>
          <div>
            <div
              className="media-block"
              style={{ background: program.color }}
              aria-hidden="true"
            >
              {program.icon}
            </div>
            {/* PRG-02 — key facts */}
            <div className="card" style={{ padding: "1.5rem", marginTop: "1.5rem" }}>
              <h3>Key facts</h3>
              <dl style={{ margin: 0 }}>
                {program.facts.map((f) => (
                  <div
                    key={f.label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "0.5rem 0",
                      borderBottom: "1px solid var(--avf-line)",
                    }}
                  >
                    <dt style={{ color: "var(--avf-muted)" }}>{f.label}</dt>
                    <dd style={{ margin: 0, fontWeight: 700 }}>{f.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* PRG-03 — location note for AVLC */}
      {program.slug === "avlc" && (
        <section className="section section--alt">
          <div className="container">
            <div className="section-head section-head--left">
              <span className="eyebrow">Find us</span>
              <h2>Our five AVLC centres</h2>
            </div>
            <div className="grid grid--3">
              {[
                "Nandanavanam — LB Nagar",
                "Singareni Colony — Dilshuknagar",
                "Borabanda — Jubilee Hills",
                "Rasoolpura — Secunderabad",
                "Medchal",
              ].map((loc) => (
                <div className="card" key={loc} style={{ padding: "1.25rem" }}>
                  📍 <strong>{loc}</strong>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PRG-02 — related success story */}
      {relatedStory && (
        <section className="section">
          <div className="container">
            <div className="section-head section-head--left">
              <span className="eyebrow">AVF Stars</span>
              <h2>A story from this programme</h2>
            </div>
            <article className="card story-card">
              <div
                className="story-card__avatar"
                style={{ background: relatedStory.color }}
                aria-hidden="true"
              >
                {relatedStory.initials}
              </div>
              <div>
                <h3>{relatedStory.headline}</h3>
                <blockquote>"{relatedStory.body}"</blockquote>
                <p style={{ color: "var(--avf-muted)" }}>
                  — {relatedStory.name}, {relatedStory.year}
                </p>
              </div>
            </article>
          </div>
        </section>
      )}

      {/* PRG-06 — related news */}
      <section className="section section--alt">
        <div className="container">
          <div className="section-head section-head--left">
            <span className="eyebrow">Related news</span>
            <h2>Updates from the field</h2>
          </div>
          <div className="grid grid--2">
            {relatedNews.map((n) => (
              <article className="card" key={n.id} style={{ padding: "1.5rem" }}>
                <div className="news-card__meta">
                  <span className="badge">{n.category}</span> · {n.date}
                </div>
                <h3>{n.title}</h3>
                <p style={{ color: "var(--avf-muted)" }}>{n.excerpt}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PRG-05 — Get Involved CTA on every programme page */}
      <section className="section">
        <div className="container">
          <div className="cta-band">
            <h2>Support {program.name}</h2>
            <p>Your contribution keeps this programme running and growing.</p>
            <div className="cta-band__btns">
              <Link
                to="/donate"
                className="btn btn--lg"
                style={{ background: "#fff", color: "var(--avf-orange-600)" }}
              >
                ❤ Donate
              </Link>
              <Link to="/get-involved" className="btn btn--on-dark btn--lg">
                Volunteer
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
