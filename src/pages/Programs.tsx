import { Link } from "react-router-dom";
import { PageHeader } from "../components/PageHeader";
import { programs } from "../data/content";

const categories = ["Education", "Empowerment", "Community"] as const;

export function Programs() {
  return (
    <>
      <PageHeader
        title="Our Programmes"
        intro="Eight focused verticals working together for the comprehensive development of underprivileged communities."
        crumbs={[{ label: "Home", to: "/" }, { label: "Programs" }]}
      />

      {categories.map((cat) => (
        <section className="section" key={cat}>
          <div className="container">
            <div className="section-head section-head--left">
              <span className="eyebrow">{cat}</span>
              <h2>{cat} Programmes</h2>
            </div>
            <div className="grid grid--3">
              {programs
                .filter((p) => p.category === cat)
                .map((p) => (
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
                      <h3>{p.name}</h3>
                      <p>{p.short}</p>
                      <span className="program-card__link">Learn more →</span>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
