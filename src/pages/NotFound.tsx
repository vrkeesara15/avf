import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <section className="section">
      <div className="container" style={{ textAlign: "center", maxWidth: 560 }}>
        <div style={{ fontSize: "4rem" }}>🔍</div>
        <h1>Page not found</h1>
        <p className="lead">
          Sorry, we couldn't find the page you were looking for. It may have
          moved or no longer exists.
        </p>
        <div
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            flexWrap: "wrap",
            marginTop: "1.5rem",
          }}
        >
          <Link to="/" className="btn btn--primary btn--lg">
            Back to Home
          </Link>
          <Link to="/donate" className="btn btn--donate btn--lg">
            ❤ Donate
          </Link>
        </div>
      </div>
    </section>
  );
}
