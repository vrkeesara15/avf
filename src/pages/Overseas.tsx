import { Link } from "react-router-dom";
import { PageHeader } from "../components/PageHeader";
import { org } from "../data/content";

export function Overseas() {
  return (
    <>
      <PageHeader
        title="Overseas / USA Donations"
        intro="Thank you for supporting AVF from abroad. Foreign contributions are received only into our FCRA-designated account, in full compliance with Indian law."
        crumbs={[
          { label: "Home", to: "/" },
          { label: "Donate", to: "/donate" },
          { label: "Overseas" },
        ]}
      />

      <section className="section">
        <div className="container split">
          <div className="prose">
            <span className="eyebrow">For our diaspora donors</span>
            <h2>How to give from outside India</h2>
            <p>
              Akshaya Vidya Foundation holds a valid FCRA registration
              (No. {org.fcra}), which allows us to legally receive foreign
              contributions. To stay compliant, all overseas donations must be
              sent via bank wire transfer to our designated FCRA account below.
            </p>
            <ul className="fact-list">
              <li>Foreign funds are received only in the FCRA-designated account</li>
              <li>You will receive an acknowledgement for your records</li>
              <li>Questions? Email <a href={`mailto:${org.altEmail}`}>{org.altEmail}</a></li>
            </ul>
            <p className="form-note">
              Note: A US 501(c)(3) tax-deductible giving channel is being
              evaluated subject to legal clearance. Until then, please use the
              wire transfer details provided.
            </p>
          </div>

          <div className="card" style={{ padding: "2rem" }}>
            <h3>FCRA Bank Wire Details</h3>
            <dl style={{ margin: 0 }}>
              {[
                ["Account name", "Akshaya Vidya Foundation (FCRA)"],
                ["Bank", "State Bank of India"],
                ["Branch", "New Delhi Main Branch"],
                ["Account no.", "XXXX XXXX 4021"],
                ["IFSC", "SBIN0000691"],
                ["SWIFT", "SBININBB104"],
                ["FCRA Reg.", org.fcra],
              ].map(([k, v]) => (
                <div
                  key={k}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "1rem",
                    padding: "0.55rem 0",
                    borderBottom: "1px solid var(--avf-line)",
                  }}
                >
                  <dt style={{ color: "var(--avf-muted)" }}>{k}</dt>
                  <dd style={{ margin: 0, fontWeight: 700, textAlign: "right" }}>
                    {v}
                  </dd>
                </div>
              ))}
            </dl>
            <div
              style={{
                marginTop: "1.5rem",
                display: "grid",
                placeItems: "center",
                gap: "0.5rem",
              }}
            >
              <div
                style={{
                  width: 120,
                  height: 120,
                  background:
                    "repeating-conic-gradient(#0f2c4d 0% 25%, #fff 0% 50%) 50% / 18px 18px",
                  borderRadius: "12px",
                }}
                aria-hidden="true"
              />
              <span style={{ color: "var(--avf-muted)", fontSize: "0.85rem" }}>
                Scan to view USD giving instructions
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container">
          <div className="cta-band">
            <h2>Donating from within India?</h2>
            <p>Use our secure online donation page for UPI, card and net banking.</p>
            <div className="cta-band__btns">
              <Link
                to="/donate"
                className="btn btn--lg"
                style={{ background: "#fff", color: "var(--avf-orange-600)" }}
              >
                ❤ Donate in INR
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
