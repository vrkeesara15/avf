import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { PageHeader } from "../components/PageHeader";
import { donationTiers, org } from "../data/content";
import { formatNumber } from "../components/ImpactCounter";
import { TextField } from "../components/Field";
import { isEmail, isPhone, isPAN, required, type Errors } from "../lib/validation";
import { api, type OrderResponse } from "../lib/api";
import { openRazorpayCheckout } from "../lib/razorpay";

interface DonorForm {
  name: string;
  email: string;
  phone: string;
  pan: string;
  city: string;
  organisation: string;
}

const empty: DonorForm = {
  name: "",
  email: "",
  phone: "",
  pan: "",
  city: "",
  organisation: "",
};

type Frequency = "one-time" | "monthly" | "annual";

export function Donate() {
  const [params] = useSearchParams();
  const initialAmount = Number(params.get("amount")) || donationTiers[1].amount;

  const [amount, setAmount] = useState<number>(initialAmount);
  const [custom, setCustom] = useState("");
  const [frequency, setFrequency] = useState<Frequency>("one-time");
  const [form, setForm] = useState<DonorForm>(empty);
  const [errors, setErrors] = useState<Errors<DonorForm> & { amount?: string }>(
    {}
  );
  const [receipt, setReceipt] = useState<null | {
    id: string;
    amount: number;
    name: string;
  }>(null);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const selectTier = (value: number) => {
    setAmount(value);
    setCustom("");
    setErrors((e) => ({ ...e, amount: undefined }));
  };

  const onCustom = (v: string) => {
    setCustom(v);
    const n = Number(v);
    if (n > 0) setAmount(n);
    setErrors((e) => ({ ...e, amount: undefined }));
  };

  const setField = (k: keyof DonorForm, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const validate = (): typeof errors => {
    const e: typeof errors = {};
    if (!amount || amount < 1) e.amount = "Please choose or enter an amount.";
    if (!required(form.name)) e.name = "Please enter your full name.";
    if (!isEmail(form.email)) e.email = "Enter a valid email address.";
    if (!isPhone(form.phone)) e.phone = "Enter a valid 10-digit mobile number.";
    if (!isPAN(form.pan))
      e.pan = "Enter a valid PAN (e.g. ABCDE1234F) — required for your 80G receipt.";
    if (!required(form.city)) e.city = "Please enter your city.";
    return e;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const donor = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      pan: form.pan,
      city: form.city,
      organisation: form.organisation || undefined,
      marketingConsent: false,
    };

    setSubmitting(true);
    setServerError("");
    try {
      // DON-01 — create the payment order on the server.
      const order: OrderResponse = await api.createOrder(amount, frequency);

      // Obtain the payment handshake: deterministic in test mode, real
      // Razorpay checkout otherwise.
      let paymentId: string;
      let signature: string;
      if (order.testMode && order.testPaymentId && order.testSignature) {
        paymentId = order.testPaymentId;
        signature = order.testSignature;
      } else {
        const result = await openRazorpayCheckout(order, donor);
        paymentId = result.razorpay_payment_id;
        signature = result.razorpay_signature;
      }

      // DON-05/DON-06 — verify + issue the 80G receipt.
      const res = await api.verifyDonation({
        donationId: order.donationId,
        razorpay_order_id: order.orderId,
        razorpay_payment_id: paymentId,
        razorpay_signature: signature,
        donor,
      });

      setReceipt({ id: res.receiptNo, amount: res.amount, name: form.name });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setServerError(
        err instanceof Error
          ? err.message
          : "Something went wrong processing your donation. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (receipt) {
    return (
      <>
        <PageHeader
          title="Thank you for your generosity"
          crumbs={[{ label: "Home", to: "/" }, { label: "Donate" }]}
        />
        <section className="section">
          <div className="container" style={{ maxWidth: 640 }}>
            <div className="form-success" style={{ textAlign: "center" }}>
              <div style={{ fontSize: "3rem" }}>🎉</div>
              <h2>Donation successful!</h2>
              <p>
                Dear {receipt.name}, your contribution of{" "}
                <strong>₹{formatNumber(receipt.amount)}</strong>{" "}
                {frequency !== "one-time" ? `(${frequency}) ` : ""}
                will help educate and empower children across Hyderabad.
              </p>
              <p>
                An 80G-compliant tax receipt
                {" "}
                <strong>(#{receipt.id})</strong> has been emailed to{" "}
                <strong>{form.email || "your inbox"}</strong> within 2 minutes.
              </p>
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  justifyContent: "center",
                  marginTop: "1.5rem",
                  flexWrap: "wrap",
                }}
              >
                <Link to="/" className="btn btn--primary">
                  Back to Home
                </Link>
                <Link to="/impact" className="btn btn--ghost">
                  See your impact
                </Link>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Make a Donation"
        intro="Your gift directly funds free education, skill training and relief for those who need it most. Secure payments via UPI, card and net banking."
        crumbs={[{ label: "Home", to: "/" }, { label: "Donate" }]}
      />

      <section className="section">
        <div className="container" style={{ maxWidth: 860 }}>
          {/* Social proof — DON-10 */}
          <p
            className="badge badge--green"
            style={{ fontSize: "0.9rem", padding: "0.5rem 1rem" }}
          >
            🔥 ₹{formatNumber(184500)} raised this month from 312 donors
          </p>

          <form onSubmit={onSubmit} noValidate aria-label="Donation form">
            {/* Frequency — DON-04 */}
            <h3 style={{ marginTop: "1.5rem" }}>1. Choose a frequency</h3>
            <div role="radiogroup" aria-label="Donation frequency" style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              {(["one-time", "monthly", "annual"] as Frequency[]).map((f) => (
                <button
                  type="button"
                  key={f}
                  role="radio"
                  aria-checked={frequency === f}
                  className={`tier${frequency === f ? " is-selected" : ""}`}
                  style={{ flex: "1 1 140px", textAlign: "center", textTransform: "capitalize" }}
                  onClick={() => setFrequency(f)}
                >
                  {f.replace("-", " ")}
                </button>
              ))}
            </div>

            {/* Tiers — DON-02 / DON-03 */}
            <h3 style={{ marginTop: "2rem" }}>2. Select an amount</h3>
            <div className="tier-grid" role="radiogroup" aria-label="Donation amount">
              {donationTiers.map((t) => (
                <button
                  type="button"
                  key={t.id}
                  role="radio"
                  aria-checked={amount === t.amount && custom === ""}
                  className={`tier${
                    amount === t.amount && custom === "" ? " is-selected" : ""
                  }`}
                  onClick={() => selectTier(t.amount)}
                >
                  <span className="tier__amount">₹{formatNumber(t.amount)}</span>
                  <span className="tier__impact">{t.impact}</span>
                </button>
              ))}
            </div>

            <div style={{ maxWidth: 320, marginTop: "1.25rem" }}>
              <TextField
                id="custom-amount"
                label="Or enter a custom amount (₹)"
                type="number"
                value={custom}
                placeholder="e.g. 5000"
                onChange={onCustom}
                error={errors.amount}
              />
            </div>

            {/* Donor details — DON-05 */}
            <h3 style={{ marginTop: "1.5rem" }}>3. Your details</h3>
            <div className="grid grid--2">
              <TextField
                id="donor-name"
                label="Full name"
                required
                value={form.name}
                onChange={(v) => setField("name", v)}
                error={errors.name}
              />
              <TextField
                id="donor-email"
                label="Email"
                type="email"
                required
                value={form.email}
                onChange={(v) => setField("email", v)}
                error={errors.email}
              />
              <TextField
                id="donor-phone"
                label="Phone"
                type="tel"
                required
                value={form.phone}
                onChange={(v) => setField("phone", v)}
                error={errors.phone}
              />
              <TextField
                id="donor-pan"
                label="PAN number"
                required
                hint="Required to issue your 80G tax-exemption receipt."
                value={form.pan}
                onChange={(v) => setField("pan", v)}
                error={errors.pan}
              />
              <TextField
                id="donor-city"
                label="City"
                required
                value={form.city}
                onChange={(v) => setField("city", v)}
                error={errors.city}
              />
              <TextField
                id="donor-org"
                label="Organisation (optional)"
                value={form.organisation}
                onChange={(v) => setField("organisation", v)}
              />
            </div>

            <p className="form-note" style={{ marginTop: "1rem" }}>
              🔒 Payments are processed securely on a PCI-DSS certified gateway.
              We never store your card or UPI details. PAN is encrypted at rest
              and used only for your 80G receipt.
            </p>

            {serverError && (
              <p className="field-error" role="alert" style={{ marginTop: "1rem" }}>
                {serverError}
              </p>
            )}

            <button
              type="submit"
              className="btn btn--donate btn--lg btn--block"
              style={{ marginTop: "1.5rem" }}
              disabled={submitting}
            >
              {submitting
                ? "Processing…"
                : `❤ Donate ₹${formatNumber(amount || 0)}${
                    frequency !== "one-time" ? ` ${frequency}` : ""
                  }`}
            </button>

            <p
              className="form-note"
              style={{ textAlign: "center", marginTop: "1rem" }}
            >
              Donating from outside India?{" "}
              <Link to="/donate/overseas">Use our overseas donation page →</Link>
            </p>
          </form>

          <p className="form-note" style={{ marginTop: "2rem" }}>
            Akshaya Vidya Foundation is registered under 80G ({org.reg80G}) and
            FCRA ({org.fcra}). Donations are eligible for tax deduction under
            Section 80G of the Income Tax Act.
          </p>
        </div>
      </section>
    </>
  );
}
