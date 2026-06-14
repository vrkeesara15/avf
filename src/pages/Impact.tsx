import { useMemo, useState } from "react";
import { PageHeader } from "../components/PageHeader";
import { ImpactCounter } from "../components/ImpactCounter";
import {
  metrics as fallbackMetrics,
  stories as fallbackStories,
  testimonials as fallbackTestimonials,
  type Metric,
  type Story,
  type Testimonial,
} from "../data/content";
import { api } from "../lib/api";
import { useContent } from "../lib/useContent";

export function Impact() {
  const metrics = useContent<Metric[]>(api.getMetrics, fallbackMetrics);
  const stories = useContent<Story[]>(api.getStories, fallbackStories);
  const testimonials = useContent<Testimonial[]>(
    api.getTestimonials,
    fallbackTestimonials
  );
  // IMP-04 — filter AVF Stars by programme vertical.
  const storyFilters = useMemo(
    () => ["All", ...Array.from(new Set(stories.map((s) => s.program)))],
    [stories]
  );
  const [filter, setFilter] = useState("All");

  const visibleStories =
    filter === "All" ? stories : stories.filter((s) => s.program === filter);

  return (
    <>
      <PageHeader
        title="Our Impact"
        intro="Numbers tell part of the story. Behind every metric is a child, a family and a community whose future changed."
        crumbs={[{ label: "Home", to: "/" }, { label: "Impact" }]}
      />

      {/* IMP-01 — impact metrics */}
      <section className="section section--navy">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">By the numbers</span>
            <h2>Cumulative impact since 2013</h2>
          </div>
          <div className="grid grid--4">
            {metrics.map((m) => (
              <ImpactCounter key={m.id} metric={m} dark />
            ))}
          </div>
        </div>
      </section>

      {/* IMP-03 / IMP-04 — AVF Stars */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">AVF Stars</span>
            <h2>Stories of transformation</h2>
            <p>Browse real beneficiary journeys by programme.</p>
          </div>

          <div className="gallery-filters" role="tablist" aria-label="Filter stories by programme">
            {storyFilters.map((f) => (
              <button
                key={f}
                role="tab"
                aria-selected={filter === f}
                className={`gallery-filter${filter === f ? " is-active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="grid grid--2" data-testid="stories-grid">
            {visibleStories.map((s) => (
              <article className="card" key={s.id} style={{ padding: "1.75rem" }}>
                <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "1rem" }}>
                  <span
                    className="quote__chip"
                    style={{ background: s.color, width: 56, height: 56, fontSize: "1.4rem" }}
                    aria-hidden="true"
                  >
                    {s.initials}
                  </span>
                  <div>
                    <span className="badge badge--orange">{s.program}</span>
                    <h3 style={{ margin: "0.4rem 0 0" }}>{s.name}</h3>
                  </div>
                </div>
                <h3 style={{ fontSize: "1.15rem" }}>{s.headline}</h3>
                <p style={{ color: "var(--avf-ink-soft)" }}>{s.body}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "var(--avf-muted)", fontSize: "0.9rem" }}>
                    {s.year}
                  </span>
                  {/* IMP-06 — social sharing */}
                  <span style={{ display: "flex", gap: "0.5rem" }} aria-label="Share this story">
                    <a href="https://facebook.com" aria-label="Share on Facebook">f</a>
                    <a href="https://twitter.com" aria-label="Share on Twitter">𝕏</a>
                    <a href="https://linkedin.com" aria-label="Share on LinkedIn">in</a>
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* IMP-05 — testimonials */}
      <section className="section section--alt">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Voices</span>
            <h2>Testimonials</h2>
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
    </>
  );
}
