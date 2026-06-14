import { PageHeader } from "../components/PageHeader";
import { TextField, TextAreaField } from "../components/Field";
import { useForm } from "../lib/useForm";
import { isEmail, isPhone, required } from "../lib/validation";
import { org } from "../data/content";

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
  [key: string]: string | boolean;
}

interface PartnerForm {
  orgName: string;
  contact: string;
  designation: string;
  phone: string;
  email: string;
  nature: string;
  [key: string]: string | boolean;
}

export function Contact() {
  // CON-01 — general inquiry form
  const contact = useForm<ContactForm>(
    { name: "", email: "", subject: "", message: "" },
    (v) => {
      const e: Record<string, string> = {};
      if (!required(v.name)) e.name = "Please enter your name.";
      if (!isEmail(v.email)) e.email = "Enter a valid email address.";
      if (!required(v.subject)) e.subject = "Please add a subject.";
      if (!required(v.message)) e.message = "Please enter a message.";
      return e;
    },
    () => {}
  );

  // CON-03 — CSR / corporate partner form
  const partner = useForm<PartnerForm>(
    { orgName: "", contact: "", designation: "", phone: "", email: "", nature: "" },
    (v) => {
      const e: Record<string, string> = {};
      if (!required(v.orgName)) e.orgName = "Please enter your organisation.";
      if (!required(v.contact)) e.contact = "Please enter a contact person.";
      if (!isPhone(v.phone)) e.phone = "Enter a valid 10-digit mobile number.";
      if (!isEmail(v.email)) e.email = "Enter a valid email address.";
      if (!required(v.nature)) e.nature = "Tell us about the partnership.";
      return e;
    },
    () => {}
  );

  return (
    <>
      <PageHeader
        title="Contact Us"
        intro="We'd love to hear from you — whether you're a donor, volunteer, journalist or potential partner."
        crumbs={[{ label: "Home", to: "/" }, { label: "Contact" }]}
      />

      <section className="section">
        <div className="container split">
          {/* Contact details + map */}
          <div>
            <span className="eyebrow">Reach us</span>
            <h2>Get in touch</h2>
            <div className="card" style={{ padding: "1.5rem", marginBottom: "1.5rem" }}>
              <p style={{ margin: 0 }}>
                <strong>📍 Address</strong>
                <br />
                {org.address}
              </p>
            </div>
            <div className="card" style={{ padding: "1.5rem", marginBottom: "1.5rem" }}>
              <p style={{ margin: 0 }}>
                <strong>📞 Phone</strong>
                <br />
                <a href={`tel:${org.phone.replace(/\s/g, "")}`}>{org.phone}</a>
              </p>
              <p style={{ margin: "1rem 0 0" }}>
                <strong>✉️ Email</strong>
                <br />
                <a href={`mailto:${org.email}`}>{org.email}</a>
                <br />
                <a href={`mailto:${org.altEmail}`}>{org.altEmail}</a>
              </p>
            </div>
            {/* CON-01 — embedded map placeholder */}
            <div
              className="media-block"
              style={{
                background:
                  "linear-gradient(135deg,#2e6fb5,#1b4f8a)",
                fontSize: "2.5rem",
              }}
              aria-label="Map showing AVF location in Hyderabad"
              role="img"
            >
              🗺️
            </div>
          </div>

          {/* General inquiry form */}
          <div>
            <span className="eyebrow">Inquiry</span>
            <h2>Send us a message</h2>
            {contact.submitted ? (
              <div className="form-success" role="status">
                ✅ Thanks for reaching out! We'll reply to your email within one
                working day.
              </div>
            ) : (
              <form
                className="card"
                style={{ padding: "2rem" }}
                onSubmit={contact.handleSubmit}
                noValidate
                aria-label="Contact inquiry form"
              >
                <TextField
                  id="contact-name"
                  label="Name"
                  required
                  value={contact.values.name}
                  onChange={(v) => contact.setField("name", v)}
                  error={contact.errors.name}
                />
                <TextField
                  id="contact-email"
                  label="Email"
                  type="email"
                  required
                  value={contact.values.email}
                  onChange={(v) => contact.setField("email", v)}
                  error={contact.errors.email}
                />
                <TextField
                  id="contact-subject"
                  label="Subject"
                  required
                  value={contact.values.subject}
                  onChange={(v) => contact.setField("subject", v)}
                  error={contact.errors.subject}
                />
                <TextAreaField
                  id="contact-message"
                  label="Message"
                  required
                  value={contact.values.message}
                  onChange={(v) => contact.setField("message", v)}
                  error={contact.errors.message}
                />
                <div className="checkbox-row" style={{ marginBottom: "1rem" }}>
                  <input id="contact-captcha" type="checkbox" required />
                  <label htmlFor="contact-captcha" style={{ margin: 0, fontWeight: 400 }}>
                    I'm not a robot 🤖
                  </label>
                </div>
                <button type="submit" className="btn btn--primary btn--block">
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* CON-03 — Partner With Us */}
      <section className="section section--alt" id="partner">
        <div className="container" style={{ maxWidth: 760 }}>
          <div className="section-head">
            <span className="eyebrow">For corporates</span>
            <h2>Partner With Us (CSR)</h2>
            <p>
              Looking for a credible, transparent NGO to partner with? Let's
              explore how your organisation can create lasting impact.
            </p>
          </div>

          {partner.submitted ? (
            <div className="form-success" role="status" style={{ textAlign: "center" }}>
              🤝 Thank you! Our partnerships team will be in touch shortly to
              discuss next steps.
            </div>
          ) : (
            <form
              className="card"
              style={{ padding: "2rem" }}
              onSubmit={partner.handleSubmit}
              noValidate
              aria-label="CSR partnership form"
            >
              <div className="grid grid--2">
                <TextField
                  id="partner-org"
                  label="Organisation name"
                  required
                  value={partner.values.orgName}
                  onChange={(v) => partner.setField("orgName", v)}
                  error={partner.errors.orgName}
                />
                <TextField
                  id="partner-contact"
                  label="Contact person"
                  required
                  value={partner.values.contact}
                  onChange={(v) => partner.setField("contact", v)}
                  error={partner.errors.contact}
                />
                <TextField
                  id="partner-designation"
                  label="Designation"
                  value={partner.values.designation}
                  onChange={(v) => partner.setField("designation", v)}
                />
                <TextField
                  id="partner-phone"
                  label="Phone"
                  type="tel"
                  required
                  value={partner.values.phone}
                  onChange={(v) => partner.setField("phone", v)}
                  error={partner.errors.phone}
                />
                <TextField
                  id="partner-email"
                  label="Email"
                  type="email"
                  required
                  value={partner.values.email}
                  onChange={(v) => partner.setField("email", v)}
                  error={partner.errors.email}
                />
              </div>
              <TextAreaField
                id="partner-nature"
                label="Nature of partnership"
                required
                value={partner.values.nature}
                placeholder="Tell us how you'd like to collaborate…"
                onChange={(v) => partner.setField("nature", v)}
                error={partner.errors.nature}
              />
              <button type="submit" className="btn btn--primary btn--block">
                Submit Partnership Inquiry
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
