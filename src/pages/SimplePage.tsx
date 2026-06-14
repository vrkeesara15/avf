import { PageHeader } from "../components/PageHeader";

interface Props {
  title: string;
  crumb: string;
  intro: string;
}

/** Lightweight legal/info pages (Privacy, Terms) — DPDP Act §8.3. */
export function SimplePage({ title, crumb, intro }: Props) {
  return (
    <>
      <PageHeader
        title={title}
        intro={intro}
        crumbs={[{ label: "Home", to: "/" }, { label: crumb }]}
      />
      <section className="section">
        <div className="container prose" style={{ maxWidth: 760 }}>
          <h2>Data we collect</h2>
          <p>
            We collect only the personal data necessary to process donations,
            volunteer registrations and inquiries — such as your name, email,
            phone, city and (for 80G receipts) your PAN.
          </p>
          <h2>How we use it</h2>
          <p>
            Your data is used solely to deliver the service you requested —
            issuing receipts, responding to inquiries, and (only with your
            explicit opt-in) sending occasional updates. We never sell your data.
          </p>
          <h2>Your rights</h2>
          <p>
            Under the Digital Personal Data Protection Act, 2023 you may request
            correction or deletion of your data at any time by emailing{" "}
            <a href="mailto:info@akshayavidya.org">info@akshayavidya.org</a>.
            PAN numbers are encrypted at rest and in transit.
          </p>
          <h2>Payment security</h2>
          <p>
            Payment information is processed exclusively on a PCI-DSS certified
            gateway and is never stored on our servers.
          </p>
          <p className="form-note">
            This is placeholder legal copy for demonstration. Final policy text
            should be reviewed by legal counsel before launch.
          </p>
        </div>
      </section>
    </>
  );
}
