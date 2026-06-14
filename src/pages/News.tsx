import { useState } from "react";
import { PageHeader } from "../components/PageHeader";
import {
  posts as fallbackPosts,
  events as fallbackEvents,
  reports,
  type Post,
  type AvfEvent,
} from "../data/content";
import { api } from "../lib/api";
import { useContent } from "../lib/useContent";

const categories: ("All" | Post["category"])[] = [
  "All",
  "News",
  "Event Recap",
  "Success Story",
  "Announcement",
];

export function News() {
  const posts = useContent<Post[]>(api.getPosts, fallbackPosts);
  const events = useContent<AvfEvent[]>(api.getEvents, fallbackEvents);
  const [cat, setCat] = useState<(typeof categories)[number]>("All");
  const visible = cat === "All" ? posts : posts.filter((p) => p.category === cat);

  return (
    <>
      <PageHeader
        title="News & Events"
        intro="The latest from the field — announcements, success stories, upcoming events and our annual reports."
        crumbs={[{ label: "Home", to: "/" }, { label: "News & Events" }]}
      />

      {/* NEWS-02 — event calendar */}
      <section className="section">
        <div className="container">
          <div className="section-head section-head--left">
            <span className="eyebrow">Upcoming</span>
            <h2>Event calendar</h2>
          </div>
          <div className="grid" style={{ gap: "1rem" }}>
            {events.map((ev) => (
              <article className="card event-item" key={ev.id}>
                <div className="event-item__date" aria-hidden="true">
                  <div className="event-item__day">{ev.day}</div>
                  <div className="event-item__mon">{ev.month}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.4rem" }}>
                    <span className="badge">{ev.mode}</span>
                    <span style={{ color: "var(--avf-muted)", fontSize: "0.85rem" }}>
                      📅 {ev.date} · 📍 {ev.venue}
                    </span>
                  </div>
                  <h3 style={{ fontSize: "1.15rem", margin: "0 0 0.3rem" }}>
                    {ev.title}
                  </h3>
                  <p style={{ color: "var(--avf-ink-soft)", margin: 0 }}>
                    {ev.description}
                  </p>
                </div>
                {/* NEWS-03 — add to calendar */}
                <button className="btn btn--ghost btn--sm" type="button">
                  + Add to Calendar
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* NEWS-01 — blog / news with category filter */}
      <section className="section section--alt">
        <div className="container">
          <div className="section-head section-head--left">
            <span className="eyebrow">Newsroom</span>
            <h2>Latest news &amp; stories</h2>
          </div>

          <div className="gallery-filters" style={{ justifyContent: "flex-start" }} role="tablist" aria-label="Filter news by category">
            {categories.map((c) => (
              <button
                key={c}
                role="tab"
                aria-selected={cat === c}
                className={`gallery-filter${cat === c ? " is-active" : ""}`}
                onClick={() => setCat(c)}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="grid grid--2" data-testid="news-grid">
            {visible.map((n) => (
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
                  <a href="#" className="program-card__link">
                    Read more →
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* NEWS-04 — annual reports */}
      <section className="section" id="reports">
        <div className="container">
          <div className="section-head section-head--left">
            <span className="eyebrow">Financial transparency</span>
            <h2>Annual reports</h2>
            <p>Download our impact and financial reports.</p>
          </div>
          <div className="grid grid--3">
            {reports.map((r) => (
              <a
                href="#"
                className="card card--hover"
                key={r.year}
                style={{ padding: "1.5rem", display: "flex", gap: "1rem", alignItems: "center" }}
              >
                <span style={{ fontSize: "2rem" }}>📄</span>
                <span>
                  <strong style={{ display: "block", color: "var(--avf-navy-800)" }}>
                    {r.label} {r.year}
                  </strong>
                  <span style={{ color: "var(--avf-muted)", fontSize: "0.85rem" }}>
                    {r.size}
                  </span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
