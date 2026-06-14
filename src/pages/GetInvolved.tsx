import { PageHeader } from "../components/PageHeader";
import { TextField, SelectField } from "../components/Field";
import { useForm } from "../lib/useForm";
import { isEmail, isPhone, required } from "../lib/validation";
import { volunteerRoles, volunteerInterests } from "../data/content";

interface VolForm {
  name: string;
  email: string;
  phone: string;
  city: string;
  profession: string;
  availability: string;
  interest: string;
  consent: boolean;
  [key: string]: string | boolean;
}

const initial: VolForm = {
  name: "",
  email: "",
  phone: "",
  city: "",
  profession: "",
  availability: "",
  interest: "",
  consent: false,
};

export function GetInvolved() {
  const { values, errors, submitted, setField, handleSubmit, reset } =
    useForm<VolForm>(
      initial,
      (v) => {
        const e: Record<string, string> = {};
        if (!required(v.name)) e.name = "Please enter your name.";
        if (!isEmail(v.email)) e.email = "Enter a valid email address.";
        if (!isPhone(v.phone)) e.phone = "Enter a valid 10-digit mobile number.";
        if (!required(v.city)) e.city = "Please enter your city.";
        if (!required(v.interest)) e.interest = "Please pick an area of interest.";
        return e;
      },
      () => {
        /* VOL-02 — server sends acknowledgement email here. */
      }
    );

  return (
    <>
      <PageHeader
        title="Get Involved"
        intro="Give your time, your skills and your heart. Volunteers are the backbone of everything we do."
        crumbs={[{ label: "Home", to: "/" }, { label: "Get Involved" }]}
      />

      {/* VOL-03 — open roles */}
      <section className="section">
        <div className="container">
          <div className="section-head section-head--left">
            <span className="eyebrow">Opportunities</span>
            <h2>Current volunteer roles</h2>
          </div>
          <div className="grid grid--2">
            {volunteerRoles.map((r) => (
              <article className="card" key={r.id} style={{ padding: "1.75rem" }}>
                <h3>{r.title}</h3>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
                  <span className="badge">📍 {r.location}</span>
                  <span className="badge badge--green">🕑 {r.commitment}</span>
                </div>
                <p style={{ color: "var(--avf-ink-soft)" }}>{r.description}</p>
                <a href="#register" className="btn btn--ghost btn--sm">
                  Express Interest
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* VOL-01 — registration form */}
      <section className="section section--alt" id="register">
        <div className="container" style={{ maxWidth: 720 }}>
          <div className="section-head">
            <span className="eyebrow">Join us</span>
            <h2>Register as a volunteer</h2>
            <p>Tell us a little about yourself and we'll be in touch.</p>
          </div>

          {submitted ? (
            <div className="form-success" style={{ textAlign: "center" }} role="status">
              <div style={{ fontSize: "2.5rem" }}>🙌</div>
              <h3>Thank you for signing up!</h3>
              <p>
                We've sent an acknowledgement to your email. Our volunteer
                coordinator will reach out about next steps.
              </p>
              <button className="btn btn--ghost" onClick={reset}>
                Register another volunteer
              </button>
            </div>
          ) : (
            <form
              className="card"
              style={{ padding: "2rem" }}
              onSubmit={handleSubmit}
              noValidate
              aria-label="Volunteer registration form"
            >
              <div className="grid grid--2">
                <TextField
                  id="vol-name"
                  label="Full name"
                  required
                  value={values.name}
                  onChange={(v) => setField("name", v)}
                  error={errors.name}
                />
                <TextField
                  id="vol-email"
                  label="Email"
                  type="email"
                  required
                  value={values.email}
                  onChange={(v) => setField("email", v)}
                  error={errors.email}
                />
                <TextField
                  id="vol-phone"
                  label="Phone"
                  type="tel"
                  required
                  value={values.phone}
                  onChange={(v) => setField("phone", v)}
                  error={errors.phone}
                />
                <TextField
                  id="vol-city"
                  label="City"
                  required
                  value={values.city}
                  onChange={(v) => setField("city", v)}
                  error={errors.city}
                />
                <TextField
                  id="vol-profession"
                  label="Profession"
                  value={values.profession}
                  onChange={(v) => setField("profession", v)}
                />
                <TextField
                  id="vol-availability"
                  label="Availability (days/hours per week)"
                  value={values.availability}
                  placeholder="e.g. weekends, 4 hrs"
                  onChange={(v) => setField("availability", v)}
                />
              </div>

              <SelectField
                id="vol-interest"
                label="Area of interest"
                required
                value={values.interest}
                options={volunteerInterests}
                onChange={(v) => setField("interest", v)}
                error={errors.interest}
              />

              {/* DPDP Act — explicit, unbundled marketing consent */}
              <div className="checkbox-row" style={{ marginBottom: "1.25rem" }}>
                <input
                  id="vol-consent"
                  type="checkbox"
                  checked={values.consent}
                  onChange={(e) => setField("consent", e.target.checked)}
                />
                <label htmlFor="vol-consent" style={{ margin: 0, fontWeight: 400 }}>
                  I'd like to receive occasional updates about AVF's events and
                  impact (optional).
                </label>
              </div>

              <button type="submit" className="btn btn--primary btn--lg btn--block">
                Register as Volunteer
              </button>
              <p className="form-note" style={{ marginTop: "0.75rem", textAlign: "center" }}>
                🔒 Protected by spam verification. We respect your privacy under
                the DPDP Act, 2023.
              </p>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
